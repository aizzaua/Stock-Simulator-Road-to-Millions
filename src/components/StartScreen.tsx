import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const rules = [
    { icon: '💵', text: '初始资金：¥10,000' },
    { icon: '🎯', text: '目标资金：¥1,000,000' },
    { icon: '⏰', text: '时间限制：3年（750个交易日）' },
    { icon: '📊', text: '开局已显示前2年历史数据' },
    { icon: '🔄', text: '点击侧边栏切换不同功能页面' },
    { icon: '⌨️', text: '按空格键或回车键快速推进时间' },
    { icon: '💸', text: '每次交易收取 0.1% 手续费' }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.titleArea}>
          <div style={styles.icon}>📈</div>
          <h1 style={styles.title}>股票模拟器</h1>
          <h2 style={styles.subtitle}>百万之路</h2>
        </div>

        <div style={styles.rulesCard}>
          <h3 style={styles.rulesTitle}>游戏规则</h3>
          <ul style={styles.rulesList}>
            {rules.map((rule, index) => (
              <li key={index} style={styles.ruleItem}>
                <span style={styles.ruleIcon}>{rule.icon}</span>
                <span style={styles.ruleText}>{rule.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <button style={styles.startButton} onClick={onStart}>
          开始游戏
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    background: 'linear-gradient(180deg, #0d1117 0%, #010409 100%)',
    padding: '24px'
  },
  content: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    gap: '32px',
    maxWidth: '500px',
    width: '100%'
  },
  titleArea: {
    textAlign: 'center' as const,
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    gap: '8px'
  },
  icon: {
    fontSize: '64px',
    marginBottom: '8px'
  },
  title: {
    fontSize: '36px',
    fontWeight: 800,
    color: '#f0883e',
    margin: 0,
    letterSpacing: '0.5px'
  },
  subtitle: {
    fontSize: '20px',
    fontWeight: 500,
    color: '#8b949e',
    margin: 0
  },
  rulesCard: {
    width: '100%',
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '20px',
    padding: '24px'
  },
  rulesTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#f0f6fc',
    margin: '0 0 16px 0'
  },
  rulesList: {
    listStyle: 'none',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    gap: '12px',
    margin: 0,
    padding: 0
  },
  ruleItem: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '12px'
  },
  ruleIcon: {
    fontSize: '18px',
    width: '28px',
    textAlign: 'center' as const
  },
  ruleText: {
    fontSize: '14px',
    color: '#f0f6fc',
    lineHeight: 1.5
  },
  startButton: {
    width: '100%',
    padding: '16px 32px',
    fontSize: '18px',
    fontWeight: 700,
    color: 'white',
    background: 'linear-gradient(135deg, #f0883e, #c96f2e)',
    border: 'none',
    borderRadius: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit'
  }
};
