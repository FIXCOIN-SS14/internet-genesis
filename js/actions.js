/* Действия игрока: кнопки вызывают A[имя](значение) */
/* ===== ДЕЙСТВИЯ ИГРОКА (кнопки с data-a вызывают A[имя](значение)) ===== */
const A={
 close:k=>closeWin(k),
 openPk:()=>openPicker(),tab:v=>{pk.cat=v;pgrid()},sel:v=>{pk.sel=v;pgrid()},closePk:()=>{pk.el.hidden=true},
 hue:v=>{const[i,j]=v.split('_'),it=S.mods[i].srv.cont[j];it.h=((it.h||200)+40)%360;changed()},
 openK:v=>openWin('k'+v),
 devpw:async()=>{const v=document.getElementById('dpw').value;if(!v)return;const h=await sha(v);let st=null;try{st=localStorage.getItem('ig_pw')}catch(e){}
  if(!st){try{localStorage.setItem('ig_pw',h)}catch(e){}devOn=true;say('Пароль задан, режим разработчика включён.')}else if(st==h){devOn=true;say('Режим разработчика включён.')}else say('Неверный пароль.');renderWins()},
 dev:v=>{if(!devOn)return;if(v=='cr')S.cr+=1000;if(v=='users')S.users+=1000;if(v=='rp')S.rp+=500;if(v=='sp')S.sp+=50;if(v=='tech')for(const k in B.tech)S.tech[k]=1;if(v=='yr')S.year+=10;if(v=='brk'){const c=Object.values(S.mods).filter(m=>m.id&&!m.broken);if(c.length)breakMod(c[Math.random()*c.length|0])}palette();changed()},
 devoff:()=>{devOn=false;renderWins()},
 otab:v=>{OF.tab=v;renderWins()},
 hire:i=>{const c=S.cands[i];if(!c||S.cr<c.s*3)return;S.cr-=c.s*3;S.work.push({nm:c.nm,sk:c.sk,s:c.s,job:null,left:0});S.cands.splice(i,1);if(!S.cands.length)newCands();changed()},
 cands:()=>{newCands();renderWins()},
 pc:()=>{if(S.pcs<S.desks&&S.cr>=40){S.cr-=40;S.pcs++;changed()}},
 desk:()=>{if(S.cr>=250){S.cr-=250;S.desks+=4;changed()}},
 fire:i=>{S.work.splice(i,1);changed()},
 gm:v=>{const[k,n]=v.split('|'),w=wins[k],g=w.mg,id=+k.slice(1);if(+n==g.nx){g.nx++;if(g.nx>6){const m=S.mods[id];m.broken=false;say('Починено: '+B.mods[m.t].n+' #'+id)}}else{g.nx=1;g.ord.sort(()=>Math.random()-.5)}changed()},
 buy:i=>{const x=SHOP[i];if(S.sp<x[2])return;S.sp-=x[2];x[3]();changed()},
 sv:i=>{try{localStorage.setItem('ig2s'+i,JSON.stringify({t:Date.now(),s:S}))}catch(e){}renderWins()},
 ld:i=>{try{S=JSON.parse(localStorage.getItem('ig2s'+i)).s}catch(e){return}fix();sel=-1;for(const k of Object.keys(wins))if(k!='m')closeWin(k);palette();changed()},
 theme:v=>{if(v=='auto')delete document.documentElement.dataset.theme;else document.documentElement.dataset.theme=v},
 place:t=>{if(S.cr<(B.mods[t].$||0))return say('Не хватает кредитов: нужно '+B.mods[t].$+' ¤.');S.cr-=B.mods[t].$||0;const m={id:S.next++,born:performance.now(),t,x:-pan.x+(Math.random()-.5)*500,y:-pan.y+120+Math.random()*200,l:[]};
  if(t=='server')m.srv={slots:Array(B.SLOTS).fill(null),cont:[]};S.mods[m.id]=m;sel=m.id;if(pk.el)pk.el.hidden=true;changed()},
 openC:v=>openWin('c'+v),
 rmC:v=>{const[i,s]=v.split('_');S.mods[i].srv.slots[s]=null;changed()},
 addC:v=>{const[i,t]=v.split('_'),sl=S.mods[i].srv.slots,cost=B.comps[t].$;if(S.cr<cost)return;S.cr-=cost;sl[sl.indexOf(null)]={t,cells:Array(B.CELLS).fill('')};changed()},
 addK:v=>{const[i,t]=v.split('_');S.mods[i].srv.cont.push({t,k:0,lv:1,h:Math.random()*360|0,nm:NM[t][Math.random()*NM[t].length|0]});changed()},
 rmK:v=>{const[i,j]=v.split('_');S.mods[i].srv.cont.splice(j,1);changed()},
 kk:v=>{const[i,j]=v.split('_'),it=S.mods[i].srv.cont[j],ks=B.cont[it.t].kinds;let n=it.k;do n=(n+1)%ks.length;while(ks[n].t&&!S.tech[ks[n].t]);it.k=n;changed()},
 kl:v=>{const[i,j,d]=v.split('_'),it=S.mods[i].srv.cont[j];it.lv=Math.min(3,Math.max(1,it.lv+ +d));changed()},
 learn:i=>{const v=B.tech[i];if(S.rp>=v.c&&S.year>=v.y&&(!v.r||S.tech[v.r])){S.rp-=v.c;S.tech[i]=1;palette();changed()}},
 pick:v=>{const[k,p]=v.split('|');wins[k].sel=p;changed()},
 cell:v=>{const[i,s,n]=v.split('_').map(Number),c=S.mods[i].srv.slots[s];c.cells[n]=c.cells[n]?'':wins['c'+i+'_'+s].sel;changed()}};
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(b&&!b.disabled&&A[b.dataset.a])A[b.dataset.a](b.dataset.v)});
