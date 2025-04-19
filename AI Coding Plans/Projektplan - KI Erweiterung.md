# Projektplan: Erweiterung der KI-Interaktion mit Gesprächsverlauf und geratenen Wörtern

**Ziel:** Die KI-Interaktion soll verbessert werden, indem der Gesprächsverlauf und die bisher geratenen Wörter in den Prompt einbezogen werden und für die vier Versuche unterschiedliche Prompts verwendet werden.

**Schritte:**

1.  **Frontend-Anpassungen (`server/static/script.js`):**
    *   **Speicherung des Gesprächsverlaufs:** Implementieren Sie eine Variable (z.B. ein Array von Objekten mit `role` und `content`) im Frontend, um jede Nachricht (Benutzer und KI) zu speichern, sobald sie im Chat-Display angezeigt wird.
    *   **Speicherung der geratenen Wörter:** Implementieren Sie eine Variable (z.B. ein Array von Strings) im Frontend, um jedes vom Benutzer eingegebene Wort zu speichern, wenn der Senden-Button geklickt wird und es sich nicht um die korrekte Lösung handelt.
    *   **Erweiterung des API-Aufrufs:** Ändern Sie die `fetch` Anfrage an `/ai_chat`, um den gespeicherten Gesprächsverlauf und das Array der geratenen Wörter im Body des POST-Requests mitzusenden. Fügen Sie dem Request-Body neue Felder hinzu, z.B. `chat_history` und `guessed_words`.
    *   **Verwaltung des Fehlerzählers:** Der bestehende `failCount` im Frontend wird weiterhin verwendet, um zu bestimmen, welcher der vier Prompts im Backend verwendet werden soll.

2.  **Backend-Anpassungen (`server/app.py`):**
    *   **Empfang der Daten:** Erweitern Sie die `/ai_chat` Route, um die neuen Felder `chat_history` und `guessed_words` aus dem eingehenden JSON-Request zu lesen.
    *   **Prompt-Auswahl basierend auf Fehlerzähler:** Implementieren Sie Logik, um basierend auf dem `failCount` (der ebenfalls vom Frontend gesendet werden muss) den entsprechenden Prompt auszuwählen. Dies könnte durch das Laden verschiedener Prompt-Dateien oder durch bedingte Logik innerhalb der Route geschehen.
    *   **Prompt-Formatierung:** Passen Sie die Prompt-Formatierung an, um den übermittelten Gesprächsverlauf und die geratenen Wörter in den Prompt einzufügen. Der Gesprächsverlauf könnte als Liste von Nachrichten formatiert werden, und die geratenen Wörter könnten wie gewünscht als `WORT_1`, `WORT_2`, etc. eingefügt werden.

3.  **Prompt-Anpassungen (`server/ai_prompt.txt` oder neue Prompt-Dateien):**
    *   **Erstellung von vier Prompts:** Erstellen Sie vier separate Prompt-Vorlagen, die unterschiedliche Hinweise geben und Platzhalter für den Gesprächsverlauf und die geratenen Wörter enthalten. (Sie werden diese Prompts separat erfassen).
    *   **Platzhalter definieren:** Definieren Sie klare Platzhalter in den Prompts für den Gesprächsverlauf (z.B. `{chat_history}`) und die geratenen Wörter (z.B. `{guessed_words}`).

**Ablaufdiagramm (Mermaid):**

```mermaid
graph TD
    A[Benutzer gibt Wort ein] --> B{Wort korrekt?};
    B -- Ja --> C[Glückwunsch, Spielende];
    B -- Nein --> D[Fehlerzähler erhöhen];
    D --> E{Fehlerzähler < 4?};
    E -- Ja --> F[Speichere Wort und Gesprächsverlauf];
    F --> G[Sende Wort, Gesprächsverlauf, geratene Wörter und Fehlerzähler an Backend];
    G --> H[Backend empfängt Daten];
    H --> I[Wähle Prompt basierend auf Fehlerzähler];
    I --> J[Formatiere Prompt mit Gesprächsverlauf und geratenen Wörtern];
    J --> K[Sende Anfrage an OpenAI API];
    K --> L[Erhalte Antwort von OpenAI];
    L --> M[Sende Antwort an Frontend];
    M --> N[Zeige KI-Antwort im Chat an];
    N --> A;
    E -- Nein --> O[Zeige richtiges Wort an, Spielende];