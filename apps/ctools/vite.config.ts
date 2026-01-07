import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import fs from 'fs'

// Plugin to inject Jekyll Front Matter
const jekyllFrontMatter = () => {
  return {
    name: 'vite-plugin-jekyll-frontmatter',
    closeBundle() {
      const distIndex = path.resolve(__dirname, '../../ctools/index.html')
      if (fs.existsSync(distIndex)) {
        const content = fs.readFileSync(distIndex, 'utf-8')
        const frontMatter = `---
layout: null
permalink: /ctools/
title: CTools Suite
---
`
        fs.writeFileSync(distIndex, frontMatter + content)
        console.log('✅ Injected Jekyll Front Matter')
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/ctools/',
  plugins: [vue(), jekyllFrontMatter()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@components': path.resolve(__dirname, './src/components'),
      '@composables': path.resolve(__dirname, './src/composables'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@config': path.resolve(__dirname, './src/config'),
      '@stores': path.resolve(__dirname, './src/stores'),
    },
  },
  build: {
    outDir: '../../ctools', // Build directly to the output directory
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'bpmn-vendor': ['bpmn-js'],
          'core-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['lucide-vue-next', '@vueuse/core']
        }
      }
    }
  }
})
