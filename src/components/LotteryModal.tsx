import React, { useState, useEffect } from 'react';
import { LotteryResult, LotteryPrize } from '../types';
import { formatCurrency } from '../utils/format';

interface LotteryModalProps {
  itemName: string;
  price: number;
  result: LotteryResult;
  onClose: () => void;
}

export const LotteryModal: React.FC<LotteryModalProps> = ({
  itemName,
  price,
  result,
  onClose
}) => {
  const [phase, setPhase] = useState<'rolling' | 'revealing' | 'complete'>('rolling');

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('revealing'), 1000);
    const timer2 = setTimeout(() => setPhase('complete'), 2000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

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
    <div style={styles.overlay} onClick={onClose}>
      <div style={{
        ...styles.modal,
        ...(result.isJackpot ? styles.jackpotModal : {})
      }} onClick={e => e.stopPropagation()}>
        <div style={styles.iconContainer}>
          <span style={{
            ...styles.icon,
            ...(phase === 'rolling' ? styles.rollingIcon : {})
          }}>
            {phase === 'rolling' ? '🎰' : getEmoji()}
          </span>
        </div>

        <h2 style={{
          ...styles.title,
          color: getResultColor(),
          ...(phase === 'rolling' ? styles.rollingTitle : {})
        }}>
          {phase === 'rolling' ? '开奖中...' : getResultTitle()}
        </h2>

        {phase !== 'rolling' && (
          <>
            <div style={styles.prizeName}>
              {result.prize.name}
            </div>

            {result.prize.multiplier > 0 ? (
              <div style={{
                ...styles.amount,
                color: getResultColor()
              }}>
                +{formatCurrency(result.amount)}
              </div>
            ) : (
              <div style={styles.amountZero}>
              没中奖
            </div>
            )}

            {result.prize.multiplier > 0 && (
              <div style={styles.multiplier}>
                ×{result.prize.multiplier}倍！
              </div>
            )}

            <div style={styles.footer}>
              <button
              style={styles.confirmBtn}
              onClick={onClose}
            >
              {result.isJackpot ? '太棒了！' : result.prize.multiplier > 0 ? '收下' : '继续努力'}
            </button>
          </div>
          )}
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
    background: 'rgba(0, 0, 0, 0.8)',
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
    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.6)',
    padding: '36px 28px',
    textAlign: 'center' as const,
    animation: 'scaleIn 0.3s ease'
  },
  jackpotModal: {
    borderColor: '#f0883e',
    boxShadow: '0 24px 80px rgba(240, 136, 62, 0.3)'
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
      boxShadow: '0 8px 24px rgba(88, 166, 255, 0.3)'
    }
  }
};
