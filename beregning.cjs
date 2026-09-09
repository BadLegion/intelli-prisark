/* Research date: 2026-09-07. Estimates are deliberately separate from supplier rates. */
const DEFAULTS = {
  model:'openai', plan:'protected', targetMargin:40, trunkRent:0, phoneExtra:0, channels:10, usd:6.45, eur:7.46,
  minutes:10000, duration:3, turns:3, prompt:4000, talk:40, userTalk:60,
  geminiStream:100, cache:0, reserve:20, future:0, rounding:0, webDuration:3,
  smsQty:2000, smsProvider:'gateway', smsExtra:0, dialogQty:500,
  dialogIn:1, dialogOut:1, mailQty:1000, chatQty:1000, webQty:500,
  aiCap:8, transferQty:1000, transferDestination:'mobile', transferFixedPrice:0.29,
  transferMargin:20, transferExtra:0, extraNumbers:0,
  smsOn:true, dialogOn:true, mailOn:true, chatOn:true, webOn:false,
  baseEur:10, ccx13:42.99, ccx23:85.99, backup:20, ipv4:0.5,
  other:0, salary:0, support:0, fee:0, standby:false,
  price10:1495, price20:1995, price50:2995, price100:4995,
  payRate:1.29, enterpriseRate:0.89, packPrice:3995, packMinutes:3000, packOver:0.79,
  transferPrice:0.49, numberPrice:125, smsGatewayPrice:0.35, smsTwilioPrice:0.45,
  dialogPrice:299, dialogAiPrice:0.10, smsInPrice:0.06,
  mailPrice:299, mailIncluded:1000, mailOver:0.15,
  chatPrice:499, chatIncluded:1000, chatOver:0.25, webPrice:499, webRate:0.69,
  smsInput:10000, smsOutput:1000, mailInput:20000, mailOutput:1500,
  chatInput:20000, chatOutput:1500,
  gatewayEur:0.0401, smsOutUsd:0.0592, smsInUsd:0.0075,
  sipInUsd:0.0067, sipMobileUsd:0.0524, sipFixedUsd:0.0200, numberUsd:15,
  oAudioIn:10, oAudioCached:0.30, oAudioOut:20, oTextIn:0.60, oTextCached:0.06, oTextOut:2.40,
  gAudioIn:3, gAudioOut:12, gTextIn:0.75, gTextOut:4.50,
  transcribeUsd:0.006, transcriptTokens:200
};
const TIERS=[10,20,50,100];
const RATE_SOURCES={
  sip:'https://www.twilio.com/en-us/sip-trunking/pricing/dk',
  sms:'https://www.twilio.com/en-us/sms/pricing/dk',
  gateway:'https://gatewayapi.com/pricing/',
  openai:'https://developers.openai.com/api/docs/pricing',
  gemini:'https://ai.google.dev/gemini-api/docs/pricing'
};
function voice(s, model=s.model, duration=s.duration) {
  const T=Math.max(1,Math.ceil(duration*s.turns));
  const isO=model==='openai', aiIn=(isO?10:25)*60*duration*(isO?s.userTalk:s.geminiStream)/100;
  const aiOut=(isO?20:25)*60*duration*s.talk/100;
  const newAudio=aiIn, historicAudio=(aiIn+aiOut)*(T-1)/2;
  const transcript=s.transcriptTokens*duration;
  const newText=s.prompt, historicText=s.prompt*(T-1)+transcript*(T-1)/2;
  // Only repeated input is eligible for the assumed cache hit rate. Output is never discounted.
  const cache=isO?s.cache/100:0;
  const audioInRate=isO?s.oAudioIn:s.gAudioIn, textInRate=isO?s.oTextIn:s.gTextIn;
  const audioUsd=(newAudio*audioInRate+historicAudio*((1-cache)*audioInRate+cache*s.oAudioCached)+aiOut*(isO?s.oAudioOut:s.gAudioOut))/1e6;
  const textUsd=(newText*textInRate+historicText*((1-cache)*textInRate+cache*s.oTextCached)+transcript*(isO?s.oTextOut:s.gTextOut))/1e6;
  const transcriptionUsd=isO?duration*s.userTalk/100*s.transcribeUsd:0;
  const raw=(audioUsd+textUsd+transcriptionUsd)/duration*s.usd;
  const budget=raw*(1+s.reserve/100)*(1+s.future/100);
  const sip=s.sipInUsd*s.usd;
  // The scenario assumes equal call lengths, so use each call's actual started minutes.
  // Optional extra seconds are a separate contingency, never a replacement for rounding.
  const billedSipMinutes=Math.ceil(duration-1e-10),extraSipMinutes=s.rounding/60;
  const roundedSip=sip*(billedSipMinutes+extraSipMinutes)/duration;
  const fx=s.usd/1e6;
  const audioHistoryRate=(1-cache)*audioInRate+cache*s.oAudioCached;
  const textHistoryRate=(1-cache)*textInRate+cache*s.oTextCached;
  const components=[
    {id:'newAudio',label:'Ny lyd ind',tokens:newAudio,rate:audioInRate,cost:newAudio*audioInRate*fx},
    {id:'historicAudio',label:'Lydhistorik læst igen',tokens:historicAudio,rate:audioHistoryRate,cost:historicAudio*audioHistoryRate*fx},
    {id:'outAudio',label:'AI-stemme ud',tokens:aiOut,rate:isO?s.oAudioOut:s.gAudioOut,cost:aiOut*(isO?s.oAudioOut:s.gAudioOut)*fx},
    {id:'newText',label:'Prompt og værktøjer · første gang',tokens:newText,rate:textInRate,cost:newText*textInRate*fx},
    {id:'historicText',label:'Prompt og teksthistorik læst igen',tokens:historicText,rate:textHistoryRate,cost:historicText*textHistoryRate*fx},
    {id:'outText',label:'Tekst / transskription ud',tokens:transcript,rate:isO?s.oTextOut:s.gTextOut,cost:transcript*(isO?s.oTextOut:s.gTextOut)*fx},
    {id:'transcription',label:'Separat inputtransskription',minutes:isO?duration*s.userTalk/100:0,minuteRate:s.transcribeUsd,cost:transcriptionUsd*s.usd}
  ];
  return {T,raw,budget,audio:audioUsd/duration*s.usd,text:textUsd/duration*s.usd,
    transcription:transcriptionUsd/duration*s.usd,sip,roundedSip,phone:budget+roundedSip+s.phoneExtra,
    totalCall:(budget+roundedSip+s.phoneExtra)*duration,billedSipMinutes,extraSipMinutes,newAudio,historicAudio,newText,historicText,components};
}
function infrastructure(s,totalChannels) {
  const base=s.baseEur*s.eur;
  const medium=(s.ccx13*(1+s.backup/100)+s.ipv4)*s.eur;
  const large=(s.ccx23*(1+s.backup/100)+s.ipv4)*s.eur;
  let cost,label,hosts;
  if(totalChannels<=20){cost=base;label='Nuværende server';hosts=1;}
  else if(totalChannels<=50){cost=medium;label='CCX13 + backup + IPv4';hosts=1;}
  else{hosts=Math.ceil(totalChannels/100);cost=hosts*large;label=hosts+' × CCX23 + backup + IPv4';}
  return {cost:cost*(s.standby?2:1),label,hosts:hosts*(s.standby?2:1),base,medium,large};
}
function units(s) {
  const factor=(1+s.reserve/100)*(1+s.future/100);
  const text=(input,output,inRate,outRate)=>(input*inRate+output*outRate)/1e6*s.usd*factor;
  return {phone:voice(s).phone,web:voice(s,'gemini',s.webDuration).budget,
    smsGateway:s.gatewayEur*s.eur+s.smsExtra,smsTwilio:s.smsOutUsd*s.usd+s.smsExtra,
    smsIn:s.smsInUsd*s.usd,smsAI:text(s.smsInput,s.smsOutput,.30,2.50),
    mailSend:0,mailAI:text(s.mailInput,s.mailOutput,.30,2.50),
    chatAI:text(s.chatInput,s.chatOutput,.75,3.75),
    number:s.numberUsd*s.usd,transfer:(s.sipInUsd+s.sipMobileUsd)*s.usd,
    transferFixed:(s.sipInUsd+s.sipFixedUsd)*s.usd};
}
function protectedRate(s,unitCost,minimum=s.enterpriseRate) {
  const remaining=1-(s.targetMargin+s.fee)/100;
  if(remaining<=0)throw new RangeError('Mål-DG plus betalingsgebyr skal være under 100 %.');
  // Contract proposal: actual registered variable cost / remaining, rounded UP to the next øre/minute.
  return Math.ceil((Math.max(minimum,unitCost/remaining)-1e-10)*100)/100;
}
function callEconomics(s,duration,actualCost=voice(s,s.model,duration).totalCall) {
  if(!Number.isFinite(duration)||duration<=0||!Number.isFinite(actualCost)||actualCost<0)throw new RangeError('Opkald kræver positiv varighed og kendt, ikke-negativ kost.');
  // Apply to EACH call's own cost. A rate derived from the mean call length is not a billing rule.
  const rate=protectedRate(s,actualCost/duration);
  // Billable money must not round DOWN and invalidate the minimum margin on short calls.
  const revenue=Math.ceil((rate*duration-1e-10)*100)/100;
  const fees=revenue*s.fee/100,db=revenue-fees-actualCost;
  return {duration,cost:actualCost,rate,revenue,fees,db,dg:revenue?db/revenue:null};
}
function transferPricing(s,destination=s.transferDestination) {
  if(!['mobile','fixed'].includes(destination))throw new RangeError('Vælg dansk mobil eller fastnet. Andre destinationer kræver egen takst.');
  const incoming=s.sipInUsd*s.usd;
  const outgoing=(destination==='mobile'?s.sipMobileUsd:s.sipFixedUsd)*s.usd;
  const cost=incoming+outgoing+s.transferExtra;
  const minimum=destination==='mobile'?s.transferPrice:s.transferFixedPrice;
  const rate=protectedRate({...s,targetMargin:s.transferMargin},cost,minimum);
  const db=rate*(1-s.fee/100)-cost;
  return {destination,incoming,outgoing,cost,rate,db,dg:rate?db/rate:null};
}
function cappedJourney(s,totalMinutes,transferAfter=s.aiCap) {
  if(!Number.isFinite(totalMinutes)||totalMinutes<0||!Number.isFinite(transferAfter)||transferAfter<0||!(s.aiCap>0))throw new RangeError('Ugyldig opkaldslængde eller AI-grænse.');
  const aiMinutes=Math.min(totalMinutes,s.aiCap,transferAfter),transferMinutes=totalMinutes-aiMinutes;
  const billedTransferMinutes=Math.max(0,Math.ceil(transferMinutes-1e-10)),p=transferPricing(s);
  // Explicit durations: round each phone phase upwards. No additional average rounding reserve.
  // Splitting the inbound leg is conservative for a bridge that bills one continuous inbound leg.
  const aiCost=aiMinutes?voice(s,s.model,aiMinutes).totalCall:0;
  const ai=aiMinutes?callEconomics(s,aiMinutes,aiCost):{cost:0,revenue:0,db:0,fees:0};
  const transferCost=billedTransferMinutes*p.cost,transferRevenue=billedTransferMinutes*p.rate;
  const transferFees=transferRevenue*s.fee/100;
  const cost=ai.cost+transferCost,revenue=ai.revenue+transferRevenue,fees=ai.fees+transferFees;
  return {aiMinutes,transferMinutes,billedTransferMinutes,ai,transferCost,transferRevenue,
    transferDb:transferRevenue-transferFees-transferCost,cost,revenue,fees,db:revenue-fees-cost,dg:revenue?(revenue-fees-cost)/revenue:null};
}
function planBill(s,plan=s.plan,unitCost=voice(s).phone) {
  if(plan==='protected'){
    const call=callEconomics(s,s.duration,unitCost*s.duration),effectiveRate=call.revenue/s.duration;
    return {revenue:s['price'+s.channels]+s.minutes*effectiveRate,channels:s.channels,
      rate:call.rate,effectiveRate,base:s['price'+s.channels],fixedRevenue:s['price'+s.channels],included:0};
  }
  if(plan==='pay') return {revenue:s.numberPrice+s.minutes*s.payRate,channels:10,rate:s.payRate,base:s.numberPrice,fixedRevenue:s.numberPrice,included:0};
  if(plan==='pack') return {revenue:s.packPrice+s['price'+s.channels]-s.price10+Math.max(0,s.minutes-s.packMinutes)*s.packOver,
    channels:s.channels,rate:s.packOver,base:s.packPrice+s['price'+s.channels]-s.price10,fixedRevenue:s['price'+s.channels],included:s.packMinutes};
  return {revenue:s['price'+s.channels]+s.minutes*s.enterpriseRate,channels:s.channels,rate:s.enterpriseRate,base:s['price'+s.channels],fixedRevenue:s['price'+s.channels],included:0};
}
function phoneEconomics(s,plan=s.plan,unitCost=voice(s).phone) {
  const p=planBill(s,plan,unitCost),hosting=infrastructure(s,p.channels).cost,channelCost=p.channels*s.trunkRent;
  const fixedCost=s.numberUsd*s.usd+hosting+channelCost+s.support+s.other+s.salary;
  const fixedNet=p.fixedRevenue*(1-s.fee/100)-fixedCost;
  const variableCost=unitCost*s.minutes,variableRevenue=p.revenue-p.fixedRevenue;
  const variableNet=variableRevenue*(1-s.fee/100)-variableCost;
  const slope=p.rate*(1-s.fee/100)-unitCost;
  // Fixed-rate package net = intercept + slope * minutes above its included quota.
  const intercept=(p.base-p.included*p.rate)*(1-s.fee/100)-fixedCost;
  const netAtZero=p.base*(1-s.fee/100)-fixedCost;
  const withinQuota=p.included>0&&unitCost>0&&netAtZero>0&&netAtZero/unitCost<=p.included?netAtZero/unitCost:null;
  const afterQuota=slope<0&&intercept>0&&intercept/-slope>=p.included?intercept/-slope:null;
  return {p,hosting,channelCost,fixedCost,fixedNet,variableCost,variableRevenue,variableNet,slope,
    result:fixedNet+variableNet,fees:p.revenue*s.fee/100,
    breakEven:withinQuota??afterQuota,
    fixedCovered:fixedNet>=-1e-8,usageCovered:plan==='protected'||slope>=0};
}
function calculate(input) {
  const s={...input,duration:Math.min(input.duration,input.aiCap)};
  const u=units(s), p=planBill(s), rows=[];
  const add=(id,name,revenue,cost,enabled=true)=>{
    const fees=enabled?revenue*s.fee/100:0,db=enabled?revenue-cost-fees:0;
    rows.push({id,name,revenue:enabled?revenue:0,cost:enabled?cost:0,fees,enabled,db,
      directCost:enabled?cost+fees:0,dg:enabled&&revenue>0?db/revenue:null});
  };
  add('channel',s.plan==='pay'?'Nummerleje · ingen kanalleje':'Kanalleje / platform inkl. ét nummer',p.fixedRevenue,u.number+p.channels*s.trunkRent);
  add('phone','AI-telefon · forbrug',p.revenue-p.fixedRevenue,u.phone*s.minutes);
  const transfer=transferPricing(s);
  add('transfer','Viderestilling · '+(s.transferDestination==='mobile'?'DK mobil':'DK fastnet'),s.transferQty*transfer.rate,transfer.cost*s.transferQty);
  add('number','Ekstra telefonnumre',s.extraNumbers*s.numberPrice,s.extraNumbers*u.number);
  add('sms','SMS-beskeder',s.smsQty*(s.smsProvider==='gateway'?s.smsGatewayPrice:s.smsTwilioPrice),
    s.smsQty*(s.smsProvider==='gateway'?u.smsGateway:u.smsTwilio),s.smsOn);
  add('dialog','SMS-robot · tovejs',s.dialogPrice+s.dialogQty*(s.dialogAiPrice+s.dialogOut*s.smsTwilioPrice+s.dialogIn*s.smsInPrice),
    s.dialogQty*(u.smsAI+s.dialogOut*u.smsTwilio+s.dialogIn*u.smsIn),s.dialogOn);
  add('mail','Mail-robot',s.mailPrice+Math.max(0,s.mailQty-s.mailIncluded)*s.mailOver,s.mailQty*u.mailAI,s.mailOn);
  add('chat','Webchat',s.chatPrice+Math.max(0,s.chatQty-s.chatIncluded)*s.chatOver,s.chatQty*u.chatAI,s.chatOn);
  const webRate=s.plan==='protected'?protectedRate(s,u.web,s.webRate):s.webRate;
  add('web','Tale på hjemmesiden',s.webPrice+s.webQty*webRate,s.webQty*u.web,s.webOn);
  const revenue=rows.reduce((a,r)=>a+r.revenue,0), cost=rows.reduce((a,r)=>a+r.cost,0);
  const fees=revenue*s.fee/100, db=revenue-cost-fees;
  const compute=infrastructure(s,p.channels), result=db-compute.cost-s.support-s.other-s.salary;
  const company=[1,5,10,25].map(n=>{
    const infra=infrastructure(s,p.channels*n), dbN=db*n;
    const ai=(s.minutes*voice(s).budget+(s.dialogOn?s.dialogQty*u.smsAI:0)+(s.mailOn?s.mailQty*u.mailAI:0)+(s.chatOn?s.chatQty*u.chatAI:0)+(s.webOn?s.webQty*u.web:0))*n;
    const stressedPhone=voice(s).phone+voice(s).budget*.5;
    const webRecovered=s.plan==='protected'&&s.webOn?s.webQty*(protectedRate(s,u.web*1.5,s.webRate)-webRate):0;
    const recovered=planBill(s,s.plan,stressedPhone).revenue-p.revenue+webRecovered;
    return {n,revenue:revenue*n,cost:(cost+fees)*n,db:dbN,hosting:infra.cost,channels:p.channels*n,
      result:dbN-infra.cost-s.support*n-s.other-s.salary,
      stress:dbN-infra.cost-s.support*n-s.other-s.salary-ai*.5+recovered*n*(1-s.fee/100)};
  });
  const phone=phoneEconomics(s),transferRow=rows.find(r=>r.id==='transfer'),numberRow=rows.find(r=>r.id==='number');
  const telephony={revenue:p.revenue+transferRow.revenue+numberRow.revenue,
    cost:phone.variableCost+phone.fixedCost+transferRow.cost+numberRow.cost,
    fees:phone.fees+transferRow.fees+numberRow.fees,result:phone.result+transferRow.db+numberRow.db};
  // A subscription can hide a loss on every additional unit. Report that separately.
  const net=price=>price*(1-s.fee/100);
  const marginal=[
    {id:'sms',name:'SMS',enabled:s.smsOn,db:net(s.smsProvider==='gateway'?s.smsGatewayPrice:s.smsTwilioPrice)-(s.smsProvider==='gateway'?u.smsGateway:u.smsTwilio)},
    {id:'dialog',name:'SMS-robot',enabled:s.dialogOn,db:net(s.dialogAiPrice+s.dialogOut*s.smsTwilioPrice+s.dialogIn*s.smsInPrice)-u.smsAI-s.dialogOut*u.smsTwilio-s.dialogIn*u.smsIn},
    {id:'mail',name:'Mail over pakken',enabled:s.mailOn,db:net(s.mailOver)-u.mailAI},
    {id:'chat',name:'Webchat over pakken',enabled:s.chatOn,db:net(s.chatOver)-u.chatAI}
  ];
  return {scenario:s,u,p,rows,revenue,cost,fees,db,dg:revenue>0?db/revenue:null,compute,result,company,calls:s.minutes/s.duration,phone,webRate,transfer,telephony,marginal};
}
if(typeof module!=='undefined'&&module.exports)module.exports={DEFAULTS,TIERS,voice,infrastructure,units,protectedRate,callEconomics,transferPricing,cappedJourney,planBill,phoneEconomics,calculate};

/* Fixed-price proposal, 2026-09-09. No supplier-cost clipping or automatic repricing. */
const FastPrice = (() => {
  const E = typeof module !== 'undefined' && module.exports ? {DEFAULTS,voice,units,infrastructure} : {DEFAULTS,voice,units,infrastructure};
  const defaults = {...E.DEFAULTS, model:'gemini', workers:3, workerPrice:4000, fixedRate:1.50, aiCap:8,
    calls:1000, duration:8, forwarded:1000, forwardDuration:10, smsQty:0,
    extraNumbers:0, support:500, partner:0, partnerBasis:'subscription',
    transferPrice:.49, transferFixedPrice:.29, fee:0, other:0, salary:0};
  const started = x => x>0 ? Math.ceil(x-1e-10) : 0;
  const profit = (revenue,cost,fee=0) => ({revenue,cost,fees:revenue*fee/100,db:revenue*(1-fee/100)-cost,dg:revenue ? (revenue*(1-fee/100)-cost)/revenue : null});
  function transfer(s,destination=s.transferDestination) {
    const incoming=s.sipInUsd*s.usd,outgoing=(destination==='mobile'?s.sipMobileUsd:s.sipFixedUsd)*s.usd;
    const rate=destination==='mobile'?s.transferPrice:s.transferFixedPrice;
    return {incoming,outgoing,rate,...profit(rate,incoming+outgoing+s.transferExtra,s.fee)};
  }
  function call(s,aiDuration,forwardDuration=0) {
    if(aiDuration<0 || aiDuration>s.aiCap+1e-9 || forwardDuration<0)throw new RangeError('AI-tid skal være mellem 0 og det valgte loft.');
    const v=aiDuration?E.voice(s,s.model,aiDuration):null, billedAI=started(aiDuration),billedForward=started(forwardDuration),t=transfer(s);
    const aiCost=v?v.totalCall:0,forwardCost=billedForward*t.cost;
    return {aiDuration,forwardDuration,billedAI,billedForward,aiCost,forwardCost,
      ...profit(billedAI*s.fixedRate+billedForward*t.rate,aiCost+forwardCost,s.fee)};
  }
  function month(s,override={}) {
    s={...s,...override};
    if(s.duration>s.aiCap || s.forwarded>s.calls || s.calls<0 || s.workers<1)throw new RangeError('Ugyldigt månedsscenarie.');
    const a=call(s,s.duration),t=transfer(s),u=E.units(s),hosting=E.infrastructure(s,s.workers).cost;
    const subscription=s.workers*s.workerPrice,billedAI=s.calls*a.billedAI,billedForward=s.forwarded*started(s.forwardDuration);
    const rows=[
      {name:'Digitale medarbejdere + ét nummer',revenue:subscription,cost:u.number+s.workers*s.trunkRent},
      {name:'AI-minutter',revenue:billedAI*s.fixedRate,cost:s.calls*a.aiCost},
      {name:'Viderestillede minutter',revenue:billedForward*t.rate,cost:billedForward*t.cost},
      {name:'SMS-segmenter · GatewayAPI',revenue:s.smsQty*s.smsGatewayPrice,cost:s.smsQty*u.smsGateway},
      {name:'Ekstra mobilnumre',revenue:s.extraNumbers*s.numberPrice,cost:s.extraNumbers*u.number}
    ];
    const revenue=rows.reduce((a,r)=>a+r.revenue,0),supplierCost=rows.reduce((a,r)=>a+r.cost,0);
    const commission=(s.partnerBasis==='all'?revenue:subscription)*s.partner/100,fees=revenue*s.fee/100;
    const directCost=supplierCost+commission+fees,db=revenue-directCost;
    const fixed=hosting+s.support+s.other+s.salary,result=db-fixed;
    const usageCommission=s.partnerBasis==='all'?s.partner/100:0;
    const marginal=[['Afregnet AI-minut',s.fixedRate,a.aiCost/a.billedAI],['Omstilling',t.rate,t.cost],['SMS-segment',s.smsGatewayPrice,u.smsGateway]]
      .map(([name,price,cost])=>({name,db:price*(1-s.fee/100-usageCommission)-cost}));
    return {s,rows,subscription,revenue,supplierCost,commission,fees,directCost,db,dg:revenue?db/revenue:null,marginal,
      hosting,fixed,result,billedAI,billedForward,actualAI:s.calls*s.duration,
      actualForward:s.forwarded*s.forwardDuration,capacityMinutes:s.workers*30*24*60,
      theoreticalUtilisation:(s.calls*s.duration+s.forwarded*s.forwardDuration)/(s.workers*30*24*60)};
  }
  function report(s) {
    const v=E.voice(s,s.model,s.duration),m=month(s),u=E.units(s);
    const lengths=[.1,1,3,4,8];
    const durationRows=lengths.map(d=>{
      const a=call({...s,aiCap:Math.max(s.aiCap,d)},d),base=E.voice(s,s.model,d);
      const stressCost=base.totalCall+base.budget*d*.5;
      return {duration:d,...a,costPerActualMinute:a.cost/d,stressCost,stressDb:a.revenue*(1-s.fee/100)-stressCost};
    });
    const journeys=[0,5,10,30,60].map(f=>call(s,s.duration,f));
    const timeline=[];let previous={cost:0,revenue:0,db:0};
    for(let minute=1;minute<=Math.ceil(s.aiCap);minute++){
      const total=call(s,Math.min(minute,s.aiCap));
      timeline.push({minute,cost:total.cost-previous.cost,revenue:total.revenue-previous.revenue,db:total.db-previous.db,cumulative:total.cost});previous=total;
    }
    const tiers=[1,3,10,20,50,100].map(n=>({n,subscription:n*s.workerPrice,hosting:E.infrastructure(s,n).cost,
      externalRent:n*s.trunkRent,number:u.number,extraHosting:E.infrastructure(s,n).cost-s.baseEur*s.eur}));
    const scenarios=[
      {label:'1 medarbejder · 500 opkald',workers:1,calls:500,forwarded:500},
      {label:'3 medarbejdere · 1.000 opkald',workers:3,calls:1000,forwarded:1000},
      {label:'3 medarbejdere · 2.000 opkald',workers:3,calls:2000,forwarded:2000},
      {label:'20 medarbejdere · 10.000 opkald',workers:20,calls:10000,forwarded:10000}
    ].map(x=>({label:x.label,...month(s,{...x,duration:s.duration,forwardDuration:s.forwardDuration,smsQty:0,extraNumbers:0,partner:0})}));
    const partners=[0,10,20,30].flatMap(p=>['subscription','all'].filter(b=>p||b==='subscription').map(b=>({p,b,...month(s,{partner:p,partnerBasis:b})})));
    const alternatives=[1,1.5].flatMap(price=>[4,8].map(d=>{
      const v=E.voice(s,s.model,d),revenue=price*d;
      return {price,d,cost:v.phone,db:price*(1-s.fee/100)-v.phone,stressDb:price*(1-s.fee/100)-v.phone-v.budget*.5};
    }));
    const fast=E.voice({...s,turns:6,talk:60},s.model,s.aiCap);
    const risks={fastCost:fast.totalCall/started(s.aiCap),fastDb:s.fixedRate*(1-s.fee/100)-fast.totalCall/started(s.aiCap),
      costBudget:s.fixedRate*(1-.2-s.fee/100-(s.partnerBasis==='all'?s.partner/100:0))};
    const competitors=[{name:'Bland Start',subscription:0,rate:.14,concurrency:10,daily:100},
      {name:'Bland Build',subscription:299,rate:.12,concurrency:50,daily:2000},
      {name:'Retell eksempel',subscription:0,rate:.11,concurrency:20,daily:null}].map(x=>({
        ...x,monthly:x.subscription*s.usd+x.rate*s.usd*s.duration*1000+s.sipInUsd*s.usd*started(s.duration)*1000+transfer(s).cost*started(s.forwardDuration)*1000+u.number,
        total10000:x.subscription*s.usd+x.rate*s.usd*s.duration*10000+s.sipInUsd*s.usd*started(s.duration)*10000+transfer(s).cost*started(s.forwardDuration)*10000+u.number}));
    return {s,v,u,m,durationRows,journeys,timeline,tiers,scenarios,partners,alternatives,risks,competitors,
      mobile:transfer(s,'mobile'),fixed:transfer(s,'fixed')};
  }
  return {defaults,started,transfer,call,month,report,voice:E.voice};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=FastPrice;
