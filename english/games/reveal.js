/* 第 4 集 · 惊喜容器引擎（数据：SCENES / ITEMS / EPISODES / THEME）
   THEME.container：'box' 快递箱（撕胶带） / 'garage' 车库（上拉卷帘门） */
const field=document.getElementById('field');
const stage=document.getElementById('stage');
const star=document.getElementById('star');
const box=document.getElementById('box');
const garage=document.getElementById('garage');
const cont=box||garage;
const tape=document.getElementById('tape');
const isGarage=!!garage;

const HEADER=58;

/* ---------- sound effects ---------- */
const sKnock=()=>{tone(130,0,.1,.3);tone(118,.17,.1,.26);};
const sRip=()=>noiseBurst(.38,.2,1700);
const sRoll=()=>{noiseBurst(.5,.08,320);tone(90,0,.5,.10,'triangle',150);};
const sOpen=()=>tone(300,0,.18,.09,'triangle',560);
const sBoing=()=>tone(360,0,.16,.12,'triangle',90);
const sVroom=()=>{tone(110,0,.5,.11,'sawtooth',330);tone(140,.4,.4,.09,'sawtooth',360);};
const sCheer=()=>{tone(523,0,.12,.08);tone(659,.09,.12,.08);tone(784,.18,.24,.08);};

/* ---------- world ---------- */
let boxW=220,boxH=200;
function layout(){
  const fw=field.clientWidth||window.innerWidth;
  const fh=field.clientHeight||window.innerHeight-HEADER;
  boxW=Math.round(clamp(Math.min(fw*0.46,fh*0.5),160,280));
  boxH=Math.round(boxW*0.9);
  field.style.setProperty('--bw',boxW+'px');
  field.style.setProperty('--bh',boxH+'px');
}
function scatterDecor(){
  document.querySelectorAll('.decor').forEach(d=>d.remove());
  const fw=field.clientWidth||window.innerWidth;
  const fh=field.clientHeight||window.innerHeight-HEADER;
  const cx=fw/2,cy=fh*0.56;
  let n=0;
  for(let i=0;i<60&&n<9;i++){
    const x=Math.random()*fw,y=Math.random()*fh;
    if(Math.abs(x-cx)<boxW*1.1&&Math.abs(y-cy)<boxH*1.05)continue;
    const s=document.createElement('span');
    s.className='decor';
    s.textContent=THEME.deco[Math.floor(Math.random()*THEME.deco.length)];
    const size=Math.round(26+Math.random()*26);
    s.style.cssText='left:'+Math.round(x)+'px;top:'+Math.round(y)+'px;font-size:'+size+'px';
    field.appendChild(s);
    n++;
  }
}
const sceneItems=()=>ITEMS.filter(a=>a.group===sceneId);

/* ---------- game state ---------- */
let sceneId=null,phase='idle',boxRound=0,lastShown=[];
let lastAsk=0;

function pickItem(){
  const all=sceneItems();
  const rest=all.filter(a=>!lastShown.includes(a.en));
  const pool=rest.length?rest:all;
  const a=pool[Math.floor(Math.random()*pool.length)];
  lastShown.push(a.en);
  if(lastShown.length>10)lastShown.shift();
  return a;
}

/* ---------- 一只容器的生命周期 ---------- */
function newBox(){
  boxRound++;
  const r=boxRound;
  phase='knock';
  star.classList.remove('show','rise','g-rise','colored','free');
  star.style.left='';
  star.style.top='';
  cont.classList.remove('open','wiggle','ready');
  if(tape)tape.classList.remove('cut','ready');
  stage.classList.add('noanim','out');
  void stage.offsetWidth;
  stage.classList.remove('noanim');
  requestAnimationFrame(()=>stage.classList.remove('out'));
  setTimeout(()=>stage.classList.remove('out'),40);
  setTimeout(()=>{if(r!==boxRound)return;sKnock();},520);
  setTimeout(()=>{if(r!==boxRound)return;speak("Knock knock! What's inside?");},620);
  setTimeout(()=>{if(r!==boxRound||phase!=='knock')return;phase='tape';cont.classList.add('ready');if(tape)tape.classList.add('ready');},2200);
}

function startOpen(){
  if(phase!=='tape'&&phase!=='knock')return;
  phase='cutting';
  const r=boxRound;
  if(isGarage){
    cont.classList.remove('ready');
    cont.classList.add('open');
    sRoll();
    setTimeout(()=>{if(r!==boxRound)return;reveal(r);},720);
  }else{
    tape.classList.remove('ready');
    tape.classList.add('cut');
    sRip();
    setTimeout(()=>{if(r!==boxRound)return;openFlaps(r);},620);
  }
}
function openFlaps(r){
  phase='open';
  cont.classList.add('open');
  sOpen();
  setTimeout(()=>{if(r!==boxRound)return;reveal(r);},600);
}
function reveal(r){
  phase='reveal';
  const a=currentItem;
  star.classList.add('show',isGarage?'g-rise':'rise');
  setTimeout(()=>{
    if(r!==boxRound)return;
    star.classList.add('colored');
    sCheer();
    speak("It's a "+a.en+"!");
  },560);
  setTimeout(()=>{if(r!==boxRound)return;hopAway(r);},2000);
}
let currentItem=null;
function hopAway(r){
  phase='hop';
  speak('Bye bye!');
  const dir=Math.random()<.5?-1:1;
  const fw=field.clientWidth||window.innerWidth;
  star.classList.remove('rise','g-rise');
  star.classList.add('free');
  const br=star.getBoundingClientRect(),contR=cont.getBoundingClientRect();
  const x0=br.width?br.left+br.width/2-contR.left:boxW/2;
  const y0=br.width?br.top+br.height/2-contR.top:(isGarage?boxH*0.5:boxH*0.3-boxW*0.44);
  const travel=(fw*0.58+boxW)*dir;
  const hops=isGarage?3:4,dur=1600,hopH=isGarage?boxH*0.16:boxH*0.5,rotAmp=isGarage?7:26;
  if(isGarage)sVroom();
  const t0=performance.now();
  let lastHop=0;
  function frame(now){
    if(r!==boxRound)return;
    const t=Math.min(1,(now-t0)/dur);
    const e=t*t*(3-2*t);
    const x=x0+travel*e;
    const y=y0-hopH*Math.abs(Math.sin(t*Math.PI*hops));
    star.style.left=x+'px';
    star.style.top=y+'px';
    star.style.transform='translate(-50%,-50%) rotate('+(dir*e*rotAmp)+'deg) scale(1)';
    const hi=Math.floor(t*hops);
    if(hi>lastHop){lastHop=hi;if(!isGarage)sBoing();}
    if(t<1){requestAnimationFrame(frame);}
    else{
      star.classList.remove('show');
      boxExit(r);
    }
  }
  requestAnimationFrame(frame);
}
function boxExit(r){
  stage.classList.add('out');
  setTimeout(()=>{if(r!==boxRound)return;spawn();},560);
}
function spawn(){
  currentItem=pickItem();
  star.textContent=currentItem.emoji;
  newBox();
}

/* ---------- 划动手势：撕胶带=连划任意方向；卷帘门=够长且整体向上 ---------- */
function cutNeed(){return Math.max(70,boxW*0.55);}
let down=false,lastPt=null,downY=0,pathLen=0;
field.addEventListener('pointerdown',e=>{
  if(phase!=='knock'&&phase!=='tape')return;
  e.preventDefault();
  try{field.setPointerCapture(e.pointerId);}catch(err){}
  down=true;lastPt=[e.clientX,e.clientY];downY=e.clientY;pathLen=0;
});
field.addEventListener('pointermove',e=>{
  if(!down)return;
  const dx=e.clientX-lastPt[0],dy=e.clientY-lastPt[1];
  lastPt=[e.clientX,e.clientY];
  pathLen+=Math.hypot(dx,dy);
  if(pathLen<cutNeed())return;
  if(isGarage){
    if(downY-e.clientY>=Math.max(36,boxW*0.18))startOpen();
  }else{
    startOpen();
  }
});
field.addEventListener('pointerup',()=>{
  if(!down)return;
  down=false;
  if(pathLen>=12)return;
  if(phase!=='knock'&&phase!=='tape')return;
  cont.classList.remove('wiggle');
  void cont.offsetWidth;
  cont.classList.add('wiggle');
  sKnock();
  if(phase==='tape'&&Date.now()-lastAsk>2500){
    lastAsk=Date.now();
    speak("What's inside?");
  }
});
field.addEventListener('pointercancel',()=>{down=false;});

/* ---------- scene ---------- */
function setScene(id){
  sceneId=id;
  const scene=SCENES.find(s=>s.id===id);
  setSceneChrome(scene,4);
  syncEpisodeNav(id);
  lastShown=[];
  layout();
  scatterDecor();
  spawn();
}
window.addEventListener('resize',()=>{layout();scatterDecor();});

/* ---------- start ---------- */
const params=()=>new URLSearchParams(location.hash.slice(1)||location.search);
const initial=SCENES.some(s=>s.id===params().get('set'))?params().get('set'):THEME.def;
initScenePicker();
renderEpisodeNav(3);
setScene(initial);
