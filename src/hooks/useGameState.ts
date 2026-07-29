import { useState, useCallback, useMemo } from 'react';
import {
  GameState,
  GamePhase,
  PageType,
  Holding,
  News,
  ToastMessage,
  Item,
  BagItem,
  LotteryPrize,
  LotteryResult
} from '../types';
import { STOCKS } from '../data/stocks';
import { SHOP_ITEMS, LOTTERY_CONFIGS, LOTTERY_ITEMS } from '../data/items';
import { generateNews } from '../data/news';
import {
  generateInitialHistory,
  generateNextDayKLine,
  generateOpeningPrice,
  generateLunchPrice,
  generateClosingPrice
} from './useStockPrice';
import { formatDate, calculateTotalAssets } from '../utils/format';
import { randomId } from '../utils/random';

const INITIAL_CASH = 10000;
const TARGET_CASH = 1000000;
const TOTAL_DAYS = 750;
const FEE_RATE = 0.001;
const START_DATE = new Date('2023-01-03');

function getInitialState(): GameState {
  return {
    isStarted: false,
    isGameOver: false,
    gameResult: null,
    gameOverReason: null,
    currentDay: 1,
    currentPhase: 'opening',
    currentDate: formatDate(START_DATE),
    cash: INITIAL_CASH,
    holdings: [],
    stockHistory: {},
    newsList: [],
    currentPage: 'market',
    selectedStockCode: null,
    toasts: [],
    dailyImpact: {},
    bag: []
  };
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(getInitialState());
  const [yesterdayAssets, setYesterdayAssets] = useState<number>(INITIAL_CASH);

  // 计算总资产
  const totalAssets = useMemo(() => {
    return calculateTotalAssets(gameState.cash, gameState.holdings, gameState.stockHistory);
  }, [gameState.cash, gameState.holdings, gameState.stockHistory]);

  // 计算今日收益
  const todayProfit = useMemo(() => {
    if (gameState.currentDay <= 1) return 0;
    return totalAssets - yesterdayAssets;
  }, [totalAssets, yesterdayAssets, gameState.currentDay]);

  // 计算日收益率
  const todayProfitPercent = useMemo(() => {
    if (gameState.currentDay <= 1 || yesterdayAssets <= 0) return 0;
    return (todayProfit / yesterdayAssets) * 100;
  }, [todayProfit, yesterdayAssets, gameState.currentDay]);

  // 计算总收益率
  const totalProfitPercent = useMemo(() => {
    return ((totalAssets - INITIAL_CASH) / INITIAL_CASH) * 100;
  }, [totalAssets]);

  // 添加Toast
  const addToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const toast: ToastMessage = { id: randomId(), type, message };
    setGameState(prev => ({
      ...prev,
      toasts: [...prev.toasts, toast]
    }));

    // 3秒后移除
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        toasts: prev.toasts.filter(t => t.id !== toast.id)
      }));
    }, 3000);
  }, []);

  // 开始游戏
  const startGame = useCallback(() => {
    const initialHistory = generateInitialHistory(START_DATE);

    // 生成第一日新闻
    const firstDate = formatDate(START_DATE);
    const initialNews = generateNews(firstDate, STOCKS);

    // 计算新闻影响
    const dailyImpact: { [code: string]: number } = {};
    for (const news of initialNews) {
      if (news.relatedStock) {
        dailyImpact[news.relatedStock] = (dailyImpact[news.relatedStock] || 0) + news.impact;
      }
    }

    // 生成第一日K线
    let historyWithToday = generateNextDayKLine(initialHistory, dailyImpact);
    historyWithToday = generateOpeningPrice(historyWithToday, dailyImpact);

    // 重置昨日资产
    setYesterdayAssets(INITIAL_CASH);

    setGameState({
      ...getInitialState(),
      isStarted: true,
      currentDate: firstDate,
      stockHistory: historyWithToday,
      newsList: initialNews,
      selectedStockCode: STOCKS[0].code,
      dailyImpact
    });
  }, []);

  // 重新开始
  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  // 切换页面
  const setCurrentPage = useCallback((page: PageType) => {
    setGameState(prev => ({ ...prev, currentPage: page }));
  }, []);

  // 选择股票
  const selectStock = useCallback((code: string) => {
    setGameState(prev => ({ ...prev, selectedStockCode: code }));
  }, []);

  // 买入股票
  const buyStock = useCallback((code: string, quantity: number) => {
    if (quantity <= 0) return false;

    const history = gameState.stockHistory[code];
    if (!history || history.length === 0) return false;

    const price = history[history.length - 1].close;
    const tradeAmount = price * quantity;
    const fee = tradeAmount * FEE_RATE;
    const total = tradeAmount + fee;

    if (total > gameState.cash) {
      addToast('error', '现金不足');
      return false;
    }

    setGameState(prev => {
      let newHoldings: Holding[];
      const existingIndex = prev.holdings.findIndex(h => h.code === code);

      if (existingIndex >= 0) {
        const existing = prev.holdings[existingIndex];
        const totalQuantity = existing.quantity + quantity;
        const totalCost = existing.avgCost * existing.quantity + tradeAmount;
        const newAvgCost = totalCost / totalQuantity;

        newHoldings = [...prev.holdings];
        newHoldings[existingIndex] = {
          ...existing,
          quantity: totalQuantity,
          avgCost: newAvgCost
        };
      } else {
        newHoldings = [...prev.holdings, {
          code,
          quantity,
          avgCost: price
        }];
      }

      return {
        ...prev,
        cash: prev.cash - total,
        holdings: newHoldings
      };
    });

    const stockName = STOCKS.find(s => s.code === code)?.name || code;
    addToast('success', `成功买入 ${stockName} ${quantity}股`);
    return true;
  }, [gameState.stockHistory, gameState.cash, addToast]);

  // 卖出股票
  const sellStock = useCallback((code: string, quantity: number) => {
    if (quantity <= 0) return false;

    const holding = gameState.holdings.find(h => h.code === code);
    if (!holding || holding.quantity < quantity) {
      addToast('error', '持仓不足');
      return false;
    }

    const history = gameState.stockHistory[code];
    if (!history || history.length === 0) return false;

    const price = history[history.length - 1].close;
    const tradeAmount = price * quantity;
    const fee = tradeAmount * FEE_RATE;
    const total = tradeAmount - fee;

    setGameState(prev => {
      let newHoldings: Holding[];
      const existingIndex = prev.holdings.findIndex(h => h.code === code);

      if (existingIndex >= 0) {
        const existing = prev.holdings[existingIndex];
        if (existing.quantity === quantity) {
          newHoldings = prev.holdings.filter(h => h.code !== code);
        } else {
          newHoldings = [...prev.holdings];
          newHoldings[existingIndex] = {
            ...existing,
            quantity: existing.quantity - quantity
          };
        }
      } else {
        newHoldings = prev.holdings;
      }

      return {
        ...prev,
        cash: prev.cash + total,
        holdings: newHoldings
      };
    });

    const stockName = STOCKS.find(s => s.code === code)?.name || code;
    addToast('success', `成功卖出 ${stockName} ${quantity}股`);
    return true;
  }, [gameState.holdings, gameState.stockHistory, addToast]);

  // 购买道具
  const buyItem = useCallback((itemId: string) => {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return false;

    if (gameState.cash < item.price) {
      addToast('error', '现金不足');
      return false;
    }

    setGameState(prev => {
      const existingIndex = prev.bag.findIndex(i => i.id === itemId);
      let newBag: BagItem[];

      if (existingIndex >= 0) {
        newBag = [...prev.bag];
        newBag[existingIndex] = {
          ...newBag[existingIndex],
          quantity: newBag[existingIndex].quantity + 1
        };
      } else {
        newBag = [...prev.bag, { ...item, quantity: 1 }];
      }

      return {
        ...prev,
        cash: prev.cash - item.price,
        bag: newBag
      };
    });

    addToast('success', `成功购买 ${item.name}`);
    return true;
  }, [gameState.cash, addToast]);

  // 使用道具 - 疯狂的可乐
  const useCrazyCola = useCallback((stockCode: string) => {
    const bagItem = gameState.bag.find(i => i.id === 'crazy_cola');
    if (!bagItem || bagItem.quantity <= 0) {
      addToast('error', '道具不足');
      return false;
    }

    const stock = STOCKS.find(s => s.code === stockCode);
    if (!stock) return false;

    // 随机效果
    const rand = Math.random() * 100;
    let impact = 0;

    if (rand < 2) {
      // 2%概率：中毒，直接结束游戏
      setGameState(prev => {
        const newBag = prev.bag.map(i =>
          i.id === 'crazy_cola' ? { ...i, quantity: i.quantity - 1 } : i
        ).filter(i => i.quantity > 0);

        return {
          ...prev,
          bag: newBag,
          isGameOver: true,
          gameResult: 'lose',
          gameOverReason: 'poison'
        };
      });

      return true;
    } else if (rand < 42) {
      // 40%概率：上涨8%-10%
      impact = 0.08 + Math.random() * 0.02;
      addToast('success', `疯狂的可乐生效！${stock.name}上涨${(impact * 100).toFixed(1)}%`);
    } else {
      // 58%概率：下跌8%-10%
      impact = -(0.08 + Math.random() * 0.02);
      addToast('info', `疯狂的可乐生效！${stock.name}下跌${(Math.abs(impact) * 100).toFixed(1)}%`);
    }

    // 应用影响到股价
    setGameState(prev => {
      const newDailyImpact = {
        ...prev.dailyImpact,
        [stockCode]: (prev.dailyImpact[stockCode] || 0) + impact
      };

      // 立即更新股价
      const history = prev.stockHistory[stockCode];
      let newHistory = { ...prev.stockHistory };

      if (history && history.length > 0) {
        const lastKline = history[history.length - 1];
        const newClose = lastKline.close * (1 + impact);
        const newHigh = Math.max(lastKline.high, newClose);
        const newLow = Math.min(lastKline.low, newClose);

        newHistory[stockCode] = [
          ...history.slice(0, -1),
          {
            ...lastKline,
            close: newClose,
            high: newHigh,
            low: newLow
          }
        ];
      }

      // 扣除道具
      const newBag = prev.bag.map(i =>
        i.id === 'crazy_cola' ? { ...i, quantity: i.quantity - 1 } : i
      ).filter(i => i.quantity > 0);

      return {
        ...prev,
        bag: newBag,
        dailyImpact: newDailyImpact,
        stockHistory: newHistory
      };
    });

    return true;
  }, [gameState.bag, addToast]);

  // 使用彩票
  const useLottery = useCallback((itemId: string): LotteryResult | null => {
    const bagItem = gameState.bag.find(i => i.id === itemId);
    if (!bagItem || bagItem.quantity <= 0) {
      addToast('error', '道具不足');
      return null;
    }

    const config = LOTTERY_CONFIGS[itemId];
    if (!config) {
      addToast('error', '未知的彩票');
      return null;
    }

    // 抽奖
    const rand = Math.random() * 100;
    let cumulative = 0;
    let selectedPrize = config[config.length - 1];

    for (const prize of config) {
      cumulative += prize.probability;
      if (rand <= cumulative) {
        selectedPrize = prize;
        break;
      }
    }

    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return null;

    const prizeAmount = Math.floor(item.price * selectedPrize.multiplier);
    const isJackpot = selectedPrize.multiplier >= 100;

    // 扣除道具并发放奖金
    setGameState(prev => {
      const newBag = prev.bag.map(i =>
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      ).filter(i => i.quantity > 0);

      return {
        ...prev,
        bag: newBag,
        cash: prev.cash + prizeAmount
      };
    });

    return {
      prize: selectedPrize,
      amount: prizeAmount,
      isJackpot
    };
  }, [gameState.bag, addToast]);

  // 推进到下一阶段
  const nextPhase = useCallback(() => {
    if (gameState.isGameOver) return;

    setGameState(prev => {
      let newState: GameState = { ...prev };

      if (prev.currentPhase === 'opening') {
        // 开盘 → 午间休市
        newState = {
          ...prev,
          currentPhase: 'lunch',
          stockHistory: generateLunchPrice(prev.stockHistory)
        };
      } else if (prev.currentPhase === 'lunch') {
        // 午间休市 → 收盘
        newState = {
          ...prev,
          currentPhase: 'closing',
          stockHistory: generateClosingPrice(prev.stockHistory, prev.dailyImpact)
        };
      } else {
        // 收盘 → 下一天开盘
        const nextDay = prev.currentDay + 1;

        // 检查游戏结束
        const currentTotalAssets = calculateTotalAssets(prev.cash, prev.holdings, prev.stockHistory);

        if (currentTotalAssets >= TARGET_CASH) {
          return {
            ...prev,
            isGameOver: true,
            gameResult: 'win',
            gameOverReason: null
          };
        }

        if (nextDay > TOTAL_DAYS) {
          return {
            ...prev,
            isGameOver: true,
            gameResult: 'lose',
            gameOverReason: 'timeout'
          };
        }

        // 更新昨日资产
        setYesterdayAssets(currentTotalAssets);

        // 计算下一个日期
        const currentDate = new Date(prev.currentDate);
        let nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
        const day = nextDate.getDay();
        if (day === 0) nextDate.setDate(nextDate.getDate() + 1);
        if (day === 6) nextDate.setDate(nextDate.getDate() + 2);

        const dateStr = formatDate(nextDate);

        // 生成新闻
        const news = generateNews(dateStr, STOCKS);

        // 计算新闻影响
        const dailyImpact: { [code: string]: number } = {};
        for (const n of news) {
          if (n.relatedStock) {
            dailyImpact[n.relatedStock] = (dailyImpact[n.relatedStock] || 0) + n.impact;
          }
        }

        // 生成下一日K线
        let newHistory = generateNextDayKLine(prev.stockHistory, dailyImpact);
        newHistory = generateOpeningPrice(newHistory, dailyImpact);

        newState = {
          ...prev,
          currentDay: nextDay,
          currentPhase: 'opening',
          currentDate: dateStr,
          stockHistory: newHistory,
          newsList: [...news, ...prev.newsList].slice(0, 50),
          dailyImpact
        };
      }

      return newState;
    });
  }, [gameState.isGameOver]);

  // 获取某只股票的持仓
  const getHolding = useCallback((code: string) => {
    return gameState.holdings.find(h => h.code === code);
  }, [gameState.holdings]);

  // 获取某只股票的当前价格
  const getCurrentPrice = useCallback((code: string) => {
    const history = gameState.stockHistory[code];
    if (!history || history.length === 0) return 0;
    return history[history.length - 1].close;
  }, [gameState.stockHistory]);

  // 获取某只股票的涨跌幅（从昨天收盘到今天）
  const getChangePercent = useCallback((code: string) => {
    const history = gameState.stockHistory[code];
    if (!history || history.length < 2) return 0;
    const yesterdayClose = history[history.length - 2].close;
    const todayClose = history[history.length - 1].close;
    return ((todayClose - yesterdayClose) / yesterdayClose) * 100;
  }, [gameState.stockHistory]);

  // 获取某只股票的历史总涨跌幅
  const getTotalChangePercent = useCallback((code: string) => {
    const history = gameState.stockHistory[code];
    if (!history || history.length < 2) return 0;
    const firstClose = history[0].close;
    const todayClose = history[history.length - 1].close;
    return ((todayClose - firstClose) / firstClose) * 100;
  }, [gameState.stockHistory]);

  return {
    gameState,
    totalAssets,
    todayProfit,
    todayProfitPercent,
    totalProfitPercent,
    startGame,
    restartGame,
    setCurrentPage,
    selectStock,
    buyStock,
    sellStock,
    nextPhase,
    getHolding,
    getCurrentPrice,
    getChangePercent,
    getTotalChangePercent,
    buyItem,
    useCrazyCola,
    useLottery,
    constants: {
      INITIAL_CASH,
      TARGET_CASH,
      TOTAL_DAYS,
      FEE_RATE
    }
  };
}
