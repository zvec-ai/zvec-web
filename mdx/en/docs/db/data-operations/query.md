# Query (/en/docs/db/data-operations/query)





The `query()` method supports **vector similarity search**, **full-text search** (BM25 ranking), **conditional filtering** (like a SQL `WHERE` clause), or **combinations of these**.

It returns a list of `Doc` objects, each containing the matched [document](../../concepts/data-modeling/#documents) and its relevance score.

***

## `Query` [#query]

In Zvec, a `Query` is a query specification that describes the field and query source used for a search. Query APIs accept one or more `Query` specifications depending on whether you are performing a single- or multi-query search.

<Callout className="text-base" type="info">
  A single `Query` can target either vector search or full-text search, but not both at the same time.
</Callout>

<Tabs items="['Python', 'Node.js']">
  <Tab value="Python">
    Each `Query` specifies:

    1. `field_name`: The name of the vector or full-text field to search
    2. **Query source**:
       * For vector search, provide an explicit `vector` or a document `id` (to reuse the stored embedding of an existing document)
       * For full-text search, provide an `fts` clause
    3. `param` (optional): Index-specific query parameters (e.g., `ef` for [HNSW](../../concepts/vector-index/hnsw-index/#query-time-parameters) or `default_operator` for [full-text search](./fts/#default-operator))

    <Accordions type="single">
      <Accordion title="Code Example">
        ```python title="Query"
        import zvec
        from zvec.model.param.query import Fts, Query

        vector_query = Query(  # [!code highlight]
            field_name="dense_embedding",
            vector=[0.1] * 768,  # Use real embedding in practice
        )

        by_id_query = Query(  # [!code highlight]
            field_name="dense_embedding",
            id="doc123",  # Use the 'dense_embedding' from the document with ID "doc123"
        )

        fts_query = Query(  # [!code highlight]
            field_name="content",
            fts=Fts(match_string="machine learning"),
        )
        ```
      </Accordion>
    </Accordions>
  </Tab>

  <Tab value="Node.js">
    Each `ZVecQuery` specifies:

    1. `fieldName`: The name of the vector or full-text field to search
    2. **Query source**:
       * For vector search, provide `vector`
       * For full-text search, provide `fts`
    3. `params` (optional): Index-specific query parameters (e.g., `ef` for [HNSW](../../concepts/vector-index/hnsw-index/#query-time-parameters) or `defaultOperator` for [full-text search](./fts/#default-operator))

    <Accordions type="single">
      <Accordion title="Code Example">
        ```ts title="ZVecQuery"
        import { ZVecQuery } from "@zvec/zvec";

        let vector_query: ZVecQuery = {   // [!code highlight]
            fieldName: "dense_embedding",
            vector: Array(768).fill(0.1)  // Use real embedding in practice
        };

        // [!code word:fts]
        let fts_query: ZVecQuery = {   // [!code highlight]
            fieldName: "content",
            fts: { matchString: "machine learning" }
        };
        ```
      </Accordion>
    </Accordions>
  </Tab>
</Tabs>

***

## Query Types [#query-types]

<Cards>
  <Card title="Single-Vector Search" description="Find documents using a single vector embedding" href="./single-vector/" icon="<Search className=&#x22;text-blue-300&#x22; />" />

  <Card title="Multi-Vector Search" description="Combine multiple embeddings with re-ranking" href="./multi-vector/" icon="<Layers className=&#x22;text-blue-300&#x22; />" />

  <Card title="Conditional Filtering" description="Filter documents using scalar field conditions" href="./filter/" icon="<Filter className=&#x22;text-blue-300&#x22; />" />

  <Card title="Filtered Vector Search" description="Combine vector search with conditional filters" href="./hybrid/" icon="<Combine className=&#x22;text-blue-300&#x22; />" />

  <Card title="Full-Text Search" description="Search documents by text content with BM25 ranking" href="./fts/" icon="<Type className=&#x22;text-blue-300&#x22; />" />

  <Card title="Grouped Search" description="Group vector search results by a scalar field" href="./group/" icon="<Rows3 className=&#x22;text-blue-300&#x22; />" />
</Cards>

***

## Quick Start Examples [#quick-start-examples]

### Single-Vector Search [#single-vector-search]

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
    ```python  
    import zvec

    result = collection.query(  # [!code highlight]
        queries=zvec.Query(
            field_name="dense_embedding",
            vector=[0.1] * 768,  # Use real embedding in practice
        ),
        topk=10,
    )
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts
    let result = collection.querySync({   // [!code highlight]
        fieldName: "dense_embedding",
        vector: Array(768).fill(0.1),   // Use real embedding in practice
        topk: 10,
    });
    ```
  </CodeBlockTab>
</CodeBlockTabs>

### Multi-Vector Search [#multi-vector-search]

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
    ```python  
    import zvec

    result = collection.query(  # [!code highlight]
        topk=3,
        queries=[
            zvec.Query(field_name="dense_embedding", vector=[0.1] * 768),
            zvec.Query(field_name="sparse_embedding", vector={1: 0.1, 37: 0.43}),
        ],
        reranker=zvec.WeightedReRanker(  # [!code highlight]
            weights=[1.2, 1.0],
        ),
    )
    print(result)
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  
    let result = collection.multiQuerySync({  // [!code highlight]
        topk: 3,
        queries: [
            { fieldName: "dense_embedding", vector: Array(768).fill(0.1), numCandidates: 5 },
            { fieldName: "sparse_embedding", vector: { 1: 0.1, 37: 0.43 }, numCandidates: 5 },
        ],
        rerank: { type: "weighted", weights: [1.2, 1.0] },  // [!code highlight]
    });
    ```
  </CodeBlockTab>
</CodeBlockTabs>

### Conditional Filtering [#conditional-filtering]

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
    ```python  
    # [!code word:filter]
    result = collection.query(filter="publish_year < 1999", topk=50)
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts
    // [!code word:filter]
    let result = collection.querySync({ filter: "publish_year < 1999", topk: 50 });
    ```
  </CodeBlockTab>
</CodeBlockTabs>

### Hybrid Search [#hybrid-search]

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
    ```python  
    import zvec

    result = collection.query(          # [!code highlight]
        queries=zvec.Query(
            field_name="dense_embedding",
            vector=[0.1] * 768,  # Use real embedding in practice
        ),
        # [!code word:filter]
        filter="publish_year < 1999",
        topk=10,
    )
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts
    let result = collection.querySync({   // [!code highlight]
        fieldName: "dense_embedding",
        vector: Array(768).fill(0.1), // Use real embedding in practice
        // [!code word:filter]
        filter: "publish_year < 1999",
        topk: 10
    });
    ```
  </CodeBlockTab>
</CodeBlockTabs>

### Full-Text Search [#full-text-search]

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
    ```python  
    from zvec.model.param.query import Fts, Query

    # [!code word:fts]
    result = collection.query(  # [!code highlight]
        queries=Query(
            field_name="content",
            fts=Fts(match_string="machine learning"),
        ),
        topk=10,
    )
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts
    // [!code word:fts]
    let result = collection.querySync({   // [!code highlight]
        fieldName: "content",
        fts: { matchString: "machine learning" },
        topk: 10
    });
    ```
  </CodeBlockTab>
</CodeBlockTabs>

### Grouped Search [#grouped-search]

<CodeBlockTabs defaultValue="Python">
  <CodeBlockTabsList>
    <CodeBlockTabsTrigger value="Python">
      Python
    </CodeBlockTabsTrigger>

    <CodeBlockTabsTrigger value="Node.js">
      Node.js
    </CodeBlockTabsTrigger>
  </CodeBlockTabsList>

  <CodeBlockTab value="Python">
    ```python
    import zvec

    groups = collection.group_by_query(  # [!code highlight]
        query=zvec.Query(
            field_name="dense_embedding",
            vector=[0.1] * 768,  # Replace with a real embedding in practice
        ),
        group_by_field_name="publish_year",  # Group by publication year
        group_count=3,                        # Return up to 3 groups
        topk_per_group=2,                     # Return up to 2 documents per group
    )

    for group in groups:
        print(group.group_by_value, group.docs)
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts
    const groups = collection.groupByQuerySync({  // [!code highlight]
        fieldName: "dense_embedding",
        vector: Array(768).fill(0.1),  // Replace with a real embedding in practice
        groupByFieldName: "publish_year",  // Group by publication year
        groupCount: 3,                      // Return up to 3 groups
        topkPerGroup: 2,                    // Return up to 2 documents per group
    });

    for (const group of groups) {
        console.log(group.groupByValue, group.docs);
    }
    ```
  </CodeBlockTab>
</CodeBlockTabs>
