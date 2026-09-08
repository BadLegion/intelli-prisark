# Regnekontrol · 8. september 2026

**Regneoperationerne er kontrolleret. AI-forbruget og serverkapaciteten er fortsat budgetskøn.**

## Rettelser

- SIP afrundes nu op til hele minutter pr. opkald. Den tidligere 30-sekunders gennemsnitsreserve kunne undervurdere meget korte opkald og overvurdere opkald på præcis hele minutter. Måned og opkaldseksempler bruger nu samme metode. Ekstra reserve kan tilvælges særskilt.
- Slutbeløbet for hvert AI-opkald rundes op til hele øre, så små beløb ikke afrundes under den aftalte mål-DG. Månedsscenariet anvender samme regel.
- Alle pakkers DB og DG er efter betalingsgebyrer. Kostkolonnen inkluderer gebyret, og pakkerne summerer til samme DB som hovedresultatet.
- Ekstra numre indgår nu også i delresultatet for telefonien, både som indtægt og kost.
- Web-tale har sin egen samtalelængde. Telefonens AI-loft forkorter ikke længere web-samtaler i beregningen.
- Negativ margin på ekstra SMS-, mail- og chatforbrug markeres, også når abonnementet skjuler tabet i månedens samlede DB.
- Den historiske minutpakkes tabsgrænse håndterer også tab, der begynder inden de inkluderede minutter er brugt.

## Standardtal · ekskl. moms

3 AI-minutter/opkald, 10 kanaler, 10.000 AI-minutter og 1.000 påbegyndte viderestillingsminutter til dansk mobil. 2.000 udgående SMS-segmenter, 500 SMS-robotsvar, 1.000 mailbehandlinger og 1.000 chatsvar. Web-tale fravalgt. Løn, support, øvrige udgifter og betalingsgebyrer: 0.

| Pr. kunde / måned | Gemini | OpenAI |
|---|---:|---:|
| Indtægt | 12.987,00 kr. | 12.987,00 kr. |
| Direkte kost inkl. gebyr | 5.648,64 kr. | 6.512,43 kr. |
| DB | 7.338,36 kr. | 6.474,57 kr. |
| Resultat efter server | 7.263,76 kr. | 6.399,97 kr. |
| DG | 56,51 % | 49,85 % |
| Telefonresultat alene | 6.231,55 kr. | 5.367,76 kr. |

| Variabel enhedskost | Gemini | OpenAI |
|---|---:|---:|
| AI-del inkl. 20 % reserve / AI-min. | 0,366876 | 0,453254 |
| SIP / AI-min. ved 3-minutters profil | 0,043215 | 0,043215 |
| AI-telefon i alt / AI-min. | 0,410091 | 0,496469 |

Satserne er minutbudgetter for den konkrete profil, ikke faste kostpriser for enhver samtale.

## Uafhængig efterprøvning

En separat Python-beregning med Decimal regner hver AI-svarrunde ud og sammenholder resultatet med JavaScript-motoren. 122 scenarier dækker begge modeller, cache, valutakurser, tokenforbrug, gebyrer, kanaludgifter, ekstra numre, inkluderede mængder og fravalgte moduler. 488 virksomhedsrækker med +50 % AI-kost og 732 komplette opkald er afstemt. Hertil kommer 1.920 marginprøver, 252 enkeltopkaldsprøver og 384 AI-loft/viderestillingsprøver samt målrettede regressionstests.

PDF-tal er afstemt mod samme motordata, og alle fire sider er visuelt kontrolleret. Beregningerne bruger fuld præcision; viste afrundede tabeltal kan give en mindre afrundingsdifference, når de lægges sammen manuelt.

## Genkontrollerede priskilder

- [Twilio SIP](https://www.twilio.com/en-us/sip-trunking/pricing/dk): indgående 0,0067 USD/min.; udgående mobil 0,0524; fastnet 0,0200; nummer 15 USD/md.; standard kanalleje 0.
- [Twilio viderestilling](https://www.twilio.com/docs/sip-trunking/call-transfer#pricing) og [oprunding](https://help.twilio.com/articles/223132307): både indgående og udgående PSTN-led betales; oprunding pr. opkaldsled.
- [Twilio SMS](https://www.twilio.com/en-us/sms/pricing/dk): 0,0592 USD ud og 0,0075 USD ind pr. segment. Eventuelle tillæg skal afstemmes mod den konkrete konto.
- [GatewayAPI](https://gatewayapi.com/pricing/): den færdigindlæste DK-tabel viste igen 0,0401 EUR pr. segment den 8/9, standardafsender.
- [OpenAI](https://developers.openai.com/api/docs/pricing): udvidet “All models” under Realtime viste gpt-realtime-mini lyd 10 / 0,30 / 20 USD pr. mio. input/cache/output; tekst 0,60 / 0,06 / 2,40. Inputtransskription separat. [Tokenregler](https://developers.openai.com/api/docs/guides/realtime-costs).
- [Gemini](https://ai.google.dev/gemini-api/docs/pricing): Live 3.1 lyd 3 / 12; tekst 0,75 / 4,50. SMS/mail 2.5 Flash 0,30 / 2,50; chat 3.7 Flash 0,75 / 3,75 gennem 2026. [Historik og transskription](https://ai.google.dev/gemini-api/docs/live-api/best-practices#pricing-billing).
- [Hetzner](https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/): Tyskland/Finland CCX13 42,99 EUR og CCX23 85,99 EUR ekskl. moms og IPv4. Den eksisterende server til ca. 10 EUR er ejeroplyst.

## Hvad kontrollen ikke beviser

Ingen leverandørfakturaer eller produktionsmålinger er afstemt. Taleprocent, prompt, tekst/transskription, cache, værktøjsrunder, komprimering og fremtidigt forbrug er usikre. 20 % reserve er ikke et maksimum. EU/EØS og 10-100 samtidige opkald er ikke dokumenteret i produktion. Det justerbare AI-loft, automatisk omstilling og kostbaseret afregning er forslag i dokumentet; de er ikke implementeret ved at rette prisarkene.

Derfor kan arket vise en matematisk dækket margin ved korrekt kostafregning, men ikke garantere virksomhedens overskud uanset drift, betaling og ukendte udgifter.
