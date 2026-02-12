import { Button } from '../../components/ui/button';
import { Trophy, RotateCcw, Home } from 'lucide-react';

interface GameOverScreenProps {
  score: number;
  reason: string;
  onRestart: () => void;
}

export default function GameOverScreen({ score, reason, onRestart }: GameOverScreenProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[oklch(0.30_0.08_260)] via-[oklch(0.35_0.10_250)] to-[oklch(0.40_0.12_240)]">
      <div className="flex flex-col items-center gap-8 max-w-lg px-6">
        {/* Trophy Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
          <Trophy className="w-32 h-32 text-yellow-400 relative z-10" />
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">खेल समाप्त!</h1>
          <p className="text-xl text-white/80">{reason}</p>
        </div>

        {/* Score Display */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 w-full border border-white/20">
          <div className="text-center">
            <p className="text-white/70 text-lg mb-2">आपका स्कोर</p>
            <p className="text-6xl font-bold text-yellow-400">{score}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Button
            onClick={onRestart}
            size="lg"
            className="flex-1 h-14 text-xl font-bold bg-[oklch(0.55_0.20_110)] hover:bg-[oklch(0.50_0.22_110)] text-white rounded-xl"
          >
            <RotateCcw className="w-6 h-6 mr-2" />
            फिर से खेलें
          </Button>
          <Button
            onClick={onRestart}
            size="lg"
            variant="outline"
            className="flex-1 h-14 text-xl font-bold bg-white/90 hover:bg-white text-[oklch(0.45_0.15_100)] border-2 border-white/50 rounded-xl"
          >
            <Home className="w-6 h-6 mr-2" />
            मुख्य मेनू
          </Button>
        </div>
      </div>
    </div>
  );
}
