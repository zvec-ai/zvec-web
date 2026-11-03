# Iterate (/en/docs/db/data-operations/iterate)



Use &#x2A;*`iter_docs()`** to stream **all** [documents](../../concepts/data-modeling/#documents) in a [collection](../../collections/) one by one.

Unlike [`fetch()`](../fetch/) — which retrieves documents by known `id`s — iteration performs a **full scan**. Documents are streamed in bounded windows, so the whole collection is never materialized in memory at once — making it suitable for export, backup, migration, or offline processing.

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
    ```python  title="Iterate over all documents" 
    # [!code word:iter_docs]
    with collection.iter_docs() as docs:
        for doc in docs:
            print(doc.id, doc.fields, doc.vectors)
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Iterate over all documents"
    // [!code word:iterDocsSync]
    for (const doc of collection.iterDocsSync()) {
        console.log(doc.id, doc.fields, doc.vectors);
    }
    ```
  </CodeBlockTab>
</CodeBlockTabs>

<Callout className="text-base" type="info">
  The iterator holds a native resource slot on the collection, so let the language close it for you: Python's `with` statement and JavaScript's `for...of` loop both release the iterator when the loop finishes, breaks early, or raises an exception. Iterators also close themselves automatically when fully exhausted.
</Callout>

***

## Select Fields and Vectors [#select-fields-and-vectors]

By default, every scalar field and every vector is materialized for each document. Use `output_fields` and `include_vector` to reduce the amount of data read:

* **`output_fields`** (`outputFields`): a list of scalar field names to return. If omitted, all scalar fields are returned; an empty list returns no scalar fields. Unknown or duplicate names raise an error.
* **`include_vector`** (`includeVector`): whether to materialize vector data. Vectors are included by default; disable it when you only need scalar fields — skipping vectors makes traversal faster.

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
    ```python  title="Select output fields and exclude vectors" 
    with collection.iter_docs(  # [!code highlight]
        output_fields=["book_title", "publish_year"],
        include_vector=False,
    ) as docs:
        for doc in docs:
            print(doc.id, doc.field("book_title"), doc.field("publish_year"))
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Select output fields and exclude vectors"
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

## Snapshot Semantics [#snapshot-semantics]

Both `iter_docs()` and `iterDocsSync()` iterate over an **isolated snapshot taken at call time**:

* Data written **after** the iterator is created — inserts, upserts, updates — is **not visible** to this iterator.
* Deletes made after creation do not affect the iteration; documents already deleted when the snapshot was taken are filtered out.
* On a writable collection, creating the iterator may seal the current writing segment (each call can produce a new small segment); read-only collections are scanned directly without any write.
* Iteration order is unspecified — it is **not** insertion order, and it can change after [`optimize()`](../../collections/optimize/) reorganizes segments — so never rely on it.

***

## Concurrency [#concurrency]

While any iterator is open on a collection, these operations **raise an error**:

* Schema changes — creating or dropping an index, adding, altering or dropping a column
* [`optimize()`](../../collections/optimize/), which fails at its start
* Closing or destroying the collection

Conversely, creating an iterator fails while one of those maintenance operations is already running. Writes, `flush()`, `query()` and `fetch()` remain **unaffected**.

Close every iterator before closing the collection. These restrictions are lifted as soon as all open iterators are closed.

***

## Break Early [#break-early]

Stopping before the end is safe — exiting the `with` block or the `for...of` loop releases the iterator's slot. When you drive the iterator manually instead, close it yourself:

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
    ```python  title="Stop iteration early" 
    with collection.iter_docs() as docs:
        for doc in docs:
            if doc.field("publish_year") == 1936:
                print("found:", doc.id)
                break   # the with-block closes the iterator here
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Stop iteration early"
    for (const doc of collection.iterDocsSync()) {
        if (doc.fields.publish_year === 1936) {
            console.log("found:", doc.id);
            break;  // for...of closes the iterator here
        }
    }

    // Driving the iterator manually? Close it yourself.
    const docs = collection.iterDocsSync();
    const first = docs.next();
    if (!first.done) console.log("first:", first.value.id);
    docs.closeSync();   // [!code highlight]
    ```
  </CodeBlockTab>
</CodeBlockTabs>
