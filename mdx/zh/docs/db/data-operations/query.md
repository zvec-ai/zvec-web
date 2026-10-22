# 查询 (/zh/docs/db/data-operations/query)





`query()` 方法支持**向量相似度搜索**、**全文检索**（BM25 排序）、**条件过滤**（类似 SQL `WHERE` 子句）或**以上方式的组合查询**。

它返回一个 `Doc` 对象列表，每个对象包含匹配的 [Document](../../concepts/data-modeling/#documents) 及其相关性评分。

***

## `Query` [#query]

在 Zvec 中，`Query` 是描述搜索字段和查询来源的查询规范。查询 API 会根据单路或多路搜索场景接收一个或多个 `Query`。

<Callout className="text-base" type="info">
  单个 `Query` 可以执行向量搜索或全文检索，但不能同时执行两者。
</Callout>

<Tabs items="['Python', 'Node.js']">
  <Tab value="Python">
    每个 `Query` 指定：

    1. `field_name`：要搜索的向量字段或全文检索字段名称
    2. **查询来源**：
       * 向量搜索提供显式的 `vector` 或 Document `id`（复用已有 Document 中存储的 Embedding）
       * 全文检索提供 `fts` 子句
    3. `param`（可选）：索引特定的查询参数（例如 [HNSW](../../concepts/vector-index/hnsw-index/#索引查询参数) 的 `ef`，或[全文检索](./fts/#默认运算符)的 `default_operator`）

    <Accordions type="single">
      <Accordion title="代码示例">
        ```python title="Query"
        import zvec
        from zvec.model.param.query import Fts, Query

        vector_query = Query(  # [!code highlight]
            field_name="dense_embedding",
            vector=[0.1] * 768,  # 实际使用时请替换为真实的 Embedding
        )

        by_id_query = Query(  # [!code highlight]
            field_name="dense_embedding",
            id="doc123",  # 使用 ID 为 "doc123" 的 Document 的 'dense_embedding'
        )

        fts_query = Query(  # [!code highlight]
            field_name="content",
            fts=Fts(match_string="机器学习"),
        )
        ```
      </Accordion>
    </Accordions>
  </Tab>

  <Tab value="Node.js">
    每个 `ZVecQuery` 指定：

    1. `fieldName`：要搜索的向量字段或全文检索字段名称
    2. **查询来源**：
       * 向量搜索提供 `vector`
       * 全文检索提供 `fts`
    3. `params`（可选）：索引特定的查询参数（例如 [HNSW](../../concepts/vector-index/hnsw-index/#索引查询参数) 的 `ef`，或[全文检索](./fts/#默认运算符)的 `defaultOperator`）

    <Accordions type="single">
      <Accordion title="代码示例">
        ```ts title="ZVecQuery"
        import { ZVecQuery } from "@zvec/zvec";

        let vector_query: ZVecQuery = {   // [!code highlight]
            fieldName: "dense_embedding",
            vector: Array(768).fill(0.1)  // 实际使用时请替换为真实的 Embedding
        };

        // [!code word:fts]
        let fts_query: ZVecQuery = {   // [!code highlight]
            fieldName: "content",
            fts: { matchString: "机器学习" }
        };
        ```
      </Accordion>
    </Accordions>
  </Tab>
</Tabs>

***

## 查询类型 [#查询类型]

<Cards>
  <Card title="单向量搜索" description="使用单个向量 Embedding 查找 Document" href="./single-vector/" icon="<Search className=&#x22;text-blue-300&#x22; />" />

  <Card title="多向量搜索" description="组合多个 Embedding 并进行重排序" href="./multi-vector/" icon="<Layers className=&#x22;text-blue-300&#x22; />" />

  <Card title="条件过滤" description="使用标量字段条件过滤 Document" href="./filter/" icon="<Filter className=&#x22;text-blue-300&#x22; />" />

  <Card title="向量 + 过滤搜索" description="将向量搜索与条件过滤结合使用" href="./hybrid/" icon="<Combine className=&#x22;text-blue-300&#x22; />" />

  <Card title="全文检索" description="通过文本内容搜索 Document，使用 BM25 排序" href="./fts/" icon="<Type className=&#x22;text-blue-300&#x22; />" />

  <Card title="分组搜索" description="按标量字段聚合向量搜索结果" href="./group/" icon="<Rows3 className=&#x22;text-blue-300&#x22; />" />
</Cards>

***

## 快速开始示例 [#快速开始示例]

### 单向量搜索 [#单向量搜索]

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
            vector=[0.1] * 768,  # 实际使用时请替换为真实的 Embedding
        ),
        topk=10,
    )
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts
    let result = collection.querySync({   // [!code highlight]
        fieldName: "dense_embedding",
        vector: Array(768).fill(0.1),   // 实际使用时请替换为真实的 Embedding
        topk: 10,
    });
    ```
  </CodeBlockTab>
</CodeBlockTabs>

### 多向量搜索 [#多向量搜索]

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

### 条件过滤 [#条件过滤]

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

### 混合搜索 [#混合搜索]

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
            vector=[0.1] * 768,  # 实际使用时请替换为真实的 Embedding
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
        vector: Array(768).fill(0.1), // 实际使用时请替换为真实的 Embedding
        // [!code word:filter]
        filter: "publish_year < 1999",
        topk: 10
    });
    ```
  </CodeBlockTab>
</CodeBlockTabs>

### 全文检索 [#全文检索]

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
            fts=Fts(match_string="机器学习"),
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
        fts: { matchString: "机器学习" },
        topk: 10
    });
    ```
  </CodeBlockTab>
</CodeBlockTabs>

### 分组搜索 [#分组搜索]

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
            vector=[0.1] * 768,  # 实际使用时请替换为真实的 Embedding
        ),
        group_by_field_name="publish_year",  # 按出版年份分组
        group_count=3,                        # 最多返回 3 个分组
        topk_per_group=2,                     # 每组最多返回 2 个 Document
    )

    for group in groups:
        print(group.group_by_value, group.docs)
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts
    const groups = collection.groupByQuerySync({  // [!code highlight]
        fieldName: "dense_embedding",
        vector: Array(768).fill(0.1),  // 实际使用时请替换为真实的 Embedding
        groupByFieldName: "publish_year",  // 按出版年份分组
        groupCount: 3,                      // 最多返回 3 个分组
        topkPerGroup: 2,                    // 每组最多返回 2 个 Document
    });

    for (const group of groups) {
        console.log(group.groupByValue, group.docs);
    }
    ```
  </CodeBlockTab>
</CodeBlockTabs>
