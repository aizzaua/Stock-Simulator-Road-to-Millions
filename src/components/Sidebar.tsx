import React from 'react';
import { PageType, Holding, StockHistory, BagItem } from '../types';
import {
  formatCurrency,
  formatPercent,
  calculateMarketValue,
  calculateTotalAssets
} from '../utils/format';
import { STOCKS } from '../data/stocks';

interface SidebarProps {
  currentPage: PageType;
  cash: number;
  holdings: Holding[];
  stockHistory: StockHistory;
  bag: BagItem[];
  targetCash: number;
  todayProfit: number;
  todayProfitPercent: number;
  totalProfitPercent: number;
  onPageChange: (page: PageType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  cash,
  holdings,
  stockHistory,
  bag,
  targetCash,
  todayProfit,
  todayProfitPercent,
  totalProfitPercent,
  onPageChange
}) => {
  const totalAssets = calculateTotalAssets(cash, holdings, stockHistory);
  const marketValue = calculateMarketValue(holdings, stockHistory);
  const totalProfit = totalAssets - 10000;
  const targetProgress = Math.min((totalAssets / targetCash) * 100, 100);
  const totalItems = bag.reduce((sum, item) => sum + item.quantity, 0);

  const profitColor = (val: number) => val >= 0 ? '#3fb950' : '#f85149';

  const navItems = [
    { page: 'market' as const, icon: '📊', label: '市场行情' },
    { page: 'portfolio' as const, icon: '💼', label: '我的持仓', badge: holdings.length > 0 ? holdings.length : null },
    { page: 'news' as const, icon: '📰', label: '新闻资讯' },
    { page: 'shop' as const, icon: '🏪', label: '神秘商城' },
    { page: 'bag' as const, icon: '🎒', label: '我的背包', badge: totalItems > 0 ? totalItems : null }
  ];

  return (
    <div style={styles.container}>
      {/* 资产概览卡片 */}
      <div style={styles.assetCard}>
        <div style={styles.assetTitle}>总资产</div>
        <div style={styles.assetValue}>{formatCurrency(totalAssets)}</div>
        <div style={{
          ...styles.assetChange,
          color: profitColor(totalProfit)
        }}>
          {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
          ({formatPercent(totalProfitPercent)})
        </div>
      </div>

      {/* 收益统计卡片 */}
      <div style={styles.profitCard}>
        <div style={styles.profitRow}>
          <div style={styles.profitItem}>
            <div style={styles.profitLabel}>今日盈亏</div>
            <div style={{
              ...styles.profitValue,
              color: profitColor(todayProfit)
            }}>
              {todayProfit >= 0 ? '+' : ''}{formatCurrency(todayProfit)}
            </div>
            <div style={{
              ...styles.profitPercent,
              color: profitColor(todayProfitPercent)
            }}>
              {todayProfitPercent >= 0 ? '+' : ''}{formatPercent(todayProfitPercent)}
            </div>
          </div>
          <div style={styles.profitDivider} />
          <div style={styles.profitItem}>
            <div style={styles.profitLabel}>累计盈亏</div>
            <div style={{
              ...styles.profitValue,
              color: profitColor(totalProfit)
            }}>
              {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
            </div>
            <div style={{
              ...styles.profitPercent,
              color: profitColor(totalProfitPercent)
            }}>
              {totalProfitPercent >= 0 ? '+' : ''}{formatPercent(totalProfitPercent)}
            </div>
          </div>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav style={styles.nav}>
        <div style={styles.navSection}>
          <div style={styles.navSectionTitle}>交易</div>
          {navItems.map(item => (
            <button
              key={item.page}
              style={{
                ...styles.navItem,
                ...(currentPage === item.page ? styles.navItemActive : {})
              }}
              onClick={() => onPageChange(item.page)}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span style={styles.navLabel}>{item.label}</span>
              {item.badge !== null && (
                <span style={styles.navBadge}>{item.badge}</span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* 底部统计区 */}
      <div style={styles.bottomStats}>
        <div style={styles.statsGrid}>
          <div className="stat-box">
            <div className="stat-label">现金</div>
            <div className="stat-value">{formatCurrency(cash)}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">持仓市值</div>
            <div className="stat-value">{formatCurrency(marketValue)}</div>
          </div>
        </div>

        <div style={styles.targetSection}>
          <div style={styles.targetLabelRow}>
            <span style={styles.targetLabel}>目标进度</span>
            <span style={styles.targetPercent}>{targetProgress.toFixed(1)}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${targetProgress}%` }}
            />
          </div>
          <div style={styles.targetHint}>
            目标：{formatCurrency(targetCash)}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '280px',
    background: '#161b22',
    borderRight: '1px solid #30363d',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    height: 'calc(100vh - 56px)'
  },
  assetCard: {
    margin: '16px 16px 0 16px',
    padding: '18px',
    background: 'linear-gradient(135deg, rgba(240, 136, 62, 0.15), rgba(240, 136, 62, 0.05))',
    border: '1px solid rgba(240, 136, 62, 0.3)',
    borderRadius: '14px'
  },
  assetTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#8b949e',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '6px'
  },
  assetValue: {
    fontSize: '24px',
    fontWeight: 800,
    color: '#f0f6fc',
    marginBottom: '4px'
  },
  assetChange: {
    fontSize: '13px',
    fontWeight: 600
  },
  profitCard: {
    margin: '12px 16px 0 16px',
    padding: '14px 16px',
    background: '#21262d',
    border: '1px solid #30363d',
    borderRadius: '12px'
  },
  profitRow: {
    display: 'flex' as const,
    alignItems: 'center' as const
  },
  profitItem: {
    flex: 1,
    textAlign: 'center' as const
  },
  profitLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#8b949e',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '4px'
  },
  profitValue: {
    fontSize: '14px',
    fontWeight: 700
  },
  profitPercent: {
    fontSize: '11px',
    fontWeight: 600,
    marginTop: '2px'
  },
  profitDivider: {
    width: '1px',
    height: '40px',
    background: '#30363d'
  },
  nav: {
    flex: 1,
    padding: '0 12px',
    overflowY: 'auto' as const
  },
  navSection: {
    marginBottom: '16px',
    marginTop: '12px'
  },
  navSectionTitle: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#6e7681',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    padding: '8px 12px'
  },
  navItem: {
    width: '100%',
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '10px',
    padding: '12px 14px',
    background: 'transparent',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit'
  },
  navItemActive: {
    background: 'rgba(88, 166, 255, 0.1)',
    color: '#58a6ff'
  },
  navIcon: {
    fontSize: '16px'
  },
  navLabel: {
    flex: 1,
    fontSize: '14px',
    fontWeight: 500,
    color: '#f0f6fc',
    textAlign: 'left' as const
  },
  navBadge: {
    padding: '2px 8px',
    fontSize: '11px',
    fontWeight: 700,
    color: 'white',
    background: '#f85149',
    borderRadius: '10px'
  },
  bottomStats: {
    background: '#21262d',
    borderTop: '1px solid #30363d',
    padding: '16px'
  },
  statsGrid: {
    display: 'grid' as const,
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '16px'
  },
  targetSection: {},
  targetLabelRow: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: '8px'
  },
  targetLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#8b949e',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  },
  targetPercent: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#3fb950'
  },
  targetHint: {
    marginTop: '8px',
    fontSize: '11px',
    color: '#6e7681',
    textAlign: 'center' as const
  }
};
