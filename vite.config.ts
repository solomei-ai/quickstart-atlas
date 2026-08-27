import {defineConfig} from 'vite';
import react, {reactCompilerPreset} from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import svgr from 'vite-plugin-svgr';
import {fileURLToPath, URL} from 'node:url';

export default defineConfig({
  plugins: [react(), babel({presets: [reactCompilerPreset()]}), svgr()],
  resolve: {
    alias: {
      '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Design tokens & mixins in every .scss without an explicit @use.
        additionalData: `@use '@styles/abstracts' as *;\n`,
      },
    },
  },
});
