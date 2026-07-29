import React, { useState } from 'react';
import { BagItem, StockHistory, Holding, LotteryResult } from '../types';
import { STOCKS } from '../data/stocks';
import { LOTTERY_ITEMS } from '../data/items';
import { formatCurrency } from '../utils/format';

interface BagPageProps {
  bag: BagItem[];
  holdings: Holding[];
  stockHistory: StockHistory;
  onUseCrazyCola: (stockCode: string) => void;
  onUseLottery: (itemId: string) => LotteryResult | null;
}

export const BagPage: React.FC<BagPageProps> = ({
  bag,
  holdings,
  stockHistory,
  onUseCrazyCola,
  onUseLottery
}) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [lotteryResult, setLotteryResult] = useState<{
    result: LotteryResult;
    itemName: string;
    price: number;
  } | null>(null);

  if (bag.length === 0) {
    return (
      <div style={bagStyles.emptyContainer}>
        <div style={bagStyles.emptyIcon}>🎒</div>
        <div style={bagStyles.emptyTitle}>背包空空</div>
        <div style={bagStyles.emptyHint}>去商城购买道具吧！</div>
      </div>
    );
  }

  const handleUseItem = (itemId: string) => {
    // 检查是不是彩票
    const isLottery = LOTTERY_ITEMS.some(i => i.id === itemId);
    if (isLottery) {
      const result = onUseLottery(itemId);
      const item = LOTTERY_ITEMS.find(i => i.id === itemId);
      if (result && item) {
        setLotteryResult({ result, itemName: item.name, price: item.price });
      }
    } else if (itemId === 'crazy_cola') {
      setSelectedItem(selectedItem === itemId ? null : itemId);
    }
  };

  return (
    <div style={bagStyles.container}>
      <div style={bagStyles.header}>
        <div>
          <h2 style={bagStyles.title}>🎒 我的背包</h2>
          <p style={bagStyles.subtitle}>使用道具影响股价走向！</p>
        </div>
        <div style={bagStyles.countBox}>
          <span style={bagStyles.countValue}>{bag.reduce((sum, item) => sum + item.quantity, 0)}</span>
          <span style={bagStyles.countLabel}>件道具</span>
        </div>
      </div>

      <div style={bagStyles.grid}>
        {bag.map(item => (
          <div key={item.id} style={bagStyles.card}>
            <div style={bagStyles.cardHeader}>
              <div style={{ ...bagStyles.icon, background: `${item.color}20` }}>
                {item.icon}
              </div>
              <div style={bagStyles.itemInfo}>
                <h3 style={bagStyles.itemName}>{item.name}</h3>
                <span style={bagStyles.quantity}>×{item.quantity}</span>
              </div>
            </div>
            <p style={bagStyles.description}>{item.description}</p>
            <button
              style={bagStyles.useBtn}
              onClick={() => handleUseItem(item.id)}
            >
              使用
            </button>

            {selectedItem === item.id && item.id === 'crazy_cola' && (
              <div style={bagStyles.selectStockArea}>
                <div style={bagStyles.selectTitle}>选择股票</div>
                <div style={bagStyles.stockList}>
                  {STOCKS.map(stock => {
                    const history = stockHistory[stock.code];
                    const price = history?.[history.length - 1].close || 0;
                    return (
                      <button
                        key={stock.code}
                        style={bagStyles.stockOption}
                        onClick={() => {
                          onUseCrazyCola(stock.code);
                          setSelectedItem(null);
                        }}
                      >
                        <div style={bagStyles.stockLeft}>
                          <span style={{ ...bagStyles.stockIcon, background: `linear-gradient(135deg, ${stock.colorStart}, ${stock.colorEnd})` }}>
                            {stock.name.charAt(0)}
                          </span>
                          <div>
                            <div style={bagStyles.stockName}>{stock.name}</div>
                            <div style={bagStyles.stockCode}>{stock.code}</div>
                          </div>
                        </div>
                        <div style={bagStyles.stockRight}>
                          <div style={bagStyles.stockPrice}>{formatCurrency(price)}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {lotteryResult && (
        <LotteryModal
          itemName={lotteryResult.itemName}
          price={lotteryResult.price}
          result={lotteryResult.result}
          onClose={() => setLotteryResult(null)}
        />
      )}
    </div>
  );
};

// 彩票弹窗组件
const LotteryModal: React.FC<{
  itemName: string;
  price: number;
  result: LotteryResult;
  onClose: () => void;
}> = ({ itemName, price, result, onClose }) => {
  const [phase, setPhase] = useState<'rolling' | 'revealing' | 'complete'>('rolling');

  React.useEffect(() => {
    // 确保每次弹窗都重置状态
    setPhase('rolling');
    const timer1 = setTimeout(() => setPhase('revealing'), 1000);
    const timer2 = setTimeout(() => setPhase('complete'), 2000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [result]); // 当result变化时重新触发

  const getResultColor = () => {
    if (result.isJackpot) return '#f0883e';
    if (result.prize.multiplier >= 10) return '#a371f7';
    if (result.prize.multiplier >= 2) return '#58a6ff';
    if (result.prize.multiplier >= 1) return '#3fb950';
    return '#8b949e';
  };

  const getEmoji = () => {
    if (result.isJackpot) return '🎉';
    if (result.prize.multiplier >= 10) return '💰';
    if (result.prize.multiplier >= 2) return '🎊';
    if (result.prize.multiplier >= 1) return '✅';
    return '😢';
  };

  const getResultTitle = () => {
    if (result.isJackpot) return '恭喜特等奖！！！';
    if (result.prize.multiplier >= 10) return '恭喜中奖！';
    if (result.prize.multiplier >= 2) return '运气不错！';
    if (result.prize.multiplier >= 1) return '保本了！';
    if (result.prize.multiplier >= 0.5) return '中了个小红包';
    if (result.prize.multiplier >= 0.2) return '安慰奖';
    return '谢谢参与';
  };

  return (
    <div style={lotteryStyles.overlay} onClick={onClose}>
      <div style={{
        ...lotteryStyles.modal,
        ...(result.isJackpot ? lotteryStyles.jackpotModal : {})
      }} onClick={e => e.stopPropagation()}>
        <div style={lotteryStyles.iconContainer}>
          <span style={{
            ...lotteryStyles.icon,
            ...(phase === 'rolling' ? lotteryStyles.rollingIcon : {})
          }}>
            {phase === 'rolling' ? '🎰' : getEmoji()}
          </span>
        </div>

        <h2 style={{
          ...lotteryStyles.title,
          color: getResultColor(),
          ...(phase === 'rolling' ? lotteryStyles.rollingTitle : {})
        }}>
          {phase === 'rolling' ? '开奖中...' : getResultTitle()}
        </h2>

        {phase !== 'rolling' && (
          <>
            <div style={lotteryStyles.prizeName}>
              {result.prize.name}
            </div>

            {result.prize.multiplier > 0 ? (
              <div style={{
                ...lotteryStyles.amount,
                color: getResultColor()
              }}>
                +{formatCurrency(result.amount)}
              </div>
            ) : (
              <div style={lotteryStyles.amountZero}>
                没中奖
              </div>
            )}

            {result.prize.multiplier > 0 && (
              <div style={lotteryStyles.multiplier}>
                ×{result.prize.multiplier}倍！
              </div>
            )}

            <div style={lotteryStyles.footer}>
              <button
                style={lotteryStyles.confirmBtn}
                onClick={onClose}
              >
                {result.isJackpot ? '太棒了！' : result.prize.multiplier > 0 ? '收下' : '继续努力'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// 背包样式
const bagStyles = {
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
  countBox: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'flex-end' as const,
    background: '#21262d',
    padding: '10px 16px',
    borderRadius: '10px',
    border: '1px solid #30363d'
  },
  countValue: {
    fontSize: '20px',
    fontWeight: 800,
    color: '#f0883e'
  },
  countLabel: {
    fontSize: '11px',
    color: '#6e7681',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginTop: '2px'
  },
  grid: {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
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
  quantity: {
    fontSize: '14px',
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
  useBtn: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #58a6ff, #388bfd)',
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
      boxShadow: '0 8px 24px rgba(88,166,255,0.3)'
    }
  },
  selectStockArea: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #30363d'
  },
  selectTitle: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#8b949e',
    marginBottom: '10px'
  },
  stockList: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '8px',
    maxHeight: '240px',
    overflowY: 'auto' as const
  },
  stockOption: {
    width: '100%',
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: '10px 12px',
    background: '#21262d',
    border: '1px solid #30363d',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    '&:hover': {
      borderColor: '#58a6ff',
      background: 'rgba(88,166,255,0.1)'
    }
  },
  stockLeft: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '10px'
  },
  stockIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    fontSize: '14px',
    fontWeight: 700,
    color: 'white'
  },
  stockName: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#f0f6fc',
    textAlign: 'left' as const
  },
  stockCode: {
    fontSize: '11px',
    color: '#8b949e',
    textAlign: 'left' as const
  },
  stockRight: {
    textAlign: 'right' as const
  },
  stockPrice: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#f0f6fc'
  },
  emptyContainer: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    height: '100%',
    gap: '12px'
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
    fontSize: '13px',
    color: '#8b949e'
  }
};

// 彩票弹窗样式
const lotteryStyles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    backdropFilter: 'blur(4px)',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    zIndex: 2000,
    padding: '16px',
    animation: 'fadeIn 0.2s ease'
  },
  modal: {
    width: '400px',
    maxWidth: '90vw',
    background: 'linear-gradient(180deg, #1a1f26, #0d1117)',
    borderRadius: '20px',
    border: '2px solid #30363d',
    boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
    padding: '36px 28px',
    textAlign: 'center' as const,
    animation: 'scaleIn 0.3s ease'
  },
  jackpotModal: {
    borderColor: '#f0883e',
    boxShadow: '0 24px 80px rgba(240,136,62,0.3)'
  },
  iconContainer: {
    marginBottom: '20px'
  },
  icon: {
    fontSize: '72px',
    display: 'inline-block' as const
  },
  rollingIcon: {
    animation: 'spin 0.5s ease-in-out infinite'
  },
  title: {
    fontSize: '24px',
    fontWeight: 800,
    margin: '0 0 12px 0'
  },
  rollingTitle: {
    color: '#8b949e'
  },
  prizeName: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#f0f6fc',
    marginBottom: '8px'
  },
  amount: {
    fontSize: '36px',
    fontWeight: 900,
    marginBottom: '8px'
  },
  amountZero: {
    fontSize: '20px',
    color: '#8b949e',
    fontWeight: 600,
    marginBottom: '12px'
  },
  multiplier: {
    fontSize: '14px',
    color: '#6e7681',
    fontWeight: 600,
    marginBottom: '24px'
  },
  footer: {
    display: 'flex' as const,
    gap: '12px'
  },
  confirmBtn: {
    flex: 1,
    padding: '14px',
    background: 'linear-gradient(135deg, #58a6ff, #388bfd)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 24px rgba(88,166,255,0.3)'
    }
  }
};
