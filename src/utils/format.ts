/**
 * 格式化货币显示
 */
export function formatCurrency(value: number): string {
  return '¥' + value.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * 格式化百分比显示
 */
export function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : '';
  return sign + value.toFixed(2) + '%';
}

/**
 * 格式化日期
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 根据涨跌获取颜色类
 */
export function getChangeColor(value: number): 'up' | 'down' | 'neutral' {
  if (value > 0) return 'up';
  if (value < 0) return 'down';
  return 'neutral';
}

/**
 * 计算持仓市值
 */
export function calculateMarketValue(
  holdings: { code: string; quantity: number }[],
  stockHistory: { [code: string]: { close: number }[] }
): number {
  return holdings.reduce((total, holding) => {
    const history = stockHistory[holding.code];
    if (history && history.length > 0) {
      const currentPrice = history[history.length - 1].close;
      return total + currentPrice * holding.quantity;
    }
    return total;
  }, 0);
}

/**
 * 计算总资产
 */
export function calculateTotalAssets(
  cash: number,
  holdings: { code: string; quantity: number }[],
  stockHistory: { [code: string]: { close: number }[] }
): number {
  return cash + calculateMarketValue(holdings, stockHistory);
}

/**
 * 计算持仓盈亏
 */
export function calculateHoldingProfit(
  avgCost: number,
  quantity: number,
  currentPrice: number
): { amount: number; percent: number } {
  const cost = avgCost * quantity;
  const marketValue = currentPrice * quantity;
  const amount = marketValue - cost;
  const percent = cost > 0 ? (amount / cost) * 100 : 0;
  return { amount, percent };
}
