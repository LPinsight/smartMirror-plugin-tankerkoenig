# smartMirror-Plugin Tankerkönig

Dieses Plugin zeigt Spritpreise von Tankstellen in der Umgebung auf deinem smartMirror an. Zusätzlich kann eine bevorzugte Tankstelle über ihre Tankerkönig-UUID abgefragt werden.

Die Daten stammen aus der [Tankerkönig-API](https://creativecommons.tankerkoenig.de/). Bitte beachte deren Nutzungsbedingungen und die dort beschriebenen Regeln für regelmäßige Abfragen.

## Funktionen

- Umkreissuche mit `list.php`
- Auswahl einer Spritsorte: Super E5, Super E10 oder Diesel
- Sortierung der Umkreisergebnisse nach Preis oder Entfernung
- Begrenzung der angezeigten Tankstellen
- Abfrage einer bevorzugten Tankstelle über ihre UUID mit `prices.php`
- Anzeige des Öffnungsstatus

## Installation

Installiere beziehungsweise registriere `smartMirror-plugin-tankerkoenig` in deiner smartMirror-Installation entsprechend dem dort verwendeten Plugin-Verfahren. Anschließend kannst du das Plugin in der smartMirror-Konfiguration hinzufügen und seine Einstellungen ausfüllen.

Plugin-Repository: <https://github.com/LPinsight/smartMirror-plugin-tankerkoenig>

## Konfiguration

| Einstellung | Beschreibung | Beispiel / Standard |
| --- | --- | --- |
| Tankerkönig API-Key | Persönlicher API-Key von Tankerkönig | UUID |
| UUID der bevorzugten Tankstelle | ID der Tankstelle für die separate Preisabfrage | UUID |
| Sortierung | Sortierung der Umkreisergebnisse | `Preis` oder `Entfernung` |
| Spritsorte | Kraftstoff für die Umkreissuche | `e5`, `e10` oder `Diesel` |
| Spiegel Standort | Einstellung für die Standortauswahl | Standard: aktiviert |
| Alternative Koordinate (lat) | Breitengrad für die Umkreissuche | z. B. `49.9265` |
| Alternative Koordinate (lon) | Längengrad für die Umkreissuche | z. B. `8.4069` |
| Suchradius | Suchradius in Kilometern; Tankerkönig erlaubt maximal 25 km | Standard: `25` |
| Maximale Tankstellen | Maximale Zahl der angezeigten Umkreisergebnisse | Standard: `5` |
| Aktualisierungsintervall | Intervall in Minuten | Standard: `20` |

Der API-Key und die bevorzugte Tankstellen-UUID müssen im UUID-Format eingetragen werden. Den API-Key erhältst du über die [Tankerkönig-Website](https://creativecommons.tankerkoenig.de/). Eine UUID findest du in den Daten einer Tankstelle, etwa in den Ergebnissen der Umkreissuche.

### API-Abfragen

Für die Tankstellen in der Umgebung wird `list.php` verwendet. Für die bevorzugte Tankstelle wird `prices.php` mit ihrer UUID verwendet. Die API gibt bei einer einzelnen Spritsorte in der Umkreissuche den Preis unter `price` zurück. Die separate Preisabfrage liefert Preise je UUID sowie einen Status wie `open` oder `closed`.

Die Tankerkönig-API kann maximal 25 km Suchradius abfragen. Sie empfiehlt außerdem, regelmäßige Abfragen zu vermeiden beziehungsweise sie auf das notwendige Maß zu begrenzen. Wähle daher ein angemessenes Aktualisierungsintervall und beachte die aktuellen [API-Hinweise](https://creativecommons.tankerkoenig.de/?page=info).

## Projektstruktur

```text
smartMirror-plugin-tankerkoenig/
├── config.json
├── plugin.json
└── ui/
    ├── main.js
    ├── style.css
    ├── template.html
    ├── assets/
    │   ├── open.png
    │   └── closed.png
    └── logic/
        ├── umkreis.js
        └── bevorzugt.js
```

- `main.js` lädt Template und Stylesheet, startet beide Abfragen und aktualisiert die Anzeige.
- `logic/umkreis.js` fragt Tankstellen im konfigurierten Radius ab.
- `logic/bevorzugt.js` fragt die bevorzugte Tankstelle per UUID ab.
- `template.html` enthält das HTML-Grundgerüst.
- `style.css` enthält die Darstellung.

## Lizenz und Datenhinweis

Die Tankerkönig-Daten stehen laut Anbieter unter **CC BY 4.0**. Beachte die erforderliche Namensnennung und die Nutzungsbedingungen der API. Weitere Informationen stehen auf der [Tankerkönig-API-Seite](https://creativecommons.tankerkoenig.de/?page=info).
