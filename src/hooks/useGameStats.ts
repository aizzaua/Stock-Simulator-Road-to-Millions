import { useState, useEffect, useCallback, useMemo } from 'react';
import { GameRecord, ExportData } from '../types';

const STORAGE_KEY = 'stock_simulator_game_records';

const loadRecords = (): GameRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
};

const saveRecords = (records: GameRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    console.warn('Failed to save records to localStorage');
  }
};

export const useGameStats = () => {
  const [records, setRecords] = useState<GameRecord[]>(() => loadRecords());

  useEffect(() => {
    saveRecords(records);
  }, [records]);

  const addRecord = useCallback((record: Omit<GameRecord, 'id' | 'startTime' | 'endTime'>) => {
    const newRecord: GameRecord = {
      ...record,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      startTime: Date.now(),
      endTime: Date.now(),
    };
    setRecords(prev => [newRecord, ...prev]);
  }, []);

  const clearRecords = useCallback(() => {
    setRecords([]);
  }, []);

  const replaceRecords = useCallback((newRecords: GameRecord[]) => {
    setRecords(newRecords);
  }, []);

  const stats = useMemo(() => {
    const totalGames = records.length;
    const wins = records.filter(r => r.isWin).length;
    const avgHundredDayReturn = totalGames > 0
      ? records.reduce((sum, r) => sum + r.hundredDayReturn, 0) / totalGames
      : 0;

    const bestReturn = totalGames > 0
      ? Math.max(...records.map(r => r.hundredDayReturn))
      : 0;

    const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;

    return { totalGames, wins, winRate, avgHundredDayReturn, bestReturn };
  }, [records]);

  const exportData = useCallback(() => {
    const data: ExportData = {
      version: '1.0',
      exportTime: new Date().toISOString(),
      records
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-simulator-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [records]);

  const importData = useCallback((file: File): Promise<GameRecord[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content) as ExportData;
          if (data.version && Array.isArray(data.records)) {
            resolve(data.records);
          } else {
            reject(new Error('无效的数据格式'));
          }
        } catch {
          reject(new Error('文件解析失败'));
        }
      };
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsText(file);
    });
  }, []);

  const mergeRecords = useCallback((importedRecords: GameRecord[]) => {
    setRecords(prev => {
      const existingIds = new Set(prev.map(r => r.id));
      const newRecords = importedRecords.filter(r => !existingIds.has(r.id));
      const merged = [...newRecords, ...prev];
      merged.sort((a, b) => b.endTime - a.endTime);
      return merged;
    });
  }, []);

  return {
    records,
    stats,
    addRecord,
    clearRecords,
    replaceRecords,
    exportData,
    importData,
    mergeRecords
  };
};
