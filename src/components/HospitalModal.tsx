import React from 'react';

interface HospitalModalProps {
  onRecover: () => void;
}

export const HospitalModal: React.FC<HospitalModalProps> = ({
  onRecover
}) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.icon}>🏥</div>
        <h2 style={styles.title}>可乐中毒！</h2>
        <p style={styles.description}>
          你喝了疯狂的可乐后感觉不适，被紧急送往医院洗胃。<br />
          住院一天，明天才能出院...
        </p>
        <div style={styles.hospitalNote}>
          <span style={styles.noteIcon}>💡</span>
          <span style={styles.noteText}>今日已跳过，股价正常变化中...</span>
        </div>
        <button
          style={styles.button}
          onClick={onRecover}
        >
          办理出院（进入明天）
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
    zIndex: 2000,
    padding: '16px',
    animation: 'fadeIn 0.2s ease'
  },
  modal: {
    width: '420px',
    maxWidth: '100%',
    background: 'linear-gradient(180deg, #1a1f26, #0d1117)',
    borderRadius: '20px',
    border: '2px solid #f85149',
    boxShadow: '0 24px 80px rgba(248, 81, 73, 0.2)',
    padding: '32px 28px',
    textAlign: 'center' as const,
    animation: 'scaleIn 0.3s ease'
  },
  icon: {
    fontSize: '72px',
    marginBottom: '16px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 800,
    color: '#f85149',
    margin: '0 0 12px 0'
  },
  description: {
    fontSize: '14px',
    color: '#8b949e',
    lineHeight: 1.8,
    margin: '0 0 20px 0'
  },
  hospitalNote: {
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
    color: '#58a6ff',
    fontWeight: 600
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #f0883e, #c96f2e)',
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
      boxShadow: '0 8px 24px rgba(240, 136, 62, 0.3)'
    }
  }
};
