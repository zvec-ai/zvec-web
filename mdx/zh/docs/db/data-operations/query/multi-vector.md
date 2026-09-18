# 多向量 (/zh/docs/db/data-operations/query/multi-vector)





Zvec 支持**多向量查询**，允许你在单次搜索中组合不同的 Embedding。

当查询多个向量 Embedding 时，Zvec 会从每个向量空间中独立检索候选结果，再将它们融合为一个按相关性排序的列表。由于不同向量空间的评分可能无法直接比较，你需要选择合适的**重排序策略**。

***

## 前提条件 [#前提条件]

本指南假设：

* 你已经打开了一个包含多个向量字段的 `collection`
* 你已经熟悉基本的向量查询概念。如果不熟悉，请先阅读[单向量搜索](../single-vector/)指南

<Accordions type="single">
  <Accordion title="示例 Collection 设置">
    此示例 Collection 包含两个向量字段：

    1. **`dense_embedding`** — 768 维稠密向量，使用内积距离
    2. **`sparse_embedding`** — 稀疏向量，使用内积距离

    它还包含两个标量字段（`publish_year` 和 `category`）。

    ```python title="创建并打开 Collection"
    import zvec

    # [!code word:dense_embedding]
    # [!code word:sparse_embedding]
    collection_schema = zvec.CollectionSchema(  # [!code highlight]
        name="example_collection",
        vectors=[
            zvec.VectorSchema(
                name="dense_embedding",
                data_type=zvec.DataType.VECTOR_FP32,
                dimension=768,
                index_param=zvec.HnswIndexParam(metric_type=zvec.MetricType.IP),
            ),
            zvec.VectorSchema(
                name="sparse_embedding",
                data_type=zvec.DataType.SPARSE_VECTOR_FP32,
                index_param=zvec.HnswIndexParam(metric_type=zvec.MetricType.IP),
            ),
        ],
        fields=[
            zvec.FieldSchema(name="publish_year", data_type=zvec.DataType.INT64),
            zvec.FieldSchema(name="category", data_type=zvec.DataType.ARRAY_STRING),
        ],
    )

    collection = zvec.create_and_open(  # [!code highlight]
        path="/path/to/collection",
        schema=collection_schema,
    )
    ```
  </Accordion>
</Accordions>

***

## 执行多向量搜索 [#执行多向量搜索]

在 Python 中，将[查询规范](../#query)列表传递给 `query()`，并通过 `reranker` 指定融合策略。在 Node.js 中，将子查询传递给 `multiQuerySync()` 或 `multiQuery()`，并配置 `rerank`。

此示例同时查询 `dense_embedding` 和 `sparse_embedding`，并使用 `WeightedReRanker` 组合结果。权重按位置与 `queries` 保持相同顺序。

<CodeBlockTabs defaultValue="Python" groupId="multi-vector-example">
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
        topk=3,  # 重排序后最终返回的 Document 数量
        queries=[  # 查询规范列表 — 每个要搜索的 Embedding 空间一个
            zvec.Query(field_name="dense_embedding", vector=[0.1] * 768),           # [!code highlight]
            zvec.Query(field_name="sparse_embedding", vector={1: 0.1, 37: 0.43}),   # [!code highlight]
        ],
        reranker=zvec.WeightedReRanker(  # [!code highlight]
            weights=[1.2, 1.0],  # dense_embedding、sparse_embedding
        ),
    )
    print(result)
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  
    let result = collection.multiQuerySync({  // [!code highlight]
      topk: 3,  // 重排序后最终返回的 Document 数量
      queries: [
        {
          fieldName: "dense_embedding",
          vector: Array(768).fill(0.1),
          numCandidates: 5,  // 此子查询召回的候选数量
        },
        {
          fieldName: "sparse_embedding",
          vector: { 1: 0.1, 37: 0.43 },
          numCandidates: 5,
        },
      ],
      rerank: {  // [!code highlight]
        type: "weighted",
        weights: [1.2, 1.0],  // dense_embedding、sparse_embedding
      },
    });
    console.log(result);
    ```
  </CodeBlockTab>
</CodeBlockTabs>

<Callout className="text-base" type="info">
  `topk` 始终控制融合后**最终返回的 Document 数量**。

  * Python 的 `Collection.query()` 目前不提供为每个子查询单独设置候选数量的参数。
  * Node.js 可以通过每个子查询的 `numCandidates` 设置候选数量；省略时默认为 `max(topk, 10)`。
  * `topn` 只在直接调用重排序器的 `rerank()` 方法时使用，并不是重排序器构造参数。
</Callout>

### 重排序策略 [#重排序策略]

Zvec 提供不同的重排序策略来组合多个向量字段的评分。

| 重排序器 | `WeightedReRanker`                                     | `RrfReRanker`（倒数排名融合）                                                                                |
| ---- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| 方法   | 使用**自定义权重**组合归一化的相似度评分                                 | 仅基于**排名位置**融合结果 — 不需要评分 <br /> 当 *r* 从 0 开始计数（第一名为 0）时，RRF 评分为：$\text{RRF}(r) = \frac{1}{k + r + 1}$ |
| 适用场景 | • 不同向量字段之间的评分大致可比 <br /> • 你知道每种 Embedding 类型的相对重要性    | • 评分来自不同的度量或尺度 <br /> • 你偏好简单、稳健、无需调参的方法                                                             |
| 参数   | `weights`：与 `queries` 顺序一致的权重列表。评分归一化会使用各查询字段的 Schema。 | `rank_constant`（*k*）：控制排名影响衰减的速度。更高的值会降低排名靠前结果的主导地位。                                                 |
