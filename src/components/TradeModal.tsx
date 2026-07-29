import React, { useState, useEffect } from 'react';
import { Stock, Holding } from '../types';
import { STOCKS } from '../data/stocks';
import { formatCurrency } from '../utils/format';

interface TradeModalProps {
  stockCode: string;
  initialType: 'buy' | 'sell';
  cash: number;
  holdings: Holding[];
  stockHistory: { [code: string]: { close: number }[] };
  onClose: () => void;
  onTrade: (code: string, type: 'buy' | 'sell', quantity: number) => boolean;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  stockCode,
  initialType,
  cash,
  holdings,
  stockHistory,
  onClose,
  onTrade
}) => {
  const [type, setType] = useState<'buy' | 'sell'>(initialType);
  const [quantity, setQuantity] = useState(1);

  const stock = STOCKS.find(s => s.code === stockCode);
  const holding = holdings.find(h => h.code === stockCode);

  const getCurrentPrice = () => {
    const history = stockHistory[stockCode];
    if (!history || history.length === 0) return 0;
    return history[history.length - 1].close;
  };

  const price = getCurrentPrice();
  const tradeAmount = price * quantity;
  const fee = tradeAmount * 0.001;
  const total = type === 'buy' ? tradeAmount + fee : tradeAmount - fee;

  const maxBuyQuantity = price > 0 ? Math.floor((cash) / (price * 1.001)) : 0;
  const maxSellQuantity = holding?.quantity || 0;

  const canTrade = quantity > 0 &&
    (type === 'buy' ? quantity <= maxBuyQuantity : quantity <= maxSellQuantity);

  useEffect(() => {
    setType(initialType);
    setQuantity(1);
  }, [stockCode, initialType]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const adjustQuantity = (delta: number) => {
    const max = type === 'buy' ? maxBuyQuantity : maxSellQuantity;
    setQuantity(prev => {
      const newVal = prev + delta;
      if (newVal < 1) return 1;
      if (newVal > max && max > 0) return max;
      return newVal;
    });
  };

  const handleTrade = () => {
    const success = onTrade(stockCode, type, quantity);
    if (success) {
      onClose();
    }
  };

  if (!stock) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.title}>
            {type === 'buy' ? '买入' : '卖出'}股票
          </div>
          <button style={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={styles.body}>
          {/* 股票信息 */}
          <div style={styles.stockInfo}>
            <div style={{
              ...styles.avatar,
              background: `linear-gradient(135deg, ${stock.colorStart}, ${stock.colorEnd})`
            }}>
              {stock.name.charAt(0)}
            </div>
            <div style={styles.stockDetails}>
              <div style={styles.stockName}>{stock.name}</div>
              <div style={styles.stockCode}>{stock.code}</div>
            </div>
            <div style={styles.priceWrapper}>
              <div style={styles.price}>{formatCurrency(price)}</div>
            </div>
          </div>

          {/* 交易类型选择 */}
          <div style={styles.typeRow}>
            <button
              style={{
                ...styles.typeButton,
                ...(type === 'buy' ? styles.typeButtonBuyActive : {})
              }}
              onClick={() => setType('buy')}
            >
              买入
            </button>
            <button
              style={{
                ...styles.typeButton,
                ...(type === 'sell' ? styles.typeButtonSellActive : {})
              }}
              onClick={() => setType('sell')}
            >
              卖出
            </button>
          </div>

          {/* 数量输入 */}
          <div style={styles.quantitySection}>
            {/* 减号按钮 */}
            <div style={styles.buttonRow}>
              <button
                style={{ ...styles.quantityButton, ...styles.quantityButtonRed }}
                onClick={() => adjustQuantity(-100)}
              >
                -100
              </button>
              <button
                style={{ ...styles.quantityButton, ...styles.quantityButtonRed }}
                onClick={() => adjustQuantity(-10)}
              >
                -10
              </button>
              <button
                style={{ ...styles.quantityButton, ...styles.quantityButtonRed }}
                onClick={() => adjustQuantity(-1)}
              >
                -1
              </button>
            </div>

            {/* 显示区域 */}
            <div style={styles.quantityDisplay}>
              <input
                type="number"
                style={styles.quantityInput}
                value={quantity}
                onChange={e => {
                  const val = parseInt(e.target.value) || 1;
                  const max = type === 'buy' ? maxBuyQuantity : maxSellQuantity;
                  if (val < 1) setQuantity(1);
                  else if (max > 0 && val > max) setQuantity(max);
                  else setQuantity(val);
                }}
                min="1"
              />
              <span style={styles.quantityUnit}>股</span>
            </div>

            {/* 加号按钮 */}
            <div style={styles.buttonRow}>
              <button
                style={{ ...styles.quantityButton, ...styles.quantityButtonGreen }}
                onClick={() => adjustQuantity(1)}
              >
                +1
              </button>
              <button
                style={{ ...styles.quantityButton, ...styles.quantityButtonGreen }}
                onClick={() => adjustQuantity(10)}
              >
                +10
              </button>
              <button
                style={{ ...styles.quantityButton, ...styles.quantityButtonGreen }}
                onClick={() => adjustQuantity(100)}
              >
                +100
              </button>
            </div>

            {/* 快捷按钮 */}
            <div style={styles.quickButtons}>
              <button
                style={styles.quickButton}
                onClick={() => {
                  if (type === 'buy') {
                    setQuantity(Math.max(1, Math.floor(maxBuyQuantity / 2)));
                  } else {
                    setQuantity(Math.max(1, Math.floor(maxSellQuantity / 2)));
                  }
                }}
              >
                1/2
              </button>
              <button
                style={styles.quickButton}
                onClick={() => {
                  if (type === 'buy') {
                    setQuantity(Math.max(1, maxBuyQuantity));
                  } else {
                    setQuantity(Math.max(1, maxSellQuantity));
                  }
                }}
              >
                全部
              </button>
            </div>

            <div style={styles.quantityHint}>
              {type === 'buy'
                ? `最多可买 ${maxBuyQuantity} 股`
                : `持有 ${maxSellQuantity} 股`}
            </div>
          </div>

          {/* 金额汇总 */}
          <div style={styles.summary}>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>交易金额</span>
              <span style={styles.summaryValue}>{formatCurrency(tradeAmount)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>手续费</span>
              <span style={styles.summaryValue}>{formatCurrency(fee)}</span>
            </div>
            <div style={{ ...styles.summaryRow, ...styles.summaryRowTotal }}>
              <span style={styles.summaryLabel}>合计</span>
              <span style={styles.summaryValue}>
                {type === 'buy' ? '−' : '+'}{formatCurrency(total)}
              </span>
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <button
            className={`btn ${type === 'buy' ? 'btn-success' : 'btn-danger'}`}
            style={{ width: '100%', padding: '12px' }}
            disabled={!canTrade}
            onClick={handleTrade}
          >
            确认{type === 'buy' ? '买入' : '卖出'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(4px)',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    zIndex: 1000,
    padding: '16px',
    animation: 'fadeIn 0.2s ease'
  },
  modal: {
    width: '420px',
    maxWidth: '100%',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    background: '#161b22',
    borderRadius: '16px',
    border: '1px solid #30363d',
    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5)',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    animation: 'scaleIn 0.2s ease'
  },
  header: {
    background: '#21262d',
    borderBottom: '1px solid #30363d',
    padding: '14px 18px',
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    borderRadius: '16px 16px 0 0'
  },
  title: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#f0f6fc'
  },
  closeButton: {
    width: '28px',
    height: '28px',
    background: '#21262d',
    border: 'none',
    borderRadius: '6px',
    color: '#8b949e',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    transition: 'all 0.2s ease',
    '&:hover': {
      background: '#30363d',
      color: '#f0f6fc'
    }
  },
  body: {
    padding: '16px 18px',
    flexShrink: 0
  },
  stockInfo: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '12px',
    background: '#21262d',
    borderRadius: '12px',
    padding: '12px',
    marginBottom: '14px'
  },
  avatar: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    fontSize: '18px',
    fontWeight: 700,
    color: 'white',
    flexShrink: 0
  },
  stockDetails: {
    flex: 1,
    minWidth: 0
  },
  stockName: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#f0f6fc',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  stockCode: {
    fontSize: '11px',
    color: '#8b949e'
  },
  priceWrapper: {
    flexShrink: 0
  },
  price: {
    fontSize: '18px',
    fontWeight: 800,
    color: '#f0f6fc'
  },
  typeRow: {
    display: 'flex' as const,
    gap: '8px',
    marginBottom: '14px'
  },
  typeButton: {
    flex: 1,
    padding: '10px',
    background: 'transparent',
    border: '2px solid #30363d',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: 700,
    color: '#8b949e',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit'
  },
  typeButtonBuyActive: {
    background: 'rgba(63, 185, 80, 0.1)',
    borderColor: '#3fb950',
    color: '#3fb950'
  },
  typeButtonSellActive: {
    background: 'rgba(248, 81, 73, 0.1)',
    borderColor: '#f85149',
    color: '#f85149'
  },
  quantitySection: {
    marginBottom: '14px'
  },
  buttonRow: {
    display: 'flex' as const,
    gap: '6px',
    marginBottom: '8px'
  },
  quantityButton: {
    flex: 1,
    height: '36px',
    background: '#21262d',
    border: '2px solid #30363d',
    borderRadius: '8px',
    color: '#f0f6fc',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    '&:hover': {
      borderColor: '#484f58'
    }
  },
  quantityButtonRed: {
    color: '#f85149',
    borderColor: 'rgba(248, 81, 73, 0.3)',
    '&:hover': {
      background: 'rgba(248, 81, 73, 0.1)',
      borderColor: '#f85149'
    }
  },
  quantityButtonGreen: {
    color: '#3fb950',
    borderColor: 'rgba(63, 185, 80, 0.3)',
    '&:hover': {
      background: 'rgba(63, 185, 80, 0.1)',
      borderColor: '#3fb950'
    }
  },
  quantityDisplay: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: '8px',
    background: '#21262d',
    border: '2px solid #30363d',
    borderRadius: '10px',
    padding: '10px',
    marginBottom: '8px'
  },
  quantityInput: {
    width: '100px',
    background: 'transparent',
    border: 'none',
    color: '#f0f6fc',
    fontSize: '20px',
    fontWeight: 800,
    textAlign: 'center' as const,
    outline: 'none',
    fontFamily: 'inherit'
  },
  quantityUnit: {
    fontSize: '13px',
    color: '#8b949e',
    fontWeight: 600
  },
  quickButtons: {
    display: 'flex' as const,
    gap: '6px',
    marginBottom: '6px'
  },
  quickButton: {
    flex: 1,
    padding: '8px',
    background: '#21262d',
    border: '1px solid #30363d',
    borderRadius: '6px',
    color: '#8b949e',
    fontSize: '11px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    '&:hover': {
      borderColor: '#484f58',
      color: '#f0f6fc'
    }
  },
  quantityHint: {
    fontSize: '11px',
    color: '#6e7681',
    textAlign: 'center' as const
  },
  summary: {
    background: '#21262d',
    borderRadius: '10px',
    padding: '10px 14px'
  },
  summaryRow: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center',
    padding: '5px 0',
    borderBottom: '1px solid #30363d'
  },
  summaryRowTotal: {
    borderBottom: 'none',
    paddingTop: '8px',
    marginTop: '2px'
  },
  summaryLabel: {
    fontSize: '12px',
    color: '#8b949e'
  },
  summaryValue: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#f0f6fc'
  },
  footer: {
    background: '#21262d',
    borderTop: '1px solid #30363d',
    padding: '14px 18px 18px',
    borderRadius: '0 0 16px 16px'
  }
};
