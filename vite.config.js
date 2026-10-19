import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * The robots directive differs between the local reference build and the
 * published site. The build environment decides, so the same source can be
 * served privately and published publicly without a manual edit.
 */
function robotsDirective() {
  const value = process.env.PUBLIC_ROBOTS ?? 'noindex, nofollow';
  return {
    name: 'robots-directive',
    transformIndexHtml(html) {
      return html.replace('%ROBOTS%', value);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), robotsDirective()],
  base: './',
  server: { host: '127.0.0.1', port: 5174, strictPort: true },
  preview: { host: '127.0.0.1', port: 4179, strictPort: true },
  build: { sourcemap: false, assetsInlineLimit: 0 },
});
