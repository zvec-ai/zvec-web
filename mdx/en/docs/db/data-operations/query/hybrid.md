# Vector + Filter (/en/docs/db/data-operations/query/hybrid)





You can combine **vector search** with **scalar filters** to restrict results to a subset of documents — just like adding a `WHERE` clause to a similarity search.

***

## Prerequisites [#prerequisites]

This guide assumes you:

* Have already opened a `collection` instance.
* Are familiar with [vector querying](../single-vector/) and [conditional filtering](../filter/).

<Accordions type="single">
  <Accordion title="Example Collection Setup">
    This example collection contains one dense vector field `dense_embedding` and one scalar field `publish_year`.

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
        ```python  title="Open a collection" 
        import zvec

        # [!code word:dense_embedding]
        # [!code word:publish_year]
        collection_schema = zvec.CollectionSchema(  # [!code highlight]
            name="example_collection",
            vectors=[
                zvec.VectorSchema(
                    name="dense_embedding",
                    data_type=zvec.DataType.VECTOR_FP32,
                    dimension=768,
                    index_param=zvec.HnswIndexParam(metric_type=zvec.MetricType.COSINE),
                ),
            ],
            fields=[
                zvec.FieldSchema(
                    name="publish_year",
                    data_type=zvec.DataType.INT32,
                    index_param=zvec.InvertIndexParam(enable_range_optimization=True),
                ),
            ],
        )

        collection = zvec.open(path="/path/to/collection")  # [!code highlight]
        ```
      </CodeBlockTab>

      <CodeBlockTab value="Node.js">
        ```ts  title="Open a collection"
        import { ZVecCollection, ZVecCollectionSchema, ZVecDataType, ZVecIndexType, ZVecMetricType, ZVecOpen } from "@zvec/zvec";

        // [!code word:dense_embedding]
        // [!code word:publish_year]
        const collectionSchema: ZVecCollectionSchema = new ZVecCollectionSchema({   // [!code highlight]
            name: "example_collection",
            vectors: [
                {
                    name: "dense_embedding",
                    dataType: ZVecDataType.VECTOR_FP32,
                    dimension: 768,
                    indexParams: { indexType: ZVecIndexType.HNSW, metricType: ZVecMetricType.COSINE }
                }
            ],
            fields: [
                {
                    name: "publish_year",
                    dataType: ZVecDataType.INT32,
                    indexParams: { indexType: ZVecIndexType.INVERT, enableRangeOptimization: true }
                }
            ]
        });

        const collection: ZVecCollection = ZVecOpen("/path/to/collection");   // [!code highlight]
        ```
      </CodeBlockTab>
    </CodeBlockTabs>
  </Accordion>
</Accordions>

***

## Performing Filtered Vector Search [#performing-filtered-vector-search]

To combine vector similarity search with filters, pass both a [query specification](../#query) and a `filter` expression to the `query()` method.

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
    ```python  title="Filtered vector similarity search" 
    import zvec

    result = collection.query(
        queries=zvec.Query(  # [!code highlight]
            field_name="dense_embedding",
            vector=[0.1] * 768,  # Replace with real embedding
        ),
        filter="publish_year > 1936",  # Only consider books published after 1936   [!code highlight]
        topk=10,
    )
    print(result)
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Filtered vector similarity search"
    let result = collection.querySync({   // [!code highlight]
        fieldName: "dense_embedding",
        vector: Array(768).fill(0.1),   // Replace with real embedding
        filter: "publish_year > 1936",  // Only consider books published after 1936 [!code highlight]
        topk: 10
    });
    console.log(result);
    ```
  </CodeBlockTab>
</CodeBlockTabs>

This returns the top-10 most similar documents that satisfy `publish_year > 1936`, sorted by similarity score.
