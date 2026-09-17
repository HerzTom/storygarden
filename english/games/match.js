/* 第 2 集 · 配对上色引擎（数据：SCENES / ITEMS / EPISODES / THEME） */
const pool=document.getElementById('pool');
const field=document.getElementById('field');

/* ---------- sound effects ---------- */
const sPick =()=>{tone(440,0,.07,.06);tone(660,.05,.08,.06);};
const sGood =()=>{tone(523,0,.12,.08);tone(659,.09,.12,.08);tone(784,.18,.22,.08);};
const sBad  =()=>{tone(300,0,.14,.05);tone(230,.1,.18,.05);};
const sRound=()=>{tone(523,0,.1,.08);tone(659,.08,.1,.08);tone(784,.16,.1,.08);tone(1047,.24,.26,.08);};

/* ---------- game state ---------- */
let sceneId=null,lastBatch=[],matchedInRound=0;
let state='idle',pickedCard=null,ghost=null,gw=0,gh=0,moved=false,sX=0,sY=0;

const sceneItems=()=>ITEMS.filter(a=>a.group===sceneId);

function setScene(id){
  sceneId=id;
  const scene=SCENES.find(s=>s.id===id);
  setSceneChrome(scene,2);
  syncEpisodeNav(id);
  newBatch();
}

function makeAvatar(a){
  const b=document.createElement('button');
  b.className='avatar';
  b.dataset.en=a.en;
  b.setAttribute('aria-label',a.en+'，'+a.zh);
  b.textContent=a.emoji;
  b.addEventListener('pointerdown',e=>{
    e.preventDefault();
    if(state==='sticky')stickyDrop(e.clientX,e.clientY);
    if(state!=='idle')return;
    if(b.classList.contains('gone'))return;
    startPick(b,e);
  });
  b.addEventListener('contextmenu',e=>e.preventDefault());
  return b;
}
function makeFieldCard(a){
  const b=document.createElement('button');
  b.className='card';
  b.style.setProperty('--card-bg',a.bg);
  b.dataset.en=a.en;
  b.setAttribute('aria-label',a.en+'，'+a.zh);
  b.innerHTML='<span class="pic" aria-hidden="true">'+a.emoji+'</span>'
    +'<span class="word" lang="en">'+a.en+'</span>'
    +'<span class="zh">'+a.zh+'</span>';
  b.addEventListener('contextmenu',e=>e.preventDefault());
  return b;
}

function newBatch(){
  killGhost();
  state='idle';pickedCard=null;matchedInRound=0;
  const all=sceneItems();
  const rest=shuffle(all.filter(a=>!lastBatch.includes(a.en)));
  const batch=(rest.length>=4?rest:shuffle([...all])).slice(0,4);
  lastBatch=batch.map(a=>a.en);
  pool.innerHTML='';field.innerHTML='';
  shuffle([...batch]).forEach(a=>pool.appendChild(makeAvatar(a)));
  shuffle([...batch]).forEach(a=>field.appendChild(makeFieldCard(a)));
}

/* ---------- pick & drop ---------- */
function startPick(card,e){
  state='drag';pickedCard=card;moved=false;
  sX=e.clientX;sY=e.clientY;
  card.classList.add('pick');
  const r=card.getBoundingClientRect();
  gw=r.width;gh=r.height;
  ghost=card.cloneNode(true);
  ghost.className='ghost';
  ghost.removeAttribute('id');
  ghost.style.width=gw+'px';ghost.style.height=gh+'px';
  document.body.appendChild(ghost);
  moveGhost(e.clientX,e.clientY);
  sPick();
  speak('Where is the '+card.dataset.en+'?');
}
function moveGhost(x,y){
  if(ghost)ghost.style.transform='translate('+(x-gw/2)+'px,'+(y-gh/2)+'px)';
}
function flyGhost(x,y,dur,cb){
  if(!ghost){cb&&cb();return;}
  ghost.style.transition='transform '+dur+'ms ease';
  moveGhost(x,y);
  setTimeout(()=>{if(ghost)ghost.style.transition='';cb&&cb();},dur+30);
}
function killGhost(){if(ghost){ghost.remove();ghost=null;}}

function nearestField(x,y){
  let best=null,bd=1e9;
  field.querySelectorAll('.card:not(.alive)').forEach(c=>{
    const r=c.getBoundingClientRect();
    const d=Math.hypot(x-(r.left+r.width/2),y-(r.top+r.height/2));
    if(d<bd){bd=d;best=c;}
  });
  if(!best)return null;
  const R=Math.min(200,best.getBoundingClientRect().width*1.2);
  return bd<=R?best:null;
}
function dropOn(x,y,instantFail){
  const target=nearestField(x,y);
  if(target&&target.dataset.en===pickedCard.dataset.en){
    commitMatch(pickedCard,target);
  }else{
    failDrop(instantFail);
  }
}
function tryDrop(x,y){if(pickedCard)dropOn(x,y,true);}
function stickyDrop(x,y){if(pickedCard)dropOn(x,y,false);}

function commitMatch(avatar,target){
  const atScene=sceneId;
  state='busy';
  const r=target.getBoundingClientRect();
  flyGhost(r.left+r.width/2,r.top+r.height/2,220,()=>{
    killGhost();
    if(sceneId!==atScene){pickedCard=null;state='idle';return;}
    const a=ITEMS.find(v=>v.en===target.dataset.en);
    target.classList.add('alive','boing');
    setTimeout(()=>target.classList.remove('boing'),500);
    sGood();
    speak(a.en+'!');
    avatar.classList.remove('pick');
    avatar.classList.add('gone');
    pickedCard=null;
    matchedInRound++;
    setTimeout(()=>{
      state='idle';
      if(matchedInRound===4)batchDone();
    },650);
  });
}
function failDrop(instant){
  state='busy';
  const r=pickedCard.getBoundingClientRect();
  const cx=r.left+r.width/2,cy=r.top+r.height/2;
  const finish=()=>{
    killGhost();
    pickedCard.classList.remove('pick');
    pickedCard=null;state='idle';
    sBad();
  };
  if(instant){flyGhost(cx,cy,260,finish);}else{finish();}
}

document.addEventListener('pointerdown',e=>{
  if(state==='sticky'){stickyDrop(e.clientX,e.clientY);e.preventDefault();}
},true);
document.addEventListener('pointermove',e=>{
  if((state==='drag'||state==='sticky')&&ghost){
    if(state==='drag'&&Math.hypot(e.clientX-sX,e.clientY-sY)>8)moved=true;
    moveGhost(e.clientX,e.clientY);
  }
});
document.addEventListener('pointerup',e=>{
  if(state!=='drag')return;
  if(!moved){state='sticky';}
  else{tryDrop(e.clientX,e.clientY);}
});

/* ---------- batch flow ---------- */
function batchDone(){
  sRound();
  confettiBurst();
  setTimeout(()=>speak('Great job!'),900);
  setTimeout(newBatch,2200);
}
document.getElementById('refresh').addEventListener('click',()=>{
  if(state==='busy')return;
  newBatch();
});

/* ---------- start ---------- */
const params=()=>new URLSearchParams(location.hash.slice(1)||location.search);
const initial=SCENES.some(s=>s.id===params().get('set'))?params().get('set'):THEME.def;
initScenePicker();
renderEpisodeNav(1);
setScene(initial);
