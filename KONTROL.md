# Regnekontrol · 9. september 2026

Aktiv hovedmodel: **Gemini, fast 1,50 kr./påbegyndt AI-minut, 8 min. AI-loft, 100 % viderestilling**. Den gamle kostfølgende salgsregel er ikke aktiv.

## Efterregnet standardcase

3 digitale medarbejdere, 1.000 opkald, hvert opkald 8 min. AI + 10 min. DK mobilomstilling. 0 SMS, ét inkluderet telefonnummer, 0 partner/gebyr.

| Post | DKK |
|---|---:|
| 3 × 2.500 kr. abonnement | 7.500,000 |
| 8.000 AI-min. × 1,50 kr. | 12.000,000 |
| 10.000 omstillingsmin. × 0,49 kr. | 4.900,000 |
| Samlet indtægt | 24.400,000 |
| Gemini inkl. reserve + indgående SIP | 6.276,108 |
| Omstilling, begge SIP-led | 3.811,950 |
| Ét mobilnummer | 96,750 |
| Samlet direkte kost | 10.184,808 |
| DB | 14.215,192 |
| Server | 74,600 |
| Supportreserve, planlægningsskøn | 500,000 |
| Resultat før skat efter valgte udgifter | 13.640,592 |

DG = 14.215,192 / 24.400 = ca. 58,3 %. Ikke-oplyst arbejde, opstart, udvikling og særskilt SLA er ikke prissat. Tallet er ikke et garanteret virksomhedsoverskud.

## Kontroller

- `node test-beregning.cjs`: 648 uafhængige runde-for-runde-regnskaber for kald og måneder. Kost-oraklet summerer hver AI-runde og bruger ikke motorens trekantsformel.
- Begge modeller, begge omstillingsruter, korte/hele/brudte minutter, 0/2/10 % gebyr, 0/20 % partner, cache, +50 % AI-kost, ekstern kost og ekstra numre.
- Håndberegnede standardscenarier med 500/1.000/2.000/10.000 opkald. Alle opkald omstilles.
- 6 sek. AI afregnes som 1 min.; 3 min. 1 sek. som 4 min. Tomt kald koster ikke et fantomminut.
- 8 min. AI + op til 10.000 min. menneske: AI-kost stopper ved omstilling. Fast salgspris ændres ikke automatisk; reelle tab vises.
- Partner kun på abonnement sammenlignes med partner på hele regningen. Enhedsøkonomi efter provision vises særskilt.
- Den genbrugte leverandørkostmotor har desuden bestået den eksisterende uafhængige Decimal-kontrol af 122 scenarier.
- HTML og PDF bruger samme beregningsmotor. Detaljer vises med 6 decimaler; eksplicit visningsafrunding sikrer, at kolonnernes viste delsummer stemmer. Det er ikke en leverandørudgift.

## Fortolkning af risiko

Ved 8 min. Gemini er variabel kost 0,7845135 kr./min. inkl. 20 % AI-reserve; DB ved 1,50 kr. er 0,7154865 kr./min. Ved yderligere 50 % AI-kost er kost 1,15516275 kr./min. og DB 0,34483725 kr./min. uden gebyr/provision.

Gennemsnittet omfatter allerede de dyre slutminutter. Første minut alene: 0,260322 kr. Ottende minut alene: 1,308705 kr. Sum af alle otte minutter: 6,276108 kr. Minut-for-minut-kolonnen beregnes som forskellen mellem den akkumulerede kost ved minut n og n-1. Det er den samme normale profil; stresstesten med flere svar/mere AI-tale er en anden profil.

Ved 6 svar/min. og 60 % AI-tale bliver skønnet 1,6448145 kr./min.; fast 1,50 kr. giver tab. Derfor skal token-/værktøjsgrænser, et koststop med stopreserve og automatisk omstilling implementeres. Et HTML-ark kan ikke garantere, at det faktiske system håndhæver disse regler.

Lange omstillinger er ikke gratis: (0,0067 + 0,0524) USD × 6,45 = 0,381195 kr./min. til DK mobil. Salg 0,49 kr.; DB 0,108805 kr./min. før gebyr/provision. Ved positiv margin stiger DB med omstillingens længde; 100 % omstilling er et højt forbrugsscenarie, ikke et matematisk maksimalt tab.

Se [kostgrundlaget og de primære kilder](GRUNDLAG.md). Kunder og forhandlingsnoter er anonymiseret i den offentlige udgave.
