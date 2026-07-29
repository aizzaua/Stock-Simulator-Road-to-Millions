import React, { useState } from 'react';
import { Loan } from '../types';
import { formatCurrency } from '../utils/format';

interface BankPageProps {
  cash: number;
  loan: Loan | null;
  hasAppliedLoan: boolean;
  currentDay: number;
  onApplyLoan: (amount: number) => boolean;
  onRepayLoan: () => boolean;
}

export const BankPage: React.FC<BankPageProps> = ({
  cash,
  loan,
  hasAppliedLoan,
  currentDay,
  onApplyLoan,
  onRepayLoan
}) => {
  const [loanAmount, setLoanAmount] = useState(10000);

  const daysRemaining = loan ? loan.dueDay - currentDay : 0;
  const canRepay = loan && cash >= loan.amount;

  const handleApply = () => {
    onApplyLoan(loanAmount);
  };

  const handleRepay = () => {
    onRepayLoan();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerIcon}>🏦</div>
        <div style={styles.headerTitle}>股票模拟银行</div>
        <div style={styles.headerSubtitle}>您的财富伙伴，为您保驾护航</div>
      </div>

      <div style={styles.content}>
        {/* 银行欢迎卡片 */}
        <div style={styles.welcomeCard}>
          <div style={styles.welcomeTitle}>欢迎光临！</div>
          <div style={styles.welcomeDesc}>
            本行提供<span style={styles.highlight}>零利率</span>破产贷款服务，助您度过难关！
          </div>
        </div>

        <div style={styles.grid}>
          {/* 当前状态卡片 */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>您的账户状态</div>
            <div style={styles.statusRow}>
              <span style={styles.statusLabel}>当前现金</span>
              <span style={styles.statusValue}>{formatCurrency(cash)}</span>
            </div>
            <div style={styles.statusRow}>
              <span style={styles.statusLabel}>贷款资格</span>
              <span style={{
                ...styles.statusValue,
                color: !hasAppliedLoan ? '#3fb950' : '#f85149'
              }}>
                {!hasAppliedLoan ? '✓ 可申请' : '✗ 已使用'}
              </span>
            </div>
            {loan && (
              <div style={styles.statusRow}>
                <span style={styles.statusLabel}>贷款状态</span>
                <span style={{ ...styles.statusValue, color: '#f0883e' }}>
                  还款中
                </span>
              </div>
            )}
          </div>

          {/* 贷款信息卡片 */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>产品信息</div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>产品名称</span>
              <span style={styles.infoValue}>破产扶持贷款</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>最高额度</span>
              <span style={styles.infoValue}>¥10,000</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>利率</span>
              <span style={styles.infoValue}>0%（零利率）</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>期限</span>
              <span style={styles.infoValue}>100天</span>
            </div>
          </div>
        </div>

        {/* 贷款操作区 */}
        {!loan ? (
          <div style={styles.actionCard}>
            <div style={styles.actionTitle}>申请贷款</div>
            <div style={styles.actionDesc}>
              一局游戏只能申请一次，请合理规划资金用途
            </div>
            <div style={styles.inputSection}>
              <label style={styles.inputLabel}>贷款金额</label>
              <input
                type="range"
                min="1000"
                max="10000"
                step="1000"
                value={loanAmount}
                disabled={hasAppliedLoan}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                style={styles.slider}
              />
              <div style={styles.amountDisplay}>
                ¥{loanAmount.toLocaleString()}
              </div>
              <div style={styles.amountHint}>
                可滑动选择，最低 ¥1,000，最高 ¥10,000
              </div>
            </div>
            <button
              className="btn btn-primary"
              style={styles.applyButton}
              disabled={hasAppliedLoan}
              onClick={handleApply}
            >
              {hasAppliedLoan ? '已申请过贷款' : '确认申请'}
            </button>
            {hasAppliedLoan && (
              <div style={styles.disabledHint}>
                每局游戏只能申请一次贷款哦
              </div>
            )}
          </div>
        ) : (
          <div style={{ ...styles.actionCard, ...styles.repayCard }}>
            <div style={styles.actionTitle}>偿还贷款</div>
            <div style={styles.loanInfo}>
              <div style={styles.loanInfoRow}>
                <span style={styles.loanInfoLabel}>借款金额</span>
                <span style={styles.loanInfoValue}>{formatCurrency(loan.amount)}</span>
              </div>
              <div style={styles.loanInfoRow}>
                <span style={styles.loanInfoLabel}>借款日期</span>
                <span style={styles.loanInfoValue}>第 {loan.borrowedDay} 天</span>
              </div>
              <div style={styles.loanInfoRow}>
                <span style={styles.loanInfoLabel}>到期日期</span>
                <span style={styles.loanInfoValue}>第 {loan.dueDay} 天</span>
              </div>
              <div style={styles.loanInfoRow}>
                <span style={styles.loanInfoLabel}>剩余期限</span>
                <span style={{
                  ...styles.loanInfoValue,
                  color: daysRemaining <= 30 ? '#f85149' : '#3fb950'
                }}>
                  {daysRemaining} 天
                  {daysRemaining <= 30 && ' ⚠️'}
                </span>
              </div>
              <div style={styles.loanInfoRow}>
                <span style={styles.loanInfoLabel}>待还金额</span>
                <span style={styles.loanInfoValue}>{formatCurrency(loan.amount)}</span>
              </div>
            </div>
            <div style={styles.repayWarning}>
              <span style={styles.warningIcon}>⚠️</span>
              <span style={styles.warningText}>
                请务必在到期日前还清贷款，否则将直接宣告破产！
              </span>
            </div>
            <button
              className="btn btn-primary"
              style={{
                ...styles.repayButton,
                ...(!canRepay ? styles.repayButtonDisabled : {})
              }}
              disabled={!canRepay}
              onClick={handleRepay}
            >
              {canRepay ? '立即还款' : '现金不足'}
            </button>
            {!canRepay && (
              <div style={styles.disabledHint}>
                需要 {formatCurrency(loan.amount)} 才能还款，当前现金 {formatCurrency(cash)}
              </div>
            )}
          </div>
        )}

        {/* 使用说明 */}
        <div style={styles.infoCard}>
          <div style={styles.infoCardTitle}>📋 贷款须知</div>
          <ul style={styles.infoList}>
            <li style={styles.infoListItem}>本贷款为<span style={styles.highlight}>零利率</span>福利贷款，不需要支付利息</li>
            <li style={styles.infoListItem}>贷款必须在<span style={styles.highlight}>100天内</span>还清，到期未还将宣告破产</li>
            <li style={styles.infoListItem}>每局游戏<span style={styles.highlight}>只能申请一次</span>贷款，请谨慎决定</li>
            <li style={styles.infoListItem}>贷款后，可随时在本页面进行还款操作</li>
            <li style={styles.infoListItem}>破产条件：没有持仓 + 没有彩票 + 买不起任何股票</li>
          </ul>
        </div>
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
    background: 'linear-gradient(135deg, rgba(63, 185, 80, 0.2), rgba(88, 166, 255, 0.15))',
    border: '1px solid rgba(63, 185, 80, 0.3)',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center' as const,
    marginBottom: '20px'
  },
  headerIcon: {
    fontSize: '48px',
    marginBottom: '12px'
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: 800,
    color: '#f0f6fc',
    marginBottom: '6px'
  },
  headerSubtitle: {
    fontSize: '14px',
    color: '#8b949e'
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  welcomeCard: {
    background: '#21262d',
    border: '1px solid #30363d',
    borderRadius: '14px',
    padding: '20px',
    marginBottom: '20px',
    textAlign: 'center' as const
  },
  welcomeTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#f0f6fc',
    marginBottom: '8px'
  },
  welcomeDesc: {
    fontSize: '14px',
    color: '#8b949e'
  },
  grid: {
    display: 'grid' as const,
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '20px'
  },
  card: {
    background: '#21262d',
    border: '1px solid #30363d',
    borderRadius: '14px',
    padding: '20px'
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#f0f6fc',
    marginBottom: '16px'
  },
  statusRow: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: '10px 0',
    borderBottom: '1px solid #30363d'
  },
  statusLabel: {
    fontSize: '14px',
    color: '#8b949e'
  },
  statusValue: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#f0f6fc'
  },
  infoRow: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: '10px 0',
    borderBottom: '1px solid #30363d'
  },
  infoLabel: {
    fontSize: '14px',
    color: '#8b949e'
  },
  infoValue: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#f0f6fc'
  },
  actionCard: {
    background: '#21262d',
    border: '1px solid #30363d',
    borderRadius: '14px',
    padding: '24px',
    marginBottom: '20px'
  },
  repayCard: {
    borderColor: 'rgba(240, 136, 62, 0.4)',
    background: 'linear-gradient(180deg, rgba(240, 136, 62, 0.1), #21262d)'
  },
  actionTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#f0f6fc',
    marginBottom: '8px'
  },
  actionDesc: {
    fontSize: '14px',
    color: '#8b949e',
    marginBottom: '20px'
  },
  inputSection: {
    marginBottom: '20px'
  },
  inputLabel: {
    display: 'block' as const,
    fontSize: '14px',
    fontWeight: 600,
    color: '#f0f6fc',
    marginBottom: '12px'
  },
  slider: {
    width: '100%',
    height: '8px',
    borderRadius: '4px',
    background: '#30363d',
    outline: 'none',
    cursor: 'pointer',
    marginBottom: '12px',
    WebkitAppearance: 'none' as const
  },
  amountDisplay: {
    fontSize: '28px',
    fontWeight: 800,
    color: '#3fb950',
    textAlign: 'center' as const,
    marginBottom: '8px'
  },
  amountHint: {
    fontSize: '12px',
    color: '#6e7681',
    textAlign: 'center' as const
  },
  applyButton: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 700
  },
  disabledHint: {
    marginTop: '12px',
    fontSize: '13px',
    color: '#f85149',
    textAlign: 'center' as const
  },
  loanInfo: {
    background: '#0d1117',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px'
  },
  loanInfoRow: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: '8px 0'
  },
  loanInfoLabel: {
    fontSize: '14px',
    color: '#8b949e'
  },
  loanInfoValue: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#f0f6fc'
  },
  repayWarning: {
    display: 'flex' as const,
    alignItems: 'center' as const,
    gap: '8px',
    padding: '12px 16px',
    background: 'rgba(248, 81, 73, 0.1)',
    border: '1px solid rgba(248, 81, 73, 0.3)',
    borderRadius: '10px',
    marginBottom: '16px'
  },
  warningIcon: {
    fontSize: '18px'
  },
  warningText: {
    fontSize: '13px',
    color: '#f85149',
    fontWeight: 500
  },
  repayButton: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 700
  },
  repayButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed' as const
  },
  infoCard: {
    background: '#21262d',
    border: '1px solid #30363d',
    borderRadius: '14px',
    padding: '20px'
  },
  infoCardTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#f0f6fc',
    marginBottom: '16px'
  },
  infoList: {
    margin: 0,
    paddingLeft: '20px'
  },
  infoListItem: {
    fontSize: '14px',
    color: '#8b949e',
    lineHeight: 1.8,
    marginBottom: '8px'
  },
  highlight: {
    color: '#f0883e',
    fontWeight: 600
  }
};
