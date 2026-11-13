# smartMirror-Plugin Tankerkönig

Das Plugin zeigt aktuelle Preise und Entfernungen von Tankstellen im konfigurierten Umkreis an. Die Daten werden über die freie [Tankerkönig-API](https://creativecommons.tankerkoenig.de/?page=info) abgerufen.

## Funktionen

- Umkreissuche mit der Tankerkönig-Methode `list.php`
- Auswahl von Super E5, Super E10 oder Diesel
- Sortierung nach Preis oder Entfernung
- Begrenzung der angezeigten Tankstellen
- Optionaler Filter für geöffnete Tankstellen
- Hervorhebung der bevorzugten Tankstelle, wenn sie in den Umkreisergebnissen enthalten ist
- Hervorhebung der günstigsten und teuersten angezeigten Tankstelle

## Installation

Füge das Plugin deiner smartMirror-Installation über das dort vorgesehene Plugin-Verfahren hinzu und aktiviere es in der Spiegelkonfiguration. Das Repository befindet sich unter <https://github.com/LPinsight/smartMirror-plugin-tankerkoenig>.

## Konfiguration

| Einstellung | Beschreibung | Standard / Hinweis |
| --- | --- | --- |
| Tankerkönig API-Key | Persönlicher API-Key für die Anfragen | Erforderlich; UUID |
| UUID der bevorzugten Tankstelle | Tankstellen-ID, die in der Liste bevorzugt werden soll | Optional; UUID |
| Sortierung | Reihenfolge der API-Ergebnisse | `Preis` oder `Entfernung`; Standard: `Preis` |
| Spritsorte | Kraftstoff für die Abfrage | `e5`, `e10` oder `Diesel`; Standard: `e10` |
| Spiegel Standort | Vorgesehene Auswahl für den Standort | Noch nicht ausgewertet; siehe Standort-Hinweis unten |
| Alternative Koordinate (lat) | Breitengrad des Suchmittelpunkts | Erforderlich, z. B. `49.9265` |
| Alternative Koordinate (lon) | Längengrad des Suchmittelpunkts | Erforderlich, z. B. `8.4069` |
| Suchradius | Radius der Umkreissuche in km | Standard: `25`; Tankerkönig erlaubt höchstens 25 km |
| Maximale Tankstellen | Höchstzahl der Einträge in der Anzeige | Standard: `5` |
| Aktualisierungsintervall | Zeit zwischen automatischen Aktualisierungen in Minuten | Standard: `20`; mindestens 5 Minuten verwenden |
| Nur geöffnete Tankstellen anzeigen | Filtert geschlossene Tankstellen aus der Anzeige | Standard: deaktiviert |

Einen API-Key erhältst du über Tankerkönig. Trage ihn nur in die Plugin-Konfiguration ein und veröffentliche ihn nicht in Quellcode oder Screenshots.

### Standort-Hinweis

Die Konfiguration enthält zwar die Option „Spiegel Standort“, der aktuelle Code verwendet sie aber noch nicht. Für die Umkreissuche müssen deshalb gültige Werte in den Feldern `lat` und `lon` stehen. Ohne diese Koordinaten wird das Widget nicht geladen.

### Bevorzugte Tankstelle

#### UUID herausfinden

Die UUID ist die Tankstellen-ID aus der Tankerkönig-API. Rufe dafür die Umkreissuche mit deinen Koordinaten, dem gewünschten Radius, der Spritsorte und deinem API-Key auf. Die URL hat dieses Format:

```text
https://creativecommons.tankerkoenig.de/json/list.php?lat=BREITENGRAD&lng=LAENGENGRAD&rad=RADIUS&sort=dist&type=e10&apikey=DEIN_API_KEY
```

Ersetze die Platzhalter durch deine Werte. Die Antwort ist JSON. Suche darin unter `stations` nach der gewünschten Tankstelle und kopiere den Wert von `id`, zum Beispiel:

```json
{
  "id": "474e5046-deaf-4f9b-9a32-9797b778f047",
  "name": "Tankstellenname",
  "place": "Ort"
}
```

Trage diese `id` im Plugin in das Feld **UUID der bevorzugten Tankstelle** ein. Verwende dabei deinen persönlichen API-Key und teile die vollständige URL nicht, da sie den Schlüssel enthält.

Die UUID wird mit den IDs der Umkreissuche verglichen. Wenn die bevorzugte Tankstelle in den gültigen, nicht herausgefilterten Suchergebnissen vorkommt, wird sie hervorgehoben und bei Bedarf in die angezeigte Auswahl aufgenommen. Liegt sie außerhalb des Suchradius oder wird sie durch den Filter „Nur geöffnete Tankstellen“ beziehungsweise einen fehlenden Preis ausgeschlossen, kann sie in der aktuellen Version nicht ergänzt werden. Eine separate Preisabfrage über `prices.php` ist derzeit nicht implementiert.

## Daten und Aktualisierung

Das Plugin fragt `list.php` für eine ausgewählte Spritsorte ab. Tankerkönig liefert bei einer einzelnen Sorte den Preis unter dem Feld `price`; Einträge ohne positiven numerischen Preis werden übersprungen. Die Antwort enthält außerdem unter anderem Tankstellen-ID, Marke, Ort, Entfernung und Öffnungsstatus.

Die API begrenzt den Umkreis auf 25 km. Für Smart-Mirror- und Home-Automation-Systeme verlangt Tankerkönig mindestens fünf Minuten Abstand zwischen Preisabfragen. Das Plugin sollte daher nicht mit einem kleineren Intervall konfiguriert werden. Details und aktuelle Bedingungen stehen in der [Tankerkönig-API-Dokumentation](https://creativecommons.tankerkoenig.de/?page=info).

Die Tankerkönig-Daten stehen unter **CC BY 4.0**. Beachte die erforderliche Namensnennung sowie die Nutzungsbedingungen des Anbieters.

## Projektstruktur

```text
smartMirror-plugin-tankerkoenig/
├── config.json
├── plugin.json
├── README.md
└── ui/
    ├── main.js
    ├── style.css
    ├── template.html
    └── logic/
        └── umkreis.js
```

- `config.json` beschreibt die Einstellungen des Plugins.
- `plugin.json` enthält Name, Version und Repository-Metadaten.
- `ui/main.js` lädt die Oberfläche, zeigt die Konfiguration an und startet die Aktualisierung.
- `ui/logic/umkreis.js` fragt die Tankstellen ab, filtert und begrenzt die Ergebnisse und erzeugt die Listeneinträge.
- `ui/template.html` enthält das HTML-Grundgerüst und die Vorlage für einen Tankstelleneintrag.
- `ui/style.css` gestaltet Einstellungen und Tankstellenliste.
