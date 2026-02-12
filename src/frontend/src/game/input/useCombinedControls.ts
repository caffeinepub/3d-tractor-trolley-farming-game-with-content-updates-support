import { useKeyboardControls } from './useKeyboardControls';
import { getOnScreenControls } from './OnScreenControls';
import type { ControlState } from './types';

export function useCombinedControls(): ControlState {
  const keyboard = useKeyboardControls();
  const onScreen = getOnScreenControls();

  return {
    throttle: keyboard.throttle || onScreen.throttle,
    steer: keyboard.steer || onScreen.steer,
    action: keyboard.action || onScreen.action,
  };
}
