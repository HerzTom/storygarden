(function(){
  'use strict';
  var SEARCH=[
    ['entropy-basics.html','什么是熵与熵增定律','原理篇','混乱程度 概率 微观状态 热力学第二定律'],['why-order-breaks.html','有序为何总会崩坏','原理篇','概率碾压 扑克牌 自发衰减'],['information-entropy.html','信息熵与生活中的熵','原理篇','搜索成本 文件 信息 不确定性'],['open-systems.html','开放系统与负熵','原理篇','开放系统 耗散结构 负熵 供能'],['order-costs-energy.html','维持秩序必然耗能','原理篇','能量 一劳永逸 三个杠杆'],
    ['entropy-signals.html','熵增在生活工作中的表现','认知篇','六大领域 体检 症状 预警'],['minimum-energy.html','最小能耗原则','认知篇','源头减量 系统默认 小步高频'],['common-mistakes.html','常见误区','认知篇','自律 收纳 完美 大扫除'],['messy-room.html','越来越乱的桌面与房间','案例篇','房间 桌面 暂放区 一物一家'],['digital-clutter.html','失控的文件与数字资料','案例篇','文件 相册 收件箱 Inbox'],['overloaded-calendar.html','被塞满的日程与时间','案例篇','日历 时间 缓冲 待办'],['team-entropy.html','团队协作与项目的熵增','案例篇','团队 项目 会议 Owner 信息源'],['habit-decay.html','退化的健康与习惯','案例篇','健康 习惯 衰减 触发'],
    ['reduce-input.html','从源头减少熵产生','方法篇','减量 入口 一进一出'],['systems-not-willpower.html','建立系统而非依赖意志','方法篇','默认值 自动化 摩擦 清单'],['small-frequent-maintenance.html','定期小步清理机制','方法篇','每日维护 一分钟法则 习惯叠加'],['external-order.html','结构化与外部秩序','方法篇','一物一家 就近 分区 命名 可视化'],['personal-system.html','个人生活落地方案','落地篇','家居 数字 财务 衣橱'],['work-system.html','工作场景落地方案','落地篇','邮箱 任务 文档 协作'],['thirty-day-plan.html','30 天行动计划','落地篇','四周 每天15分钟 打卡'],['review-iterate.html','复盘与迭代','落地篇','每日 每周 每月 系统失效'],['templates.html','清单与模板合集','工具篇','体检表 维护清单 复制模板'],['tools.html','工具推荐','工具篇','工具栈 低摩擦 自动化']
  ];
  if(Array.isArray(window.STORYGARDEN_SEARCH_INDEX)){
    var known={};window.STORYGARDEN_SEARCH_INDEX.forEach(function(x){known[x.path]=true});
    SEARCH.forEach(function(x){var path='fighting-against-disorder/'+x[0];if(!known[path])window.STORYGARDEN_SEARCH_INDEX.push({path:path,title:x[1],topic:'对抗无序 · '+x[2],summary:x[3],keywords:x[3]})});
  }
  function pageId(){return document.body.getAttribute('data-fad-id')||''}
  document.addEventListener('click',function(e){
    var copy=e.target.closest('[data-copy-target]');
    if(copy){var target=document.getElementById(copy.getAttribute('data-copy-target'));if(target){navigator.clipboard?navigator.clipboard.writeText(target.innerText):null;copy.textContent='已复制';setTimeout(function(){copy.textContent='复制模板'},1400)}}
    var reset=e.target.closest('[data-reset-checks]');if(reset){document.querySelectorAll('.fad-check').forEach(function(c){c.checked=false});try{localStorage.removeItem('fad-checks-'+pageId())}catch(err){}}
  });
  document.addEventListener('change',function(e){if(e.target.matches('.fad-check')){var checks=[].slice.call(document.querySelectorAll('.fad-check')).map(function(c){return c.checked});try{localStorage.setItem('fad-checks-'+pageId(),JSON.stringify(checks))}catch(err){}}});
  document.addEventListener('DOMContentLoaded',function(){
    try{var checks=JSON.parse(localStorage.getItem('fad-checks-'+pageId())||'[]');document.querySelectorAll('.fad-check').forEach(function(c,i){c.checked=!!checks[i]})}catch(e){}
    var sections=document.querySelectorAll('.fad-body h2[id],.fad-body h3[id]');var links=document.querySelectorAll('[data-toc]');if(sections.length&&links.length){var obs=new IntersectionObserver(function(entries){entries.forEach(function(en){if(en.isIntersecting){links.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+en.target.id)})}})},{rootMargin:'-15% 0px -72%'});sections.forEach(function(s){obs.observe(s)})}
  });
  window.fadToggleTheme=function(){var r=document.documentElement,n=r.getAttribute('data-theme')==='dark'?'light':'dark';r.setAttribute('data-theme',n);try{localStorage.setItem('hk-theme',n)}catch(e){}var b=document.getElementById('theme-btn');if(b)b.textContent=n==='dark'?'☀️':'🌙'};
})();
