#!/usr/bin/env node
/**
 * Image optimisation script for the marketing site.
 *
 * Converts the heavy PNG/JPEG assets that ship in `public/assets/` to
 * smaller WebP variants. Run with:
 *
 *   npx tsx scripts/optimize-assets.mjs        # dry-run, prints sizes
 *   npx tsx scripts/optimize-assets.mjs --write # actually writes the .webp
 *
 * Or (no global tooling):
 *
 *   npm i -D sharp
 *   node scripts/optimize-assets.mjs --write
 *
 * The script does NOT delete the source files — it just emits a `.webp`
 * sibling next to each. After verifying the output, you can either:
 *
 *   (a) Update the relevant `<img>`/CSS refs to point at the .webp files
 *       (recommended — keep the PNG as a `<picture>` fallback).
 *   (b) Replace the original entirely if you don't need the PNG fallback.
 *
 * Targets here are the 3 biggest unoptimised raster files. logo-gradient.svg
 * is 6.3 MB but it's an SVG with embedded raster — the right fix there is to
 * rebuild the SVG without the raster (svgo + manual cleanup), not WebP it.
 */

import sharp from 'sharp';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, '..');

const TARGETS = [
  // [source, output, options]
  {
    src: 'public/assets/hero-bg-new.png',
    out: 'public/assets/hero-bg-new.webp',
    quality: 82,
    // Used as a full-bleed hero on 18 marketing pages — keep it sharp.
  },
  {
    src: 'public/assets/teammate-avatar-round.png',
    out: 'public/assets/teammate-avatar-round.webp',
    quality: 88,
    resize: 192, // displayed at ~64px max; 3× for retina is plenty.
  },
  {
    src: 'public/assets/hero-bg-option-1.jpeg',
    out: 'public/assets/hero-bg-option-1.webp',
    quality: 80,
  },
];

const write = process.argv.includes('--write');

const fmt = (n) => (n / 1024).toFixed(1) + ' KB';
let totalSrc = 0;
let totalOut = 0;

for (const t of TARGETS) {
  const srcPath = resolve(ROOT, t.src);
  const outPath = resolve(ROOT, t.out);

  if (!existsSync(srcPath)) {
    console.log(`⏭  SKIP  ${t.src} (missing)`);
    continue;
  }

  const srcBytes = statSync(srcPath).size;
  totalSrc += srcBytes;

  let pipeline = sharp(readFileSync(srcPath));
  if (t.resize) pipeline = pipeline.resize(t.resize, t.resize, { fit: 'cover' });
  pipeline = pipeline.webp({ quality: t.quality });

  const outBuf = await pipeline.toBuffer();
  totalOut += outBuf.length;

  const pct = ((1 - outBuf.length / srcBytes) * 100).toFixed(0);
  const verb = write ? '✓ WROTE' : '· dry  ';
  console.log(`${verb}  ${t.src.padEnd(45)}  ${fmt(srcBytes).padStart(10)}  →  ${fmt(outBuf.length).padStart(10)}  (−${pct}%)`);

  if (write) {
    const { writeFileSync } = await import('node:fs');
    writeFileSync(outPath, outBuf);
  }
}

console.log('\n' + '─'.repeat(72));
const totalPct = totalSrc > 0 ? ((1 - totalOut / totalSrc) * 100).toFixed(0) : 0;
console.log(`  total: ${fmt(totalSrc)} → ${fmt(totalOut)} (−${totalPct}%)`);
if (!write) console.log('\n  re-run with --write to actually emit the .webp files.');
