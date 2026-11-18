import assert from 'node:assert/strict';
import test from 'node:test';
import { fetchRepositoryInfo } from '../lib/github-info.ts';

const repository = { owner: 'alibaba', repo: 'zvec' };

test('returns repository statistics when GitHub is available', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({
    stargazers_count: 1200,
    forks_count: 80,
  }));

  assert.deepEqual(await fetchRepositoryInfo(repository), { stars: 1200, forks: 80 });
});

test('rate limiting does not prevent rendering and can recover on a later request', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({
    message: 'API rate limit exceeded',
  }, { status: 403 }));

  assert.equal(await fetchRepositoryInfo(repository), null);

  fetch.mock.mockImplementation(async () => Response.json({
    stargazers_count: 1200,
    forks_count: 80,
  }));
  assert.deepEqual(await fetchRepositoryInfo(repository), { stars: 1200, forks: 80 });
});

test('network failures do not prevent rendering', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => {
    throw new TypeError('fetch failed');
  });

  assert.equal(await fetchRepositoryInfo(repository), null);
});

test('invalid GitHub responses do not prevent rendering', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => new Response('invalid JSON'));

  assert.equal(await fetchRepositoryInfo(repository), null);

  fetch.mock.mockImplementation(async () => Response.json({ message: 'unexpected payload' }));
  assert.equal(await fetchRepositoryInfo(repository), null);
});

test('requests have a timeout and preserve a caller-provided signal', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({
    stargazers_count: 1200,
    forks_count: 80,
  }));

  await fetchRepositoryInfo(repository);
  assert.ok(fetch.mock.calls[0].arguments[1].signal instanceof AbortSignal);

  const controller = new AbortController();
  await fetchRepositoryInfo({ ...repository, fetchOptions: { signal: controller.signal } });
  assert.equal(fetch.mock.calls[1].arguments[1].signal, controller.signal);
});
