import React, { useRef, useState } from 'react';
import { GameRecord, ExportData } from '../types';

interface SettingsPageProps {
  records: GameRecord[];
  onExport: () => void;
  onImport: (file: File) => Promise<void>;
  onClear: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  records,
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerIcon}>⚙️</div>
        <div>
          <div style={styles.title}>设置</div>
          <div style={styles.subtitle}>数据管理与游戏设置</div>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>📊 数据管理</div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.cardTitle}>游戏记录</div>
            <div style={styles.recordCount}>共 {records.length} 条记录</div>
          </div>

          <div style={styles.actionRow}>
            <button
              className="btn btn-secondary"
              style={styles.actionBtn}
              onClick={onExport}
            >
              <span style={styles.btnIcon}>📤</span>
              <span>导出数据</span>
            </button>
            <button
              className="btn btn-secondary"
              style={styles.actionBtn}
              onClick={handleImportClick}
            >
              <span style={styles.btnIcon}>📥</span>
              <span>导入数据</span>
            </button>
            <button
              className="btn btn-secondary"
              style={{
                ...styles.actionBtn,
                ...(showClearConfirm ? styles.dangerBtn : {})
              }}
              onClick={handleClear}
            >
              <span style={styles.btnIcon}>🗑️</span>
              <span>{showClearConfirm ? '确认清除' : '清除数据'}</span>
            </button>
          </div>

          <div style={styles.hint}>
            <div style={styles.hintIcon}>💡</div>
            <div style={styles.hintText}>
              导出功能会保存所有游戏记录为JSON文件，可在其他设备上导入恢复
            </div>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>🎮 关于</div>

        <div style={styles.card}>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>游戏名称</span>
            <span style={styles.infoValue}>股票模拟器：百万之路</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>版本</span>
            <span style={styles.infoValue}>v3.2</span>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};

const styles = {
  container: {
    height: '100%',
    overflowY: 'auto' as const,
    padding: '8px',
    maxWidth: '700px',
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
  headerIcon: {
    fontSize: '40px'
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
  section: {
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#f0f6fc',
    marginBottom: '12px'
  },
  card: {
    background: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '16px',
    padding: '20px'
  },
  cardHeader: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: '16px'
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#f0f6fc'
  },
  recordCount: {
    fontSize: '13px',
    color: '#8b949e'
  },
  actionRow: {
    display: 'grid' as const,
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '16px'
  },
  actionBtn: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    gap: '6px',
    padding: '14px 12px',
    fontSize: '13px',
    fontWeight: 600
  },
  btnIcon: {
    fontSize: '20px'
  },
  dangerBtn: {
    background: 'rgba(248, 81, 73, 0.1)',
    borderColor: '#f85149',
    color: '#f85149'
  },
  hint: {
    display: 'flex' as const,
    alignItems: 'flex-start' as const,
    gap: '10px',
    padding: '12px 16px',
    background: '#21262d',
    borderRadius: '12px'
  },
  hintIcon: {
    fontSize: '18px'
  },
  hintText: {
    fontSize: '12px',
    color: '#8b949e',
    lineHeight: '1.6'
  },
  infoRow: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: '12px 0',
    borderBottom: '1px solid #30363d',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  infoLabel: {
    fontSize: '13px',
    color: '#8b949e'
  },
  infoValue: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#f0f6fc'
  }
};
