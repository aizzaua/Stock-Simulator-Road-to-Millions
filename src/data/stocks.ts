import { Stock } from '../types';

export const STOCKS: Stock[] = [
  // 科技股
  {
    code: 'STARX',
    name: '星舟科技',
    sector: 'tech',
    basePrice: 158,
    volatility: 0.025,
    trend: 0.0009,
    colorStart: '#58a6ff',
    colorEnd: '#3fb950'
  },
  {
    code: 'NEXUS',
    name: '纽速智能',
    sector: 'tech',
    basePrice: 268,
    volatility: 0.028,
    trend: 0.0007,
    colorStart: '#58a6ff',
    colorEnd: '#a371f7'
  },
  {
    code: 'QUANT',
    name: '量子芯城',
    sector: 'tech',
    basePrice: 86,
    volatility: 0.038,
    trend: 0.0011,
    colorStart: '#f0883e',
    colorEnd: '#58a6ff'
  },
  {
    code: 'CODEX',
    name: '码云时代',
    sector: 'tech',
    basePrice: 125,
    volatility: 0.032,
    trend: 0.0008,
    colorStart: '#3fb950',
    colorEnd: '#58a6ff'
  },
  {
    code: 'CYBER',
    name: '赛博网络',
    sector: 'tech',
    basePrice: 198,
    volatility: 0.035,
    trend: 0.0012,
    colorStart: '#58a6ff',
    colorEnd: '#1f6feb'
  },
  {
    code: 'DRONE',
    name: '天启智航',
    sector: 'tech',
    basePrice: 320,
    volatility: 0.042,
    trend: 0.0015,
    colorStart: '#a371f7',
    colorEnd: '#58a6ff'
  },

  // 消费股
  {
    code: 'BLISS',
    name: '百乐优选',
    sector: 'consumer',
    basePrice: 96,
    volatility: 0.020,
    trend: 0.0005,
    colorStart: '#f85149',
    colorEnd: '#f0883e'
  },
  {
    code: 'TASTE',
    name: '美味星球',
    sector: 'consumer',
    basePrice: 52,
    volatility: 0.022,
    trend: 0.0006,
    colorStart: '#3fb950',
    colorEnd: '#f0883e'
  },
  {
    code: 'SWEET',
    name: '蜜雪时光',
    sector: 'consumer',
    basePrice: 45,
    volatility: 0.025,
    trend: 0.0004,
    colorStart: '#a371f7',
    colorEnd: '#f0883e'
  },
  {
    code: 'FRESH',
    name: '鲜丰生活',
    sector: 'consumer',
    basePrice: 68,
    volatility: 0.024,
    trend: 0.0007,
    colorStart: '#3fb950',
    colorEnd: '#2ea043'
  },
  {
    code: 'HOME',
    name: '雅居家居',
    sector: 'consumer',
    basePrice: 78,
    volatility: 0.022,
    trend: 0.0005,
    colorStart: '#f0883e',
    colorEnd: '#d29922'
  },
  {
    code: 'BEAUTY',
    name: '美颜日记',
    sector: 'consumer',
    basePrice: 135,
    volatility: 0.028,
    trend: 0.0008,
    colorStart: '#f85149',
    colorEnd: '#a371f7'
  },

  // 娱乐股
  {
    code: 'DREAM',
    name: '梦幻星娱',
    sector: 'entertainment',
    basePrice: 72,
    volatility: 0.045,
    trend: 0.0013,
    colorStart: '#f0883e',
    colorEnd: '#f85149'
  },
  {
    code: 'MAGIC',
    name: '魔发奇药',
    sector: 'entertainment',
    basePrice: 108,
    volatility: 0.042,
    trend: 0.0010,
    colorStart: '#3fb950',
    colorEnd: '#a371f7'
  },
  {
    code: 'PLAY',
    name: '玩酷游戏',
    sector: 'entertainment',
    basePrice: 85,
    volatility: 0.048,
    trend: 0.0014,
    colorStart: '#58a6ff',
    colorEnd: '#f85149'
  },
  {
    code: 'ANIME',
    name: '次元动漫',
    sector: 'entertainment',
    basePrice: 120,
    volatility: 0.046,
    trend: 0.0012,
    colorStart: '#a371f7',
    colorEnd: '#f85149'
  },
  {
    code: 'MUSIC',
    name: '悦动音乐',
    sector: 'entertainment',
    basePrice: 62,
    volatility: 0.040,
    trend: 0.0011,
    colorStart: '#58a6ff',
    colorEnd: '#a371f7'
  },
  {
    code: 'STUDIO',
    name: '光影工坊',
    sector: 'entertainment',
    basePrice: 156,
    volatility: 0.050,
    trend: 0.0016,
    colorStart: '#f85149',
    colorEnd: '#da3633'
  }
];

export const SECTOR_INFO = {
  tech: { label: '🔬 科技股', name: '科技' },
  consumer: { label: '🛒 消费股', name: '消费' },
  entertainment: { label: '🎮 娱乐股', name: '娱乐' }
};
