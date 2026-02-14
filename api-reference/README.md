# Zvec API Reference

This directory contains the **source projects** used to generate Zvec API reference documentation for each supported language.

Each language's API reference is maintained as a **standalone documentation project** (with its own config, dependencies, and build steps). The projects generate **static HTML** output which is written into the website's `public/` direcotry so it can be served as static files.

## Output

Each language project builds into `public/api-reference/${language}/`, e.g., `public/api-reference/python/`.

Generated files should not be edited by hand — change the source project and rebuild instead.

## How it is Served by the Website

### When the website uses Next.js static export (`output: "export"`)

You only need to place the generated output inside `public/`.

Next.js will serve the files at the matching paths, for example, **/api-reference/index.html** is accessible at **/api-reference/**. with no additional routing configuration is required.

### When the website runs in server mode

In non-export mode, Next.js serves `public/` assets by exact file path. Requests to URLs like **/api-reference/** won't automatically resolve to the static files — even if they exist in **public/**. This is because Next.js does not enable directory-style routing (like serving **index.html** on **/api-reference/**) for arbitrary subdirectories in **public/** unless explicitly configured.

> In that case, you'll need to add custom rewrite rules in your **next.config.mjs** to map routes like **/api-reference/\*** to the appropriate **index.html** files in **/public/api-reference/**.
