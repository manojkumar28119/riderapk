import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';
import path from 'path';

export default defineConfig((configEnv) =>
  mergeConfig(
    viteConfig(configEnv),
    {
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        include: ['**/*.{test,spec}.{ts,tsx}'],
        coverage: {
          provider: 'v8',
          reporter: ['text', 'json', 'html'],
        },
        alias: {
          '@': path.resolve(__dirname, './src'),
          '@app': path.resolve(__dirname, './src/app'),
          '@assets': path.resolve(__dirname, './src/assets'),
          '@components': path.resolve(__dirname, './src/components'),
          '@config': path.resolve(__dirname, './src/config'),
          '@data': path.resolve(__dirname, './src/data'),
          '@features': path.resolve(__dirname, './src/features'),
          '@hooks': path.resolve(__dirname, './src/hooks'),
          '@lib': path.resolve(__dirname, './src/lib'),
          '@services': path.resolve(__dirname, './src/services'),
          '@styles': path.resolve(__dirname, './src/styles'),
        },
      },
    }
  )
);