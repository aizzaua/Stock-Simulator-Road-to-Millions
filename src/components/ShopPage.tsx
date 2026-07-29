import React from 'react';
import { GamePhase, Item } from '../types';
import { SHOP_ITEMS } from '../data/items';
import { formatCurrency } from '../utils/format';

interface ShopPageProps {
  cash: number;
  currentPhase: GamePhase;
  onBuy: (itemId: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  cash,
  currentPhase,
  onBuy
}) => {
  const isShopOpen = currentPhase === 'closing';

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🏪 神秘商城</h2>
          <p style={styles.subtitle}>
            {isShopOpen
              ? '商城开放中！购买道具影响股价！'
              : '商城仅在收盘阶段开放，请耐心等待！'}
          </p>
        </div>
        <div style={styles.cashBox}>
          <span style={styles.cashLabel}>现金</span>
          <span style={styles.cashValue}>{formatCurrency(cash)}</span>
        </div>
      </div>

      <div style={styles.grid}>
        {SHOP_ITEMS.map(item => (
          <div key={item.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={{ ...styles.icon, background: `${item.color}20` }}>
                {item.icon}
              </div>
              <div style={styles.itemInfo}>
                <h3 style={styles.itemName}>{item.name}</h3>
                <span style={styles.price}>{formatCurrency(item.price)}</span>
              </div>
            </div>
            <p style={styles.description}>{item.description}</p>
            <button
              style={{
                ...styles.buyButton,
                ...(!isShopOpen || cash < item.price ? styles.disabledButton : {})
              }}
              disabled={!isShopOpen || cash < item.price}
              onClick={() => onBuy(item.id)}
            >
              {!isShopOpen ? '暂未开放' : cash < item.price ? '现金不足' : '购买'}
            </button>
          </div>
        ))}
      </div>

      {!isShopOpen && (
        <div style={styles.hint}>
          <span style={styles.hintIcon}>⏰</span>
          <span>商城仅在收盘阶段开放，请先完成今日交易！</span>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    height: '100%',
    overflowY: 'auto' as const
  },
  header: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #30363d'
  },
  title: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#f0f6fc',
    margin: '0 0 4px 0'
  },
  subtitle: {
    fontSize: '13px',
    color: '#8b949e',
    margin: 0
  },
  cashBox: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'flex-end' as const,
    background: '#21262d',
    padding: '10px 16px',
    borderRadius: '10px',
    border: '1px solid #30363d'
  },
  cashLabel: {
    fontSize: '11px',
    color: '#6e7681',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  },
  cashValue: {
    fontSize: '16px',
    fontWeight: 800,
    color: '#f0883e',
    marginTop: '2px'
  },
  grid: {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px'
  },
  card: {
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex' as const,
    flexDirection: 'column' as const
  },
  cardHeader: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '14px',
    marginBottom: '12px'
  },
  icon: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    fontSize: '28px'
  },
  itemInfo: {
    flex: 1
  },
  itemName: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#f0f6fc',
    margin: '0 0 4px 0'
  },
  price: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#f0883e'
  },
  description: {
    fontSize: '13px',
    color: '#8b949e',
    lineHeight: 1.6,
    margin: '0 0 16px 0',
    flex: 1
  },
  buyButton: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #f0883e, #c96f2e)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(240, 136, 62, 0.3)'
    }
  },
  disabledButton: {
    background: '#30363d',
    color: '#6e7681',
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none',
    '&:hover': {
      transform: 'none',
      boxShadow: 'none'
    }
  },
  hint: {
    marginTop: '20px',
    padding: '16px',
    background: '#21262d',
    border: '1px solid #30363d',
    borderRadius: '12px',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: '10px',
    color: '#8b949e',
    fontSize: '13px'
  },
  hintIcon: {
    fontSize: '18px'
  }
};
