import { Stock } from '../types';

export const STOCKS: Stock[] = [
  // 科技股（高成长、中等波动、长期看涨、低分红1-2%、高估值）
  {
    code: 'STARX',
    name: '星舟科技',
    sector: 'tech',
    basePrice: 158,
    volatility: 0.045,
    trend: 0.0012,
    colorStart: '#58a6ff',
    colorEnd: '#3fb950',
    peRatio: 42,
    dividendYield: 0.012
  },
  {
    code: 'NEXUS',
    name: '纽速智能',
    sector: 'tech',
    basePrice: 268,
    volatility: 0.050,
    trend: 0.0010,
    colorStart: '#58a6ff',
    colorEnd: '#a371f7',
    peRatio: 38,
    dividendYield: 0.010
  },
  {
    code: 'QUANT',
    name: '量子芯城',
    sector: 'tech',
    basePrice: 86,
    volatility: 0.060,
    trend: 0.0015,
    colorStart: '#f0883e',
    colorEnd: '#58a6ff',
    peRatio: 55,
    dividendYield: 0.015
  },
  {
    code: 'CODEX',
    name: '码云时代',
    sector: 'tech',
    basePrice: 125,
    volatility: 0.055,
    trend: 0.0013,
    colorStart: '#3fb950',
    colorEnd: '#58a6ff',
    peRatio: 35,
    dividendYield: 0.011
  },
  {
    code: 'CYBER',
    name: '赛博网络',
    sector: 'tech',
    basePrice: 198,
    volatility: 0.058,
    trend: 0.0014,
    colorStart: '#58a6ff',
    colorEnd: '#1f6feb',
    peRatio: 48,
    dividendYield: 0.013
  },
  {
    code: 'DRONE',
    name: '天启智航',
    sector: 'tech',
    basePrice: 320,
    volatility: 0.065,
    trend: 0.0018,
    colorStart: '#a371f7',
    colorEnd: '#58a6ff',
    peRatio: 62,
    dividendYield: 0.018
  },

  // 消费股（稳健、低波动、慢涨、高分红2-3%、合理估值）
  {
    code: 'BLISS',
    name: '百乐优选',
    sector: 'consumer',
    basePrice: 96,
    volatility: 0.018,
    trend: 0.0006,
    colorStart: '#f85149',
    colorEnd: '#f0883e',
    peRatio: 15,
    dividendYield: 0.025
  },
  {
    code: 'TASTE',
    name: '美味星球',
    sector: 'consumer',
    basePrice: 52,
    volatility: 0.020,
    trend: 0.0005,
    colorStart: '#3fb950',
    colorEnd: '#f0883e',
    peRatio: 12,
    dividendYield: 0.028
  },
  {
    code: 'SWEET',
    name: '蜜雪时光',
    sector: 'consumer',
    basePrice: 45,
    volatility: 0.022,
    trend: 0.0007,
    colorStart: '#a371f7',
    colorEnd: '#f0883e',
    peRatio: 18,
    dividendYield: 0.022
  },
  {
    code: 'FRESH',
    name: '鲜丰生活',
    sector: 'consumer',
    basePrice: 68,
    volatility: 0.019,
    trend: 0.0004,
    colorStart: '#3fb950',
    colorEnd: '#2ea043',
    peRatio: 14,
    dividendYield: 0.026
  },
  {
    code: 'HOME',
    name: '雅居家居',
    sector: 'consumer',
    basePrice: 78,
    volatility: 0.021,
    trend: 0.0005,
    colorStart: '#f0883e',
    colorEnd: '#d29922',
    peRatio: 16,
    dividendYield: 0.024
  },
  {
    code: 'BEAUTY',
    name: '美颜日记',
    sector: 'consumer',
    basePrice: 135,
    volatility: 0.024,
    trend: 0.0008,
    colorStart: '#f85149',
    colorEnd: '#a371f7',
    peRatio: 20,
    dividendYield: 0.020
  },

  // 娱乐股（概念炒作、高波动、趋势弱、低分红1%附近、极高估值）
  {
    code: 'DREAM',
    name: '梦幻星娱',
    sector: 'entertainment',
    basePrice: 72,
    volatility: 0.070,
    trend: 0.0005,
    colorStart: '#f0883e',
    colorEnd: '#f85149',
    peRatio: 88,
    dividendYield: 0.008
  },
  {
    code: 'MAGIC',
    name: '魔发奇药',
    sector: 'entertainment',
    basePrice: 108,
    volatility: 0.065,
    trend: 0.0003,
    colorStart: '#3fb950',
    colorEnd: '#a371f7',
    peRatio: 72,
    dividendYield: 0.010
  },
  {
    code: 'PLAY',
    name: '玩酷游戏',
    sector: 'entertainment',
    basePrice: 85,
    volatility: 0.075,
    trend: 0.0006,
    colorStart: '#58a6ff',
    colorEnd: '#f85149',
    peRatio: 65,
    dividendYield: 0.012
  },
  {
    code: 'ANIME',
    name: '次元动漫',
    sector: 'entertainment',
    basePrice: 120,
    volatility: 0.068,
    trend: 0.0004,
    colorStart: '#a371f7',
    colorEnd: '#f85149',
    peRatio: 95,
    dividendYield: 0.009
  },
  {
    code: 'MUSIC',
    name: '悦动音乐',
    sector: 'entertainment',
    basePrice: 62,
    volatility: 0.062,
    trend: 0.0005,
    colorStart: '#58a6ff',
    colorEnd: '#a371f7',
    peRatio: 58,
    dividendYield: 0.011
  },
  {
    code: 'STUDIO',
    name: '光影工坊',
    sector: 'entertainment',
    basePrice: 156,
    volatility: 0.080,
    trend: 0.0002,
    colorStart: '#f85149',
    colorEnd: '#da3633',
    peRatio: 110,
    dividendYield: 0.008
  }
];

export const SECTOR_INFO = {
  tech: { label: '🔬 科技股', name: '科技' },
  consumer: { label: '🛒 消费股', name: '消费' },
  entertainment: { label: '🎮 娱乐股', name: '娱乐' }
};
