'use client';
import type { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import './Beams.css';

interface Props {
  children: ReactNode;
}

export default function CanvasWrapper({ children }: Props) {
  return (
    <Canvas dpr={[1, 2]} frameloop="always" className="beams-container">
      {children}
    </Canvas>
  );
}
