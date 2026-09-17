/* StoryGarden 启蒙英语 · 四集共享引擎层
   数据文件提供 SCENES / ITEMS / EPISODES / THEME；
   各玩法引擎（recog/match/photo/reveal）引用这里的语音、音效、工具与场景弹窗 */

/* ---------- voice：TTS 优先，检测不到英语音色或朗读失败时回退到离线音频 english/audio/ ---------- */
let voice=null,ttsBroken=false;
function pickVoice(){
  const vs=window.speechSynthesis?speechSynthesis.getVoices():[];
  voice=
    vs.find(v=>/emma/i.test(v.name)&&/en[-_]US/i.test(v.lang))||
    vs.find(v=>/en[-_]US/i.test(v.lang)&&/natural|online/i.test(v.name))||
    vs.find(v=>/en[-_]US/i.test(v.lang))||
    vs.find(v=>/^en([-_]|$)/i.test(v.lang))||
    vs.find(v=>/^en([-_]|$)/i.test(v.name))||
    null;
  const vn=document.getElementById('voiceName');
  if(vn)vn.textContent=voice?voice.name:'内置发音 · Built-in Audio';
}
if('speechSynthesis' in window){
  pickVoice();
  speechSynthesis.onvoiceschanged=pickVoice;
}else{
  const vn=document.getElementById('voiceName');
  if(vn)vn.textContent='内置发音 · Built-in Audio';
}

function slug(t){return t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');}
function audioKey(text){
  let m;
  if(m=text.match(/^Where is the (.+?)\?$/))return slug(m[1]);
  if(m=text.match(/^It's a (.+?)!$/))return slug(m[1]);
  if(text==="Knock knock! What's inside?")return 'knock-knock-whats-inside';
  if(text==="What's inside?")return 'whats-inside';
  if(text==='Great job!')return 'great-job';
  if(text==='Bye bye!')return 'bye-bye';
  return slug(text);
}
let curAudio=null;
function playAudio(key){
  try{
    if(curAudio){curAudio.pause();curAudio=null;}
    const a=new Audio('audio/'+key+'.wav');
    curAudio=a;
    a.play().catch(()=>{});
  }catch(e){}
}

/* utterance 必须持有全局引用：部分安卓浏览器会回收局部对象导致读一半停 */
let utter=null;
function speak(text){
  const key=audioKey(text);
  if(!('speechSynthesis' in window)||!voice||ttsBroken){
    playAudio(key);
    return;
  }
  try{speechSynthesis.cancel();}catch(e){}
  utter=new SpeechSynthesisUtterance(text);
  utter.lang='en-US';utter.rate=0.8;utter.pitch=1.05;
  if(voice)utter.voice=voice;
  utter.onerror=e=>{
    if(e.error==='interrupted'||e.error==='canceled')return;
    ttsBroken=true;
    playAudio(key);
  };
  const go=()=>{try{speechSynthesis.speak(utter);}catch(e){ttsBroken=true;playAudio(key);}};
  /* cancel 后立刻 speak 在部分安卓浏览器会被吞，稍作间隔 */
  if(speechSynthesis.speaking||speechSynthesis.pending){setTimeout(go,40);}else{go();}
}

/* 移动端解锁：iOS 音色列表要手势后才加载；AudioContext 手势外创建会被挂起。
   第一次按下时补取音色 + 恢复音频上下文 */
let unlocked=false;
function unlockMedia(){
  if(unlocked)return;
  unlocked=true;
  if('speechSynthesis' in window)pickVoice();
}
document.addEventListener('pointerdown',unlockMedia,true);

/* ---------- sound effects ---------- */
let audioCtx=null;
function ensureCtx(){
  try{
    audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();
    if(audioCtx.state==='suspended')audioCtx.resume();
  }catch(e){}
  return audioCtx;
}
function tone(freq,delay,dur,vol,type,fEnd){
  const ctx=ensureCtx();if(!ctx)return;
  try{
    const t=ctx.currentTime+delay;
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.type=type||'sine';
    o.frequency.setValueAtTime(freq,t);
    if(fEnd)o.frequency.exponentialRampToValueAtTime(fEnd,t+dur);
    g.gain.setValueAtTime(vol,t);
    g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    o.connect(g).connect(ctx.destination);
    o.start(t);o.stop(t+dur+0.02);
  }catch(e){}
}
function noiseBurst(dur,vol,center){
  const ctx=ensureCtx();if(!ctx)return;
  try{
    const t=ctx.currentTime;
    const len=Math.floor(ctx.sampleRate*dur);
    const buf=ctx.createBuffer(1,len,ctx.sampleRate);
    const d=buf.getChannelData(0);
    for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
    const src=ctx.createBufferSource();src.buffer=buf;
    const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.frequency.value=center;bp.Q.value=0.8;
    const g=ctx.createGain();
    g.gain.setValueAtTime(vol,t);
    g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    src.connect(bp).connect(g).connect(ctx.destination);
    src.start(t);src.stop(t+dur+0.02);
  }catch(e){}
}

/* ---------- utils ---------- */
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function confettiBurst(){
  const colors=['#B89048','#2D5530','#E8B04B','#7FA86B','#E58FA2','#7EB3D8'];
  for(let i=0;i<70;i++){
    const c=document.createElement('div');
    c.className='confetti';
    c.style.left=Math.random()*100+'vw';
    c.style.width=(6+Math.random()*8)+'px';
    c.style.height=(8+Math.random()*10)+'px';
    c.style.background=colors[i%colors.length];
    c.style.borderRadius=Math.random()>.5?'50%':'2px';
    c.style.animationDuration=(2.2+Math.random()*2.2)+'s';
    c.style.animationDelay=(Math.random()*.6)+'s';
    document.body.appendChild(c);
    c.addEventListener('animationend',()=>c.remove());
  }
}

/* ---------- 场景选择弹窗（引擎在定义 setScene/sceneId 后调用 initScenePicker()） ---------- */
function openPicker(){
  document.querySelectorAll('.pick').forEach(b=>b.classList.toggle('current',b.dataset.scene===sceneId));
  const picker=document.getElementById('picker');
  if(picker)picker.classList.add('show');
}
function closePicker(){
  const picker=document.getElementById('picker');
  if(picker)picker.classList.remove('show');
}
function initScenePicker(){
  const pickerGrid=document.getElementById('pickerGrid');
  SCENES.forEach(s=>{
    const b=document.createElement('button');
    b.className='pick';
    b.dataset.scene=s.id;
    b.style.setProperty('--pc',s.color);
    b.innerHTML='<span class="pick-icon" aria-hidden="true">'+s.icon+'</span>'
      +'<span class="pick-zh">'+s.zh+'</span>'
      +'<span class="pick-en">'+s.en+'</span>'
      +'<span class="pick-here">✓ 在这里</span>';
    b.setAttribute('aria-label','去'+s.zh+s.en);
    b.addEventListener('click',()=>{
      closePicker();
      if(s.id!==sceneId)setScene(s.id);
    });
    pickerGrid.appendChild(b);
  });
  document.getElementById('sceneBanner').addEventListener('click',openPicker);
  document.getElementById('pickerMask').addEventListener('click',closePicker);
  document.getElementById('pickerClose').addEventListener('click',closePicker);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closePicker();});
}

/* ---------- 集数翻页标签（EPISODES 由数据文件提供） ---------- */
function renderEpisodeNav(index){
  const mk=(ep,dir)=>{
    const a=document.createElement('a');
    a.className='ep-tab '+dir;
    a.dataset.href=ep.href;a.href=ep.href;
    a.setAttribute('aria-label',ep.no+' '+ep.name);
    a.innerHTML='<span class="arrow" aria-hidden="true">'+(dir==='next'?'→':'←')+'</span>'
      +'<span class="t"><span class="ep-no">'+ep.no+'</span><span class="ep-name">'+ep.name+'</span></span>';
    document.body.appendChild(a);
    return a;
  };
  renderEpisodeNav.tabs={
    prev:EPISODES[index-1]?mk(EPISODES[index-1],'prev'):null,
    next:EPISODES[index+1]?mk(EPISODES[index+1],'next'):null
  };
}
function syncEpisodeNav(sceneId){
  const t=renderEpisodeNav.tabs;if(!t)return;
  ['prev','next'].forEach(k=>{
    if(t[k])t[k].href=t[k].dataset.href+'#set='+sceneId;
  });
}

/* ---------- 场景切换的公共外观：标题 / 横幅 / 顶栏文字（页面上存在的元素才更新） ---------- */
function setSceneChrome(scene,epNo){
  const set=(id,fn)=>{const el=document.getElementById(id);if(el)fn(el);};
  set('tEn',el=>{el.textContent=scene.en;});
  set('tZh',el=>{el.textContent=scene.zh;});
  set('sbIcon',el=>{el.textContent=scene.icon;});
  set('sbZh',el=>{el.textContent=scene.zh;});
  set('sbEn',el=>{el.textContent=scene.en;});
  const banner=document.getElementById('sceneBanner');
  if(banner)banner.style.setProperty('--sc-color',scene.color);
  const field=document.getElementById('field');
  if(field)field.style.setProperty('--sc-color',scene.color);
  document.title=scene.en+' '+THEME.wordEn+' · '+scene.zh+THEME.wordZh+' 第 '+epNo+' 集 | StoryGarden';
  const ctx=document.querySelector('.sg-current-title');
  if(ctx)ctx.textContent=scene.zh+THEME.wordZh+' · 第 '+epNo+' 集';
}
