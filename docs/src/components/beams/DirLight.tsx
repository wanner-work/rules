'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  position: [number, number, number];
  color: string;
}

export default function DirLight({ position, color }: Props) {
  const dir = useRef<THREE.DirectionalLight>(null);
  useEffect(() => {
    if (!dir.current) return;
    const cam = dir.current.shadow.camera;
    if (!cam) return;
    cam.top = 24;
    cam.bottom = -24;
    cam.left = -24;
    cam.right = 24;
    cam.far = 64;
    dir.current.shadow.bias = -0.004;
  }, []);
  return <directionalLight ref={dir} color={color} intensity={1} position={position} />;
}
