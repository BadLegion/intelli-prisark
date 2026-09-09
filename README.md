# INTELLI · Gemini-prisark

Fast salgsforslag: **1,50 kr. pr. påbegyndt AI-minut + 2.500,00 kr. pr. digital medarbejder om måneden**, ekskl. moms.

- [Kompakt overblik · 7 sider](https://badlegion.github.io/intelli-prisark/praesentation.html)
- [Redigerbar PowerPoint](https://badlegion.github.io/intelli-prisark/INTELLI-prispraesentation.pptx)
- [Åbn Gemini-prisarket](https://badlegion.github.io/intelli-prisark/gemini.html)
- [Printklar PDF · 7 sider](https://badlegion.github.io/intelli-prisark/INTELLI-prisark-print.pdf)
- [OpenAI · reference](https://badlegion.github.io/intelli-prisark/openai.html)
- [Kostgrundlag](GRUNDLAG.md) og [regnekontrol](KONTROL.md)

Standardscenarie: Gemini, 8 min. AI, **alle opkald viderestilles**, derefter 10 min. til DK mobil. 30 og 60 min. omstilling vises også. Ingen inkluderede minutter. Ét mobilnummer pr. kunde inkluderet.

Digitale medarbejdere angiver samtidige kundesamtaler. Leverandørens standardkanalleje er 0,00 kr.; abonnementet er INTELLIs salgspris. Faste priser ændres ikke automatisk, når kost stiger: tab vises som tab.

AI-kost er et kvalificeret skøn, ikke målt fakturakost eller en garanti. Tidsloft, automatisk omstilling og et fuldt koststop er endnu ikke implementeret i telefonkoden. Målopsætningen er flersproget Gemini 3.1 Flash Live på Vertex AI, når modellen bliver tilgængelig dér. EU/EØS er et lanceringskrav. Vertex-pris og konkret EU-region skal bekræftes; Developer API-priser er foreløbigt regnegrundlag.

## Arbejd med tallene

HTML-filerne er selvstændige og har ingen eksterne script-afhængigheder. Redigér forudsætninger i arket og brug **Gem HTML med mine tal**. Det kompakte overblik, PowerPoint og PDF viser samme standardscenarie fordelt på syv sider, med alle minutpriser på første side. Prisberegnerens Print-knap bruger dine aktuelle tal.

`beregning.cjs` indeholder beregningen. Kør den uafhængige kontrol med Node:

```sh
node test-beregning.cjs
node test-visning.cjs
```

Kontrolleret 9. september 2026. Tidligere tilbud findes i Git-historikken. Forsiden viser nu Gemini; OpenAI er flyttet til `openai.html`.
