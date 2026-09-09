# INTELLI · Gemini-prisark

Fast salgsforslag: **1,50 kr. pr. påbegyndt AI-minut + 2.500 kr. pr. digital medarbejder om måneden**, ekskl. moms.

- [Åbn Gemini-prisarket](https://badlegion.github.io/intelli-prisark/gemini.html)
- [Printklar PDF · 3 sider](https://badlegion.github.io/intelli-prisark/INTELLI-prisark-print.pdf)
- [OpenAI · reference](https://badlegion.github.io/intelli-prisark/openai.html)
- [Kostgrundlag](GRUNDLAG.md) og [regnekontrol](KONTROL.md)

Standardscenarie: Gemini, 8 min. AI, **alle opkald viderestilles**, derefter 10 min. til DK mobil. 30 og 60 min. omstilling vises også. Ingen inkluderede minutter. Ét mobilnummer pr. kunde inkluderet.

Digitale medarbejdere angiver samtidige kundesamtaler. Leverandørens standardkanalleje er 0 kr.; abonnementet er INTELLIs salgspris. Faste priser ændres ikke automatisk, når kost stiger: tab vises som tab.

AI-kost er et kvalificeret skøn, ikke målt fakturakost eller en garanti. Tidsloft, automatisk omstilling og et fuldt koststop er endnu ikke implementeret i telefonkoden. EU/EØS-behandling er ikke verificeret for hele kæden.

## Arbejd med tallene

HTML-filerne er selvstændige og har ingen eksterne script-afhængigheder. Redigér forudsætninger i arket og brug **Gem HTML med mine tal**. PDF'en viser standardscenariet; knappen Print bruger dine aktuelle tal.

`beregning.cjs` indeholder beregningen. Kør den uafhængige kontrol med Node:

```sh
node test-beregning.cjs
```

Kontrolleret 9. september 2026. Tidligere tilbud findes i Git-historikken. Forsiden viser nu Gemini; OpenAI er flyttet til `openai.html`.
