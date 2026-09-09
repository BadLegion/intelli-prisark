# Kostgrundlag · aktivt forslag 9. september 2026

## Faste priser

| Enhed | Vores kost / budget | Kundens pris |
|---|---:|---:|
| Gemini AI-telefon, 3-min.-opkald | 0,41 kr./faktisk min. | 1,50 kr./påbegyndt min. |
| Gemini AI-telefon, 8-min.-opkald | 0,78 kr./faktisk min. | 1,50 kr./påbegyndt min. |
| Indgående DK mobil-SIP | 0,04 kr./påbegyndt min. | Inkl. i AI- eller omstillingstakst |
| Omstilling DK mobil, begge led | 0,38 kr./påbegyndt min. | 0,49 kr./påbegyndt min. |
| Omstilling DK fastnet, begge led | 0,17 kr./påbegyndt min. | 0,29 kr./påbegyndt min. |
| GatewayAPI SMS ud | 0,30 kr./segment | 0,35 kr./segment |
| Twilio SMS ud / ind | 0,38 / 0,05 kr./segment | 0,45 / 0,06 kr./segment |
| Mailtransport | 0,00 kr. ekstra, oplyst af ejer | 0,00 kr. |
| AI-mail / AI-chat / AI-SMS | 0,08 / 0,16 / 0,04 kr. | Se pakker i HTML |
| DK mobilnummer | 96,75 kr./md. | Ét inkluderet, ekstra 125,00 kr./md. |
| Standard SIP-kanalleje | 0,00 kr./md. | Digital medarbejder: 2.500,00 kr./md. |

SIP er indgående AI-telefoni på dansk mobilnummer. Selvstændig udgående AI-telefoni er ikke prissat her. Viderestilling til andre lande, specialnumre, warm-transfer-overlap, ekstra konferencer og betalte telefeatures kræver særskilt kost. Der er ingen besparelse for gratis telefonben i beregningen.

## AI-skøn

Gemini 3.1 Flash Live Preview: lyd ind/ud 3/12 USD pr. mio. tokens; tekst ind/ud 0,75/4,50 USD. 25 lydtokens pr. sekund. Standard: 100 % streamet input, 40 % AI-tale, 3 svarrunder pr. minut, prompt/værktøjer 4.000 tokens, tekst/transskription 200 tokens/minut, 20 % reserve. Historik genfaktureres pr. runde; komprimering giver ingen indregnet besparelse. Fordelingen er ikke målt på jeres fakturaer.

For varighed L og T = ceil(3 × L) svar: ny lyd I = 1.500 × L; AI-lyd O = 600 × L; genlæst lyd = (I + O) × (T − 1)/2. Prompt første gang = 4.000; genlæst tekst = 4.000 × (T − 1) + 200 × L × (T − 1)/2. Hvert led ganges med USD-pris/mio. og USD/DKK. Herefter AI-reserve og SIP pr. påbegyndt minut.

OpenAI gpt-realtime-mini er kun reference: lyd ind/cache/ud 10/0,30/20 USD; tekst 0,60/0,06/2,40 USD pr. mio. Inputlyd 10 og outputlyd 20 tokens/sek.; brugerlyd 60 %. Separat inputtransskription budgetteres med 0,006 USD/min. brugerlyd. Ingen cachebesparelse som standard. Modellen er ikke udskiftet med en anden Realtime-model.

Tekstpakker bruger kodegrundlagets Gemini-ruter: SMS/mail 2.5 Flash, webchat 3.7 Flash. Skøn omfatter alle værktøjsrunder, men vedhæftninger og særlig lang historik er ikke målt. Web-tale budgetteres særskilt ved tre minutter pr. samtale og kræver sit eget tids-/koststop.

## Afregning og resultat

AI-beløb = 1,50 × ceil(AI-fasens minutter), højst 8 min. AI i tilbuddet. 6 sekunder koster 1,50 kr.; 3 min. 1 sek. koster 6,00 kr. Viderestilling = 0,49 × ceil(omstillingens minutter) til DK mobil. Fastnet = 0,29. Hver fase afrundes pr. opkald. For en bro med ét sammenhængende indgående ben kan den faktiske leverandøroprunding være lidt lavere.

DB = indtægt − leverandørkost inkl. AI-reserve − betalingsgebyr − partnerprovision. DG = DB / indtægt. Resultat før skat = DB − server − supportreserve − øvrige udgifter − ejerløn. Serveren tælles én gang pr. installation, ikke én gang pr. medarbejder. Ét telefonnummer tælles én gang pr. kunde.

Standardpartner er 0 %, fordi intet er aftalt. Tabellen viser 10/20/30 % af abonnementet; provision af hele regningen kan vælges i kundens regnskab. Provision af forbrug kan skabe negativt DB pr. SMS eller omstillingsminut; abonnementet må ikke skjule dette.

## Faste udgifter og usikkerhed

- Hetzner ca. 10 EUR/md. er ejeroplyst. SKU, momsstatus, region og redundans er ikke dokumenteret.
- Planlægningskurser: USD/DKK 6,45; EUR/DKK 7,46. Ingen påstand om live kurser.
- 1-20 samtidige samtaler: 74,60 kr./md. serverbudget. 50: 388,58 kr.; 100: 773,51 kr. Større servere er budgetteret som CCX13/23 i DE/FI, med 20 % backup og 0,50 EUR IPv4. Kapacitetsgrænserne er skøn, ikke en belastningstest.
- Supportreserve 500,00 kr./kunde/md. er et nyt, synligt planlægningsskøn. Ejerløn 0, øvrige udgifter 0, gebyr 0 som standard. Disse nuller er ikke bevis for, at arbejdet er gratis. Opstart, særlige integrationer, SLA og udvikling er ikke prissat.
- Der antages ikke en SMS efter hvert opkald. SMS-antal styres særskilt i segmenter. GSM-7: 160 tegn / 153 ved flersegment; Unicode: 70 / 67. Appnotifikationer foreslås som standard, men udvikling/drift skal prissættes.

## Hvad skal være implementeret før kostbeskyttet salg?

8-minutters AI-stop med automatisk omstilling, separat afregning af AI/omstilling/kø og et koststop med token-/værktøjsgrænser. Kostkontrol skal reservere penge til næste svar, igangværende forbrug og afslutning, før svaret startes. Foreslået budget: 1,20 kr. samlet variabel kost pr. afregnet AI-minut for 20 % DG uden gebyr/forbrugsprovision. Ved højere gebyr eller provision skal budgettet sænkes.

Dette er endnu ikke implementeret af dokumentet. Kontrolleret lokalt: `config/config.json` har 10 min. timeout, `src/session.js` afslutter efter timeout med op til 8 sek. farvel. `src/gemini.js` har sliding-window-compression uden eksplicit tokenbudget. Der er ikke dokumenteret et omkostningsloft ved 8 min. Den tidligere dashboard-estimator medtager ikke hele det fakturerede forbrug og er ikke brugt som facit.

Alle opkald omstillet er et konservativt forbrugsscenarie, ikke den størst mulige tabssituation. Ved positiv omstillingsmargin øges DB, når menneskefasen bliver længere. Ubegrænset/højere AI-forbrug kan stadig skabe tab uden koststop. Ved 8 min., 6 svar/min. og 60 % AI-tale er Gemini-kostskønnet 1,64 kr./min.; 1,50 kr. giver tab på AI-delen.

Målopsætning: Vertex AI med Gemini 3.1 Flash Live, når tilgængelig dér, og dokumenteret EU/EØS-behandling i hele kæden. Gemini er flersproget. Modellens tilgængelighed, EU-region og pris på Vertex er ikke bekræftet i dette ark. Priserne ovenfor er nuværende Developer API-priser, ikke en verificeret Vertex-pris. OpenAI er reference. Et europæisk telefonnummer dokumenterer ikke placeringen af AI-behandling.

## Prisnoternes to forskellige oplæg

20 medarbejdere × 2.500,00 kr. er 50.000,00 kr./md. Et tilbud på 60.000,00 kr. kræver 3.000,00 kr. pr. medarbejder eller en særskilt service på 10.000,00 kr.

3 medarbejdere à 4.000,00 kr. er 12.000,00 kr./md. Med 40 % rabat er førprisen 20.000,00 kr. Det er et andet tilbud end standardens 7.500,00 kr. for tre. Særtilbuddets ekstra leverancer og kost er ikke defineret.

## Leverandører og kilder

AI-, SIP-, omstillings- og konkurrentkilder genbesøgt 9/9 2026. SMS, detaljerede OpenAI-audiopriser og Hetzner bygger også på kontrollen 8/9 2026. Ingen rabataftale eller leverandørfaktura er fremlagt.

- [Vertex-priser](https://cloud.google.com/vertex-ai/generative-ai/pricing): pris og EU-region for 3.1 Flash Live afventer bekræftelse. [Gemini Live-sprog](https://ai.google.dev/gemini-api/docs/live-api/capabilities#supported-languages).
- [Gemini-priser](https://ai.google.dev/gemini-api/docs/pricing) og [historik/transskription](https://ai.google.dev/gemini-api/docs/live-api/best-practices#pricing-billing).
- [OpenAI-priser](https://developers.openai.com/api/docs/pricing) og [Realtime-kost](https://developers.openai.com/api/docs/guides/realtime-costs).
- [Twilio SIP DK](https://www.twilio.com/en-us/sip-trunking/pricing/dk), [viderestilling](https://www.twilio.com/docs/sip-trunking/call-transfer#pricing), [SMS DK](https://www.twilio.com/en-us/sms/pricing/dk).
- [GatewayAPI](https://gatewayapi.com/pricing/): 0,0401 EUR/DK-segment; særskilte afsender-/netværkstillæg kan forekomme.
- [Hetzner](https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/).
- [Bland](https://www.bland.ai/pricing): Start 0 USD + 0,14 USD/min., 10 samtidige, 100 opkald/dag; Build 299 USD + 0,12 USD/min., 50 samtidige, 2.000/dag. BYOT: carrier separat, ingen transfer-platformafgift. Tidligere Scale-plan bruges ikke i den aktuelle sammenligning.
- [Retell](https://www.retellai.com/pricing): eksempel 0,11 USD/min. = 0,04 LLM + 0,055 voice + 0,015 TTS, egen telefoni separat. AI-takst stopper ved omstilling; 20 samtidige inkluderet. Det er et konfigurationseksempel, ikke en generel fast pris for alle modeller.
- [DIDWW](https://doc.didww.com/billing/billing-and-prices/didww-pricing.html): nummer, oprettelse, kapacitet og tale særskilt. DID+2 omfatter 2 kanaler; DID+0 kræver kapacitet. Der mangler et konkret DK-tilbud; ingen opdigtet DK-pris.
- [TDC One+](https://tdc.dk/da/produkter/telefoniløsninger-og-kontaktcenter/omstilling-og-call-center/tdc-erhverv-one-plus-omstilling) og [Telenor TrueTalk](https://www.telenor.dk/erhverv/telefonisystemer/omstilling-truetalk/): omstilling, kø og telefoni. Bed om priser på samme DK-numre, 3/20 samtidige opkald og mobilomstilling; AI er et særskilt lag. Ingen verificeret sammenlignelig AI-totalpris på de gennemgåede sider.

Konkurrentberegninger bruger samme 8 AI-min. + 10 min. DK mobilomstilling pr. opkald og ét Twilio-nummer. 1.000 og 10.000 opkald. Ingen SMS, implementering eller menneskelig support. Bland Start kan ikke levere 10.000 opkald på 30 dage ved maks. 100/dag. INTELLI har 3/20 samtidige, konkurrenterne 10/50/20; priserne er trafiknormaliserede, ikke identiske servicepakker.
