import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

/**
 * A hash of a file's content that does not depend on how the file was
 * checked out.
 *
 * Text files are hashed with their line endings normalised, because the same
 * file can arrive with CRLF on one machine and LF on another. A guard that
 * failed on that difference would report a change that was never made, which
 * is how a check like this stops being trusted. Binary files are hashed as
 * they are, because a stray byte that looks like a line ending is not one.
 */
const TEXT = new Set([
  '.css', '.html', '.ico', '.js', '.json', '.jsx', '.md', '.mjs', '.svg',
  '.txt', '.ttf', '.woff2', '.yaml', '.yml',
]);

const BINARY = new Set(['.ico', '.ttf', '.woff2']);

export function hashFile(file) {
  const bytes = fs.readFileSync(file);
  const extension = path.extname(file).toLowerCase();
  if (!TEXT.has(extension) || BINARY.has(extension)) {
    return crypto.createHash('sha256').update(bytes).digest('hex');
  }
  const text = bytes.toString('utf8').replace(/\r\n/g, '\n');
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}
