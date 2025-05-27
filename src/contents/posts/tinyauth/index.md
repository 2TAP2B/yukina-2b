---
title: 'Tinyauth mit Docker und Traefik installieren'
description: 'Tinyauth ist ein minimalistischer Auth-Provider mit WebUI für kleine Selfhosted-Projekte.'
published: 2025-05-27
tags: ['Linux', 'Homelab', 'Docker', 'Auth', 'Reverse Proxy', 'Traefik', 'Open-Source']
cover: /images/posts/tinyauth.png
category: Auth
---

## 1. Intro

Tinyauth ist eine meiner Lieblingsanwendungen in meinem Homelab. Es ist eine super schnelle, lightweight Alternative zu Authelia oder Authentik – perfekt fürs Homelab. Die Installation ist in wenigen Minuten erledigt und die Integration mit Traefik läuft absolut reibungslos.

In diesem Setup verwende ich Tinyauth ausschließlich in Kombination mit Pocket ID, um z. B. das Traefik-Dashboard abzusichern und vor externem Zugriff zu schützen. Wie genau das funktioniert, zeige ich euch hier.

---

## 2. Voraussetzungen

- [Docker & Docker Compose v2](/posts/server-setup#5-docker-und-docker-compose)
- [Traefik Setup](/posts/traefik)
- [Pocket ID](/posts/pocket-id)

---

## 3. Projektverzeichnis erstellen

Erstelle ein neues Verzeichnis für Tinyauth:

```bash
mkdir /opt/containers/tinyauth
cd /opt/containers/tinyauth
``` 

---

## 4. docker-compose.yml erstellen

```bash
nano docker-compose.yml
```

```yaml
services:
  tinyauth:
    container_name: tinyauth
    image: ghcr.io/steveiliop56/tinyauth:latest
    environment:
      - SECRET=my-super-secret-key
      - APP_URL=https://tinyauth.dein.server
      - DISABLE_CONTINUE=true
      - GENERIC_CLIENT_ID=xyz
      - GENERIC_CLIENT_SECRET=123
      - GENERIC_AUTH_URL=https://pocket.id/authorize
      - GENERIC_TOKEN_URL=https://pocket.id/api/oidc/token
      - GENERIC_USER_URL=https://pocket.id/api/oidc/userinfo
      - GENERIC_SCOPES=openid, profile, email
      - GENERIC_NAME=PocketID
      - OAUTH_AUTO_REDIRECT=PocketID
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.tinyauth.entrypoints=websecure"
      - "traefik.http.routers.tinyauth.rule=Host(`tinyauth.dein.server`)"
      - "traefik.http.routers.tinyauth.tls=true"
      - "traefik.http.routers.tinyauth.tls.certresolver=cloudflare"
      - "traefik.http.routers.tinyauth.service=tinyauth"
      - "traefik.http.services.tinyauth.loadbalancer.server.port=3000"
      - "traefik.docker.network=frontend"
      - "traefik.http.middlewares.tinyauth.forwardauth.address=http://tinyauth:3000/api/auth/traefik"
    networks:
      - frontend
    restart: unless-stopped
networks:
  frontend:
    external: true
```

Hier muss einiges angepasst werden und zwar, `SECRET=my-super-secret-key`, `APP_URL=https://tinyauth.dein.server`, `APP_URL=https://tinyauth.dein.server`, `GENERIC_CLIENT_ID`, `GENERIC_CLIENT_SECRET`, `GENERIC_AUTH_URL`, `GENERIC_TOKEN_URL`, `GENERIC_USER_URL`, `traefik Host(`tinyauth.dein.server`)`


Das `SECRET`könnt ihr so generieren:

```bash
openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32
```

Ihr müsst natürlich den OAuth Client in Pocket ID erstellen, [hier](https://tinyauth.app/docs/guides/pocket-id.html) gibt es vom Entwickler direkt eine Anleitung dafür.

---

## 5. Container starten

Starte den Container mit:

```bash
docker compose up -d
```

---

## 6. Middleware benutzen

Um Tinyauth nun beispielsweise vor Traefik als Middleware zu verwenden, müssen wir folgendes Label zur Traefik-Konfiguration hinzufügen:

```yaml
- "traefik.http.routers.traefik.middlewares=tinyauth"
```

Anschließend starten wir Traefik neu – und ab sofort ist das Traefik-Dashboard durch Tinyauth abgesichert.

Dieses Label lässt sich natürlich ganz einfach an jeden über Traefik exponierten Dienst anhängen und verpasst dem Dienst eine zusätzliche Sicherheitsebene – besonders dann sinnvoll, wenn der Dienst von Haus aus keine eigene Authentifizierung mitbringt.
---

Quellen:

[Tinyauth](https://tinyauth.app/)