# Zvec Node.js API Reference

This is the official Node.js API reference documentation for the Zvec library, built using [typedoc](https://typedoc.org/).

## Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Extract Declaration File

```bash
cp node_modules/@zvec/zvec/src/index.d.ts ./
```

### 3. Build the Static Site

```bash
npx typedoc
```

This command creates a **/public/api-reference/** directory containing all the static assets. Since the output consists only of static files, you can host it on virtually any web server or platform (e.g., GitHub Pages).

> **Important**: Before running the build, ensure that the `site_url` in your **mkdocs.yml** matches the actual deployment URL path (e.g., `https://yourdomain.com/api-reference/`). If `site_url` is incorrect, MkDocs may generate relative links that break navigation or asset loading when the site is served from a subdirectory.

Because we're using Next.js with **static export** (`output: 'export'`), you only need to place the MkDocs output inside the **public/** folder. Next.js will automatically serve these files at their corresponding paths (e.g., **/api-reference/index.html** is accessible at **/api-reference/**), with no additional configuration required.

However, if you're embedding this documentation into a **Next.js app that is not statically exported** (e.g., using server-side rendering or the default server mode), requests to URLs like **/api-reference/** won't automatically resolve to the static files — even if they exist in **public/**. This is because Next.js does not enable directory-style routing (like serving **index.html** on **/api-reference/**) for arbitrary subdirectories in **public/** unless explicitly configured.

> In that case, you'll need to add custom rewrite rules in your **next.config.mjs** to map routes like **/api-reference/\*** to the appropriate **index.html** files in **/public/api-reference/**.
