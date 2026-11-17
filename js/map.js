/* Карта: камера, узлы, порты, связи, рисование */
/* ===== УРОВЕНЬ 1: КАРТА (бесконечная, тащи пустое место) ===== */
const cv=$('#map'),cx=cv.getContext('2d'),rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
let Z=1,Zt=1,panT=null,hov=-1,W=1,H=1,pan={x:0,y:0},sel=-1,linking=false,pr=null;
function resize(){const r=cv.getBoundingClientRect(),d=devicePixelRatio||1;W=r.width;H=r.height;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0)}
new ResizeObserver(resize).observe(cv);
const ctr=m=>({x:W/2+pan.x+m.x,y:H/2+pan.y+m.y});
cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);const r=cv.getBoundingClientRect();const px=(e.clientX-r.left-W/2)/Z+W/2,py=(e.clientY-r.top-H/2)/Z+H/2,po=portAt(px,py);panT=null;pr={id:po>=0?po:hit(px,py),port:po>=0,d:0,x:e.clientX,y:e.clientY}};
cv.onpointermove=e=>{const r0=cv.getBoundingClientRect();hov=hit((e.clientX-r0.left-W/2)/Z+W/2,(e.clientY-r0.top-H/2)/Z+H/2);cv.style.cursor=hov>=0?'pointer':'grab';if(!pr)return;const dx=e.clientX-pr.x,dy=e.clientY-pr.y;pr.x=e.clientX;pr.y=e.clientY;pr.d+=Math.hypot(dx,dy);
 if(pr.d>5){if(pr.id<0){pan.x+=dx/Z;pan.y+=dy/Z}else if(pr.id>=0&&!pr.port){S.mods[pr.id].x+=dx/Z;S.mods[pr.id].y+=dy/Z}}};
cv.onpointerup=()=>{if(pr&&pr.d<=5)click(pr.id,pr.port);pr=null};
function click(id,port){
 if(id<0){sel=-1;linking=false}
 else if(port){if(linking&&sel>=0&&id!=sel){link(sel,id);linking=false}else{sel=id;linking=true}}
 else if(linking&&sel>=0&&id!=sel){link(sel,id);linking=false}
 else{sel=id;linking=false;if(S.mods[id].broken)openWin('g'+id);else if(S.mods[id].srv)openWin('s'+id);}
 ui()}
function link(a,b){const ma=S.mods[a],mb=S.mods[b];
 if(ma.l.includes(b)){ma.l=ma.l.filter(x=>x!=b);mb.l=mb.l.filter(x=>x!=a)}
 else{if(ma.l.length>=(B.mods[ma.t].lim||2)||mb.l.length>=(B.mods[mb.t].lim||2))return say('Нет свободных портов: поставь Маршрутизатор.');const d=Math.hypot(ma.x-mb.x,ma.y-mb.y),r=Math.max(mr(ma),mr(mb));
  if(d>r)return say('Слишком далеко: '+~~d+' при дальности '+r+'. Поставь кабель посередине.');
  ma.l.push(b);mb.l.push(a)}
 changed()}
/* ----- карточки узлов, порты и светящиеся связи ----- */
const CW=190,GL={internet:'◎',cable:'═',router:'⌁',hub:'⌘',gen:'⚙',wind:'❂',solar:'☀',nuke:'☢',fiber:'≡',balancer:'⚖',firewall:'▦',ups:'⚡',cloud:'☁',switch:'⇄',server:'≣',cdn:'✶',sat:'✹',scanner:'⛨',verifier:'✔',enhancer:'⬆',auto:'⟳',cpucell:'▣',research:'⚛',miner:'⛏'};
function rowsOf(m){const d=B.mods[m.t],on=online.has(m.id),r=[];if(m.broken)return{r:[['Состояние','сбой'],['Починить','нажми на узел']],bad:true};
 if(m.t=='internet')return{r:[['Роль','точка входа'],['Порты',m.l.length+'/'+d.lim]]};
 if(m.srv){const q=srvCheck(m.srv);return{r:[['Мощность',q.ok?q.p:'нет'],['Контент',m.srv.cont.length],['Питание','−'+watt(m).toFixed(1)+' кВт'],['Состояние',q.ok?'работает':'сбой']],bar:q.ok&&q.p?q.load/q.p:0,bad:!q.ok}}
 r.push(['Связь',on?'в сети':'нет связи']);
 if(d.u)r.push(['Польз.','+'+d.u+'/с']);if(d.b)r.push(['Бонус серверам','+'+d.b*100+'%']);if(d.rp)r.push(['ОИ','+'+d.rp+'/с']);if(d.cov)r.push(['Зона раздачи',~~cov(m)]);if(d.cap)r.push(['Скорость на канал',Math.round(Math.min(1,d.cap/Math.max(1,nbrs(m).length))*100)+'%']);if(d.g)r.push(['Выработка','+'+gen(m)+' кВт']);if(watt(m))r.push(['Питание','−'+watt(m).toFixed(1)+' кВт']);r.push(['Порты',m.l.length+'/'+(d.lim||2)]);
 return{r}}
const cardH=m=>{const o=rowsOf(m);return 34+o.r.length*19+(o.bar!==undefined?12:0)};
function hit(px,py){for(const id of Object.keys(S.mods).reverse()){const m=S.mods[id],c=ctr(m);if(Math.abs(px-c.x)<CW/2&&Math.abs(py-c.y)<cardH(m)/2)return+id}return-1}
let fl=[];
function portAt(px,py){for(const id of Object.keys(S.mods).reverse()){const c=ctr(S.mods[id]);for(const sx of[-1,1])if(Math.hypot(px-c.x-sx*CW/2,py-c.y)<11/Math.min(1,Z))return+id}return-1}
function rr(x,y,w,h,r){cx.beginPath();cx.moveTo(x+r,y);cx.arcTo(x+w,y,x+w,y+h,r);cx.arcTo(x+w,y+h,x,y+h,r);cx.arcTo(x,y+h,x,y,r);cx.arcTo(x,y,x+w,y,r);cx.closePath()}
function draw(){const cs=getComputedStyle(document.documentElement),g=n=>cs.getPropertyValue(n).trim(),tt=performance.now(),ok=g('--ok');
 cx.fillStyle=g('--bg');cx.fillRect(0,0,W,H);
 cx.fillStyle=g('--line');cx.globalAlpha=.7;
 const T=48*Z;for(let x=((W/2+pan.x*Z)%T+T)%T;x<W;x+=T)for(let y=((H/2+pan.y*Z)%T+T)%T;y<H;y+=T)cx.fillRect(x,y,2,2);
 cx.globalAlpha=1;
 cx.save();cx.translate(W/2,H/2);cx.scale(Z,Z);cx.translate(-W/2,-H/2);
 if(S.mods[sel]){const c=ctr(S.mods[sel]);cx.beginPath();cx.arc(c.x,c.y,mr(S.mods[sel]),0,7);cx.strokeStyle=g('--dim');cx.setLineDash([6,8]);cx.globalAlpha=.5;cx.lineWidth=1;cx.stroke();cx.setLineDash([]);cx.globalAlpha=1}
 for(const m of Object.values(S.mods)){const rad=cov(m);if(rad&&online.has(m.id)){const c=ctr(m);cx.beginPath();cx.arc(c.x,c.y,rad,0,7);cx.fillStyle=ok;cx.globalAlpha=.05+.03*Math.sin(tt/600);cx.fill();cx.setLineDash([5,9]);cx.lineWidth=1;cx.strokeStyle=ok;cx.globalAlpha=.35;cx.stroke();
  cx.lineWidth=1.5;cx.globalAlpha=.5;for(const o of nbrs(m))if(!m.l.includes(o)&&online.has(o)){const d=ctr(S.mods[o]);cx.beginPath();cx.moveTo(c.x,c.y);cx.lineTo(d.x,d.y);cx.stroke()}cx.setLineDash([]);cx.globalAlpha=1}}
 for(const m of Object.values(S.mods))for(const o of m.l)if(o>m.id){
  const n=S.mods[o],A=ctr(m),Z=ctr(n),s=A.x<=Z.x?1:-1,x0=A.x+s*CW/2,x3=Z.x-s*CW/2,dx=Math.max(40,Math.abs(x3-x0)/2),on=online.has(m.id)&&online.has(o);
  cx.beginPath();cx.moveTo(x0,A.y);cx.bezierCurveTo(x0+s*dx,A.y,x3-s*dx,Z.y,x3,Z.y);
  cx.lineWidth=2.5;cx.strokeStyle=on?ok:g('--dim');cx.shadowColor=on?g('--glow'):'transparent';cx.shadowBlur=on?12:0;cx.stroke();cx.shadowBlur=0;
  if(on&&!rm){const p=(tt/2200+m.id*.37)%1,q=1-p,X=q*q*q*x0+3*q*q*p*(x0+s*dx)+3*q*p*p*(x3-s*dx)+p*p*p*x3,Y=q*q*q*A.y+3*q*q*p*A.y+3*q*p*p*Z.y+p*p*p*Z.y;cx.fillStyle='#fff';cx.beginPath();cx.arc(X,Y,3,0,7);cx.fill()}}
 cx.textBaseline='middle';
 for(const m of Object.values(S.mods)){const c=ctr(m),o=rowsOf(m),h=cardH(m),x=c.x-CW/2,y=c.y-h/2,on=online.has(m.id),isel=m.id==sel,lit=on?ok:g('--dim');
  const edge=o.bad?g('--bad'):isel?(linking?g('--acc'):g('--warn')):g('--line');
  const age=m.born>tt?1:Math.min(1,(tt-(m.born||0))/260);cx.save();cx.translate(c.x,c.y);cx.scale(.85+.15*age,.85+.15*age);cx.translate(-c.x,-c.y);cx.globalAlpha=age;
  rr(x,y,CW,h,10);cx.fillStyle=g('--card');cx.shadowColor=m.id==hov?g('--glow'):'#0006';cx.shadowBlur=m.id==hov?22:12;cx.fill();cx.shadowBlur=0;
  cx.lineWidth=isel||o.bad?2:1;cx.strokeStyle=edge;cx.stroke();
  rr(x+8,y+7,20,20,6);cx.fillStyle=lit;cx.globalAlpha=.18;cx.fill();cx.globalAlpha=1;
  cx.textAlign='center';cx.fillStyle=lit;cx.font='13px system-ui,sans-serif';cx.fillText(GL[m.t]||'◆',x+18,y+17.5);
  cx.textAlign='left';cx.fillStyle=g('--ink');cx.font='600 13px system-ui,sans-serif';cx.fillText(B.mods[m.t].n+(m.srv?' #'+m.id:'')+(lvl(m)>1?' ·'+lvl(m):''),x+36,y+17.5);
  cx.strokeStyle=g('--line');cx.lineWidth=1;cx.beginPath();cx.moveTo(x+8,y+32);cx.lineTo(x+CW-8,y+32);cx.stroke();
  cx.font='12px system-ui,sans-serif';
  o.r.forEach((t,i)=>{const ry=y+44+i*19,v=''+t[1];cx.textAlign='left';cx.fillStyle=g('--dim');cx.fillText(t[0],x+12,ry);cx.textAlign='right';cx.fillStyle=(v=='сбой'||v=='нет связи'||v=='нет')?g('--bad'):g('--ink');cx.fillText(v,x+CW-12,ry)});
  if(o.bar!==undefined){const by=y+h-12;rr(x+12,by,CW-24,5,2.5);cx.fillStyle=g('--line');cx.fill();rr(x+12,by,Math.max(5,(CW-24)*Math.min(1,o.bar)),5,2.5);cx.fillStyle=o.bar>.9?g('--warn'):ok;cx.fill()}
  for(const px of[x,x+CW]){cx.beginPath();cx.arc(px,c.y,isel&&linking?6+Math.sin(tt/150)*1.5:5,0,7);cx.fillStyle=g('--card');cx.fill();cx.lineWidth=2;cx.strokeStyle=m.l.length?lit:g('--dim');cx.stroke()}cx.restore()}
 fl=fl.filter(f=>tt-f.t<900);for(const f of fl){const a=(tt-f.t)/900;cx.globalAlpha=1-a;cx.fillStyle=ok;cx.font='600 15px system-ui,sans-serif';cx.textAlign='center';cx.fillText(f.s,f.x,f.y-a*50)}cx.globalAlpha=1;cx.restore()}
