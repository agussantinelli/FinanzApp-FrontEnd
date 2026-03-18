import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./tests/setup.ts'],
        testTimeout: 15000,
        exclude: ['**/node_modules/**', '**/dist/**', '**/tests/e2e/**'],
        alias: {
            '@/test': path.resolve(__dirname, './tests'),
            '@': path.resolve(__dirname, './src'),
        },
    },
})
