import React, { useCallback, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { StartScreen } from './components/StartScreen';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { MarketPage } from './components/MarketPage';
import { PortfolioPage } from './components/PortfolioPage';
import { NewsPage } from './components/NewsPage';
import { ShopPage } from './components/ShopPage';
import { BagPage } from './components/BagPage';
import { TradeModal } from './components/TradeModal';
import { SettlementModal } from './components/SettlementModal';
import { Toast } from './components/Toast';

function App() {
  const {
    gameState,
    totalAssets,
    todayProfit,
    todayProfitPercent,
    totalProfitPercent,
    startGame,
    restartGame,
    setCurrentPage,
    selectStock,
    buyStock,
    sellStock,
    nextPhase,
    getHolding,
    getCurrentPrice,
    getChangePercent,
    getTotalChangePercent,
    buyItem,
    useCrazyCola,
    useLottery,
    constants
  } = useGameState();

  const [showTradeModal, setShowTradeModal] = React.useState(false);
  const [tradeStockCode, setTradeStockCode] = React.useState<string>('');
  const [tradeType, setTradeType] = React.useState<'buy' | 'sell'>('buy');

  const handleOpenTrade = useCallback((code: string, type: 'buy' | 'sell' = 'buy') => {
    setTradeStockCode(code);
    setTradeType(type);
    setShowTradeModal(true);
  }, []);

  const handleCloseTrade = useCallback(() => {
    setShowTradeModal(false);
  }, []);

  const handleTrade = useCallback((code: string, type: 'buy' | 'sell', quantity: number) => {
    if (type === 'buy') {
      return buyStock(code, quantity);
    } else {
      return sellStock(code, quantity);
    }
  }, [buyStock, sellStock]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameState.isStarted || gameState.isGameOver) return;
      if (showTradeModal) return;

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        nextPhase();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.isStarted, gameState.isGameOver, showTradeModal, nextPhase]);

  if (!gameState.isStarted) {
    return <StartScreen onStart={startGame} />;
  }

  return (
    <div style={styles.app}>
      <TopBar
        date={gameState.currentDate}
        day={gameState.currentDay}
        totalDays={constants.TOTAL_DAYS}
        phase={gameState.currentPhase}
        onNext={nextPhase}
      />

      <div style={styles.main}>
        <Sidebar
          currentPage={gameState.currentPage}
          cash={gameState.cash}
          holdings={gameState.holdings}
          stockHistory={gameState.stockHistory}
          bag={gameState.bag}
          targetCash={constants.TARGET_CASH}
          todayProfit={todayProfit}
          todayProfitPercent={todayProfitPercent}
          totalProfitPercent={totalProfitPercent}
          onPageChange={setCurrentPage}
        />

        <div style={styles.content}>
          {gameState.currentPage === 'market' && (
            <MarketPage
              selectedCode={gameState.selectedStockCode || ''}
              stockHistory={gameState.stockHistory}
              holdings={gameState.holdings}
              cash={gameState.cash}
              currentPhase={gameState.currentPhase}
              onSelect={selectStock}
              onOpenTrade={handleOpenTrade}
            />
          )}
          {gameState.currentPage === 'portfolio' && (
            <PortfolioPage
              holdings={gameState.holdings}
              stockHistory={gameState.stockHistory}
              onOpenTrade={handleOpenTrade}
            />
          )}
          {gameState.currentPage === 'news' && (
            <NewsPage
              newsList={gameState.newsList}
            />
          )}
          {gameState.currentPage === 'shop' && (
            <ShopPage
              cash={gameState.cash}
              currentPhase={gameState.currentPhase}
              onBuy={buyItem}
            />
          )}
          {gameState.currentPage === 'bag' && (
            <BagPage
              bag={gameState.bag}
              holdings={gameState.holdings}
              stockHistory={gameState.stockHistory}
              onUseCrazyCola={useCrazyCola}
              onUseLottery={useLottery}
            />
          )}
        </div>
      </div>

      {showTradeModal && tradeStockCode && (
        <TradeModal
          stockCode={tradeStockCode}
          initialType={tradeType}
          cash={gameState.cash}
          holdings={gameState.holdings}
          stockHistory={gameState.stockHistory}
          onClose={handleCloseTrade}
          onTrade={handleTrade}
        />
      )}

      {gameState.isGameOver && gameState.gameResult && (
        <SettlementModal
          isWin={gameState.gameResult === 'win'}
          finalAssets={totalAssets}
          days={gameState.currentDay}
          gameOverReason={gameState.gameOverReason}
          onRestart={restartGame}
        />
      )}

      <Toast toasts={gameState.toasts} />
    </div>
  );
}

const styles = {
  app: {
    height: '100vh',
    display: 'flex' as const,
    flexDirection: 'column' as const,
    background: '#0d1117',
    overflow: 'hidden',
    minWidth: '1200px'
  },
  main: {
    display: 'flex' as const,
    flex: 1,
    overflow: 'hidden'
  },
  content: {
    flex: 1,
    padding: '16px',
    overflow: 'hidden',
    minWidth: 0
  }
};

export default App;
