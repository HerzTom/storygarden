/* StoryGarden 启蒙英语 · 交通数据（四集引擎共用）
   约定：SCENES / ITEMS / EPISODES / THEME 由数据文件提供，games/ 引擎引用 */
const THEME={
  id:'vehicles',wordEn:'Vehicles',wordZh:'交通工具',
  def:'road',container:'garage',
  deco:['🚦','🌳','🏢','🏡','🌻','🌼','☁️','🌿','🪨','🚏','🌱','🌞'],
};
const SCENES=[
  {id:'road',zh:'马路',en:'Road',icon:'🛣️',color:'#E4EFD5'},
  {id:'rail',zh:'铁轨',en:'Railway',icon:'🛤️',color:'#F7EDCE'},
  {id:'sky',zh:'天空',en:'Sky',icon:'☁️',color:'#D8E9F7'},
  {id:'water',zh:'水面',en:'Water',icon:'🌊',color:'#D8EDF4'},
];

/* sound 字段为交通工具声，备用（当前玩法不朗读） */
const ITEMS=[
  /* ---- road 马路 ---- */
  {en:'car',zh:'小汽车',emoji:'🚗',bg:'#FFE8CC',sound:'Vroom vroom!',group:'road'},
  {en:'bus',zh:'公交车',emoji:'🚌',bg:'#E8F4D9',sound:'Beep beep!',group:'road'},
  {en:'truck',zh:'大卡车',emoji:'🚚',bg:'#FFF3C4',sound:'Honk honk!',group:'road'},
  {en:'taxi',zh:'出租车',emoji:'🚖',bg:'#FFF0CC',sound:'Beep beep!',group:'road'},
  {en:'ambulance',zh:'救护车',emoji:'🚑',bg:'#FADDE8',sound:'Nee-naw nee-naw!',group:'road'},
  {en:'firetruck',zh:'消防车',emoji:'🚒',bg:'#FFE0D1',sound:'Nee-naw!',group:'road'},
  {en:'police car',zh:'警车',emoji:'🚓',bg:'#DCEAF7',sound:'Woo-woo!',group:'road'},
  {en:'motorcycle',zh:'摩托车',emoji:'🏍️',bg:'#EDEAF2',sound:'Vroom!',group:'road'},
  {en:'bike',zh:'自行车',emoji:'🚲',bg:'#E3EEDD',sound:'Ring ring!',group:'road'},
  {en:'scooter',zh:'滑板车',emoji:'🛵',bg:'#F5E6D3',sound:'Beep beep!',group:'road'},
  /* ---- rail 铁轨 ---- */
  {en:'train',zh:'火车',emoji:'🚂',bg:'#F3E7D3',sound:'Choo choo!',group:'rail'},
  {en:'subway',zh:'地铁',emoji:'🚇',bg:'#E1E6E8',sound:'Whoosh!',group:'rail'},
  {en:'bullet train',zh:'高铁',emoji:'🚅',bg:'#FFF0D9',sound:'Zoom zoom!',group:'rail'},
  {en:'tram',zh:'有轨电车',emoji:'🚊',bg:'#E8F4D9',sound:'Ding ding!',group:'rail'},
  {en:'monorail',zh:'单轨列车',emoji:'🚝',bg:'#E8E0F2',sound:'Whoosh!',group:'rail'},
  {en:'cable car',zh:'缆车',emoji:'🚠',bg:'#EADFCE',sound:'Ding ding!',group:'rail'},
  /* ---- sky 天空 ---- */
  {en:'airplane',zh:'飞机',emoji:'✈️',bg:'#DCEAF7',sound:'Whoosh!',group:'sky'},
  {en:'helicopter',zh:'直升机',emoji:'🚁',bg:'#E8F4D9',sound:'Whirr whirr!',group:'sky'},
  {en:'rocket',zh:'火箭',emoji:'🚀',bg:'#FADDE8',sound:'Blast off!',group:'sky'},
  {en:'UFO',zh:'飞碟',emoji:'🛸',bg:'#EDEAF2',sound:'Zoom!',group:'sky'},
  {en:'balloon',zh:'热气球',emoji:'🎈',bg:'#FFE3EC',sound:'Up up up!',group:'sky'},
  {en:'kite',zh:'风筝',emoji:'🪁',bg:'#FFF3C4',sound:'Whee!',group:'sky'},
  /* ---- water 水面 ---- */
  {en:'ship',zh:'大轮船',emoji:'🚢',bg:'#DCEAF7',sound:'Toot toot!',group:'water'},
  {en:'sailboat',zh:'帆船',emoji:'⛵',bg:'#DFF2F5',sound:'Ahoy!',group:'water'},
  {en:'speedboat',zh:'快艇',emoji:'🚤',bg:'#FFE0D1',sound:'Vroom vroom!',group:'water'},
  {en:'yacht',zh:'游艇',emoji:'🛥️',bg:'#E2EFD9',sound:'Toot toot!',group:'water'},
  {en:'canoe',zh:'独木舟',emoji:'🛶',bg:'#F1E3C8',sound:'Paddle paddle!',group:'water'},
  {en:'ferry',zh:'渡轮',emoji:'🛳️',bg:'#D8EEF4',sound:'Toot toot!',group:'water'},
  {en:'rowboat',zh:'小划船',emoji:'🚣',bg:'#E8EEDC',sound:'Splash splash!',group:'water'},
];

/* 集数链：翻书式导航（上一集在左、下一集在右）。加新一集只需在这里加一行，
   新页面调 renderEpisodeNav(集数下标)，上一集的右侧标签自动出现 */
const EPISODES=[
  {no:'第 1 集',name:'点一点 听一听',href:'transport.html'},
  {no:'第 2 集',name:'开回家 配一对',href:'transport-match.html'},
  {no:'第 3 集',name:'小小摄影师',href:'transport-photo.html'},
  {no:'第 4 集',name:'开车库 猜猜看',href:'transport-reveal.html'}
];
