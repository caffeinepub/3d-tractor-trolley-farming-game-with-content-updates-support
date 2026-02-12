import type { Activity } from './types';

export class HarvestingActivity {
  private completed = 0;
  private harvestedPlots = new Set<string>();
  private lastActionTime = 0;

  constructor(private activity: Activity) {}

  update(position: { x: number; y: number; z: number }, actionPressed: boolean, currentTime: number): number {
    if (actionPressed && currentTime - this.lastActionTime > 500) {
      const rowIndex = Math.floor((position.x + 15) / 3);
      const colIndex = Math.floor((position.z + 20) / 2);

      if (rowIndex >= 0 && rowIndex < 10 && colIndex >= 0 && colIndex < 20) {
        const key = `${rowIndex}-${colIndex}`;
        if (!this.harvestedPlots.has(key)) {
          this.harvestedPlots.add(key);
          this.completed++;
          this.lastActionTime = currentTime;
        }
      }
    }

    return Math.min(100, (this.completed / this.activity.targetCount) * 100);
  }

  isComplete(): boolean {
    return this.completed >= this.activity.targetCount;
  }

  getScore(): number {
    return this.completed * this.activity.scorePerUnit;
  }

  reset(): void {
    this.completed = 0;
    this.harvestedPlots.clear();
    this.lastActionTime = 0;
  }
}
