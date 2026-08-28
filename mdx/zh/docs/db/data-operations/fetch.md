# 获取 (/zh/docs/db/data-operations/fetch)



使用 `fetch()` 按 `id` 获取 [Document](../../concepts/data-modeling/#documents)。
这是一个**直接查找**操作——不涉及搜索、评分或过滤。

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
    ```python  title="获取 Document" 
    # [!code word:fetch]
    # 获取单个 Document
    result = collection.fetch(ids="book_1")
    print(result)   # { "book_1": Doc(...) }


    # 获取多个 Document
    result = collection.fetch(ids=["book_1", "book_2", "book_3"])
    print(result)   # { "book_1": Doc(...), "book_2": Doc(...), "book_3": Doc(...) }
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="获取 Document"
    // [!code word:fetchSync]
    // 获取单个 Document
    let result = collection.fetchSync("book_1");
    console.log(result);    // { "book_1": {...} }

    // 获取多个 Document
    let results = collection.fetchSync(["book_1", "book_2", "book_3"]);
    console.log(results);   // { "book_1": {...}, "book_2": {...}, "book_3": {...} }
    ```
  </CodeBlockTab>
</CodeBlockTabs>

* **输入**：单个 Document `id` 或 `id` 列表。
* **输出**：从每个**找到的** `id` 到对应 Document 对象的映射。
* 不存在的 `id` 会被**静默忽略**（不会抛出错误）。
* 返回的字典不保证输入顺序——请通过 `id` 访问 Document。
