import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve('next/package.json'))('sharp');
import { readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('public');
let original = 0, optimized = 0, count = 0;
async function walk(folder) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) { if (entry.name !== 'mobile') await walk(file); continue; }
    if (!file.endsWith('.webp')) continue;
    const output = path.join(root, 'mobile', path.relative(root, file));
    await mkdir(path.dirname(output), { recursive: true });
    await sharp(file).resize({ width: 960, withoutEnlargement: true }).webp({ quality: 80, alphaQuality: 95 }).toFile(output);
    original += (await stat(file)).size;
    optimized += (await stat(output)).size;
    count++;
  }
}
await walk(path.join(root, 'works'));
console.log(JSON.stringify({ count, original, optimized }));
