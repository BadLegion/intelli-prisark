/* Run the owned renderer against a minimal DOM surface; check visible arithmetic, not source strings. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const f=require('./beregning.cjs');
const ui=fs.readFileSync(__dirname+'/gemini.html','utf8');
const helpers=ui.slice(ui.indexOf('const $=id=>'),ui.indexOf('const initial='));
const renderer=ui.slice(ui.indexOf('function render(){'),ui.indexOf('function update(){'));
const decode=s=>s.replace(/<[^>]*>/g,' ').trim();
const rows=html=>[...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map(x=>[...x[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(y=>decode(y[1])));
const cents=s=>Math.round(Number(s.replace(/ kr\./g,'').replace(/\./g,'').replace(',','.'))*100);
let checked=0;
for(const model of ['gemini','openai'])for(const duration of [.01,.1,1,1.01,3,7.99,8])for(const fee of [0,2,10])for(const forwardDuration of [10,30,60]){
  const dom=new Map();const doc={getElementById:id=>{if(!dom.has(id))dom.set(id,{innerHTML:'',textContent:'',classList:{toggle(){}}});return dom.get(id);}};
  const state={...f.defaults,model,duration,fee,forwardDuration};
  const sandbox={document:doc,FastPrice:f,state,Intl};vm.createContext(sandbox);
  vm.runInContext(helpers+`\nfunction cards(items){return items.map(([a,b,c])=>a+' '+b+' '+c).join(' | ')}\nfunction row(values,cls=''){return '<tr class="'+cls+'">'+values.map(v=>'<td>'+v+'</td>').join('')+'</tr>';}\n`+renderer+'\nrender();',sandbox);
  for(const [id,ri,ci,di] of [['unit-rows',2,1,3],['phase-rows',2,1,3],['module-rows',3,2,4],['ledger-rows',1,2,3],['scenario-rows',1,2,3]]){
    for(const row of rows(dom.get(id).innerHTML))assert.equal(cents(row[ri])-cents(row[ci]),cents(row[di]),id+' visible R - C = DB: '+row.join(' / '));
  }
  for(const id of ['phase-rows','ledger-rows']){
    const rr=rows(dom.get(id).innerHTML),total=rr.at(-1);
    for(const col of [1,2,3])assert.equal(rr.slice(0,-1).reduce((z,x)=>z+cents(x[col]),0),cents(total[col]),id+' visible column sum');
  }
  let accumulated=0;
  for(const row of rows(dom.get('timeline-rows').innerHTML)){accumulated+=cents(row[1]);assert.equal(accumulated,cents(row[2]),'minute increments reconcile');}
  for(const row of rows(dom.get('journey-rows').innerHTML))assert.equal(cents(row[2])-cents(row[1]),cents(row[3]),'long transfer visible DB');
  const detail=rows(dom.get('detail-rows').innerHTML),rawIndex=detail.findIndex(x=>x[0]==='AI før reserve');
  assert.equal(detail.slice(0,rawIndex).reduce((z,x)=>z+cents(x[2]),0),cents(detail[rawIndex][2]),'visible AI components sum');
  assert.equal(detail.slice(rawIndex,-1).reduce((z,x)=>z+cents(x[2]),0),cents(detail.at(-1)[2]),'visible total AI phase sum');
  const all=[...dom.values()].map(x=>decode(x.innerHTML)+' '+x.textContent).join('\n');
  for(const x of all.matchAll(/(-?[\d.,]+)\s*kr\./g))assert.match(x[1],/^-?[\d.]+,\d{2}$/,'all DKK two decimals');
  assert.ok(!all.includes('NaN')&&!all.includes('undefined'),'no invalid amounts');
  checked++;
}
console.log('PASS: '+checked+' rendered views; two decimals, unit/phase/module/ledger/scenario DB, column totals, timeline and AI detail sums.');
