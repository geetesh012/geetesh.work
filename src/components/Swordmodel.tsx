import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// The model's geometry is Draco-compressed, and drei's default decoder path
// points at Google's CDN (gstatic.com) — which a same-origin CSP blocks.
// three ships the same decoder files locally, so self-host them instead of
// relaxing connect-src to trust a third-party origin.
useGLTF.setDecoderPath('/draco/');
useGLTF.preload('/models/sword.glb');

function SwordMesh() {
  const { scene } = useGLTF('/models/sword.glb');
  const spinRef = useRef<THREE.Group>(null);
  const parallaxRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const normalized = useMemo(() => {
    const clone = scene.clone(true);

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);

    const center = new THREE.Vector3();
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 3.0 / maxDim;

    // Center the sword exactly.
    clone.position.sub(center);

    clone.scale.setScalar(scale);

    return clone;
  }, [scene]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener('mousemove', onMove);

    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((_, delta) => {
    if (spinRef.current) {
      spinRef.current.rotation.y += delta * 0.12;
    }

    if (parallaxRef.current) {
      parallaxRef.current.rotation.x +=
        (mouse.current.y * 0.15 - parallaxRef.current.rotation.x) * 0.04;

      parallaxRef.current.rotation.z +=
        (-mouse.current.x * 0.08 - parallaxRef.current.rotation.z) * 0.04;
    }
  });

  return (
    // Rotation intentionally unchanged.
    <group rotation={[0.15, 0.5, Math.PI / 5]} position={[0.4, -0.7, 0]}>
      <group ref={spinRef}>
        <group ref={parallaxRef}>
          <primitive object={normalized} />
        </group>
      </group>
    </group>
  );
}

export default function SwordModel({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 35 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.8]}
      >
        <ambientLight intensity={0.5} />

        <directionalLight
          position={[3, 4, 5]}
          intensity={1.1}
          color="#f5f0ea"
        />

        <pointLight
          position={[-2, -1, 2]}
          intensity={2.4}
          color="#B91729"
        />

        <Suspense fallback={null}>
          <SwordMesh />
        </Suspense>
      </Canvas>
    </div>
  );
}