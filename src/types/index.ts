export interface Stock {
  code: string;
  name: string;
  sector: StockSector;
  basePrice: number;
  volatility: number;
  trend: number;
  colorStart: string;
  colorEnd: string;
  peRatio: number;
  dividendYield: number;
}

export interface KLineData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockHistory {
  [code: string]: KLineData[];
}

export interface Holding {
  code: string;
  quantity: number;
  avgCost: number;
  purchaseDay: number;
}

export interface News {
  id: string;
  date: string;
  type: 'good' | 'bad' | 'neutral';
  title: string;
  content: string;
  relatedStock?: string;
  impact: number;
}

export type StockSector = 'tech' | 'consumer' | 'entertainment';
export type GamePhase = 'opening' | 'lunch' | 'closing';
export type PageType = 'market' | 'portfolio' | 'news' | 'shop' | 'bag' | 'bank' | 'profile' | 'settings';

export interface GameRecord {
  id: string;
  startTime: number;
  endTime: number;
  isWin: boolean;
  gameOverReason?: 'timeout' | 'poison' | 'bankruptcy' | null;
  days: number;
  finalAssets: number;
  totalProfitPercent: number;
  hundredDayReturn: number;
}

export interface ExportData {
  version: string;
  exportTime: string;
  records: GameRecord[];
  achievements: AchievementState[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  hidden: boolean;
  type: 'win' | 'stat' | 'play' | 'special';
  check?: (stats: AchievementCheckStats) => boolean;
}

export interface AchievementState {
  id: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface AchievementCheckStats {
  totalGames: number;
  totalWins: number;
  bestHundredDayReturn: number;
  bestFinalAssets: number;
  shortestWinDays: number;
  totalPlayDays: number;
  totalFinalAssets: number;
  totalGameDays: number;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  color: string;
}

export interface BagItem extends Item {
  quantity: number;
}

export interface Loan {
  amount: number;
  dueDay: number;
  borrowedDay: number;
}

export interface BlackSwanEvent {
  stockCode: string;
  stockName: string;
  impact: number; // +0.15 or -0.15
  day: number;
  phase: GamePhase;
}

export interface GameState {
  isStarted: boolean;
  isGameOver: boolean;
  gameResult: 'win' | 'lose' | null;
  gameOverReason?: 'timeout' | 'poison' | 'bankruptcy' | null;
  currentDay: number;
  currentPhase: GamePhase;
  currentDate: string;
  cash: number;
  holdings: Holding[];
  stockHistory: StockHistory;
  newsList: News[];
  currentPage: PageType;
  selectedStockCode: string | null;
  toasts: ToastMessage[];
  dailyImpact: { [code: string]: number };
  bag: BagItem[];
  loan: Loan | null;
  hasAppliedLoan: boolean;
  hasTriggeredBankruptcy: boolean;
  showBankruptcyAlert: boolean;
  blackSwanEvent: BlackSwanEvent | null;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface TransactionType {
  type: 'buy' | 'sell';
}

export interface LotteryPrize {
  multiplier: number;
  name: string;
  probability: number;
}

export interface LotteryResult {
  prize: LotteryPrize;
  amount: number;
  isJackpot: boolean;
}
