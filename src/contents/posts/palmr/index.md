---
title: 'Palmr installieren mit Docker und Hetzner S3'
description: 'Palmr ist eine Open-Source Filesharing Plattform mit Fokus auf Datenschutz und Sicherheit.'
published: 2025-07-07
tags: ['File Sharing', 'Docker', 'Selfhosted', 'S3', 'Traefik', 'Open-Source']
cover: /images/posts/palmr.png
category: File Sharing
darft: true
---

Nachdem der Entwickler von [PingvinShare](https://github.com/stonith404/pingvin-share) sein Repository archiviert hat, musste ich mich auf die Suche nach einer würdigen Alternative machen.

PingvinShare habe ich seit einer frühen 0.1.x-Version genutzt – es lief immer stabil und sah dabei richtig gut aus. Der Entwickler möchte seinen Fokus nun mehr auf **Pocket ID** legen. Verständlich, denn zwei gut laufende Open-Source-Projekte gleichzeitig zu betreuen, ist ein enormer Aufwand. Ich kann diesen Schritt also gut nachvollziehen – schade ist es trotzdem.

Um PingvinShare mittelfristig zu ersetzen, hatte ich ein paar klare Anforderungen:


- Support für **S3** Storage
- schöne **UI/UX**
- Support für **SMTP**
- Reverse File Sharing 
- OAuth / OIDC
- Docker & Traefik Kompatibilität
- idealerweise aktiv gepflegt
- kein PHP

Fündig wurde ich bei [Palmr](https://github.com/kyantech/Palmr) – einer modernen, feature-reichen Alternative mit allem, was ich brauche.

---

#### Versionierung
Datum | Änderung
--|--
07-07-2025| Initialer Release

---

## Voraussetzungen

Bevor du loslegst, stelle sicher, dass folgendes bereitsteht:

- [Docker & Docker Compose v2](/posts/server-setup#5-docker-und-docker-compose)
- [Traefik Setup](/posts/traefik)
- [Ein Hetzner S3 Bucket](https://www.hetzner.com/storage/object-storage/) (mit aktivierter Public Visibility!)
- [awscli installiert](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

---

## Ordnerstruktur erstellen

```bash
mkdir -p /opt/containers/palmr
cd /opt/containers/palmr
````

---

## .env Datei erstellen

```bash
nano .env
```

```yaml
ENABLE_S3=true
S3_ENDPOINT=https://region.your-objectstorage.com
S3_USE_SSL=true
S3_ACCESS_KEY=dein-access-key
S3_SECRET_KEY=dein-secret-key
S3_REGION=region
S3_BUCKET_NAME=palmr
S3_FORCE_PATH_STYLE=false
ENCRYPTION_KEY=ein-langer-und-sicherer-schlüssel # openssl rand -hex 32
SECURE_SITE=true
PALMR_UID=1000
PALMR_GID=1000
```

---

## docker-compose Datei anlegen

```bash
nano compose.yml
```

```yaml title="compose.yml"
services:
  palmr:
    image: kyantech/palmr:latest
    container_name: palmr
    environment:
      - ENABLE_S3=${ENABLE_S3}
      - S3_ENDPOINT=${S3_ENDPOINT}
      - S3_USE_SSL=${S3_USE_SSL}
      - S3_ACCESS_KEY=${S3_ACCESS_KEY}
      - S3_SECRET_KEY=${S3_SECRET_KEY}
      - S3_REGION=${S3_REGION}
      - S3_BUCKET_NAME=${S3_BUCKET_NAME}
      - S3_FORCE_PATH_STYLE=${S3_FORCE_PATH_STYLE}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
      - SECURE_SITE=${SECURE_SITE}
      - PALMR_UID=${PALMR_UID}
      - PALMR_GID=${PALMR_GID}
    volumes:
      - ./data:/app/server
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.palmr.entrypoints=websecure"
      - "traefik.http.routers.palmr.rule=Host(`drop.deine.cloud`)"
      - "traefik.http.routers.palmr.tls=true"
      - "traefik.http.routers.palmr.tls.certresolver=cloudflare"
      - "traefik.http.routers.palmr.service=palmr"
      - "traefik.http.services.palmr.loadbalancer.server.port=5487"
      - "traefik.docker.network=frontend"
    networks:
      - frontend
networks:
  frontend:
    external: true
```

> Passe hier deine `Domain` und den `ENCRYPTION_KEY` an.

---

## CORS für Hetzner S3 konfigurieren

Erstelle eine Datei `cors.json`:

```bash
nano cors.json
```

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://drop.deine.cloud"],
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "HEAD", "PUT", "POST"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```
> Passe hier deine `Domain` an.

**Wichtig:** Bucket-Visibility auf **Public** stellen (Hetzner Console > Bucket > Aktionen > Sichtbarkeit zurücksetzen > Öffentlich)

Dann CORS setzen via AWS CLI:

```bash
aws configure
```

```bash
aws s3api put-bucket-cors \
  --bucket palmr \
  --cors-configuration file://cors.json \
  --endpoint-url https://region.your-objectstorage.com
```

> Hier muss natürlich dein Bucketname und dein Endpoint angepasst werden.

Wenn hier der Befehl fehlerfrei durchläuft sollte die CORS Konfiguration geklappt haben.

---

## Palmr starten

```bash
docker compose up -d
```

---

## Palmr öffnen

Im Browser `https://drop.deine.cloud` öffnen – du solltest das UI von Palmr sehen. 

![palmr-init](./palmr1.png)

Hier kannst du einen Admin-Account anlegen und dich anschließend einloggen.

![palmr-login](./palmr2.png)

Dann wirst du vom Palm-Dashboard begrüßt.

![palmr-dashboard](./palmr3.png)

---

## Weitere Settings

Unter `Settings` kannst du nun dein eigenes Logo hochladen, den App-Namen ändern, SMTP konfigurieren, Pocket ID als dein IDP für den passwortlosen Login einrichten, eine Art Fail2Ban für den Login konfigurieren und die maximale Dateigröße pro Benutzer festlegen.

---

## Fazit

Palmr ist für mich der perfekte Nachfolger von PingvinShare. Die Kombination aus moderner UI, S3-Unterstützung, Reverse Sharing und einfacher Docker-Integration macht es zu einem starken Tool.

Wenn du ein Tool wie WeTransfer suchst, aber unter deiner Kontrolle – schau dir Palmr definitiv an.

