'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

// Device node orbiting the central Guardian sphere
function DeviceNode({
  orbitRadius,
  orbitSpeed,
  startAngle,
  tiltY,
  color,
}: {
  orbitRadius: number;
  orbitSpeed: number;
  startAngle: number;
  tiltY: number;
  color: string;
}) {
  const group = useRef<THREE.Group>(null!);
  const trailRef = useRef<Float32Array>(new Float32Array(3));

  useFrame((state) => {
    const angle = startAngle + state.clock.elapsedTime * orbitSpeed;
    group.current.position.x = Math.cos(angle) * orbitRadius;
    group.current.position.y = Math.sin(angle) * Math.sin(tiltY) * orbitRadius * 0.5;
    group.current.position.z = Math.sin(angle) * Math.cos(tiltY) * orbitRadius * 0.4;
  });

  return (
    <group ref={group}>
      {/* glow */}
      <mesh>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
      {/* core */}
      <mesh>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.2} metalness={0.7} />
      </mesh>
      <pointLight color={color} intensity={0.6} distance={2.5} decay={2} />
    </group>
  );
}

// Central Guardian orb
function GuardianOrb() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const ring1 = useRef<THREE.Mesh>(null!);
  const ring2 = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    meshRef.current.scale.setScalar(1 + Math.sin(t * 1.6) * 0.05);
    ring1.current.rotation.z = t * 0.4;
    ring2.current.rotation.z = -t * 0.28;
  });

  return (
    <group>
      {/* Outer glow layers */}
      {[3.2, 2.4, 1.8].map((r, i) => (
        <mesh key={i}>
          <sphereGeometry args={[r, 16, 16]} />
          <meshBasicMaterial color="#0EA5E9" transparent opacity={0.025 - i * 0.006} side={THREE.BackSide} />
        </mesh>
      ))}

      {/* Core orb */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.9, 64, 64]} />
        <meshStandardMaterial
          color="#0EA5E9"
          emissive="#0EA5E9"
          emissiveIntensity={0.35}
          roughness={0.05}
          metalness={0.95}
        />
      </mesh>

      {/* Orbiting rings */}
      <mesh ref={ring1} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.8, 0.013, 8, 100]} />
        <meshBasicMaterial color="#0EA5E9" transparent opacity={0.3} />
      </mesh>
      <mesh ref={ring2} rotation={[-Math.PI / 5, Math.PI / 6, 0]}>
        <torusGeometry args={[2.2, 0.01, 8, 100]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.2} />
      </mesh>

      <pointLight color="#0EA5E9" intensity={3} distance={8} decay={2} />
    </group>
  );
}

// Animated line from device to center that pulses opacity
function PulsingLine({
  start,
  color,
}: {
  start: [number, number, number];
  color: string;
}) {
  return (
    <Line
      points={[start, [0, 0, 0]]}
      color={color}
      lineWidth={0.6}
      transparent
      opacity={0.12}
    />
  );
}

// Floating packet flowing from device to center
function InboundPacket({
  orbitRadius,
  orbitSpeed,
  startAngle,
  tiltY,
  color,
  phase,
}: {
  orbitRadius: number;
  orbitSpeed: number;
  startAngle: number;
  tiltY: number;
  color: string;
  phase: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = ((state.clock.elapsedTime * 0.4 + phase) % 1 + 1) % 1;
    const angle = startAngle + state.clock.elapsedTime * orbitSpeed;
    const sx = Math.cos(angle) * orbitRadius;
    const sy = Math.sin(angle) * Math.sin(tiltY) * orbitRadius * 0.5;
    const sz = Math.sin(angle) * Math.cos(tiltY) * orbitRadius * 0.4;
    // lerp from device position to center
    ref.current.position.x = sx * (1 - t);
    ref.current.position.y = sy * (1 - t);
    ref.current.position.z = sz * (1 - t);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.055, 6, 6]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

// Background particle field
function Stars() {
  const count = 120;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 4;
    }
    return arr;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#1E293B" size={0.04} transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

const devices = [
  { orbitRadius: 3.2, orbitSpeed: 0.22, startAngle: 0, tiltY: 0.8, color: '#3B82F6' },
  { orbitRadius: 3.6, orbitSpeed: 0.18, startAngle: 1.1, tiltY: -0.6, color: '#8B5CF6' },
  { orbitRadius: 3.0, orbitSpeed: 0.28, startAngle: 2.3, tiltY: 1.1, color: '#22D3EE' },
  { orbitRadius: 3.8, orbitSpeed: 0.15, startAngle: 3.7, tiltY: -0.4, color: '#F59E0B' },
  { orbitRadius: 3.3, orbitSpeed: 0.24, startAngle: 4.9, tiltY: 0.5, color: '#EC4899' },
  { orbitRadius: 3.5, orbitSpeed: 0.2,  startAngle: 0.7, tiltY: -1.0, color: '#22C55E' },
];

function Scene() {
  return (
    <>
      <ambientLight intensity={0.05} color="#08080f" />
      <Stars />
      <GuardianOrb />
      {devices.map((d, i) => (
        <group key={i}>
          <DeviceNode {...d} />
          <InboundPacket {...d} phase={i * 0.17} />
        </group>
      ))}
    </>
  );
}

export default function DeviceNetworkScene() {
  return (
    <Canvas
      camera={{ position: [0, 2, 11], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
