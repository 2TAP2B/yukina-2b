---
title: 'Traefik IP Whitelist erstellen'
description: 'Den Zugriff auf bestimmte Seiten nur per IP-Whitelist zuzulassen, kann manchmal hilfreich sein.'
published: 2024-12-28
tags: ['Reverse-proxy', 'Open-Source', 'SSL', 'Traefik', 'Whitelist']
cover: /images/posts/traefik.png
draft: false
---
## 1. Intro

In gewissen Situationen kann es nützlich sein, eine Webseite nur von bestimmten IPs zugänglich zu machen. Ein Beispiel wäre ein Passwortmanager wie z.B. Vaultwarden.

Dieser wäre dann nur über eine bestimmte IP abrufbar, zum Beispiel die Adresse unseres WireGuard-Servers oder Heimnetzwerk-Servers. Auf diese Weise könnte man auch außerhalb des Heimnetzwerks via VPN auf Vaultwarden zugreifen.

Es gibt viele verschiedene Möglichkeiten, so etwas zu realisieren. Mit Traefik wäre diese Umsetzung jedoch wirklich sehr einfach und erfordert nur einige Zeilen Code.

---

## 2. Grundvoraussetzung

- [Docker & Docker Compose v2](/blog/server-setup#5-docker-und-docker-compose)
- [Traefik Setup](/blog/traefik)

---

## 3. Traefik anpassen

Zunächst erstellen wir eine neue Datei namens `middlewares-ip-whitelist.yaml`.

```shell
nano /opt/containers/traefik/config/conf.d/middlewares-ip-whitelist.yaml
```

Kopiert den folgenden Inhalt hinein und fügt eure IP-Adresse zur Whitelist hinzu.

```yaml title="middlewares-ip-whitelist.yaml"
http:
  middlewares:
    ip-whitelist:
      ipWhiteList:
        sourceRange:
          - "1.2.3.1"
```

Anschließend passen wir die Traefik-Labels für den gewünschten Dienst an. Als Test verwenden wir das Traefik-Dashboard.

```shell
nano /opt/containers/traefik/docker-compose.yaml
```

```yaml title="docker-compose.yaml"
[...]

      - "traefik.http.routers.traefik.middlewares=middlewares-authelia@file, ip-whitelist@file" # <--- Hier fügen wir die Whitelist hinzu.

[...]
```

Bei den Middlewares tragt bitte `ip-whitelist@file` ein, wie oben gezeigt. Dadurch wird der Dienst nur noch über die angegebene IP-Adresse erreichbar.

Falls ihr als Privatperson keine feste IP habt, könnt ihr das folgende Script verwenden, um die IP-Adresse regelmäßig zu prüfen und bei Bedarf anzupassen.

Das Script kann mit Crontab alle 6 Stunden ausgeführt werden. Es wird nur aktiv, wenn sich die IP-Adresse geändert hat.

```bash title="update-ip.sh"
#!/bin/bash


# URL zum Anpingen
url="meine.domain.com" # <----> Hier deine Domain einfügen 
# Pfad zur YAML-Datei
yaml_file="/opt/containers/traefik/config/conf.d/middlewares-ip-whitelist.yaml"
# Pfad zur Docker-Compose-Datei
docker_compose_file="/opt/containers/traefik/docker-compose.yaml"


# Funktion, um die IP-Adresse aus der YAML-Datei zu extrahieren
get_ip_from_yaml() {
  grep -oE "[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+" "$yaml_file"
}


# Funktion, um die IP-Adresse einer URL zu bekommen
get_ip_from_url() {
 ping_result=$(ping -c 1 "$url")
    if [[ $ping_result =~ \(([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)\) ]]; then
 echo "${BASH_REMATCH[1]}"
 fi
}


# IP-Adresse aus der YAML-Datei und von der URL erhalten
old_ip=$(get_ip_from_yaml)
new_ip=$(get_ip_from_url)


# Überprüfen, ob die IP-Adresse sich geändert hat
if [ "$old_ip" != "$new_ip" ]; then
    echo "IP-Adresse hat sich geändert: $old_ip -> $new_ip"
    # IP-Adresse in YAML-Datei aktualisieren
    sed -i "s/$old_ip/$new_ip/g" "$yaml_file"
    echo "IP-Adresse wurde in der YAML-Datei aktualisiert."
   
    # Docker-Compose-Befehl ausführen
    echo "Führe Docker-Compose-Befehl aus..."
    docker compose -f "$docker_compose_file" up -d --force-recreate
    if [ $? -eq 0 ]; then
     echo "Docker-Compose-Befehl wurde erfolgreich ausgeführt."
    else
     echo "Fehler beim Ausführen des Docker-Compose-Befehls."
    fi
else
 echo "IP-Adresse hat sich nicht geändert."
fi 
```

Macht die Datei ausführbar mit

```shell
chmod +x update-ip.sh
```

Und erstellt einen crontab

```shell
crontab -e

### So könnte der Eintrag aussehen

0 */2 * * * /opt/containers/traefik/update-ip.sh
```
---

## 4. Traefik neustarten

import Callout from '@/components/Callout.astro'
  

<Callout icon="💡" type="info">

Denkt daran, Traefik nach den Änderungen neu zu starten, damit diese übernommen werden.
</Callout>

```shell
docker compose -f /opt/containers/traefik/docker-compose.yaml up -d --force-recreate
```

--- 


