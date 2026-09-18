# Options (/en/docs/db/collections/create/options)



The `CollectionOption` lets you control runtime behavior when creating or opening a collection:

* `read_only`: Opens the collection in read-only mode. Attempts to write will raise an error.
  <Callout className="text-base" type="warn">
    **Note**: `read_only` must be set to `False` when calling `create_and_open()`, since creation requires writing files to disk.
  </Callout>
* `enable_mmap`: Uses memory-mapped I/O for faster access (default to `True`). This trades slightly higher memory cache usage for improved performance.

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
    ```python  title="Collection option" 
    import zvec

    # [!code word:CollectionOption]
    collection_option = zvec.CollectionOption(read_only=False, enable_mmap=True)
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Collection option"
    import { ZVecCollectionOptions } from "@zvec/zvec";

    // [!code word:ZVecCollectionOptions]
    const collectionOptions: ZVecCollectionOptions = { readOnly: false, enableMMAP: true };
    ```
  </CodeBlockTab>
</CodeBlockTabs>
