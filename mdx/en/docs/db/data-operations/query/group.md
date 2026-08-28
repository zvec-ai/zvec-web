# Grouped Search (/en/docs/db/data-operations/query/group)





Grouped search organizes vector search results by scalar field values and returns the most relevant groups, along with the most relevant documents in each group.

For example, grouping product search results by `category` prevents one category from dominating the results while preserving the most relevant products in each category.

***

## How It Works [#how-it-works]

When performing grouped search, Zvec:

1. Groups results during vector search by the value of the specified grouping field.
2. Ranks groups by the most relevant document in each group and returns up to the specified number of groups.
3. Keeps up to the specified number of documents in each group, ordered by relevance.

Documents whose grouping field is `null` are excluded from the results.

***

## Prerequisites [#prerequisites]

This guide assumes that you have opened a collection and that:

* The query field is a vector field with an index that supports grouped search.
* The grouping field is a non-array scalar field, such as an integer, float, string, or boolean field.

<Accordions type="single">
  <Accordion title="Example Collection Setup">
    This example collection contains a dense vector field named `dense_embedding` and scalar fields used for grouping and filtering.

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

        collection_schema = zvec.CollectionSchema(
            name="product_collection",
            vectors=[
                zvec.VectorSchema(
                    name="dense_embedding",
                    data_type=zvec.DataType.VECTOR_FP32,
                    dimension=768,
                    index_param=zvec.HnswIndexParam(
                        metric_type=zvec.MetricType.COSINE,
                    ),
                ),
            ],
            fields=[
                zvec.FieldSchema(name="title", data_type=zvec.DataType.STRING),
                zvec.FieldSchema(name="category", data_type=zvec.DataType.STRING),
                zvec.FieldSchema(
                    name="publish_year",
                    data_type=zvec.DataType.INT32,
                    index_param=zvec.InvertIndexParam(
                        enable_range_optimization=True,
                    ),
                ),
            ],
        )

        collection = zvec.open(path="/path/to/collection")
        ```
      </CodeBlockTab>

      <CodeBlockTab value="Node.js">
        ```ts  title="Open a collection"
        import {
            ZVecCollection,
            ZVecCollectionSchema,
            ZVecDataType,
            ZVecIndexType,
            ZVecMetricType,
            ZVecOpen,
        } from "@zvec/zvec";

        const collectionSchema = new ZVecCollectionSchema({
            name: "product_collection",
            vectors: [
                {
                    name: "dense_embedding",
                    dataType: ZVecDataType.VECTOR_FP32,
                    dimension: 768,
                    indexParams: {
                        indexType: ZVecIndexType.HNSW,
                        metricType: ZVecMetricType.COSINE,
                    },
                },
            ],
            fields: [
                { name: "title", dataType: ZVecDataType.STRING },
                { name: "category", dataType: ZVecDataType.STRING },
                {
                    name: "publish_year",
                    dataType: ZVecDataType.INT32,
                    indexParams: {
                        indexType: ZVecIndexType.INVERT,
                        enableRangeOptimization: true,
                    },
                },
            ],
        });

        const collection: ZVecCollection = ZVecOpen("/path/to/collection");
        ```
      </CodeBlockTab>
    </CodeBlockTabs>
  </Accordion>
</Accordions>

***

## Performing Grouped Search [#performing-grouped-search]

Specify a single query vector, a grouping field name, the number of groups to return, and the number of documents per group:

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
    ```python  title="Group vector search results by category" 
    import zvec

    results = collection.group_by_query(  # [!code highlight]
        query=zvec.Query(
            field_name="dense_embedding",
            vector=[0.1] * 768,  # Replace with a real embedding in practice
            param=zvec.HnswQueryParam(ef=200),
        ),
        group_by_field_name="category",  # [!code highlight]
        group_count=3,                    # Return up to 3 categories
        topk_per_group=2,                 # Return up to 2 documents per category
        filter="publish_year >= 2020",
        output_fields=["title", "category", "publish_year"],
    )

    for group in results:
        print(f"Category: {group.group_by_value}")
        for doc in group.docs:
            print(doc.id, doc.field("title"), doc.score)
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Group vector search results by category"
    import { ZVecIndexType } from "@zvec/zvec";

    const results = collection.groupByQuerySync({  // [!code highlight]
        fieldName: "dense_embedding",
        vector: Array(768).fill(0.1),  // Replace with a real embedding in practice
        params: { indexType: ZVecIndexType.HNSW, ef: 200 },
        groupByFieldName: "category",  // [!code highlight]
        groupCount: 3,                  // Return up to 3 categories
        topkPerGroup: 2,                // Return up to 2 documents per category
        filter: "publish_year >= 2020",
        outputFields: ["title", "category", "publish_year"],
    });

    for (const group of results) {
        console.log(`Category: ${group.groupByValue}`);
        for (const doc of group.docs) {
            console.log(doc.id, doc.fields?.title, doc.score);
        }
    }
    ```
  </CodeBlockTab>
</CodeBlockTabs>

If fewer matching groups or documents are available, the actual result counts will be lower than `group_count` or `topk_per_group`. An empty collection or a search with no matches returns an empty list.

### Using the Vector from an Existing Document [#using-the-vector-from-an-existing-document]

Instead of providing an embedding directly, you can use `id` to reuse the vector from an existing document in the collection:

<CodeBlockTabs defaultValue="Python">
  <CodeBlockTabsList>
    <CodeBlockTabsTrigger value="Python">
      Python
    </CodeBlockTabsTrigger>
  </CodeBlockTabsList>

  <CodeBlockTab value="Python">
    ```python  title="Use the vector from an existing document"
    results = collection.group_by_query(
        query=zvec.Query(
            field_name="dense_embedding",
            id="product_123",
        ),
        group_by_field_name="category",
        group_count=3,
        topk_per_group=2,
    )
    ```
  </CodeBlockTab>
</CodeBlockTabs>

The document specified by `id` must exist and contain the vector identified by `field_name`.

The Node.js API requires an explicit query `vector`.

***

## Parameters [#parameters]

<Tabs items="['Python', 'Node.js']">
  <Tab value="Python">
    | Parameter             | Type                | Default  | Description                                                                                                                                                                                           |
    | --------------------- | ------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | `query`               | `Query`             | Required | A single vector search specification. Provide an embedding through `vector`, or use `id` to reuse the vector from an existing document. You can pass index-specific query parameters through `param`. |
    | `group_by_field_name` | `str`               | Required | The name of the non-array scalar field used for grouping. It cannot be empty.                                                                                                                         |
    | `group_count`         | `int`               | `2`      | The maximum number of groups to return. Must be a positive integer.                                                                                                                                   |
    | `topk_per_group`      | `int`               | `3`      | The maximum number of documents to return per group. Must be a positive integer.                                                                                                                      |
    | `filter`              | `str \| None`       | `None`   | A [filter expression](../filter/) applied before the search.                                                                                                                                          |
    | `include_vector`      | `bool`              | `False`  | Whether to include vector fields in the returned documents.                                                                                                                                           |
    | `output_fields`       | `list[str] \| None` | `None`   | Scalar fields to return. `None` returns all scalar fields; an empty list returns no scalar fields.                                                                                                    |
  </Tab>

  <Tab value="Node.js">
    | Parameter          | Type              | Default  | Description                                                                                                   |
    | ------------------ | ----------------- | -------- | ------------------------------------------------------------------------------------------------------------- |
    | `fieldName`        | `string`          | Required | The name of the vector field to search.                                                                       |
    | `vector`           | `ZVecVector`      | Required | The query vector.                                                                                             |
    | `groupByFieldName` | `string`          | Required | The name of the non-array scalar field used for grouping. It cannot be empty.                                 |
    | `groupCount`       | `number`          | `2`      | The maximum number of groups to return. Must be a positive integer.                                           |
    | `topkPerGroup`     | `number`          | `3`      | The maximum number of documents to return per group. Must be a positive integer.                              |
    | `filter`           | `string`          | Unset    | A [filter expression](../filter/) applied before the search.                                                  |
    | `includeVector`    | `boolean`         | `false`  | Whether to include vector fields in the returned documents.                                                   |
    | `outputFields`     | `string[]`        | Unset    | Scalar fields to return. When unset, all scalar fields are returned; an empty array returns no scalar fields. |
    | `params`           | `ZVecQueryParams` | Unset    | Query-time parameters for the selected vector index.                                                          |
  </Tab>
</Tabs>

***

## Results [#results]

<Tabs items="['Python', 'Node.js']">
  <Tab value="Python">
    `group_by_query()` returns a `list[GroupResult]`. Each `GroupResult` contains:

    | Attribute        | Type        | Description                                                                                                                              |
    | ---------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
    | `group_by_value` | `str`       | The string representation of the grouping field value. This attribute is a string even when the original field is an integer or boolean. |
    | `docs`           | `list[Doc]` | The documents in the group, ordered by vector relevance.                                                                                 |
  </Tab>

  <Tab value="Node.js">
    `groupByQuerySync()` / `groupByQuery()` returns `ZVecGroupResult[]`. Each `ZVecGroupResult` contains:

    | Attribute      | Type        | Description                                                                                                                              |
    | -------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
    | `groupByValue` | `string`    | The string representation of the grouping field value. This attribute is a string even when the original field is an integer or boolean. |
    | `docs`         | `ZVecDoc[]` | The documents in the group, ordered by vector relevance.                                                                                 |
  </Tab>
</Tabs>

Groups are ordered by the relevance of the first document in each group. The direction of distance or similarity scores depends on the metric used by the vector field. For example, higher inner product scores usually indicate greater relevance, while lower L2 and cosine distance scores usually indicate greater relevance.

<Callout className="text-base" type="idea">
  The grouping field value is returned independently of the output fields. You can use it to identify a group even when the grouping field is not included in the output fields.
</Callout>

***

## Limitations and Considerations [#limitations-and-considerations]

* Grouped search supports only single-vector search. It does not support full-text search or multi-vector search.
* The grouping field cannot be a vector or array field.
* Grouped search currently does not support IVF, DiskANN, or Vamana vector indexes.
* Grouped search cannot be used with vector refinement (refiner).
* Grouped search is best-effort. Depending on the data distribution and search conditions, the actual number of groups and documents per group may be lower than the specified values. When there are not enough candidates, Zvec prioritizes the number of groups.
* Increasing the number of groups or documents per group requires collecting and sorting more candidates and typically increases query latency.
