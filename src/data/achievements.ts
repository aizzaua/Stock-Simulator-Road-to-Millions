import { Achievement, AchievementCheckStats } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  // ============ 基础成就 ============
  {
    id: 'first_game',
    name: '初出茅庐',
    description: '完成第一局游戏',
    icon: '🎮',
    hidden: false,
    type: 'play',
    check: (stats: AchievementCheckStats) => stats.totalGames >= 1
  },
  {
    id: 'games_3',
    name: '初步尝试',
    description: '完成3局游戏',
    icon: '🌱',
    hidden: false,
    type: 'play',
    check: (stats: AchievementCheckStats) => stats.totalGames >= 3
  },
  {
    id: 'games_5',
    name: '小有经验',
    description: '完成5局游戏',
    icon: '📊',
    hidden: false,
    type: 'play',
    check: (stats: AchievementCheckStats) => stats.totalGames >= 5
  },
  {
    id: 'games_10',
    name: '股市老兵',
    description: '完成10局游戏',
    icon: '🏆',
    hidden: false,
    type: 'play',
    check: (stats: AchievementCheckStats) => stats.totalGames >= 10
  },
  {
    id: 'games_15',
    name: '经验丰富',
    description: '完成15局游戏',
    icon: '📚',
    hidden: false,
    type: 'play',
    check: (stats: AchievementCheckStats) => stats.totalGames >= 15
  },
  {
    id: 'games_20',
    name: '资深玩家',
    description: '完成20局游戏',
    icon: '👑',
    hidden: false,
    type: 'play',
    check: (stats: AchievementCheckStats) => stats.totalGames >= 20
  },
  {
    id: 'first_win',
    name: '旗开得胜',
    description: '第一次通关',
    icon: '🎉',
    hidden: false,
    type: 'win',
    check: (stats: AchievementCheckStats) => stats.totalWins >= 1
  },
  {
    id: 'wins_3',
    name: '稳步前进',
    description: '通关3次',
    icon: '🎯',
    hidden: false,
    type: 'win',
    check: (stats: AchievementCheckStats) => stats.totalWins >= 3
  },
  {
    id: 'wins_5',
    name: '常胜将军',
    description: '通关5次',
    icon: '🏅',
    hidden: false,
    type: 'win',
    check: (stats: AchievementCheckStats) => stats.totalWins >= 5
  },
  {
    id: 'wins_8',
    name: '职业投资者',
    description: '通关8次',
    icon: '💼',
    hidden: false,
    type: 'win',
    check: (stats: AchievementCheckStats) => stats.totalWins >= 8
  },
  {
    id: 'wins_10',
    name: '投资大师',
    description: '通关10次',
    icon: '⭐',
    hidden: false,
    type: 'win',
    check: (stats: AchievementCheckStats) => stats.totalWins >= 10
  },
  {
    id: 'return_5',
    name: '小有收获',
    description: '百日收益率达到5%',
    icon: '📉',
    hidden: false,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.bestHundredDayReturn >= 5
  },
  {
    id: 'return_10',
    name: '稳健收益',
    description: '百日收益率达到10%',
    icon: '📈',
    hidden: false,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.bestHundredDayReturn >= 10
  },
  {
    id: 'return_30',
    name: '收益颇丰',
    description: '百日收益率达到30%',
    icon: '📊',
    hidden: false,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.bestHundredDayReturn >= 30
  },
  {
    id: 'return_50',
    name: '超额收益',
    description: '百日收益率达到50%',
    icon: '🚀',
    hidden: false,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.bestHundredDayReturn >= 50
  },
  {
    id: 'return_80',
    name: '收益显著',
    description: '百日收益率达到80%',
    icon: '📈',
    hidden: false,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.bestHundredDayReturn >= 80
  },
  {
    id: 'return_100',
    name: '翻倍达人',
    description: '百日收益率达到100%',
    icon: '💰',
    hidden: false,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.bestHundredDayReturn >= 100
  },
  {
    id: 'assets_200k',
    name: '初步积累',
    description: '累计总资产达到200万',
    icon: '💸',
    hidden: false,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.totalFinalAssets >= 2000000
  },
  {
    id: 'assets_500k',
    name: '小有所成',
    description: '累计总资产达到500万',
    icon: '💵',
    hidden: false,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.totalFinalAssets >= 5000000
  },
  {
    id: 'assets_800k',
    name: '财富积累',
    description: '累计总资产达到800万',
    icon: '💰',
    hidden: false,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.totalFinalAssets >= 8000000
  },
  {
    id: 'assets_1m',
    name: '百万富翁',
    description: '累计总资产达到1000万',
    icon: '💎',
    hidden: false,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.totalFinalAssets >= 10000000
  },
  {
    id: 'days_200',
    name: '快速上手',
    description: '200天内通关',
    icon: '🎯',
    hidden: false,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.shortestWinDays <= 200 && stats.shortestWinDays > 0
  },
  {
    id: 'days_150',
    name: '迅速通关',
    description: '150天内通关',
    icon: '⚡',
    hidden: false,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.shortestWinDays <= 150 && stats.shortestWinDays > 0
  },
  {
    id: 'days_120',
    name: '时间管理',
    description: '120天内通关',
    icon: '⏱️',
    hidden: false,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.shortestWinDays <= 120 && stats.shortestWinDays > 0
  },
  {
    id: 'days_100',
    name: '速通高手',
    description: '100天内通关',
    icon: '⚡',
    hidden: false,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.shortestWinDays <= 100 && stats.shortestWinDays > 0
  },
  {
    id: 'play_days_300',
    name: '坚持就是胜利',
    description: '累计游戏天数达到300天',
    icon: '📅',
    hidden: false,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.totalGameDays >= 300
  },
  {
    id: 'play_days_500',
    name: '持之以恒',
    description: '累计游戏天数达到500天',
    icon: '📅',
    hidden: false,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.totalGameDays >= 500
  },
  {
    id: 'play_days_800',
    name: '日积月累',
    description: '累计游戏天数达到800天',
    icon: '📊',
    hidden: false,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.totalGameDays >= 800
  },
  // ============ 隐藏成就 ============
  {
    id: 'wins_15',
    name: '股神',
    description: '通关15次',
    icon: '💎',
    hidden: true,
    type: 'win',
    check: (stats: AchievementCheckStats) => stats.totalWins >= 15
  },
  {
    id: 'wins_20',
    name: '传奇投资者',
    description: '通关20次',
    icon: '🌟',
    hidden: true,
    type: 'win',
    check: (stats: AchievementCheckStats) => stats.totalWins >= 20
  },
  {
    id: 'return_200',
    name: '收益神话',
    description: '百日收益率达到200%',
    icon: '🌈',
    hidden: true,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.bestHundredDayReturn >= 200
  },
  {
    id: 'return_300',
    name: '爆炸收益',
    description: '百日收益率达到300%',
    icon: '💥',
    hidden: true,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.bestHundredDayReturn >= 300
  },
  {
    id: 'return_500',
    name: '奇迹收益',
    description: '百日收益率达到500%',
    icon: '🎆',
    hidden: true,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.bestHundredDayReturn >= 500
  },
  {
    id: 'assets_2m',
    name: '千万富翁',
    description: '累计总资产达到2000万',
    icon: '👑',
    hidden: true,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.totalFinalAssets >= 20000000
  },
  {
    id: 'assets_5m',
    name: '亿万富翁',
    description: '累计总资产达到5000万',
    icon: '🤑',
    hidden: true,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.totalFinalAssets >= 50000000
  },
  {
    id: 'assets_10m',
    name: '顶级富豪',
    description: '累计总资产达到10000万',
    icon: '💎',
    hidden: true,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.totalFinalAssets >= 100000000
  },
  {
    id: 'days_50',
    name: '闪电通关',
    description: '50天内通关',
    icon: '✨',
    hidden: true,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.shortestWinDays <= 50 && stats.shortestWinDays > 0
  },
  {
    id: 'days_30',
    name: '风驰电掣',
    description: '30天内通关',
    icon: '💫',
    hidden: true,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.shortestWinDays <= 30 && stats.shortestWinDays > 0
  },
  {
    id: 'days_20',
    name: '极速通关',
    description: '20天内通关',
    icon: '⚡',
    hidden: true,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.shortestWinDays <= 20 && stats.shortestWinDays > 0
  },
  {
    id: 'days_15',
    name: '闪电达人',
    description: '15天内通关',
    icon: '🚀',
    hidden: true,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.shortestWinDays <= 15 && stats.shortestWinDays > 0
  },
  {
    id: 'days_10',
    name: '极限速通',
    description: '10天内通关',
    icon: '⏱️',
    hidden: true,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.shortestWinDays <= 10 && stats.shortestWinDays > 0
  },
  {
    id: 'play_days_1000',
    name: '坚持不懈',
    description: '累计游戏天数达到1000天',
    icon: '🎯',
    hidden: true,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.totalGameDays >= 1000
  },
  {
    id: 'play_days_2000',
    name: '岁月积累',
    description: '累计游戏天数达到2000天',
    icon: '📅',
    hidden: true,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.totalGameDays >= 2000
  },
  {
    id: 'play_days_3000',
    name: '长期主义',
    description: '累计游戏天数达到3000天',
    icon: '🎯',
    hidden: true,
    type: 'stat',
    check: (stats: AchievementCheckStats) => stats.totalGameDays >= 3000
  },
  {
    id: 'all_basic',
    name: '基础达人',
    description: '解锁所有基础成就',
    icon: '🏆',
    hidden: true,
    type: 'special'
  },
  {
    id: 'all_hidden',
    name: '终极收集者',
    description: '解锁所有隐藏成就',
    icon: '⭐',
    hidden: true,
    type: 'special'
  },
  {
    id: 'all_achievements',
    name: '完美收藏家',
    description: '解锁所有成就',
    icon: '🏆',
    hidden: true,
    type: 'special'
  }
];

export const BASIC_ACHIEVEMENTS = ACHIEVEMENTS.filter(a => !a.hidden);
export const HIDDEN_ACHIEVEMENTS = ACHIEVEMENTS.filter(a => a.hidden);
