import React from 'react';
import { GamePhase, PageType } from '../types';

interface TopBarProps {
  date: string;
  day: number;
  totalDays: number;
  phase: GamePhase;
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  onNext?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  date,
  day,
  totalDays,
  phase,
  currentPage,
  onPageChange,
  onNext
}) => {
  const getPhaseText = (p: GamePhase) => {
    switch (p) {
      case 'opening':
      case 'closing':
        return { text: '交易中', class: 'trading' };
      case 'lunch':
        return { text: '午间休市', class: 'lunch' };
    }
  };

  const phaseInfo = getPhaseText(phase);

  const handleProfileClick = () => {
    if (currentPage === 'profile') {
      onPageChange('market');
    } else {
      onPageChange('profile');
    }
  };

  const handleSettingsClick = () => {
    if (currentPage === 'settings') {
      onPageChange('market');
    } else {
      onPageChange('settings');
    }
  };

  const isProfileActive = currentPage === 'profile';
  const isSettingsActive = currentPage === 'settings';

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <div style={styles.title}>📈 股票模拟器</div>
        <div style={styles.date}>{date} (第{day}/{totalDays}天)</div>
        <span className={`phase-tag ${phaseInfo.class}`}>
          {phaseInfo.text}
        </span>
      </div>
      <div style={styles.right}>
        {onNext && (
          <button
            className="btn btn-primary"
            onClick={onNext}
            style={styles.nextButton}
          >
            ⏭️ 下一步
          </button>
        )}
        <button
          className="btn"
          style={{
            ...styles.iconButton,
            ...(isProfileActive ? styles.iconButtonActive : {})
          }}
          onClick={handleProfileClick}
          title="个人统计"
        >
          📊
        </button>
        <button
          className="btn"
          style={{
            ...styles.iconButton,
            ...(isSettingsActive ? styles.iconButtonActive : {})
          }}
          onClick={handleSettingsClick}
          title="设置"
        >
          ⚙️
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '56px',
    background: 'linear-gradient(90deg, #161b22, #0d1117)',
    borderBottom: '1px solid #30363d',
    padding: '0 24px',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const
  },
  left: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '16px'
  },
  title: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#f0883e',
    letterSpacing: '0.5px'
  },
  date: {
    fontSize: '13px',
    color: '#8b949e'
  },
  right: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '10px'
  },
  nextButton: {
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: 700
  },
  iconButton: {
    width: '40px',
    height: '40px',
    padding: 0,
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    fontSize: '18px',
    borderRadius: '10px',
    background: 'transparent',
    border: '1px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit'
  },
  iconButtonActive: {
    background: 'rgba(88, 166, 255, 0.15)',
    borderColor: '#58a6ff'
  }
};
