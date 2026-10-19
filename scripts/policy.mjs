/**
 * The content security policy and the headers that go with it.
 *
 * The policy is delivered two ways. The meta tag in the page is what
 * actually reaches the browser, because GitHub Pages does not read the
 * _headers file. The _headers file carries the same policy plus the
 * directives a meta tag cannot carry, for a front end that can set them.
 *
 * The script hashes are filled in by the build, from the scripts that are
 * really in the built page, so the policy cannot stop matching them.
 */
export const POLICY = [
  "default-src 'none'",
  "script-src 'self' %SCRIPT_HASHES%",
  "style-src 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "base-uri 'none'",
  "form-action 'none'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

export const EXTRA_HEADERS = [
  'X-Content-Type-Options: nosniff',
  'X-Frame-Options: DENY',
  'Referrer-Policy: strict-origin-when-cross-origin',
  'Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy: same-origin',
  'Cross-Origin-Resource-Policy: same-origin',
  'X-XSS-Protection: 0',
];
