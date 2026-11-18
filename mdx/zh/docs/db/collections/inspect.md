# 检视 (/zh/docs/db/collections/inspect)





Collection 加载完成后，你可以检查其结构、配置及运行时状态，以更好地了解它的组织方式和运行情况。这在开发、调试或监控系统时尤为有用。

<Accordions type="single">
  <Accordion title="代码示例">
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
        ```python  title="打开 Collection" 
        import zvec

        # [!code word:collection]
        collection = zvec.open(path="/your/specified/path/")

        print(collection.schema)  # 查看 Schema [!code highlight]
        ```
      </CodeBlockTab>

      <CodeBlockTab value="Node.js">
        ```ts  title="打开 Collection"
        import { ZVecCollection, ZVecOpen } from "@zvec/zvec";

        // [!code word:collection]
        const collection: ZVecCollection = ZVecOpen("/your/specified/path/");

        console.log(collection.schema.toString());  // 查看 Schema [!code highlight]
        ```
      </CodeBlockTab>
    </CodeBlockTabs>
  </Accordion>
</Accordions>

***

## 快速参考 [#快速参考]

| 属性                  | 说明                             |
| ------------------- | ------------------------------ |
| `Collection.schema` | Collection 的结构和字段 (如向量维度、数据类型) |
| `Collection.stats`  | 运行时指标，如 document 数量和索引构建进度     |
| `Collection.option` | 运行时配置 (如只读模式、内存映射)             |
| `Collection.path`   | Collection 目录的具体路径             |

***

## Collection Schema [#collection-schema]

查看 [Schema](../create/schema)：

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
  <Accordion title="示例">
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

    1. `"name": "my_collection"`：collection 的名称。

    2. **标量字段**：

       * `"price"`：32 位整数(**必需**)，启用了倒排索引和范围查询优化。
       * `"category"`：字符串数组(**可选**)，启用了倒排索引；但未启用范围查询优化 (该优化对数组类型无意义)。
       * `"image_url"`：字符串(**可选**)，未建索引。

       <Callout className="text-base" type="info">
         如果标量字段的 `index_param` **不为空**，则表示该字段已建立[倒排索引](../../concepts/inverted-index/)。
       </Callout>

    3. **向量字段**：
       * `"image_embedding"`：**256 维**的浮点向量，使用 [HNSW](../../concepts/vector-index/hnsw-index/) 索引，余弦相似度，无量化。
  </Accordion>
</Accordions>

查看**标量字段**：

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
  <Accordion title="示例">
    返回标量字段的列表。

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

查看**向量字段**：

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
  <Accordion title="示例">
    返回向量字段的列表。

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

## Collection 统计信息 [#collection-统计信息]

`stats` 属性提供实时运行状态：

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
  <Accordion title="示例">
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

    1. `doc_count`：当前存储的 document 总数。
    2. `index_completeness`：向量数据已建立索引的比例 (0.0\~1.0)。1.0 表示索引已完成。
  </Accordion>
</Accordions>

***

## Collection 选项 [#collection-选项]

加载 collection 时传入的选项决定了其运行时行为：

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
  <Accordion title="示例">
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

    1. `enable_mmap: 1/true` → 已启用内存映射 I/O，可加速访问。
    2. `read_only: 0/false` → Collection 可读可写。
  </Accordion>
</Accordions>

***

## Collection 路径 [#collection-路径]

`path` 属性返回 collection 在磁盘上的位置：

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
  <Accordion title="示例">
    ```text
    ./my_collection/
    ```

    此路径与传入 `open()` 的路径一致。
  </Accordion>
</Accordions>
