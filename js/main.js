/* Запуск: игровой цикл */
/* ===== ЗАПУСК ===== */
let last=performance.now(),acc=0;
function tick(t){const dt=Math.min((t-last)/1000,1);last=t;Z+=(Zt-Z)*Math.min(1,dt*10);if(panT){const k=Math.min(1,dt*8);pan.x+=(panT.x-pan.x)*k;pan.y+=(panT.y-pan.y)*k;if(Math.hypot(panT.x-pan.x,panT.y-pan.y)<.5)panT=null}S.users+=rate*dt;S.rp+=rpRate*dt;S.cr=Math.max(0,S.cr+(crRate-bill)*dt);S.year+=dt/20;S.pt+=dt;acc+=dt;
 if(acc>.5){acc=0;wear();officeStep(.5);recalc();checkAch();renderWins();if(sig()!=lastSig)palette();ui()}
 setT('#users',f(S.users));$('#urate').textContent='+'+rate.toFixed(1)+'/с';
 setT('#cr',f(S.cr));$('#crr').textContent='+'+crRate.toFixed(1)+'/с';setT('#sp',''+S.sp);setT('#yr',''+~~S.year);setT('#pw',~~pwDem+'/'+~~pwSup+' кВт');$('#pwr').textContent='−'+(bill*60).toFixed(1)+' ¤/мин';$('#pw').style.color=blk?'var(--bad)':'';setT('#rp',f(S.rp));$('#rrate').textContent='+'+rpRate.toFixed(2)+'/с';
 draw()}
function loop(t){try{tick(t)}catch(e){console.error(e)}requestAnimationFrame(loop)}
$('#msg').textContent=HINT;palette();recalc();ui();resize();
setInterval(save,5000);addEventListener('pagehide',save);
requestAnimationFrame(loop);
