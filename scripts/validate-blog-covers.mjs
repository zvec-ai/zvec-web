import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import { frontmatter } from 'fumadocs-core/content/md/frontmatter';

const ROOT = process.cwd();
const BLOG_ROOT = path.join(ROOT, 'content', 'blog');
const PUBLIC_ROOT = path.join(ROOT, 'public');
const TARGET_RATIO = 16 / 9;
const MAX_RATIO_ERROR = 0.02;
const MIN_WIDTH = 800;
const MIN_HEIGHT = 450;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  }));
  return files.flat();
}

export function readFrontmatter(source) {
  const data = frontmatter(source).data;
  return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
}

export function validateCoverFields(fields, owner) {
  const covers = [];
  const errors = [];
  const image = typeof fields.image === 'string' ? fields.image.trim() : '';

  if (!image) {
    errors.push(`${owner}: image is required and must be a local /img/blog/... path`);
  } else {
    covers.push({ key: 'image', image });
  }

  if (fields.imageDark !== undefined && fields.imageDark !== null) {
    if (typeof fields.imageDark !== 'string') {
      errors.push(`${owner}: imageDark must be a local /img/blog/... path when provided`);
    } else if (fields.imageDark.trim()) {
      covers.push({ key: 'imageDark', image: fields.imageDark.trim() });
    }
  }

  return { covers, errors };
}

function pngSize(buffer) {
  if (buffer.subarray(1, 4).toString() !== 'PNG') return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function jpegSize(buffer) {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  let offset = 2;

  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    offset += 2;
    if (marker === 0xd8 || marker === 0xd9) continue;
    const length = buffer.readUInt16BE(offset);
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return { width: buffer.readUInt16BE(offset + 5), height: buffer.readUInt16BE(offset + 3) };
    }
    offset += length;
  }
  return null;
}

function webpSize(buffer) {
  if (buffer.subarray(0, 4).toString() !== 'RIFF' || buffer.subarray(8, 12).toString() !== 'WEBP') return null;
  let offset = 12;

  while (offset + 8 <= buffer.length) {
    const type = buffer.subarray(offset, offset + 4).toString();
    const length = buffer.readUInt32LE(offset + 4);
    const data = offset + 8;

    if (type === 'VP8X' && data + 10 <= buffer.length) {
      return {
        width: 1 + buffer.readUIntLE(data + 4, 3),
        height: 1 + buffer.readUIntLE(data + 7, 3),
      };
    }
    if (type === 'VP8 ' && data + 10 <= buffer.length) {
      return {
        width: buffer.readUInt16LE(data + 6) & 0x3fff,
        height: buffer.readUInt16LE(data + 8) & 0x3fff,
      };
    }
    if (type === 'VP8L' && data + 5 <= buffer.length && buffer[data] === 0x2f) {
      const bits = buffer.readUInt32LE(data + 1);
      return {
        width: 1 + (bits & 0x3fff),
        height: 1 + ((bits >> 14) & 0x3fff),
      };
    }

    offset = data + length + (length % 2);
  }
  return null;
}

function svgSize(buffer) {
  const source = buffer.toString('utf8', 0, Math.min(buffer.length, 4096));
  if (!/<svg\b/i.test(source)) return null;
  const viewBox = source.match(/viewBox=["']\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)\s*["']/i);
  if (viewBox) return { width: Number(viewBox[1]), height: Number(viewBox[2]) };
  const width = source.match(/\bwidth=["']([\d.]+)/i);
  const height = source.match(/\bheight=["']([\d.]+)/i);
  return width && height ? { width: Number(width[1]), height: Number(height[1]) } : null;
}

function imageSize(buffer) {
  return pngSize(buffer) || jpegSize(buffer) || webpSize(buffer) || svgSize(buffer);
}

export async function validateBlogCovers() {
  const contentFiles = (await walk(BLOG_ROOT)).filter((file) => file.endsWith('.mdx'));
  const references = new Map();
  const errors = [];

  for (const contentFile of contentFiles) {
    const owner = path.relative(ROOT, contentFile);
    let fields;
    try {
      fields = readFrontmatter(await readFile(contentFile, 'utf8'));
    } catch (error) {
      errors.push(`${owner}: invalid YAML frontmatter (${error instanceof Error ? error.message : String(error)})`);
      continue;
    }

    const result = validateCoverFields(fields, owner);
    errors.push(...result.errors);
    for (const { key, image } of result.covers) {
      if (!image.startsWith('/img/blog/')) {
        errors.push(`${owner}: ${key} must be a local /img/blog/... path`);
        continue;
      }
      const owners = references.get(image) || [];
      owners.push(`${owner} (${key})`);
      references.set(image, owners);
    }
  }

  for (const [image, owners] of references) {
    const asset = path.resolve(PUBLIC_ROOT, `.${image}`);
    if (!asset.startsWith(`${PUBLIC_ROOT}${path.sep}`)) {
      errors.push(`${image}: path escapes public/`);
      continue;
    }

    let buffer;
    try {
      buffer = await readFile(asset);
    } catch {
      errors.push(`${image}: file does not exist (used by ${owners.join(', ')})`);
      continue;
    }

    const size = imageSize(buffer);
    if (!size || !Number.isFinite(size.width) || !Number.isFinite(size.height)) {
      errors.push(`${image}: unsupported image or unreadable dimensions`);
      continue;
    }

    const ratioError = Math.abs(size.width / size.height - TARGET_RATIO) / TARGET_RATIO;
    if (ratioError > MAX_RATIO_ERROR) {
      errors.push(`${image}: ${size.width}x${size.height} is not 16:9 (maximum deviation: 2%)`);
    }
    if (size.width < MIN_WIDTH || size.height < MIN_HEIGHT) {
      errors.push(`${image}: ${size.width}x${size.height} is smaller than ${MIN_WIDTH}x${MIN_HEIGHT}`);
    }
  }

  return { references, errors };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { references, errors } = await validateBlogCovers();
  if (errors.length > 0) {
    console.error('Blog cover validation failed:\n');
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log(`Validated ${references.size} blog cover assets (16:9, local, minimum ${MIN_WIDTH}x${MIN_HEIGHT}).`);
  }
}
