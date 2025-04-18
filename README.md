# Word-Master

> ⚠️ **Warning**  
> Dieses Projekt ist ein Testbed für mich, unter Verwendung von VS Code, RooCode und KI-unterstützter Programmierung.
> Erwarten Sie nichts Handgefertigtes oder Interessantes.

## Einführung
Word-Master ist eine webbasierte Anwendung, die mit Flask entwickelt wurde, um englische Hauptwörter zu üben. Die Anwendung ist auf Deutsch und hilft Benutzern, ihre Englischkenntnisse zu verbessern, indem sie eine interaktive Umgebung zum Lernen bietet.

## Quickstart
Um die Anwendung schnell zu starten, nutzen Sie das Skript `start.sh`. Das Skript erstellt automatisch eine virtuelle Umgebung, installiert alle Abhängigkeiten und startet Gunicorn.
Kopiere die dot.env aus dem config-examples Verzeichnis 
```bash
cp config-examples/dot.env .env
```
Und gebe die entsprechenden API_Keys und URLs an.

Starten per script, zeiht die VENV, und alle Requirements.

```bash
./start.sh
```

Anschließend ist die Anwendung unter http://127.0.0.1:5000 erreichbar.

## Funktionalität
- Die Anwendung verwendet eine statische Liste von englischen Wörtern, die in `words.txt` gespeichert ist.
- Jeder Eintrag in `words.txt` (aktuell 280 Wörter, kann natürlich erweitert werde) entspricht einem Wort, das geübt wird.
- Die Anwendung integriert Unsplash für die Bildersuche, um das Lernen visuell zu unterstützen.
 - Der Benutzer gibt den gesuchten Begriff ein, eine KI gibt Feedback und unterstützt bei der Wortfindung und Schreibweise.
 - Nach 4 Versuche wird das gesuchte Wort gezeigt

## Aktueller Status
Das Projekt ist nun in einer funktionierenden Version verfügbar, die über eine Flask-Anwendung läuft. Die Webanwendung ist erreichbar unter http://127.0.0.1:5000. Die Anwendung benötigt Python 3 oder höher.

## Mitwirken  
1. Klonen Sie das Repository: `git clone https://github.com/username/word-master.git`
2. Wechseln Sie in das Projektverzeichnis: `cd word-master`
3. Erstellen Sie eine virtuelle Umgebung und installieren Sie die erforderlichen Abhängigkeiten:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
4. Starten Sie die Anwendung: `cd server && python3 app.py`

**Alternativ kann die Anwendung mit Gunicorn gestartet werden (empfohlen für Produktion):**

```bash
gunicorn server.app:app
```

## Anforderungen
Die Anwendung benötigt die folgenden Python-Pakete, die in `requirements.txt` aufgeführt sind

## unsplash
Unsplash wird für die Bilder benötigt.
Ein kostenloser Account unter https://unsplash.com/oauth/applications/ ist ausreichend.
Die API-Informationen werden dann in die .env-Datei eingetragen.
Eine Beispiel-.env-Datei ist im Projekt vorhanden.

## KI
Es wird ein KI / AI benötigt für die Antworten, ich empfehle llama-4-maverick-17b-128e-instruct zB über GROQ, kostet nur 0,10€ / million Tokens
Alles in .env hinterlegen
Der Prompt ist in backend/ai_prompt hinterlegt, und muss zZ in einer langen Zeile Text hinterlegt sein.

# Config-exmaples
In diesen Verzeichnis liegen Beispiel Dateien um zB unter Ubuntu die App als System Service zu integrieren, und einen VHost unter lighhtpd ein zurichten.

## Nutzung
Öffnen Sie http://127.0.0.1:5000 in Ihrem Webbrowser, um die Anwendung zu verwenden. 
Es wird ein Bild gezeigt, und ein Englisches Wort gesucht.
Gebe das gesuchte Wort ein, wenn es nicht richtig ist, wird man von der KI Unterstützt.
Lade die Seite neu, für eine neue Aufgabe.