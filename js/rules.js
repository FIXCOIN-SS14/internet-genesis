/* Правила: работают ли деталь, комплектующее и сервер */
/* ===== ПРАВИЛА: детали -> комплектующее -> сервер -> пользователи ===== */
function compCheck(c){const I=B.comps[c.t];if(I.simple)return{ok:true,why:'',p:0,h:0,k:0};let p=0,h=0,k=0,n={},why='';
 for(const x of c.cells){if(!x)continue;const q=B.parts[x];p+=q.p;h+=q.h;k+=q.c;n[x]=(n[x]||0)+1}
 const cores=(n.core||0)+(n.core2||0)+(n.core3||0);if(!I.main.some(x=>n[x]))why='нет детали: '+B.parts[I.main[0]].n;
 else if((n.thread||0)>cores*B.TPC)why='потоков больше '+B.TPC+' на ядро';
 else if(h>k)why='перегрев: тепло '+h+' больше охлаждения '+k;
 return{ok:!why,why,p,h,k}}
const LV=[0,1,1.8,2.5],itK=it=>B.cont[it.t].kinds[it.k],itL=it=>B.cont[it.t].l*itK(it).l*it.lv,itU=it=>B.cont[it.t].u*itK(it).u*LV[it.lv],srvLoad=s=>s.cont.reduce((a,it)=>a+itL(it),0);
function srvCheck(s){const r={ok:false,why:'',p:0,load:srvLoad(s),gpu:false};let n={},cool=0,cnt=0,sto=0,spd=1;
 for(const c of s.slots){if(!c)continue;if(!B.comps[c.t].simple)cnt++;const q=compCheck(c);
  if(!q.ok){r.why=B.comps[c.t].n+' не работает ('+q.why+')';return r}
  n[c.t]=(n[c.t]||0)+1;const CI=B.comps[c.t];if(CI.simple){sto+=CI.cap;spd=Math.max(spd,CI.spd)}if(c.t=='cool')cool+=q.k;else r.p+=q.p}
 for(const t of['cpu','ram','cool'])if(!n[t]){r.why='нет комплектующего: '+B.comps[t].n;return r}
 const need=(cnt-n.cool)*B.HEAT;
 if(cool<need){r.why='не хватает охлаждения: '+cool+' из '+need;return r}
 if(!sto){r.why='нет комплектующего: диск (HDD, SSD или NVMe)';return r}
 if(srvSto(s)>sto){r.why='не хватает места на дисках: '+srvSto(s)+' из '+sto;return r}
 if(r.load>r.p){r.why='перегрузка: контент '+r.load+' больше мощности '+r.p;return r}
 r.gpu=!!n.gpu;r.sto=sto;r.spd=spd;r.ok=true;return r}
function cannot(s,q,t){const v=B.cont[t];
 return S.users<v.k?'откроется при '+v.k:!q.ok?'сервер не работает':v.gpu&&!q.gpu?'нужна видеокарта':srvLoad(s)+v.l*v.kinds[0].l>q.p?'не хватает мощности':srvSto(s)+STO[t]>(q.sto||0)?'не хватает места на дисках':''}
const avail=x=>S.users>=x.k&&(!x.t||S.tech[x.t]);
const sig=()=>[B.mods,B.comps,B.parts,B.cont].reduce((a,t)=>a+Object.values(t).filter(avail).length,0)+Object.keys(S.tech).length;
