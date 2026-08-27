/* =========================================================
   Netflix Culture Handbook · 共享脚本
   主题切换(hk-theme) / TOC滚动高亮 / 滚动渐显 / 场景卡自测
   ========================================================= */
(function(){
  /* ---------- 主题切换（与 StoryGarden 互通 hk-theme） ---------- */
  function syncTheme(){
    var dark=document.documentElement.getAttribute('data-theme')==='dark';
    var m=document.getElementById('icon-moon'),s=document.getElementById('icon-sun');
    if(m&&s){m.style.display=dark?'none':'block';s.style.display=dark?'block':'none';}
  }
  window.toggleTheme=function(){
    var c=document.documentElement.getAttribute('data-theme');
    var n=c==='dark'?'light':'dark';
    document.documentElement.setAttribute('data-theme',n);
    try{localStorage.setItem('hk-theme',n);}catch(e){}
    syncTheme();
  };

  /* ---------- 滚动渐显 ---------- */
  function initReveal(){
    var els=document.querySelectorAll('.reveal');
    if(!('IntersectionObserver' in window)||!els.length){els.forEach(function(e){e.classList.add('in');});return;}
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});
    },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(e){io.observe(e);});
  }

  /* ---------- 章节 TOC 滚动高亮 ---------- */
  function initRail(){
    var rail=document.getElementById('article-rail');
    if(!rail)return;
    var links=Array.prototype.slice.call(rail.querySelectorAll('a'));
    var map={};
    links.forEach(function(a){
      var id=a.getAttribute('href').replace('#','');
      var sec=document.getElementById(id);
      if(sec)map[id]={link:a,sec:sec};
    });
    if(!('IntersectionObserver' in window))return;
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          links.forEach(function(l){l.classList.remove('active');});
          var hit=map[en.target.id];
          if(hit)hit.link.classList.add('active');
        }
      });
    },{rootMargin:'-30% 0px -60% 0px',threshold:0});
    Object.keys(map).forEach(function(k){io.observe(map[k].sec);});
  }

  /* ---------- 场景卡自测交互 ---------- */
  function initScenarios(){
    document.querySelectorAll('.scenario').forEach(function(sc){
      var opts=sc.querySelectorAll('.opt button');
      var fb=sc.querySelector('.feedback');
      var answered=false;
      opts.forEach(function(btn){
        btn.addEventListener('click',function(){
          if(answered)return;answered=true;
          var ok=btn.getAttribute('data-ok')==='1';
          btn.classList.add(ok?'correct':'wrong');
          opts.forEach(function(o){
            if(o.getAttribute('data-ok')==='1')o.classList.add('correct');
          });
          if(fb){fb.classList.add('show');
            fb.textContent=ok?'✓ 正是如此。'+ (fb.getAttribute('data-ok')||'') : '✗ 再想想——'+ (fb.getAttribute('data-no')||'');
          }
        });
      });
    });
  }

  /* ---------- 系统图节点：键盘可达 + 悬停态已由 CSS 处理 ---------- */
  function initDiagram(){
    var svg=document.getElementById('culture-diagram');
    if(!svg)return;
    svg.querySelectorAll('.node').forEach(function(n){
      var href=n.getAttribute('data-href');
      if(!href)return;
      n.setAttribute('tabindex','0');
      n.setAttribute('role','link');
      n.addEventListener('click',function(){window.location.href=href;});
      n.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();window.location.href=href;}});
    });
  }

  function boot(){
    syncTheme();
    initReveal();
    initRail();
    initScenarios();
    initDiagram();
  }
  if(document.readyState!=='loading')boot();
  else document.addEventListener('DOMContentLoaded',boot);
})();
