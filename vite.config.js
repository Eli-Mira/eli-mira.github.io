import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const SITE = 'https://eli-mira.github.io/';

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

/**
 * Writes robots.txt and sitemap.xml into the build.
 *
 * They are written here rather than kept as files in public/ because the
 * same directive decides both: a reference build that asks not to be indexed
 * should not hand a search engine a sitemap pointing at it.
 */
function crawlFiles() {
  const value = process.env.PUBLIC_ROBOTS ?? 'noindex, nofollow';
  const blocked = /noindex/i.test(value);
  const robots = blocked
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`;
  const sitemap = blocked
    ? '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n'
    : `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${SITE}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`;

  return {
    name: 'crawl-files',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots });
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), robotsDirective(), crawlFiles()],
  base: './',
  server: { host: '127.0.0.1', port: 5174, strictPort: true },
  preview: { host: '127.0.0.1', port: 4179, strictPort: true },
  build: { sourcemap: false, assetsInlineLimit: 0 },
});
