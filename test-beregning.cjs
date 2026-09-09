/* Independent per-turn oracle + explicit ledger examples. No API calls. */
const assert=require('node:assert/strict');
const f=require(process.argv[2]||'./beregning.cjs');
const near=(a,b,label)=>assert.ok(Math.abs(a-b)<Math.max(1e-7,Math.abs(b)*1e-11),`${label}: ${a} != ${b}`);
function oracle(s,d){
  const n=Math.max(1,Math.ceil(d*s.turns)),o=s.model==='openai';
  const incoming=(o?600*s.userTalk/100:1500*s.geminiStream/100)*d/n;
  const outgoing=(o?1200:1500)*s.talk/100*d/n,transcript=s.transcriptTokens*d/n;
  const audioRate=o?s.oAudioIn:s.gAudioIn,textRate=o?s.oTextIn:s.gTextIn;
  const cache=o?s.cache/100:0;
  let historyAudio=0,historyText=0,usd=0;
  for(let i=0;i<n;i++){
    usd+=(incoming*audioRate+outgoing*(o?s.oAudioOut:s.gAudioOut)+transcript*(o?s.oTextOut:s.gTextOut))/1e6;
    usd+=s.prompt*(i?(1-cache)*textRate+cache*s.oTextCached:textRate)/1e6;
    usd+=(historyAudio*((1-cache)*audioRate+cache*s.oAudioCached)+historyText*((1-cache)*textRate+cache*s.oTextCached))/1e6;
    historyAudio+=incoming+outgoing;historyText+=transcript;
  }
  if(o)usd+=d*s.userTalk/100*s.transcribeUsd;
  const raw=usd*s.usd,budget=raw*(1+s.reserve/100)*(1+s.future/100);
  return {raw,budget,cost:budget+(Math.ceil(d)+s.rounding/60)*s.sipInUsd*s.usd+d*s.phoneExtra};
}
const s=f.defaults,r=f.report(s);
near(f.voice(s,'gemini',3).totalCall,1.230273,'Gemini 3min');
near(f.voice(s,'gemini',8).totalCall,6.276108,'Gemini 8min');
near(r.m.revenue,24400,'revenue');near(r.m.supplierCost,10184.808,'suppliers');near(r.m.db,14215.192,'DB');near(r.m.result,13640.592,'result');
for(const [i,R,C,DB,P] of [[0,10950,5140.779,5809.221,5234.621],[1,24400,10184.808,14215.192,13640.592],[2,41300,20272.866,21027.134,20452.534],[3,219000,100977.33,118022.67,117448.07]]){
  for(const [key,v] of Object.entries({revenue:R,directCost:C,db:DB,result:P}))near(r.scenarios[i][key],v,'scenario '+i+' '+key);
}
near(f.month(s,{partner:20}).commission,1500,'partner subscription');
near(f.month(s,{partner:20}).result,12140.592,'partner subscription result');
near(f.month(s,{partner:20,partnerBasis:'all'}).commission,4880,'partner all');
near(f.month(s,{partner:20,partnerBasis:'all'}).result,8760.592,'partner all result');
near(f.call(s,8,60).cost,29.147808,'8+60 supplier cost');near(f.call(s,8,60).revenue,41.4,'8+60 revenue');
near(f.call(s,.1).revenue,1.5,'6 seconds are one started minute');
near(f.call(s,3+1/60).revenue,6,'3m1s are four started minutes');
near(f.call(s,0,0).revenue,0,'no phantom call charge');
near(r.timeline[0].cost,.260322,'first minute cost');near(r.timeline[7].cost,1.308705,'eighth minute cost');
near(r.timeline.reduce((a,x)=>a+x.cost,0),6.276108,'timeline sum');
near(r.timeline.reduce((a,x)=>a+x.db,0),5.723892,'timeline profit');
assert.throws(()=>f.call(s,9),RangeError);
assert.throws(()=>f.month(s,{forwarded:1001}),RangeError);
let checked=0;
for(const model of ['gemini','openai'])for(const d of [.01,.1,.99,1,1.01,3,3+1/60,7.99,8])for(const turns of [1,3,6])for(const fee of [0,2,10])for(const partner of [0,20])for(const destination of ['mobile','fixed']){
  const z={...s,model,turns,fee,partner,transferDestination:destination,duration:d,calls:37,forwarded:11,forwardDuration:2.01,smsQty:19,extraNumbers:2,workers:50,phoneExtra:.012,rounding:8,future:50,cache:model==='openai'?50:0};
  const o=oracle(z,d),a=f.call(z,d,2.01),R=Math.ceil(d)*1.5+3*(destination==='mobile'?.49:.29),T=(.0067+(destination==='mobile'?.0524:.02))*6.45;
  near(a.cost,o.cost+3*T,'independent individual cost');near(a.revenue,R,'fixed sales independent of cost');near(a.db,R*(1-fee/100)-a.cost,'call DB');
  const m=f.month(z),subscription=50*2500,rev=subscription+37*Math.ceil(d)*1.5+11*3*(destination==='mobile'?.49:.29)+19*.35+2*125;
  const cost=3*96.75+37*o.cost+11*3*T+19*.0401*7.46;
  near(m.revenue,rev,'month revenue');near(m.supplierCost,cost,'month direct cost');near(m.commission,subscription*partner/100,'partner');
  const host=(42.99*1.2+.5)*7.46;
  near(m.result,rev-cost-rev*fee/100-subscription*partner/100-host-500,'independent month result');checked++;
}
const expensive={...s,turns:6,talk:60};
assert.ok(f.call(expensive,8).db<0,'cost above fixed price must remain visible as loss');
near(f.call(expensive,8).revenue,12,'never silently reprice');
for(const dest of ['mobile','fixed'])for(const F of [0,.1,1,1.01,10,60,600,10000]){
  const a=f.call({...s,transferDestination:dest},8,F),t=f.transfer({...s,transferDestination:dest});
  near(a.aiCost,6.276108,'AI cannot keep growing after transfer');
  near(a.db,5.723892+Math.ceil(F)*(t.rate-t.cost),'long human phase');
}
near(r.competitors[0].monthly,11478.42,'Bland Start');near(r.competitors[1].total10000,105522,'Bland Build');near(r.competitors[2].monthly,9930.42,'Retell example');
assert.equal(s.forwarded,s.calls,'all calls transfer by default');
for(const x of r.scenarios)assert.equal(x.s.forwarded,x.s.calls,'all calls transfer in every standard scenario');
near(f.month(s,{calls:0,forwarded:0}).result,7500-96.75-74.6-500,'idle subscription');
near(f.month(s,{workers:100}).hosting,773.51248,'100 worker infrastructure');
for(const duration of [.1,1.01,3,7.99,8]){
  const report=f.report({...s,duration});
  for(const x of report.scenarios)near(x.actualAI,x.s.calls*duration,'selected duration drives every monthly scenario');
  for(const x of report.journeys)near(x.aiDuration,duration,'selected duration drives transfer comparisons');
  near(report.competitors[0].monthly,.14*6.45*duration*1000+.0067*6.45*Math.ceil(duration)*1000+3811.95+96.75,'same selected duration for competitors');
}
console.log(`PASS: ${checked} independent per-turn call/month ledgers; fixed pricing, both models/routes, rounding, commissions, fees, host/number costs, loss visibility and long transfers.`);
