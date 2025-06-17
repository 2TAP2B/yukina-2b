---
title: 'Eigenen Podcatcher hosten mit Audiobookshelf, Docker und Traefik'
description: 'Mit Audiobookshelf baust du dir deinen eigenen Podcatcher – selbst gehostet, unabhängig von Spotify & Co.'

published: 2025-06-17
tags: ['Podcasts', 'Podcatcher', 'Mobile', 'Desktop', 'Docker', 'Open-Source', 'Linux']
cover: /images/posts/trilium.png
category: Podcast
---
## Dein eigener Podcatcher? Warum eigentlich nicht.

Du wolltest schon immer mal **deinen eigenen Podcatcher bauen**?  
Nicht abhängig sein von Spotify, Apple Podcasts oder sonstigen Plattformen, sondern deinen Podcatcher **selbst hosten und verwalten**?

Genau das hab ich jetzt mal ausprobiert – und zwar mit **Audiobookshelf**.  
Spoiler: Funktioniert richtig gut.

* * *

### Audiobookshelf – nicht nur für Hörbücher

Audiobookshelf ist eigentlich ein self-hosted **Hörbuchserver**, aber:  
Das Ding kann auch Podcasts. Und zwar **genauso wie ein klassischer Podcatcher** – nur eben **auf deinem eigenen Server**.

Du kannst deine Podcasts über **klassische RSS-Feeds abonnieren**, automatisch neue Episoden downloaden lassen und über verschiedene Clients (z. B. **Plapper** für iOS oder **Lissen** auf Android) abspielen.

Ich finde das eine ziemlich coole Sache und dieses Setup läuft seit einigen Monaten sehr stabil und ich bin voll happy damit.

* * *

### So baust du dir deinen eigenen Podcatcher

Hier ein ganz kurzer Überblick, wie du loslegen kannst:

1.  **Audiobookshelf installieren**  
    → Läuft easy in Docker. Ein Compose-File reicht.
2.  **Audiobookshelf einrichten**  
    → Zugriff konfigurieren, Medienordner anlegen, Nutzer einrichten.
3.  **Podcast per RSS-Feed hinzufügen**  
    → Einfach den gewünschten Feed einfügen, fertig. Du kannst einstellen, dass neue Folgen automatisch heruntergeladen werden.
4.  **App installieren**  
    → Ich nutze auf iOS **Plapper**, auf Android **Lissen**. Beide unterstützen ABS als Backend und funktionieren wie ganz normale Podcast-Apps – nur eben mit deinem Server im Hintergrund.

* * *

## **Audiobookshelf installieren**

**Zu erst legen wir mal die passende Ordner Struktur an**

```
mkdir -p /opt/containers/audiobookshelf && cd /opt/containers/audiobookshelf
```

Erstellen die `compose.yaml`

```
nano /opt/containers/audiobookshelf/compose.yaml
```

Und pasten folgenden Inhalt rein

```
 services:
  audiobookshelf:
    image: ghcr.io/advplyr/audiobookshelf:latest
    volumes:
      - /mnt/share/audiobooks:/audiobooks # <- Mountpoint für Hörbucher. Bitte ändern
      - /mnt/share/podcasts:/podcasts # <- Mountpoint für Podcasts. Bitte ändern
      - ./config:/config
      - ./meta:/metadata
    environment:
      - TZ=Europe/Berlin
    restart: always
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.audiobookshelf.entrypoints=websecure"
      - "traefik.http.routers.audiobookshelf.rule=(Host(`audiobookshelf.deinserver.de`))"
      - "traefik.http.routers.audiobookshelf.tls=true"
      - "traefik.http.routers.audiobookshelf.tls.certresolver=cloudflare"
      - "traefik.http.routers.audiobookshelf.service=audiobookshelf"
      - "traefik.http.services.audiobookshelf.loadbalancer.server.port=80"
      - "traefik.docker.network=frontend"
    networks:
      - frontend
networks:
  frontend:
    external: true
```

Hier müsst ihr einmal in den Traefik-Labels eure Domain anpassen und einen Ort wählen, wo eure Podcasts (und ggf. Hörbücher) liegen sollen.

Bei mir sollen die Daten auf meinem Fileserver landen – den habe ich per NFS auf `/mnt/share` gemountet. Das müsst ihr natürlich an eure Umgebung anpassen.    
Ihr könnt die Dateien aber auch einfach direkt im Verzeichnis ablegen, z. B. mit `- ./podcasts:/podcasts`, ganz wie ihr wollt…  
 

Startet den Server nun mit

```
docker compose up -d
```

* * *

Dann ruft ihr eure Domain im Browser auf und sollten erstmal begrüßt werden von audiobookshelf und erstellt euch einen account

![benutzer anlegen](./init1.png)

mit dem eben erstellten user loggt ihr euch nun ein

![first login](./login.png)

und nun können wir hier unsere erste bibliothek hinzufügen

![libary hinzufügen](./add-lib.png)

Klickt dafür hier auf `Browse for Folder`

![libary hinzufügen](./browser-folder.png)

Wählt dann denn Ordner `podcasts` aus, das ist der Ordner im Container in den ihr in der docker compose eure podcasts mountet.

![libary hinzufügen](./choose-folder.png)

Mit create fügt ihr diesen ordner nun in audibookshelf ein und der inhalt wird erstmal gescannt, falls schon inhalte vorhanden sein sollten, wie bei mir.

![libary hinzufügen](./create.png)

### Fazit: Dein eigener Podcast-Server – schnell gebaut, dauerhaft glücklich

Audiobookshelf macht genau das, was ein Podcatcher machen soll:  
**Podcast abonnieren, neue Episoden automatisch laden, hören – fertig.**

Nur läuft das Ganze **auf deiner eigenen Plattform**.  
Und das fühlt sich einfach gut an.