# Plan zur responsiven und modernen Optimierung von „Word Master“

## 1. Analyse & Fehlerbehebung
- Doppelte und fehlerhafte CSS-Regeln bereinigen.
- Einheitliche, moderne Schriftarten und Grundfarben festlegen.

## 2. Flexibles Layout
- Container für die Hauptinhalte einführen, zentriert mit max-width und flexiblen Abständen.
- Verwendung von Flexbox für die Anordnung der Eingabe und Buttons.

## 3. Responsives Design
- Media Queries für folgende Breakpoints:
  - Smartphones (≤ 600px)
  - Tablets (601px – 1024px)
  - Laptops/Desktops (> 1024px)
- Auf kleinen Bildschirmen: Buttons und Input untereinander, größere Touch-Flächen, angepasste Schriftgrößen.
- Auf Tablets: Etwas größere Abstände, ggf. Buttons nebeneinander.
- Auf Laptops: Zentriertes, luftiges Layout mit größeren Schriftgrößen.

## 4. Modernes, helles Farbschema
- Hintergrund: sehr hell (z.B. #f7f9fa)
- Primärfarbe: Akzent (z.B. #00698f oder moderner Blauton)
- Buttons: abgerundet, mit Schatten und Hover-Effekt

## 5. Barrierefreiheit & Usability
- Ausreichende Kontraste.
- Fokus-Stile für Eingabefelder und Buttons.

---

## Beispielhafte Layout-Logik (Mermaid-Diagramm)

```mermaid
flowchart TD
    A[Container: zentriert, max-width]
    A --> B[Überschrift (h1)]
    A --> C[Wort-Anzeige (#word-display)]
    A --> D[Input + Buttons]
    D --> E[Eingabefeld]
    D --> F[Überprüfen-Button]
    D --> G[Neue Frage-Button]
    A --> H[Ergebnis-Anzeige (#result)]

    style A fill:#f7f9fa,stroke:#bbb
    style F fill:#e3f2fd,stroke:#00698f
    style G fill:#e3f2fd,stroke:#00698f
```

---

## Nächste Schritte

1. CSS bereinigen und Grundstruktur anpassen.
2. Flexbox-Layout für die Eingabe- und Button-Gruppe einführen.
3. Media Queries für die genannten Breakpoints implementieren.
4. Modernes, helles Farbschema anwenden.
5. Fokus- und Hover-Effekte für bessere Usability ergänzen.