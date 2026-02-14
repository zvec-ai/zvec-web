# Zvec Python API Reference

This is the official Python API reference documentation for the Zvec library, built using [MkDocs](https://www.mkdocs.org/) and the [Material for MkDocs theme](https://squidfunk.github.io/mkdocs-material/).

## Instructions

### 1. Install Dependencies

```bash
pip install mkdocs-material
pip install 'mkdocstrings[python]'
pip install black
```

### 2. Start the Development Server

```bash
mkdocs serve
```

Your site will be available at <http://127.0.0.1:8000>.

### 3. Build the Static Site

```bash
mkdocs build
```

This command creates a **/public/api-reference/python/** directory containing all the static assets. Since the output consists only of static files, you can host it on virtually any web server or platform (e.g., GitHub Pages).

> **Important**: Before running the build, ensure that the `site_url` in your **mkdocs.yml** matches the actual deployment URL path (e.g., `https://yourdomain.com/api-reference/python/`). If `site_url` is incorrect, MkDocs may generate relative links that break navigation or asset loading when the site is served from a subdirectory.
