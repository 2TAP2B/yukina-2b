---
title: 'DynDNS mit Cloudflare & Docker im Homelab'
description: 'Wie ich mein Homelab per Cloudflare-DDNS trotz dynamischer IP zuverlässig von außen erreichbar mache.'
published: 2025-05-03
tags: ['Homelab', 'Docker', 'Cloudflare', 'DDNS', 'Self-Hosting', 'Netzwerk', 'Linux']
cover: /images/posts/dyndns.png
category: DynDNS
---

## 1. DynDNS mit Cloudflare

Bei mir zu Hause läuft ein klassischer VDSL-Anschluss mit dynamischer IP und Fritz!Box. Damit meine Dienste von außen erreichbar sind, muss natürlich DynDNS eingerichtet werden.

Meine Domains laufen über **Porkbun** (Preis-Leistung einfach top), das DNS-Management übernimmt **Cloudflare**.

Dafür setze ich mir einen kleinen Docker-Container auf, der per **Cloudflare-API** automatisch meine aktuelle IP-Adresse in den DNS-Einträgen aktualisiert.

Das Ganze funktioniert super einfach mit diesem Projekt:  
-> [favonia/cloudflare-ddns](https://github.com/favonia/cloudflare-ddns)  
Ein schlanker, leichtgewichtiger Container, der genau eine Aufgabe übernimmt – und die macht er bisher absolut zuverlässig.

---

## 2. Voraussetzungen

- Cloudflare-Account
- API-Token mit dem Template **"Edit Zone DNS"**
- Eigene Domain, Provider wie Porkbun
- [Docker & Docker Compose v2](/posts/server-setup#5-docker-und-docker-compose)

---

## 3. Beispielkonfiguration

```yaml
services:
  cloudflare-ddns:
    image: favonia/cloudflare-ddns:latest
    network_mode: host
    restart: always
    user: "1000:1000"
    read_only: true
    cap_drop: [all]
    security_opt: [no-new-privileges:true]
    environment:
      - CLOUDFLARE_API_TOKEN=YOUR-CLOUDFLARE-API-TOKEN
      - DOMAINS=example.org,www.example.org,example.io
      - PROXIED=true
```

---

Mit dieser einfachen, stabilen Lösung ist dein Homelab trotz dynamischer IP jederzeit von außen erreichbar – sicher, schnell und komplett Open Source.