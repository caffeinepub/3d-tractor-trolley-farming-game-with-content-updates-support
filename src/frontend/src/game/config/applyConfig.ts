import type { GameConfig } from '../../backend';

export interface RuntimeConfig {
  tractorSpeed: number;
  tractorTurnSpeed: number;
  ambientLightIntensity: number;
  activityDuration: number;
  plowingTarget: number;
  sowingTarget: number;
  harvestingTarget: number;
}

export function applyConfig(config: GameConfig): RuntimeConfig {
  return {
    tractorSpeed: 8,
    tractorTurnSpeed: 2.5,
    ambientLightIntensity: config.ambientLight.x,
    activityDuration: Number(config.farmSettings.activityDuration),
    plowingTarget: 10,
    sowingTarget: 15,
    harvestingTarget: 12,
  };
}
