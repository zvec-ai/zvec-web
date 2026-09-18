# Quantization (/en/docs/db/concepts/vector-index/quantization)







Quantization is a compression technique that &#x2A;**transforms vectors from their original (specifically FP32) format into a more compact representation***, reducing the size of vector indexes used for search.

This transformation approximates vectors using fewer bits per dimension — enabling:

* ✨ Lower **memory footprint** — especially when the index is memory-resident,
* ✨ Faster I/O and lower query latency — due to reduced data movement and efficient integer/fp16 arithmetic,
* ✨ Better scalability on resource-constrained hardware.

<img alt="Quantization" src="__img0" />

<Callout className="text-base" type="warn">
  **Important**:

  * Quantization is a &#x2A;**lossy and irreversible*** compression method. It improves runtime efficiency **at the cost of potentially reduced recall accuracy**. Always validate its effect on your retrieval quality.
  * Quantization only provides benefits when applied to vectors in a **FP32** format.
</Callout>

## Storage Behavior [#storage-behavior]

To ensure data integrity and flexibility, **Zvec stores both the original vectors and their quantized versions**. This means:

* The **overall on-disk storage usage may increase** (due to storing two copies).
* However, **only the quantized vectors are loaded into memory for indexing and search**, significantly reducing the active index size.
* Users can always **retrieve the original, unaltered vectors** when needed.

## Enabling Quantization [#enabling-quantization]

<div className="flex flex-row flex-wrap gap-3 items-center">
  <PythonLinkButton url="/api-reference/python/schema/#zvec.model.schema.VectorSchema" label="Python API Reference" />

  <NodeJSLinkButton url="/api-reference/nodejs/interfaces/ZVecVectorSchema" label="Node.js API Reference" />
</div>

You can enable quantization at the time of vector index creation by selecting your preferred quantization type — e.g., `FP16`, `INT8`, or `INT4` — &#x2A;*using the `quantize_type` parameter in your `VectorSchema`**.

Once set, Zvec automatically generates and manages the quantized representation alongside your original vectors.

***

## Quantization Types [#quantization-types]

### FP16 (Half-Precision Floating Point) [#fp16-half-precision-floating-point]

Uses 16-bit floating-point numbers to reduce memory footprint and accelerate computation while maintaining high numerical precision. Ideal for applications requiring near-FP32 accuracy with improved efficiency. Requires conversion from FP32 source.

### INT8 (8-Bit Integer Quantization) [#int8-8-bit-integer-quantization]

Represents vectors using 8-bit integers, significantly reducing storage and memory bandwidth requirements. Offers a good trade-off between speed, size, and retrieval accuracy for many similarity search tasks. Requires conversion from FP32 source.

### INT4 (4-Bit Integer Quantization) [#int4-4-bit-integer-quantization]

Ultra-compact representation using only 4 bits per dimension. Maximizes storage density and inference speed, suitable for latency-sensitive or resource-constrained environments where noticeable accuracy loss is acceptable. Requires conversion from FP32 source.

## Enabling Rotation [#enabling-rotation]

<div className="flex flex-row flex-wrap gap-3 items-center">
  <PythonLinkButton url="/api-reference/python/schema/#zvec.model.schema.VectorSchema" label="Python API Reference" />

  <NodeJSLinkButton url="/api-reference/nodejs/interfaces/ZVecVectorSchema" label="Node.js API Reference" />
</div>

When using `INT8` or `INT4` quantization, you can &#x2A;*set `enable_rotate=True` via the `quantizer_param` parameter in your `VectorSchema`** to enable rotation. This applies a random orthogonal rotation to vectors before quantization, making the distribution across dimensions more uniform, which reduces information loss during quantization and improves the recall of the quantized index.
