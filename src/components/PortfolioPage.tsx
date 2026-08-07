import React from 'react';
import { Holding, StockHistory } from '../types';
import { STOCKS, SECTOR_INFO } from '../data/stocks';
import {
  formatCurrency,
  formatPercent,
  calculateHoldingProfit,
  calculateTotalAssets
} from '../utils/format';

interface PortfolioPageProps {
  holdings: Holding[];
  stockHistory: StockHistory;
  cash: number;
  onOpenTrade: (code: string, type: 'buy' | 'sell') => void;
  onSellAll: () => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  holdings,
  stockHistory,
  cash,
  onOpenTrade,
  onSellAll
}) => {
  const getCurrentPrice = (code: string) => {
    const history = stockHistory[code];
    if (!history || history.length === 0) return 0;
    return history[history.length - 1].close;
  };

  // 计算总资产和持仓市值
  const totalAssets = calculateTotalAssets(cash, holdings, stockHistory);
  const totalMarketValue = holdings.reduce((sum, h) => {
    return sum + getCurrentPrice(h.code) * h.quantity;
  }, 0);

  // 计算板块分布
  const sectorDistribution = React.useMemo(() => {
    const distribution: Record<string, { value: number; label: string; color: string }> = {};

    for (const holding of holdings) {
      const stock = STOCKS.find(s => s.code === holding.code);
      if (!stock) continue;

      const marketValue = getCurrentPrice(holding.code) * holding.quantity;
      if (!distribution[stock.sector]) {
        distribution[stock.sector] = {
          value: 0,
          label: SECTOR_INFO[stock.sector].label,
          color: stock.sector === 'tech' ? '#58a6ff' : stock.sector === 'consumer' ? '#3fb950' : '#f0883e'
        };
      }
      distribution[stock.sector].value += marketValue;
    }

    return Object.values(distribution).map(item => ({
      ...item,
      percent: totalMarketValue > 0 ? (item.value / totalMarketValue) * 100 : 0
    })).sort((a, b) => b.value - a.value);
  }, [holdings, stockHistory, totalMarketValue]);

  // 计算持仓集中度
  const concentrationData = React.useMemo(() => {
    return holdings.map(holding => {
      const stock = STOCKS.find(s => s.code === holding.code);
      const currentPrice = getCurrentPrice(holding.code);
      const marketValue = currentPrice * holding.quantity;
      return {
        code: holding.code,
        name: stock?.name || holding.code,
        marketValue,
        percent: totalAssets > 0 ? (marketValue / totalAssets) * 100 : 0,
        color: stock?.colorStart || '#8b949e'
      };
    }).sort((a, b) => b.marketValue - a.marketValue);
  }, [holdings, stockHistory, totalAssets]);

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
          <p style={styles.subtitle}>
            持仓市值 {formatCurrency(totalMarketValue)} / 总资产 {formatCurrency(totalAssets)}
          </p>
        </div>
        <button
          className="btn btn-danger"
          style={{ padding: '8px 20px', fontSize: '13px' }}
          onClick={onSellAll}
        >
          🚨 一键清仓
        </button>
      </div>

      {/* 投资组合分析 */}
      <div style={styles.analysisSection}>
        <h3 style={styles.analysisTitle}>📊 投资组合分析</h3>
        <div style={styles.analysisGrid}>
          {/* 持仓集中度 */}
          <div style={styles.analysisCard}>
            <div style={styles.analysisCardTitle}>持仓集中度</div>
            <div style={styles.analysisCardSubtitle}>占总资产比例</div>
            <div style={styles.barList}>
              {concentrationData.map(item => (
                <div key={item.code} style={styles.barItem}>
                  <div style={styles.barLabel}>
                    <span style={styles.barName}>{item.name}</span>
                    <span style={styles.barPercent}>{item.percent.toFixed(1)}%</span>
                  </div>
                  <div style={styles.barTrack}>
                    <div
                      style={{
                        ...styles.barFill,
                        width: `${Math.min(item.percent, 100)}%`,
                        background: item.color
                      }}
                    />
                  </div>
                  <div style={styles.barValue}>{formatCurrency(item.marketValue)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 板块分布 */}
          <div style={styles.analysisCard}>
            <div style={styles.analysisCardTitle}>板块分布</div>
            <div style={styles.analysisCardSubtitle}>按行业分类</div>
            <div style={styles.sectorList}>
              {sectorDistribution.map(item => (
                <div key={item.label} style={styles.sectorItem}>
                  <div style={styles.sectorHeader}>
                    <span style={styles.sectorLabel}>{item.label}</span>
                    <span style={{ ...styles.sectorPercent, color: item.color }}>
                      {item.percent.toFixed(1)}%
                    </span>
                  </div>
                  <div style={styles.sectorTrack}>
                    <div
                      style={{
                        ...styles.sectorFill,
                        width: `${Math.min(item.percent, 100)}%`,
                        background: item.color
                      }}
                    />
                  </div>
                  <div style={styles.sectorValue}>{formatCurrency(item.value)}</div>
                </div>
              ))}
            </div>

            {/* 板块投资建议 */}
            <div style={styles.tipBox}>
              <span style={styles.tipIcon}>💡</span>
              <span style={styles.tipText}>
                {sectorDistribution.length <= 1
                  ? '持仓过于集中，建议分散投资降低风险'
                  : sectorDistribution[0]?.percent > 60
                    ? `${sectorDistribution[0].label}占比过高，注意板块风险`
                    : '板块分布较均衡，继续保持'}
              </span>
            </div>
          </div>
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
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
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
  analysisSection: {
    marginBottom: '20px'
  },
  analysisTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#f0f6fc',
    margin: '0 0 12px 0'
  },
  analysisGrid: {
    display: 'grid' as const,
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '8px'
  },
  analysisCard: {
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '16px',
    padding: '20px'
  },
  analysisCardTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#f0f6fc',
    marginBottom: '4px'
  },
  analysisCardSubtitle: {
    fontSize: '12px',
    color: '#6e7681',
    marginBottom: '16px'
  },
  barList: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '14px'
  },
  barItem: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '6px'
  },
  barLabel: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const
  },
  barName: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#f0f6fc'
  },
  barPercent: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#f0f6fc'
  },
  barTrack: {
    height: '8px',
    background: '#0d1117',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  barFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.5s ease'
  },
  barValue: {
    fontSize: '12px',
    color: '#6e7681',
    textAlign: 'right' as const
  },
  sectorList: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '14px'
  },
  sectorItem: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '6px'
  },
  sectorHeader: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const
  },
  sectorLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#f0f6fc'
  },
  sectorPercent: {
    fontSize: '13px',
    fontWeight: 700
  },
  sectorTrack: {
    height: '8px',
    background: '#0d1117',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  sectorFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.5s ease'
  },
  sectorValue: {
    fontSize: '12px',
    color: '#6e7681',
    textAlign: 'right' as const
  },
  tipBox: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '8px',
    marginTop: '16px',
    padding: '10px 12px',
    background: 'rgba(240, 136, 62, 0.08)',
    border: '1px solid rgba(240, 136, 62, 0.2)',
    borderRadius: '10px'
  },
  tipIcon: {
    fontSize: '16px',
    flexShrink: 0
  },
  tipText: {
    fontSize: '12px',
    color: '#8b949e',
    lineHeight: 1.5
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
