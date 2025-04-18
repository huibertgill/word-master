#!/bin/bash
set -e

# 1. Prüfen, ob venv existiert, sonst anlegen
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

# 2. venv aktivieren, falls nicht aktiv
echo "Aktuell aktivierte virtuelle Umgebung: $(basename "$VIRTUAL_ENV")"
source venv/bin/activate
echo "Aktuell aktivierte virtuelle Umgebung: $(basename "$VIRTUAL_ENV")"


# 3. Abhängigkeiten installieren
pip install --upgrade pip
pip install -r requirements.txt

# 4. Gunicorn starten
exec gunicorn server.app:app --bind 127.0.0.1:5000