import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

// Library build configuration
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      exclude: ['src/main.tsx', 'src/App.tsx', 'src/vite-env.d.ts'],
      outDir: 'dist',
      entryRoot: 'src'
    })
  ],
  build: {
    lib: {
      entry: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/index.ts'),
      name: 'MultiStepForm',
      fileName: (format) => `index.${format === 'es' ? 'esm' : format}.js`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'framer-motion', 'react-phone-number-input'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'framer-motion': 'framer-motion',
          'react-phone-number-input': 'react-phone-number-input'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'react-multistep-form-wizard.css') return 'index.css';
          return assetInfo.name;
        }
      }
    },
    outDir: 'dist',
    cssCodeSplit: false
  }
})
