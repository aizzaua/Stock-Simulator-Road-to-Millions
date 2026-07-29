import React from 'react';
import { Holding, StockHistory } from '../types';
import { STOCKS } from '../data/stocks';
import {
  formatCurrency,
  formatPercent,
  calculateHoldingProfit
} from '../utils/format';

interface PortfolioPageProps {
  holdings: Holding[];
  stockHistory: StockHistory;
  onOpenTrade: (code: string, type: 'buy' | 'sell') => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  holdings,
  stockHistory,
  onOpenTrade
}) => {
  const getCurrentPrice = (code: string) => {
    const history = stockHistory[code];
    if (!history || history.length === 0) return 0;
    return history[history.length - 1].close;
  };

  if (holdings.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyIcon}>📭</div>
        <div style={styles.emptyTitle}>暂无持仓</div>
        <div style={styles.emptyHint}>
          去「市场行情」看看有什么值得买的股票吧
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>我的持仓</h2>
          <p style={styles.subtitle}>管理你的投资组合</p>
        </div>
      </div>

      <div style={styles.grid}>
        {holdings.map(holding => {
          const stock = STOCKS.find(s => s.code === holding.code);
          if (!stock) return null;

          const currentPrice = getCurrentPrice(holding.code);
          const profit = calculateHoldingProfit(
            holding.avgCost,
            holding.quantity,
            currentPrice
          );
          const marketValue = currentPrice * holding.quantity;
          const profitColor = profit.amount >= 0 ? '#3fb950' : '#f85149';

          return (
            <div key={holding.code} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.stockInfo}>
                  <div style={{
                    ...styles.avatar,
                    background: `linear-gradient(135deg, ${stock.colorStart}, ${stock.colorEnd})`
                  }}>
                    {stock.name.charAt(0)}
                  </div>
                  <div>
                    <div style={styles.stockName}>{stock.name}</div>
                    <div style={styles.stockCode}>{stock.code}</div>
                  </div>
                </div>
                <div style={styles.profit}>
                  <div style={{ ...styles.profitAmount, color: profitColor }}>
                    {profit.amount >= 0 ? '+' : ''}{formatCurrency(profit.amount)}
                  </div>
                  <div style={{ ...styles.profitPercent, color: profitColor }}>
                    ({profit.percent >= 0 ? '+' : ''}{formatPercent(profit.percent)})
                  </div>
                </div>
              </div>

              <div style={styles.detailsGrid}>
                <div className="stat-box">
                  <div className="stat-label">持有数量</div>
                  <div className="stat-value">{holding.quantity}股</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">持仓市值</div>
                  <div className="stat-value">{formatCurrency(marketValue)}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">成本价</div>
                  <div className="stat-value">{formatCurrency(holding.avgCost)}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">现价</div>
                  <div className="stat-value">{formatCurrency(currentPrice)}</div>
                </div>
              </div>

              <div style={styles.buttonRow}>
                <button
                  className="btn btn-ghost-up"
                  style={{ flex: 1 }}
                  onClick={() => onOpenTrade(holding.code, 'buy')}
                >
                  加仓
                </button>
                <button
                  className="btn btn-ghost-down"
                  style={{ flex: 1 }}
                  onClick={() => onOpenTrade(holding.code, 'sell')}
                >
                  卖出
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    height: '100%',
    overflow: 'hidden'
  },
  header: {
    marginBottom: '20px'
  },
  title: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#f0f6fc',
    margin: 0
  },
  subtitle: {
    fontSize: '13px',
    color: '#8b949e',
    margin: '4px 0 0 0'
  },
  grid: {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '16px',
    overflowY: 'auto' as const,
    paddingBottom: '20px'
  },
  card: {
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '16px',
    padding: '20px',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: '#484f58',
      transform: 'translateY(-2px)'
    }
  },
  cardHeader: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  stockInfo: {
    display: 'flex' as const,
    alignItems: 'center',
    gap: '12px'
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    fontSize: '18px',
    fontWeight: 700,
    color: 'white'
  },
  stockName: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#f0f6fc'
  },
  stockCode: {
    fontSize: '12px',
    color: '#8b949e'
  },
  profit: {
    textAlign: 'right' as const
  },
  profitAmount: {
    fontSize: '18px',
    fontWeight: 800
  },
  profitPercent: {
    fontSize: '13px',
    fontWeight: 700
  },
  detailsGrid: {
    display: 'grid' as const,
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '16px'
  },
  buttonRow: {
    display: 'flex' as const,
    gap: '8px'
  },
  emptyContainer: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    height: '100%',
    gap: '16px'
  },
  emptyIcon: {
    fontSize: '64px',
    opacity: 0.5
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#f0f6fc'
  },
  emptyHint: {
    fontSize: '14px',
    color: '#8b949e'
  }
};
