# Zvec Website

This is a Next.js application generated with [Create Fumadocs](https://github.com/fuma-nama/fumadocs).

[Fumadocs](https://fumadocs.dev) is great!

## Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Development server

```bash
npm run dev
```

Open <http://localhost:3000/en/> with your browser to see the result.

### 3. Build and Deploy

Build [API reference](./api-reference/README.md) first, then build and deploy the website.

```bash
npm run build
npx serve@latest out
```

## Structure

Documentation is written in Markdown files located in the **/content/docs/** directory.

**Fumadocs** automatically generates both the sidebar navigation and the table of contents based on the directory structure. To customize the order of pages, use a **meta.json** file within the relevant directory.

The [API Reference](./api-reference/README.md) is automatically generated from the Zvec source code and is placed in the **api-reference/** directory.
