import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// base './' keeps asset paths relative, so the build works on GitHub Pages
// project URLs (user.github.io/repo/) as well as on a root domain.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  server: { port: 5173 },
});
