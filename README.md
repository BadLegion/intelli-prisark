# INTELLI - kost og priser

**[Åbn print-PDF: begge modeller](INTELLI-prisark-print.pdf)**

Fire A4-sider i liggende format: to sider for Gemini og to for OpenAI. Udskriv i A4, liggende, ved 100 % eller “Tilpas til siden”. PDF'en bruger standardforudsætningerne fra HTML, med 3 AI-minutter pr. opkald og et maksimalt AI-loft på 8 minutter.

| Ark | Indhold |
|---|---|
| [Gemini Live - åbn beregner](https://badlegion.github.io/intelli-prisark/gemini.html) | Kost først, kanalleje, AI-loft, viderestilling og månedsresultat |
| [OpenAI Realtime - åbn beregner](https://badlegion.github.io/intelli-prisark/) | Samme beregninger med OpenAI som telefonmodel |
| [Kontrolgrundlag](GRUNDLAG.md) | Kilder, formler, kodefund og begrænsninger |
| [Tidligere revisioner](HISTORIK.md) | Historik bag rettelserne af prisstrategien |

## Brug HTML-arkene

Åbn beregnerne direkte via linkene ovenfor. De er udgivet på GitHub Pages. Blå felter kan ændres, og “Gem HTML med mine tal” gemmer en selvstændig kopi. Du kan også hente filerne via **Code → Download ZIP**, pakke dem ud og åbne HTML lokalt. Ændringer, du foretager i beregneren, gemmes ikke automatisk i GitHub eller hos andre brugere.

Knappen **Print-PDF (A4)** åbner den færdige PDF. PDF'en er et fast øjebliksbillede af standardtallene; ændringer i HTML opdaterer ikke PDF automatisk. Arkene er uafhængige, så ændringer flyttes ikke mellem dem.

## Den aktuelle prisregel

- Kanalleje for 10 / 20 / 50 / 100 samtidige opkald. Twilio har 0 kr. i ekstern kanalleje; serverdrift vises separat.
- AI højst **8 minutter**, justerbart i arket. Faktisk AI-kost bestemmer betalingen med mindst 40 % mål-DG efter valgt gebyr; tidsloftet er ikke i sig selv en garanti for tokenkosten.
- Derefter betalt viderestilling, uden mere AI-forbrug: salgsforslag **0,49 kr./påbegyndt minut til dansk mobil** eller **0,29 kr. til dansk fastnet**. Begge telefonled indgår i kostprisen. Andre destinationer kræver deres egen takst.
- Viderestillingens salgsforslag har et prisgulv og mindst 20 % DG efter gebyr. Ændret kost eller gebyr kan hæve forslaget. Viderestillingens varighed begrænses ikke af AI-loftet.
- Mailafsendelse: 0 kr. ekstra efter ejerens oplysning. AI-behandling er en særskilt udgift. Ejerløn: 0 kr. i standardbudgettet.

Alle beløb er DKK ekskl. moms. Valutakurser, AI-forbrug, reserver og serverkapacitet er budgetforudsætninger. Priser er salgsforslag. EU/EØS-behandling er ikke dokumenteret for den nuværende leverandørkæde. Automatisk omstilling ved loftet og den nye fakturering er endnu ikke implementeret i produktet.

Repository: [BadLegion/intelli-prisark](https://github.com/BadLegion/intelli-prisark), offentligt. Priskilder kontrolleret 7.-8. september 2026; PDF og publicering klargjort 8. september 2026.
