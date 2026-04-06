'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  useGLTF,
  useAnimations,
  OrbitControls,
  Environment,
  ContactShadows,
} from '@react-three/drei';
import * as THREE from 'three';

/* ─────────────────────────────────────────
   Loading fallback / Error state
───────────────────────────────────────── */
function LoadingFallback() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime;
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.7, 1.1, 0.35]} />
      <meshStandardMaterial
        color="#7c3aed"
        emissive="#7c3aed"
        emissiveIntensity={0.5}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

/* ─────────────────────────────────────────
   Glow ring on floor
───────────────────────────────────────── */
function GlowRing({ y }: { y: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.z += 0.006;
    (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      1.2 + Math.sin(s.clock.elapsedTime * 2) * 0.4;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
      <ringGeometry args={[0.9, 1.15, 64]} />
      <meshStandardMaterial
        color="#7c3aed"
        emissive="#7c3aed"
        emissiveIntensity={1.5}
        transparent
        opacity={0.7}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ─────────────────────────────────────────
   Platform disc
───────────────────────────────────────── */
function Platform({ y }: { y: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      0.4 + Math.sin(s.clock.elapsedTime * 1.5) * 0.2;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, y - 0.02, 0]}>
      <circleGeometry args={[1.3, 64]} />
      <meshStandardMaterial
        color="#7c3aed"
        emissive="#7c3aed"
        emissiveIntensity={0.4}
        transparent
        opacity={0.13}
      />
    </mesh>
  );
}

/* ─────────────────────────────────────────
   Orbit torus rings
───────────────────────────────────────── */
function OrbitRing({
  radius, speed, color, tilt,
}: {
  radius: number; speed: number; color: string; tilt: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => { if (ref.current) ref.current.rotation.y += speed; });
  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.013, 16, 120]} />
      <meshStandardMaterial
        color={color} emissive={color}
        emissiveIntensity={2} transparent opacity={0.55}
      />
    </mesh>
  );
}

/* ─────────────────────────────────────────
   Particle cloud
───────────────────────────────────────── */
function Particles({ centerY }: { centerY: number }) {
  const ref   = useRef<THREE.Points>(null);
  const count = 40;
  const pos   = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle  = (i / count) * Math.PI * 2;
    const radius = 1.4 + (i % 5) * 0.2;
    const h      = centerY - 1 + (i % 8) * 0.4;
    pos[i * 3]     = Math.cos(angle) * radius;
    pos[i * 3 + 1] = h;
    pos[i * 3 + 2] = Math.sin(angle) * radius;
  }
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.07;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04} color="#a855f7"
        transparent opacity={0.7} sizeAttenuation
      />
    </points>
  );
}

/* ─────────────────────────────────────────
   Scene lights
───────────────────────────────────────── */
function SceneLighting({ centerY }: { centerY: number }) {
  const pRef = useRef<THREE.PointLight>(null);
  const cRef = useRef<THREE.PointLight>(null);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (pRef.current) {
      pRef.current.intensity  = 4 + Math.sin(t * 1.1) * 1;
      pRef.current.position.x = Math.sin(t * 0.4) * 2.5;
      pRef.current.position.z = Math.cos(t * 0.4) * 2.5;
    }
    if (cRef.current) {
      cRef.current.intensity = 2.5 + Math.sin(t * 0.7) * 0.8;
    }
  });
  return (
    <>
      <ambientLight intensity={0.6} color="#1a0533" />
      <directionalLight position={[4, 8, 4]} intensity={2} castShadow />
      <pointLight ref={pRef} position={[-2, centerY + 1, 2]}
        color="#7c3aed" intensity={4} distance={14} />
      <pointLight ref={cRef} position={[2, centerY, -2]}
        color="#06b6d4" intensity={2.5} distance={12} />
      <pointLight position={[0, centerY + 2, 2]}
        color="#ec4899" intensity={2} distance={10} />
      <pointLight position={[0, centerY - 1, 3]}
        color="#a855f7" intensity={1.5} distance={8} />
    </>
  );
}

/* ─────────────────────────────────────────
   Cursor-tracking robot wrapper
───────────────────────────────────────── */
interface CursorTrackerProps {
  children:    React.ReactNode;
  mouseX:      React.MutableRefObject<number>;
  mouseY:      React.MutableRefObject<number>;
  autoRotate:  boolean;
}

function CursorTracker({
  children, mouseX, mouseY, autoRotate,
}: CursorTrackerProps) {
  const groupRef    = useRef<THREE.Group>(null);
  const targetRotX  = useRef(0);
  const targetRotY  = useRef(0);

  useFrame(() => {
    if (!groupRef.current || autoRotate) return;

    /* Map mouse -1..1 → rotation in radians */
    targetRotY.current = mouseX.current * 0.5;   /* left/right */
    targetRotX.current = -mouseY.current * 0.25; /* up/down    */

    /* Smooth lerp */
    groupRef.current.rotation.y +=
      (targetRotY.current - groupRef.current.rotation.y) * 0.06;
    groupRef.current.rotation.x +=
      (targetRotX.current - groupRef.current.rotation.x) * 0.06;
  });

  return <group ref={groupRef}>{children}</group>;
}

/* ─────────────────────────────────────────
   Camera auto-fit using bounding box
───────────────────────────────────────── */
function CameraRig({ box, fovDeg }: { box: THREE.Box3 | null; fovDeg: number }) {
  const { camera } = useThree();
  const fitted     = useRef(false);

  useFrame(() => {
    if (fitted.current || !box || box.isEmpty()) return;
    fitted.current = true;

    const size   = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    /* Distance needed to fit model in view */
    const maxDim = Math.max(size.x, size.y, size.z);
    const fovRad = (fovDeg * Math.PI) / 180;
    const dist   = (maxDim / 2 / Math.tan(fovRad / 2)) * 1.55;

    camera.position.set(center.x, center.y, center.z + dist);
    camera.lookAt(center.x, center.y, center.z);
    camera.updateProjectionMatrix();
  });

  return null;
}

/* ─────────────────────────────────────────
   GLB robot model
───────────────────────────────────────── */
interface ModelProps {
  scale:      number;
  onReady:    (box: THREE.Box3, centerY: number, floorY: number) => void;
}

function RobotModel({ scale, onReady }: ModelProps) {
  const group = useRef<THREE.Group>(null);
  
  // Use try/catch for GLB loading or handle it via Suspense fallback
  const { scene, animations } = useGLTF('/models/robot.glb', true);
  const { actions, names }    = useAnimations(animations, group);
  const reported              = useRef(false);

  /* Play animation */
  useEffect(() => {
    if (names.length > 0) {
      const a = actions[names[0]];
      if (a) { a.reset().fadeIn(0.5).play(); a.setLoop(THREE.LoopRepeat, Infinity); }
    }
  }, [actions, names]);

  /* Boost materials */
  useEffect(() => {
    scene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      const mats = Array.isArray(mesh.material)
        ? mesh.material : [mesh.material];
      mats.forEach((m) => {
        if (m instanceof THREE.MeshStandardMaterial) {
          m.envMapIntensity = 2.2;
          m.needsUpdate     = true;
        }
      });
      mesh.castShadow = mesh.receiveShadow = true;
    });
  }, [scene]);

  /* Report bounding box once geometry ready */
  useFrame(() => {
    if (reported.current || !group.current) return;
    const box = new THREE.Box3().setFromObject(group.current);
    if (box.isEmpty()) return;
    reported.current = true;
    const center = new THREE.Vector3();
    box.getCenter(center);
    onReady(box, center.y, box.min.y);
  });

  return (
    <group ref={group} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

/* ─────────────────────────────────────────
   Inner scene (needs useThree)
───────────────────────────────────────── */
function Scene({
  scale,
  autoRotate,
  showRings,
  fov,
  mouseX,
  mouseY,
}: {
  scale:      number;
  autoRotate: boolean;
  showRings:  boolean;
  fov:        number;
  mouseX:     React.MutableRefObject<number>;
  mouseY:     React.MutableRefObject<number>;
}) {
  const [box,     setBox]     = useState<THREE.Box3 | null>(null);
  const [centerY, setCenterY] = useState(0);
  const [floorY,  setFloorY]  = useState(-1);

  const handleReady = (b: THREE.Box3, cy: number, fy: number) => {
    setBox(b);
    setCenterY(cy);
    setFloorY(fy);
  };

  return (
    <>
      <CameraRig box={box} fovDeg={fov} />
      <SceneLighting centerY={centerY} />
      <Environment preset="night" />

      {/* Cursor-tracking wrapper */}
      <CursorTracker mouseX={mouseX} mouseY={mouseY} autoRotate={autoRotate}>
        {/* Gentle float */}
        <group>
          <Suspense fallback={<LoadingFallback />}>
             <RobotModel scale={scale} onReady={handleReady} />
          </Suspense>
        </group>
      </CursorTracker>

      {/* Rings orbit independently */}
      {showRings && (
        <>
          <OrbitRing radius={1.6} speed={0.007}  color="#7c3aed" tilt={Math.PI / 6}   />
          <OrbitRing radius={2.0} speed={-0.005} color="#06b6d4" tilt={Math.PI / 3}   />
          <OrbitRing radius={2.4} speed={0.004}  color="#ec4899" tilt={Math.PI / 2.5} />
        </>
      )}

      {/* Floor elements appear once we know model size */}
      {box && (
        <>
          <GlowRing  y={floorY} />
          <Platform  y={floorY} />
          <Particles centerY={centerY} />
          <ContactShadows
            position={[0, floorY - 0.02, 0]}
            opacity={0.5} scale={5} blur={2.2}
            color="#7c3aed"
          />
        </>
      )}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate={autoRotate}
        autoRotateSpeed={1.8}
        enabled={autoRotate} /* disable drag when cursor tracking */
      />
    </>
  );
}

/* ─────────────────────────────────────────
   Exported component
───────────────────────────────────────── */
export interface Robot3DProps {
  height?:     number;
  scale?:      number;
  autoRotate?: boolean;
  showRings?:  boolean;
  className?:  string;
  fov?:        number;
}

export default function Robot3D({
  height     = 500,
  scale      = 1.2,
  autoRotate = false,
  showRings  = true,
  className  = '',
  fov        = 42,
}: Robot3DProps) {
  /* Normalised mouse position refs (-1 to +1) */
  const mouseX    = useRef(0);
  const mouseY    = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Track mouse relative to this container */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouseX.current = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      mouseY.current = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    };

    const onLeave = () => {
      /* Smoothly reset on mouse leave */
      mouseX.current = 0;
      mouseY.current = 0;
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', height, position: 'relative' }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene
            scale={scale}
            autoRotate={autoRotate}
            showRings={showRings}
            fov={fov}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        </Suspense>
      </Canvas>

      {/* Bottom glow overlay */}
      <div style={{
        position:      'absolute',
        bottom:        0,
        left:          '50%',
        transform:     'translateX(-50%)',
        width:         '60%',
        height:        80,
        background:    'radial-gradient(ellipse at center,rgba(124,58,237,0.28) 0%,transparent 70%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

try {
  useGLTF.preload('/models/robot.glb');
} catch (e) {}
