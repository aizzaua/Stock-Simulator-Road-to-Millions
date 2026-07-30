import React, { useRef, useState } from 'react';
import { GameRecord } from '../types';
import { formatCurrency, formatPercent } from '../utils/format';

interface ProfilePageProps {
  records: GameRecord[];
  stats: {
    totalGames: number;
    wins: number;
    winRate: number;
    avgHundredDayReturn: number;
    bestReturn: number;
  };
  onExport: () => void;
  onImport: (file: File) => Promise<void>;
  onClear: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  records,
  stats,
  onExport,
  onImport,
  onClear
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await onImport(file);
      } catch (err) {
        alert('导入失败：' + (err as Error).message);
      }
      e.target.value = '';
    }
  };

  const handleClear = () => {
    if (showClearConfirm) {
      onClear();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

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
        <div style={styles.headerLeft}>
          <div style={styles.title}>📊 我的统计</div>
          <div style={styles.subtitle}>记录你的投资之旅</div>
        </div>
        <div style={styles.actions}>
          <button className="btn btn-secondary" style={styles.actionBtn} onClick={onExport}>
            📤 导出数据
          </button>
          <button className="btn btn-secondary" style={styles.actionBtn} onClick={handleImportClick}>
            📥 导入数据
          </button>
          <button
            className="btn btn-secondary"
            style={{
              ...styles.actionBtn,
              ...(showClearConfirm ? styles.clearBtnActive : {})
            }}
            onClick={handleClear}
          >
            {showClearConfirm ? '⚠️ 确认清除' : '🗑️ 清除数据'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
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
          <div style={styles.statIcon}>📈</div>
          <div style={{ ...styles.statValue, color: profitColor(stats.winRate) }}>
            {stats.winRate.toFixed(1)}%
          </div>
          <div style={styles.statLabel}>通关率</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📊</div>
          <div style={{ ...styles.statValue, color: profitColor(stats.avgHundredDayReturn) }}>
            {stats.avgHundredDayReturn >= 0 ? '+' : ''}{formatPercent(stats.avgHundredDayReturn)}
          </div>
          <div style={styles.statLabel}>平均百日收益</div>
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
    </div>
  );
};

const styles = {
  container: {
    height: '100%',
    overflowY: 'auto' as const,
    padding: '8px'
  },
  header: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: '24px'
  },
  headerLeft: {},
  title: {
    fontSize: '24px',
    fontWeight: 800,
    color: '#f0f6fc',
    marginBottom: '4px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#8b949e'
  },
  actions: {
    display: 'flex' as const,
    gap: '12px'
  },
  actionBtn: {
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: 600
  },
  clearBtnActive: {
    background: 'rgba(248, 81, 73, 0.1)',
    borderColor: '#f85149',
    color: '#f85149'
  },
  statsGrid: {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '16px',
    marginBottom: '24px'
  },
  statCard: {
    background: 'linear-gradient(135deg, rgba(88, 166, 255, 0.1), rgba(88, 166, 255, 0.02))',
    border: '1px solid rgba(88, 166, 255, 0.2)',
    borderRadius: '16px',
    padding: '20px 16px',
    textAlign: 'center' as const
  },
  statIcon: {
    fontSize: '32px',
    marginBottom: '8px'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 800,
    color: '#f0f6fc',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#8b949e',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  },
  recordsSection: {},
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#f0f6fc',
    marginBottom: '16px'
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    background: '#21262d',
    border: '1px solid #30363d',
    borderRadius: '16px'
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  emptyText: {
    fontSize: '16px',
    fontWeight: 600,
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
    gap: '12px'
  },
  recordCard: {
    background: '#21262d',
    border: '1px solid #30363d',
    borderRadius: '14px',
    padding: '16px 20px',
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
    fontSize: '32px',
    width: '48px',
    height: '48px',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    background: '#161b22',
    borderRadius: '12px',
    border: '1px solid #30363d'
  },
  recordInfo: {},
  recordResult: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#f0f6fc',
    marginBottom: '4px'
  },
  recordDate: {
    fontSize: '12px',
    color: '#8b949e'
  },
  recordRight: {},
  recordStats: {
    display: 'flex' as const,
    gap: '24px'
  },
  recordStat: {
    textAlign: 'right' as const
  },
  recordStatLabel: {
    display: 'block',
    fontSize: '11px',
    fontWeight: 600,
    color: '#6e7681',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '2px'
  },
  recordStatValue: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 700,
    color: '#f0f6fc'
  }
};
