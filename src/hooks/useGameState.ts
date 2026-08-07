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
  LotteryResult,
  Loan,
  BlackSwanEvent
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
import { formatDate, calculateTotalAssets, formatCurrency } from '../utils/format';
import { randomId } from '../utils/random';

const INITIAL_CASH = 10000;
const TARGET_CASH = 1000000;
const TOTAL_DAYS = 750;
const FEE_RATE = 0.001;
const START_DATE = new Date('2023-01-03');
const MAX_LOAN_AMOUNT = 10000;
const LOAN_DURATION = 100;
const LOAN_INTEREST_RATE = 0.03;
const BLACK_SWAN_CHANCE = 3 / 750; // 约0.4%，750天期望触发3次（约一年一次）
const BLACK_SWAN_IMPACT = 0.15; // ±15% 涨跌幅

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
    bag: [],
    loan: null,
    hasAppliedLoan: false,
    hasTriggeredBankruptcy: false,
    showBankruptcyAlert: false,
    blackSwanEvent: null
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
      dailyImpact,
      blackSwanEvent: null
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
          avgCost: price,
          purchaseDay: prev.currentDay
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
            quantity: existing.quantity - quantity,
            purchaseDay: existing.purchaseDay
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

  // 一键清仓
  const sellAllStocks = useCallback(() => {
    if (gameState.holdings.length === 0) {
      addToast('info', '当前没有持仓');
      return;
    }

    let totalCashGained = 0;
    let totalFee = 0;
    const soldStocks: string[] = [];

    for (const holding of gameState.holdings) {
      const history = gameState.stockHistory[holding.code];
      if (!history || history.length === 0) continue;

      const price = history[history.length - 1].close;
      const tradeAmount = price * holding.quantity;
      const fee = tradeAmount * FEE_RATE;

      totalCashGained += tradeAmount - fee;
      totalFee += fee;

      const stockName = STOCKS.find(s => s.code === holding.code)?.name || holding.code;
      soldStocks.push(`${stockName} ${holding.quantity}股`);
    }

    setGameState(prev => ({
      ...prev,
      cash: prev.cash + totalCashGained,
      holdings: []
    }));

    const detailText = soldStocks.length <= 2
      ? soldStocks.join('、')
      : `${soldStocks[0]}等${soldStocks.length}只股票`;

    addToast('success', `一键清仓完成！卖出${detailText}，回笼资金 ${formatCurrency(totalCashGained)}（手续费 ${formatCurrency(totalFee)}）`);
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

  // 检查是否满足破产条件
  const checkBankruptcyCondition = useCallback((state: GameState): boolean => {
    // 没有任何股票
    if (state.holdings.length > 0) return false;

    // 背包里没有任何彩票
    const hasLottery = state.bag.some(item => LOTTERY_ITEMS.some(li => li.id === item.id));
    if (hasLottery) return false;

    // 检查现金是否买不起任意一只股票（最少买1股，包含手续费）
    const minStockPrice = Math.min(...STOCKS.map(stock => {
      const history = state.stockHistory[stock.code];
      if (!history || history.length === 0) return Infinity;
      return history[history.length - 1].close;
    }));

    const canAffordAnyStock = state.cash >= minStockPrice * (1 + FEE_RATE);
    return !canAffordAnyStock;
  }, []);

  // 申请破产贷款
  const applyForLoan = useCallback((amount: number) => {
    if (gameState.cash > 0) {
      addToast('error', '只有现金为0时才能申请贷款');
      return false;
    }
    if (gameState.hasAppliedLoan) {
      addToast('error', '一局游戏只能申请一次贷款');
      return false;
    }
    if (amount > MAX_LOAN_AMOUNT) {
      addToast('error', '贷款金额不能超过10000元');
      return false;
    }
    if (amount <= 0) {
      addToast('error', '贷款金额必须大于0');
      return false;
    }

    const newLoan: Loan = {
      amount,
      borrowedDay: gameState.currentDay,
      dueDay: gameState.currentDay + LOAN_DURATION
    };

    setGameState(prev => ({
      ...prev,
      cash: prev.cash + amount,
      loan: newLoan,
      hasAppliedLoan: true,
      showBankruptcyAlert: false
    }));

    addToast('success', `成功获得贷款 ${amount.toLocaleString()} 元！请在 ${LOAN_DURATION} 天内还清（含3%利息）`);
    return true;
  }, [gameState.cash, gameState.hasAppliedLoan, gameState.currentDay, addToast]);

  // 还款
  const repayLoan = useCallback(() => {
    if (!gameState.loan) {
      addToast('error', '没有未偿还的贷款');
      return false;
    }
    const repayAmount = Math.ceil(gameState.loan.amount * (1 + LOAN_INTEREST_RATE));
    if (gameState.cash < repayAmount) {
      addToast('error', `现金不足以偿还贷款（需要 ${repayAmount.toLocaleString()} 元）`);
      return false;
    }

    setGameState(prev => ({
      ...prev,
      cash: prev.cash - repayAmount,
      loan: null
    }));

    addToast('success', `贷款已还清！偿还金额 ${repayAmount.toLocaleString()} 元（含3%利息）`);
    return true;
  }, [gameState.loan, gameState.cash, addToast]);

  // 关闭破产提示
  const dismissBankruptcyAlert = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      showBankruptcyAlert: false
    }));
  }, []);

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

        // 检查贷款是否到期
        if (prev.loan && nextDay > prev.loan.dueDay) {
          return {
            ...prev,
            isGameOver: true,
            gameResult: 'lose',
            gameOverReason: 'bankruptcy'
          };
        }

        // 检查破产条件
        const stateToCheck = { ...prev, currentDay: nextDay };
        const isBankrupt = checkBankruptcyCondition(stateToCheck);

        if (isBankrupt) {
          if (prev.hasTriggeredBankruptcy) {
            // 第二次触发，直接破产
            return {
              ...prev,
              isGameOver: true,
              gameResult: 'lose',
              gameOverReason: 'bankruptcy'
            };
          } else if (!prev.hasAppliedLoan) {
            // 第一次触发且没贷过款，弹出提示
            return {
              ...prev,
              hasTriggeredBankruptcy: true,
              showBankruptcyAlert: true,
              currentPage: 'bank'
            };
          } else {
            // 已经贷过款了，直接破产
            return {
              ...prev,
              isGameOver: true,
              gameResult: 'lose',
              gameOverReason: 'bankruptcy'
            };
          }
        }

        // 计算分红（持有满30天的倍数时一次性发放）
        let dividendTotal = 0;
        const dividendDetails: string[] = [];
        for (const holding of prev.holdings) {
          const daysHeld = prev.currentDay - holding.purchaseDay;
          // 每满30天发放一次分红（30天、60天、90天...）
          if (daysHeld > 0 && daysHeld % 30 === 0) {
            const stock = STOCKS.find(s => s.code === holding.code);
            const history = prev.stockHistory[holding.code];
            if (stock && history && history.length > 0) {
              const currentPrice = history[history.length - 1].close;
              // 30天累积分红 = 股价 * 数量 * 分红率
              const dividend = currentPrice * holding.quantity * stock.dividendYield;
              if (dividend > 0) {
                dividendTotal += dividend;
                dividendDetails.push(`${stock.name} ${formatCurrency(dividend)}`);
              }
            }
          }
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

        // ===== 黑天鹅事件 =====
        let blackSwanEvent: BlackSwanEvent | null = null;
        let blackSwanNews: News | null = null;
        if (Math.random() < BLACK_SWAN_CHANCE) {
          const targetStock = STOCKS[Math.floor(Math.random() * STOCKS.length)];
          const isPositive = Math.random() < 0.5;
          const impact = isPositive ? BLACK_SWAN_IMPACT : -BLACK_SWAN_IMPACT;

          // 修改该股票当日K线
          const history = newHistory[targetStock.code];
          if (history && history.length > 0) {
            const lastKline = history[history.length - 1];
            const newClose = lastKline.close * (1 + impact);
            const newHigh = Math.max(lastKline.high, newClose);
            const newLow = Math.min(lastKline.low, newClose);

            newHistory = {
              ...newHistory,
              [targetStock.code]: [
                ...history.slice(0, -1),
                {
                  ...lastKline,
                  close: newClose,
                  high: newHigh,
                  low: newLow
                }
              ]
            };

            // 更新 dailyImpact
            dailyImpact[targetStock.code] = (dailyImpact[targetStock.code] || 0) + impact;

            blackSwanEvent = {
              stockCode: targetStock.code,
              stockName: targetStock.name,
              impact,
              day: nextDay,
              phase: 'opening'
            };

            // 生成黑天鹅新闻
            blackSwanNews = {
              id: randomId(),
              date: dateStr,
              type: isPositive ? 'good' : 'bad',
              title: isPositive
                ? `【黑天鹅】${targetStock.name}突发重大利好`
                : `【黑天鹅】${targetStock.name}遭遇重大危机`,
              content: isPositive
                ? `市场传闻${targetStock.name}将获得巨额订单，股价应声暴涨${(BLACK_SWAN_IMPACT * 100).toFixed(0)}%！`
                : `突传${targetStock.name}核心产品出现重大问题，股价暴跌${(BLACK_SWAN_IMPACT * 100).toFixed(0)}%！`,
              relatedStock: targetStock.code,
              impact
            };
          }
        }

        // 构建分红提示
        const newToasts = [...prev.toasts];
        if (dividendTotal > 0) {
          const detailText = dividendDetails.length <= 2
            ? dividendDetails.join('、')
            : `${dividendDetails[0]}等${dividendDetails.length}只股票`;
          newToasts.unshift({
            id: randomId(),
            type: 'success' as const,
            message: `💰 分红到账 ${formatCurrency(dividendTotal)}（${detailText}）`
          });
        }

        // 如果有黑天鹅新闻，插入到新闻列表最前面
        const allNews = blackSwanNews
          ? [blackSwanNews, ...news, ...prev.newsList]
          : [...news, ...prev.newsList];

        // 黑天鹅 Toast
        if (blackSwanEvent) {
          newToasts.unshift({
            id: randomId(),
            type: blackSwanEvent.impact > 0 ? 'success' : 'error',
            message: blackSwanEvent.impact > 0
              ? `🦢 黑天鹅！${blackSwanEvent.stockName}暴涨${(BLACK_SWAN_IMPACT * 100).toFixed(0)}%！`
              : `🦢 黑天鹅！${blackSwanEvent.stockName}暴跌${(BLACK_SWAN_IMPACT * 100).toFixed(0)}%！`
          });
        }

        newState = {
          ...prev,
          currentDay: nextDay,
          currentPhase: 'opening',
          currentDate: dateStr,
          stockHistory: newHistory,
          newsList: allNews.slice(0, 50),
          dailyImpact,
          cash: prev.cash + dividendTotal,
          toasts: newToasts.slice(0, 5),
          blackSwanEvent
        };
      }

      return newState;
    });
  }, [gameState.isGameOver, checkBankruptcyCondition]);

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
    sellAllStocks,
    nextPhase,
    getHolding,
    getCurrentPrice,
    getChangePercent,
    getTotalChangePercent,
    buyItem,
    useCrazyCola,
    useLottery,
    applyForLoan,
    repayLoan,
    dismissBankruptcyAlert,
    checkBankruptcyCondition,
    constants: {
      INITIAL_CASH,
      TARGET_CASH,
      TOTAL_DAYS,
      FEE_RATE,
      MAX_LOAN_AMOUNT,
      LOAN_DURATION
    }
  };
}
