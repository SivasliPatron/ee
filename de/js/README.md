# 📁 JavaScript-Dateien Struktur

## ✅ Aktive JS-Dateien

### Kern-Scripts (immer laden)
| Datei | Beschreibung | Priorität |
|-------|--------------|-----------|
| `main.js` | Haupt-JavaScript mit globalen Funktionen | 1 |
| `shared-init.js` | **NEU** - Zentrale Initialisierung (AOS, Dropdowns, etc.) | 1 |
| `consent-manager.js` | Cookie-Consent Verwaltung | 1 |
| `consent-restrictions.js` | DSGVO-konforme Einschränkungen | 1 |
| `tailwind-config.js` | Tailwind CSS Konfiguration | 1 |

### DSGVO & Analytics
| Datei | Beschreibung |
|-------|--------------|
| `dsgvo-analytics.js` | DSGVO-konforme Analytics |
| `seo-dsgvo-config.js` | SEO & DSGVO Konfiguration |

### UI & Effekte
| Datei | Beschreibung |
|-------|--------------|
| `scroll-effects.js` | Scroll-Animationen |
| `product-visualizer.js` | 3D-Produktvisualisierung |

### Seiten-spezifische Scripts
| Datei | Seite | Beschreibung |
|-------|-------|--------------|
| `index.js` | index.html | Startseiten-Logik |
| `produkte.js` | produkte.html | Produktfilter & Suche |
| `produkt-detail.js` | produkt-detail.html | Produktdetail-Seite |
| `kontakt.js` | kontakt.html | Kontaktformular |
| `kontakt-maps.js` | kontakt.html | **NEU** - Google Maps Integration |
| `oelwegweiser.js` | oelwegweiser.html | Öl-Wegweiser Tool |
| `altoelentsorgung.js` | altoelentsorgung.html | Altöl-Entsorgung |
| `ueber-uns.js` | ueber-uns.html | Über uns Seite |
| `datenschutz-inline.js` | datenschutz.html | Datenschutz-Interaktionen |

### Hilfsfunktionen
| Datei | Beschreibung |
|-------|--------------|
| `update-product-links.js` | Aktualisiert Produkt-Links |

---

> 💡 **Hinweis:** Nicht verwendete JS-Dateien wurden nach `/de/archiv/js-unused/` verschoben.

---

## 🔧 Wartung

### Neue Seite hinzufügen
1. Erstelle `seitenname.js` in diesem Ordner
2. Füge `<script src="js/seitenname.js" defer></script>` zur HTML hinzu
3. Füge `<script src="js/shared-init.js" defer></script>` hinzu (für AOS, Dropdowns)
4. Platziere nach `main.js`

### Script-Ladereihenfolge
```html
<!-- Im <head> -->
<script src="js/tailwind-config.js"></script>

<!-- Am Ende des <body> -->
<script src="js/main.js" defer></script>
<script src="js/consent-manager.js" defer></script>
<script src="js/seitenname.js" defer></script>
```

### Unused-Ordner aufräumen
1. Prüfe ob Dateien noch referenziert werden: `grep -r "dateiname" *.html`
2. Dateien mit Status "Kann gelöscht werden" nach Prüfung löschen
3. Archivierte Dateien nach 6 Monaten überprüfen
