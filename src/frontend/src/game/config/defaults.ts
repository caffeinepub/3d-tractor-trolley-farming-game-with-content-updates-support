import type { GameConfig } from '../../backend';

export const DEFAULT_CONFIG: GameConfig = {
  farmSettings: {
    activityDuration: BigInt(60),
    growthRate: 1.0,
    yieldRate: 0.3,
  },
  sceneConfig: 'Default',
  gravity: { x: 0.0, y: -9.81, z: 0.0 },
  ambientLight: { x: 0.6, y: 0.6, z: 0.7 },
};
