import React, { useState } from 'react';
import { Stock, StockHistory, StockSector } from '../types';
import { STOCKS, SECTOR_INFO } from '../data/stocks';
import { formatCurrency, formatPercent } from '../utils/format';

interface StockListProps {
  selectedCode: string;
  stockHistory: StockHistory;
  onSelect: (code: string) => void;
  onOpenTrade: (code: string) => void;
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

      <div style={styles.tableHeader}>
        <div style={styles.tableHeaderCell}>代码</div>
        <div style={styles.tableHeaderCell}>名称</div>
        <div style={styles.tableHeaderCell}>现价</div>
        <div style={styles.tableHeaderCell}>涨跌</div>
        <div style={styles.tableHeaderCell}>历史</div>
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
              onDoubleClick={() => onOpenTrade(stock.code)}
            >
              <div style={styles.code}>{stock.code}</div>
              <div style={styles.name}>{stock.name}</div>
              <div style={styles.price}>{formatCurrency(price)}</div>
              <div style={{ ...styles.change, color: changeColor }}>
                {change >= 0 ? '+' : ''}{formatPercent(change)}
              </div>
              <div style={styles.totalChange}>
                {totalChange >= 0 ? '+' : ''}{formatPercent(totalChange)}
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
    width: '380px',
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
    padding: '16px 20px'
  },
  title: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#f0f6fc',
    marginBottom: '12px'
  },
  tabs: {
    display: 'flex' as const,
    flexWrap: 'wrap' as const,
    gap: '8px'
  },
  tableHeader: {
    display: 'grid' as const,
    gridTemplateColumns: '70px 1fr 90px 90px 80px',
    gap: '8px',
    padding: '12px 20px',
    background: '#21262d',
    borderBottom: '1px solid #30363d',
    position: 'sticky' as const,
    top: 0,
    zIndex: 1
  },
  tableHeaderCell: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#6e7681',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  },
  list: {
    flex: 1,
    overflowY: 'auto' as const
  },
  stockItem: {
    display: 'grid' as const,
    gridTemplateColumns: '70px 1fr 90px 90px 80px',
    gap: '8px',
    padding: '14px 20px',
    borderBottom: '1px solid #30363d',
    cursor: 'pointer',
    alignItems: 'center',
    transition: 'all 0.15s ease',
    '&:hover': {
      background: '#21262d'
    }
  },
  stockItemSelected: {
    background: 'rgba(88, 166, 255, 0.1)',
    borderLeft: '3px solid #58a6ff'
  },
  code: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#58a6ff'
  },
  name: {
    fontSize: '14px',
    color: '#f0f6fc'
  },
  price: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#f0f6fc',
    textAlign: 'right' as const
  },
  change: {
    fontSize: '14px',
    fontWeight: 700,
    textAlign: 'right' as const
  },
  totalChange: {
    fontSize: '12px',
    color: '#8b949e',
    textAlign: 'right' as const
  }
};
