import { useState, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Circle } from 'lucide-react';

let onScreenState = {
  throttle: 0,
  steer: 0,
  action: false,
};

export function getOnScreenControls() {
  return onScreenState;
}

export default function OnScreenControls() {
  const [, forceUpdate] = useState({});

  const handleThrottleStart = useCallback((value: number) => {
    onScreenState.throttle = value;
    forceUpdate({});
  }, []);

  const handleThrottleEnd = useCallback(() => {
    onScreenState.throttle = 0;
    forceUpdate({});
  }, []);

  const handleSteerStart = useCallback((value: number) => {
    onScreenState.steer = value;
    forceUpdate({});
  }, []);

  const handleSteerEnd = useCallback(() => {
    onScreenState.steer = 0;
    forceUpdate({});
  }, []);

  const handleActionStart = useCallback(() => {
    onScreenState.action = true;
    forceUpdate({});
  }, []);

  const handleActionEnd = useCallback(() => {
    onScreenState.action = false;
    forceUpdate({});
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Left Side - Steering */}
      <div className="absolute left-4 bottom-4 flex flex-col gap-2 pointer-events-auto md:hidden">
        <button
          onTouchStart={() => handleThrottleStart(1)}
          onTouchEnd={handleThrottleEnd}
          onMouseDown={() => handleThrottleStart(1)}
          onMouseUp={handleThrottleEnd}
          onMouseLeave={handleThrottleEnd}
          className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center active:bg-white/40 transition-colors shadow-lg"
        >
          <ArrowUp className="w-8 h-8 text-white" />
        </button>
        <div className="flex gap-2">
          <button
            onTouchStart={() => handleSteerStart(-1)}
            onTouchEnd={handleSteerEnd}
            onMouseDown={() => handleSteerStart(-1)}
            onMouseUp={handleSteerEnd}
            onMouseLeave={handleSteerEnd}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center active:bg-white/40 transition-colors shadow-lg"
          >
            <ArrowLeft className="w-8 h-8 text-white" />
          </button>
          <button
            onTouchStart={() => handleSteerStart(1)}
            onTouchEnd={handleSteerEnd}
            onMouseDown={() => handleSteerStart(1)}
            onMouseUp={handleSteerEnd}
            onMouseLeave={handleSteerEnd}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center active:bg-white/40 transition-colors shadow-lg"
          >
            <ArrowRight className="w-8 h-8 text-white" />
          </button>
        </div>
        <button
          onTouchStart={() => handleThrottleStart(-1)}
          onTouchEnd={handleThrottleEnd}
          onMouseDown={() => handleThrottleStart(-1)}
          onMouseUp={handleThrottleEnd}
          onMouseLeave={handleThrottleEnd}
          className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center active:bg-white/40 transition-colors shadow-lg"
        >
          <ArrowDown className="w-8 h-8 text-white" />
        </button>
      </div>

      {/* Right Side - Action */}
      <div className="absolute right-4 bottom-4 pointer-events-auto md:hidden">
        <button
          onTouchStart={handleActionStart}
          onTouchEnd={handleActionEnd}
          onMouseDown={handleActionStart}
          onMouseUp={handleActionEnd}
          onMouseLeave={handleActionEnd}
          className="w-20 h-20 rounded-full bg-[oklch(0.55_0.20_110)]/80 backdrop-blur-md border-2 border-white/40 flex items-center justify-center active:bg-[oklch(0.50_0.22_110)] transition-colors shadow-lg"
        >
          <Circle className="w-10 h-10 text-white fill-white" />
        </button>
      </div>
    </div>
  );
}
