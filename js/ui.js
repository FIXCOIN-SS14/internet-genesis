/* Интерфейс: палитра, окно выбора узлов, панели, кнопки */
/* ===== ИНТЕРФЕЙС ===== */
const HINT='Старт: 100 ¤. Купи сервер и кабель, поставь в сервер процессор, память, охлаждение и диск, затем соедини сервер с Интернетом. Интернет сам ничего не приносит: пользователей даёт контент на сервере.';
function setT(id,v){const e=$(id);if(e.textContent!==v){e.textContent=v;e.classList.remove('bump');void e.offsetWidth;e.classList.add('bump')}}
let mt;function say(t){const mm=$('#msg');mm.textContent=t;mm.classList.remove('flash');void mm.offsetWidth;mm.classList.add('flash');clearTimeout(mt);mt=setTimeout(()=>$('#msg').textContent=HINT,5000)}
let lastSig=-1;
/* ----- окно «Добавить узел»: категории, поиск, описание ----- */
const CAT={net:['Сеть',['cable','fiber','router','hub','switch','sat']],srv:['Серверы',['server','cdn','balancer','cloud']],buf:['Усилители',['scanner','verifier','enhancer']],sec:['Защита',['firewall','ups']],pwr:['Энергия',['gen','wind','solar','nuke']],res:['Ресурсы',['auto','cpucell','research','miner']]};
const DESC={gen:'Дизельный генератор: стабильные 12 кВт, но тратит топливо.',wind:'Ветряк: бесплатная энергия, 8 кВт.',solar:'Солнечная панель: бесплатная энергия, 5 кВт.',nuke:'Реактор: огромная выработка, очень дорогая постройка.',fiber:'Дальняя связь: тянется на огромное расстояние.',balancer:'Распределяет нагрузку: сильный бонус серверам рядом.',firewall:'Защищает соседние узлы: поломки у них случаются вдвое реже.',ups:'Резервное питание: соседние узлы ломаются вдвое реже.',cloud:'Облачная платформа: даёт пользователей и бонус серверам рядом.',hub:'Одно подключение на многие: до 8 связей, но скорость делится между ними.',cable:'Дешёвый мост: тянет связь на большое расстояние, пользователей не приносит.',router:'Раздаёт интернет по области (круг на карте): узлы внутри подключаются без кабеля, скорость делится между ними.',switch:'Соединяет далёкие узлы и понемногу приводит пользователей.',sat:'Связь через орбиту: огромная дальность и много пользователей.',server:'Здесь собирают комплектующие и размещают сайты, программы и игры.',cdn:'Ускоряет доставку контента: серверы рядом получают бонус к приросту.',scanner:'Следит за безопасностью: бонус к приросту подключённых серверов.',verifier:'Проверяет сборки контента: бонус к приросту подключённых серверов.',enhancer:'Доводит контент до блеска: сильный бонус серверам рядом.',auto:'Сам привлекает пользователей, пока ты занят другим.',cpucell:'Небольшой вклад в очки исследований.',research:'Лаборатория: стабильно приносит очки исследований.',miner:'Крутит видеокарты ради дополнительных пользователей.'};
const pk={q:'',cat:'all',sel:'router',el:null};
function openPicker(){
 if(!pk.el){const e=document.createElement('div');e.className='pk';
  e.innerHTML='<div class="pt"><b>Добавить узел</b><button data-a="closePk" aria-label="Закрыть">×</button></div><div class="pbd"><div class="pl"><input id="pq" placeholder="Поиск" autocomplete="off"><div id="ptabs"></div><div id="pg"></div></div><div id="pd"></div></div>';
  document.body.appendChild(e);pk.el=e;$('#pq').oninput=ev=>{pk.q=ev.target.value.toLowerCase();pgrid()}}
 pk.el.hidden=false;pgrid()}
function pgrid(){
 const all=Object.keys(B.mods).filter(k=>k!='internet'),list=(pk.cat=='all'?all:CAT[pk.cat][1]).filter(k=>B.mods[k].n.toLowerCase().includes(pk.q));
 $('#ptabs').innerHTML=[['all','Все']].concat(Object.entries(CAT).map(([k,v])=>[k,v[0]])).map(([k,n])=>'<button class="'+(pk.cat==k?'on':'')+'" data-a="tab" data-v="'+k+'">'+n+'</button>').join('');
 $('#pg').innerHTML=list.map(k=>'<button class="nb'+(k==pk.sel?' on':'')+'" data-a="sel" data-v="'+k+'"'+(!avail(B.mods[k])?' style="opacity:.5"':'')+'><i>'+(GL[k]||'◆')+'</i><span>'+B.mods[k].n+'</span></button>').join('')||'<p class="dim">Ничего не найдено</p>';
 const m=B.mods[pk.sel],lk=m&&!avail(m);
 $('#pd').innerHTML=m?'<h3><i>'+(GL[pk.sel]||'◆')+'</i> '+m.n+'</h3><p class="dim">'+(DESC[pk.sel]||'')+'</p><p>Портов: '+(m.lim||2)+'<br>Дальность связи: '+m.r+(m.g?'<br>Выработка: +'+m.g+' кВт':'')+(m.cov?'<br>Зона раздачи: '+m.cov:'')+(m.u?'<br>Пользователи: +'+m.u+'/с':'')+(m.b?'<br>Бонус серверам: +'+m.b*100+'%':'')+(m.rp?'<br>Очки исследований: +'+m.rp+'/с':'')+'</p><button data-a="place" data-v="'+pk.sel+'"'+(lk?' disabled':'')+'>'+(lk?(m.t&&!S.tech[m.t]?'Нужно: '+B.tech[m.t].n:'Откроется при '+m.k+' польз.'):'Построить за '+(m.$||0)+' ¤')+'</button>':''}
addEventListener('keydown',e=>{if(e.key=='Escape'&&pk.el)pk.el.hidden=true});
function palette(){lastSig=sig();$('#pal').innerHTML='<button class="mb" data-a="openPk"><i>＋</i>Добавить узел</button>';if(pk.el&&!pk.el.hidden)pgrid()}
function ui(){const m=S.mods[sel];$('#sel').hidden=!m;if(!m){sel=-1;linking=false;return}
 $('#selinfo').textContent=B.mods[m.t].n+' #'+sel+': '+(online.has(sel)?'в сети':'нет связи')+'. Связей '+m.l.length+', дальность '+~~mr(m)+(linking?'. Нажми на модуль, с которым соединить.':'');
 $('#bLink').textContent=linking?'Выбери модуль…':'Соединить с…';$('#bOpen').hidden=!m.srv;const uc=upCost(m);$('#bUp').textContent=lvl(m)>=5?'Макс. уровень':'Улучшить ('+uc+' ¤)';$('#bUp').disabled=lvl(m)>=5||S.cr<uc;$('#bDel').disabled=!sel}
function changed(){recalc();renderWins();ui();save()}
$('#bLink').onclick=()=>{linking=!linking;ui()};
$('#bOpen').onclick=()=>openWin('s'+sel);
$('#bDel').onclick=()=>{const m=S.mods[sel];for(const o of m.l){const q=S.mods[o];q.l=q.l.filter(x=>x!=sel)}delete S.mods[sel];sel=-1;linking=false;changed()};
$('#bTech').onclick=()=>openWin('t');$('#bMenu').onclick=()=>openWin('m');$('#bOff').onclick=()=>openWin('o');
$('#bUp').onclick=()=>{const m=S.mods[sel],c=upCost(m);if(m&&lvl(m)<5&&S.cr>=c){S.cr-=c;m.lv=lvl(m)+1;const p=ctr(m);fl.push({x:p.x,y:p.y-30,t:performance.now(),s:'▲ ур.'+m.lv});changed()}};
$('#bHome').onclick=()=>{panT={x:-S.mods[0].x,y:-S.mods[0].y};Zt=1};
function zoomBy(f){Zt=Math.min(2,Math.max(.2,Zt*f))}
$('#bZi').onclick=()=>zoomBy(1.25);$('#bZo').onclick=()=>zoomBy(.8);
cv.addEventListener('wheel',e=>{e.preventDefault();zoomBy(e.deltaY<0?1.12:1/1.12)},{passive:false});
let rs=0;$('#bReset').onclick=e=>{const b=e.target;
 if(!rs){rs=1;b.classList.add('on');say('Нажми «Сброс» ещё раз, чтобы стереть прогресс.');setTimeout(()=>{rs=0;b.classList.remove('on')},3000)}
 else{S=fresh();sel=-1;for(const k of Object.keys(wins))closeWin(k);rs=0;b.classList.remove('on');palette();changed()}};
