import React from 'react';
import { GamePhase } from '../types';

interface TopBarProps {
  date: string;
  day: number;
  totalDays: number;
  phase: GamePhase;
  onNext: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ date, day, totalDays, phase, onNext }) => {
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
        <button
          className="btn btn-primary"
          onClick={onNext}
          style={styles.nextButton}
        >
          ⏭️ 下一步
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
    gap: '12px'
  },
  nextButton: {
    gap: '8px'
  }
};
