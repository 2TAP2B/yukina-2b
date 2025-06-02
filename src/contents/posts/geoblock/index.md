---
title: 'GeoBlock Plugin für Traefik installieren'
description: 'GeoBlock ist ein Traefik Middleware Plugin, mit dem Zugriffe basierend auf Ländern blockiert oder erlaubt werden können – ideal für zusätzliche Sicherheit bei öffentlichen Diensten.'
published: 2025-06-01
tags: ['Traefik', 'Security', 'GeoIP', 'Plugin', 'Middleware']
cover: /images/posts/traefik-geo-block.png
category: Traefik
---

## Intro

Wenn man seine selbst gehosteten Dienste über das Internet verfügbar macht, möchte man oft den Zugriff geografisch einschränken — z. B. nur aus dem eigenen Land zulassen.

Das **GeoBlock Plugin** von [Pascal Minder](https://github.com/PascalMinder/geoblock) ermöglicht genau das. Es handelt sich um eine Traefik Middleware, die den Zugriff auf bestimmte Routen oder Dienste auf Basis von IP-Geolokalisierung erlauben oder verweigern kann.

Das Plugin ist einfach zu konfigurieren, performant und unterstützt sowohl **Whitelist**- als auch **Blacklist**-Modi.

#### Versionierung
Datum | Änderung
--|--
01-06-2025 | Erste Version mit Traefik 3.0 getestet

---

## 2. Voraussetzungen

Stellt vor der Integration sicher, dass folgende Dinge vorhanden sind:

- [Traefik Setup](/posts/traefik)

---

## 3. Plugin aktivieren

In der statischen Traefik-Konfiguration (`traefik/config/traefik.yaml`) muss das Plugin aktiviert werden.

```
nano /opt/containers/traefik/config/traefik.yaml
```

```yaml title="traefik.yaml"
experimental:
  localPlugins:
    geoblock:
      moduleName: github.com/PascalMinder/geoblock
```

---

## 4. Middleware definieren

Die eigentliche Konfiguration erfolgt in der `dynamic_conf.yml`

Beispiel mit einer **Whitelist für DE**:

```
nano /opt/containers/traefik/config/conf.d/dynamic_conf.yml
```

```yaml title="dynamic.yml"
[...]

http:
  middlewares:
    geoblock-de:
      plugin:
        geoblock:
          silentStartUp: false
          allowLocalRequests: true
          logLocalRequests: false
          logAllowedRequests: true
          logApiRequests: true
          api: "https://get.geojs.io/v1/ip/country/{ip}"
          apiTimeoutMs: 750
          cacheSize: 50
          forceMonthlyUpdate: true
          allowUnknownCountries: false
          unknownCountryApiResponse: "nil"
          countries:
            - DE

[...]
```

---

## 5. Mountpoints setzen

Wir müssen nun noch das Plugin Repro in traefik rein mounten. Dafür erstellen wir einen neuen Ordner und switchen direkt in den neu erstellten ordner

```
mkdir -p /opt/containers/traefik/plugin/geoblock && cd /opt/containers/traefik/plugin/geoblock
```

Hier clonen wir einmal das Repro rein

```
git clone https://github.com/PascalMinder/geoblock.git
```

Und nun setzen wir noch das Mount Volume in traefik richtig

```
nano /opt/containers/traefik/docker-compose.yaml
```

```yaml
[...]

    volumes:
      - /run/docker.sock:/run/docker.sock:ro
      - ./config/traefik.yaml:/etc/traefik/traefik.yaml:ro
      - ./data/certs/:/var/traefik/certs/:rw
      - ./config/conf.d/:/etc/traefik/conf.d/:ro
      - ./plugin/geoblock:/plugins-local/src/github.com/PascalMinder/geoblock/ # <-- Das muss hinzugefügt werden
      - ./logs/:/var/log/traefik

[...]

```
---

## 6. Middleware zuweisen

Nun kann die Middleware bei beliebigen Routern hinzugefügt werden. Beispiel:

```yaml title="docker-compose.yml"
labels:
[...]
  - traefik.http.routers.dein-service.middlewares=geoblock-de@file
[...]
```

---

## 7. Verhalten bei Blockierung

Wird eine Anfrage aus einem nicht erlaubten Land gestellt, gibt Traefik standardmäßig den HTTP-Status **403 Forbidden** zurück.

---

## 7. Erweiterte Optionen

GeoBlock bietet auch:

- `blacklist`: Anstelle einer Whitelist können gezielt Länder gesperrt werden.
- `customResponseBody`: Definiere eine eigene Fehlermeldung.

Eine vollständige Liste aller Optionen findet sich in der [offiziellen Doku](https://github.com/PascalMinder/geoblock#configuration).

---

## 8. Fazit

Das GeoBlock-Plugin ist ein leichtgewichtiges Sicherheitsfeature, das sich hervorragend in bestehende Traefik-Setups integrieren lässt. Ich nutze das GeoBlock-Plugin bei einer Vielzahl von Diensten, die öffentlich im Netz stehen – bei denen aber klar ist, dass der Zugriff ausschließlich durch mich oder durch Freunde und Familie aus Deutschland erfolgt.
Und wenn doch mal jemand im Urlaub ist, aktiviert man einfach den VPN mit deutscher IP, und der Zugriff funktioniert weiterhin wie gewohnt.

Aus sicherheitstechnischer Sicht schließt man so eine große Menge an Bots und potenziellen Angreifern von vornherein aus – was definitiv ein zusätzliches Maß an Sicherheit bringt.

---

**Quellen:**

- https://github.com/PascalMinder/geoblock  
- https://plugins.traefik.io/plugins
