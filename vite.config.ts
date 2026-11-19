import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import securityHeaders from './security-headers.json';

// base './' keeps asset paths relative, so the build works on GitHub Pages
// project URLs (user.github.io/repo/) as well as on a root domain.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  server: { port: 5173 },
  // `npm run preview` serves the build with the same headers the host will send
  preview: { port: 4173, headers: securityHeaders },
});
