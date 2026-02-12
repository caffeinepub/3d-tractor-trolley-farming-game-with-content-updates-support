import { Tractor, Target, Trophy, Clock } from 'lucide-react';
import { Progress } from '../../components/ui/progress';

interface HUDProps {
  objective: string;
  progress: number;
  score: number;
  timeRemaining: number;
  currentActivity: string;
}

export default function HUD({ objective, progress, score, timeRemaining, currentActivity }: HUDProps) {
  const activityColors: Record<string, string> = {
    plowing: 'oklch(0.55_0.15_40)',
    sowing: 'oklch(0.60_0.18_120)',
    harvesting: 'oklch(0.65_0.20_60)',
  };

  const activityColor = activityColors[currentActivity] || 'oklch(0.55_0.15_100)';

  return (
    <div className="fixed inset-x-0 top-0 z-20 pointer-events-none">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        {/* Top Bar */}
        <div className="flex flex-wrap gap-4 items-start justify-between">
          {/* Objective Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl px-6 py-4 shadow-xl border border-white/50 max-w-md">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6" style={{ color: activityColor }} />
              <h3 className="font-bold text-lg text-gray-800">लक्ष्य</h3>
            </div>
            <p className="text-gray-700 font-medium">{objective}</p>
            <Progress value={progress} className="mt-3 h-2" />
          </div>

          {/* Stats */}
          <div className="flex gap-3">
            {/* Score */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl px-5 py-3 shadow-xl border border-white/50">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-xs text-gray-600">स्कोर</p>
                  <p className="text-2xl font-bold text-gray-800">{score}</p>
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl px-5 py-3 shadow-xl border border-white/50">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600">समय</p>
                  <p className="text-2xl font-bold text-gray-800">{timeRemaining}s</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Hint (Desktop) */}
        <div className="hidden md:block mt-4">
          <div className="bg-black/50 backdrop-blur-md rounded-xl px-4 py-2 inline-block">
            <p className="text-white/80 text-sm">
              <span className="font-bold">WASD/Arrows:</span> चलाएं | <span className="font-bold">Space/E:</span> कार्य
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
