# Inspect (/en/docs/db/collections/inspect)





Once you've opened a collection, you can inspect its structure, configuration, and runtime state to better understand how it's organized and performing. This is especially helpful during development, debugging, or system monitoring.

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
        ```python  title="Open a collection" 
        import zvec

        # [!code word:collection]
        collection = zvec.open(path="/your/specified/path/")

        print(collection.schema)  # View the schema [!code highlight]
        ```
      </CodeBlockTab>

      <CodeBlockTab value="Node.js">
        ```ts  title="Open a collection"
        import { ZVecCollection, ZVecOpen } from "@zvec/zvec";

        // [!code word:collection]
        const collection: ZVecCollection = ZVecOpen("/your/specified/path/");

        console.log(collection.schema.toString());  // View the schema [!code highlight]
        ```
      </CodeBlockTab>
    </CodeBlockTabs>
  </Accordion>
</Accordions>

***

## Quick Reference [#quick-reference]

| Property            | Description                                                                      |
| ------------------- | -------------------------------------------------------------------------------- |
| `Collection.schema` | Collection structure and field definitions (e.g., vector dimensions, data types) |
| `Collection.stats`  | Runtime metrics such as document count and index completeness                    |
| `Collection.option` | Runtime settings (e.g., read-only mode, memory mapping)                          |
| `Collection.path`   | Filesystem path to the collection directory                                      |

***

## Collection Schema [#collection-schema]

To view the [schema](../create/schema):

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
    print(collection.schema)
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts
    console.log(collection.schema.toString());
    ```
  </CodeBlockTab>
</CodeBlockTabs>

<Accordions type="single">
  <Accordion title="Example">
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
        // [!code word:fields]
        // [!code word:vectors]
        {
          "name": "my_collection",
          "fields": {
            "price": {
              "name": "price",
              "data_type": "INT32",
              "nullable": false,
              "index_param": {
                "enable_range_optimization": true,
                "enable_extended_wildcard": false
              }
            },
            "category": {
              "name": "category",
              "data_type": "ARRAY_STRING",
              "nullable": true,
              "index_param": {
                "enable_range_optimization": false,
                "enable_extended_wildcard": false
              }
            },
            "image_url": {
              "name": "image_url",
              "data_type": "STRING",
              "nullable": true,
              "index_param": null
            }
          },
          "vectors": {
            "image_embedding": {
              "name": "image_embedding",
              "data_type": "VECTOR_FP32",
              "dimension": 256,
              "index_param": {
                "type": "HNSW",
                "metric_type": "COSINE",
                "m": 50,
                "ef_construction": 500,
                "quantize_type": "UNDEFINED"
              }
            }
          }
        }
        ```
      </CodeBlockTab>

      <CodeBlockTab value="Node.js">
        ```bash
        # [!code word:scalar]
        # [!code word:vector]
        CollectionSchema{
          name: 'my_collection',
          max_doc_count_per_segment: 10000000,
          fields: [
            FieldSchema[vector]{
              name: 'image_embedding',
              data_type: VECTOR_FP32,
              dimension: 256,
              index_params: HnswIndexParams{metric:COSINE,quantize:UNDEFINED,m:50,ef_construction:500}
            },
            FieldSchema[scalar]{
              name: 'price',
              data_type: INT32,
              nullable: false,
              index_params: InvertIndexParams{enable_range_optimization:true, enable_extended_wildcard:false}
            },
            FieldSchema[scalar]{
              name: 'category',
              data_type: ARRAY_STRING,
              nullable: true,
              index_params: InvertIndexParams{enable_range_optimization:false, enable_extended_wildcard:false}
            },
            FieldSchema[scalar]{
              name: 'image_url',
              data_type: STRING,
              nullable: true,
              index_params: null
            }
          ]
        }
        ```
      </CodeBlockTab>
    </CodeBlockTabs>

    1. `"name": "my_collection"`: The name of the collection.

    2. **Scalar fields**:

       * `"price"`: A **required** 32-bit integer, with inverted index and range query optimization enabled.
       * `"category"`: An **optional** array of strings with an inverted index enabled; range query optimization is disabled (not meaningful for array types).
       * `"image_url"`: An **optional** string, with no indexing applied.

       <Callout className="text-base" type="info">
         If `index_param` is **non-null** for a scalar field, that field has an [inverted index](../../concepts/inverted-index/).
       </Callout>

    3. **Vector fields**:
       * `"image_embedding"`: A **256-dimensional** floating-point vector indexed with [HNSW](../../concepts/vector-index/hnsw-index/) using cosine similarity and no quantization.
  </Accordion>
</Accordions>

To view **scalar fields**:

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
    print(collection.schema.fields)
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts
    console.log(collection.schema.fields());
    ```
  </CodeBlockTab>
</CodeBlockTabs>

<Accordions type="single">
  <Accordion title="Example">
    This will return an array of scalar fields.

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
        [{
          "name": "price",
          "data_type": "INT32",
          "nullable": false,
          "index_param": {
            "enable_range_optimization": true,
            "enable_extended_wildcard": false
          }
        }, {
          "name": "category",
          "data_type": "ARRAY_STRING",
          "nullable": true,
          "index_param": {
            "enable_range_optimization": false,
            "enable_extended_wildcard": false
          }
        }, {
          "name": "image_url",
          "data_type": "STRING",
          "nullable": true,
          "index_param": null
        }]
        ```
      </CodeBlockTab>

      <CodeBlockTab value="Node.js">
        ```json
        [
          {
            name: 'price',
            dataType: 4,
            nullable: false,
            indexParams: {
              indexType: 10,
              enableRangeOptimization: true,
              enableExtendedWildcard: false
            }
          },
          {
            name: 'category',
            dataType: 41,
            nullable: true,
            indexParams: {
              indexType: 10,
              enableRangeOptimization: false,
              enableExtendedWildcard: false
            }
          },
          { name: 'image_url', dataType: 2, nullable: true }
        ]
        ```
      </CodeBlockTab>
    </CodeBlockTabs>
  </Accordion>
</Accordions>

To view **vector fields**:

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
    print(collection.schema.vectors)
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts
    console.log(collection.schema.vectors());
    ```
  </CodeBlockTab>
</CodeBlockTabs>

<Accordions type="single">
  <Accordion title="Example">
    This will return an array of vector fields.

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
        [{
          "name": "image_embedding",
          "data_type": "VECTOR_FP32",
          "dimension": 256,
          "index_param": {
            "type": "HNSW",
            "metric_type": "COSINE",
            "m": 50,
            "ef_construction": 500,
            "quantize_type": "UNDEFINED"
          }
        }]
        ```
      </CodeBlockTab>

      <CodeBlockTab value="Node.js">
        ```json
        [
          {
            name: 'image_embedding',
            dataType: 23,
            dimension: 256,
            indexParams: {
              indexType: 1,
              metricType: 3,
              m: 50,
              efConstruction: 500,
              quantizeType: 0
            }
          }
        ]
        ```
      </CodeBlockTab>
    </CodeBlockTabs>
  </Accordion>
</Accordions>

***

## Collection Statistics [#collection-statistics]

The `stats` property provides real-time operational insights:

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
    print(collection.stats)
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts
    console.log(collection.stats);
    ```
  </CodeBlockTab>
</CodeBlockTabs>

<Accordions type="single">
  <Accordion title="Example">
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
        {"doc_count":100, "index_completeness":{"image_embedding":1.000000}}
        ```
      </CodeBlockTab>

      <CodeBlockTab value="Node.js">
        ```json
        { docCount: 100, indexCompleteness: { image_embedding: 1 } }
        ```
      </CodeBlockTab>
    </CodeBlockTabs>

    1. `doc_count`: Total number of documents currently stored.
    2. `index_completeness`: Fraction (0.0\~1.0) indicating how much of the vector data has been indexed. A value of 1.0 means indexing is complete.
  </Accordion>
</Accordions>

***

## Collection Options [#collection-options]

Runtime behavior is governed by the options used when opening the collection:

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
    print(collection.option)
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts
    console.log(collection.options);
    ```
  </CodeBlockTab>
</CodeBlockTabs>

<Accordions type="single">
  <Accordion title="Example">
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
        {"enable_mmap":1, "read_only":0}
        ```
      </CodeBlockTab>

      <CodeBlockTab value="Node.js">
        ```json
        { readOnly: false, enableMMAP: true }
        ```
      </CodeBlockTab>
    </CodeBlockTabs>

    1. `enable_mmap: 1/true` → Memory-mapped I/O is enabled for faster access.
    2. `read_only: 0/false` → The collection is open for both reads and writes.
  </Accordion>
</Accordions>

***

## Collection Path [#collection-path]

The `path` property returns the on-disk location of the collection:

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
    print(collection.path)
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts
    console.log(collection.path);
    ```
  </CodeBlockTab>
</CodeBlockTabs>

<Accordions type="single">
  <Accordion title="Example">
    ```text
    ./my_collection/
    ```

    This is the same path passed to `open()`.
  </Accordion>
</Accordions>
