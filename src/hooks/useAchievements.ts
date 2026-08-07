import { useState, useEffect, useCallback } from 'react';
import { AchievementState, Achievement, AchievementCheckStats, GameRecord } from '../types';
import { ACHIEVEMENTS, BASIC_ACHIEVEMENTS, HIDDEN_ACHIEVEMENTS } from '../data/achievements';

const STORAGE_KEY = 'stock_simulator_achievements';

export interface AchievementExportData {
  version: string;
  exportTime: string;
  records: GameRecord[];
  achievements: AchievementState[];
}

const loadAchievements = (): AchievementState[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return ACHIEVEMENTS.map(a => ({ id: a.id, unlocked: false }));
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      const existingIds = new Set(parsed.map((p: any) => p.id));
      const existing = parsed.filter((p: any) => ACHIEVEMENTS.some(a => a.id === p.id));
      const missing = ACHIEVEMENTS.filter(a => !existingIds.has(a.id)).map(a => ({ id: a.id, unlocked: false }));
      return [...existing, ...missing];
    }
    return ACHIEVEMENTS.map(a => ({ id: a.id, unlocked: false }));
  } catch {
    return ACHIEVEMENTS.map(a => ({ id: a.id, unlocked: false }));
  }
};

const saveAchievements = (achievements: AchievementState[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
  } catch {
    console.warn('Failed to save achievements');
  }
};

const calculateStats = (records: GameRecord[]): AchievementCheckStats => {
  const winRecords = records.filter(r => r.isWin);
  return {
    totalGames: records.length,
    totalWins: winRecords.length,
    bestHundredDayReturn: records.length > 0
      ? Math.max(...records.map(r => r.hundredDayReturn))
      : 0,
    bestFinalAssets: records.length > 0
      ? Math.max(...records.map(r => r.finalAssets))
      : 0,
    shortestWinDays: winRecords.length > 0
      ? Math.min(...winRecords.map(r => r.days))
      : 0,
    totalPlayDays: records.reduce((sum, r) => sum + r.days, 0),
    totalFinalAssets: records.reduce((sum, r) => sum + r.finalAssets, 0),
    totalGameDays: records.reduce((sum, r) => sum + r.days, 0)
  };
};

export const useAchievements = (records: GameRecord[]) => {
  const [states, setStates] = useState<AchievementState[]>(() => loadAchievements());
  const [newUnlocks, setNewUnlocks] = useState<string[]>([]);

  const stats = calculateStats(records);

  const getState = useCallback((achievementId: string): AchievementState | undefined => {
    return states.find(s => s.id === achievementId);
  }, [states]);

  const isUnlocked = useCallback((achievementId: string): boolean => {
    return getState(achievementId)?.unlocked ?? false;
  }, [getState]);

  const checkAchievements = useCallback(() => {
    const newUnlocked: string[] = [];
    const newStates = states.map(state => {
      if (state.unlocked) return state;

      const achievement = ACHIEVEMENTS.find(a => a.id === state.id);
      if (!achievement) return state;

      if (achievement.id === 'all_basic') {
        const allBasicUnlocked = BASIC_ACHIEVEMENTS.filter(a => a.id !== 'all_basic')
          .every(a => isUnlocked(a.id));
        if (allBasicUnlocked) {
          newUnlocked.push(achievement.id);
          return { id: state.id, unlocked: true, unlockedAt: Date.now() };
        }
        return state;
      }

      if (achievement.id === 'all_hidden') {
        const allHiddenUnlocked = HIDDEN_ACHIEVEMENTS.filter(a => a.id !== 'all_hidden' && a.id !== 'all_achievements')
          .every(a => isUnlocked(a.id));
        if (allHiddenUnlocked) {
          newUnlocked.push(achievement.id);
          return { id: state.id, unlocked: true, unlockedAt: Date.now() };
        }
        return state;
      }

      if (achievement.id === 'all_achievements') {
        const allNonSpecialUnlocked = ACHIEVEMENTS.filter(a => a.id !== 'all_basic' && a.id !== 'all_hidden' && a.id !== 'all_achievements')
          .every(a => isUnlocked(a.id));
        if (allNonSpecialUnlocked) {
          newUnlocked.push(achievement.id);
          return { id: state.id, unlocked: true, unlockedAt: Date.now() };
        }
        return state;
      }

      if (achievement.check && achievement.check(stats)) {
        newUnlocked.push(achievement.id);
        return { id: state.id, unlocked: true, unlockedAt: Date.now() };
      }

      return state;
    });

    if (newUnlocked.length > 0) {
      setStates(newStates);
      setNewUnlocks(newUnlocked);
      setTimeout(() => setNewUnlocks([]), 3000);
    }
  }, [states, stats, isUnlocked]);

  const resetAchievements = useCallback(() => {
    const resetStates = ACHIEVEMENTS.map(a => ({ id: a.id, unlocked: false }));
    setStates(resetStates);
  }, []);

  const clearNewUnlocks = useCallback(() => {
    setNewUnlocks([]);
  }, []);

  useEffect(() => {
    saveAchievements(states);
  }, [states]);

  useEffect(() => {
    checkAchievements();
  }, [records.length]);

  const unlockedBasic = BASIC_ACHIEVEMENTS.filter(a => isUnlocked(a.id)).length;
  const totalBasic = BASIC_ACHIEVEMENTS.length;
  const unlockedHidden = HIDDEN_ACHIEVEMENTS.filter(a => isUnlocked(a.id)).length;
  const totalHidden = HIDDEN_ACHIEVEMENTS.length;

  return {
    states,
    achievements: ACHIEVEMENTS,
    basicAchievements: BASIC_ACHIEVEMENTS,
    hiddenAchievements: HIDDEN_ACHIEVEMENTS,
    stats,
    getState,
    isUnlocked,
    checkAchievements,
    resetAchievements,
    newUnlocks,
    clearNewUnlocks,
    unlockedBasic,
    totalBasic,
    unlockedHidden,
    totalHidden
  };
};
