---
title: 'Traefik mit Docker Compose installieren'
description: 'Traefik ist ein moderner Reverse Proxy, perfekt für containerisierte Umgebungen. Automatische Service-Erkennung & einfache Konfiguration.'
published: 2024-12-17
slug: traefik
tags: [Reverse Proxy, Traefik, Selfhosted]
category: Homelab
cover: /images/posts/traefik.png
draft: false
---

## 1. Was ist ein Reverse Proxy, und warum Traefik?

Als Reverse Proxy nutze ich gerne Traefik. Es sticht besonders hervor, da es speziell für dynamische, containerisierte Umgebungen wie Docker entwickelt wurde. Traefik unterstützt die automatische Service-Erkennung und ist einfach zu konfigurieren.

Ein Reverse Proxy fungiert als Vermittler zwischen Clients (z. B. Webbrowsern) und Servern. Er leitet Anfragen der Clients an die richtigen Server weiter, verwaltet Lastverteilung, sichert die Kommunikation mit SSL/TLS

---

## 2. Voraussetzungen

Bevor wir starten, stellt sicher, dass folgende Voraussetzungen erfüllt sind:

- [Docker & Docker Compose v2](/posts/server-setup#5-docker-und-docker-compose)
- [Basic Server Setup](/posts/server-setup)

---

## 3. Projektverzeichnis erstellen

Beginnen wir damit, ein Projektverzeichnis zu erstellen, in dem alle Konfigurationsdateien liegen:

```bash
mkdir /opt/containers/traefik/config
cd /opt/containers/traefik
```

---

## 4. `docker-compose.yaml` erstellen

Erstellt eine neue Datei namens `docker-compose.yaml` mit folgendem Inhalt:

```shell
nano docker-compose.yaml
```

```yaml title="docker-compose.yaml"
---
services:
  traefik:
    image: docker.io/library/traefik:v3.2.3
    container_name: traefik
    ports:
      - 80:80
      - 443:443
      # --> (Optional) aktiviere dashboard, don't do in production
      - 8080:8080
      # <--
    volumes:
      - /run/docker.sock:/run/docker.sock:ro
      - ./config/traefik.yaml:/etc/traefik/traefik.yaml:ro
      - ./data/certs/:/var/traefik/certs/:rw
      - ./config/conf.d/:/etc/traefik/conf.d/:ro
    environment:
      - CF_DNS_API_TOKEN=${CF_DNS_API_TOKEN} 
    networks:
      - frontend
    restart: unless-stopped
networks:
  frontend:
    external: true 
```

Diese Datei definiert den Traefik-Service und seine Konfiguration. Die **Docker-Socket**-Verbindung erlaubt Traefik, automatisch Dienste zu erkennen, die mit Docker laufen.

---

## 5. Netzwerk erstellen

Traefik benötigt ein Docker-Netzwerk, um mit anderen Diensten zu kommunizieren. Erstellt das Netzwerk mit folgendem Befehl:

```bash
docker network create frontend
```

---

## 6. traefik.yaml erstellen

```shell
nano config/traefik.yaml
```

```yaml title="traefik.yaml"
global:
  checkNewVersion: false
  sendAnonymousUsage: false
# --> (Optional) aktiviere API und Dashboard hier, don't do in production
#api:
#  dashboard: true
#  insecure: true
# --> (Optional) Zum Testen kannst du die Kommentierung entfernen.
entryPoints:
  web:
    address: :80
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
  websecure:
    address: :443

certificatesResolvers:
  cloudflare:
    acme:
      email: deine@mail.com  # <-- deine cloudflare mail adresse
      storage: /var/traefik/certs/cloudflare-acme.json
      caServer: "https://acme-v02.api.letsencrypt.org/directory"
      dnsChallenge:
        provider: cloudflare 
        resolvers:
          - "1.1.1.1:53"
          - "8.8.8.8:53"


providers:
  docker:
    exposedByDefault: false 
  file:
    directory: /etc/traefik
    watch: true
```

---

## 7. .env anlegen 

```shell
nano /opt/containers/traefik/.env
```

```env title=".env"
CF_DNS_API_TOKEN = 'cloudflare api token'
```

Für das API-Token benötigt ihr einen kostenlosen Cloudflare-Account. Zudem müsst ihr entweder die Nameserver von Cloudflare verwenden, die komplette Domain von Cloudflare verwalten lassen oder die Domain direkt bei Cloudflare registrieren.

Das API-Token benötigt die Berechtigung `Zone > DNS > Edit`.

## 8. Traefik starten

Startet Traefik mit dem Befehl:

```bash title="im traefik Verzeichnis /opt/containers/traefik"
docker-compose up -d
```

Nach wenigen Sekunden sollte Traefik laufen. Ihr könnt das Dashboard über `http://<eure-ip>:8080` erreichen. (Das Dashboard ist in dieser Konfiguration nicht gesichert und sollte in der Produktion deaktiviert oder geschützt werden.)

---

## 9. Setup testen

Wir erstellen einen kleinen Container um das ganze Setup zu testen.

```shell
mkdir /opt/containers/whoami && nano /opt/containers/whoami/compose.yaml
```

Hier kopiert ihr folgendes rein:

```yaml
---
services:
  whoami:
    image: traefik/whoami
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.whoami.entrypoints=websecure"
      - "traefik.http.routers.whoami.rule=Host(`whoami.deinedomain.de`)"
      - "traefik.http.routers.whoami.tls=true"
      - "traefik.http.routers.whoami.tls.certresolver=cloudflare"
      - "traefik.http.routers.whoami.service=whoami"
      - "traefik.http.services.whoami.loadbalancer.server.port=80"
      - "traefik.docker.network=frontend"
    networks:
      - frontend
networks:
  frontend:
    external: true
```
Startet den Container mit:

```shell
docker compose up
```

Wartet 1–2 Minuten und öffnet dann eure Domain whoami.domain.de. Diese sollte nun mit einem SSL-Zertifikat ausgestattet sein und euch den folgenden Output anzeigen:

```shell
Hostname: 7a60cd54469f
IP: 127.0.0.1
IP: ::1
IP: 172.18.0.4
RemoteAddr: 172.18.0.3:57224
GET / HTTP/1.1
Host: whoami.test.bla.de
```
Jetzt könnt ihr den Container mit `CTRL+C` beenden und den Ordner löschen

```shell
rm -rf /opt/containers/whoami
```