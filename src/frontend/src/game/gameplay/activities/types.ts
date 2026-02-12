import type { GameConfig } from '../../../backend';

export interface Activity {
  id: string;
  name: string;
  objective: string;
  targetCount: number;
  duration: number;
  scorePerUnit: number;
}

export interface ActivityCallbacks {
  onActivityChange: (activity: Activity) => void;
  onProgressUpdate: (progress: number) => void;
  onScoreUpdate: (score: number) => void;
  onGameOver: (score: number, reason: string) => void;
}

export function createActivitiesFromConfig(config: GameConfig): Activity[] {
  const duration = Number(config.farmSettings.activityDuration);

  return [
    {
      id: 'plowing',
      name: 'हल चलाना',
      objective: 'हल चलाएं: 0/10 पंक्तियाँ',
      targetCount: 10,
      duration: duration,
      scorePerUnit: 10,
    },
    {
      id: 'sowing',
      name: 'बीज बोना',
      objective: 'बीज बोएं: 0/15 खेत',
      targetCount: 15,
      duration: duration,
      scorePerUnit: 8,
    },
    {
      id: 'harvesting',
      name: 'कटाई',
      objective: 'फसल काटें: 0/12 खेत',
      targetCount: 12,
      duration: duration,
      scorePerUnit: 15,
    },
  ];
}
