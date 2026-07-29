import React from 'react';
import { StockHistory, Holding, GamePhase } from '../types';
import { STOCKS } from '../data/stocks';
import { formatCurrency, formatPercent } from '../utils/format';
import { KLineChart } from './KLineChart';
import { StockList } from './StockList';

interface MarketPageProps {
  selectedCode: string;
  stockHistory: StockHistory;
  holdings: Holding[];
  cash: number;
  currentPhase: GamePhase;
  onSelect: (code: string) => void;
  onOpenTrade: (code: string, type: 'buy' | 'sell') => void;
}

export const MarketPage: React.FC<MarketPageProps> = ({
  selectedCode,
  stockHistory,
  holdings,
  cash,
  currentPhase,
  onSelect,
  onOpenTrade
}) => {
  const selectedStock = STOCKS.find(s => s.code === selectedCode) || STOCKS[0];
  const selectedData = stockHistory[selectedCode] || [];
  const holding = holdings.find(h => h.code === selectedCode);

  const getCurrentPrice = () => {
    if (selectedData.length === 0) return 0;
    return selectedData[selectedData.length - 1].close;
  };

  const getChangePercent = () => {
    if (selectedData.length < 2) return 0;
    const yesterdayClose = selectedData[selectedData.length - 2].close;
    const todayClose = selectedData[selectedData.length - 1].close;
    return ((todayClose - yesterdayClose) / yesterdayClose) * 100;
  };

  const getTotalChangePercent = () => {
    if (selectedData.length < 2) return 0;
    const firstClose = selectedData[0].close;
    const todayClose = selectedData[selectedData.length - 1].close;
    return ((todayClose - firstClose) / firstClose) * 100;
  };

  const currentPrice = getCurrentPrice();
  const changePercent = getChangePercent();
  const totalChangePercent = getTotalChangePercent();
  const changeColor = changePercent >= 0 ? '#3fb950' : '#f85149';

  const canTrade = currentPhase !== 'lunch';

  const maxBuyQuantity = currentPrice > 0 ? Math.floor(cash / (currentPrice * 1.001)) : 0;
  const maxSellQuantity = holding?.quantity || 0;

  return (
    <div style={styles.container}>
      <div style={styles.leftSection}>
        <KLineChart
          stock={selectedStock}
          data={selectedData}
        />
        {/* 交易信息面板 */}
        <div style={styles.tradePanel}>
          <div style={styles.stockHeader}>
            <div style={{
              ...styles.avatar,
              background: `linear-gradient(135deg, ${selectedStock.colorStart}, ${selectedStock.colorEnd})`
            }}>
              {selectedStock.name.charAt(0)}
            </div>
            <div style={styles.stockInfo}>
              <div style={styles.stockName}>{selectedStock.name}</div>
              <div style={styles.stockCode}>{selectedStock.code}</div>
            </div>
            <div style={styles.priceInfo}>
              <div style={{ ...styles.currentPrice, color: changeColor }}>
                {formatCurrency(currentPrice)}
              </div>
              <div style={{ ...styles.priceChange, color: changeColor }}>
                {changePercent >= 0 ? '+' : ''}{formatPercent(changePercent)}
              </div>
            </div>
          </div>

          <div style={styles.statsRow}>
            <div className="stat-box" style={{ flex: 1 }}>
              <div className="stat-label">历史涨跌</div>
              <div className="stat-value" style={{
                color: totalChangePercent >= 0 ? '#3fb950' : '#f85149'
              }}>
                {totalChangePercent >= 0 ? '+' : ''}{formatPercent(totalChangePercent)}
              </div>
            </div>
            <div className="stat-box" style={{ flex: 1 }}>
              <div className="stat-label">今日波动</div>
              <div className="stat-value">{(selectedStock.volatility * 100).toFixed(1)}%</div>
            </div>
          </div>

          {holding && (
            <div style={styles.holdingInfo}>
              <div style={styles.holdingTitle}>我的持仓</div>
              <div style={styles.holdingStats}>
                <div className="stat-box" style={{ flex: 1 }}>
                  <div className="stat-label">持仓数量</div>
                  <div className="stat-value">{holding.quantity}股</div>
                </div>
                <div className="stat-box" style={{ flex: 1 }}>
                  <div className="stat-label">成本价</div>
                  <div className="stat-value">{formatCurrency(holding.avgCost)}</div>
                </div>
                <div className="stat-box" style={{ flex: 1 }}>
                  <div className="stat-label">持仓市值</div>
                  <div className="stat-value">{formatCurrency(currentPrice * holding.quantity)}</div>
                </div>
              </div>
            </div>
          )}

          <div style={styles.tradeButtons}>
            <button
              className="btn"
              style={{
                ...styles.tradeBtn,
                ...styles.buyBtn,
                ...(!canTrade || maxBuyQuantity <= 0 ? styles.disabledBtn : {})
              }}
              disabled={!canTrade || maxBuyQuantity <= 0}
              onClick={() => onOpenTrade(selectedCode, 'buy')}
            >
              <span style={styles.btnIcon}>📈</span>
              <span>买入</span>
              {!canTrade && <span style={styles.btnHint}>休市中</span>}
            </button>
            <button
              className="btn"
              style={{
                ...styles.tradeBtn,
                ...styles.sellBtn,
                ...(!canTrade || maxSellQuantity <= 0 ? styles.disabledBtn : {})
              }}
              disabled={!canTrade || maxSellQuantity <= 0}
              onClick={() => onOpenTrade(selectedCode, 'sell')}
            >
              <span style={styles.btnIcon}>📉</span>
              <span>卖出</span>
              {!canTrade && <span style={styles.btnHint}>休市中</span>}
            </button>
          </div>

          {!canTrade && (
            <div style={styles.tradeHint}>
              ⏰ 午间休市中，请在开盘或收盘时段交易
            </div>
          )}
        </div>
      </div>

      <StockList
        selectedCode={selectedCode}
        stockHistory={stockHistory}
        onSelect={onSelect}
        onOpenTrade={onOpenTrade}
      />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex' as const,
    gap: '16px',
    height: '100%'
  },
  leftSection: {
    flex: 1,
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '16px',
    minWidth: 0
  },
  tradePanel: {
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '16px',
    padding: '16px 20px'
  },
  stockHeader: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '16px',
    marginBottom: '16px'
  },
  avatar: {
    width: '52px',
    height: '52px',
    borderRadius: '12px',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    fontSize: '20px',
    fontWeight: 700,
    color: 'white'
  },
  stockInfo: {
    flex: 1
  },
  stockName: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#f0f6fc'
  },
  stockCode: {
    fontSize: '13px',
    color: '#8b949e'
  },
  priceInfo: {
    textAlign: 'right' as const
  },
  currentPrice: {
    fontSize: '24px',
    fontWeight: 800
  },
  priceChange: {
    fontSize: '14px',
    fontWeight: 600
  },
  statsRow: {
    display: 'flex' as const,
    gap: '12px',
    marginBottom: '12px'
  },
  holdingInfo: {
    background: '#21262d',
    borderRadius: '12px',
    padding: '12px 16px',
    marginBottom: '12px'
  },
  holdingTitle: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#8b949e',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '10px'
  },
  holdingStats: {
    display: 'flex' as const,
    gap: '12px'
  },
  tradeButtons: {
    display: 'flex' as const,
    gap: '12px'
  },
  tradeBtn: {
    flex: 1,
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    gap: '4px',
    padding: '14px 20px',
    fontSize: '15px',
    fontWeight: 700,
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit'
  },
  buyBtn: {
    background: 'linear-gradient(135deg, rgba(63, 185, 80, 0.2), rgba(63, 185, 80, 0.1))',
    color: '#3fb950',
    border: '2px solid #3fb950',
    '&:hover': {
      background: 'linear-gradient(135deg, rgba(63, 185, 80, 0.3), rgba(63, 185, 80, 0.15))'
    }
  },
  sellBtn: {
    background: 'linear-gradient(135deg, rgba(248, 81, 73, 0.2), rgba(248, 81, 73, 0.1))',
    color: '#f85149',
    border: '2px solid #f85149',
    '&:hover': {
      background: 'linear-gradient(135deg, rgba(248, 81, 73, 0.3), rgba(248, 81, 73, 0.15))'
    }
  },
  disabledBtn: {
    opacity: 0.4,
    cursor: 'not-allowed'
  },
  btnIcon: {
    fontSize: '20px'
  },
  btnHint: {
    fontSize: '11px',
    fontWeight: 500,
    opacity: 0.8
  },
  tradeHint: {
    marginTop: '12px',
    padding: '10px',
    textAlign: 'center' as const,
    fontSize: '12px',
    color: '#f0883e',
    background: 'rgba(240, 136, 62, 0.1)',
    borderRadius: '10px'
  }
};
