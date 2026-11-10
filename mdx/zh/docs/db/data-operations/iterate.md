# 遍历 (/zh/docs/db/data-operations/iterate)



使用 &#x2A;*`iter_docs()`** 逐个流式遍历 [Collection](../../collections/) 中的**所有** [Document](../../concepts/data-modeling/#documents)。

与按已知 `id` 获取 Document 的 [`fetch()`](../fetch/) 不同，迭代器执行**全量扫描**。Document 以有界窗口分批流式读取，因此不会将整个 Collection 一次性载入内存，适合导出、备份、迁移或离线处理等场景。

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
    ```python  title="遍历所有 Document" 
    # [!code word:iter_docs]
    with collection.iter_docs() as docs:
        for doc in docs:
            print(doc.id, doc.fields, doc.vectors)
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="遍历所有 Document"
    // [!code word:iterDocsSync]
    for (const doc of collection.iterDocsSync()) {
        console.log(doc.id, doc.fields, doc.vectors);
    }
    ```
  </CodeBlockTab>
</CodeBlockTabs>

<Callout className="text-base" type="info">
  迭代器在 Collection 上持有一个原生资源槽位，因此交给语言自身来关闭它：Python 的 `with` 语句和 JavaScript 的 `for...of` 循环，都会在循环正常结束、提前 break 或抛出异常时释放迭代器。迭代器在被完全遍历耗尽时也会自动关闭。
</Callout>

***

## 选择字段与向量 [#选择字段与向量]

默认情况下，每个 Document 的所有标量字段和所有向量都会被读取。可以使用 `output_fields` 和 `include_vector` 减少读取的数据量：

* **`output_fields`**（`outputFields`）：要返回的标量字段名列表。不传时返回所有标量字段；传入空列表则不返回任何标量字段。未知或重复的字段名会报错。
* **`include_vector`**（`includeVector`）：是否读取向量数据。默认读取向量；如果只需要标量字段，将其关闭可以加快遍历速度。

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
    ```python  title="选择输出字段并排除向量" 
    with collection.iter_docs(  # [!code highlight]
        output_fields=["book_title", "publish_year"],
        include_vector=False,
    ) as docs:
        for doc in docs:
            print(doc.id, doc.field("book_title"), doc.field("publish_year"))
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="选择输出字段并排除向量"
    for (const doc of collection.iterDocsSync({    // [!code highlight]
        outputFields: ["book_title", "publish_year"],
        includeVector: false
    })) {
        console.log(doc.id, doc.fields.book_title, doc.fields.publish_year);
    }
    ```
  </CodeBlockTab>
</CodeBlockTabs>

***

## 快照语义 [#快照语义]

`iter_docs()` 与 `iterDocsSync()` 遍历的都是**调用时刻创建的隔离快照**：

* 迭代器创建**之后**写入的数据（`insert`、`upsert`、`update`）对该迭代器**不可见**。
* 创建之后的删除不影响遍历；创建快照时已被删除的 Document 会被过滤掉。
* 对于可写 Collection，创建迭代器可能会封存（seal）当前写入段（每次调用都可能产生一个新的小段）；只读 Collection 则直接扫描，不写入任何数据。
* 遍历顺序未定义——它**不是**插入顺序，且在 [`optimize()`](../../collections/optimize/) 重组段之后可能改变，因此切勿依赖它。

***

## 并发行为 [#并发行为]

当 Collection 上有迭代器处于打开状态时，以下操作会**报错**：

* Schema 变更——创建或删除索引，以及新增、修改、删除列
* [`optimize()`](../../collections/optimize/)，它会在启动时立即失败
* `close()` 或 `destroy()` Collection

反之，当上述某个维护操作正在运行时，创建迭代器同样会失败。写入、`flush()`、`query()` 与 `fetch()` 均**不受影响**。

关闭 Collection 之前，请先关闭所有迭代器；所有迭代器关闭后，上述限制立即解除。

***

## 提前结束遍历 [#提前结束遍历]

提前停止是安全的——退出 `with` 块或 `for...of` 循环即会释放迭代器占用的槽位。如果你手动驱动迭代器，则需自行关闭：

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
    ```python  title="提前结束遍历" 
    with collection.iter_docs() as docs:
        for doc in docs:
            if doc.field("publish_year") == 1936:
                print("found:", doc.id)
                break   # with 块在此处关闭迭代器
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="提前结束遍历"
    for (const doc of collection.iterDocsSync()) {
        if (doc.fields.publish_year === 1936) {
            console.log("found:", doc.id);
            break;  // for...of 在此处关闭迭代器
        }
    }

    // 手动驱动迭代器时，需自行关闭
    const docs = collection.iterDocsSync();
    const first = docs.next();
    if (!first.done) console.log("first:", first.value.id);
    docs.closeSync();   // [!code highlight]
    ```
  </CodeBlockTab>
</CodeBlockTabs>
