---
title: 'CrowdSec mit Traefik installieren und konfigurieren'
description: 'CrowdSec ist eine moderne Security-Engine mit Community-basierter Threat Intelligence.'
published: 2025-07-05
slug: crowdsec-traefik
tags: [Security, CrowdSec, Traefik, Selfhosted]
category: Security
cover: /images/posts/crowdsec.png
draft: false
---

## Was ist CrowdSec und warum brauchen wir es?

CrowdSec ist eine moderne, Open-Source Security-Engine, die speziell für dynamische Umgebungen entwickelt wurde. Es analysiert Logs in Echtzeit, erkennt verdächtige Aktivitäten und teilt Bedrohungsdaten mit der Community.

Im Gegensatz zu traditionellen Fail2Ban-Lösungen bietet CrowdSec:
- **Community Intelligence**: Profitiert von weltweit geteilten Bedrohungsdaten
- **Verhaltensanalyse**: Erkennt komplexe Angriffsmuster, nicht nur einfache Brute-Force-Attacken
- **Multi-Layer-Schutz**: Blockt auf Anwendungs- und Netzwerkebene
- **Cloud-native**: Perfekt für containerisierte Umgebungen

---

## Voraussetzungen

Bevor wir starten, stellt sicher, dass folgende Voraussetzungen erfüllt sind:

- [Docker & Docker Compose v2](/posts/server-setup#5-docker-und-docker-compose)
- [Traefik bereits installiert](/posts/traefik)

---

## Traefik für Logging konfigurieren

Zuerst müssen wir sicherstellen, dass Traefik ordentlich loggt. CrowdSec benötigt Zugriff auf die Access-Logs.


```bash
nano /opt/containers/traefik/config/traefik.yaml
```

Fügt diese Zeilen zu eurer `traefik.yaml` hinzu:

```yaml title="traefik.yaml"
# Logging-Konfiguration für CrowdSec
log:
  level: INFO
  filePath: /var/log/traefik/traefik.log

accessLog:
  filePath: /var/log/traefik/access.log
```

### docker-compose.yaml anpassen

Erweitert euren Traefik-Container um Log-Volumes:

```bash
nano /opt/containers/traefik/docker-compose.yaml
```

Fügt diese Zeile zu den Volumes hinzu:

```yaml title="docker-compose.yaml"
services:
  traefik:
    # ...existing configuration...
    volumes:
      - /run/docker.sock:/run/docker.sock:ro
      - ./config/traefik.yaml:/etc/traefik/traefik.yaml:ro
      - ./data/certs/:/var/traefik/certs/:rw
      - ./config/conf.d/:/etc/traefik/conf.d/:ro
      - ./logs/:/var/log/traefik:rw  # <-- Diese Zeile hinzufügen
```

### Log-Verzeichnis erstellen und Traefik neustarten

```bash
mkdir -p /opt/containers/traefik/logs

# Traefik neustarten
cd /opt/containers/traefik
docker compose down && docker compose up -d
```

Prüft, ob die Logs erstellt werden:

```bash
ls -la /opt/containers/traefik/logs/
tail -f /opt/containers/traefik/logs/access.log
```

---

## Logrotate für Traefik einrichten

Da Traefik-Logs schnell groß werden können, richten wir Logrotate ein:

```bash
sudo nano /etc/logrotate.d/traefik
```

```yaml title="/etc/logrotate.d/traefik"
/opt/containers/traefik/logs/*.log {
    # Rotation bei 10MB
    size 10M
    
    # 7 rotierte Dateien aufbewahren
    rotate 7
    
    # Neue Dateien mit diesen Berechtigungen erstellen
    create 644 root root
    
    # Nicht rotieren wenn Datei leer
    notifempty
    
    # Kein Fehler wenn Datei fehlt
    missingok
    
    # Komprimierung aktivieren
    compress
    delaycompress
    
    # Datum zu rotiertem Dateinamen hinzufügen
    dateext
    dateformat -%Y%m%d-%s
    
    # copytruncate für Docker-Container
    copytruncate
    
    postrotate
        # Signal an Traefik senden um Logs neu zu öffnen
        /usr/bin/docker kill --signal="USR1" traefik 2>/dev/null || true
    endscript
}
```

Logrotate testen:

```bash
sudo logrotate -d /etc/logrotate.d/traefik
```

---

## CrowdSec-Verzeichnisstruktur erstellen

Erstellt die benötigten Verzeichnisse für CrowdSec:

```bash
# CrowdSec-Verzeichnis erstellen
mkdir -p /opt/containers/crowdsec
cd /opt/containers/crowdsec

# Unterverzeichnisse für persistente Daten
mkdir -p crowdsec/db
mkdir -p crowdsec/config
```

---

## CrowdSec-Konfigurationsdateien erstellen

### acquis.yaml erstellen

Diese Datei teilt CrowdSec mit, welche Log-Dateien überwacht werden sollen:

```bash
nano /opt/containers/crowdsec/acquis.yaml
```

```yaml
filenames:
  - /var/log/traefik/access.log
labels:
  type: traefik
```

### compose.yaml erstellen

Dies ist die Docker Compose-Hauptkonfiguration:

```bash
nano /opt/containers/crowdsec/compose.yaml
```

```yaml
services:
  crowdsec:
    image: crowdsecurity/crowdsec:latest
    container_name: crowdsec
    environment:
      GID: "${GID-1000}"
      COLLECTIONS: "crowdsecurity/linux crowdsecurity/traefik"
    volumes:
      - /opt/containers/crowdsec/acquis.yaml:/etc/crowdsec/acquis.yaml
      - ./crowdsec/db:/var/lib/crowdsec/data/
      - ./crowdsec/config:/etc/crowdsec/
      - /opt/containers/traefik/logs:/var/log/traefik/:ro
    networks:
      - frontend
    security_opt:
      - no-new-privileges:true
    restart: unless-stopped

  bouncer-traefik:
    image: docker.io/fbonalair/traefik-crowdsec-bouncer:latest
    container_name: bouncer-traefik
    environment:
      # Wird nach der Registrierung aktualisiert
      CROWDSEC_BOUNCER_API_KEY: PLACEHOLDER_API_KEY
      CROWDSEC_AGENT_HOST: crowdsec:8080
    networks:
      - frontend
    depends_on:
      - crowdsec
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
networks:
  frontend:
    external: true
```

---

## CrowdSec starten (ohne Bouncer)

Startet zunächst nur CrowdSec, um den Bouncer zu registrieren:

```bash
cd /opt/containers/crowdsec
docker compose up -d crowdsec
```

Wartet, bis CrowdSec vollständig gestartet ist:

```bash
sleep 10
docker logs crowdsec --tail 20
```

---

## Bouncer registrieren

Generiert einen API-Schlüssel für den Traefik-Bouncer:

```bash
# Bouncer registrieren und API-Schlüssel erhalten
API_KEY=$(docker exec crowdsec cscli bouncers add bouncer-traefik | grep "API key" -A1 | tail -1 | awk '{print $1}')
echo "Generierter API-Schlüssel: $API_KEY"

# compose.yaml mit echtem API-Schlüssel aktualisieren
sed -i "s/PLACEHOLDER_API_KEY/$API_KEY/g" compose.yaml
```

Bouncer-Registrierung überprüfen:

```bash
docker exec crowdsec cscli bouncers list
```

---

## Traefik-Middleware konfigurieren

CrowdSec-Middleware zu dynamischer Konfiguration hinzufügen

Bearbeitet eure Traefik-Konfiguration:

```bash
# CrowdSec-Middleware hinzufügen
nano /opt/containers/traefik/config/conf.d/dynamic_conf.yml
```

Fügt diese Middleware-Konfiguration hinzu:

```yaml title="dynamic_conf.yml"
http:
  middlewares:
    # CrowdSec Bouncer Middleware
    crowdsec-bouncer:
      forwardauth:
        address: http://bouncer-traefik:8080/api/v1/forwardAuth
        trustForwardHeader: true
        authResponseHeaders:
          - X-Crowdsec-Decision
    
    # ...eure anderen Middlewares...
```

---

## Komplettes System starten

Startet jetzt CrowdSec und den Bouncer:

```bash
cd /opt/containers/crowdsec
docker compose up -d
```

Überprüft, ob alle Services laufen:

```bash
docker compose ps
```

---

### CrowdSec-Entscheidungssystem testen

```bash
# Test-Sperre erstellen
docker exec crowdsec cscli decisions add --ip 1.2.3.4 --duration 5m --reason "Test-Sperre"

# Überprüfen, ob die Entscheidung erstellt wurde
docker exec crowdsec cscli decisions list

# Test-Entscheidung wieder löschen
docker exec crowdsec cscli decisions delete --ip 1.2.3.4
```

---

## Middleware zu bestehenden Services hinzufügen

Um bestehende Services zu schützen, fügt die CrowdSec-Middleware hinzu:

```yaml
# Beispiel: Zu einem bestehenden Service hinzufügen
labels:
  - "traefik.http.routers.meinservice.middlewares=crowdsec-bouncer@file"
``` 

---

### Nützliche Befehle

```bash
# CrowdSec-Metriken anzeigen
docker exec crowdsec cscli metrics

# Verfügbare Collections anzeigen
docker exec crowdsec cscli collections list

# Aktuelle Alerts anzeigen
docker exec crowdsec cscli alerts list --limit 5

# Entscheidungssystem testen
docker exec crowdsec cscli decisions add --ip 192.168.1.100 --duration 1m --reason "Test"
docker exec crowdsec cscli decisions list
docker exec crowdsec cscli decisions delete --ip 192.168.1.100
```

---

## Fazit

Eure CrowdSec-Integration mit Traefik ist jetzt vollständig! Das System wird:

- ✅ Traefik Access-Logs in Echtzeit überwachen
- ✅ Verdächtige Verhaltensmuster erkennen
- ✅ Automatisch bösartige IP-Adressen blockieren
- ✅ Alle Services mit der `crowdsec-bouncer@file` Middleware schützen
- ✅ Detaillierte Metriken und Alerting bereitstellen

