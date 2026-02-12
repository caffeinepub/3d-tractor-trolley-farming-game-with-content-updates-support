import { useEffect, useState } from 'react';
import { useGameConfig } from './game/config/useGameConfig';
import StartScreen from './game/screens/StartScreen';
import GameScreen from './game/screens/GameScreen';
import GameOverScreen from './game/screens/GameOverScreen';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes';

type GameState = 'start' | 'playing' | 'gameover';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [failureReason, setFailureReason] = useState<string>('');
  const { refetch } = useGameConfig();

  useEffect(() => {
    // Load config on startup
    refetch();
  }, [refetch]);

  const handleStartGame = () => {
    setGameState('playing');
    setScore(0);
    setFailureReason('');
  };

  const handleGameOver = (finalScore: number, reason: string) => {
    setScore(finalScore);
    setFailureReason(reason);
    setGameState('gameover');
  };

  const handleRestart = () => {
    setGameState('start');
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="w-full h-screen overflow-hidden bg-background">
        {gameState === 'start' && <StartScreen onStart={handleStartGame} />}
        {gameState === 'playing' && <GameScreen onGameOver={handleGameOver} />}
        {gameState === 'gameover' && (
          <GameOverScreen score={score} reason={failureReason} onRestart={handleRestart} />
        )}
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
