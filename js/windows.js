/* Окна: сервер, комплектующее, дерево технологий, офис, поломки, контент */
/* ===== УРОВНИ 2 И 3: ОКНА (сервер -> комплектующее) ===== */
const wins={};let z=5;
function openWin(k){
 if(wins[k]){wins[k].el.style.zIndex=++z;return}
 const el=document.createElement('div'),n=Object.keys(wins).length,id=k.slice(1).split('_')[0];
 el.className='win'+(k=='t'?' wide':'');el.style.zIndex=++z;el.style.left=(16+n*28)+'px';el.style.top=(44+n*28)+'px';
 el.innerHTML='<div class="wt"><b>'+(k=='t'?'Исследования':k=='m'?'Меню':k=='o'?'Офис и найм':k[0]=='g'?'Сбой, узел #'+id:k[0]=='k'?'Контент, сервер #'+id:k[0]=='s'?'Сервер #'+id:'Комплектующее, сервер #'+id)+'</b><button data-a="close" data-v="'+k+'" aria-label="Закрыть">×</button></div><div class="wb"></div>';
 $('#wins').appendChild(el);wins[k]={el,body:el.lastChild,html:''};
 const t=el.firstChild;let d=null;
 t.onpointerdown=e=>{if(e.target.closest('button'))return;t.setPointerCapture(e.pointerId);el.style.zIndex=++z;d=[e.clientX,e.clientY]};
 t.onpointermove=e=>{if(!d)return;el.style.left=el.offsetLeft+e.clientX-d[0]+'px';el.style.top=el.offsetTop+e.clientY-d[1]+'px';d=[e.clientX,e.clientY]};
 t.onpointerup=()=>d=null;
 renderWins()}
function closeWin(k){const w=wins[k];if(w){delete wins[k];w.el.classList.add('out');setTimeout(()=>w.el.remove(),160)}}
function renderWins(){for(const k of Object.keys(wins)){const h=winHTML(k);if(h===null){closeWin(k);continue}const w=wins[k];if(h!==w.html){w.html=h;w.body.innerHTML=h}}}
function winHTML(k){
 if(k=='t')return techHTML();if(k=='m')return menuHTML();if(k=='o')return officeHTML();
 const[id,sl]=k.slice(1).split('_').map(Number),m=S.mods[id];
 if(!m)return null;
 if(k[0]=='k')return contentHTML(m.srv.cont[sl]);
 if(k[0]=='g')return m.broken?gameHTML(k,m):null;
 if(k[0]=='s'){
  const q=srvCheck(m.srv),free=m.srv.slots.includes(null);
  const slots=m.srv.slots.map((c,i)=>c?'<div class="cell"><button data-a="'+(B.comps[c.t].simple?'noop':'openC')+'" data-v="'+id+'_'+i+'">'+B.comps[c.t].n+'<br>'+(compCheck(c).ok?'<span class="ok">'+(B.comps[c.t].simple?B.comps[c.t].cap+' ГБ':'работает')+'</span>':'<span class="bad">не работает</span>')+'</button><button data-a="rmC" data-v="'+id+'_'+i+'">убрать</button></div>':'<div class="cell dim">пусто</div>').join('');
  const inst=Object.entries(B.comps).map(([t,v])=>'<button data-a="addC" data-v="'+id+'_'+t+'"'+(!avail(v)||S.cr<v.$||!free?' disabled':'')+'>+ '+v.n+' '+v.$+' ¤'+(!avail(v)?' (нужно: '+(v.t&&!S.tech[v.t]?B.tech[v.t].n:v.k)+')':'')+'</button>').join(' ');
  const add=Object.entries(B.cont).map(([t,v])=>{const w=cannot(m.srv,q,t);return '<button data-a="addK" data-v="'+id+'_'+t+'"'+(w?' disabled':'')+'>+ '+v.n+(w?' ('+w+')':'')+'</button>'}).join(' ');
  const items=m.srv.cont.map((it,i)=>{const K='data-v="'+id+'_'+i;return '<div style="margin:6px 0"><b>'+(it.nm||B.cont[it.t].n)+'</b> ('+B.cont[it.t].n.toLowerCase()+') «'+itK(it).n+'», ур. '+it.lv+' <small class="dim">нагрузка '+itL(it).toFixed(1)+', +'+itU(it).toFixed(1)+'/с</small><br><button data-a="kk" '+K+'">Тип ▸</button> <button data-a="kl" '+K+'_-1">−</button> <button data-a="kl" '+K+'_1">+</button> <button data-a="hue" '+K+'">Цвет</button> <button data-a="openK" '+K+'">Открыть</button> <button data-a="rmK" '+K+'">удалить</button></div>'}).join('');
  const cont=items+'<div>'+add+'</div>';
  return '<p class="'+(q.ok?'ok':'bad')+'">'+(q.ok?'Сервер работает. Мощность '+q.p+', занято '+q.load:'Сервер не работает: '+q.why)+'<br>'+(online.has(id)?'Подключён к Интернету.':'Нет связи с Интернетом: соедини сервер на карте.')+'</p><h4>Комплектующие (нажми, чтобы заглянуть внутрь)</h4><div class="grid">'+slots+'</div><h4>Установить комплектующее</h4>'+inst+'<h4>Контент</h4>'+cont}
 const c=m.srv.slots[sl];if(!c)return null;
 const I=B.comps[c.t],q=compCheck(c),w=wins[k];
 if(!w.sel||!I.parts.includes(w.sel)||!avail(B.parts[w.sel]))w.sel=I.parts.find(p=>avail(B.parts[p]));
 const pal=I.parts.map(p=>{const v=B.parts[p];return '<button class="'+(p==w.sel?'on':'')+'" data-a="pick" data-v="'+k+'|'+p+'"'+(avail(v)?'':' disabled')+'>'+v.n+' ('+(v.p?'+'+v.p+' мощн. ':'')+(v.h?'+'+v.h+' тепла':'')+(v.c?'−'+v.c+' тепла':'')+')'+(avail(v)?'':' (нужно: '+(v.t&&!S.tech[v.t]?B.tech[v.t].n:v.k+' польз.')+')')+'</button>'}).join(' ');
 const cells=c.cells.map((x,i)=>'<button class="cc" data-a="cell" data-v="'+id+'_'+sl+'_'+i+'">'+(x?B.parts[x].n:'<span class="dim">пусто</span>')+'</button>').join('');
 return '<p class="'+(q.ok?'ok':'bad')+'">'+I.n+(q.ok?': работает':': не работает, '+q.why)+'<br><small class="dim">мощность '+q.p+', тепло '+q.h+', охлаждение '+q.k+'</small></p><h4>Деталь для установки</h4>'+pal+'<h4>Клетки: пустая — поставить деталь, занятая — убрать</h4><div class="grid" style="grid-template-columns:repeat('+B.COLS+',1fr)">'+cells+'</div>'}
/* ===== ИССЛЕДОВАНИЯ: дерево технологий, как в жизни ===== */
function techHTML(){const T=B.tech,W=190,Hh=66,X=n=>14+(n.p[0]+(n.p[1]>10?3.2:0))*W,Y=n=>14+(n.p[1]>10?n.p[1]-11:n.p[1])*Hh;let e='',nd='';
 for(const[i,v]of Object.entries(T)){
  if(v.r){const a=T[v.r],x1=X(a)+176,y1=Y(a)+27,x2=X(v),y2=Y(v)+27,mx=(x1+x2)/2;e+='<path d="M'+x1+' '+y1+'C'+mx+' '+y1+' '+mx+' '+y2+' '+x2+' '+y2+'" class="'+(S.tech[v.r]?'el on':'el')+'"/>'}
  const done=S.tech[i],pre=!v.r||S.tech[v.r],yr=S.year>=v.y,can=pre&&yr&&!done&&S.rp>=v.c,why=done?'':!yr?'доступно с '+v.y+' г.':!pre?'нужно: '+T[v.r].n:'';
  nd+='<button class="tn '+(done?'td':can?'ta':'tl')+'" style="left:'+X(v)+'px;top:'+Y(v)+'px" data-a="learn" data-v="'+i+'"'+(can?'':' disabled')+' title="'+v.d+'"><b>'+v.n+'</b><small>'+v.y+' · '+(done?'изучено':v.c+' ОИ')+'</small><small>'+(why||'откроет: '+v.d)+'</small></button>'}
 return '<p class="dim">Ветки технологий. Год в игре идёт сам: технологию можно изучать, когда наступил её год и есть очки исследований (ОИ).</p><div class="tree"><svg width="1300" height="760">'+e+'</svg>'+nd+'</div>'}
/* ===== ПОЛОМКИ, ОФИС, НАЙМ И МИНИ-ИГРА ===== */
function wear(){if(S.pt<120)return;
 for(const id of online){const m=S.mods[id];if(!m||id==0||m.broken)continue;let p=.0012/mu(m);
  for(const o of m.l){const n=S.mods[o];if(n&&online.has(o)&&B.mods[n.t].prot)p*=1-B.mods[n.t].prot}
  if(Math.random()<p){breakMod(m);break}}}
function breakMod(m){m.broken=true;const auto=S.work.length&&S.pcs;say('Сбой: '+B.mods[m.t].n+' #'+m.id+(auto?'. Работники займутся.':'. Почини в мини-игре.'));if(!auto)openWin('g'+m.id)}
function officeStep(dt){S.payT+=dt;
 if(S.payT>=30){S.payT=0;const pay=S.work.reduce((a,w)=>a+w.s/2,0);
  if(pay>0){if(S.cr>=pay)S.cr-=pay;else{S.work.sort((a,b)=>b.s-a.s);const w=S.work.shift();say(w.nm+' уволился: нечем платить зарплату.');renderWins()}}}
 const act=S.work.slice(0,S.pcs),claimed=new Set(act.map(w=>w.job).filter(j=>j!=null));
 for(const w of act){if(w.job!=null&&!(S.mods[w.job]&&S.mods[w.job].broken))w.job=null;
  if(w.job==null){const b=Object.values(S.mods).find(m=>m.broken&&!claimed.has(m.id));if(b){w.job=b.id;w.left=14/w.sk;claimed.add(b.id)}}
  if(w.job!=null){w.left-=dt;if(w.left<=0){const m=S.mods[w.job];m.broken=false;say(w.nm+' починил: '+B.mods[m.t].n+' #'+m.id);w.job=null;renderWins()}}}}
const OF={tab:'off'},WN=['Алексей','Мария','Игорь','Анна','Дмитрий','Ольга','Сергей','Елена','Павел','Ирина'],wage=sk=>[0,4,8,14,22,32][sk];
function newCands(){S.cands=[0,1,2].map(()=>{const sk=1+(Math.random()*5|0);return{nm:WN[Math.random()*WN.length|0],sk,s:wage(sk)}})}
function officeHTML(){
 const tabs='<div class="tabs"><button class="'+(OF.tab=='off'?'on':'')+'" data-a="otab" data-v="off">Офис</button><button class="'+(OF.tab=='hire'?'on':'')+'" data-a="otab" data-v="hire">Найм</button></div>';
 if(OF.tab=='hire'){if(!S.cands.length)newCands();
  return tabs+'<p class="dim">Работники сами чинят сломанные узлы, но им нужна зарплата и свободный ПК в офисе.</p>'+S.cands.map((c,i)=>'<div style="margin:8px 0"><b>'+c.nm+'</b> '+'★'.repeat(c.sk)+' <small class="dim">зарплата '+c.s+' ¤/мин, найм '+c.s*3+' ¤</small><br><button data-a="hire" data-v="'+i+'"'+(S.cr>=c.s*3?'':' disabled')+'>Нанять</button></div>').join('')+'<button data-a="cands">Другие кандидаты</button>'}
 const pay=S.work.reduce((a,w)=>a+w.s,0);
 return tabs+'<p>ПК в офисе: <b>'+S.pcs+'</b> из '+S.desks+' мест. Работников: '+S.work.length+'. Зарплаты: '+pay+' ¤/мин.</p><button data-a="pc"'+(S.pcs<S.desks&&S.cr>=40?'':' disabled')+'>Собрать ПК (40 ¤)</button> <button data-a="desk"'+(S.cr>=250?'':' disabled')+'>Расширить офис: +4 места (250 ¤)</button><h4>Работники</h4>'+(S.work.length?S.work.map((w,i)=>'<div style="margin:6px 0"><b>'+w.nm+'</b> '+'★'.repeat(w.sk)+' <small class="dim">'+(i>=S.pcs?'нет свободного ПК':w.job!=null?'чинит узел #'+w.job:'свободен')+'</small> <button data-a="fire" data-v="'+i+'">Уволить</button></div>').join(''):'<p class="dim">Пока никого. Загляни во вкладку «Найм».</p>')}
function gameHTML(k,m){const w=wins[k];if(!w.mg)w.mg={nx:1,ord:[1,2,3,4,5,6].sort(()=>Math.random()-.5)};const g=w.mg;
 return '<p class="bad">Сбой: '+B.mods[m.t].n+' #'+m.id+'</p><p class="dim">Перезагрузка: нажимай числа по порядку от 1 до 6. Ошибка сбрасывает попытку.</p><div class="grid">'+g.ord.map(n=>'<button class="cc" data-a="gm" data-v="'+k+'|'+n+'"'+(n<g.nx?' disabled':'')+'>'+n+'</button>').join('')+'</div><p class="dim">Готово: '+(g.nx-1)+' из 6. '+(S.work.length&&S.pcs?'Работники тоже могут починить.':'Найми работников в офисе, чтобы они чинили сами.')+'</p>'}
/* ===== КОНТЕНТ: у каждого сайта, программы и игры свой интерфейс ===== */
const NM={site:['Лента','Атлас','Вокзал','Маяк'],prog:['Кристалл','Проводник','Пульт','Верстак'],game:['Звёздный путь','Лабиринт','Дрейф','Арена']};
function contentHTML(it){if(!it)return null;const h=it.h||200,nm=it.nm||B.cont[it.t].n,K=itK(it).n,c='hsl('+h+',65%,42%)',bg='hsl('+h+',70%,93%)',st='style="border-color:'+c+'"',tb='<div class="tb" style="background:'+c+'">';
 const v={site:'<div class="mk" '+st+'>'+tb+'<span>●●●</span><span>https://'+nm.toLowerCase().replace(/ /g,'-')+'.net</span></div><div class="hd" style="background:'+bg+'"><b style="color:'+c+'">'+nm+'</b><small>'+K+'</small></div><div class="ln"><u></u><u></u><u></u></div></div>',
 prog:'<div class="mk" '+st+'>'+tb+'<span>'+nm+'</span></div><div class="pr"><div class="sd"></div><div class="mn"><b style="color:'+c+'">'+K+'</b><i></i><i></i><i></i></div></div></div>',
 game:'<div class="mk" '+st+'>'+tb+'<span>'+nm+': '+K+'</span></div><div class="sc">'+[8,24,40,56,72,88].map((x,i)=>'<s style="left:'+x+'%;background:'+c+';animation-delay:'+i*.25+'s"></s>').join('')+'</div></div>'}[it.t];
 return v+'<p class="dim">Тип «'+K+'», уровень '+it.lv+'. Нагрузка '+itL(it).toFixed(1)+', +'+itU(it).toFixed(1)+' польз./с. Тип, уровень и цвет меняются в окне сервера.</p>'}
