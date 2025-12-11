# 📁 CSS-Dateien Struktur

## ✅ Aktive CSS-Dateien

### Basis-Styles (immer laden)
| Datei | Beschreibung | Priorität |
|-------|--------------|-----------|
| `main.css` | Haupt-Stylesheet mit globalen Styles | 1 |
| `fonts.css` | Schriftarten-Definitionen | 1 |
| `shared-components.css` | Wiederverwendbare Komponenten | 2 |
| `animations.css` | CSS-Animationen | 2 |
| `navigation-fix.css` | Navigation-Fixes | 2 |
| `browser-compatibility.css` | Browser-Kompatibilität | 2 |
| `consent.css` | Cookie-Consent Styles | 2 |

### Seiten-spezifische Styles
| Datei | Seite | Beschreibung |
|-------|-------|--------------|
| `index.css` | index.html | Startseite |
| `produkte.css` | produkte.html | Produktübersicht |
| `produkte-mobile.css` | produkte.html | Mobile-Anpassungen |
| `product-visualizer.css` | produkt-detail.html | 3D-Visualisierung |
| `kontakt.css` | kontakt.html | Kontaktformular |
| `impressum.css` | impressum.html | Impressum |
| `datenschutz.css` | datenschutz.html | Datenschutzerklärung |
| `ueber-uns.css` | ueber-uns.html | Über uns |
| `oelwegweiser.css` | oelwegweiser.html | Öl-Wegweiser |
| `altoelentsorgung.css` | altoelentsorgung.html | Altöl-Entsorgung |

---

> 💡 **Hinweis:** Nicht verwendete CSS-Dateien wurden nach `/de/archiv/css-unused/` verschoben.

---

## 🔧 Wartung

### Neue Seite hinzufügen
1. Erstelle `seitenname.css` in diesem Ordner
2. Füge `<link rel="stylesheet" href="css/seitenname.css">` zur HTML hinzu
3. Platziere nach `main.css` und `shared-components.css`

### Reihenfolge der CSS-Links
```html
<link rel="stylesheet" href="css/main.css">
<link rel="stylesheet" href="css/shared-components.css">
<link rel="stylesheet" href="css/animations.css">
<link rel="stylesheet" href="css/seitenname.css"> <!-- Seiten-spezifisch -->
<link rel="stylesheet" href="css/consent.css">
```

### Unused-Ordner aufräumen
- Dateien älter als 3 Monate können gelöscht werden
- Vor dem Löschen prüfen ob noch Referenzen existieren
