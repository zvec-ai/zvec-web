# Delete (/en/docs/db/data-operations/delete)





Zvec provides two ways to delete [documents](../../concepts/data-modeling/#documents). Choose the method that best fits your use case:

| Method               | Input                                             | When to Use                                                                                                |
| -------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `delete()`           | One or more document `id`s                        | Use when you know the exact ID(s) of the documents you want to delete                                      |
| `delete_by_filter()` | A filter expression (e.g., `publish_year < 1900`) | Use for bulk deletion based on field values — ideal for cleaning up documents that match specific criteria |

<Callout className="text-base" type="warn">
  Delete operations are **immediate** and **irreversible**.\
  Always double-check your input before running a delete operation.
</Callout>

***

## Delete by IDs [#delete-by-ids]

Assume you've already opened a collection and have a `collection` object ready.

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

        collection = zvec.open(path="/path/to/example/collection")  # [!code highlight]
        ```
      </CodeBlockTab>

      <CodeBlockTab value="Node.js">
        ```ts  title="Open a collection"
        import { ZVecCollection, ZVecOpen } from "@zvec/zvec";

        const collection: ZVecCollection = ZVecOpen("/path/to/example/collection");   // [!code highlight]
        ```
      </CodeBlockTab>
    </CodeBlockTabs>
  </Accordion>
</Accordions>

Use `delete()` to remove one or more documents when you know their exact IDs.

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
    ```python  title="Delete documents by IDs" 
    # Delete a single document
    result = collection.delete(ids="doc_id_1")              # [!code highlight]
    print(result)  # {"code":0} means success

    # Delete multiple documents at once
    result = collection.delete(ids=["doc_id_2", "doc_id_3"])    # [!code highlight]
    print(result)  # [{"code":0}, {"code":0}]
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Delete documents by IDs"
    // Delete a single document
    let result = collection.deleteSync("doc_id_1");   // [!code highlight]
    console.log(result);  // { ok: true } means success

    // Delete multiple documents at once
    let results = collection.deleteSync(["doc_id_2", "doc_id_3"]);  // [!code highlight]
    console.log(results);   // [ { ok: true }, { ok: true } ]
    ```
  </CodeBlockTab>
</CodeBlockTabs>

<Callout className="text-base" type="info">
  * When given a single `id`, `delete()` returns one `Status` object.
  * When given a list of `id`s, it returns a list of `Status` objects in the same order.
</Callout>

***

## Delete by Filter Condition [#delete-by-filter-condition]

Use `delete_by_filter()` to remove all documents that match a boolean `filter` expression.

The `filter` can reference scalar fields (e.g., `publish_year`, `language`) using [comparison and logical operators](../query/filter/#supported-filter-syntax).

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
    ```python  title="Delete documents by filter condition" 
    # Delete all books published before 1900
    collection.delete_by_filter(filter="publish_year < 1900")   # [!code highlight]

    # Combined filter
    collection.delete_by_filter(                                # [!code highlight]
        filter='publish_year < 1900 AND (language = "English" OR language = "Chinese")'
    )
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Delete documents by filter condition"
    // Delete all books published before 1900 (sync)
    collection.deleteByFilterSync("publish_year < 1900");   // [!code highlight]

    // Delete all books published before 1900 (async)
    await collection.deleteByFilter("publish_year < 1900");   // [!code highlight]

    // Combined filter
    collection.deleteByFilterSync('publish_year < 1900 AND (language = "English" OR language = "Chinese")');  // [!code highlight]
    ```
  </CodeBlockTab>
</CodeBlockTabs>
