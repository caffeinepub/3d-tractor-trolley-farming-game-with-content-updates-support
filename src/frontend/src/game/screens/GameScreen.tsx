import { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import FarmScene from '../three/FarmScene';
import HUD from '../ui/HUD';
import OnScreenControls from '../input/OnScreenControls';
import { useCombinedControls } from '../input/useCombinedControls';
import { ActivityManager } from '../gameplay/ActivityManager';
import { useGameConfig } from '../config/useGameConfig';

interface GameScreenProps {
  onGameOver: (score: number, reason: string) => void;
}

export default function GameScreen({ onGameOver }: GameScreenProps) {
  const { data: config } = useGameConfig();
  const controls = useCombinedControls();
  const activityManagerRef = useRef<ActivityManager | null>(null);
  const [currentActivity, setCurrentActivity] = useState('plowing');
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [objective, setObjective] = useState('हल चलाएं: 0/10 पंक्तियाँ');

  useEffect(() => {
    if (!config) return;

    const manager = new ActivityManager(config, {
      onActivityChange: (activity) => {
        setCurrentActivity(activity.id);
        setObjective(activity.objective);
        setProgress(0);
      },
      onProgressUpdate: (prog) => {
        setProgress(prog);
      },
      onScoreUpdate: (newScore) => {
        setScore(newScore);
      },
      onGameOver: (finalScore, reason) => {
        onGameOver(finalScore, reason);
      },
    });

    activityManagerRef.current = manager;
    manager.start();

    return () => {
      manager.stop();
    };
  }, [config, onGameOver]);

  useEffect(() => {
    if (!activityManagerRef.current) return;

    const interval = setInterval(() => {
      const remaining = activityManagerRef.current?.getTimeRemaining() ?? 0;
      setTimeRemaining(Math.max(0, Math.floor(remaining)));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!activityManagerRef.current) return;
    activityManagerRef.current.updateControls(controls);
  }, [controls]);

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 8, 12], fov: 60 }}
        shadows
        className="bg-gradient-to-b from-[oklch(0.75_0.08_220)] to-[oklch(0.85_0.12_180)]"
      >
        <FarmScene
          controls={controls}
          activityManager={activityManagerRef.current}
          config={config}
        />
      </Canvas>

      <HUD
        objective={objective}
        progress={progress}
        score={score}
        timeRemaining={timeRemaining}
        currentActivity={currentActivity}
      />

      <OnScreenControls />
    </div>
  );
}
