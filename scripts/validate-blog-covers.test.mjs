import assert from 'node:assert/strict';
import test from 'node:test';
import { readFrontmatter, validateCoverFields } from './validate-blog-covers.mjs';

test('parses blog cover fields with standard YAML semantics', () => {
  const cases = [
    ['image: /img/blog/post/header.webp', '/img/blog/post/header.webp'],
    ['image: "/img/blog/post/header.webp"', '/img/blog/post/header.webp'],
    ['image: /img/blog/post/header.webp # primary cover', '/img/blog/post/header.webp'],
  ];

  for (const [field, expected] of cases) {
    const fields = readFrontmatter(`---\n${field}\n---\n`);
    assert.equal(fields.image, expected);
  }

  const fields = readFrontmatter('---\nimage: /img/blog/post/header.webp\n---\n');
  assert.equal(fields.imageDark, undefined);
});

test('requires a non-empty primary image', () => {
  for (const fields of [
    {},
    { image: '' },
    { imageDark: '/img/blog/post/header-dark.webp' },
  ]) {
    const result = validateCoverFields(fields, 'post.mdx');
    assert.equal(result.errors.length, 1);
    assert.match(result.errors[0], /image is required/);
  }
});

test('allows a primary image without a dark variant', () => {
  const result = validateCoverFields({ image: '/img/blog/post/header.webp' }, 'post.mdx');
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.covers, [
    { key: 'image', image: '/img/blog/post/header.webp' },
  ]);
});
