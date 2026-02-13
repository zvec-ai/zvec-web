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

This command creates a **/public/api-reference/nodejs/** directory containing all the static assets. Since the output consists only of static files, you can host it on virtually any web server or platform (e.g., GitHub Pages).
