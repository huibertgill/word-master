## Detaillierter Plan für die Implementierung des AI-Chats

1. **Anpassung der UI:**
 - Entfernen des aktuellen Eingabefelds für das Wort.
 - Hinzufügen eines Chatbereichs, der den Gesprächsverlauf zwischen Benutzer und KI anzeigt.

2. **Implementierung des AI-Chats:**
 - Integration einer OpenAI-kompatiblen API in der Datei `@/backend/app.py`.
 - Entwicklung eines Prompts, der Informationen über das gesuchte Wort, die Benutzereingabe und Hinweise zum zugehörigen Bild enthält.

3. **Konfiguration der API-Zugangsdaten:**
 - Ergänzen des API_KEY, MODEL_NAME und der URL in der `.env`-Datei.

4. **Sprachwahl der KI:**
 - Die KI soll eine Mischung aus Englisch und Deutsch verwenden.
 - Englisch für das Feedback zum Wort.
 - Deutsch, wenn der Teilnehmer offensichtlich Schwierigkeiten hat oder wenn es nötig ist, komplexe Erklärungen zu geben.

5. **Funktionalität des "Neue Frage"-Buttons:**
 - Der Button soll den Chatverlauf zurücksetzen.
 - Eine neue Anfrage an die KI senden, wenn ein neues Wort gesucht wird.

6. **Chatkontext:**
 - Der Chatkontext bleibt bei einer Fragestellung erhalten.
 - Beim Wechsel zum nächsten Wort wird der Chatkontext neu gestartet.