import * as THREE from 'three'

export default function extendMaterial(BaseMaterial: any, cfg: any) {
  const physical: any = THREE.ShaderLib.physical
  const {
    vertexShader: baseVert,
    fragmentShader: baseFrag,
    uniforms: baseUniforms
  } = physical
  const baseDefines = physical.defines ?? {}

  const uniforms = THREE.UniformsUtils.clone(baseUniforms)

  const defaults = new BaseMaterial(cfg.material || {})

  if (defaults.color) uniforms.diffuse.value = defaults.color
  if ('roughness' in defaults) uniforms.roughness.value = defaults.roughness
  if ('metalness' in defaults) uniforms.metalness.value = defaults.metalness
  if ('envMap' in defaults) uniforms.envMap.value = defaults.envMap
  if ('envMapIntensity' in defaults)
    uniforms.envMapIntensity.value = defaults.envMapIntensity

  Object.entries(cfg.uniforms ?? {}).forEach(([key, u]: [string, any]) => {
    uniforms[key] =
      u !== null && typeof u === 'object' && 'value' in u ? u : { value: u }
  })

  let vert = `${cfg.header}\n${cfg.vertexHeader ?? ''}\n${baseVert}`
  let frag = `${cfg.header}\n${cfg.fragmentHeader ?? ''}\n${baseFrag}`

  for (const [inc, code] of Object.entries(cfg.vertex ?? {})) {
    vert = vert.replace(inc, `${inc}\n${String(code)}`)
  }
  for (const [inc, code] of Object.entries(cfg.fragment ?? {})) {
    frag = frag.replace(inc, `${inc}\n${String(code)}`)
  }

  const mat = new THREE.ShaderMaterial({
    defines: { ...baseDefines },
    uniforms,
    vertexShader: vert,
    fragmentShader: frag,
    lights: true,
    fog: !!cfg.material?.fog
  })

  return mat
}
