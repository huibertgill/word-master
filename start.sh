#!/bin/bash
set -e

# 1. Prüfen, ob venv existiert, sonst anlegen
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

# 2. venv aktivieren, falls nicht aktiv
if [ -z "$VIRTUAL_ENV" ]; then
    # shellcheck disable=SC1091
    source venv/bin/activate
fi

# 3. Abhängigkeiten installieren
pip install --upgrade pip
pip install -r requirements.txt

# 4. Gunicorn starten
exec gunicorn server.app:app --bind 127.0.0.1:8000