# 选项 (/zh/docs/db/collections/create/options)



`CollectionOption` 让用户在创建或打开一个 collection 时，对它的运行时行为进行精确控制：

* `read_only`：以只读模式打开 collection。在此模式下，任何尝试写入数据的操作均会触发错误异常。
  <Callout className="text-base" type="warn">
    **注意**：使用 `create_and_open()` 时，`read_only` 必须设为 `False`。这是因为 collection 的创建过程需要创建并写入文件。
  </Callout>
* `enable_mmap`：启用内存映射 I/O 以实现更高效的数据访问 (默认为 `True`)。该机制通过略微增加内存缓存的占用，来换取显著的性能提升。

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
    ```python  title="Collection 选项" 
    import zvec

    # [!code word:CollectionOption]
    collection_option = zvec.CollectionOption(read_only=False, enable_mmap=True)
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Collection 选项"
    import { ZVecCollectionOptions } from "@zvec/zvec";

    // [!code word:ZVecCollectionOptions]
    const collectionOptions: ZVecCollectionOptions = { readOnly: false, enableMMAP: true };
    ```
  </CodeBlockTab>
</CodeBlockTabs>
