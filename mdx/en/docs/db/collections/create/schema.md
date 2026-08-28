# Schema (/en/docs/db/collections/create/schema)





A **collection schema** `CollectionSchema` defines the structure that every [document](../../../concepts/data-modeling/#documents) inserted into the collection must conform to.

<Callout className="text-base" type="success">
  The schema in Zvec is **dynamic**: you can add or remove scalar fields and vectors at any time without rebuilding the collection.
</Callout>

`CollectionSchema` has three parts:

1. `name`: An identifier for the collection.
2. `fields`: A list of scalar fields.
3. `vectors`: A list of vector fields.

<div className="fd-steps">
  <div className="fd-step">
    ## Collection Name [#collection-name-step]

    A human-readable identifier for your collection. This name is used internally for reference and logging.
  </div>

  <div className="fd-step">
    ## Scalar Fields [#scalar-fields-step]

    Scalar fields store non-vector (i.e., structured) data — such as strings, numbers, booleans, or arrays.

    Each field is defined using `FieldSchema` with the following properties:

    1. `name`: A unique string identifier for the field within the collection.
    2. [`data_type`](../../../concepts/data-modeling/#scalar-types): The type of data stored — e.g., `STRING`, `INT64`, or array types like `ARRAY_STRING`.
    3. `nullable` (optional): Whether the field is allowed to **have no value** (defaults to `False`).
    4. `index_param` (optional): Enables fast filtering via `InvertIndexParam` ([inverted index](../../../concepts/inverted-index/)) or full-text search via `FtsIndexParam` ([full-text index](../../../concepts/fts-index/)).

    <div className="flex flex-row flex-wrap gap-3 items-center mb-6">
      <PythonLinkButton url="/api-reference/python/schema/#zvec.model.schema.FieldSchema" label="Python API Reference" />

      <NodeJSLinkButton url="/api-reference/nodejs/interfaces/ZVecFieldSchema" label="Node.js API Reference" />
    </div>

    <Accordions type="multiple">
      <Accordion title="Tips">
        Add an index to fields you plan to filter on. Unindexed fields save storage and write overhead.

        For **inverted indexes** (`InvertIndexParam`), you can optionally activate performance-enhancing (but storage-costly) features:

        * `enable_range_optimization=True` → faster range queries (e.g., `price > 100`)
        * `enable_extended_wildcard=True` → complex string pattern matching (e.g., `name LIKE 'abc%def'`)

        For **full-text indexes** (`FtsIndexParam`), configure the tokenizer and token filters instead. See [full-text search](../../../data-operations/query/fts/#defining-an-fts-field) for details.
      </Accordion>

      <Accordion title="Inverted Index Example" id="inverted-index-example">
        <CodeBlockTabs defaultValue="Python" groupId="code-demo">
          <CodeBlockTabsList>
            <CodeBlockTabsTrigger value="Python">
              Python
            </CodeBlockTabsTrigger>

            <CodeBlockTabsTrigger value="Node.js">
              Node.js
            </CodeBlockTabsTrigger>
          </CodeBlockTabsList>

          <CodeBlockTab value="Python">
            ```python  title="Define a scalar field with inverted index" 
            import zvec

            # [!code word:InvertIndexParam]
            field_schema = zvec.FieldSchema(  # [!code highlight]
                name="string_field_example",
                data_type=zvec.DataType.STRING,
                nullable=True,
                # Enables fast filtering; range queries are supported but unoptimized
                index_param=zvec.InvertIndexParam(enable_range_optimization=False),
            )
            ```
          </CodeBlockTab>

          <CodeBlockTab value="Node.js">
            ```ts  title="Define a scalar field with inverted index"
            import { ZVecDataType, ZVecFieldSchema, ZVecIndexType } from "@zvec/zvec";

            const fieldSchema: ZVecFieldSchema = {  // [!code highlight]
                name: "string_field_example",
                dataType: ZVecDataType.STRING,
                nullable: true,
                // [!code word:INVERT]
                // Enables fast filtering; range queries are supported but unoptimized
                indexParams: { indexType: ZVecIndexType.INVERT, enableRangeOptimization: false }
            };
            ```
          </CodeBlockTab>
        </CodeBlockTabs>
      </Accordion>

      <Accordion title="Full-Text Index Example" id="fts-example">
        <CodeBlockTabs defaultValue="Python" groupId="code-demo">
          <CodeBlockTabsList>
            <CodeBlockTabsTrigger value="Python">
              Python
            </CodeBlockTabsTrigger>

            <CodeBlockTabsTrigger value="Node.js">
              Node.js
            </CodeBlockTabsTrigger>
          </CodeBlockTabsList>

          <CodeBlockTab value="Python">
            ```python  title="Define a field with full-text index" 
            import zvec

            # [!code word:FtsIndexParam]
            fts_field = zvec.FieldSchema(  # [!code highlight]
                name="content",
                data_type=zvec.DataType.STRING,
                nullable=False,
                index_param=zvec.FtsIndexParam(  # [!code highlight]
                    tokenizer_name="standard",
                ),
            )
            ```
          </CodeBlockTab>

          <CodeBlockTab value="Node.js">
            ```ts  title="Define a field with full-text index"
            import { ZVecDataType, ZVecFieldSchema, ZVecIndexType } from "@zvec/zvec";

            const ftsField: ZVecFieldSchema = {  // [!code highlight]
                name: "content",
                dataType: ZVecDataType.STRING,
                nullable: false,
                // [!code word:FTS]
                indexParams: {
                    indexType: ZVecIndexType.FTS,
                    tokenizerName: "standard"
                }
            };
            ```
          </CodeBlockTab>
        </CodeBlockTabs>
      </Accordion>
    </Accordions>
  </div>

  <div className="fd-step">
    ## Vectors (Embeddings) [#vectors-embeddings-step]

    A vector is defined using `VectorSchema` with the following properties:

    1. `name`: A unique string identifier for the vector within the collection.
    2. [`data_type`](../../../concepts/data-modeling/#vector-types): The numeric format of the vector.
       * [Dense vectors](../../../concepts/vector-embedding/#dense-vectors): `VECTOR_FP32`, `VECTOR_FP16`, etc.
       * [Sparse vectors](../../../concepts/vector-embedding/#sparse-vectors): `SPARSE_VECTOR_FP32`, `SPARSE_VECTOR_FP16`.
    3. `dimension`: Required for dense vectors — the number of dimensions.
    4. `index_param`: Configures the vector index type and similarity metric.

    <div className="flex flex-row flex-wrap gap-3 items-center">
      <PythonLinkButton url="/api-reference/python/schema/#zvec.model.schema.VectorSchema" label="Python API Reference" />

      <NodeJSLinkButton url="/api-reference/nodejs/interfaces/ZVecVectorSchema" label="Node.js API Reference" />
    </div>

    ### Choosing Vector Index Type [#choosing-vector-index-type]

    The `index_param` allows you to configure the appropriate indexing strategy:

    * `metric_type`: `COSINE`, `L2`, or `IP` (inner product) — &#x2A;Ensure your metric matches how your embeddings were trained!*
    * [`quantize_type`](../../../concepts/vector-index/quantization/) (optional): Compress vectors to reduce index size and speed up search (with slight [recall](../../../concepts/vector-index/#recall-measuring-approximation-quality) trade-off).
    * [`quantizer_param`](../../../concepts/vector-index/quantization/) (optional): Additional quantizer parameters, e.g. `enable_rotate` (reduces quantization recall loss via random rotation).

    <Accordions type="multiple">
      <Accordion title="Flat Index Example">
        Use `FlatIndexParam()` for Flat index configuration.

        <CodeBlockTabs defaultValue="Python" groupId="code-demo">
          <CodeBlockTabsList>
            <CodeBlockTabsTrigger value="Python">
              Python
            </CodeBlockTabsTrigger>

            <CodeBlockTabsTrigger value="Node.js">
              Node.js
            </CodeBlockTabsTrigger>
          </CodeBlockTabsList>

          <CodeBlockTab value="Python">
            ```python  title="Define a vector embedding" 
            import zvec

            vector_schema = zvec.VectorSchema(  # [!code highlight]
                name="dense_vector_example",
                data_type=zvec.DataType.VECTOR_FP32,
                dimension=768,
                # [!code word:FlatIndexParam]
                index_param=zvec.FlatIndexParam(metric_type=zvec.MetricType.COSINE),
            )
            ```
          </CodeBlockTab>

          <CodeBlockTab value="Node.js">
            ```ts  title="Define a vector embedding"
            import { ZVecDataType, ZVecIndexType, ZVecMetricType, ZVecVectorSchema } from "@zvec/zvec";

            const vectorSchema: ZVecVectorSchema = {  // [!code highlight]
                name: "dense_vector_example",
                dataType: ZVecDataType.VECTOR_FP32,
                dimension: 768,
                // [!code word:FLAT]
                indexParams: { indexType: ZVecIndexType.FLAT, metricType: ZVecMetricType.COSINE }
            };
            ```
          </CodeBlockTab>
        </CodeBlockTabs>
      </Accordion>

      <Accordion title="HNSW Index Example" id="hnsw-example">
        Use [`HnswIndexParam()`](../../../concepts/vector-index/hnsw-index/#index-time-parameters) for HNSW index configuration.

        <CodeBlockTabs defaultValue="Python" groupId="code-demo">
          <CodeBlockTabsList>
            <CodeBlockTabsTrigger value="Python">
              Python
            </CodeBlockTabsTrigger>

            <CodeBlockTabsTrigger value="Node.js">
              Node.js
            </CodeBlockTabsTrigger>
          </CodeBlockTabsList>

          <CodeBlockTab value="Python">
            ```python  title="Define a vector embedding" 
            import zvec

            vector_schema = zvec.VectorSchema(  # [!code highlight]
                name="dense_vector_example",
                data_type=zvec.DataType.VECTOR_FP32,
                dimension=768,
                # [!code word:HnswIndexParam]
                index_param=zvec.HnswIndexParam(
                    metric_type=zvec.MetricType.COSINE,
                    ef_construction=700,
                    quantize_type=zvec.QuantizeType.INT8,
                    quantizer_param=zvec.QuantizerParam(enable_rotate=True),
                ),
            )
            ```
          </CodeBlockTab>

          <CodeBlockTab value="Node.js">
            ```ts  title="Define a vector embedding"
            import {
                ZVecDataType,
                ZVecIndexType,
                ZVecMetricType,
                ZVecQuantizeType,
                ZVecVectorSchema,
            } from "@zvec/zvec";

            const vectorSchema: ZVecVectorSchema = {  // [!code highlight]
                name: "dense_vector_example",
                dataType: ZVecDataType.VECTOR_FP32,
                dimension: 768,
                // [!code word:HNSW]
                indexParams: {
                    indexType: ZVecIndexType.HNSW,
                    metricType: ZVecMetricType.COSINE,
                    efConstruction: 700,
                    quantizeType: ZVecQuantizeType.INT8,
                    quantizerParams: { enableRotate: true },
                },
            };
            ```
          </CodeBlockTab>
        </CodeBlockTabs>
      </Accordion>

      <Accordion title="HNSW-RaBitQ Index Example" id="hnsw-rabitq-example">
        Use [`HnswRabitqIndexParam()`](../../../concepts/vector-index/hnsw-rabitq-index/#index-time-parameters) for HNSW-RaBitQ index configuration. This index combines HNSW graph navigation with RaBitQ quantization for lower memory usage.

        <Callout className="text-base" type="info">
          HNSW-RaBitQ is available only on **Linux x86\_64** with AVX2 or AVX512 support. Zvec automatically selects the best runtime.
        </Callout>

        <CodeBlockTabs defaultValue="Python" groupId="code-demo">
          <CodeBlockTabsList>
            <CodeBlockTabsTrigger value="Python">
              Python
            </CodeBlockTabsTrigger>

            <CodeBlockTabsTrigger value="Node.js">
              Node.js
            </CodeBlockTabsTrigger>
          </CodeBlockTabsList>

          <CodeBlockTab value="Python">
            ```python  title="Define a vector embedding" 
            import zvec

            vector_schema = zvec.VectorSchema(  # [!code highlight]
                name="dense_vector_example",
                data_type=zvec.DataType.VECTOR_FP32,
                dimension=768,
                # [!code word:HnswRabitqIndexParam]
                index_param=zvec.HnswRabitqIndexParam(
                    metric_type=zvec.MetricType.COSINE,
                    total_bits=7,
                    num_clusters=64,
                ),
            )
            ```
          </CodeBlockTab>

          <CodeBlockTab value="Node.js">
            ```ts  title="Define a vector embedding"
            import { ZVecDataType, ZVecIndexType, ZVecMetricType, ZVecVectorSchema } from "@zvec/zvec";

            const vectorSchema: ZVecVectorSchema = {  // [!code highlight]
                name: "dense_vector_example",
                dataType: ZVecDataType.VECTOR_FP32,
                dimension: 768,
                // [!code word:HNSW_RABITQ]
                indexParams: {
                    indexType: ZVecIndexType.HNSW_RABITQ,
                    metricType: ZVecMetricType.COSINE,
                    totalBits: 7,
                    numClusters: 64
                }
            };
            ```
          </CodeBlockTab>
        </CodeBlockTabs>
      </Accordion>

      <Accordion title="IVF Index Example" id="ivf-example">
        Use [`IVFIndexParam()`](../../../concepts/vector-index/ivf-index/#index-time-parameters) for IVF index configuration.

        <CodeBlockTabs defaultValue="Python" groupId="code-demo">
          <CodeBlockTabsList>
            <CodeBlockTabsTrigger value="Python">
              Python
            </CodeBlockTabsTrigger>

            <CodeBlockTabsTrigger value="Node.js">
              Node.js
            </CodeBlockTabsTrigger>
          </CodeBlockTabsList>

          <CodeBlockTab value="Python">
            ```python  title="Define a vector embedding" 
            import zvec

            vector_schema = zvec.VectorSchema(  # [!code highlight]
                name="dense_vector_example",
                data_type=zvec.DataType.VECTOR_FP32,
                dimension=768,
                # [!code word:IVFIndexParam]
                index_param=zvec.IVFIndexParam(metric_type=zvec.MetricType.COSINE, n_list=1000),
            )
            ```
          </CodeBlockTab>

          <CodeBlockTab value="Node.js">
            ```ts  title="Define a vector embedding"
            import { ZVecDataType, ZVecIndexType, ZVecMetricType, ZVecVectorSchema } from "@zvec/zvec";

            const vectorSchema: ZVecVectorSchema = {  // [!code highlight]
                name: "dense_vector_example",
                dataType: ZVecDataType.VECTOR_FP32,
                dimension: 768,
                // [!code word:IVF]
                indexParams: { indexType: ZVecIndexType.IVF, metricType: ZVecMetricType.COSINE, nList: 1000 }
            };
            ```
          </CodeBlockTab>
        </CodeBlockTabs>
      </Accordion>

      <Accordion title="IVF-RaBitQ Index Example" id="ivf-rabitq-example">
        Use [`IvfRabitqIndexParam()`](../../../concepts/vector-index/ivf-rabitq-index/#index-time-parameters) to configure an IVF-RaBitQ index. IVF narrows the scan scope, while RaBitQ compresses vectors within each inverted list.

        <Callout className="text-base" type="info">
          IVF-RaBitQ is available only on **Linux x86\_64** with AVX2 or AVX512 support. Zvec automatically selects the best runtime.
        </Callout>

        <CodeBlockTabs defaultValue="Python" groupId="code-demo">
          <CodeBlockTabsList>
            <CodeBlockTabsTrigger value="Python">
              Python
            </CodeBlockTabsTrigger>

            <CodeBlockTabsTrigger value="Node.js">
              Node.js
            </CodeBlockTabsTrigger>
          </CodeBlockTabsList>

          <CodeBlockTab value="Python">
            ```python  title="Define a vector embedding" 
            import zvec

            vector_schema = zvec.VectorSchema(  # [!code highlight]
                name="dense_vector_example",
                data_type=zvec.DataType.VECTOR_FP32,
                dimension=768,
                # [!code word:IvfRabitqIndexParam]
                index_param=zvec.IvfRabitqIndexParam(
                    metric_type=zvec.MetricType.COSINE,
                    nlist=1024,
                    total_bits=7,
                    sample_count=0,
                ),
            )
            ```
          </CodeBlockTab>

          <CodeBlockTab value="Node.js">
            ```ts  title="Define a vector embedding"
            import { ZVecDataType, ZVecIndexType, ZVecMetricType, ZVecVectorSchema } from "@zvec/zvec";

            const vectorSchema: ZVecVectorSchema = {  // [!code highlight]
                name: "dense_vector_example",
                dataType: ZVecDataType.VECTOR_FP32,
                dimension: 768,
                // [!code word:IVF_RABITQ]
                indexParams: {
                    indexType: ZVecIndexType.IVF_RABITQ,
                    metricType: ZVecMetricType.COSINE,
                    nList: 1024,
                    totalBits: 7,
                    sampleCount: 0,
                },
            };
            ```
          </CodeBlockTab>
        </CodeBlockTabs>
      </Accordion>

      <Accordion title="DiskANN Index Example" id="diskann-example">
        Use [`DiskAnnIndexParam()`](../../../concepts/vector-index/diskann-index/#index-time-parameters) for DiskANN index configuration.

        <CodeBlockTabs defaultValue="Python" groupId="code-demo">
          <CodeBlockTabsList>
            <CodeBlockTabsTrigger value="Python">
              Python
            </CodeBlockTabsTrigger>

            <CodeBlockTabsTrigger value="Node.js">
              Node.js
            </CodeBlockTabsTrigger>
          </CodeBlockTabsList>

          <CodeBlockTab value="Python">
            ```python  title="Define a vector embedding" 
            import zvec

            vector_schema = zvec.VectorSchema(  # [!code highlight]
                name="dense_vector_example",
                data_type=zvec.DataType.VECTOR_FP32,
                dimension=768,
                # [!code word:DiskAnnIndexParam]
                index_param=zvec.DiskAnnIndexParam(
                    metric_type=zvec.MetricType.COSINE,
                    max_degree=64,
                    list_size=100,
                    pq_chunk_num=96,
                ),
            )
            ```
          </CodeBlockTab>

          <CodeBlockTab value="Node.js">
            ```ts  title="Define a vector embedding"
            import { ZVecDataType, ZVecIndexType, ZVecMetricType, ZVecVectorSchema } from "@zvec/zvec";

            const vectorSchema: ZVecVectorSchema = {  // [!code highlight]
                name: "dense_vector_example",
                dataType: ZVecDataType.VECTOR_FP32,
                dimension: 768,
                // [!code word:DISKANN]
                indexParams: {
                    indexType: ZVecIndexType.DISKANN,
                    metricType: ZVecMetricType.COSINE,
                    maxDegree: 64,
                    listSize: 100,
                    pqChunkNum: 96
                }
            };
            ```
          </CodeBlockTab>
        </CodeBlockTabs>
      </Accordion>
    </Accordions>
  </div>
</div>

## Full Schema Example [#full-schema-example]

<Accordions type="single">
  <Accordion title="Code Example">
    <CodeBlockTabs defaultValue="Python" groupId="code-demo">
      <CodeBlockTabsList>
        <CodeBlockTabsTrigger value="Python">
          Python
        </CodeBlockTabsTrigger>

        <CodeBlockTabsTrigger value="Node.js">
          Node.js
        </CodeBlockTabsTrigger>
      </CodeBlockTabsList>

      <CodeBlockTab value="Python">
        ```python  title="Define a collection schema" 
        import zvec

        collection_schema = zvec.CollectionSchema(  # [!code highlight]
            name="example_collection",
            fields=[  # [!code highlight]
                zvec.FieldSchema(
                    name="string_field_example",
                    data_type=zvec.DataType.STRING,
                    nullable=True,
                    index_param=zvec.InvertIndexParam(enable_range_optimization=False),
                ),
            ],
            vectors=[  # [!code highlight]
                zvec.VectorSchema(
                    name="dense_vector_example",
                    data_type=zvec.DataType.VECTOR_FP32,
                    dimension=768,
                    index_param=zvec.HnswIndexParam(metric_type=zvec.MetricType.COSINE),
                ),
            ],
        )
        ```
      </CodeBlockTab>

      <CodeBlockTab value="Node.js">
        ```ts  title="Define a collection schema"
        import { ZVecCollectionSchema, ZVecDataType, ZVecIndexType, ZVecMetricType } from "@zvec/zvec";

        const collectionSchema: ZVecCollectionSchema = new ZVecCollectionSchema({   // [!code highlight]
            name: "example_collection",
            fields: [   // [!code highlight]
                {
                    name: "string_field_example",
                    dataType: ZVecDataType.STRING,
                    nullable: true,
                    indexParams: { indexType: ZVecIndexType.INVERT, enableRangeOptimization: false }
                }
            ],
            vectors: [  // [!code highlight]
                {
                    name: "dense_vector_example",
                    dataType: ZVecDataType.VECTOR_FP32,
                    dimension: 768,
                    indexParams: { indexType: ZVecIndexType.HNSW, metricType: ZVecMetricType.COSINE }
                }
            ]
        });
        ```
      </CodeBlockTab>
    </CodeBlockTabs>
  </Accordion>
</Accordions>
