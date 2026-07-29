import { Stock, KLineData, StockHistory } from '../types';
import { STOCKS } from '../data/stocks';
import { normalRandom } from '../utils/random';
import { formatDate } from '../utils/format';

const INITIAL_HISTORY_DAYS = 500;

/**
 * 生成一日K线数据
 */
function generateDayKLine(
  prevClose: number,
  volatility: number,
  trend: number,
  extraImpact: number = 0
): KLineData {
  // 计算当日涨跌幅
  const change = normalRandom(0, volatility) + trend + extraImpact;
  const close = prevClose * (1 + change);

  // 生成当日波动范围
  const highFactor = 1 + Math.abs(normalRandom(0, volatility * 0.6));
  const lowFactor = 1 - Math.abs(normalRandom(0, volatility * 0.6));
  const openFactor = 1 + normalRandom(0, volatility * 0.3);

  const open = prevClose * openFactor;
  const high = Math.max(open, close) * highFactor;
  const low = Math.min(open, close) * lowFactor;

  // 确保价格顺序正确
  const finalHigh = Math.max(open, close, high);
  const finalLow = Math.min(open, close, low);

  // 生成成交量（随机范围）
  const baseVolume = 1000000;
  const volume = Math.floor(baseVolume * (0.5 + Math.random()));

  return {
    open: Math.max(0.01, open),
    high: Math.max(0.01, finalHigh),
    low: Math.max(0.01, finalLow),
    close: Math.max(0.01, close),
    volume,
    date: '' // 会在外部设置
  };
}

/**
 * 生成初始历史数据
 */
export function generateInitialHistory(startDate: Date): StockHistory {
  const history: StockHistory = {};
  let currentDate = new Date(startDate);

  // 从初始日期往前推 INITIAL_HISTORY_DAYS 天
  currentDate.setDate(currentDate.getDate() - INITIAL_HISTORY_DAYS);

  for (const stock of STOCKS) {
    history[stock.code] = [];
    let currentPrice = stock.basePrice;
    let tempDate = new Date(currentDate);

    for (let i = 0; i < INITIAL_HISTORY_DAYS; i++) {
      const kline = generateDayKLine(currentPrice, stock.volatility, stock.trend);
      kline.date = formatDate(tempDate);
      history[stock.code].push(kline);
      currentPrice = kline.close;

      // 跳过周末
      tempDate.setDate(tempDate.getDate() + 1);
      const day = tempDate.getDay();
      if (day === 0) tempDate.setDate(tempDate.getDate() + 1);
      if (day === 6) tempDate.setDate(tempDate.getDate() + 2);
    }
  }

  return history;
}

/**
 * 生成下一日K线数据
 */
export function generateNextDayKLine(
  history: StockHistory,
  dailyImpact: { [code: string]: number }
): StockHistory {
  const newHistory: StockHistory = { ...history };

  // 找到最新日期
  let latestDate = new Date();
  const firstStock = STOCKS[0];
  if (history[firstStock.code] && history[firstStock.code].length > 0) {
    latestDate = new Date(history[firstStock.code][history[firstStock.code].length - 1].date);
  }

  // 计算下一个交易日
  let nextDate = new Date(latestDate);
  nextDate.setDate(nextDate.getDate() + 1);
  const day = nextDate.getDay();
  if (day === 0) nextDate.setDate(nextDate.getDate() + 1);
  if (day === 6) nextDate.setDate(nextDate.getDate() + 2);

  const dateStr = formatDate(nextDate);

  for (const stock of STOCKS) {
    const stockHistory = history[stock.code];
    if (!stockHistory || stockHistory.length === 0) continue;

    const prevClose = stockHistory[stockHistory.length - 1].close;
    const extraImpact = dailyImpact[stock.code] || 0;
    const kline = generateDayKLine(prevClose, stock.volatility, stock.trend, extraImpact);
    kline.date = dateStr;

    newHistory[stock.code] = [...stockHistory, kline];
  }

  return newHistory;
}

/**
 * 为开盘阶段生成价格波动（基于前一日收盘）
 */
export function generateOpeningPrice(
  history: StockHistory,
  dailyImpact: { [code: string]: number }
): StockHistory {
  const newHistory: StockHistory = { ...history };

  for (const stock of STOCKS) {
    const stockHistory = history[stock.code];
    if (!stockHistory || stockHistory.length === 0) continue;

    const lastKLine = stockHistory[stockHistory.length - 1];
    const extraImpact = dailyImpact[stock.code] || 0;

    // 开盘波动较小
    const openingChange = normalRandom(0, stock.volatility * 0.3) + extraImpact * 0.3;
    const openPrice = lastKLine.close * (1 + openingChange);
    const high = Math.max(openPrice, lastKLine.close) * (1 + Math.abs(normalRandom(0, stock.volatility * 0.2)));
    const low = Math.min(openPrice, lastKLine.close) * (1 - Math.abs(normalRandom(0, stock.volatility * 0.2)));

    const newKLine = {
      ...lastKLine,
      open: openPrice,
      high: Math.max(high, openPrice),
      low: Math.min(low, openPrice),
      close: openPrice // 开盘阶段收盘价暂设为开盘价
    };

    newHistory[stock.code] = [...stockHistory.slice(0, -1), newKLine];
  }

  return newHistory;
}

/**
 * 为午间休市生成价格波动
 */
export function generateLunchPrice(history: StockHistory): StockHistory {
  const newHistory: StockHistory = { ...history };

  for (const stock of STOCKS) {
    const stockHistory = history[stock.code];
    if (!stockHistory || stockHistory.length === 0) continue;

    const lastKLine = stockHistory[stockHistory.length - 1];
    const stockInfo = STOCKS.find(s => s.code === stock.code);
    if (!stockInfo) continue;

    // 午间波动
    const lunchChange = normalRandom(0, stockInfo.volatility * 0.2);
    const lunchPrice = lastKLine.close * (1 + lunchChange);

    const newKLine = {
      ...lastKLine,
      high: Math.max(lastKLine.high, lunchPrice),
      low: Math.min(lastKLine.low, lunchPrice),
      close: lunchPrice
    };

    newHistory[stock.code] = [...stockHistory.slice(0, -1), newKLine];
  }

  return newHistory;
}

/**
 * 为收盘阶段生成最终价格
 */
export function generateClosingPrice(
  history: StockHistory,
  dailyImpact: { [code: string]: number }
): StockHistory {
  const newHistory: StockHistory = { ...history };

  for (const stock of STOCKS) {
    const stockHistory = history[stock.code];
    if (!stockHistory || stockHistory.length === 0) continue;

    const lastKLine = stockHistory[stockHistory.length - 1];
    const stockInfo = STOCKS.find(s => s.code === stock.code);
    if (!stockInfo) continue;

    // 收盘最终波动
    const extraImpact = dailyImpact[stock.code] || 0;
    const closingChange = normalRandom(0, stockInfo.volatility * 0.3) + extraImpact * 0.7;
    const closingPrice = lastKLine.close * (1 + closingChange);

    const newKLine = {
      ...lastKLine,
      high: Math.max(lastKLine.high, closingPrice),
      low: Math.min(lastKLine.low, closingPrice),
      close: closingPrice
    };

    newHistory[stock.code] = [...stockHistory.slice(0, -1), newKLine];
  }

  return newHistory;
}
