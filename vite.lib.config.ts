import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Library build configuration
export default defineConfig({
    plugins: [react()],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
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
                }
            }
        },
        outDir: 'dist'
    }
})
