'use client';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { createStackedPlanesBufferGeometry } from './extendMaterial';

interface Props {
  material: THREE.ShaderMaterial;
  width: number;
  count: number;
  height: number;
}

export default function MergedPlanes({ material, width, count, height }: Props) {
  const mesh = useRef<THREE.Mesh>(null);
  const geometry = useMemo(
    () => createStackedPlanesBufferGeometry(count, width, height, 0, 100),
    [count, width, height]
  );
  useFrame((_, delta) => {
    if (!mesh.current) return;
    (mesh.current.material as THREE.ShaderMaterial).uniforms.time.value += 0.1 * delta;
  });
  return <mesh ref={mesh} geometry={geometry} material={material} />;
}
