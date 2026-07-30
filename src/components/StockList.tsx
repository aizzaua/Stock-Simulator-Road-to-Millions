import React, { useState } from 'react';
import { Stock, StockHistory, StockSector } from '../types';
import { STOCKS, SECTOR_INFO } from '../data/stocks';
import { formatCurrency, formatPercent } from '../utils/format';

interface StockListProps {
  selectedCode: string;
  stockHistory: StockHistory;
  onSelect: (code: string) => void;
  onOpenTrade: (code: string, type: 'buy' | 'sell') => void;
}

type FilterType = 'all' | StockSector;

export const StockList: React.FC<StockListProps> = ({
  selectedCode,
  stockHistory,
  onSelect,
  onOpenTrade
}) => {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredStocks = filter === 'all'
    ? STOCKS
    : STOCKS.filter(s => s.sector === filter);

  const getCurrentPrice = (code: string) => {
    const history = stockHistory[code];
    if (!history || history.length === 0) return 0;
    return history[history.length - 1].close;
  };

  const getChangePercent = (code: string) => {
    const history = stockHistory[code];
    if (!history || history.length < 2) return 0;
    const yesterdayClose = history[history.length - 2].close;
    const todayClose = history[history.length - 1].close;
    return ((todayClose - yesterdayClose) / yesterdayClose) * 100;
  };

  const getTotalChangePercent = (code: string) => {
    const history = stockHistory[code];
    if (!history || history.length < 2) return 0;
    const firstClose = history[0].close;
    const todayClose = history[history.length - 1].close;
    return ((todayClose - firstClose) / firstClose) * 100;
  };

  const filters: { type: FilterType; label: string }[] = [
    { type: 'all', label: '全部' },
    { type: 'tech', label: '🔬 科技' },
    { type: 'consumer', label: '🛒 消费' },
    { type: 'entertainment', label: '🎮 娱乐' }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>股票列表</div>
        <div style={styles.tabs}>
          {filters.map(f => (
            <button
              key={f.type}
              className={`tab ${filter === f.type ? 'active' : ''}`}
              onClick={() => setFilter(f.type)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.list}>
        {filteredStocks.map(stock => {
          const price = getCurrentPrice(stock.code);
          const change = getChangePercent(stock.code);
          const totalChange = getTotalChangePercent(stock.code);
          const isSelected = stock.code === selectedCode;
          const changeColor = change >= 0 ? '#3fb950' : '#f85149';

          return (
            <div
              key={stock.code}
              style={{
                ...styles.stockItem,
                ...(isSelected ? styles.stockItemSelected : {})
              }}
              onClick={() => onSelect(stock.code)}
              onDoubleClick={() => onOpenTrade(stock.code, 'buy')}
            >
              <div style={styles.leftSection}>
                <div style={styles.code}>{stock.code}</div>
                <div style={styles.name}>{stock.name}</div>
              </div>
              <div style={styles.rightSection}>
                <div style={styles.priceRow}>
                  <span style={styles.price}>{formatCurrency(price)}</span>
                  <span style={{ ...styles.change, color: changeColor }}>
                    {change >= 0 ? '+' : ''}{formatPercent(change)}
                  </span>
                </div>
                <div style={styles.totalChange}>
                  {totalChange >= 0 ? '+' : ''}{formatPercent(totalChange)}
                </div>
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
    width: '340px',
    background: '#161b22',
    borderRadius: '16px',
    border: '1px solid #30363d',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    overflow: 'hidden'
  },
  header: {
    background: '#21262d',
    borderBottom: '1px solid #30363d',
    padding: '14px 16px'
  },
  title: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#f0f6fc',
    marginBottom: '10px'
  },
  tabs: {
    display: 'flex' as const,
    flexWrap: 'wrap' as const,
    gap: '6px'
  },
  list: {
    flex: 1,
    overflowY: 'auto' as const
  },
  stockItem: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: '12px 16px',
    borderBottom: '1px solid #30363d',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  stockItemSelected: {
    background: 'rgba(88, 166, 255, 0.1)',
    borderLeft: '3px solid #58a6ff'
  },
  leftSection: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '2px'
  },
  code: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#58a6ff'
  },
  name: {
    fontSize: '12px',
    color: '#8b949e'
  },
  rightSection: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'flex-end' as const,
    gap: '2px'
  },
  priceRow: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '8px'
  },
  price: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#f0f6fc'
  },
  change: {
    fontSize: '13px',
    fontWeight: 700
  },
  totalChange: {
    fontSize: '11px',
    color: '#6e7681'
  }
};
