import React from 'react';

interface BankruptcyAlertProps {
  onDismiss: () => void;
}

export const BankruptcyAlert: React.FC<BankruptcyAlertProps> = ({
  onDismiss
}) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.icon}>⚠️</div>
        <h2 style={styles.title}>资金警告！</h2>
        <p style={styles.description}>
          您现在已经满足<span style={styles.highlight}>破产条件</span>了！
        </p>
        <div style={styles.reasonBox}>
          <div style={styles.reasonTitle}>破产条件</div>
          <ul style={styles.reasonList}>
            <li style={styles.reasonItem}>✓ 没有任何持仓</li>
            <li style={styles.reasonItem}>✓ 背包里没有彩票</li>
            <li style={styles.reasonItem}>✓ 买不起任何股票</li>
          </ul>
        </div>
        <p style={styles.hint}>
          不过别担心！您可以去<span style={styles.highlight}>银行</span>申请<span style={styles.highlight}>零利率</span>破产贷款，
          最高可借 ¥10,000！
        </p>
        <p style={styles.warning}>
          注意：这是您<span style={styles.highlight}>第一次</span>触发破产，
          如果贷款后再次触发破产，将直接游戏结束！
        </p>
        <button
          className="btn btn-primary"
          style={styles.button}
          onClick={onDismiss}
        >
          我知道了，去银行
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
    background: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    zIndex: 2000,
    padding: '16px'
  },
  modal: {
    width: '480px',
    maxWidth: '90vw',
    background: 'linear-gradient(180deg, #21262d, #0d1117)',
    borderRadius: '20px',
    border: '2px solid rgba(240, 136, 62, 0.4)',
    boxShadow: '0 24px 80px rgba(240, 136, 62, 0.2)',
    padding: '32px',
    textAlign: 'center' as const
  },
  icon: {
    fontSize: '56px',
    marginBottom: '16px'
  },
  title: {
    fontSize: '22px',
    fontWeight: 800,
    color: '#f0883e',
    margin: '0 0 12px 0'
  },
  description: {
    fontSize: '15px',
    color: '#f0f6fc',
    margin: '0 0 20px 0',
    lineHeight: 1.6
  },
  reasonBox: {
    background: 'rgba(248, 81, 73, 0.1)',
    border: '1px solid rgba(248, 81, 73, 0.3)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '20px',
    textAlign: 'left' as const
  },
  reasonTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#f85149',
    marginBottom: '10px'
  },
  reasonList: {
    margin: 0,
    paddingLeft: '20px'
  },
  reasonItem: {
    fontSize: '13px',
    color: '#f0f6fc',
    lineHeight: 1.8
  },
  hint: {
    fontSize: '14px',
    color: '#8b949e',
    margin: '0 0 12px 0',
    lineHeight: 1.6
  },
  warning: {
    fontSize: '13px',
    color: '#f85149',
    margin: '0 0 24px 0',
    lineHeight: 1.6,
    padding: '12px',
    background: 'rgba(248, 81, 73, 0.1)',
    borderRadius: '10px'
  },
  highlight: {
    color: '#f0883e',
    fontWeight: 600
  },
  button: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 700
  }
};
