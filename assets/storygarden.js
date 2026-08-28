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
  var disorderSearch=[
    ['entropy-basics.html','什么是熵与熵增定律','原理篇','混乱程度 概率 微观状态 热力学第二定律'],['why-order-breaks.html','有序为何总会崩坏','原理篇','概率碾压 扑克牌 自发衰减'],['information-entropy.html','信息熵与生活中的熵','原理篇','搜索成本 文件 信息 不确定性'],['open-systems.html','开放系统与负熵','原理篇','开放系统 耗散结构 负熵 供能'],['order-costs-energy.html','维持秩序必然耗能','原理篇','能量 一劳永逸 三个杠杆'],['entropy-signals.html','熵增在生活工作中的表现','认知篇','六大领域 体检 症状 预警'],['minimum-energy.html','最小能耗原则','认知篇','源头减量 系统默认 小步高频'],['common-mistakes.html','常见误区','认知篇','自律 收纳 完美 大扫除'],['messy-room.html','越来越乱的桌面与房间','案例篇','房间 桌面 暂放区 一物一家'],['digital-clutter.html','失控的文件与数字资料','案例篇','文件 相册 收件箱 Inbox'],['overloaded-calendar.html','被塞满的日程与时间','案例篇','日历 时间 缓冲 待办'],['team-entropy.html','团队协作与项目的熵增','案例篇','团队 项目 会议 Owner 信息源'],['habit-decay.html','退化的健康与习惯','案例篇','健康 习惯 衰减 触发'],['reduce-input.html','从源头减少熵产生','方法篇','减量 入口 一进一出'],['systems-not-willpower.html','建立系统而非依赖意志','方法篇','默认值 自动化 摩擦 清单'],['small-frequent-maintenance.html','定期小步清理机制','方法篇','每日维护 一分钟法则 习惯叠加'],['external-order.html','结构化与外部秩序','方法篇','一物一家 就近 分区 命名 可视化'],['personal-system.html','个人生活落地方案','落地篇','家居 数字 财务 衣橱'],['work-system.html','工作场景落地方案','落地篇','邮箱 任务 文档 协作'],['thirty-day-plan.html','30 天行动计划','落地篇','四周 每天15分钟 打卡'],['review-iterate.html','复盘与迭代','落地篇','每日 每周 每月 系统失效'],['templates.html','清单与模板合集','工具篇','体检表 维护清单 复制模板'],['tools.html','工具推荐','工具篇','工具栈 低摩擦 自动化']
  ];
  var metacognitionSearch=[
    ['index.html','元认知：改变大脑的顽固思维','从思维中退后一步，看见反馈回路、自动化思想与内在剧本如何塑造行动。','大卫迪绍夫 知 做 扩展 思维逆转'],
    ['observer-feedback.html','冷静的观察者','理解元认知、意识空间与事实—联系—结果—行动反馈回路。','元认知觉察 反馈回路 内心记者'],
    ['mentalizing-inner-voice.html','走进心智游戏','理解心理化、心理理论、意向性和内在心声。','心理化 心理理论 意向性 心声'],
    ['adaptation-feedback.html','改变反馈，改变生活','理解适应、自稳态、应变稳态与自动化思想。','适应 自稳态 应变稳态 自动化思想'],
    ['narrative-mind-map.html','重写你的内在剧本','发现叙述性线索、内化脚本与突显如何形成身份故事。','叙述性脚本 突显 自我对称'],
    ['thinking-toolbox.html','想法箱：30种改善思维的工具','筛选、收藏并实验原书提出的30种思维工具。','意识楔 习惯 静心 韧性 想象力 工具箱'],
    ['mind-library.html','心智图书馆','通过书籍、故事、电影、术语与科学帮助继续扩展心智。','小说 回忆录 电影 术语 科学帮助']
  ];
  var knownPaths={};index.forEach(function(item){knownPaths[item.path]=true});
  disorderSearch.forEach(function(item){var path='fighting-against-disorder/'+item[0];if(!knownPaths[path])index.push({path:path,title:item[1],topic:'对抗无序 · '+item[2],summary:item[3],keywords:item[3]})});
  metacognitionSearch.forEach(function(item){var path='metacognition/'+item[0];if(!knownPaths[path])index.push({path:path,title:item[1],topic:'元认知',summary:item[2],keywords:item[3]})});

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
        (isHome?'':'<a class="sg-icon-button" href="'+fromRoot('index.html')+'" title="首页" aria-label="首页">'+icon('<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>')+'</a>')+
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
