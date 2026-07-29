import { Item } from '../types';

export interface LotteryPrize {
  multiplier: number;
  name: string;
  probability: number;
}

export const LOTTERY_ITEMS: Item[] = [
  {
    id: 'lottery_small',
    name: '小试牛刀',
    description: '¥10彩票，最高¥1000！搏一搏，单车变摩托~',
    price: 10,
    icon: '🎫',
    color: '#58a6ff'
  },
  {
    id: 'lottery_medium',
    name: '中规中矩',
    description: '¥100彩票，最高¥10000！想赢钱，就得狠一点！',
    price: 100,
    icon: '🎫',
    color: '#a371f7'
  },
  {
    id: 'lottery_large',
    name: '富贵险中求',
    description: '¥1000彩票，最高¥100000！撑死胆大的，饿死胆小的！',
    price: 1000,
    icon: '🎫',
    color: '#f0883e'
  }
];

export const COLA_ITEM: Item = {
  id: 'crazy_cola',
  name: '疯狂的可乐',
  description: '使用后会立刻让股价变化，注意别上头哦！40%上涨8%-10%，58%下跌8%-10%，2%概率中毒直接结束游戏',
  price: 5000,
  icon: '🥤',
  color: '#f85149'
};

export const ITEMS: Item[] = [...LOTTERY_ITEMS, COLA_ITEM];
export const SHOP_ITEMS: Item[] = ITEMS;

export const LOTTERY_CONFIGS: Record<string, LotteryPrize[]> = {
  lottery_small: [
    { multiplier: 0, name: '谢谢参与', probability: 50 },
    { multiplier: 0.2, name: '安慰奖', probability: 15 },
    { multiplier: 0.5, name: '小红包', probability: 15 },
    { multiplier: 1, name: '保本', probability: 10 },
    { multiplier: 2, name: '小赚一笔', probability: 5 },
    { multiplier: 5, name: '运气不错', probability: 3 },
    { multiplier: 10, name: '好运连连', probability: 1.5 },
    { multiplier: 50, name: '运气爆棚', probability: 0.4 },
    { multiplier: 100, name: '🎉 特等奖！', probability: 0.1 }
  ],
  lottery_medium: [
    { multiplier: 0, name: '谢谢参与', probability: 45 },
    { multiplier: 0.2, name: '安慰奖', probability: 15 },
    { multiplier: 0.5, name: '小红包', probability: 15 },
    { multiplier: 1, name: '保本', probability: 10 },
    { multiplier: 2, name: '小赚一笔', probability: 6 },
    { multiplier: 5, name: '运气不错', probability: 4 },
    { multiplier: 10, name: '好运连连', probability: 2 },
    { multiplier: 50, name: '运气爆棚', probability: 0.8 },
    { multiplier: 100, name: '🎉 特等奖！', probability: 0.2 }
  ],
  lottery_large: [
    { multiplier: 0, name: '谢谢参与', probability: 40 },
    { multiplier: 0.2, name: '安慰奖', probability: 15 },
    { multiplier: 0.5, name: '小红包', probability: 15 },
    { multiplier: 1, name: '保本', probability: 10 },
    { multiplier: 2, name: '小赚一笔', probability: 7 },
    { multiplier: 5, name: '运气不错', probability: 6 },
    { multiplier: 10, name: '好运连连', probability: 4 },
    { multiplier: 50, name: '运气爆棚', probability: 2 },
    { multiplier: 100, name: '🎉 特等奖！', probability: 1 }
  ]
};
