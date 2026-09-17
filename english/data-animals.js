/* StoryGarden 启蒙英语 · 动物数据（四集引擎共用）
   约定：SCENES / ITEMS / EPISODES / THEME 由数据文件提供，games/ 引擎引用 */
const THEME={
  id:'animals',wordEn:'Animals',wordZh:'动物',
  def:'farm',container:'box',
  deco:['🌳','🌲','🌻','🌼','🍄','🌿','🍀','🪨','🦋','☁️','🌱','🐞'],
};
const SCENES=[
  {id:'farm',zh:'农场',en:'Farm',icon:'🚜',color:'#E4EFD5'},
  {id:'ocean',zh:'海洋',en:'Ocean',icon:'🌊',color:'#D8E9F7'},
  {id:'forest',zh:'森林',en:'Forest',icon:'🌲',color:'#E3E9D6'},
  {id:'wild',zh:'草原',en:'Wild',icon:'🌾',color:'#F7EDCE'},
];

/* sound 字段为动物叫声，备用（当前玩法不朗读） */
const ITEMS=[
  /* ---- farm 农场 ---- */
  {en:'dog',zh:'狗',emoji:'🐶',bg:'#FFE8CC',sound:'Woof woof!',group:'farm'},
  {en:'cat',zh:'猫',emoji:'🐱',bg:'#E8F4D9',sound:'Meow meow!',group:'farm'},
  {en:'pig',zh:'猪',emoji:'🐷',bg:'#FFE3EC',sound:'Oink oink!',group:'farm'},
  {en:'duck',zh:'鸭子',emoji:'🦆',bg:'#FFF3C4',sound:'Quack quack!',group:'farm'},
  {en:'cow',zh:'奶牛',emoji:'🐮',bg:'#F5E6D3',sound:'Moo moo!',group:'farm'},
  {en:'horse',zh:'马',emoji:'🐴',bg:'#EADFCE',sound:'Neigh!',group:'farm'},
  {en:'sheep',zh:'绵羊',emoji:'🐑',bg:'#F0EFE6',sound:'Baa baa!',group:'farm'},
  {en:'chicken',zh:'小鸡',emoji:'🐔',bg:'#FFF0CC',sound:'Cluck cluck!',group:'farm'},
  {en:'mouse',zh:'老鼠',emoji:'🐭',bg:'#EDEAF2',sound:'Squeak squeak!',group:'farm'},
  {en:'goat',zh:'山羊',emoji:'🐐',bg:'#E8EEDC',sound:'Maa maa!',group:'farm'},
  /* ---- ocean 海洋 ---- */
  {en:'fish',zh:'鱼',emoji:'🐟',bg:'#DFF2F5',sound:'Swim swim!',group:'ocean'},
  {en:'whale',zh:'鲸鱼',emoji:'🐳',bg:'#DCEAF7',sound:'Whoosh!',group:'ocean'},
  {en:'dolphin',zh:'海豚',emoji:'🐬',bg:'#D8EEF4',sound:'Ee-ee!',group:'ocean'},
  {en:'shark',zh:'鲨鱼',emoji:'🦈',bg:'#D9E5EC',sound:'Chomp chomp!',group:'ocean'},
  {en:'octopus',zh:'章鱼',emoji:'🐙',bg:'#FADDE8',sound:'Wiggle wiggle!',group:'ocean'},
  {en:'crab',zh:'螃蟹',emoji:'🦀',bg:'#FFE0D1',sound:'Snap snap!',group:'ocean'},
  {en:'turtle',zh:'海龟',emoji:'🐢',bg:'#E2EFD9',sound:'Slow slow!',group:'ocean'},
  {en:'squid',zh:'鱿鱼',emoji:'🦑',bg:'#E8E0F2',sound:'Swish swish!',group:'ocean'},
  {en:'shrimp',zh:'虾',emoji:'🦐',bg:'#FFE6DA',sound:'Tiny tiny!',group:'ocean'},
  /* ---- forest 森林 ---- */
  {en:'bear',zh:'熊',emoji:'🐻',bg:'#F3E7D3',sound:'Growl growl!',group:'forest'},
  {en:'fox',zh:'狐狸',emoji:'🦊',bg:'#FFE1C9',sound:'Yip yip!',group:'forest'},
  {en:'owl',zh:'猫头鹰',emoji:'🦉',bg:'#EDE4D2',sound:'Hoo hoo!',group:'forest'},
  {en:'rabbit',zh:'兔子',emoji:'🐰',bg:'#FDE8F0',sound:'Hop hop!',group:'forest'},
  {en:'squirrel',zh:'松鼠',emoji:'🐿️',bg:'#F1E3C8',sound:'Nibble nibble!',group:'forest'},
  {en:'deer',zh:'鹿',emoji:'🦌',bg:'#EEDCC8',sound:'Run run!',group:'forest'},
  {en:'hedgehog',zh:'刺猬',emoji:'🦔',bg:'#EAE0D0',sound:'Sniff sniff!',group:'forest'},
  {en:'wolf',zh:'狼',emoji:'🐺',bg:'#E1E6E8',sound:'Awoo!',group:'forest'},
  {en:'raccoon',zh:'浣熊',emoji:'🦝',bg:'#E6E2DA',sound:'Wash wash!',group:'forest'},
  {en:'bird',zh:'鸟',emoji:'🐦',bg:'#EAF2DC',sound:'Tweet tweet!',group:'forest'},
  /* ---- wild 草原 ---- */
  {en:'lion',zh:'狮子',emoji:'🦁',bg:'#FFF0D9',sound:'Roar!',group:'wild'},
  {en:'elephant',zh:'大象',emoji:'🐘',bg:'#E3EDF7',sound:'Toot toot!',group:'wild'},
  {en:'monkey',zh:'猴子',emoji:'🐵',bg:'#F0E6D2',sound:'Ooh ooh aah!',group:'wild'},
  {en:'giraffe',zh:'长颈鹿',emoji:'🦒',bg:'#FBEFCE',sound:'Munch munch!',group:'wild'},
  {en:'zebra',zh:'斑马',emoji:'🦓',bg:'#F0EEE9',sound:'Clip clop!',group:'wild'},
  {en:'hippo',zh:'河马',emoji:'🦛',bg:'#DDE3EA',sound:'Stomp stomp!',group:'wild'},
  {en:'tiger',zh:'老虎',emoji:'🐯',bg:'#FFE4C9',sound:'Grr!',group:'wild'},
  {en:'crocodile',zh:'鳄鱼',emoji:'🐊',bg:'#E0EED9',sound:'Snap!',group:'wild'},
  {en:'snake',zh:'蛇',emoji:'🐍',bg:'#E3EEDD',sound:'Ssss!',group:'wild'},
];

/* 集数链：翻书式导航（上一集在左、下一集在右）。加新一集只需在这里加一行，
   新页面调 renderEpisodeNav(集数下标)——函数本体在 games/common.js */
const EPISODES=[
  {no:'第 1 集',name:'点一点 听一听',href:'animals.html'},
  {no:'第 2 集',name:'送小动物回家',href:'animals-match.html'},
  {no:'第 3 集',name:'小小摄影师',href:'animals-photo.html'},
  {no:'第 4 集',name:'拆快递 猜猜看',href:'animals-unbox.html'}
];
