/* Состояние игры, сохранение и загрузка */
/* ===== ДАННЫЕ И СОХРАНЕНИЕ ===== */
const fresh=()=>({users:0,rp:0,cr:100,sp:0,ach:{},boost:0,year:1985,pt:0,pcs:0,desks:4,work:[],cands:[],payT:0,tech:{},next:1,mods:{0:{id:0,t:'internet',x:0,y:0,l:[]}}});
let S;try{S=JSON.parse(localStorage.getItem('ig3'))}catch(e){}
if(!S||!S.mods||!S.mods[0])S=fresh();
function fix(){for(const m of Object.values(S.mods))if(m.srv&&!Array.isArray(m.srv.cont))m.srv.cont=[];S.cr??=0;S.year??=1985;S.pt??=0;S.pcs??=0;S.desks??=4;S.work??=[];S.cands??=[];S.payT??=0;S.sp??=0;S.ach??={};S.boost??=0;S.tech??={};S.rp??=0}fix();
const save=()=>{try{localStorage.setItem('ig3',JSON.stringify(S))}catch(e){}};
const f=n=>n>=1e6?(n/1e6).toFixed(2)+'M':n>=1e3?(n/1e3).toFixed(1)+'K':''+~~n;
