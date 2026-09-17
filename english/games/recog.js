/* 第 1 集 · 点认卡引擎（数据：SCENES / ITEMS / EPISODES / THEME） */
const grid=document.getElementById('grid');

/* ---------- pop sound ---------- */
function pop(){
  const ctx=ensureCtx();if(!ctx)return;
  try{
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.type='sine';
    o.frequency.setValueAtTime(520,ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(880,ctx.currentTime+0.09);
    g.gain.setValueAtTime(0.10,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.18);
    o.connect(g).connect(ctx.destination);
    o.start();o.stop(ctx.currentTime+0.2);
  }catch(e){}
}

/* ---------- scene ---------- */
let sceneId=null;
const sceneItems=()=>ITEMS.filter(a=>a.group===sceneId);

function setScene(id){
  sceneId=id;
  const scene=SCENES.find(s=>s.id===id);
  setSceneChrome(scene,1);
  syncEpisodeNav(id);
  renderGrid();
}

function renderGrid(){
  grid.innerHTML='';
  sceneItems().forEach(a=>{
    const btn=document.createElement('button');
    btn.className='card';
    btn.style.setProperty('--card-bg',a.bg);
    btn.setAttribute('aria-label',a.en+'，'+a.zh);
    btn.innerHTML='<span class="pic" aria-hidden="true">'+a.emoji+'</span>'
      +'<span class="word" lang="en">'+a.en+'</span>'
      +'<span class="zh">'+a.zh+'</span>';
    btn.addEventListener('pointerdown',()=>{
      pop();speak(a.en);
      btn.classList.remove('boing');
      void btn.offsetWidth;
      btn.classList.add('boing');
    });
    grid.appendChild(btn);
  });
}

/* ---------- start ---------- */
const params=()=>new URLSearchParams(location.hash.slice(1)||location.search);
const initial=SCENES.some(s=>s.id===params().get('set'))?params().get('set'):THEME.def;
initScenePicker();
renderEpisodeNav(0);
setScene(initial);
