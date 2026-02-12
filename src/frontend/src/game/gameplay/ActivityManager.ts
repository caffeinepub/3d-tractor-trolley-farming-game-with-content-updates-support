import type { GameConfig } from '../../backend';
import type { ControlState } from '../input/types';
import { createActivitiesFromConfig, type Activity, type ActivityCallbacks } from './activities/types';
import { PlowingActivity } from './activities/PlowingActivity';
import { SowingActivity } from './activities/SowingActivity';
import { HarvestingActivity } from './activities/HarvestingActivity';

export class ActivityManager {
  private activities: Activity[];
  private currentActivityIndex = 0;
  private currentActivityHandler: any;
  private score = 0;
  private startTime = 0;
  private controls: ControlState = { throttle: 0, steer: 0, action: false };
  private isRunning = false;

  constructor(
    private config: GameConfig,
    private callbacks: ActivityCallbacks
  ) {
    this.activities = createActivitiesFromConfig(config);
    this.initializeActivity();
  }

  private initializeActivity() {
    const activity = this.activities[this.currentActivityIndex];

    switch (activity.id) {
      case 'plowing':
        this.currentActivityHandler = new PlowingActivity(activity);
        break;
      case 'sowing':
        this.currentActivityHandler = new SowingActivity(activity);
        break;
      case 'harvesting':
        this.currentActivityHandler = new HarvestingActivity(activity);
        break;
    }

    this.callbacks.onActivityChange(activity);
  }

  start() {
    this.isRunning = true;
    this.startTime = Date.now();
  }

  stop() {
    this.isRunning = false;
  }

  updateControls(controls: ControlState) {
    this.controls = controls;
  }

  updateTractorPosition(position: { x: number; y: number; z: number }, delta: number) {
    if (!this.isRunning) return;

    const activity = this.activities[this.currentActivityIndex];
    const elapsed = (Date.now() - this.startTime) / 1000;

    // Check timeout
    if (elapsed > activity.duration) {
      this.callbacks.onGameOver(this.score, 'समय समाप्त! Time ran out.');
      this.stop();
      return;
    }

    // Update activity
    let progress = 0;
    if (activity.id === 'plowing') {
      progress = this.currentActivityHandler.update(position);
    } else {
      progress = this.currentActivityHandler.update(position, this.controls.action, Date.now());
    }

    this.callbacks.onProgressUpdate(progress);

    // Check completion
    if (this.currentActivityHandler.isComplete()) {
      this.score += this.currentActivityHandler.getScore();
      this.callbacks.onScoreUpdate(this.score);

      // Move to next activity
      this.currentActivityIndex++;
      if (this.currentActivityIndex >= this.activities.length) {
        this.callbacks.onGameOver(this.score, 'बधाई हो! सभी कार्य पूर्ण!');
        this.stop();
      } else {
        this.startTime = Date.now();
        this.initializeActivity();
      }
    }
  }

  getTimeRemaining(): number {
    const activity = this.activities[this.currentActivityIndex];
    const elapsed = (Date.now() - this.startTime) / 1000;
    return activity.duration - elapsed;
  }
}
