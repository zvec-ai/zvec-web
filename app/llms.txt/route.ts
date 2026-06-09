import { SITE_URL } from '@/lib/constants';

export const revalidate = false;

export async function GET() {
    const content = `# Zvec

> Zvec is a lightweight, lightning-fast, in-process vector database by Alibaba. Built for AI applications with simple APIs, powerful indexing, and zero configuration.

Zvec runs entirely in-process — no server, daemon, or external infrastructure required. Just install the package and start indexing and querying vectors. Battle-tested across demanding production workloads within Alibaba Group.

## Docs

### Vector Database

- [Overview](${SITE_URL}/en/docs/db/): Introduction, key features, and getting started
- [Quickstart](${SITE_URL}/en/docs/db/quickstart/): Install and start searching in minutes
- [AI-Friendly Docs](${SITE_URL}/en/docs/db/ai-friendly/): How to feed Zvec docs to AI coding agents
- [Global Configuration](${SITE_URL}/en/docs/db/config/): Configure Zvec settings
- [Benchmarks](${SITE_URL}/en/docs/db/benchmarks/): Performance benchmarks

#### Concepts

- [Concepts Overview](${SITE_URL}/en/docs/db/concepts/): Core concepts of Zvec
- [Data Modeling](${SITE_URL}/en/docs/db/concepts/data-modeling/): How Zvec manages vector and scalar data
- [Vector Embedding](${SITE_URL}/en/docs/db/concepts/vector-embedding/): Understanding vector representations
- [Vector Index](${SITE_URL}/en/docs/db/concepts/vector-index/): Index types overview
  - [Flat Index](${SITE_URL}/en/docs/db/concepts/vector-index/flat-index/)
  - [HNSW Index](${SITE_URL}/en/docs/db/concepts/vector-index/hnsw-index/)
  - [HNSW-RaBitQ Index](${SITE_URL}/en/docs/db/concepts/vector-index/hnsw-rabitq-index/)
  - [IVF Index](${SITE_URL}/en/docs/db/concepts/vector-index/ivf-index/)
  - [Quantization](${SITE_URL}/en/docs/db/concepts/vector-index/quantization/)
- [Inverted Index](${SITE_URL}/en/docs/db/concepts/inverted-index/): Scalar field filtering

#### Collections

- [Collections Overview](${SITE_URL}/en/docs/db/collections/): Managing collections in Zvec
- [Create](${SITE_URL}/en/docs/db/collections/create/): Create a new collection
  - [Schema](${SITE_URL}/en/docs/db/collections/create/schema/): Define collection schema
  - [Options](${SITE_URL}/en/docs/db/collections/create/options/): Collection creation options
- [Open](${SITE_URL}/en/docs/db/collections/open/): Open an existing collection
- [Inspect](${SITE_URL}/en/docs/db/collections/inspect/): Inspect collection metadata
- [Destroy](${SITE_URL}/en/docs/db/collections/destroy/): Delete a collection
- [Optimize](${SITE_URL}/en/docs/db/collections/optimize/): Optimize collection performance
- [Schema Evolution](${SITE_URL}/en/docs/db/collections/schema-evolution/): Modify collection schema

#### Data Operations

- [Data Operations Overview](${SITE_URL}/en/docs/db/data-operations/): Working with documents in Zvec
- [Insert](${SITE_URL}/en/docs/db/data-operations/insert/): Insert documents
- [Upsert](${SITE_URL}/en/docs/db/data-operations/upsert/): Insert or update documents
- [Update](${SITE_URL}/en/docs/db/data-operations/update/): Update existing documents
- [Delete](${SITE_URL}/en/docs/db/data-operations/delete/): Delete documents
- [Query](${SITE_URL}/en/docs/db/data-operations/query/): Query overview
  - [Single Vector](${SITE_URL}/en/docs/db/data-operations/query/single-vector/): Single vector search
  - [Multi Vector](${SITE_URL}/en/docs/db/data-operations/query/multi-vector/): Multi-vector search
  - [Filter](${SITE_URL}/en/docs/db/data-operations/query/filter/): Filtered search
  - [Hybrid](${SITE_URL}/en/docs/db/data-operations/query/hybrid/): Hybrid search (dense + sparse)
  - [Group](${SITE_URL}/en/docs/db/data-operations/query/group/): Grouped search
- [Fetch](${SITE_URL}/en/docs/db/data-operations/fetch/): Fetch documents by ID

#### Building from Source

- [Building Overview](${SITE_URL}/en/docs/db/build/): Build Zvec from source
- [Python](${SITE_URL}/en/docs/db/build/python/): Build Python package from source
- [Node.js](${SITE_URL}/en/docs/db/build/node/): Build Node.js package from source

### AI Integration

- [Overview](${SITE_URL}/en/docs/ai/): Embedding models, rerankers, MCP server, and skills
- [Embedding Models](${SITE_URL}/en/docs/ai/embedding/): Convert text into vector representations
- [Reranker](${SITE_URL}/en/docs/ai/reranker/): Re-score and reorder search results
- [MCP Server](${SITE_URL}/en/docs/ai/mcp/): Expose Zvec as a tool for AI agents via MCP
- [Skills](${SITE_URL}/en/docs/ai/skills/): Define reusable, agent-friendly operations

## Per-Page Markdown

Every documentation page is available as clean markdown at a predictable URL:

- Pattern: ${SITE_URL}/mdx/{lang}/docs/{path}.md
- Example: ${SITE_URL}/mdx/en/docs/db.md
- Example: ${SITE_URL}/mdx/en/docs/db/quickstart.md

Use these URLs to feed individual pages as context to AI coding agents (Cursor, Copilot, etc.).

## Optional

- [Full documentation](${SITE_URL}/llms-full.txt): Complete documentation content in plain text
- [API Reference](${SITE_URL}/api-reference/): Python and Node.js API reference
`;

    return new Response(content, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
}
