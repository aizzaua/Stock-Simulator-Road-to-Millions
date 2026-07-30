import React, { useState } from 'react';
import { GameRecord, Achievement, AchievementState } from '../types';
import { formatCurrency, formatPercent } from '../utils/format';
import { AchievementList } from './AchievementList';

interface ProfilePageProps {
  records: GameRecord[];
  stats: {
    totalGames: number;
    wins: number;
    winRate: number;
    avgHundredDayReturn: number;
    bestReturn: number;
    bestFinalAssets: number;
    totalFinalAssets: number;
    totalGameDays: number;
  };
  achievementStats: {
    unlockedBasic: number;
    totalBasic: number;
    unlockedHidden: number;
    totalHidden: number;
  };
  achievements: Achievement[];
  achievementStates: AchievementState[];
  newUnlocks: string[];
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  records,
  stats,
  achievementStats,
  achievements,
  achievementStates,
  newUnlocks
}) => {
  const [showAchievements, setShowAchievements] = useState(false);

  const profitColor = (val: number) => val >= 0 ? '#3fb950' : '#f85149';

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getResultIcon = (record: GameRecord) => {
    if (record.isWin) return { icon: '🎉', text: '通关', color: '#3fb950' };
    if (record.gameOverReason === 'poison') return { icon: '💀', text: '中毒', color: '#f85149' };
    if (record.gameOverReason === 'bankruptcy') return { icon: '🏚️', text: '破产', color: '#f0883e' };
    return { icon: '⏰', text: '超时', color: '#8b949e' };
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button
          style={styles.achievementBtn}
          onClick={() => setShowAchievements(true)}
        >
          <span style={styles.achievementIcon}>🏆</span>
          <span style={styles.achievementCount}>
            {achievementStats.unlockedBasic}/{achievementStats.totalBasic}
          </span>
        </button>
        <div style={styles.headerMain}>
          <div style={styles.title}>个人统计</div>
          <div style={styles.subtitle}>记录你的投资之旅</div>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.achievementSummary}>
            <div style={styles.achievementSummaryRow}>
              <span style={styles.achievementSummaryLabel}>基础</span>
              <span style={styles.achievementSummaryValue}>
                {achievementStats.unlockedBasic}/{achievementStats.totalBasic}
              </span>
            </div>
            <div style={styles.achievementSummaryRow}>
              <span style={styles.achievementSummaryLabel}>隐藏</span>
              <span style={styles.achievementSummaryValue}>
                {achievementStats.unlockedHidden}/{achievementStats.totalHidden}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🎮</div>
          <div style={styles.statValue}>{stats.totalGames}</div>
          <div style={styles.statLabel}>总对局</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🏆</div>
          <div style={styles.statValue}>{stats.wins}</div>
          <div style={styles.statLabel}>通关次数</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>
          <div style={styles.statValue}>{formatCurrency(stats.totalFinalAssets)}</div>
          <div style={styles.statLabel}>累计总资产</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📅</div>
          <div style={styles.statValue}>{stats.totalGameDays}</div>
          <div style={styles.statLabel}>累计游戏天数</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🚀</div>
          <div style={{ ...styles.statValue, color: profitColor(stats.bestReturn) }}>
            {stats.bestReturn >= 0 ? '+' : ''}{formatPercent(stats.bestReturn)}
          </div>
          <div style={styles.statLabel}>最佳百日收益</div>
        </div>
      </div>

      <div style={styles.recordsSection}>
        <div style={styles.sectionTitle}>历史对局</div>
        {records.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🎯</div>
            <div style={styles.emptyText}>还没有游戏记录</div>
            <div style={styles.emptyHint}>开始你的第一局吧！</div>
          </div>
        ) : (
          <div style={styles.recordsList}>
            {records.map((record) => {
              const result = getResultIcon(record);
              return (
                <div key={record.id} style={styles.recordCard}>
                  <div style={styles.recordLeft}>
                    <div style={{ ...styles.recordIcon, color: result.color }}>
                      {result.icon}
                    </div>
                    <div style={styles.recordInfo}>
                      <div style={styles.recordResult}>{result.text}</div>
                      <div style={styles.recordDate}>{formatDate(record.endTime)}</div>
                    </div>
                  </div>
                  <div style={styles.recordRight}>
                    <div style={styles.recordStats}>
                      <div style={styles.recordStat}>
                        <span style={styles.recordStatLabel}>用时</span>
                        <span style={styles.recordStatValue}>{record.days}天</span>
                      </div>
                      <div style={styles.recordStat}>
                        <span style={styles.recordStatLabel}>最终资产</span>
                        <span style={styles.recordStatValue}>{formatCurrency(record.finalAssets)}</span>
                      </div>
                      <div style={styles.recordStat}>
                        <span style={styles.recordStatLabel}>总收益</span>
                        <span style={{ ...styles.recordStatValue, color: profitColor(record.totalProfitPercent) }}>
                          {record.totalProfitPercent >= 0 ? '+' : ''}{formatPercent(record.totalProfitPercent)}
                        </span>
                      </div>
                      <div style={styles.recordStat}>
                        <span style={styles.recordStatLabel}>百日收益</span>
                        <span style={{ ...styles.recordStatValue, color: profitColor(record.hundredDayReturn) }}>
                          {record.hundredDayReturn >= 0 ? '+' : ''}{formatPercent(record.hundredDayReturn)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AchievementList
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
        achievements={achievements}
        states={achievementStates}
        newUnlocks={newUnlocks}
      />
    </div>
  );
};

const styles = {
  container: {
    height: '100%',
    overflowY: 'auto' as const,
    padding: '8px',
    maxWidth: '900px',
    width: '100%',
    margin: '0 auto'
  },
  header: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '16px',
    marginBottom: '24px',
    padding: '20px',
    background: 'linear-gradient(135deg, rgba(88, 166, 255, 0.15), rgba(88, 166, 255, 0.05))',
    border: '1px solid rgba(88, 166, 255, 0.25)',
    borderRadius: '16px'
  },
  achievementBtn: {
    width: '56px',
    height: '56px',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: '2px',
    background: 'linear-gradient(135deg, rgba(240, 136, 62, 0.2), rgba(240, 136, 62, 0.05))',
    border: '1px solid rgba(240, 136, 62, 0.3)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 0 20px rgba(240, 136, 62, 0.3)'
    }
  },
  achievementIcon: {
    fontSize: '24px'
  },
  achievementCount: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#f0883e'
  },
  headerMain: {
    flex: 1
  },
  title: {
    fontSize: '22px',
    fontWeight: 800,
    color: '#f0f6fc',
    marginBottom: '4px'
  },
  subtitle: {
    fontSize: '13px',
    color: '#8b949e'
  },
  headerRight: {},
  achievementSummary: {
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '10px',
    padding: '10px 14px'
  },
  achievementSummaryRow: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    gap: '16px',
    marginBottom: '4px',
    '&:last-child': {
      marginBottom: 0
    }
  },
  achievementSummaryLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#8b949e',
    textTransform: 'uppercase' as const
  },
  achievementSummaryValue: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#f0883e'
  },
  statsGrid: {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '14px',
    marginBottom: '24px'
  },
  statCard: {
    background: 'linear-gradient(135deg, rgba(88, 166, 255, 0.1), rgba(88, 166, 255, 0.02))',
    border: '1px solid rgba(88, 166, 255, 0.2)',
    borderRadius: '16px',
    padding: '18px 14px',
    textAlign: 'center' as const
  },
  statIcon: {
    fontSize: '28px',
    marginBottom: '8px'
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 800,
    color: '#f0f6fc',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#8b949e',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  },
  recordsSection: {},
  sectionTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#f0f6fc',
    marginBottom: '12px'
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '16px'
  },
  emptyIcon: {
    fontSize: '40px',
    marginBottom: '16px'
  },
  emptyText: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#f0f6fc',
    marginBottom: '8px'
  },
  emptyHint: {
    fontSize: '13px',
    color: '#8b949e'
  },
  recordsList: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '10px'
  },
  recordCard: {
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '14px',
    padding: '14px 18px',
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const
  },
  recordLeft: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '14px'
  },
  recordIcon: {
    fontSize: '28px',
    width: '44px',
    height: '44px',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    background: '#0d1117',
    borderRadius: '12px',
    border: '1px solid #30363d'
  },
  recordInfo: {},
  recordResult: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#f0f6fc',
    marginBottom: '3px'
  },
  recordDate: {
    fontSize: '11px',
    color: '#8b949e'
  },
  recordRight: {},
  recordStats: {
    display: 'flex' as const,
    gap: '20px'
  },
  recordStat: {
    textAlign: 'right' as const
  },
  recordStatLabel: {
    display: 'block' as const,
    fontSize: '10px',
    fontWeight: 600,
    color: '#6e7681',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '2px'
  },
  recordStatValue: {
    display: 'block' as const,
    fontSize: '13px',
    fontWeight: 700,
    color: '#f0f6fc'
  }
};
