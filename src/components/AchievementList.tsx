import React from 'react';
import { Achievement, AchievementState } from '../types';
import { BASIC_ACHIEVEMENTS, HIDDEN_ACHIEVEMENTS } from '../data/achievements';

interface AchievementListProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  states: AchievementState[];
  newUnlocks: string[];
}

export const AchievementList: React.FC<AchievementListProps> = ({
  isOpen,
  onClose,
  achievements,
  states,
  newUnlocks
}) => {
  if (!isOpen) return null;

  const getState = (id: string) => states.find(s => s.id === id);
  const isUnlocked = (id: string) => getState(id)?.unlocked ?? false;
  const isNew = (id: string) => newUnlocks.includes(id);

  const visibleAchievements = [
    ...BASIC_ACHIEVEMENTS,
    ...HIDDEN_ACHIEVEMENTS.filter(a => isUnlocked(a.id))
  ];

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.headerIcon}>🏆</div>
            <div>
              <div style={styles.title}>成就</div>
              <div style={styles.subtitle}>收集所有成就！</div>
            </div>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={styles.list}>
          {visibleAchievements.map(achievement => {
            const unlocked = isUnlocked(achievement.id);
            const isNewUnlock = isNew(achievement.id);

            return (
              <div
                key={achievement.id}
                style={{
                  ...styles.item,
                  ...(!unlocked ? styles.itemLocked : {}),
                  ...(isNewUnlock ? styles.itemNew : {})
                }}
              >
                <div style={{
                  ...styles.icon,
                  ...(!unlocked ? styles.iconLocked : {})
                }}>
                  {unlocked ? achievement.icon : '❓'}
                </div>
                <div style={styles.info}>
                  <div style={styles.name}>
                    {unlocked ? achievement.name : (achievement.hidden ? '???' : achievement.name)}
                    {isNewUnlock && <span style={styles.newBadge}>新!</span>}
                  </div>
                  <div style={styles.description}>
                    {unlocked ? achievement.description : (achievement.hidden ? '隐藏成就，继续探索吧' : achievement.description)}
                  </div>
                </div>
                {unlocked && <div style={styles.unlockedBadge}>✓</div>}
              </div>
            );
          })}

          {visibleAchievements.length === 0 && (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>🎯</div>
              <div style={styles.emptyText}>暂无成就</div>
              <div style={styles.emptyHint}>开始游戏解锁成就吧！</div>
            </div>
          )}
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
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(6px)',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    zIndex: 2000,
    padding: '16px'
  },
  modal: {
    width: '500px',
    maxWidth: '90vw',
    maxHeight: '80vh',
    background: 'linear-gradient(180deg, #1a1f26, #0d1117)',
    borderRadius: '20px',
    border: '2px solid #30363d',
    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.6)',
    display: 'flex' as const,
    flexDirection: 'column' as const
  },
  header: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: '20px 24px',
    borderBottom: '1px solid #30363d',
    background: '#161b22',
    borderRadius: '18px 18px 0 0'
  },
  headerLeft: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '14px'
  },
  headerIcon: {
    fontSize: '32px'
  },
  title: {
    fontSize: '20px',
    fontWeight: 800,
    color: '#f0f6fc',
    marginBottom: '2px'
  },
  subtitle: {
    fontSize: '12px',
    color: '#8b949e'
  },
  closeBtn: {
    width: '36px',
    height: '36px',
    border: 'none',
    background: '#21262d',
    color: '#8b949e',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: '#30363d',
      color: '#f0f6fc'
    }
  },
  list: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '12px'
  },
  item: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '14px',
    padding: '14px 16px',
    marginBottom: '8px',
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    animation: 'pulse 0.5s ease'
  },
  itemLocked: {
    opacity: 0.6,
    filter: 'grayscale(0.5)'
  },
  itemNew: {
    borderColor: '#f0883e',
    boxShadow: '0 0 16px rgba(240, 136, 62, 0.3)'
  },
  icon: {
    width: '48px',
    height: '48px',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    fontSize: '28px',
    background: 'linear-gradient(135deg, rgba(88, 166, 255, 0.2), rgba(88, 166, 255, 0.05))',
    border: '1px solid rgba(88, 166, 255, 0.3)',
    borderRadius: '12px',
    flexShrink: 0 as const
  },
  iconLocked: {
    background: '#21262d',
    borderColor: '#30363d'
  },
  info: {
    flex: 1,
    minWidth: 0
  },
  name: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#f0f6fc',
    marginBottom: '3px',
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '8px'
  },
  newBadge: {
    fontSize: '10px',
    fontWeight: 700,
    color: '#f0883e',
    background: 'rgba(240, 136, 62, 0.15)',
    padding: '2px 8px',
    borderRadius: '8px',
    textTransform: 'uppercase' as const
  },
  description: {
    fontSize: '12px',
    color: '#8b949e',
    lineHeight: '1.4'
  },
  unlockedBadge: {
    color: '#3fb950',
    fontSize: '20px',
    fontWeight: 800
  },
  empty: {
    textAlign: 'center' as const,
    padding: '60px 20px'
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  emptyText: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#f0f6fc',
    marginBottom: '8px'
  },
  emptyHint: {
    fontSize: '13px',
    color: '#8b949e'
  }
};
