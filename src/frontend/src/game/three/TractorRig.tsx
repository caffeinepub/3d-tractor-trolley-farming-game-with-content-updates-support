import { useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ControlState } from '../input/types';
import type { GameConfig } from '../../backend';

interface TractorRigProps {
  controls: ControlState;
  config?: GameConfig;
}

const TractorRig = forwardRef(({ controls, config }: TractorRigProps, ref) => {
  const groupRef = useRef<THREE.Group>(null);
  const velocityRef = useRef(new THREE.Vector3());
  const rotationRef = useRef(0);

  const speed = 8;
  const turnSpeed = 2.5;
  const damping = 0.92;

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Handle rotation
    if (controls.steer !== 0) {
      rotationRef.current += controls.steer * turnSpeed * delta;
    }

    // Handle acceleration
    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      rotationRef.current
    );

    if (controls.throttle > 0) {
      velocityRef.current.add(forward.multiplyScalar(controls.throttle * speed * delta));
    } else if (controls.throttle < 0) {
      velocityRef.current.add(forward.multiplyScalar(controls.throttle * speed * 0.5 * delta));
    }

    // Apply damping
    velocityRef.current.multiplyScalar(damping);

    // Update position
    groupRef.current.position.add(velocityRef.current);

    // Clamp position to field bounds
    groupRef.current.position.x = THREE.MathUtils.clamp(groupRef.current.position.x, -30, 30);
    groupRef.current.position.z = THREE.MathUtils.clamp(groupRef.current.position.z, -30, 30);

    // Update rotation
    groupRef.current.rotation.y = rotationRef.current;
  });

  useImperativeHandle(ref, () => ({
    getPosition: () => {
      if (!groupRef.current) return { x: 0, y: 0, z: 0 };
      return {
        x: groupRef.current.position.x,
        y: groupRef.current.position.y,
        z: groupRef.current.position.z,
      };
    },
  }));

  return (
    <group ref={groupRef} position={[0, 0.5, 0]}>
      {/* Tractor Body */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[1.5, 1, 2.5]} />
        <meshStandardMaterial color="#DC143C" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Cabin */}
      <mesh castShadow position={[0, 1.3, -0.3]}>
        <boxGeometry args={[1.2, 0.8, 1.2]} />
        <meshStandardMaterial color="#8B0000" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Front Wheels */}
      <mesh castShadow position={[-0.8, 0, -0.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh castShadow position={[0.8, 0, -0.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Rear Wheels (larger) */}
      <mesh castShadow position={[-0.9, 0, 0.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.6, 0.6, 0.4, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh castShadow position={[0.9, 0, 0.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.6, 0.6, 0.4, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Trolley Connection */}
      <mesh position={[0, 0.3, 1.5]}>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>

      {/* Trolley */}
      <group position={[0, 0, 3]}>
        <mesh castShadow position={[0, 0.4, 0]}>
          <boxGeometry args={[2, 0.8, 2]} />
          <meshStandardMaterial color="#8B7355" />
        </mesh>
        {/* Trolley Wheels */}
        <mesh castShadow position={[-0.9, 0, -0.7]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh castShadow position={[0.9, 0, -0.7]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh castShadow position={[-0.9, 0, 0.7]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh castShadow position={[0.9, 0, 0.7]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
    </group>
  );
});

TractorRig.displayName = 'TractorRig';

export default TractorRig;
