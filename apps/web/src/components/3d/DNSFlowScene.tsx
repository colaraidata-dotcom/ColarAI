'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

// ── Packet flowing along a line ──────────────────────────────────────────────
function Packet({
  from,
  to,
  color,
  speed,
  phase = 0,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  speed: number;
  phase?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const a = useMemo(() => new THREE.Vector3(...from), [from]);
  const b = useMemo(() => new THREE.Vector3(...to), [to]);

  useFrame((state) => {
    const t = ((state.clock.elapsedTime * speed + phase) % 1 + 1) % 1;
    ref.current.position.lerpVectors(a, b, t);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.07, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

// ── Glowing node sphere ───────────────────────────────────────────────────────
function Node({
  position,
  radius,
  color,
  pulse = false,
}: {
  position: [number, number, number];
  radius: number;
  color: string;
  pulse?: boolean;
}) {
  const inner = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (pulse) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.8) * 0.07;
      inner.current.scale.setScalar(s);
    }
  });

  return (
    <group position={position}>
      {/* soft glow shell */}
      <mesh>
        <sphereGeometry args={[radius * 2.2, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>
      {/* mid halo */}
      <mesh>
        <sphereGeometry args={[radius * 1.5, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.07} side={THREE.BackSide} />
      </mesh>
      {/* core */}
      <mesh ref={inner}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          roughness={0.1}
          metalness={0.85}
        />
      </mesh>
      <pointLight color={color} intensity={2} distance={5} decay={2} />
    </group>
  );
}

// ── Rotating ring around the Guardian node ───────────────────────────────────
function Ring({ radius, color, tilt, speed }: { radius: number; color: string; tilt: number; speed: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    ref.current.rotation.z = state.clock.elapsedTime * speed;
  });
  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.012, 8, 80]} />
      <meshBasicMaterial color={color} transparent opacity={0.2} />
    </mesh>
  );
}

// ── Distant star-field ────────────────────────────────────────────────────────
function Stars() {
  const count = 150;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 24;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 3;
    }
    return arr;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#334155" size={0.035} transparent opacity={0.9} sizeAttenuation />
    </points>
  );
}

// ── Main 3-D scene ─────────────────────────────────────────────────────────
function Scene() {
  // positions
  const DEV: [number, number, number] = [-5, 0, 0];
  const GRD: [number, number, number] = [0, 0, 0];
  const ALW: [number, number, number] = [4.5, 1.8, 0];
  const BLK: [number, number, number] = [4.5, -1.8, 0];

  return (
    <>
      <ambientLight intensity={0.06} color="#08080f" />

      <Stars />

      {/* Guardian rings */}
      <Ring radius={1.6} color="#0EA5E9" tilt={Math.PI / 4} speed={0.3} />
      <Ring radius={2.1} color="#22D3EE" tilt={-Math.PI / 6} speed={-0.2} />

      {/* Nodes */}
      <Node position={DEV} radius={0.52} color="#60A5FA" />
      <Node position={GRD} radius={0.88} color="#0EA5E9" pulse />
      <Node position={ALW} radius={0.46} color="#22C55E" />
      <Node position={BLK} radius={0.46} color="#EF4444" />

      {/* Connection lines */}
      <Line points={[DEV, GRD]} color="#38BDF8" lineWidth={0.8} transparent opacity={0.18} />
      <Line points={[GRD, ALW]} color="#22C55E" lineWidth={0.8} transparent opacity={0.18} />
      <Line points={[GRD, BLK]} color="#EF4444" lineWidth={0.8} transparent opacity={0.13} />

      {/* Packets: device → Guardian */}
      {[0, 0.34, 0.67].map((ph, i) => (
        <Packet key={`dg${i}`} from={DEV} to={GRD} color="#7DD3FC" speed={0.38} phase={ph} />
      ))}

      {/* Packets: Guardian → allowed (most requests) */}
      {[0, 0.5].map((ph, i) => (
        <Packet key={`ga${i}`} from={GRD} to={ALW} color="#4ADE80" speed={0.5} phase={ph} />
      ))}

      {/* Packets: Guardian → blocked (fewer) */}
      <Packet from={GRD} to={BLK} color="#F87171" speed={0.5} phase={0.25} />
    </>
  );
}

// ── Exported canvas wrapper ───────────────────────────────────────────────────
export default function DNSFlowScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 11], fov: 48 }}
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
