import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills(), svgr()],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/ms': {
        target: 'http://localhost:5002',
        changeOrigin: true
      }
    }
  },
  define: {
    global: 'window'
  },
  resolve: {
    mainFields: ['browser', 'module', 'jsnext:main', 'jsnext', 'exports']
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: false
    }
  }
});
