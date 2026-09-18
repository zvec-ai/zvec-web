# Optimize (/en/docs/db/collections/optimize)





The `optimize()` method **improves search performance** by building the configured vector index from vectors accumulated in a temporary flat buffer. It runs **in the background** and **does not block reads or writes**, ensuring your application remains fully responsive.

***

## Why Optimization is Needed [#why-optimization-is-needed]

In Zvec, newly inserted vectors are **not added directly** to the configured vector index. Instead, they are first staged in a lightweight [flat index (brute-force)](../../concepts/vector-index/flat-index/) buffer.

This design choice offers important benefits — but also a trade-off:

* ✅ **Strengths**
  * **Maximum write throughput**: Enables high-speed data ingestion.
  * **Streaming inserts**: Supports real-time insertion for index types like [IVF](../../concepts/vector-index/ivf-index/) that don't natively allow incremental updates.
* ⚠️ **Trade-off**
  * **Slower searches over time**: As the flat buffer grows, search performance degrades.

🔁 **Solution**

Call `optimize()` periodically. This triggers a background worker that merges the staged vectors into the configured vector index — **without interrupting ongoing reads or writes**. 🚀

<Callout className="text-base" type="info">
  `optimize()` **does not lock the collection**. Other threads and operations can continue reading, writing, and querying without delay while optimization is running — your application stays fully responsive.
</Callout>

***

## Usage Example [#usage-example]

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
    ```python  title="Optimize a collection" 
    import zvec

    collection = zvec.open(path="/path/to/my/collection")

    # Insert some documents
    for i in range(1000):
        doc = zvec.Doc(id=f"doc_{i}", vectors={"embedding": [i + 0.1, i + 0.2, i + 0.3]})
        collection.insert(doc)

    # Optimize the collection
    collection.optimize()  # [!code highlight]
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Optimize a collection"
    import { ZVecCollection, ZVecDocInput, ZVecOpen } from "@zvec/zvec";

    const collection: ZVecCollection = ZVecOpen("/path/to/my/collection");

    // Insert some documents
    for (let i = 0; i < 1000; i++) {
        const doc: ZVecDocInput = { id: `doc_${i}`, vectors: { embedding: [i + 0.1, i + 0.2, i + 0.3] } };
        collection.insertSync(doc);
    }

    // Optimize the collection (sync)
    collection.optimizeSync();  // [!code highlight]

    // Optimize the collection (async)
    await collection.optimize();  // [!code highlight]
    ```
  </CodeBlockTab>
</CodeBlockTabs>

***

## Check Indexing Status [#check-indexing-status]

Use the `stats` property to get real-time insights into your collection's indexing state:

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
    print(collection.stats)
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts
    console.log(collection.stats);
    ```
  </CodeBlockTab>
</CodeBlockTabs>

<Accordions type="single">
  <Accordion title="Example">
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
        ```json  
        {"doc_count":1000, "index_completeness":{"embedding":1.000000}}
        ```
      </CodeBlockTab>

      <CodeBlockTab value="Node.js">
        ```json
        { docCount: 1000, indexCompleteness: { embedding: 1 } }
        ```
      </CodeBlockTab>
    </CodeBlockTabs>

    1. `doc_count`: Total number of documents currently stored.
    2. `index_completeness`: Fraction (0.0\~1.0) indicating how much of the vector data has been indexed.
       * `1.0` → All vectors for that vector field are fully indexed using the configured index
       * `0.0` → No indexing has occurred; all vectors remain in the flat buffer and are searched via brute force
       * **Values in between** → Indexing is partial or in progress
  </Accordion>
</Accordions>

***

## When to Call `optimize()` [#when-to-call-optimize]

Optimize **regularly — but not too often**:

* **Too infrequent** → Flat buffers grow large, degrading search performance
* **Too frequent** → Wastes resources optimizing small batches prematurely

Find a balance based on your **data ingestion rate** and **query latency requirements**.

<Callout className="text-base" type="idea">
  **Best practice:**\
  Check your collection's indexing status if searches feel slow.\
  As a general guideline, consider optimizing when you have **100,000+ unindexed documents** — but adjust based on your specific use case.
</Callout>
