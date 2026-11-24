# Product Quantization (PQ) (/en/docs/db/concepts/vector-index/quantization/product-quantization)





[Product Quantization (PQ)](https://doi.org/10.1109/TPAMI.2010.57) splits each vector into `num_chunk` subvectors and represents each subvector with a code from a trained codebook. Unlike [scalar quantization](../scalar-quantization/), which compresses individual dimensions, PQ compresses groups of dimensions.

Zvec supports PQ with **HNSW and IVF**, **dense FP32 vectors**, and **L2, IP, and COSINE** metrics.

<Callout className="text-base" type="info">
  Python supports HNSW/IVF PQ starting with **0.8.1**. **Node.js SDK 0.8.0** does not expose PQ configuration. The examples on this page use the Python API.
</Callout>

## Code Size and Accuracy [#code-size-and-accuracy]

Choose the **code width** first, then optional optimizations. These are separate configuration decisions, not four alternative quantization methods.

1. **Choose PQ4 or PQ8** with `num_bits`: PQ4 uses 4 bits per subvector (16 codebook entries); PQ8 uses 8 bits (256 entries).
2. **Optionally enable [OPQ](https://www.cv-foundation.org/openaccess/content_cvpr_2013/papers/Ge_Optimized_Product_Quantization_2013_CVPR_paper.pdf)** with `enable_rotate=True`. Optimized Product Quantization learns a rotation to reduce quantization error and can be combined with either code width.
3. **For IVF-PQ4, optionally enable [FastScan](https://www.vldb.org/pvldb/vol9/p288-andre.pdf)** with `fast_scan=True` to scan packed codes. See the [Faiss FastScan documentation](https://github.com/facebookresearch/faiss/wiki/Fast-accumulation-of-PQ-and-AQ-codes-%28FastScan%29) for background on 4-bit codes and register-based lookup tables. In Zvec, this option requires IVF and `num_bits=4`; it does not apply to HNSW or PQ8.

The code payload per vector is approximately `num_chunk × num_bits / 8` bytes. For example, a 768-dimensional FP32 vector occupies 3,072 bytes before compression; with 96 chunks, its PQ8 code occupies 96 bytes and its PQ4 code occupies 48 bytes. These figures exclude codebooks, index structures, metadata, and retained original vectors; they are **not total collection memory or disk sizes**.

More chunks or more bits generally preserve more information at a higher storage and computation cost. Measure recall and latency on your own data when choosing a configuration.

## Configuration [#configuration]

| Parameter       | Default | Meaning and Constraints                                                                                                                   |
| --------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `num_chunk`     | `8`     | Number of subvectors. Must be positive and no greater than the vector dimension. With PQ4, the dimension must be divisible by this value. |
| `num_bits`      | `8`     | Bits per subvector code: `4` or `8`.                                                                                                      |
| `enable_rotate` | `False` | Enables learned OPQ for PQ. This differs from the random rotation used by INT8/INT4 scalar quantization.                                  |
| `fast_scan`     | `False` | Enables FastScan. Requires **IVF with PQ4**; HNSW and PQ8 do not support it.                                                              |
| `opq_iter`      | `5`     | OPQ training iterations. Must be positive when OPQ is enabled.                                                                            |
| `opq_pq_iter`   | `4`     | PQ training iterations within each OPQ iteration. Must be positive when OPQ is enabled.                                                   |

For IVF-PQ4 FastScan, use `IVFIndexParam` with `quantize_type=QuantizeType.PQ` and `QuantizerParam(num_chunk=16, num_bits=4, fast_scan=True)` for a 128-dimensional field. Add `enable_rotate=True` only if OPQ is desired. See the [platform matrix](../../../../platforms/#index-availability) for per-platform availability.

## FastScan Execution Paths [#fastscan-execution-paths]

**Feature availability and SIMD acceleration are distinct.** FastScan is available only with IVF-PQ4. The [v0.8.1 kernel dispatcher](https://github.com/alibaba/zvec/blob/v0.8.1/src/turbo/turbo.cc#L705) selects an implementation based on CPU capabilities:

| CPU Capabilities                  | FastScan Execution Path |
| --------------------------------- | ----------------------- |
| x86\_64 with AVX512F and AVX512BW | AVX-512                 |
| x86\_64 with AVX2                 | AVX2                    |
| ARM64 with NEON                   | NEON                    |
| No matching SIMD path             | Scalar fallback         |

The build must also include the relevant SIMD implementation. Missing a listed instruction set does not by itself make PQ or FastScan unavailable: the implementation provides a scalar fallback. Scalar fallback does not imply equal performance across CPUs.

## Training and Lifecycle [#training-and-lifecycle]

PQ training runs during `Collection.optimize()`. Before optimization, untrained data remains searchable through the raw Flat index. Insert representative data before optimizing; creating a PQ schema alone does not build a trained compressed index.

Trained codebooks and quantizer settings persist when the collection is closed and reopened. Writable collections also support subsequent updates; optimization can train and rebuild indexes as data changes.

To use ordinary IVF-PQ4, set `fast_scan=False`; to use IVF-PQ8, also set `num_bits=8`.

## Query and Refine Results [#query-and-refine-results]

<div className="flex flex-row flex-wrap gap-3 items-center">
  <CodeExampleLinkButton url="../../../../data-operations/query/single-vector/#query-refinement" label="Code Example" />
</div>

PQ search uses approximate distances. Enable `is_using_refiner` to re-score candidates using the reference vectors. `scale_factor` controls candidate expansion: a value of 4 requests approximately four times `topk` candidates before refinement.

Refinement adds reference-vector reads and scoring work. It improves ranking within the retrieved candidate set but cannot recover neighbors that were never retrieved. Tune HNSW `ef` or IVF `nprobe` together with `scale_factor`, measuring recall and latency.

See [HNSW](../../hnsw-index/), [IVF](../../ivf-index/), and [collection optimization](../../../../collections/optimize/) for the surrounding index lifecycle.

## Enabling Quantization [#enabling-quantization]

<div className="flex flex-row flex-wrap gap-3 items-center">
  <CodeExampleLinkButton url="../../../../collections/create/schema/#pq-example" label="Code Example" />

  <PythonLinkButton url="/api-reference/python/params/#zvec.model.param.QuantizerParam" label="Python API Reference" />
</div>

In the `HnswIndexParam` or `IVFIndexParam` passed to `VectorSchema.index_param&#x60;, set &#x2A;*`quantize_type=zvec.QuantizeType.PQ`** and pass a `zvec.QuantizerParam` through `quantizer_param` to configure PQ.

After configuring the schema, insert representative data and call `collection.optimize()` to train the codebooks and build the PQ index. Queries before optimization use the original Flat index. See the [HNSW-PQ8 creation example](../../../../collections/create/schema/#pq-example) for the complete workflow.

## Enabling Rotation [#enabling-rotation]

<div className="flex flex-row flex-wrap gap-3 items-center">
  <PythonLinkButton url="/api-reference/python/params/#zvec.model.param.QuantizerParam" label="Python API Reference" />
</div>

When using PQ, set &#x2A;*`enable_rotate=True`** in the index parameters' `quantizer_param` to enable &#x2A;*Optimized Product Quantization (OPQ)**. OPQ learns a rotation from the training data to reduce quantization error; INT8/INT4 scalar quantization uses a random orthogonal rotation. This option defaults to `False`, works with PQ4 or PQ8, and can be enabled independently of IVF-PQ4 FastScan.

After inserting representative data, call `collection.optimize()` to run training. OPQ adds training work; `opq_iter` and `opq_pq_iter` control the iteration counts. Measure recall and training time on your own data when evaluating OPQ.
