---
title: 'Pocket ID mit Docker und Traefik installieren'
description: 'Pocket ID ist ein einfacher OIDC-Anbieter, der es Benutzern ermöglicht, sich mit ihren Passkeys bei Ihren Diensten zu authentifizieren.'
published: 2025-05-27
tags: ['OIDC', 'Open-Source', 'Passkey', 'Identity-Provider', 'Pocket-ID']
cover: /images/posts/pocketid.png
category: SSO
---

## Intro 

Pocket ID ist ein einfacher OIDC-Anbieter, der es Benutzern ermöglicht, sich mit ihren Passkeys bei Ihren Diensten zu authentifizieren.

Das Ziel von Pocket ID ist es, einfach und benutzerfreundlich zu sein. Es gibt andere selbst gehostete OIDC Anbieter wie Keycloak oder Authentik, aber diese sind oft zu komplex für einfache Anwendungsfälle.

Eine Besonderheit von Pocket ID ist, dass es nur die Passkey-Authentifizierung unterstützt, was bedeutet, dass du kein Passwort benötigen. Zum Beispiel kannst du jetzt einen physischen Yubikey verwenden, um dich einfach und sicher bei all deinen selbst gehosteten Diensten anzumelden.

#### Versionierung
Datum | Änderung
--|--
19-02-2025| Initialer Release
27-05-2025| Anpassungen an Version 1.0

---

## 2. Voraussetzungen

Bevor wir starten, stellt sicher, dass folgende Voraussetzungen erfüllt sind:

- [Docker & Docker Compose v2](/posts/server-setup#5-docker-und-docker-compose)
- [Traefik Setup](/posts/traefik)

---

## 3. Ordner anlegen

Zuerst legen wir uns passende Ordner-Strukturen an.

```
mkdir -p /opt/containers/pocket-id
```

---

## 4. Compose Datei anlegen

```
nano /opt/containers/pocket-id/compose.yml
```

```yaml title="compose.yml"
services:
  pocketid:
    image: ghcr.io/pocket-id/pocket-id:latest
    container_name: pocket-id
    restart: unless-stopped
    env_file: .env
    volumes:
      - "./data:/app/data"
    healthcheck:
      test: "curl -f http://localhost:1411/healthz"
      interval: 1m30s
      timeout: 5s
      retries: 2
      start_period: 10s
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.pocket.entrypoints=websecure"
      - "traefik.http.routers.pocket.rule=Host(`pocket.deinedomain.de`)"
      - "traefik.http.routers.pocket.tls=true"
      - "traefik.http.routers.pocket.tls.certresolver=cloudflare"
      - "traefik.http.routers.pocket.service=pocket"
      - "traefik.http.services.pocket.loadbalancer.server.port=1411"
      - "traefik.docker.network=frontend"
    networks:
      - frontend
networks:
  frontend:
    external: true
```

**Noch anzupassen:**

* Eure Traefik URL =Host(`pocket.deinedomain.de`)


### 4.1 .ENV Datei anlegen

```
nano /opt/containers/pocket-id/.env
```

```yaml title=".env"

# Bitte die Domain wie oben anpassen
APP_URL=https://pocket.id
DB_CONNECTION_STRING=file:data/pocket-id.db?_pragma=journal_mode(WAL)&_pragma=busy_timeout(2500)&_txlock=immediate
PORT=1411
``` 

---

## 5. Pocket ID starten

Nun starten wir den Container mittels folgendem Befehl:

```
docker compose -f /opt/containers/pocket-id/compose.yml up -d
```

Der Container ist in wenigen Sekunden gebaut.

Ruft nun im Browser die gewählte Domain auf und dann solltet ihr folgendes sehen.

![pocket-id](./pocket-id1.png)

Für das erstellen des ersten Benutzers bzw. Passkeys geht ihr bitte auf folgende Seite

https://pocket.deinedomain.de/login/setup

Dort könnt ihr dann den ersten Benutzer anlegen

![pocket-id](./pocket-id2.png)

Folgt den Anweisungen und dann solltet ihr im Admin bereich laden.

![pocket-id](./pocket-id3.png)

Der Erstellung der OIDC Clients ist wirklich einfach, alle nötigen Infos findet ihr hier bei GitHub:

https://github.com/stonith404/pocket-id?tab=readme-ov-file#add-pocket-id-as-an-oidc-provider

---

**Quellen:**

https://pocket-id.org/

https://github.com/stonith404/pocket-id