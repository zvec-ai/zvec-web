import { SITE_URL } from '@/lib/constants';
import { getGitMtime, latestDate } from '@/lib/git-mtime';
import { i18n } from '@/lib/i18n';
import { blog, source } from '@/lib/source';
import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const BUILD_TIME = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Home pages — composed from many source files (layouts, components,
  // translations); no single reliable "last modified" signal. Per Google's
  // sitemap guidelines, omit `lastmod` rather than provide an inaccurate value.
  for (const lang of i18n.languages) {
    entries.push({ url: `${SITE_URL}/${lang}/` });
  }

  // API reference pages — content is generated at build time from external
  // packages (zvec pip/npm); no in-repo source file reflects its true mtime.
  // Omit `lastmod` for the same reason as the home pages.
  for (const lang of i18n.languages) {
    entries.push({ url: `${SITE_URL}/${lang}/api-reference/` });
  }

  // Documentation pages — lastmod from git commit time of the source MDX.
  for (const lang of i18n.languages) {
    for (const page of source.getPages(lang)) {
      const mtime = getGitMtime(page.absolutePath);
      entries.push({
        url: `${SITE_URL}${page.url}/`,
        lastModified: mtime ?? BUILD_TIME,
      });
    }
  }

  // Blog index — newest of (any post's git mtime | frontmatter date).
  for (const lang of i18n.languages) {
    const posts = blog.getPages(lang);
    const latest = latestDate(
      ...posts.flatMap((p) => [
        getGitMtime(p.absolutePath),
        p.data.date,
      ]),
    );
    entries.push({
      url: `${SITE_URL}/${lang}/blog/`,
      lastModified: latest ?? BUILD_TIME,
    });
  }

  // Blog posts — max(git mtime, frontmatter date) so edits bump lastmod
  // while still reflecting the publication date for never-edited posts.
  for (const lang of i18n.languages) {
    for (const post of blog.getPages(lang)) {
      const last = latestDate(getGitMtime(post.absolutePath), post.data.date);
      entries.push({
        url: `${SITE_URL}${post.url}/`,
        lastModified: last ?? BUILD_TIME,
      });
    }
  }

  return entries;
}
