import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import http from 'https';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    'process.env': process.env,
  },
  // some other configuration
});

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: [
//       {
//         find: '@',
//         replacement: './src',
//       },
//     ],
//   },
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://127.0.0.1:5000',
//         changeOrigin: true,
//         secure: false,
//         ws: true,
//         configure: (proxy, _options) => {
//           proxy.on('error', (err, _req, _res) => {
//             console.log('proxy error', err);
//           });
//           proxy.on('proxyReq', (proxyReq, req, _res) => {
//             console.log('Sending Request to the Target:', req.method, req.url);
//           });
//           proxy.on('proxyRes', (proxyRes, req, _res) => {
//             console.log(
//               'Received Response from the Target:',
//               proxyRes.statusCode,
//               req.url,
//             );
//           });
//         },
//       },
//     },
//   },
// });
