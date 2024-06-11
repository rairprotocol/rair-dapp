import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import svgr from 'vite-plugin-svgr';
import { visualizer } from 'rollup-plugin-visualizer';
import viteImagemin from 'vite-plugin-imagemin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    babel: {
      plugins: ['transform-remove-console'],
    },
  }), nodePolyfills(), svgr(), visualizer({ open: true }), viteImagemin({
    gifsicle: {
      optimizationLevel: 7,
      interlaced: false,
    },
    optipng: {
      optimizationLevel: 7,
    },
    mozjpeg: {
      quality: 20,
    },
    pngquant: {
      quality: [0.8, 0.9],
      speed: 4,
    },
    svgo: {
      plugins: [
        {
          name: 'removeViewBox',
        },
        {
          name: 'removeEmptyAttrs',
          active: false,
        },
      ],
    },
  }),],
  server: {
    port: 3001,
    proxy: {
      // with options: http://localhost:5173/api/bar-> http://jsonplaceholder.typicode.com/api/bar
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
