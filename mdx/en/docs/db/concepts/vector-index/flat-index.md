# Flat Index (/en/docs/db/concepts/vector-index/flat-index)



## How It Works [#how-it-works]

Performs an exact (brute-force) similarity search by comparing the query vector against every vector in the dataset.

## When to Use a Flat Index [#when-to-use-a-flat-index]

* ✅ Small datasets
* ✅ Prototyping and experimentation
* ✅ Evaluation baselines
* ✅ Scenarios where 100% recall is non-negotiable

<Callout className="text-base" type="idea">
  **Best Practice**: Start with Flat Index during development and testing — it's your reliability anchor. Once you validate your approach, consider approximate indexes (like [HNSW](../hnsw-index/)) for production-scale performance. Use the Flat index when working with tiny datasets (e.g., under 300k vectors) where correctness outweighs speed.
</Callout>

## Advantages [#advantages]

1. ✨ **Perfect Recall Guarantee** — Finds true nearest neighbors
2. ✨ **Zero Configuration** — Simple setup with no tuning required
3. ✨ **Instant Indexing** — Build time is virtually immediate

## Limitations [#limitations]

⚠️ Search latency grows linearly with dataset size — making it impractical for large-scale workloads.
