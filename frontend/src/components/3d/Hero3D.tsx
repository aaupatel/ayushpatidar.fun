import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { Float, Line, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface NodeDef {
  pos: [number, number, number];
  label: string;
  desc: string;
  color: string;
  size: number;
}

const NODES: NodeDef[] = [
  { pos: [-1.5, 0.9, 0.2], label: 'UI',      desc: 'React + TypeScript interface', color: '#3fb950', size: 0.20 },
  { pos: [0, 1.4, 0],      label: 'API',     desc: 'Routing, validation, rate limiting', color: '#58a6ff', size: 0.24 },
  { pos: [1.5, 0.9, 0.2],  label: 'SERVICE', desc: 'Business logic, session management', color: '#f85149', size: 0.20 },
  { pos: [1.2, -0.8, 0],   label: 'DATABASE',desc: 'Persistence, queries, indexing', color: '#d29922', size: 0.20 },
  { pos: [-1.2, -0.8, 0],  label: 'AUTH',    desc: 'JWT, roles, session tokens', color: '#3fb950', size: 0.16 },
];

const EDGES: [number, number][] = [
  [0, 1], // UI -> API
  [1, 2], // API -> SERVICE
  [2, 3], // SERVICE -> DATABASE
  [1, 4], // API -> AUTH
  [2, 4], // SERVICE -> AUTH
];

function NodeMesh({ node, onHover, hovered }: {
  node: NodeDef;
  onHover: (i: number | null) => void;
  hovered: boolean;
}) {
  return (
    <group
      position={node.pos}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); onHover(NODES.indexOf(node)); }}
      onPointerOut={() => onHover(null)}
    >
      <mesh>
        <icosahedronGeometry args={[node.size, 0]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={hovered ? 0.5 : 0.25}
          transparent
          opacity={hovered ? 0.2 : 0.12}
          wireframe
        />
      </mesh>
      <mesh scale={0.5}>
        <sphereGeometry args={[node.size, 16, 16]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={hovered ? 0.8 : 0.5}
          transparent
          opacity={0.85}
        />
      </mesh>
      <Text
        position={[0, node.size + 0.16, 0]}
        fontSize={0.095}
        color={node.color}
        anchorX="center"
        anchorY="middle"
      >
        {node.label}
      </Text>
    </group>
  );
}

function SystemGraph({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const scrollY = useRef(0);
  const [hovered, setHovered] = useState<number | null>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    if (!reduced) {
      group.current.rotation.y += delta * 0.05;
    }
    const x = state.pointer.x * 0.3;
    const y = state.pointer.y * 0.2;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, y, 0.05);
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, x * 0.2, 0.04);
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      -scrollY.current * 0.12,
      0.04,
    );
  });

  useEffect(() => {
    const onScroll = () => {
      scrollY.current = window.scrollY * 0.001;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const edgeLines = useMemo(
    () => EDGES.map(([a, b]) => [new THREE.Vector3(...NODES[a].pos), new THREE.Vector3(...NODES[b].pos)] as [THREE.Vector3, THREE.Vector3]),
    [],
  );

  const hoveredNode = hovered !== null ? NODES[hovered] : null;

  return (
    <group ref={group}>
      {edgeLines.map((pts, i) => (
        <Line
          key={`edge-${i}`}
          points={pts}
          color={NODES[EDGES[i][0]].color}
          lineWidth={1}
          transparent
          opacity={0.25}
        />
      ))}

      {NODES.map((node, i) => (
        <Float key={`node-${i}`} speed={reduced ? 0 : 1.0} rotationIntensity={0.12} floatIntensity={0.25}>
          <NodeMesh node={node} onHover={setHovered} hovered={hovered === i} />
        </Float>
      ))}

      {hoveredNode && (
        <Billboard position={[0, -2.2, 0]}>
          <Text
            fontSize={0.11}
            color="#e6edf3"
            anchorX="center"
            anchorY="middle"
            maxWidth={4}
            outlineWidth={0.008}
            outlineColor="#0b0c0e"
          >
            {`${hoveredNode.label} — ${hoveredNode.desc}`}
          </Text>
        </Billboard>
      )}
    </group>
  );
}

export function Hero3D({ mobile = false, reduced = false }: { mobile?: boolean; reduced?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, mobile ? 1.5 : 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1.0} color="#58a6ff" />
        <pointLight position={[-5, -3, 3]} intensity={0.5} color="#3fb950" />
        <directionalLight position={[0, 5, 2]} intensity={0.3} />
        <SystemGraph reduced={reduced} />
      </Suspense>
    </Canvas>
  );
}
