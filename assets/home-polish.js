(function(){
  'use strict';
  var body=document.body;
  if(!body||!body.hasAttribute('data-sg-home'))return;
  var shell=document.querySelector('.home-shell');
  if(!shell)return;

  function icon(path,cls){return '<svg'+(cls?' class="'+cls+'"':'')+' viewBox="0 0 24 24" aria-hidden="true">'+path+'</svg>';}
  var seedMark='<svg viewBox="0 0 36 36" aria-hidden="true"><path d="M18 29V15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><ellipse cx="18" cy="25.5" rx="3.6" ry="5" fill="currentColor" opacity=".2"/><path d="M18 16c-5.8-.2-9.1-2.6-10.5-7.2 5.4-.1 9.2 2.4 10.5 7.2Z" fill="currentColor" opacity=".78"/><path d="M18 19c5.9-.3 9.2-3 10.4-7.7-5.5 0-9.2 2.6-10.4 7.7Z" fill="currentColor"/></svg>';
  var sidebarInner=shell.querySelector('.home-sidebar-inner');
  sidebarInner.insertAdjacentHTML('afterbegin','<a class="home-brand" href="#top" aria-label="StoryGarden 首页"><span class="home-brand-mark">'+seedMark+'</span><span class="home-wordmark"><span class="story">Story</span><span class="home-garden">Garden</span></span></a>');
  var oldNote=sidebarInner.querySelector('.home-nav-note');
  // Home stats reflect the newly added photography topic.
  
  oldNote.insertAdjacentHTML('afterend','<div class="home-sidebar-stats"><div class="home-stat-line"><span>Topics</span><strong>7</strong></div><div class="home-stat-line"><span>Pages</span><strong>100+</strong></div><div class="home-stat-line"><span>Last tended</span><strong>08.28</strong></div><button class="home-side-theme" type="button" data-sg-toggle-theme>'+icon('<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>','home-theme-moon')+icon('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>','home-theme-sun')+'<span>切换主题</span></button></div>');
  var statTopics=sidebarInner.querySelector('.home-sidebar-stats .home-stat-line strong');
  if(statTopics)statTopics.textContent='8';

  shell.insertAdjacentHTML('afterbegin','<div class="home-actions"><button class="home-action" type="button" data-sg-open-search aria-label="搜索">'+icon('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>')+'</button><button class="home-action" type="button" data-sg-toggle-theme aria-label="切换主题">'+icon('<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>','home-theme-moon')+icon('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>','home-theme-sun')+'</button></div>');

  var oldTitle=shell.querySelector('.home-hero-copy h1');
  oldTitle.className='home-logo-title';
  oldTitle.innerHTML='<span class="story">Story</span><span class="home-garden">Garden</span>';

  var posters={
    ai:{main:'AI',sub:['01—12','Transformer','Agent','RAG'],graphic:'<path d="M12 74 52 28l48 38 42-52 47 50"/><path d="m52 28 19 82 29-44 42 53 0-105" opacity=".42"/><g fill="var(--home-surface)"><circle cx="12" cy="74" r="8"/><circle cx="52" cy="28" r="11"/><circle cx="100" cy="66" r="14"/><circle cx="142" cy="14" r="7"/><circle cx="189" cy="64" r="10"/></g>'},
    disorder:{main:'ORDER',sub:['SYSTEM','DEFAULTS','MAINTAIN'],graphic:'<g fill="none"><rect x="6" y="18" width="36" height="28" rx="4"/><rect x="50" y="18" width="36" height="28" rx="4"/><rect x="6" y="54" width="36" height="28" rx="4"/><rect x="50" y="54" width="36" height="28" rx="4"/><path d="M100 50h34m-10-10 11 10-11 10"/></g><g fill="currentColor" stroke="none"><circle cx="153" cy="26" r="4"/><circle cx="184" cy="48" r="3"/><circle cx="148" cy="73" r="3"/><circle cx="191" cy="87" r="5"/><path d="m174 18 5 9-10 1z"/></g>'},
    concurrency:{main:'QPS',sub:['P99','CACHE','QUEUE','SLA'],graphic:'<path d="M8 28h43l18 22h38l18 22h66"/><path d="M8 66h38l16 20h47l15 18h67" opacity=".45"/><g fill="var(--home-surface)"><circle cx="8" cy="28" r="6"/><circle cx="8" cy="66" r="6"/><rect x="69" y="38" width="38" height="29" rx="5"/><rect x="125" y="58" width="58" height="29" rx="5"/></g>'},
    meta:{main:'LOOP',sub:['OBSERVE','FEEDBACK','REWRITE'],graphic:'<ellipse cx="99" cy="61" rx="82" ry="46"/><circle cx="99" cy="61" r="28" opacity=".5"/><circle cx="99" cy="61" r="8" fill="currentColor" stroke="none"/><path d="M38 30c25-20 65-24 96-9"/><path d="m131 14 8 8-11 3"/>'},
    netflix:{main:'N',sub:['FREEDOM','RESPONSIBILITY','TALENT'],graphic:'<path d="M26 14h35l34 96H60L26 14Z" fill="currentColor" stroke="none"/><path d="M61 14h35l38 96H99L61 14Z" fill="currentColor" opacity=".5" stroke="none"/><path d="M96 14h35l54 96h-36L96 14Z" fill="currentColor" opacity=".22" stroke="none"/>'},
    native:{main:'BUILD',sub:['TEST','LEARN','EXIT'],graphic:'<circle cx="33" cy="62" r="22"/><circle cx="99" cy="62" r="22"/><circle cx="165" cy="62" r="22"/><path d="M55 62h22m44 0h22"/><path d="m70 56 7 6-7 6m66-12 7 6-7 6"/>'},
    longtail:{main:'TAIL',sub:['HEAD','NICHE','AGGREGATE'],graphic:'<path d="M8 104h184M8 18v86" opacity=".35"/><path d="M12 22c25 1 37 12 49 33 18 32 35 45 75 48 22 2 39 2 56 2" stroke-width="4"/><path d="M13 23h48v80H13z" fill="currentColor" opacity=".08" stroke="none"/>'}
    ,'black-and-white':{main:'B&W',sub:['LIGHT','FORM','SILENCE'],graphic:'<circle cx="148" cy="60" r="39"/><circle cx="148" cy="60" r="16"/><path d="M14 102 64 36l34 36 48-56 43 54"/>'}
  };
  shell.querySelectorAll('.home-topic-card').forEach(function(card){
    var data=posters[card.getAttribute('data-topic')];
    if(!data)return;
    var art=card.querySelector('.home-topic-art');
    art.innerHTML='<div class="home-poster"><span class="poster-index">0'+card.getAttribute('data-order')+' / 07</span><strong class="poster-main">'+data.main+'</strong><div class="poster-sub">'+data.sub.map(function(item){return '<span>'+item+'</span>';}).join('')+'</div><div class="poster-graphic"><svg viewBox="0 0 200 120" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">'+data.graphic+'</svg></div></div>';
  });

  var grid=shell.querySelector('.home-topic-grid');
  function syncLayout(){
    var active=shell.querySelector('[data-home-filter].is-active');
    grid.setAttribute('data-layout',active?active.getAttribute('data-home-filter'):'featured');
  }
  shell.querySelectorAll('[data-home-filter]').forEach(function(button){button.addEventListener('click',function(){setTimeout(syncLayout,0);});});
  syncLayout();
})();
