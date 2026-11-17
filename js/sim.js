/* Симуляция: сеть, зона роутера, электричество, доход */
/* ===== СИМУЛЯЦИЯ: что в сети и сколько пользователей в секунду ===== */
let online=new Set([0]),rate=.5,rpRate=0,crRate=0,shr={0:1};
const lvl=m=>m.lv||1,mu=m=>1+.5*(lvl(m)-1),mr=m=>B.mods[m.t].r*(1+.25*(lvl(m)-1)),upCost=m=>Math.round((B.mods[m.t].$||100)*1.8**lvl(m)),STO={site:5,prog:10,game:30},srvSto=s=>s.cont.reduce((a,it)=>a+STO[it.t]*it.lv,0);
const cov=m=>(B.mods[m.t].cov||0)*(1+.25*(lvl(m)-1)),nbrs=m=>{const a=new Set(m.l.filter(o=>S.mods[o])),c=cov(m);if(c)for(const o of Object.values(S.mods))if(o.id!=m.id&&Math.hypot(o.x-m.x,o.y-m.y)<=c)a.add(o.id);return[...a]};
const W0={cable:0,fiber:0,internet:0,router:2,hub:2,switch:2,cdn:3,balancer:3,enhancer:2,cpucell:3,research:5,cloud:12,miner:15,sat:8,gen:0,wind:0,solar:0,nuke:0};
const watt=m=>m.broken?0:m.srv?3+srvCheck(m.srv).p/6+m.srv.slots.filter(c=>c&&B.comps[c.t].simple).length:(W0[m.t]??1),gen=m=>m.broken?0:(B.mods[m.t].g||0)*mu(m);
let pwDem=0,pwSup=0,bill=0,blk=false;
function recalc(){online=new Set([0]);shr={0:1};const q=[0];
 while(q.length){const id=q.shift(),m=S.mods[id],d=B.mods[m.t],nb=nbrs(m),pass=d.cap?Math.min(1,d.cap/Math.max(1,nb.length)):1; /* маршрутизатор делит скорость между каналами */
  for(const o of nb)if(!online.has(o)&&!S.mods[o].broken){online.add(o);shr[o]=shr[id]*pass;q.push(o)}}
 rate=0;rpRate=0;
 for(const id of online){const m=S.mods[id],d=B.mods[m.t],sh=shr[id];rate+=(d.u||0)*mu(m)*sh;rpRate+=(d.rp||0)*mu(m)*sh;
  if(m.srv){const q=srvCheck(m.srv);if(q.ok){const bst=1+m.l.filter(o=>online.has(o)).reduce((a,o)=>a+(B.mods[S.mods[o].t].b||0)*mu(S.mods[o]),0);for(const it of m.srv.cont)rate+=itU(it)*bst*q.spd*sh*mu(m);rpRate+=(q.p-q.load)*.05*sh}}}
  /* электричество: что не покрыто своей выработкой, берётся из городской сети за деньги */
 pwDem=0;pwSup=0;let fuel=0;for(const m of Object.values(S.mods)){pwDem+=watt(m);const g=gen(m);pwSup+=g;if(g&&B.mods[m.t].fuel)fuel+=B.mods[m.t].fuel}
 bill=Math.max(0,pwDem-pwSup)*.02+fuel;blk=S.cr<=.01&&bill>0;if(blk){rate*=.3;rpRate*=.3}
 if(Date.now()<S.boost)rate*=2;
 crRate=rate*.3}
