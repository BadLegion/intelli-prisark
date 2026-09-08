# Kontrolgrundlag · prisregel revideret 8. september 2026

Seneste fulde regnekontrol: [rettelser, aktuelle tal og kildekontrol](KONTROL.md). Aktuelt: konkret SIP-oprunding, slutbeløb i hele øre, gebyrer i alle DB-tal, ekstra numre og særskilt web-varighed. Tidligere 10-minutters AI-eksempler nedenfor bevarer den daværende 30-sekunders reserve som historisk regressionstest.

Beslutningsarkene er [OpenAI](index.html) og [Gemini](gemini.html). Dette bilag beskriver kontrolarbejdet; det er ikke kundevilkår.


## Rettelse: lange samtaler og kanalleje

Den tidligere anbefaling af en fast pris på 0,89 kr./min. var ikke robust mod alle længder og forbrug. Kanallejen var inkluderet i det tidligere regnestykke, men skjult i telepakkens sum. Den er nu særskilt i både indtægts- og omkostningsvisningen. Twilio Elastic SIP kanal-leje er 0; en eventuel anden faktisk kanaludgift kan indtastes pr. kanal. Nummerleje og serverdrift tælles separat.

Kontroleksempel, OpenAI med samme forbrugsantagelser, 10 kanaler, 10.000 minutter og 10 minutter/opkald:

- Variabel kost: 1,19105055 kr./min. inklusive de viste reserver.
- Fast nettobidrag: 1.495 − 96,75 − 74,60 = 1.323,65 kr./md.
- Gammel minutmargin: 0,89 − 1,19105055 = −0,30105055 kr./min.
- Tabsgrænse: 1.323,65 / 0,30105055 = ca. 4.396,77 min./md.
- Resultat ved 10.000 min.: 1.323,65 − 3.010,5055 = −1.686,8555 kr.

Ingen profit fra andre pakker indgår i dette bevis. Regneoperationerne var konsistente; fejlen var at anbefale en fast salgspris, der ikke dækkede alle de viste kostprofiler.

### Ny foreslået regel

Lad `c` være faktisk registreret variabel kost pr. minut, `g` ønsket dækningsgrad og `f` betalingsgebyr som andel af indtægt. Kræv `g + f < 1`.

`pris = rund_op_til_øre(maks(minimumspris, c / (1 − g − f)))`.

For ethvert forbrug og enhver kost `C` giver reglen `R × (1 − f) − C ≥ g × R`. Længden er irrelevant for dette marginbevis. Når den faste kundebetaling samtidig dækker de faste omkostninger, kan mere registreret taleforbrug ikke skabe et negativt telefonresultat under reglen. Arket tester begge betingelser hver for sig.

Standard `g = 40 %`, `f = 0`: pris mindst `c / 0,60`, med minimum 0,89 kr./AI-min. Web-tale anvender samme marginregel med 0,69 kr. som minimum. Ved 10-minutters OpenAI-budgetprofil giver det 1,99 kr./min. og 9.313,1445 kr. i telefonresultat ved 10.000 minutter, inklusive 1.495 kr. kanalleje samt alle de ovennævnte udgifter.

Forbrugsvurderingen i HTML er fortsat et skøn. Selve kunderegningen skal bygge på registreret kost, ikke på 20 % fiktiv ekstra leverandørfakturering. Skønsreserven er synlig i budgettet. Eventuelle yderligere variable telefonudgifter har deres eget felt og skal indgå i afregningsgrundlaget. De tidligere tre fastprisforslag bevares kun som sammenligning med risiko og tabsgrænse. I virksomhedens +50 %-kolonne følger talerevenue den valgte afregningsregel; øvrige modulpriser er faste.

### Grænser for beskyttelsen

Reglen er foreslået, ikke implementeret i produktets afregning. Den kræver korrekt registrering af alle betalbare led, afstemning mod leverandørregninger, klare kundevilkår, dækning af faste udgifter og kontrol af betaling. Forudbetalt saldo skal reserveres for alle samtidige sessioner og maksimalt næste svar/betalte handling. Ukendt saldo/kost eller utilstrækkelig saldo skal blokere nye betalte handlinger. Et simpelt stop, efter næste leverandørregning kommer, beskytter ikke.

SMS-, mail- og chatpakker er ikke omfattet af talereglen og kontrolleres særskilt. Høj tilgængelighed, ekstra lager/trafik, support og andre ikke-oplyste udgifter er ikke gjort gratis af regnearket. Nye priser beskytter heller ikke mod manglende betaling, fejl i målingen eller kunders manglende accept af kostbaseret afregning.

Den lokale konfiguration har 10-minutters timeout. 60/120-minutters regneprofiler er derfor hypotetisk stress uden historikkomprimering, ikke dokumenteret fakturakost for den aktuelle drift. Rigtige API-kontekstvinduer er begrænsede. Stresstesten bruger også 5 × variabel kost uden at foregive en bestemt leverandørpris; den nye afregningsregel dækker den, fordi betalingen følger kost.

### Efterprøvning af denne revision

1.920 kombinationer af vilkårlig kost, minutvolumen, kanaler, mål-DG og gebyr efterprøver marginuligheden og telefonresultatet. Hertil kommer uafhængig reproduktion af det gamle tab og tabsgrænsen, summering af samtlige AI-kostled, nulforbrug, kontekstprofiler, cache, ekstern kanalleje, ekstra variabel telekost, web-tale og synlig registrering af udækkede faste udgifter. Browserkontrollen efterprøver især 10-minutters-eksemplet, skift mellem gammel og ny prisregel, ugyldige inputs, gem/genåbn og fravær af netværkskald.

## Hvad er kontrolleret?

Offentlige priser fra Twilio SIP/SMS, GatewayAPI, OpenAI, Google, Hetzner og Bland er læst. GatewayAPIs dynamisk indlæste DK-tabel viste **0,0401 EUR**; søgeindeksets ældre 0,033 EUR er forkastet. Twilio-satserne er også genkontrolleret i indlæste sider. Kildelinks findes i begge HTML-filer. Kontopriser, rabatter og faktiske regninger er ikke tilgængelige.

Brugeroplysninger: eksisterende Hetzner-server ca. 10 EUR/md.; marginal mailafsendelse 0 kr.; ejerløn foreløbigt 0 kr. Præcis servermodel, lokation, moms og øvrige fakturalinjer er ikke verificeret. Alle salgspriser er egne forslag.

## Kodekontrol i version 8

| Fil / sted | Fund og betydning |
|---|---|
| `config/config.json`, udvalgte ikke-hemmelige felter | Telefonprovider OpenAI, `gpt-realtime-mini`, `openaiRegion=global`; Gemini-model 3.1 Flash Live Preview. Lokal fil er ikke bevis for live-serverens opsætning. |
| `src/backends/gemini-backend.js:309` og `src/aicost.js:112` | Lydtokenantal føres ind i felter for sekunder. Sekund-/minutbaseret kost kan derfor ikke bruges som korrekt tokenregnskab. Kontekst og tekst skal med. |
| `src/backends/openai-backend.js:577` og `src/aicost.js` | Audio input indeholder også cached input. Det eksisterende kostled kan dobbeltregne dette; tekstoutput og inputtransskription er ikke fuldt medregnet. |
| `src/backends/openai-backend.js:292` | Inputtransskription med `gpt-4o-transcribe` er aktiveret som standard og er en særskilt AI-udgift. |
| `src/gemini.js:771` | Begge transskriptioner og kontekstkomprimering sættes op. Tomt `slidingWindow` fastlægger ikke et målt forbrugsloft. |
| `src/tekstagent.js:396` og `:418` | Webchat har Gemini 3.7 Flash som fallback; SMS/mail 2.5 Flash, med alternativ OpenAI-fallback efter nøgler/valg. Op til fem værktøjsrunder pr. svar. Tekstpriserne i arket forudsætter Gemini-ruten. |
| `src/taleweb.js:310` | Web-tale bruger Gemini, også når telefonen bruger OpenAI. |
| `src/sms.js:129` | GatewayAPI, CPSMS og Twilio er implementeret. Valgt SMS-konto/aftale er ikke bekræftet. GatewayAPI-udgående beskeder og Twilio-tovejsrobot prissættes særskilt. |
| `src/mailer.js:31` | SMTP gennem eksisterende mailkonto; ingen dokumenteret stykafgift. Mailafsendelsens 0 kr. følger brugerens oplysning. AI-mailarbejde er separat. |
| `src/lydspole.js:25` | Stereo 16 kHz PCM kræver ca. 3,84 MB/minut. Lokal optagelse er aktiveret med én dags retention. Ekstra kopier/logs kommer oveni. |
| `server.js:78` og `:310` | Standardgrænsen er 3 samtidige opkald uden override; workerpool kan konfigureres. Salg af 10–100 kanaler kræver faktisk konfiguration og test. |
| `deploy/extensions_intelli.conf:92` | Kommentaren om gratis telefoni efter REFER er ikke korrekt som Twilio-prisregel: indgående og nyt udgående PSTN-led betales stadig. |
| `server.js`, `/api/beregner` | Den gamle beregner bruger Programmable Voice-prisgrundlag. HTML-arkene modellerer den oplyste Elastic SIP-vej. |

Produktkoden, secrets og live-konfiguration er ikke ændret i dette arbejde. Eksisterende produkts kostvisning bør korrigeres og afstemmes, før den bruges som fakturabevis.

## Sådan beregnes talekosten

For en ensartet samtale med længde `L` og `T = ceil(L × AI-svar pr. minut)`:

- Nye inputlydtokens: `I`. Nye outputlydtokens: `O`.
- Gentagne inputlydtokens over alle runder: `(I + O) × (T − 1) / 2`.
- Første prompt faktureres én gang. Gentaget prompt og teksthistorik: `P × (T − 1) + transskriptionstokens × (T − 1) / 2`.
- Hvert led ganges med korrekt input-/outputtakst. OpenAI-cache rabatterer kun den valgte andel af gentaget input, ikke ny lyd eller output. Gemini bruger ingen cacherabat.
- OpenAI inputtransskription lægges til særskilt. AI-summen får 20 % skønsreserve og divideres med `L`.
- SIP-input afrundes pr. opkald: `ceil(L) × SIP-takst`. Ekstra reserve er 0 som standard og kan tilvælges efter oprunding. Opkaldets slutbetaling rundes op til hele øre. Web-tale bruger sin egen varighed.

Dette er en analytisk model med jævnt fordelt tale, ikke replay af faktiske opkald. Lydtokenrater, rundetal, prompt, historik, afbrydelser, komprimering, udbyderspecifik VAD og thinking gør faktisk kost variabel. Gennemsnitslængden alene er utilstrækkelig ved en bred blanding af korte og lange samtaler; udgiften er ikke lineær i samtalelængde. Arkene viser derfor også 1/3/10-minutters profiler og et +50 % AI-scenarie.

Mail-/SMS-/chat-AI bruger samlede tokens på tværs af alle svarrunder. Automatisering koster AI-tokens; ren mailtransport er 0 kr. Twilio-nummeret tælles én gang pr. kunde, også når SMS-robotten benytter det.

## Lokal kapacitetstest

Kommando: `node scripts/belastning-lyd.js --samtaler=10,20,50,100 --sekunder=20 --modelandel=1 --optagelse=fil`.

| Sessioner | CPU-kerner | RAM-top MiB | p99 lydarbejde ms | Missede 20-ms-frister | Uventet afsluttet |
|---:|---:|---:|---:|---:|---:|
| 10 | 0,09 | 67,15 | 2,16 | 2 | 0 |
| 20 | 0,16 | 69,95 | 3,07 | 3 | 0 |
| 50 | 0,22 | 87,86 | 5,92 | 2 | 0 |
| 100 | 0,55 | 165,86 | 10,95 | 4 | 0 |

Lokal Intel i7-9700K / Windows / Node 24.19.0, 20 sekunder pr. trin. AI og telefontransport er testdata; der blev ikke ringet til eksterne modtagere eller købt AI-forbrug. Testen dækker lydbehandling og filoptagelse, men ikke Asterisk, TLS/netværk, rigtig AI, langsomme værktøjer, fuld databasebelastning eller den aktuelle Hetzner-maskine. Ingen filfejl. Den dokumenterer ikke 100 opkald i produktion.

De foreslåede servertrin giver et konkret budget ud fra publicerede serverpriser. De er ikke en benchmarkgaranti. Fler-serverdrift, automatisk failover, AI-kvoter og højere CPS er ikke prissat som færdigimplementeret enterprise-SLA.

## Efterprøvning af artefakterne

`../arbejde-prisark/byg-prisoverblik.py` bygger begge selvstændige HTML-filer fra fælles skabelon, beregningsmotor og UI. `test-prisoverblik.cjs` efterprøver uafhængige regnestykker, cache, nulvolumen, inkluderede minutter, omstilling, SMS-segmenter, gebyrer, ejerløn, fælles serverdrift, alle teleplaner/kanaltrin, tab, ugyldige felter, gem/genåbn, mobilbredde og fravær af netværkskald. HTML og printlayout er visuelt kontrolleret.

For at erstatte skøn med faktiske kostpriser kræves leverandørforbrug pr. model/kanal afstemt mod faktura, reelle SIP-varigheder pr. led og SMS-segmenter. EU/EØS-status kræver kontrol af hele den valgte kæde, herunder dataregioner og aftaler. Disse oplysninger er ikke opfundet eller antaget verificeret.


## Revision 8. september 2026: adskil tilbud fra tabsgivende historik

Tidligere browser- og printkontrol ovenfor beskriver revisionen 7/9. I denne revision er fastprisplanerne fjernet fra hovedarkets valg. Kun kostbaseret afregning beregner hovedresultatet. Historiske tab står fortsat synligt, når den særskilte sammenligning åbnes. Negative aktuelle resultater og udækkede faste udgifter bevares som advarsler.

`callEconomics` bruger hvert opkalds egen varighed og totale kost. Den beregner `rate = ceil_øre(max(prisgulv, (opkaldskost/varighed)/(1-DG-gebyr)))`, `indtægt = rate × varighed`, `DB = indtægt × (1-gebyr) − opkaldskost`. Summen af opkald med mindst mål-DG bevarer samme nedre DG, selv når opkaldslængderne varierer. Den homogene månedstabel er fortsat kun en budgetprofil, ikke en fakturaalgoritme ud fra gennemsnitslængde.

Efterprøvning i denne revision: 1.920 eksisterende marginkombinationer samt 252 ekstra kombinationer af individuel varighed, faktisk opkaldskost og gebyr. En blanding af 900 ét-minuts og 100 ti-minutters opkald efterprøver, at kost ud fra gennemsnittet 1,9 minutter undervurderer den samlede kost, mens individuel kostafregning bevarer marginen. Gemini 10 minutter: kost 9,3644325 kr., betaling 15,70 kr., DB 6,3355675 kr. Standard-telefonresultat ved 10.000 minutter er 7.659,2175 kr. inkl. kanalleje og alle valgte faste telefonudgifter.

Numeriske tests, JavaScript-syntaks og HTML-referencer kontrolleres lokalt. Den åbne file://-fane kunne ikke aflæses med browserværktøjet, fordi URL-politikken blokerede den; der påstås ikke en ny visuel browser- eller printkontrol. Prisændringen er stadig et dokumenteret forslag, ikke en implementeret tabsstopfunktion i produktet.


## Seneste revision 8/9: AI-loft og særskilt omstillingsforbrug

`calculate` begrænser AI-profilen til `aiCap` (standard 8). Antal AI-minutter i månedsscenariet betyder faktisk AI-forbrug efter loftet; det omskrives ikke til menneskelig samtaletid. Månedens `transferQty` angives separat som summen af hvert viderestillet opkalds afrundede minutter. Dermed undgås automatisk antagelse om, at alle opkald viderestilles. Hovedvisningen begrænser også varighedsfeltet til loftet. `voice` og `callEconomics` bevarer deres ukappede analytiske funktion til historiske kosttests, men bruges ikke til mere end loftet i den nye hovedvisning.

`cappedJourney` viser et konkret forløb med A = min(samlet tid, AI-loft, evt. tidligere omstilling) og F = samlet tid − A. AI-kost = AI-skøn med reserve × A + ceil(A) × indgående SIP-takst + ekstra variabel AI-telekost × A. Viderestillingskost = ceil(F) × (indgående SIP + udgående destination + øvrig viderestillingskost). Viderestillingens omsætning = ceil(F) × destinationens salgsforslag. AI-kost og AI-betaling vokser ikke, når kun F vokser. Opkaldseksempler tilføjer ikke også den gennemsnitlige SIP-afrundingsreserve.

Ved en bro kan det indgående led være sammenhængende: ceil(A+F) ≤ ceil(A)+ceil(F). Fasevis afrunding er derfor konservativ. Fakturering skal bruge leverandørens reelle ben, ventetider, afrundinger og fakturaposter, ikke summere både hele parent-varigheden og den samme indgående tid en ekstra gang. De konkrete eksempler forudsætter vellykket overgang og ingen ekstra parallel AI-session.

`transferPricing` kræver en kendt dansk mobil-/fastnetdestination. Pris = ceil_øre(max(destinationens prisgulv, kost/(1-transferMargin-fee))). Standardprisgulve er 0,49 og 0,29; transferMargin er 20 %. Begge led koster efter REFER ifølge Twilios origination/PSTN-tabel. Ekstra betalt optagelse eller andre variable udgifter kan indtastes separat. SIP og transfer-priser er genkontrolleret 8/9 2026.

`telephony` inkluderer nu AI, kanalleje, viderestilling, nummer, server, valgt support, øvrige faste udgifter, løn og gebyr. Pakketabellen og virksomhedstabellen indeholder samme viderestilling én gang. Den gamle `phoneEconomics` er bevaret som AI + faste teleudgifter til dokumentation og historiske regressionstests.

Kodefund: `src/session.js:1987` bruger config.timeoutMinutes (lokalt 10) til afsked/lukning med op til 8 sekunders ekstra afsked, ikke automatisk viderestilling. Implementeringen skal annoncere/forberede overgangen før loftet og stoppe AI ved loftet. Aftalt fallback ved intet svar må ikke genstarte en ny gratis periode. `deploy/extensions_intelli.conf:92` har fortsat en ukorrekt kommentar om gratis REFER. `src/twilio-rest.js:71` beskriver særskilt måling efter TwiML-omstilling, hvilket ikke i sig selv dokumenterer SIP-afregning. Ved SIP/REFER skal Twilio parent/child-data indsamles og afstemmes også efter app-sessionens afslutning. Kapacitetsregnskab og kreditkontrol skal dække aktive viderestillinger; dette er ikke implementeret af prisarkets ændring.


Efterprøvet i cap-revisionen: 384 kombinationer af model, AI-loft, destination, gebyr og viderestillingslængde (inkl. brøkdele og meget lange forløb), sammen med de eksisterende 1.920 margin- og 252 opkaldstests. Tidlig omstilling, nulforbrug, opadgående afrunding pr. opkald, uændret AI-kost efter loftet og månedlig afstemning er kontrolleret. HTML-id-referencer og JavaScript-syntaks kontrolleres; ingen ny visuel browser-/printkontrol påstås.
