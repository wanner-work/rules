import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: {
    tsgo: true
  },
  deps: {
    skipNodeModulesBundle: true
  },
  exports: true
})
