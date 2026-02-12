import type { Activity } from './types';

export class PlowingActivity {
  private completed = 0;
  private visitedRows = new Set<string>();

  constructor(private activity: Activity) {}

  update(position: { x: number; y: number; z: number }): number {
    // Check if tractor is over a field row
    const rowIndex = Math.floor((position.x + 15) / 3);
    const colIndex = Math.floor((position.z + 20) / 2);

    if (rowIndex >= 0 && rowIndex < 10 && colIndex >= 0 && colIndex < 20) {
      const key = `${rowIndex}-${colIndex}`;
      if (!this.visitedRows.has(key)) {
        this.visitedRows.add(key);
        this.completed++;
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
    this.visitedRows.clear();
  }
}
