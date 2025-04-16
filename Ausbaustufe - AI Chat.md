# Ai Chat anstelle von Richtig / Falsch feedback
Das Programm wird so angepasst, das nicht das gesuchte Wort geprüft wird, sonder per AI CHat ein Feedback zu der eingabe eingeholt wird.

für diesen Chat kompontent habe ich eine openai kompatible API inklusive zugangs KEY.

Die UI wird in sofern verändert, dass das Eingabefeld entfällt.
Statt dessen kommt ein Bereich für einen Chatverlauf hinzu.
Im Chat können durch mehrere Eingabe / Ausgaben ein Gesprächsverlauf zunm gesuchten Wort entstehen.


Folgender Prompt würde an die KI übergeben werden
'''
Du bist ein English Tutor.
Das Spiel heist: Schreibe das Wort anhand eines Bildes .
Das gesuchte Wort lautet: {GESUCHTESWORT}
Der Teilnehmer hat nicht das richtige Wort eingegeben, sondern: {EINGABEFELD}
Weitere Hinweise zum Bild sind:
  - Bild Titel von unsplash
  - Description von unsplash
  - alt_description von unsplash

 Gebe einen Hint, ohne das Wort direkt zu verraten.
 Spreche Englisch, wechele ggf auf Deutsch wenn du meinst der Teilnehmer hat Probleme.
 '''

Der Chatkontext bleibt bei einen Fragestellung erhalten, 
beim Wechsel zum nächsten Wort, fängt auch der Chatkontext wieder neu an.


Zu jeder Zeit ist es möglich per Button "Neue Frage" von Vorne an zu fangen. 