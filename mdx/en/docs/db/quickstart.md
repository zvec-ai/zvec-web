# Quickstart (/en/docs/db/quickstart)





<Callout className="text-base" type="success">
  Want to explore the code examples **interactively**? Check out our [Jupyter Notebook walkthrough](/downloads/walkthrough-en.zip) that demonstrates **Zvec** in action — including a hands-on multi-modal image search example.
</Callout>

## Installation [#installation]

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
    ```bash  
    # Requires 64-bit Python 3.10-3.14
    pip install zvec
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```bash
    npm install @zvec/zvec
    ```
  </CodeBlockTab>
</CodeBlockTabs>

## Create a Collection [#create-a-collection]

A [collection](../collections/) stores your documents. Each [document](../concepts/data-modeling/#documents) contains scalar fields and [vector embeddings](../concepts/vector-embedding/).

Define a schema and create a collection. A schema has two parts: `fields` for scalar data and `vectors` for vector embeddings.

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
    ```python  title="Create a collection" 
    import zvec

    # [!code word:embedding]
    # [!code word:publish_year]
    # Define a collection schema
    collection_schema = zvec.CollectionSchema(  # [!code highlight]
        name="my_collection",
        fields=[
            zvec.FieldSchema(
                name="publish_year",
                data_type=zvec.DataType.INT32,
                index_param=zvec.InvertIndexParam(enable_range_optimization=True),
            ),
        ],
        vectors=[
            zvec.VectorSchema(
                name="embedding",
                data_type=zvec.DataType.VECTOR_FP32,
                dimension=768,
                index_param=zvec.HnswIndexParam(metric_type=zvec.MetricType.COSINE),
            ),
        ],
    )

    # Create a collection
    collection = zvec.create_and_open(  # [!code highlight]
        path="./my_collection_data",
        schema=collection_schema,
    )
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Create a collection"
    import { ZVecCollectionSchema, ZVecCreateAndOpen, ZVecDataType, ZVecIndexType, ZVecMetricType } from "@zvec/zvec"

    // [!code word:embedding]
    // [!code word:publish_year]
    // Define a collection schema
    const collectionSchema = new ZVecCollectionSchema({     // [!code highlight]
        name: "my_collection",
        fields: [
            {
                name: "publish_year",
                dataType: ZVecDataType.INT32,
                indexParams: { indexType: ZVecIndexType.INVERT, enableRangeOptimization: true }
            }
        ],
        vectors: [
            {
                name: "embedding",
                dataType: ZVecDataType.VECTOR_FP32,
                dimension: 768,
                indexParams: { indexType: ZVecIndexType.HNSW, metricType: ZVecMetricType.COSINE }
            }
        ]
    });

    // Create a collection
    const collection = ZVecCreateAndOpen("./my_collection_data", collectionSchema);   // [!code highlight]
    ```
  </CodeBlockTab>
</CodeBlockTabs>

<Callout className="text-base" type="info">
  **Important**: The field names you define here (`publish_year`, `embedding`) must be used exactly as written when inserting or querying data.
</Callout>

## Add Documents [#add-documents]

[Insert](../data-operations/insert/) documents with scalar fields and vector embeddings:

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
    ```python  title="Insert a document" 
    # [!code word:embedding]
    # [!code word:publish_year]
    collection.insert(  # [!code highlight]
        zvec.Doc(
            id="book_1",  # Unique document ID
            vectors={"embedding": [0.1] * 768}, # Replace with your actual vector
            fields={"publish_year": 1936},
        )
    )
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Insert a document"
    // [!code word:embedding]
    // [!code word:publish_year]
    collection.insertSync({     // [!code highlight]
        id: "book_1",   // Unique document ID
        vectors: { "embedding": Array(768).fill(0.1) },   // Replace with your actual vector
        fields: { "publish_year": 1936 }
    });
    ```
  </CodeBlockTab>
</CodeBlockTabs>

<Callout className="text-base" type="info">
  **Important**: Field names must match exactly. The `publish_year` field and `embedding` vector must use the same names you defined in your schema.
</Callout>

## Optimize a Collection [#optimize-a-collection]

New vectors are staged in a temporary index. Call [`optimize()`](../collections/optimize/) to build the vector index for faster search:

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
    ```python  title="Optimize a collection" 
    # [!code word:optimize]
    collection.optimize()
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Optimize a collection"
    // [!code word:optimizeSync]
    // Sync
    collection.optimizeSync();

    // [!code word:optimize]
    // Async
    await collection.optimize();
    ```
  </CodeBlockTab>
</CodeBlockTabs>

## Retrieve a Document by ID [#retrieve-a-document-by-id]

[Fetch](../data-operations/fetch/) a document directly by its `id`:

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
    ```python  title="Fetch a document" 
    result = collection.fetch(ids="book_1")   # [!code highlight]
    print(result)
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Fetch a document"
    let result = collection.fetchSync("book_1");  // [!code highlight]
    console.log(result);
    ```
  </CodeBlockTab>
</CodeBlockTabs>

<Accordions type="single">
  <Accordion title="Example Output">
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
        ```json  
        {
            "book_1": {
                "id": "book_1",
                "score": 0.0,
                "fields": {"publish_year": 1936},
                "vectors": {"embedding": [0.1, 0.1, ...]}
            }
        }
        ```
      </CodeBlockTab>

      <CodeBlockTab value="Node.js">
        ```json
        {
            book_1: {
                id: 'book_1',
                score: 0,
                vectors: { embedding: [Array] },
                fields: { publish_year: 1936 }
            }
        }
        ```
      </CodeBlockTab>
    </CodeBlockTabs>
  </Accordion>
</Accordions>

## Search with Vectors [#search-with-vectors]

### Basic Similarity Search [#basic-similarity-search]

Use [`query()`](../data-operations/query/) to find documents most similar to a given vector embedding:

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
    ```python  title="Basic similarity search" 
    # [!code word:embedding]
    result = collection.query(  # [!code highlight]
        queries=zvec.Query(
            field_name="embedding",
            vector=[0.3] * 768,  # Replace with your actual vector
        ),
        topk=10,
    )
    print(result)
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Basic similarity search"
    // [!code word:embedding]
    // Sync
    let result = collection.querySync({   // [!code highlight]
        fieldName: "embedding",
        vector: Array(768).fill(0.3),     // Replace with your actual vector
        topk: 10
    });
    console.log(result);

    // Async
    let resultAsync = await collection.query({   // [!code highlight]
        fieldName: "embedding",
        vector: Array(768).fill(0.3),     // Replace with your actual vector
        topk: 10
    });
    console.log(resultAsync);
    ```
  </CodeBlockTab>
</CodeBlockTabs>

<Accordions type="single">
  <Accordion title="Example Output">
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
        ```json  
        [
            {
                "id": "book_1",
                "score": 0.12222,
                "fields": {"publish_year": 1936},
                "vectors": {},
            },
            {
                "id": "book_2",
                "score": 0.34444,
                "fields": {"publish_year": 1894},
                "vectors": {},
            },
            ......
            ......
        ]
        ```
      </CodeBlockTab>

      <CodeBlockTab value="Node.js">
        ```json
        [
            {
                id: 'book_1',
                score: 0.12222,
                vectors: {},
                fields: { publish_year: 1936 }
            },
            {
                id: 'book_2',
                score: 0.34444,
                vectors: {},
                fields: { publish_year: 1894 }
            },
            ......
            ......
        ]
        ```
      </CodeBlockTab>
    </CodeBlockTabs>
  </Accordion>
</Accordions>

Results are ranked by similarity score.

### Filtered Similarity Search [#filtered-similarity-search]

Combine vector search with conditional filters — only matching documents are considered during search:

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
    ```python  title="Filtered similarity search" 
    # [!code word:embedding]
    result = collection.query(        # [!code highlight]
        queries=zvec.Query(
            field_name="embedding",
            vector=[0.3] * 768,   # Replace with your actual vector
        ),
        topk=10,
        filter="publish_year > 1936", # [!code highlight]
    )
    print(result)
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Filtered similarity search"
    // [!code word:embedding]
    // Sync
    let result = collection.querySync({     // [!code highlight]
        fieldName: "embedding",
        vector: Array(768).fill(0.3),   // Replace with your actual vector
        topk: 10,
        filter: "publish_year > 1936"       // [!code highlight]
    });
    console.log(result);

    // Async
    let resultAsync = await collection.query({     // [!code highlight]
        fieldName: "embedding",
        vector: Array(768).fill(0.3),   // Replace with your actual vector
        topk: 10,
        filter: "publish_year > 1936"       // [!code highlight]
    });
    console.log(resultAsync);
    ```
  </CodeBlockTab>
</CodeBlockTabs>

<Accordions type="single">
  <Accordion title="Example Output">
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
        ```json  
        [
            {
                "id": "book_5",
                "score": 0.56666,
                "fields": {"publish_year": 1998},
                "vectors": {},
            },
            {
                "id": "book_21",
                "score": 0.67777,
                "fields": {"publish_year": 1999},
                "vectors": {},
            },
            ......
            ......
        ]
        ```
      </CodeBlockTab>

      <CodeBlockTab value="Node.js">
        ```json
        [
            {
                id: 'book_5',
                score: 0.56666,
                vectors: {},
                fields: { publish_year: 1998 }
            },
            {
                id: 'book_21',
                score: 0.67777,
                vectors: {},
                fields: { publish_year: 1999 }
            },
            ......
            ......
        ]
        ```
      </CodeBlockTab>
    </CodeBlockTabs>
  </Accordion>
</Accordions>

## Inspect a Collection [#inspect-a-collection]

View the collection's schema:

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
    ```python  title="View collection schema" 
    # [!code word:schema]
    print(collection.schema)
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="View collection schema"
    // [!code word:schema]
    console.log(collection.schema.toString());
    ```
  </CodeBlockTab>
</CodeBlockTabs>

View the collection's statistics:

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
    ```python  title="View collection statistics" 
    # [!code word:stats]
    print(collection.stats)
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="View collection statistics"
    // [!code word:stats]
    console.log(collection.stats);
    ```
  </CodeBlockTab>
</CodeBlockTabs>

## Delete a Document [#delete-a-document]

[Delete](../data-operations/delete/#delete-by-ids) a document by its `id`:

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
    ```python  title="Delete a document" 
    # [!code word:delete]
    collection.delete(ids="book_1")
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Delete a document"
    // [!code word:deleteSync]
    collection.deleteSync("book_1");
    ```
  </CodeBlockTab>
</CodeBlockTabs>

[Delete](../data-operations/delete/#delete-by-filter-condition) documents by filter condition:

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
    ```python  title="Delete documents by filter condition" 
    # [!code word:delete_by_filter]
    collection.delete_by_filter(filter="publish_year < 1900")
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Delete documents by filter condition"
    // [!code word:deleteByFilterSync]
    // Sync
    collection.deleteByFilterSync("publish_year < 1900");

    // [!code word:deleteByFilter]
    // Async
    await collection.deleteByFilter("publish_year < 1900");
    ```
  </CodeBlockTab>
</CodeBlockTabs>

***

✨ You're all set to store, retrieve, and search vector data with **Zvec**!

💙 Thank you for your interest in **Zvec**! We hope you enjoy exploring what **Zvec** can do!
