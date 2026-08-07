import React from 'react';
import { formatCurrency, formatPercent } from '../utils/format';

interface SettlementModalProps {
  isWin: boolean;
  finalAssets: number;
  days: number;
  gameOverReason?: 'timeout' | 'poison' | 'bankruptcy' | null;
  onRestart: () => void;
  historicalStats?: {
    totalGames: number;
    wins: number;
    avgHundredDayReturn: number;
  };
  hundredDayReturn?: number;
}

export const SettlementModal: React.FC<SettlementModalProps> = ({
  isWin,
  finalAssets,
  days,
  gameOverReason,
  onRestart,
  historicalStats,
  hundredDayReturn = 0
}) => {
  const totalProfit = finalAssets - 10000;
  const totalProfitPercent = ((finalAssets - 10000) / 10000) * 100;
  const profitColor = totalProfit >= 0 ? '#3fb950' : '#f85149';
  const returnColor = hundredDayReturn >= 0 ? '#3fb950' : '#f85149';

  const getTitle = () => {
    if (isWin) {
      return { text: '🎉 恭喜达成目标！', color: '#3fb950' };
    }
    if (gameOverReason === 'poison') {
      return { text: '💀 可乐中毒！', color: '#f85149' };
    }
    if (gameOverReason === 'bankruptcy') {
      return { text: '🏚️ 破产清算！', color: '#f85149' };
    }
    return { text: '⏰ 时间到！', color: '#f85149' };
  };

  const getDescription = () => {
    if (isWin) {
      return '你真是一位出色的投资者！';
    }
    if (gameOverReason === 'poison') {
      return '你喝了疯狂的可乐后中毒倒地，游戏结束...<br/>真是乐极生悲啊！';
    }
    if (gameOverReason === 'bankruptcy') {
      return '山穷水尽，无力回天...<br/>投资有风险，下次请谨慎！';
    }
    return '虽然没有达成目标，但你已经很棒了！';
  };

  const title = getTitle();

  return (
    <div style={styles.overlay}>
      <div style={{
        ...styles.modal,
        ...(gameOverReason === 'poison' ? styles.poisonModal : {}),
        ...(gameOverReason === 'bankruptcy' ? styles.bankruptcyModal : {})
      }}>
        <div style={styles.icon}>
          {isWin ? '🎉' : gameOverReason === 'poison' ? '💀' : gameOverReason === 'bankruptcy' ? '🏚️' : '⏰'}
        </div>
        <h2 style={{ ...styles.title, color: title.color }}>
          {title.text}
        </h2>
        <p style={styles.subtitle} dangerouslySetInnerHTML={{ __html: getDescription() }} />

        <div style={styles.stats}>
          <div style={styles.stat}>
            <div style={styles.statLabel}>用时</div>
            <div style={styles.statValue}>{days}天</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statLabel}>最终资产</div>
            <div style={styles.statValue}>{formatCurrency(finalAssets)}</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statLabel}>总收益率</div>
            <div style={{ ...styles.statValue, color: profitColor }}>
              {totalProfitPercent >= 0 ? '+' : ''}{formatPercent(totalProfitPercent)}
            </div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statLabel}>百日收益率</div>
            <div style={{ ...styles.statValue, color: returnColor }}>
              {hundredDayReturn >= 0 ? '+' : ''}{formatPercent(hundredDayReturn)}
            </div>
          </div>
        </div>

        {historicalStats && historicalStats.totalGames > 0 && (
          <div style={styles.historicalNote}>
            <span style={styles.noteIcon}>📊</span>
            <span style={styles.noteText}>
              历史记录：{historicalStats.totalGames} 局，{historicalStats.wins} 次通关
              {historicalStats.avgHundredDayReturn !== 0 && (
                <>，平均百日收益 {historicalStats.avgHundredDayReturn >= 0 ? '+' : ''}{formatPercent(historicalStats.avgHundredDayReturn)}</>
              )}
            </span>
          </div>
        )}

        {gameOverReason === 'poison' && (
          <div style={styles.poisonNote}>
            <span style={styles.noteIcon}>💡</span>
            <span style={styles.noteText}>别灰心！可乐虽好，可不要贪杯哦~</span>
          </div>
        )}
        {gameOverReason === 'bankruptcy' && (
          <div style={styles.bankruptcyNote}>
            <span style={styles.noteIcon}>💡</span>
            <span style={styles.noteText}>别灰心！投资之路漫漫，机会永远都在！</span>
          </div>
        )}

        <button
          className="btn btn-primary"
          style={{ width: '100%', padding: '16px', fontSize: '16px' }}
          onClick={onRestart}
        >
          再来一局
        </button>
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
    backdropFilter: 'blur(6px)',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    zIndex: 1000,
    padding: '16px'
  },
  modal: {
    width: '480px',
    maxWidth: '90vw',
    background: 'linear-gradient(180deg, #1a1f26, #0d1117)',
    borderRadius: '24px',
    border: '2px solid #30363d',
    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.6)',
    padding: '40px 32px 32px',
    textAlign: 'center' as const
  },
  poisonModal: {
    borderColor: '#f85149',
    boxShadow: '0 24px 80px rgba(248, 81, 73, 0.2)'
  },
  bankruptcyModal: {
    borderColor: '#f0883e',
    boxShadow: '0 24px 80px rgba(240, 136, 62, 0.2)'
  },
  icon: {
    fontSize: '80px',
    marginBottom: '16px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 800,
    margin: '0 0 10px 0'
  },
  subtitle: {
    fontSize: '14px',
    color: '#8b949e',
    margin: '0 0 28px 0',
    lineHeight: 1.6
  },
  stats: {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    marginBottom: '24px'
  },
  stat: {
    background: '#21262d',
    borderRadius: '14px',
    padding: '16px 12px',
    border: '1px solid #30363d'
  },
  statLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#6e7681',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '6px'
  },
  statValue: {
    fontSize: '16px',
    fontWeight: 800,
    color: '#f0f6fc'
  },
  poisonNote: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: '8px',
    padding: '12px 16px',
    background: 'rgba(248, 81, 73, 0.1)',
    border: '1px solid rgba(248, 81, 73, 0.2)',
    borderRadius: '12px',
    marginBottom: '24px'
  },
  bankruptcyNote: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: '8px',
    padding: '12px 16px',
    background: 'rgba(240, 136, 62, 0.1)',
    border: '1px solid rgba(240, 136, 62, 0.2)',
    borderRadius: '12px',
    marginBottom: '24px'
  },
  historicalNote: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: '8px',
    padding: '12px 16px',
    background: 'rgba(88, 166, 255, 0.1)',
    border: '1px solid rgba(88, 166, 255, 0.2)',
    borderRadius: '12px',
    marginBottom: '24px'
  },
  noteIcon: {
    fontSize: '18px'
  },
  noteText: {
    fontSize: '12px',
    color: '#8b949e',
    fontWeight: 600
  }
};
