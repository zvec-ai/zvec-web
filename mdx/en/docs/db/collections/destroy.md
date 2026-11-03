# Destroy (/en/docs/db/collections/destroy)



Destroying a collection **permanently deletes it from disk**. This operation **cannot be undone**.

<Callout className="text-base" type="warn">
  **Warning**: All data in the collection will be lost. Ensure you no longer need the collection or have created a backup before calling `destroy()`.
</Callout>

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
    ```python  title="Destroy a collection" 
    import zvec

    collection = zvec.open(path="/path/to/my/collection")

    # Permanently delete the collection
    collection.destroy()  # [!code highlight]
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Destroy a collection"
    import { ZVecCollection, ZVecOpen } from "@zvec/zvec";

    const collection: ZVecCollection = ZVecOpen("/path/to/my/collection");

    // Permanently delete the collection
    collection.destroySync();   // [!code highlight]
    ```
  </CodeBlockTab>
</CodeBlockTabs>

After calling `destroy()`, the collection directory and its contents are removed from the filesystem.

Do not use the `collection` object afterward — it is no longer valid.
