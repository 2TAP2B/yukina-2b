---
title: 'Teddycloud Tools'
description: 'Hier werden praktische Tools für die Teddycloud gesammelt und meine Erfahrungen damit geteilt.'
published: 2025-01-21
tags: ['Toniebox', 'Teddycloud', 'Media', Docker', 'Hardware', 'ESP32']
cover: /images/posts/teddycloud.png
category: Hardware
---

## 1. Intro

Ich habe Teddycloud nun im produktiven Einsatz. Ob ich oder mein Nachwuchs mehr davon profitieren, bleibt mal dahingestellt.

Es macht definitiv Spaß, sich in diese Box und die Teddycloud rein zu nerden. 
Ich habe mir erste RFID-Sticker bestellt und werde bald meine ersten Tonie-Figuren bauen.

Momentan bin ich dabei, den Inhaltsschaffungsprozess sinnvoll und halbwegs praktikabel zu gestalten.

Es gibt eine große Auswahl an Inhalten wie zum Beispiel "Sendung mit der Maus", bei denen du dir einzelne Episoden herunterlädst und dabei eine Audio-Datei von einer Stunde Laufzeit ohne Kapitelmarken erhältst.

Als erstes habe ich die Dateien gesplittet, damit man einzelne Tracks vor und zurück skippen kann. Das ist definitiv sehr sinnvoll für das Kind.

Ein weiteres praktisches Werkzeug ist das [Audio2Tonie-Tool](https://github.com/marco79cgn/audio2tonie): 
Es ermöglicht dir, einmal dir Erstellung der *.taf-Dateien (Tonie-Audio-Files) und diese direkt auf deine Teddycloud zu laden. Das spart viel Zeit und  gestaltest den Prozess der Inhaltsschaffung effizienter.

---

## 2. mp3 effizient Splitten

Dafür habe ich mir ein kleines Bash-Script gebastelt, das sieht so aus:

```bash title="mp3 split into 10min"
#!/bin/bash

# Base input directory
input_dir="test" # <--- Hier dein Input Ordner angeben

# Traverse subdirectories to process all MP3 files
find "$input_dir" -type f -name "*.mp3" | while read -r file; do
    # Extract directory and filename without extension
    dir=$(dirname "$file")
    filename=$(basename "$file" .mp3)
    
    # Run ffmpeg to split the file into 10-minute chunks, saving in the same folder
    ffmpeg -i "$file" -f segment -segment_time 600 -c copy "$dir/${filename}_%03d.mp3"
    
    # Check if ffmpeg succeeded, then delete the original file
    if [ $? -eq 0 ]; then
        rm "$file"
    else
        echo "Error processing $file. Original file not deleted."
    fi
done
```

Es gibt einen Ordner 'input', der wiederum Unterordner wie 'i1', 'i2' und 'i3' enthält, in denen sich die Audio-Dateien befinden. Also ungefähr so:

```bash
input/
├── i1/
│   ├── file1.mp3
├── i2/
│   └── file2.mp3
├── i3/
    └── file3.mp3
```

Das Skript schneidet bei je 600 Sekunden die Datei immer wieder auseinander, benennt sie nach dem Original-Dateinamen mit einer laufenden Nummer hinten dran. Danach wird das Original gelöscht, und der Ordner sollte so aussehen:

```bash
input/
├── i1/
│   ├── file1_000.mp3
│   ├── file1_001.mp3
│   ├── file1_002.mp3
│   └── file1_003.mp3
├── i2/
│   ├── file2_000.mp3
│   └── file2_001.mp3
├── i3/
    ├── file3_000.mp3
    └── file3_001.mp3
```

---

## 3. taf Konvertierung

Wie du [audio2tonie](https://2tap2.be/blog/toniebox-teddycloud/#71-installtion-audio2tonie) installierst habe ich ja schon erklärt. 

Jetzt kannst du mit einem Befehl die Audio-Dateien, die im Unterordner des Ordners `input` liegen, in *.taf-Dateien (Tonie-Audio-Files) konvertieren und Kapitelmarken erzeugen.

Was ebenfalls sehr praktisch ist, du kannst diese erzeugten Dateien direkt von deinem Computer auf die Teddycloud hochladen.

Das geht so:

```bash
docker run --rm -v $(pwd):/data audio2tonie transcode -s /data/input -u 192.168.178.101 -r
```

Dieser Befehl muss im `audio2tonie/data` Git-Repository ausgeführt werden und `/data/input` & `192.168.178.101` müssen natürlich angepasst werden.

---

**Quellen: **

[Audio2Tonie-Tool](https://github.com/marco79cgn/audio2tonie)

[FFmpeg](https://www.ffmpeg.org/)