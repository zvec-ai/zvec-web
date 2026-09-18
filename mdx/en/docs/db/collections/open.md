# Open (/en/docs/db/collections/open)



To open an existing collection, use the `open()` function to load it from disk.

<Callout className="text-base" type="warn">
  The specified path **must point to an existing Zvec collection**. If no valid collection is found, `open()` will raise an error.
</Callout>

## Usage [#usage]

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

    existing_collection = zvec.open(  # [!code highlight]
        path="/path/to/my/collection",
        option=zvec.CollectionOption(read_only=False, enable_mmap=True),
    )
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Open a collection"
    import { ZVecCollection, ZVecOpen } from "@zvec/zvec";

    const existingCollection: ZVecCollection = ZVecOpen(  // [!code highlight]
        "/path/to/my/collection",
        { readOnly: false, enableMMAP: true }
    );
    ```
  </CodeBlockTab>
</CodeBlockTabs>

## Parameters [#parameters]

* `path`: The filesystem path to the collection directory.
* `option`: Settings that control runtime behavior.
  * `read_only`: Opens the collection in read-only mode. Attempts to write will raise an error.
    <Callout className="text-base" type="info">
      Use read-only mode when sharing a collection across multiple processes — it ensures safe concurrent access without risking data corruption.
    </Callout>
  * `enable_mmap`: Uses memory-mapped I/O for faster access (defaults to `True`). This trades slightly higher memory cache usage for improved performance.
