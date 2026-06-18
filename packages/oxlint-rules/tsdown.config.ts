import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: {
    tsgo: true
  },
  deps:{
    onlyBundle: false
  },
  exports: true
})
