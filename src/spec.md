# Specification

## Summary
**Goal:** Upgrade the existing tractor game into a 3D tractor–trolley farming game with configurable gameplay tuning that can be updated via backend GameConfig, while keeping the current start/play/game-over/restart loop and making it mobile-friendly for Play Store wrapping.

**Planned changes:**
- Implement a **3D game** scene using React Three Fiber: controllable tractor with a visible attached trolley in a farm environment, supporting keyboard and on-screen/touch controls.
- Preserve the existing flow/screens: start -> play -> game over -> restart.
- Add at least 3 playable farming activities (e.g., plowing, sowing, watering, harvesting) with clear objectives in UI plus completion and failure conditions tied to score/progress and game-over.
- Extend backend GameConfig to include tunable 3D and activity parameters (e.g., tractor handling, field/plot layout, objectives/targets, durations/difficulty), and update frontend to load/apply this config on startup.
- Add an admin-only UI to update the new GameConfig fields, with changes taking effect after reload or an explicit refresh.
- Make the game UI fully mobile-responsive with touch-friendly controls and readable HUD; add brief documentation for wrapping the web build in an Android WebView/wrapper for Play Store delivery.

**User-visible outcome:** Players can play a 3D tractor–trolley farming game in the browser on desktop or mobile, complete multiple farming activities with objectives, hit game-over on failure and restart, and admins can tune gameplay parameters via configurable settings without changing gameplay code; the repo includes guidance for packaging the web game into an Android WebView wrapper for Play Store upload.
