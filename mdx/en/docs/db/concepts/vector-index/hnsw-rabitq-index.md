# HNSW-RaBitQ Index (/en/docs/db/concepts/vector-index/hnsw-rabitq-index)





An advanced graph-based index that combines the [HNSW](../hnsw-index/) graph structure with [RaBitQ](https://arxiv.org/abs/2405.12497) quantization algorithm — delivering **dramatically lower memory usage** while maintaining state-of-the-art search quality.

<Callout className="text-base" type="info">
  **Platform requirement**: HNSW-RaBitQ currently supports **Linux x86\_64** only. The CPU must support **AVX2 or AVX512**. Zvec automatically selects the best runtime.
</Callout>

## How It Works [#how-it-works]

HNSW-RaBitQ combines two techniques to achieve high recall with minimal memory:

* **HNSW graph for navigation** 🪜
  * Same multi-layer graph structure as the standard [HNSW index](../hnsw-index/) — sparse upper layers for fast long-range jumps, dense lower layers for fine-grained local search.
* **RaBitQ for distance estimation** 🔍
  * RaBitQ processes the data by applying a **random rotation** to the vectors before converting them into **binary codes** (1s and 0s). This approach allows the system to estimate distances using efficient bitwise operations, significantly **reducing both memory usage and the computational cost** compared to processing full-precision numbers.

## When to Use HNSW-RaBitQ? [#when-to-use-hnsw-rabitq]

* ✅ Production systems needing fast search and high recall with controlled memory budgets
* ✅ Massive high-dimensional datasets — billion-scale vectors with 1536+ dimensions that would consume terabytes of RAM in FP32 format
* ✅ Workloads on **Linux x86\_64** servers with AVX2 or AVX512 support

<Callout className="text-base" type="idea">
  **Best Practice**: Use HNSW-RaBitQ when you want HNSW-quality search without the memory overhead.

  The `total_bits` parameter controls the accuracy–memory trade-off. According to the [paper](https://arxiv.org/abs/2405.12497), on specific datasets, **7 bits** achieves \~99% recall, **5 bits** \~95%, and **4 bits** \~90%. Going as low as **1 bit** maximizes compression at the cost of lower recall.
</Callout>

## Advantages [#advantages]

1. ✨ **Dramatically lower memory** — Quantized vectors are up to 32x smaller than FP32, reducing active index size
2. ✨ **Fast Distance Estimation** — RaBitQ supports to estimate the similarity metrics with high efficiency based on bitwise operations
3. ✨ **Promising Recall Without Re-ranking** — Graph construction uses original vectors, preserving graph quality and RaBitQ provides an asymptotically optimal error bound for reliable ordering and reranking.

## Trade-offs [#trade-offs]

1. ⚠️ **Platform constraints** — Supports Linux x86\_64 only and requires AVX2 or AVX512
2. ⚠️ **Training overhead** — Requires a KMeans training step before index construction, adding to build time
3. ⚠️ **Dimension constraints** — Only supports vectors between 64 and 4095 dimensions

## Key Parameters [#key-parameters]

<Callout className="text-base" type="idea">
  **Tuning Tip**:
  Start with the defaults (`total_bits=7`, `num_clusters=16`). Adjust `ef` first for recall/latency trade-offs at query time. Only reduce `total_bits` if you need to cut memory further and can tolerate slightly lower recall.
</Callout>

### Index-Time Parameters [#index-time-parameters]

<div className="flex flex-row flex-wrap gap-3 items-center">
  <CodeExampleLinkButton url="../../../collections/create/schema/#hnsw-rabitq-example" label="Code Example" />

  <PythonLinkButton url="/api-reference/python/params/#zvec.model.param.HnswRabitqIndexParam" label="Python API Reference" />

  <NodeJSLinkButton url="/api-reference/nodejs/interfaces/ZVecHnswRabitqIndexParams" label="Node.js API Reference" />
</div>

| Parameter         | Description                                                                                                                                        | Tuning Guidance                                                                                                                                |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `metric_type`     | Similarity metric used to compare vectors                                                                                                          | Choose based on how your embeddings were trained                                                                                               |
| `m`               | **Max neighbors per node** — The maximum number of bidirectional links created for each node during graph construction                             | • Higher `m` → <br /> ✨ better recall and graph connectivity <br /> ⚠️ more memory usage and higher latency for both indexing and search       |
| `ef_construction` | **Index-time candidate pool size** — Determines how many neighboring candidates the algorithm considers when inserting a new vector into the graph | • Higher `ef_construction` → <br /> ✨ better graph quality and higher recall <br /> ⚠️ longer index build time (*does not affect query speed*) |
| `total_bits`      | **RaBitQ quantization bits per dimension** — Controls the precision of the binary encoding                                                         | Controls the accuracy–memory trade-off. <br /> Lower values save more memory but reduce accuracy                                               |
| `num_clusters`    | **Number of KMeans clusters** — Used during the RaBitQ training phase to partition the vector space                                                | • More clusters can capture finer distribution patterns <br /> • Higher values increase recall slightly                                        |
| `sample_count`    | **Training sample count** — Number of vectors sampled for KMeans training (`0` = use all vectors)                                                  | Default is `0`. Set a smaller value (e.g. 5,000,000) to speed up training and reduce memory usage on very large datasets                       |

### Query-Time Parameters [#query-time-parameters]

<div className="flex flex-row flex-wrap gap-3 items-center">
  <CodeExampleLinkButton url="../../../data-operations/query/single-vector/#hnsw-rabitq-example" label="Code Example" />

  <PythonLinkButton url="/api-reference/python/params/#zvec.model.param.HnswRabitqQueryParam" label="Python API Reference" />

  <NodeJSLinkButton url="/api-reference/nodejs/interfaces/ZVecHnswRabitqQueryParams" label="Node.js API Reference" />
</div>

| Parameter          | Description                                                                                                                                 | Tuning Guidance                                                                                                                                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ef`               | **Query-time candidate pool size** — Determines how many potential neighbors are explored at each step during graph traversal at query time | • Higher `ef` → <br /> ✨ higher recall <br /> ⚠️ higher query latency                                                                                                                                                                             |
| `radius`           | **Distance (similarity) threshold** for range-based filtering — only documents satisfying the threshold are returned                        | Example: <br /> • With inner product `MetricType.IP`, set `radius=0.6` to keep only results with score > 0.6 <br /> ✅ Use when: You want to filter out low-quality matches <br /> 🚫 Skip when: You want all top-k results, regardless of quality |
| `is_linear`        | Forces a **brute-force linear search** instead of using the index                                                                           | 🐌 Very slow for large datasets! <br /> ✅ Only use for: Debugging, tiny collections, or verifying index accuracy                                                                                                                                  |
| `is_using_refiner` | **Enables exact score refinement** — recomputes exact FP32 distances for top candidates after quantized search                              | ✅ Turn on: When you need maximum precision <br /> ⚠️ Adds latency due to full-precision re-scoring                                                                                                                                                |
