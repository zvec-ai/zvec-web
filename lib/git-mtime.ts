import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';

// Cache git lookups to avoid spawning `git` once per page during build.
const cache = new Map<string, Date | null>();

/**
 * Return the last commit time of a file (committer-date, ISO 8601), or `null`
 * if git is unavailable / the file is untracked / the path does not exist.
 *
 * Falls back to filesystem mtime when git has no record (e.g., a newly added
 * file that hasn't been committed yet on a local dev machine). On CI this
 * fallback should not fire because all files are committed; ensure the
 * checkout step uses `fetch-depth: 0` so full history is available.
 *
 * Accepts either an absolute path or a CWD-relative path. Fumadocs' loader
 * populates `page.absolutePath` with a path relative to the project root
 * (e.g., `content/docs/en/db/quickstart.mdx`), so we rely on git's ability
 * to resolve paths against its inherited CWD (the project root during
 * `next build`) — we must NOT override that with `path.dirname(...)`.
 */
export function getGitMtime(filePath: string | undefined): Date | null {
  if (!filePath) return null;
  if (cache.has(filePath)) return cache.get(filePath) ?? null;

  let result: Date | null = null;

  if (existsSync(filePath)) {
    try {
      const out = execFileSync(
        'git',
        ['log', '-1', '--format=%cI', '--', filePath],
        {
          stdio: ['ignore', 'pipe', 'ignore'],
          encoding: 'utf-8',
        },
      ).trim();

      if (out) {
        const d = new Date(out);
        if (!Number.isNaN(d.getTime())) result = d;
      }
    } catch {
      // git not installed, not a repo, or shallow clone missing history — ignore
    }

    if (!result) {
      try {
        result = statSync(filePath).mtime;
      } catch {
        // ignore
      }
    }
  }

  cache.set(filePath, result);
  return result;
}

/**
 * Pick the latest of multiple candidate dates, ignoring falsy/invalid values.
 */
export function latestDate(
  ...candidates: Array<Date | string | undefined | null>
): Date | undefined {
  let latest: Date | undefined;
  for (const c of candidates) {
    if (!c) continue;
    const d = c instanceof Date ? c : new Date(c);
    if (Number.isNaN(d.getTime())) continue;
    if (!latest || d > latest) latest = d;
  }
  return latest;
}
