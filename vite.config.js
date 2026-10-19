import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { EXTRA_HEADERS, POLICY } from './scripts/policy.mjs';

const SITE = 'https://eli-mira.github.io/';
const outDir = path.resolve('dist');

/** The sha256 of an inline script, in the form a policy uses. */
function hashInlineScript(body) {
  return `'sha256-${crypto.createHash('sha256').update(body, 'utf8').digest('base64')}'`;
}

/**
 * Writes the robots directive, the policy and the header file.
 *
 * The robots directive differs between the local reference build and the
 * published site. The build environment decides, so the same source can be
 * served privately and published publicly without a manual edit.
 */
function siteFiles() {
  const robots = process.env.PUBLIC_ROBOTS ?? 'noindex, nofollow';
  const blocked = /noindex/i.test(robots);
  let policy = POLICY;

  return {
    name: 'site-files',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];
        const hashes = scripts.map(([, body]) => hashInlineScript(body));
        policy = POLICY.replace('%SCRIPT_HASHES%', hashes.join(' '));
        return html
          .replace('%ROBOTS%', robots)
          .replace('%POLICY%', policy);
      },
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: blocked ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n` });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: blocked
          ? '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n'
          : `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${SITE}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`,
      });
    },

    // The page is not in the bundle yet when the other hooks run, so the
    // header file is written once the build has finished.
    closeBundle() {
      const page = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
      const delivered = page.match(/<meta[^>]*http-equiv="Content-Security-Policy"[^>]*>/)?.[0]
        ?.match(/content="([^"]+)"/)?.[1];
      if (!delivered) throw new Error('The built page has no content security policy.');
      const full = `${delivered}; frame-ancestors 'none'`;
      fs.writeFileSync(
        path.join(outDir, '_headers'),
        `/*\n  Content-Security-Policy: ${full}\n${EXTRA_HEADERS.map(header => `  ${header}`).join('\n')}\n`,
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteFiles()],
  base: './',
  server: { host: '127.0.0.1', port: 5174, strictPort: true },
  preview: { host: '127.0.0.1', port: 4179, strictPort: true },
  build: { sourcemap: false, assetsInlineLimit: 0 },
});
