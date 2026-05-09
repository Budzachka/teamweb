import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  publicDir: 'public',
  // Має збігатися з ім’ям репозиторію на GitHub Pages (project site)
  base: '/teamweb/',
  resolve: {
    alias: {
      '@public': path.resolve(__dirname, 'public'),
    },
  },
});