# Word-Master

> ⚠️ **Warning**  
> Dieses Projekt ist ein Testbed für mich, unter Verwendung von VS Code, RooCode und KI-unterstützter Programmierung.
> Erwarten Sie nichts Handgefertigtes oder Interessantes.

## Einführung
Word-Master ist eine webbasierte Anwendung, die mit Flask entwickelt wurde, um englische Hauptwörter zu üben. Die Anwendung ist auf Deutsch und hilft Benutzern, ihre Englischkenntnisse zu verbessern, indem sie eine interaktive Umgebung zum Lernen bietet.

## Funktionalität
- Die Anwendung verwendet eine statische Liste von englischen Wörtern, die in `words.txt` gespeichert ist.
- Jeder Eintrag in `words.txt` entspricht einem Wort, das geübt wird.
- Die Anwendung integriert Unsplash für die Bildersuche, um das Lernen visuell zu unterstützen.

## Aktueller Status
Das Projekt ist nun in einer funktionierenden Version verfügbar, die über eine Flask-Anwendung läuft. Die Webanwendung ist erreichbar unter http://127.0.0.1:5000. Die Anwendung benötigt Python 3.9 oder höher.

## Mitwirken
1. Klonen Sie das Repository: `git clone https://github.com/username/word-master.git`
2. Wechseln Sie in das Projektverzeichnis: `cd word-master`
3. Erstellen Sie eine virtuelle Umgebung und installieren Sie die erforderlichen Abhängigkeiten:
   ```bash
   python3.9 -m venv backend/venv
   source backend/venv/bin/activate
   pip install -r requirements.txt
   ```
4. Starten Sie die Anwendung: `python backend/app.py`

## Anforderungen
Die Anwendung benötigt die folgenden Python-Pakete, die in `requirements.txt` aufgeführt sind

## unsplash
Unsplash wird für die Bilder benötigt.
Ein kostenloser Account unter https://unsplash.com/oauth/applications/ ist ausreichend.
Die API-Informationen werden dann in die .env-Datei eingetragen.
Eine Beispiel-.env-Datei ist im Projekt vorhanden.

## Nächste Schritte
- Implementierung der Eingabe- und Überprüfungsfunktion
- Verbesserung der KI-Funktionalität zur Bildersuche

## Nutzung
Öffnen Sie http://127.0.0.1:5000 in Ihrem Webbrowser, um die Anwendung zu verwenden. Die Bildersuche-Funktion kann genutzt werden, um passende Bilder für die Wörter zu finden.
