(function(){
  'use strict';

  var body=document.body;
  if(!body||!body.hasAttribute('data-sg-page'))return;

  var root=body.getAttribute('data-sg-root')||'.';
  var pageTitle=body.getAttribute('data-sg-title')||document.title.split(/[|·]/)[0].trim();
  var parent=body.getAttribute('data-sg-parent');
  var parentLabel=body.getAttribute('data-sg-parent-label')||'返回上一层';
  var isHome=body.hasAttribute('data-sg-home');
  var index=window.STORYGARDEN_SEARCH_INDEX||[];

  function icon(path){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+path+'</svg>';}
  function escapeText(value){var node=document.createElement('div');node.textContent=value||'';return node.innerHTML;}
  function fromRoot(path){return new URL(root.replace(/\/$/,'')+'/'+path.replace(/^\//,''),location.href).href;}

  function createHeader(){
    var header=document.createElement('header');
    header.className='sg-global-header';
    var left=isHome
      ? '<a class="sg-global-brand" href="#top" aria-label="StoryGarden 首页">'+icon('<path d="M12 21V9"/><path d="M12 9C12 9 5.5 9.5 4 13.5c2.2 0 6.3-1 8-4.5z"/><path d="M12 11c0 0 4.6-1.8 7-5.5-4 0-7 2.8-7 5.5z"/>')+'<span>StoryGarden</span></a>'
      : '<a class="sg-icon-button" href="'+escapeText(parent||fromRoot('index.html'))+'" title="'+escapeText(parentLabel)+'" aria-label="'+escapeText(parentLabel)+'">'+icon('<path d="m15 18-6-6 6-6"/>')+'</a>';
    header.innerHTML='<div class="sg-global-inner"><div class="sg-global-left">'+left+'</div>'+
      (isHome?'':'<div class="sg-global-title" title="'+escapeText(pageTitle)+'">'+escapeText(pageTitle)+'</div>')+
      '<div class="sg-global-actions">'+
        '<a class="sg-icon-button" href="'+fromRoot('index.html')+'" title="首页" aria-label="首页">'+icon('<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>')+'</a>'+
        '<button class="sg-icon-button" type="button" data-sg-open-search title="搜索" aria-label="搜索">'+icon('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>')+'</button>'+
        '<button class="sg-icon-button" type="button" data-sg-toggle-theme title="切换主题" aria-label="切换主题">'+
          '<svg class="sg-theme-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>'+
          '<svg class="sg-theme-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'+
        '</button>'+
      '</div></div>';
    body.insertBefore(header,body.firstChild);
  }

  function createSearch(){
    var overlay=document.createElement('div');
    overlay.className='sg-search-overlay';
    overlay.id='sg-search-overlay';
    overlay.hidden=true;
    overlay.innerHTML='<div class="sg-search-dialog" role="dialog" aria-modal="true" aria-labelledby="sg-search-title">'+
      '<div class="sg-search-head"><div><h2 id="sg-search-title">搜索 StoryGarden</h2><p>在全部知识页面中查找</p></div>'+
      '<button class="sg-icon-button" type="button" data-sg-close-search title="关闭搜索" aria-label="关闭搜索">'+icon('<path d="m6 6 12 12M18 6 6 18"/>')+'</button></div>'+
      '<label class="sg-search-field">'+icon('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>')+'<input id="sg-search-input" type="search" autocomplete="off" placeholder="搜索标题、专题、章节或关键词"></label>'+
      '<div class="sg-search-results" id="sg-search-results"><p class="sg-search-empty">输入关键词，搜索 '+index.length+' 个页面。</p></div></div>';
    body.appendChild(overlay);
  }

  function openSearch(){
    var overlay=document.getElementById('sg-search-overlay');
    if(!overlay)return;
    overlay.hidden=false;
    body.style.overflow='hidden';
    setTimeout(function(){document.getElementById('sg-search-input').focus();},30);
  }

  function closeSearch(){
    var overlay=document.getElementById('sg-search-overlay');
    if(!overlay)return;
    overlay.hidden=true;
    body.style.overflow='';
  }

  function renderSearch(query){
    var target=document.getElementById('sg-search-results');
    if(!target)return;
    var terms=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if(!terms.length){target.innerHTML='<p class="sg-search-empty">输入关键词，搜索 '+index.length+' 个页面。</p>';return;}
    var matches=index.filter(function(item){
      var hay=[item.title,item.topic,item.summary,item.keywords].join(' ').toLowerCase();
      return terms.every(function(term){return hay.indexOf(term)>-1;});
    }).slice(0,24);
    if(!matches.length){target.innerHTML='<p class="sg-search-empty">没有找到匹配页面，请尝试更短的关键词。</p>';return;}
    target.innerHTML=matches.map(function(item){
      return '<a class="sg-search-result" href="'+fromRoot(item.path)+'"><span><strong>'+escapeText(item.title)+'</strong><p>'+escapeText(item.summary||item.keywords||'打开页面查看详细内容')+'</p></span><span class="sg-search-topic">'+escapeText(item.topic)+'</span></a>';
    }).join('');
  }

  function toggleTheme(){
    var rootElement=document.documentElement;
    var next=rootElement.getAttribute('data-theme')==='dark'?'light':'dark';
    rootElement.setAttribute('data-theme',next);
    try{localStorage.setItem('hk-theme',next);}catch(error){}
  }

  createHeader();
  createSearch();

  document.addEventListener('click',function(event){
    if(event.target.closest('[data-sg-open-search]'))openSearch();
    if(event.target.closest('[data-sg-close-search]')||event.target.id==='sg-search-overlay')closeSearch();
    if(event.target.closest('[data-sg-toggle-theme]'))toggleTheme();
  });
  document.getElementById('sg-search-input').addEventListener('input',function(event){renderSearch(event.target.value);});
  window.addEventListener('keydown',function(event){
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){
      event.preventDefault();
      event.stopPropagation();
      openSearch();
    }
    if(event.key==='Escape'){
      event.stopPropagation();
      closeSearch();
    }
  },true);
})();
