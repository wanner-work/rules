'use client';
import * as THREE from 'three';

import MergedPlanes from './MergedPlanes';

interface Props {
  material: THREE.ShaderMaterial;
  width: number;
  count: number;
  height: number;
}

export default function PlaneNoise({ material, width, count, height }: Props) {
  return <MergedPlanes material={material} width={width} count={count} height={height} />;
}
