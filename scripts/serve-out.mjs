// Tiny static server for the exported site (out/), used by Playwright and for
// local screenshots. No dependency needed: Node's http module is enough.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = join(process.cwd(), 'out');
const port = Number(process.env.PORT ?? 4173);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.json': 'application/json',
  '.pdf': 'application/pdf',
  '.webmanifest': 'application/manifest+json',
};

async function resolveFile(urlPath) {
  const safe = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '');
  let file = join(root, safe);
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    await stat(file);
    return { file, status: 200 };
  } catch {
    return { file: join(root, '404.html'), status: 404 };
  }
}

createServer(async (req, res) => {
  const { file, status } = await resolveFile(new URL(req.url ?? '/', 'http://x').pathname);
  try {
    const body = await readFile(file);
    // The OG image is exported without an extension (vercel.json sets its type too).
    const type = file.endsWith('opengraph-image') ? 'image/png' : types[extname(file)];
    res.writeHead(status, { 'content-type': type ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(500).end('Build the site first: npm run build');
  }
}).listen(port, '127.0.0.1', () => console.log(`Serving out/ on http://127.0.0.1:${port}`));
