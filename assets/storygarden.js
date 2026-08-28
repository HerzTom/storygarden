(function(){
  'use strict';

  var body=document.body;
  if(!body||!body.hasAttribute('data-sg-page'))return;

  // Keep the shared reading shell fresh even when individual offline pages
  // still reference an older, unversioned storygarden.css URL.
  var sharedStyle=document.querySelector('link[rel="stylesheet"][href*="storygarden.css"]');
  if(sharedStyle){
    try{
      var sharedStyleUrl=new URL(sharedStyle.href,location.href);
      if(sharedStyleUrl.searchParams.get('v')!=='20260828-reader-type'){
        sharedStyleUrl.searchParams.set('v','20260828-reader-type');
        sharedStyle.href=sharedStyleUrl.href;
      }
    }catch(error){}
  }

  var root=body.getAttribute('data-sg-root')||'.';
  var pageTitle=body.getAttribute('data-sg-title')||document.title.split(/[|·]/)[0].trim();
  var parent=body.getAttribute('data-sg-parent');
  var parentLabel=body.getAttribute('data-sg-parent-label')||'返回上一层';
  var isHome=body.hasAttribute('data-sg-home');
  var section=body.getAttribute('data-sg-section')||'';
  var index=window.STORYGARDEN_SEARCH_INDEX||[];
  var sectionMeta={
    ai:{name:'人工智能',short:'AI',mark:'<circle cx="8" cy="12" r="2.5"/><circle cx="16" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/><path d="m10 11 4-3m-4 5 5 3m1-7 .5 5.5"/>'},
    disorder:{name:'对抗无序',short:'无序',mark:'<rect x="4" y="5" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 8h6m-6 8h6"/>'},
    'high-concurrency':{name:'高并发',short:'并发',mark:'<path d="M3 12h4l2.2-5 4.1 10 2.2-5H21"/>'},
    metacognition:{name:'元认知',short:'元认知',mark:'<ellipse cx="12" cy="12" rx="8.5" ry="5.5"/><circle cx="12" cy="12" r="2.2"/>'},
    netflix:{name:'奈飞文化',short:'奈飞',mark:'<path d="M6 4h4l8 16h-4L6 4Z"/><path d="M14 4h4v16h-4"/>'},
    'ai-native':{name:'AI 原生服务',short:'AI 原生',mark:'<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="12" r="2.5"/><path d="M8.5 12h7m-2.5-3 3 3-3 3"/>'},
    longtail:{name:'长尾效应',short:'长尾',mark:'<path d="M4 5v14h16"/><path d="M5 7c4 0 5 3 7 6s4 4 8 4"/>'},
    'black-and-white':{name:'黑白集',short:'黑白',mark:'<rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M8 6 9.5 3h5L16 6"/>'}
  };
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
  var aiNativeSearch=[
    ['index.html','AI 原生服务','从商业本质、市场评估到切入与退出，用一条决策链判断值不值得做。','AI 原生服务 商业判断 决策链'],
    ['definition-and-value.html','认知：这是什么，为什么值钱','理解 AI 原生服务的定义、价值创造逻辑、商业边界与护城河。','定义 价值 商业边界 护城河'],
    ['market-viability.html','评估：值不值得做','评估市场适配、买方预算、竞争壁垒、单位经济与进入门槛。','市场适配 预算 壁垒 单位经济'],
    ['entry-and-exit.html','落地：怎么切入，何时该撤','制定垂直切入路径、交付体系、风险控制与退出机制。','切入路径 交付 风险 退出机制']
  ];
  var knownPaths={};index.forEach(function(item){knownPaths[item.path]=true});
  if(!knownPaths['black-and-white/index.html'])index.push({path:'black-and-white/index.html',title:'黑白集 · MONOCHROME',topic:'黑白集 · 摄影',summary:'城市的几何与光的减法，七张长焦黑白习作与拍摄手记。',keywords:'摄影 黑白 长焦 建筑 几何 光 作品 手记 层理 追光 曲与直 云与灯 弧线 十字 桁架'});
  disorderSearch.forEach(function(item){var path='fighting-against-disorder/'+item[0];if(!knownPaths[path])index.push({path:path,title:item[1],topic:'对抗无序 · '+item[2],summary:item[3],keywords:item[3]})});
  metacognitionSearch.forEach(function(item){var path='metacognition/'+item[0];if(!knownPaths[path])index.push({path:path,title:item[1],topic:'元认知',summary:item[2],keywords:item[3]})});
  aiNativeSearch.forEach(function(item){var path='ai-native-services/'+item[0];if(!knownPaths[path])index.push({path:path,title:item[1],topic:'AI 原生服务',summary:item[2],keywords:item[3]})});

  function icon(path){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+path+'</svg>';}
  function escapeText(value){var node=document.createElement('div');node.textContent=value||'';return node.innerHTML;}
  function fromRoot(path){return new URL(root.replace(/\/$/,'')+'/'+path.replace(/^\//,''),location.href).href;}
  function seedMark(){return '<svg viewBox="0 0 36 36" aria-hidden="true"><path d="M18 29V15"/><ellipse cx="18" cy="25.5" rx="3.6" ry="5" class="sg-seed"/><path d="M18 16c-5.8-.2-9.1-2.6-10.5-7.2 5.4-.1 9.2 2.4 10.5 7.2Z" class="sg-leaf-soft"/><path d="M18 19c5.9-.3 9.2-3 10.4-7.7-5.5 0-9.2 2.6-10.4 7.7Z" class="sg-leaf"/></svg>';}
  function isTopicHome(){
    if(!parent)return false;
    try{return new URL(parent,location.href).pathname===new URL(fromRoot('index.html')).pathname;}catch(error){return false;}
  }
  function resolveParent(){
    if(!parent)return fromRoot('index.html');
    try{return new URL(parent,location.href).href;}catch(error){return parent;}
  }

  function createHeader(){
    if(isHome)return;
    var meta=sectionMeta[section]||{name:'StoryGarden',short:'专题',mark:'<circle cx="12" cy="12" r="6"/>'};
    var backText=parentLabel.replace(/^返回\s*/, '')||'上一层';
    var topicHome=isTopicHome();
    var current=topicHome?'':'<span class="sg-context-divider" aria-hidden="true">/</span><span class="sg-current-title">'+escapeText(pageTitle)+'</span>';
    var header=document.createElement('header');
    header.className='sg-global-header'+(topicHome?' is-topic-home':'');
    header.innerHTML='<div class="sg-global-inner"><div class="sg-global-left">'+
      '<a class="sg-back-link" href="'+escapeText(resolveParent())+'" title="'+escapeText(parentLabel)+'" aria-label="'+escapeText(parentLabel)+'">'+icon('<path d="m15 18-6-6 6-6"/>')+'<span>'+escapeText(backText)+'</span></a></div>'+
      '<div class="sg-global-context" title="'+escapeText(meta.name+(topicHome?'':' / '+pageTitle))+'"><span class="sg-topic-mark">'+icon(meta.mark)+'</span><span class="sg-topic-name" data-short="'+escapeText(meta.short)+'">'+escapeText(meta.name)+'</span>'+current+'</div>'+
      '<div class="sg-global-actions">'+
        '<button class="sg-icon-button" type="button" data-sg-open-search title="搜索" aria-label="搜索">'+icon('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>')+'</button>'+
        '<button class="sg-icon-button" type="button" data-sg-toggle-theme title="切换主题" aria-label="切换主题">'+
          '<svg class="sg-theme-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>'+
          '<svg class="sg-theme-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'+
        '</button>'+
        '<a class="sg-home-brand" href="'+fromRoot('index.html')+'" title="返回 StoryGarden 首页" aria-label="返回 StoryGarden 首页"><span class="sg-home-mark">'+seedMark()+'</span><span class="sg-home-wordmark"><span>Story</span><em>Garden</em></span></a>'+
      '</div></div><div class="sg-reading-progress" aria-hidden="true"><span></span></div>';
    body.insertBefore(header,body.firstChild);
    return header;
  }

  function bindReadingHeader(header){
    if(!header)return;
    var progress=header.querySelector('.sg-reading-progress');
    var bar=progress.querySelector('span');
    var ticking=false;
    function update(){
      var max=Math.max(0,document.documentElement.scrollHeight-window.innerHeight);
      var top=Math.max(0,window.scrollY||document.documentElement.scrollTop||0);
      header.classList.toggle('is-scrolled',top>12);
      progress.classList.toggle('is-hidden',max<2);
      bar.style.transform='scaleX('+(max?Math.min(1,top/max):0)+')';
      ticking=false;
    }
    function requestUpdate(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
    window.addEventListener('scroll',requestUpdate,{passive:true});
    window.addEventListener('resize',requestUpdate);
    update();
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

  bindReadingHeader(createHeader());
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
      event.stopImmediatePropagation();
      openSearch();
    }
    if(event.key==='Escape'){
      event.stopImmediatePropagation();
      closeSearch();
    }
  },true);
})();
