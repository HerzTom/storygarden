/* 第 3 集 · 小小摄影师引擎（数据：SCENES / ITEMS / EPISODES / THEME） */
const field=document.getElementById('field');
const world=document.getElementById('world');
const aim=document.getElementById('aim');
const flashEl=document.getElementById('flash');
const hud=document.getElementById('hud');
const phone=document.getElementById('phone');
const screenEl=document.getElementById('screen');
const screenWorld=document.getElementById('screenWorld');
const shutterBtn=document.getElementById('shutterBtn');
const galleryThumb=document.getElementById('galleryThumb');
const missionSlots=document.getElementById('missionSlots');

const HEADER=58,Z=2.5;

/* ---------- sound effects ---------- */
const sClick=()=>{tone(2100,0,.04,.10);tone(650,.07,.06,.10);};
const sCheer=()=>{tone(523,0,.12,.08);tone(659,.09,.12,.08);tone(784,.18,.24,.08);};

function doFlash(){
  flashEl.classList.remove('on');
  void flashEl.offsetWidth;
  flashEl.classList.add('on');
}

/* ---------- game state ---------- */
let sceneId=null,batch=[],pending=new Set(),mission=null,misses=0,announced=false,lastBatch=[],round=0;
let phoneX=0,phoneY=0,phW=210,phH=430,scrW=185,scrH=360,dragging=false;
const sceneItems=()=>ITEMS.filter(a=>a.group===sceneId);

/* ---------- world ---------- */
function scatter(count,mL,mR,mT,mB,minDist,taken){
  const fw=field.clientWidth,fh=field.clientHeight;
  const pts=[];
  for(let i=0;i<count;i++){
    let best={x:mL,y:mT},bd=-1;
    for(let t=0;t<90;t++){
      const x=mL+Math.random()*Math.max(1,fw-mL-mR);
      const y=mT+Math.random()*Math.max(1,fh-mT-mB);
      let d=1e9;
      for(const p of pts.concat(taken))d=Math.min(d,Math.hypot(p.x-x,p.y-y));
      if(d>bd){bd=d;best={x,y};}
      if(bd>=minDist)break;
    }
    pts.push(best);
  }
  return pts;
}

function layoutWorld(){
  const fw=field.clientWidth||window.innerWidth;
  const fh=field.clientHeight||(window.innerHeight-HEADER);
  [world,screenWorld].forEach(w=>{w.style.width=fw+'px';w.style.height=fh+'px';});
  phW=Math.round(clamp(Math.min(fw*0.30,fh*0.36),150,200));
  phH=Math.round(phW*1.9);
  if(phH>fh-70){phH=fh-70;phW=Math.round(phH/1.9);}
  if(phW>fw-24){phW=fw-24;phH=Math.round(phW*1.9);}
  scrW=phW-Math.round(phW*0.11);
  scrH=phH-Math.round(phW*0.17);
  phone.style.width=phW+'px';phone.style.height=phH+'px';
  phone.style.borderRadius=Math.round(phW*0.19)+'px';
  screenEl.style.left=Math.round(phW*0.055)+'px';
  screenEl.style.top=Math.round(phW*0.085)+'px';
  screenEl.style.width=scrW+'px';screenEl.style.height=scrH+'px';
  screenEl.style.borderRadius=Math.round(phW*0.13)+'px';
  const shutterS=Math.min(60,Math.round(scrW*0.36));
  phone.style.setProperty('--shutter-s',shutterS+'px');
  phone.style.setProperty('--thumb-s',Math.round(shutterS*0.64)+'px');
  phone.style.setProperty('--cam-pad',Math.max(8,Math.round(phW*0.045))+'px');
  phone.style.setProperty('--cam-h',(shutterS+28)+'px');
  const mT=(hud.offsetHeight||150)+24;
  /* 边距按取景框实际可达范围算，保证每只小动物都能被完整拍进屏幕 */
  const mB=Math.max(40,Math.round(phH/2-(scrH/(2*Z)-34)));
  const mL=Math.max(50,Math.round(phW/2-(scrW/(2*Z)-34)));
  const scPos=scatter(9,40,40,20,90,140,[]);
  const aMin=Math.min(230,(fw-2*mL)*0.6,(fh-mT-mB)*0.6);
  const aPos=scatter(batch.length,mL,mL,mT,mB,aMin,scPos);
  const items=[];
  scPos.forEach(p=>items.push({x:p.x,y:p.y,emoji:THEME.deco[Math.floor(Math.random()*THEME.deco.length)],size:Math.round(30+Math.random()*22),scenery:true}));
  batch.forEach((a,i)=>{a.x=aPos[i].x;a.y=aPos[i].y;items.push({x:a.x,y:a.y,emoji:a.emoji,size:48,en:a.en});});
  let wHtml='',lHtml='';
  items.forEach(it=>{
    const st='left:'+Math.round(it.x)+'px;top:'+Math.round(it.y)+'px;font-size:'+it.size+'px';
    const isShot=it.en&&!pending.has(it.en);
    const en=it.en?' data-en="'+it.en+'"':'';
    wHtml+='<span class="ani soft'+(it.scenery?' scenery':(isShot?' shot':''))+'"'+en+' style="'+st+'">'+it.emoji+'</span>';
    lHtml+='<span class="ani'+(it.scenery?' scenery':(isShot?' shot':''))+'"'+en+' style="'+st+'">'+it.emoji+'</span>';
  });
  world.innerHTML=wHtml;
  screenWorld.innerHTML=lHtml;
  phoneX=fw/2;
  phoneY=fh/2;
  updatePhone();
}

function updatePhone(){
  phone.style.transform='translate3d('+(phoneX-phW/2)+'px,'+(phoneY-phH/2)+'px,0)';
  screenWorld.style.transform='translate('+(scrW/2-phoneX*Z)+'px,'+(scrH/2-phoneY*Z)+'px) scale('+Z+')';
}

/* ---------- aim（手机中心=定位点；点一下滑过去，拖动 1:1 跟手） ---------- */
function aimAt(cx,cy){
  const r=field.getBoundingClientRect();
  const dipB=Math.round(phW*0.085),dipS=Math.round(phW*0.055);
  phoneX=clamp(cx-r.left,phW/2-dipS,Math.max(phW/2-dipS,r.width-phW/2+dipS));
  phoneY=clamp(cy-r.top,phH/2-dipB,Math.max(phH/2-dipB,r.height-phH/2+dipB));
  updatePhone();
  announceMission();
}
aim.addEventListener('pointerdown',e=>{
  e.preventDefault();
  try{aim.setPointerCapture(e.pointerId);}catch(err){}
  dragging=true;
  phone.classList.add('glide');
  aimAt(e.clientX,e.clientY);
});
aim.addEventListener('pointermove',e=>{
  if(!dragging)return;
  phone.classList.remove('glide');
  aimAt(e.clientX,e.clientY);
});
aim.addEventListener('pointerup',()=>{dragging=false;});
aim.addEventListener('pointercancel',()=>{dragging=false;});
field.addEventListener('contextmenu',e=>e.preventDefault());

function announceMission(){
  if(announced||!mission)return;
  announced=true;
  speak('Where is the '+mission.en+'?');
}

/* ---------- slots ---------- */
function buildSlots(){
  missionSlots.innerHTML='';
  batch.forEach(a=>{
    const s=document.createElement('span');
    s.className='slot';
    s.dataset.en=a.en;
    s.innerHTML='<span class="s-emoji" aria-hidden="true">'+a.emoji+'</span><span class="s-word" lang="en">'+a.en+'</span>';
    missionSlots.appendChild(s);
  });
}
function syncSlots(){
  missionSlots.querySelectorAll('.slot').forEach(s=>{
    const done=!pending.has(s.dataset.en);
    s.classList.toggle('done',done);
    s.classList.toggle('now',!!mission&&!done&&s.dataset.en===mission.en);
  });
}

/* ---------- shoot ---------- */
function showHint(){
  if(!mission)return;
  document.querySelectorAll('#world .ani[data-en="'+mission.en+'"],#screenWorld .ani[data-en="'+mission.en+'"]')
    .forEach(el=>el.classList.add('hint'));
}
function clearHint(){
  document.querySelectorAll('.ani.hint').forEach(el=>el.classList.remove('hint'));
}
function nextMission(announceNow){
  clearHint();misses=0;
  const remaining=batch.filter(a=>pending.has(a.en));
  mission=remaining.length?remaining[Math.floor(Math.random()*remaining.length)]:null;
  if(mission){
    announced=false;
    if(announceNow)announceMission();
  }
  syncSlots();
}
function batchDone(){
  mission=null;misses=0;clearHint();
  syncSlots();
  sCheer();
  speak('Great job!');
  confettiBurst();
  const r=round;
  setTimeout(()=>{if(r===round)newBatch(false);},2400);
}
function shoot(){
  if(!pending.size)return;
  sClick();
  const hw=scrW/Z*0.75,hh=scrH/Z*0.7;
  const hit=batch.find(a=>pending.has(a.en)&&Math.abs(a.x-phoneX)<hw&&Math.abs(a.y-phoneY)<hh);
  if(!hit){
    misses++;
    if(misses>=2&&mission)showHint();
    return;
  }
  doFlash();
  pending.delete(hit.en);
  misses=0;
  clearHint();
  document.querySelectorAll('#world .ani[data-en="'+hit.en+'"],#screenWorld .ani[data-en="'+hit.en+'"]')
    .forEach(el=>{el.classList.remove('soft','hint');el.classList.add('shot');});
  syncSlots();
  galleryThumb.textContent=hit.emoji;
  galleryThumb.classList.remove('pop');
  void galleryThumb.offsetWidth;
  galleryThumb.classList.add('pop');
  speak(hit.en[0].toUpperCase()+hit.en.slice(1)+'!');
  if(pending.size){
    const r=round;
    setTimeout(()=>{if(r===round)nextMission(true);},800);
  }else{
    batchDone();
  }
}
shutterBtn.addEventListener('click',shoot);

/* ---------- batch / scene ---------- */
function newBatch(announceNow){
  round++;
  clearHint();
  const all=sceneItems();
  const rest=all.filter(a=>!lastBatch.includes(a.en));
  batch=shuffle(rest.length>=4?rest:shuffle([...all])).slice(0,4);
  lastBatch=batch.map(a=>a.en);
  pending=new Set(batch.map(a=>a.en));
  galleryThumb.textContent='';
  layoutWorld();
  buildSlots();
  nextMission(!!announceNow);
}
function setScene(id){
  sceneId=id;
  const scene=SCENES.find(s=>s.id===id);
  setSceneChrome(scene,3);
  syncEpisodeNav(id);
  lastBatch=[];
  newBatch(false);
}
document.getElementById('reshoot').addEventListener('click',()=>newBatch(true));
window.addEventListener('resize',()=>{if(batch.length)layoutWorld();});

/* ---------- start ---------- */
const params=()=>new URLSearchParams(location.hash.slice(1)||location.search);
const initial=SCENES.some(s=>s.id===params().get('set'))?params().get('set'):THEME.def;
initScenePicker();
renderEpisodeNav(2);
setScene(initial);
