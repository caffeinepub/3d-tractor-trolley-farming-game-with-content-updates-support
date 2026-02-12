import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import TractorRig from './TractorRig';
import type { ActivityManager } from '../gameplay/ActivityManager';
import type { GameConfig } from '../../backend';
import type { ControlState } from '../input/types';

interface FarmSceneProps {
  controls: ControlState;
  activityManager: ActivityManager | null;
  config?: GameConfig;
}

export default function FarmScene({ controls, activityManager, config }: FarmSceneProps) {
  const tractorRef = useRef<any>(null);

  useFrame((state, delta) => {
    if (tractorRef.current && activityManager) {
      const position = tractorRef.current.getPosition();
      activityManager.updateTractorPosition(position, delta);
    }
  });

  const ambientIntensity = config?.ambientLight.x ?? 0.6;

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <hemisphereLight intensity={0.3} groundColor="#8B7355" />

      {/* Sky */}
      <Sky sunPosition={[100, 20, 100]} />

      {/* Ground */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#6B8E23" />
      </mesh>

      {/* Field Rows */}
      {Array.from({ length: 10 }).map((_, i) => (
        <group key={i} position={[-15 + i * 3, 0.05, 0]}>
          {Array.from({ length: 20 }).map((_, j) => (
            <mesh key={j} position={[0, 0, -20 + j * 2]} receiveShadow>
              <boxGeometry args={[2, 0.1, 1.5]} />
              <meshStandardMaterial color="#8B7355" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Haybales */}
      {[
        [-20, 0, -15],
        [-20, 0, 15],
        [20, 0, -15],
        [20, 0, 15],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[1, 1, 1.5, 8]} />
          <meshStandardMaterial color="#DAA520" />
        </mesh>
      ))}

      {/* Rocks */}
      {[
        [-25, 0, 0],
        [25, 0, 0],
        [0, 0, -25],
        [0, 0, 25],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <dodecahedronGeometry args={[1.2]} />
          <meshStandardMaterial color="#696969" roughness={0.8} />
        </mesh>
      ))}

      {/* Tractor */}
      <TractorRig ref={tractorRef} controls={controls} config={config} />

      {/* Camera Controls (disabled during gameplay) */}
      <OrbitControls enabled={false} />
    </>
  );
}
