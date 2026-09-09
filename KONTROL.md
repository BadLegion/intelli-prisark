# Regnekontrol · 9. september 2026

Aktiv hovedmodel: **Gemini, fast 1,50 kr./påbegyndt AI-minut, 8 min. AI-loft, 100 % viderestilling**. Den gamle kostfølgende salgsregel er ikke aktiv.

## Efterregnet standardcase

3 digitale medarbejdere, 1.000 opkald, hvert opkald 8 min. AI + 10 min. DK mobilomstilling. 0 SMS, ét inkluderet telefonnummer, 0 partner/gebyr.

| Post | DKK |
|---|---:|
| 3 × 4.000,00 kr. abonnement | 12.000,00 |
| 8.000 AI-min. × 1,50 kr. | 12.000,00 |
| 10.000 omstillingsmin. × 0,49 kr. | 4.900,00 |
| Samlet indtægt | 28.900,00 |
| Gemini inkl. reserve + indgående SIP | 6.276,11 |
| Omstilling, begge SIP-led | 3.811,95 |
| Ét mobilnummer | 96,75 |
| Samlet direkte kost | 10.184,81 |
| DB | 18.715,19 |
| Server | 74,60 |
| Supportreserve, planlægningsskøn | 500,00 |
| Resultat før skat efter valgte udgifter | 18.140,59 |

DG = 18.715,19 / 28.900,00 = ca. 64,8 %. Ikke-oplyst arbejde, opstart, udvikling og særskilt SLA er ikke prissat. Tallet er ikke et garanteret virksomhedsoverskud.

## Kontroller

- `node test-beregning.cjs`: 648 uafhængige runde-for-runde-regnskaber for kald og måneder. Kost-oraklet summerer hver AI-runde og bruger ikke motorens trekantsformel.
- Begge modeller, begge omstillingsruter, korte/hele/brudte minutter, 0/2/10 % gebyr, 0/20 % partner, cache, +50 % AI-kost, ekstern kost og ekstra numre.
- Håndberegnede standardscenarier med 500/1.000/2.000/10.000 opkald. Alle opkald omstilles.
- 6 sek. AI afregnes som 1 min.; 3 min. 1 sek. som 4 min. Tomt kald koster ikke et fantomminut.
- 8 min. AI + op til 10.000 min. menneske: AI-kost stopper ved omstilling. Fast salgspris ændres ikke automatisk; reelle tab vises.
- Partner kun på abonnement er standard i sammenligningen; partner på hele regningen kan vælges i kundens regnskab. Enhedsøkonomi efter provision vises særskilt.
- Den genbrugte leverandørkostmotor har desuden bestået den eksisterende uafhængige Decimal-kontrol af 122 scenarier.
- 126 kontroller af den faktiske HTML-renderer: enhedspriser, opkaldsfaser, moduler, månedsregnskaber, minutudvikling og AI-detaljer. Alle viste kronebeløb har to decimaler, og øresummerne stemmer.
- Ændret AI-varighed følger med i alle månedsscenarier, viderestillings- og konkurrenttabeller.
- Det kompakte overblik har 7 sider og 12 tabeller. Alle tabeller og kronebeløb er afstemt mellem HTML, PDF og den redigerbare PowerPoint; siderne er desuden visuelt gennemgået.
- Delsummer for AI-kost og månedsregnskab er markeret særskilt. De viste regnelinjer for nummer/support, SMS og månedskost er afstemt i øre. Kanalprisen er fortsat 4.000,00 kr./md.
- HTML, PDF og PowerPoint bruger samme beregningsgrundlag. Alle kronebeløb vises med 2 decimaler; eksplicit visningsafrunding sikrer, at kolonnernes viste delsummer stemmer. Det er ikke en leverandørudgift.

## Fortolkning af risiko

Ved 8 min. Gemini er variabel kost 0,78 kr./min. inkl. 20 % AI-reserve; DB ved 1,50 kr. er 0,72 kr./min. Ved yderligere 50 % AI-kost er kost 1,16 kr./min. og DB 0,34 kr./min. uden gebyr/provision.

Gennemsnittet omfatter allerede de dyre slutminutter. Første minut alene: 0,26 kr. Ottende minut alene: 1,31 kr. Sum af alle otte minutter: 6,28 kr. Minut-for-minut-kolonnen beregnes som forskellen mellem den akkumulerede kost ved minut n og n-1. Det er den samme normale profil; stresstesten med flere svar/mere AI-tale er en anden profil.

Ved 6 svar/min. og 60 % AI-tale bliver skønnet 1,64 kr./min.; fast 1,50 kr. giver tab. Derfor skal token-/værktøjsgrænser, et koststop med stopreserve og automatisk omstilling implementeres. Et HTML-ark kan ikke garantere, at det faktiske system håndhæver disse regler.

Lange omstillinger er ikke gratis: (0,0067 + 0,0524) USD × 6,45 = 0,38 kr./min. til DK mobil. Salg 0,49 kr.; DB 0,11 kr./min. før gebyr/provision. Ved positiv margin stiger DB med omstillingens længde; 100 % omstilling er et højt forbrugsscenarie, ikke et matematisk maksimalt tab.

Se [kostgrundlaget og de primære kilder](GRUNDLAG.md). Kunder og forhandlingsnoter er anonymiseret i den offentlige udgave.
