(function(){
  'use strict';
  var body=document.body;
  if(!body||!body.hasAttribute('data-sg-home'))return;

  var icon=function(path){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+path+'</svg>';};
  // 固定精选专题：仅在用户明确要求更换或调整精选时修改此数组。
  // 新增专题默认只进入“全部专题”，不会自动挤入精选版位。
  var featuredOrder=['ai','black-and-white','concurrency','meta','netflix','native','longtail'];
  var topics=[
    {topic:'ai',category:'tech',date:'2026-07-21',order:1,featured:true,href:'artificial-intelligence/ArtificialIntelligence.html',overline:'技术 · 系统知识库',title:'人工智能速览',summary:'从大模型核心原理到智能体生态，用一条完整路径理解 AI 如何学习、推理与行动。',meta:['12 章','53 篇文章'],art:'<g stroke="currentColor" opacity=".34"><path d="M74 142 160 72l91 78 94-100 102 83"/><path d="m160 72 38 108 53-30 84 42 10-142"/><path d="M74 142 198 180 335 192 447 133"/></g><g fill="var(--home-surface)" stroke="currentColor" stroke-width="3"><circle cx="74" cy="142" r="18"/><circle cx="160" cy="72" r="25"/><circle cx="198" cy="180" r="14"/><circle cx="251" cy="150" r="32"/><circle cx="345" cy="50" r="17"/><circle cx="335" cy="192" r="12"/><circle cx="447" cy="133" r="24"/></g><g fill="currentColor"><circle cx="160" cy="72" r="7"/><circle cx="251" cy="150" r="9"/><circle cx="447" cy="133" r="7"/></g>'},
    {topic:'disorder',category:'think',date:'2026-08-27',order:2,featured:true,href:'fighting-against-disorder/index.html',overline:'思维 · 生活系统',title:'对抗无序',summary:'混乱不是你的失败。用最小能耗、系统默认值与小步维护，让生活和工作重新获得秩序。',meta:['7 个部分','23 篇文章'],art:'<g fill="currentColor" opacity=".13"><rect x="46" y="42" width="88" height="58" rx="8"/><rect x="148" y="42" width="88" height="58" rx="8"/><rect x="46" y="114" width="88" height="58" rx="8"/><rect x="148" y="114" width="88" height="58" rx="8"/></g><g stroke="currentColor" stroke-width="3"><rect x="46" y="42" width="88" height="58" rx="8"/><rect x="148" y="42" width="88" height="58" rx="8"/><rect x="46" y="114" width="88" height="58" rx="8"/><rect x="148" y="114" width="88" height="58" rx="8"/></g><path d="M286 110h52" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="m326 96 14 14-14 14" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><g fill="currentColor" opacity=".75"><circle cx="390" cy="55" r="7"/><circle cx="454" cy="83" r="5"/><circle cx="376" cy="132" r="5"/><circle cx="438" cy="165" r="8"/><circle cx="480" cy="136" r="4"/><circle cx="412" cy="103" r="4"/><path d="m462 40 8 14-16 1z"/><path d="m392 172 13 5-9 11z"/></g>'},
    {topic:'concurrency',category:'tech',date:'2026-07-29',order:3,href:'high-concurrency/high-concurrency.html',overline:'技术 · 架构取舍',title:'高并发系统设计',summary:'漏斗拦截、削峰填谷、误差换性能，在七个真实场景中学习没有银弹的系统设计。',meta:['7 个场景','10 篇页面'],art:'<g stroke="currentColor" stroke-width="4" stroke-linecap="round"><path d="M45 44h92l36 36h74l35 35h93"/><path d="M45 95h78l33 34h92l29 29h98" opacity=".55"/><path d="M45 146h91l28-28" opacity=".28"/></g><g fill="var(--home-surface)" stroke="currentColor" stroke-width="3"><circle cx="45" cy="44" r="12"/><circle cx="45" cy="95" r="12"/><circle cx="45" cy="146" r="12"/><rect x="173" y="62" width="74" height="54" rx="10"/><rect x="282" y="92" width="93" height="52" rx="10"/></g><path d="M195 79h30M195 92h21M307 110h43M307 123h29" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'},
    {topic:'meta',category:'think',date:'2026-08-28',order:4,href:'metacognition/index.html',overline:'思维 · 观察反馈',title:'元认知',summary:'从思维中退后一步，看见反馈回路、自动化思想与内在剧本如何塑造行动。',meta:['7 个章节','思维工具箱'],art:'<g stroke="currentColor"><circle cx="210" cy="95" r="63" stroke-width="3" opacity=".28"/><circle cx="210" cy="95" r="40" stroke-width="3" opacity=".55"/><circle cx="210" cy="95" r="17" stroke-width="4"/></g><path d="M210 32c56 0 101 28 101 63s-45 63-101 63S109 130 109 95c0-19 13-35 35-47" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="m136 38 10 10-14 3" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><g fill="currentColor"><circle cx="210" cy="95" r="7"/><circle cx="311" cy="95" r="6"/><circle cx="109" cy="95" r="6"/></g>'},
    {topic:'netflix',category:'think',date:'2026-08-27',order:5,href:'netflix-culture/index.html',overline:'思维 · 组织文化',title:'奈飞文化手册',summary:'用极高的人才密度换极致的自由与责任，拆解一家高绩效组织如何真正运转。',meta:['16 章','阅读手册'],art:'<path d="M66 34h70l58 122h-70L66 34Z" fill="currentColor" opacity=".92"/><path d="M136 34h68l58 122h-68L136 34Z" fill="currentColor" opacity=".52"/><path d="M204 34h70l80 122h-70L204 34Z" fill="currentColor" opacity=".2"/><path d="M72 156h276" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity=".28"/>'},
    {topic:'native',category:'tech',date:'2026-08-27',order:6,compact:true,href:'ai-native-services/index.html',overline:'技术 · 商业判断',title:'AI 原生服务',summary:'从商业本质、市场评估到切入与退出，用一条决策链判断值不值得做。',meta:['3 个阶段','决策链'],art:'<g stroke="currentColor" stroke-width="3"><circle cx="100" cy="95" r="35"/><circle cx="210" cy="95" r="35"/><circle cx="320" cy="95" r="35"/><path d="M135 95h40M245 95h40"/></g><path d="m164 84 11 11-11 11M274 84l11 11-11 11" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><g fill="currentColor"><circle cx="100" cy="95" r="9"/><path d="m210 80 13 23h-26z"/><rect x="311" y="86" width="18" height="18" rx="4"/></g>'},
    {topic:'longtail',category:'think',date:'2026-08-20',order:7,compact:true,href:'Long-TailEffect/Long-TailEffect.html',overline:'思维 · 商业规律',title:'长尾效应',summary:'冷门不冷，只是分散。看懂小众需求如何聚合成一门大生意。',meta:['一页读懂','行动闭环'],art:'<path d="M48 155h330M48 35v120" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity=".35"/><path d="M54 42c30 2 48 15 62 38 24 39 43 58 96 66 48 7 100 7 160 8" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M62 42h82v112H62z" fill="currentColor" opacity=".09"/><path d="M144 110h228v44H144z" fill="currentColor" opacity=".16"/><circle cx="116" cy="80" r="7" fill="currentColor"/><circle cx="212" cy="146" r="6" fill="currentColor"/>'},
    {topic:'black-and-white',category:'photo',date:'2026-08-28',order:8,compact:true,href:'black-and-white/index.html',overline:'摄影 · 黑白观察',title:'黑白集 · MONOCHROME',summary:'城市的几何与光的减法，七张长焦黑白习作与拍摄手记。',meta:['7 帧作品','摄影手记'],art:'<circle cx="260" cy="96" r="66" stroke="currentColor" stroke-width="3" opacity=".5"/><circle cx="260" cy="96" r="31" stroke="currentColor" stroke-width="3"/><path d="M74 156 166 62l58 58 89-80 88 92" stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity=".7"/><path d="M54 174h360" stroke="currentColor" stroke-width="2" opacity=".28"/>'}
  ];

  function navItem(filter,label,count,path){return '<button class="home-nav-item" type="button" data-home-filter="'+filter+'">'+icon(path)+'<span>'+label+'</span>'+(count?'<span class="home-nav-count">'+count+'</span>':'')+'</button>';}
  function renderCard(topic){
    return '<a class="home-topic-card'+(topic.featured?' is-featured':'')+(topic.compact?' is-compact':'')+'" data-category="'+topic.category+'" data-topic="'+topic.topic+'" data-date="'+topic.date+'" data-order="'+topic.order+'" href="'+topic.href+'">'+
      '<div class="home-topic-art"><svg viewBox="0 0 520 220" fill="none" aria-hidden="true">'+topic.art+'</svg></div><div class="home-topic-copy"><div class="home-topic-overline">'+topic.overline+'</div><h3>'+topic.title+'</h3><p>'+topic.summary+'</p><div class="home-topic-foot"><span>'+topic.meta[0]+'</span><span>'+topic.meta[1]+'</span><span class="home-arrow">→</span></div></div></a>';
  }

  var shell=document.createElement('div');
  shell.className='home-shell';
  shell.innerHTML='<button class="home-mobile-menu" type="button" aria-label="打开花园导航" aria-expanded="false">'+icon('<path d="M4 7h16M4 12h16M4 17h16"/>')+'</button><div class="home-nav-backdrop"></div>'+ 
    '<aside class="home-sidebar" aria-label="花园导航"><div class="home-sidebar-inner"><div class="home-nav-group"><p class="home-nav-label">花园导航</p>'+navItem('featured','精选',String(featuredOrder.length), '<path d="m12 3 2.2 4.5L19 8.2l-3.5 3.4.8 4.8-4.3-2.3-4.3 2.3.8-4.8L5 8.2l4.8-.7L12 3z"/>')+navItem('all','全部专题',String(topics.length),'<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>')+'</div>'+
    '<div class="home-nav-group"><p class="home-nav-label">知识分类</p>'+navItem('tech','技术','3','<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>')+navItem('think','思维','4','<path d="M9 18h6M10 21h4M12 3a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V18h6v-.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 3z"/>')+navItem('photo','摄影','1','<rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M8 6 9.5 3h5L16 6"/>')+'</div>'+ 
    '<div class="home-nav-group"><p class="home-nav-label">浏览方式</p>'+navItem('recent','最近更新','','<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>')+'<button class="home-nav-item" type="button" data-home-all-pages>'+icon('<path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5"/>')+'<span>全部页面</span><span class="home-nav-count">100+</span></button></div>'+ 
    '<div class="home-nav-note"><strong>StoryGarden</strong>每一页都是一颗种子，从一次好奇、一个问题或一本书开始。</div></div></aside>'+ 
    '<main class="home-main" id="top"><section class="home-hero-new"><div class="home-hero-copy"><p class="home-kicker">The Knowledge Garden</p><h1>StoryGarden</h1><p class="home-lead">把每一次深潜、每一页笔记，种成一片会生长的花园</p><button class="home-search" type="button" data-sg-open-search>'+icon('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>')+'<span>搜索专题、章节或关键词……</span><kbd>Ctrl K</kbd></button><p class="home-meta">8 个专题 · 100+ 知识页面 · 最近照料于 2026-08-28</p></div></section>'+ 
    '<section class="home-library" id="home-library"><div class="home-library-head"><div class="home-library-title"><p data-home-label>CURATED COLLECTION · 7 TOPICS</p><h2 data-home-heading>精选专题</h2></div><div class="home-library-status"><strong data-home-count>8</strong> 个专题正在生长</div></div><div class="home-topic-grid">'+topics.map(renderCard).join('')+'</div></section></main>'+
    '<footer class="home-footer"><strong>StoryGarden · 用思考种下的花园</strong>© 2026 HerzTom · 种一颗种子，等它慢慢长</footer>';
  var globalHeader=body.querySelector('.sg-global-header');
  if(globalHeader)globalHeader.insertAdjacentElement('afterend',shell);
  else body.insertBefore(shell,body.firstChild);

  var grid=shell.querySelector('.home-topic-grid');
  var cards=Array.prototype.slice.call(grid.querySelectorAll('.home-topic-card'));
  var buttons=Array.prototype.slice.call(shell.querySelectorAll('[data-home-filter]'));
  var heading=shell.querySelector('[data-home-heading]');
  var label=shell.querySelector('[data-home-label]');
  var count=shell.querySelector('[data-home-count]');
  var menu=shell.querySelector('.home-mobile-menu');
  var backdrop=shell.querySelector('.home-nav-backdrop');
  var labels={featured:['CURATED COLLECTION · '+featuredOrder.length+' TOPICS','精选专题'],all:['All topics','全部专题'],tech:['Technology','技术专题'],think:['Thinking','思维专题'],photo:['Photography','摄影专题'],recent:['Recently tended','最近更新']};

  function closeNav(){body.classList.remove('home-nav-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','打开花园导航');}
  function setFilter(filter){
    buttons.forEach(function(button){button.classList.toggle('is-active',button.getAttribute('data-home-filter')===filter);});
    var ordered=cards.slice();
    if(filter==='featured')ordered.sort(function(a,b){return featuredOrder.indexOf(a.getAttribute('data-topic'))-featuredOrder.indexOf(b.getAttribute('data-topic'));});
    else if(filter==='recent')ordered.sort(function(a,b){return b.getAttribute('data-date').localeCompare(a.getAttribute('data-date'));});
    else ordered.sort(function(a,b){return Number(a.getAttribute('data-order'))-Number(b.getAttribute('data-order'));});
    ordered.forEach(function(card){
      grid.appendChild(card);
      var visible=filter==='featured'?featuredOrder.indexOf(card.getAttribute('data-topic'))>-1:filter==='all'||filter==='recent'||card.getAttribute('data-category')===filter;
      card.hidden=!visible;
      var topic=card.getAttribute('data-topic');
      card.classList.toggle('is-featured',visible&&filter==='featured'&&(topic==='ai'||topic==='black-and-white'));
    });
    count.textContent=cards.filter(function(card){return !card.hidden;}).length;
    label.textContent=labels[filter][0];heading.textContent=labels[filter][1];
    try{sessionStorage.setItem('sg-home-filter',filter);}catch(error){}
    closeNav();
  }

  buttons.forEach(function(button){button.addEventListener('click',function(){setFilter(button.getAttribute('data-home-filter'));});});
  shell.querySelector('[data-home-all-pages]').addEventListener('click',function(){closeNav();shell.querySelector('[data-sg-open-search]').click();});
  menu.addEventListener('click',function(){var open=body.classList.toggle('home-nav-open');menu.setAttribute('aria-expanded',open?'true':'false');menu.setAttribute('aria-label',open?'关闭花园导航':'打开花园导航');});
  backdrop.addEventListener('click',closeNav);
  window.addEventListener('keydown',function(event){if(event.key==='Escape')closeNav();});
  var saved='featured';try{saved=sessionStorage.getItem('sg-home-filter')||'featured';}catch(error){}
  if(!labels[saved])saved='featured';setFilter(saved);
})();
