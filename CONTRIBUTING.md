# Blog contribution guide

Every post must provide a repository-hosted cover image. The blog index uses one predictable presentation rule for every cover, so article-specific fit overrides are not supported.

## Cover requirements

- Store cover assets under `public/img/blog/<post-slug>/` and reference them with `/img/blog/<post-slug>/<file>`.
- Use a 16:9 landscape canvas. Recommended export size: `1600x900` or `1920x1080`; minimum accepted size: `800x450`.
- Keep titles, logos, diagrams, and other essential content inside a 7% safe margin. Covers are displayed with `object-fit: cover` and may lose a very small edge area because of responsive rounding.
- Prefer providing both `image` and `imageDark`, designed for light and dark page backgrounds respectively. Both covers must use the same dimensions, composition, and safe-area rules.
- Do not use remote image URLs or add per-post CSS/object-fit exceptions.

## Frontmatter

```yaml
---
title: "Post title"
date: "YYYY-MM-DD"
image: /img/blog/YYYY-MM-DD-post-slug/header.webp
imageDark: /img/blog/YYYY-MM-DD-post-slug/header-dark.webp # optional
description: "Short summary"
---
```

## Before opening a PR

Run:

```bash
npm run blog:covers:check
npm run types:check
npm run build
```

`npm run build` also runs the cover check. A blog PR with a missing, remote, undersized, or incorrectly proportioned cover will fail CI before deployment.
