# Full-Text Search (/en/docs/db/data-operations/query/fts)





Full-text search finds documents by matching text content, ranked by [BM25](https://en.wikipedia.org/wiki/Okapi_BM25) relevance scoring. It supports natural language queries, exact phrase matching, and boolean operators.

***

## Prerequisites [#prerequisites]

This guide assumes you have opened a collection and have a `collection` object ready.

<Accordions type="single">
  <Accordion title="Example Collection Setup">
    This example collection has an FTS-indexed `content` field and a scalar `category` field. No vector fields are required — Zvec supports FTS-only collections.

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
        ```python  title="Create an FTS collection" 
        import zvec

        # [!code word:FtsIndexParam]
        # [!code word:content]
        collection_schema = zvec.CollectionSchema(  # [!code highlight]
            name="article_collection",
            fields=[
                zvec.FieldSchema(
                    name="category",
                    data_type=zvec.DataType.STRING,
                    nullable=False,
                ),
                zvec.FieldSchema(
                    name="content",
                    data_type=zvec.DataType.STRING,
                    nullable=False,
                    index_param=zvec.FtsIndexParam(  # [!code highlight]
                        tokenizer_name="standard",
                        filters=["lowercase"],
                    ),
                ),
            ],
        )

        collection = zvec.create_and_open(
            path="/path/to/collection",
            schema=collection_schema,
        )
        ```

        ```python  title="Insert sample documents" 
        collection.insert([
            zvec.Doc(id="doc_0", fields={"category": "tech", "content": "Introduction to vector databases and embeddings"}),
            zvec.Doc(id="doc_1", fields={"category": "tech", "content": "Machine learning models for natural language processing"}),
            zvec.Doc(id="doc_2", fields={"category": "science", "content": "Deep learning and neural network architectures"}),
            zvec.Doc(id="doc_3", fields={"category": "tech", "content": "Vector search with exact phrase matching"}),
            zvec.Doc(id="doc_4", fields={"category": "science", "content": "Introduction to machine learning fundamentals"}),
        ])
        ```
      </CodeBlockTab>

      <CodeBlockTab value="Node.js">
        ```ts  title="Create an FTS collection"
        import { ZVecCollectionSchema, ZVecCreateAndOpen, ZVecDataType, ZVecIndexType } from "@zvec/zvec";

        // [!code word:FTS]
        // [!code word:content]
        const collectionSchema = new ZVecCollectionSchema({  // [!code highlight]
            name: "article_collection",
            fields: [
                {
                    name: "category",
                    dataType: ZVecDataType.STRING,
                    nullable: false
                },
                {
                    name: "content",
                    dataType: ZVecDataType.STRING,
                    nullable: false,
                    indexParams: {
                        indexType: ZVecIndexType.FTS,  // [!code highlight]
                        tokenizerName: "standard",
                        filters: ["lowercase"]
                    }
                }
            ]
        });

        const collection = ZVecCreateAndOpen("/path/to/collection", collectionSchema);
        ```

        ```ts  title="Insert sample documents"
        collection.insertSync([
            { id: "doc_0", fields: { category: "tech", content: "Introduction to vector databases and embeddings" } },
            { id: "doc_1", fields: { category: "tech", content: "Machine learning models for natural language processing" } },
            { id: "doc_2", fields: { category: "science", content: "Deep learning and neural network architectures" } },
            { id: "doc_3", fields: { category: "tech", content: "Vector search with exact phrase matching" } },
            { id: "doc_4", fields: { category: "science", content: "Introduction to machine learning fundamentals" } }
        ]);
        ```
      </CodeBlockTab>
    </CodeBlockTabs>
  </Accordion>
</Accordions>

***

## Defining an FTS Field [#defining-an-fts-field]

To enable full-text search on a field, add a `FieldSchema` with an `FtsIndexParam` as its `index_param`. The field must be of type `STRING`.

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
    ```python  title="Define an FTS field" 
    import zvec

    # [!code word:FtsIndexParam]
    fts_field = zvec.FieldSchema(  # [!code highlight]
        name="content",
        data_type=zvec.DataType.STRING,
        nullable=False,
        index_param=zvec.FtsIndexParam(
            tokenizer_name="standard",   # Tokenizer to use
            filters=["lowercase"],       # Token filters applied after tokenization
        ),
    )
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Define an FTS field"
    import { ZVecDataType, ZVecFieldSchema, ZVecIndexType } from "@zvec/zvec";

    const ftsField: ZVecFieldSchema = {  // [!code highlight]
        name: "content",
        dataType: ZVecDataType.STRING,
        nullable: false,
        indexParams: {
            indexType: ZVecIndexType.FTS,
            tokenizerName: "standard",  // Tokenizer to use
            filters: ["lowercase"]      // Token filters applied after tokenization
        }
    };
    ```
  </CodeBlockTab>
</CodeBlockTabs>

### `FtsIndexParam` Parameters [#ftsindexparam-parameters]

| Parameter        | Type        | Default         | Description                                                                                                                       |
| ---------------- | ----------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `tokenizer_name` | `str`       | `"standard"`    | Choose from `"standard"`, `"ngram"`, `"whitespace"`, and `"jieba"`. See [Tokenizers](#tokenizers).                                |
| `filters`        | `list[str]` | `["lowercase"]` | Token filters applied in sequence after tokenization. See [Token Filters](#token-filters).                                        |
| `extra_params`   | `str`       | `""`            | JSON string for tokenizer- and filter-specific configuration. See the configuration sections for each tokenizer and token filter. |

<Callout className="text-base" type="info">
  Zvec supports **FTS-only collections** — you can create a collection with text fields and no vector fields at all.
</Callout>

***

## Performing Full-Text Search [#performing-full-text-search]

Zvec provides two query modes for full-text search, both using the `Fts` object within a `Query`:

1. **Match String** — natural language input, automatically tokenized
2. **Query String** — advanced expression syntax with boolean operators

### Match String [#match-string]

Use `match_string` for natural language queries. The input is plain text — no special syntax or escaping is needed. It is tokenized using the same tokenizer configured on the field, and tokens are combined using the default operator (`OR` by default).

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
    ```python  title="Match string query" 
    from zvec.model.param.query import Fts, Query

    # [!code word:match_string]
    result = collection.query(  # [!code highlight]
        queries=Query(
            field_name="content",
            fts=Fts(match_string="machine learning"),  # [!code highlight]
        ),
        topk=5,
    )
    print(result)
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Match string query"
    // [!code word:matchString]
    let result = collection.querySync({  // [!code highlight]
        fieldName: "content",
        fts: { matchString: "machine learning" },  // [!code highlight]
        topk: 5
    });
    console.log(result);
    ```
  </CodeBlockTab>
</CodeBlockTabs>

With the default `OR` operator, this returns documents containing **either** "machine" **or** "learning" (or both), ranked by BM25 relevance.

### Query String [#query-string]

Use `query_string` for advanced queries with explicit boolean operators, required/excluded terms, and exact phrase matching.

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
    ```python  title="Query string with operators" 
    from zvec.model.param.query import Fts, Query

    # [!code word:query_string]
    result = collection.query(  # [!code highlight]
        queries=Query(
            field_name="content",
            fts=Fts(query_string='+learning -neural "vector search"'),  # [!code highlight]
        ),
        topk=5,
    )
    print(result)
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Query string with operators"
    // [!code word:queryString]
    let result = collection.querySync({  // [!code highlight]
        fieldName: "content",
        fts: { queryString: '+learning -neural "vector search"' },  // [!code highlight]
        topk: 5
    });
    console.log(result);
    ```
  </CodeBlockTab>
</CodeBlockTabs>

With the default `OR` operator, a document must contain "learning" and must exclude "neural". Matching the optional phrase "vector search" also contributes to its score.

<Callout className="text-base" type="warn">
  `query_string` and `match_string` are **mutually exclusive** — you must provide exactly one of them in each `Fts` object.
</Callout>

***

## Query Syntax Reference [#query-syntax-reference]

The following operators are supported in `query_string` expressions:

| Syntax     | Meaning                                          | Example                            |
| ---------- | ------------------------------------------------ | ---------------------------------- |
| `term`     | Match a single term                              | `vector`                           |
| `"phrase"` | Match an exact phrase (word order and adjacency) | `"machine learning"`               |
| `+term`    | Term **must** appear in the document             | `+vector`                          |
| `-term`    | Term **must not** appear in the document         | `-slow`                            |
| `a AND b`  | Both terms must match                            | `vector AND search`                |
| `a OR b`   | Either term can match                            | `vector OR embedding`              |
| `a NOT b`  | Match `a` but exclude documents matching `b`     | `learning NOT deep`                |
| `(expr)`   | Group sub-expressions                            | `(vector OR embedding) AND search` |
| `+(expr)`  | Group must match                                 | `+(vector OR embedding)`           |
| `-(expr)`  | Group must not match                             | `-(slow AND outdated)`             |

<Callout className="text-base" type="info">
  **Operator precedence**: `AND` / `NOT` bind tighter than `OR`. Adjacent terms without an explicit operator are combined using the `default_operator` setting (default: `OR`).

  For complex queries mixing multiple operators, **use `()` to make grouping explicit** and avoid unexpected results.
</Callout>

<Callout className="text-base" type="warn">
  Leading negation is not supported — both `NOT term` and standalone `-term` require at least one positive term. Use `a NOT b` or combine `-term` with positive terms (e.g., `a -b`).
</Callout>

***

## Query Parameters [#query-parameters]

| Parameter       | Description                                                                                                       |
| --------------- | ----------------------------------------------------------------------------------------------------------------- |
| `topk`          | The number of top-scoring documents to return.                                                                    |
| `filter`        | An optional SQL-like boolean expression to restrict results. See [conditional filtering](../filter/) for details. |
| `output_fields` | An optional list of scalar field names to include in results. If omitted, all scalar fields are returned.         |

### Default Operator [#default-operator]

By default, adjacent bare terms in both `match_string` and `query_string` are combined with `OR`. To change this to `AND`, pass a `FtsQueryParam` via the `param` field:

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
    ```python  title="Using AND as the default operator" 
    import zvec
    from zvec.model.param.query import Fts, Query

    result = collection.query(
        queries=Query(
            field_name="content",
            fts=Fts(match_string="machine learning"),
            param=zvec.FtsQueryParam(default_operator="AND"),  # [!code highlight]
        ),
        topk=5,
    )
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Using AND as the default operator"
    import { ZVecIndexType } from "@zvec/zvec";

    let result = collection.querySync({
        fieldName: "content",
        fts: { matchString: "machine learning" },
        params: {
            indexType: ZVecIndexType.FTS,
            defaultOperator: "AND"  // [!code highlight]
        },
        topk: 5
    });
    ```
  </CodeBlockTab>
</CodeBlockTabs>

With `default_operator="AND"`, this returns only documents containing **both** "machine" **and** "learning".

<Callout className="text-base" type="info">
  Explicit operators (`AND`, `OR`, `+`, `-`) in a `query_string` are not affected by `default_operator` — it only controls how adjacent bare terms are combined.
</Callout>

***

## Combining FTS with Scalar Filters [#combining-fts-with-scalar-filters]

You can combine full-text search with [scalar filters](../filter/) to narrow results:

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
    ```python  title="FTS with scalar filter" 
    from zvec.model.param.query import Fts, Query

    result = collection.query(
        queries=Query(
            field_name="content",
            fts=Fts(match_string="machine learning"),
        ),
        filter="category = 'tech'",  # [!code highlight]
        topk=5,
    )
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="FTS with scalar filter"
    let result = collection.querySync({
        fieldName: "content",
        fts: { matchString: "machine learning" },
        filter: "category = 'tech'",  // [!code highlight]
        topk: 5
    });
    ```
  </CodeBlockTab>
</CodeBlockTabs>

<Callout className="text-base" type="warn">
  FTS and vector search are **mutually exclusive within one query route**. A single `Query` / `ZVecQuery` should not set both `fts` and `vector` / `id`; use separate query routes with re-ranking, or run separate queries and merge results in your application.
</Callout>

***

## Tokenizers [#tokenizers]

Zvec provides four built-in tokenizers. The tokenizer is configured per-field via `FtsIndexParam`.

| Tokenizer  | Name           | Description                                                                                                                                                      |
| ---------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Standard   | `"standard"`   | Implements Unicode UAX #29 word boundaries and behaves similarly to Elasticsearch's standard tokenizer. Best for most English-like languages. &#x2A;*(Default)** |
| N-gram     | `"ngram"`      | Indexes overlapping character sequences for partial matches.                                                                                                     |
| Whitespace | `"whitespace"` | Splits text on whitespace only (spaces, tabs, newlines). Preserves punctuation within tokens.                                                                    |
| Jieba      | `"jieba"`      | Chinese word segmentation using [cppjieba](https://github.com/yanyiwu/cppjieba). Supports mixed Chinese/English text.                                            |

### Standard Tokenizer [#standard-tokenizer]

The default tokenizer. It implements Unicode UAX #29 word boundaries and behaves similarly to Elasticsearch's standard tokenizer. For CJK ideographs, `standard` emits single-character tokens; use `jieba` when you need Chinese word-level search.

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
    ```python  title="Standard tokenizer" 
    zvec.FtsIndexParam(tokenizer_name="standard", filters=["lowercase"])
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Standard tokenizer"
    {
        indexType: ZVecIndexType.FTS,
        tokenizerName: "standard",
        filters: ["lowercase"]
    }
    ```
  </CodeBlockTab>
</CodeBlockTabs>

**Configuration** (via `extra_params` JSON):

| Key                | Type  | Default | Description                                                                                     |
| ------------------ | ----- | ------- | ----------------------------------------------------------------------------------------------- |
| `max_token_length` | `int` | `255`   | Length in Unicode code points at which the tokenizer splits long words. Accepts 1 to 1,048,576. |

### N-gram Tokenizer [#n-gram-tokenizer]

With the default settings, `ngram` splits `zvec` into `zv`, `ve`, and `ec`. A search for `ve` can then match a document containing `zvec`.

| Key in `extra_params` | Default | Description                                                                                                                                                                  |
| --------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ngram_min`           | `2`     | Minimum gram length in Unicode code points. Must be a positive integer.                                                                                                      |
| `ngram_max`           | `2`     | Maximum gram length. Set it to `ngram_min` or `ngram_min + 1`.                                                                                                               |
| `token_chars`         | `[]`    | An empty list keeps all valid UTF-8 characters. To split on other characters, list the categories to keep from `letter`, `digit`, `whitespace`, `punctuation`, and `symbol`. |

### Whitespace Tokenizer [#whitespace-tokenizer]

Splits text only on whitespace characters. Useful when punctuation should be preserved in tokens.

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
    ```python  title="Whitespace tokenizer" 
    zvec.FtsIndexParam(tokenizer_name="whitespace", filters=["lowercase"])
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Whitespace tokenizer"
    {
        indexType: ZVecIndexType.FTS,
        tokenizerName: "whitespace",
        filters: ["lowercase"]
    }
    ```
  </CodeBlockTab>
</CodeBlockTabs>

### Jieba Tokenizer [#jieba-tokenizer]

Use `jieba` for word-level search over Chinese or mixed Chinese/English text. By default, the tokenizer uses the dictionary and HMM model embedded in the native library.

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
    ```python  title="Jieba tokenizer" 
    zvec.FtsIndexParam(
        tokenizer_name="jieba",
        filters=["lowercase"],
    )
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="Jieba tokenizer"
    {
        indexType: ZVecIndexType.FTS,
        tokenizerName: "jieba",
        filters: ["lowercase"]
    }
    ```
  </CodeBlockTab>
</CodeBlockTabs>

**Configuration** (via `extra_params` JSON):

| Key              | Type  | Default    | Description                                                                                                                                                                                                               |
| ---------------- | ----- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `jieba_dict_dir` | `str` | —          | External directory for the main dictionary (`jieba.dict.utf8`) and HMM model (`hmm_model.utf8`).                                                                                                                          |
| `user_dict_path` | `str` | —          | Path to a file of domain terms to add to the selected main dictionary for this field. Applies to `search`, `mix`, and `full` modes.                                                                                       |
| `cut_mode`       | `str` | `"search"` | Segmentation mode: `"search"` (fine-grained, recommended for search), `"mix"`, `"full"`, or `"hmm"`. See [cppjieba documentation](https://github.com/yanyiwu/cppjieba?tab=readme-ov-file#usage) for details on each mode. |

<Callout className="text-base" type="info">
  Jieba uses the field's `jieba_dict_dir` first, then the `ZVEC_JIEBA_DICT_DIR` environment variable. If both are unset or empty, it uses the embedded resources. An unreadable file required by the selected mode causes initialization to fail.
</Callout>

## Token Filters [#token-filters]

Token filters are applied in sequence after tokenization. The same filter configuration is used for both indexing and querying.

| Filter            | Description                                      |
| ----------------- | ------------------------------------------------ |
| `"lowercase"`     | Converts tokens to Unicode lowercase.            |
| `"ascii_folding"` | Folds Unicode characters into ASCII equivalents. |
| `"stemmer"`       | Normalizes word forms using a Snowball stemmer.  |

For English text, use `lowercase` and `stemmer` so case and word forms do not affect matching. For English-like text or text with diacritics, you can also add `ascii_folding` for accent-insensitive matching.

### Lowercase Filter [#lowercase-filter]

`"lowercase"` converts tokens to Unicode lowercase.

### ASCII Folding Filter [#ascii-folding-filter]

`"ascii_folding"` folds Unicode characters into ASCII equivalents.

### Stemmer Filter [#stemmer-filter]

`"stemmer"` normalizes word forms using a Snowball stemmer. The default language is `"english"`.

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
    ```python  title="English token filter combination" 
    zvec.FtsIndexParam(
        tokenizer_name="standard",
        filters=["lowercase", "stemmer"],
        extra_params='{"stemmer_lang": "english"}',
    )
    ```
  </CodeBlockTab>

  <CodeBlockTab value="Node.js">
    ```ts  title="English token filter combination"
    {
        indexType: ZVecIndexType.FTS,
        tokenizerName: "standard",
        filters: ["lowercase", "stemmer"],
        extraParams: '{"stemmer_lang": "english"}'
    }
    ```
  </CodeBlockTab>
</CodeBlockTabs>

**Stemmer configuration** (via `extra_params` JSON):

| Key            | Type  | Default     | Description                                                                                                                           |
| -------------- | ----- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `stemmer_lang` | `str` | `"english"` | Snowball language or algorithm name. For example, set it to `"porter"` for behavior close to Elasticsearch's default English stemmer. |

***

## Constraints [#constraints]

<Callout className="text-base" type="warn">
  * FTS and vector search are **mutually exclusive within one query route** — a single `Query` / `ZVecQuery` should not set both `fts` and `vector` / `id`.
  * `query_string` and `match_string` are **mutually exclusive** in a single `Fts` object.
  * Define text columns in the collection schema. The [schema evolution](../../../collections/schema-evolution/) API cannot add, alter, or drop FTS columns. Use `create_index()` or `drop_index()` to manage the index on an existing string column.
  * Leading negation (`NOT term` or standalone `-term`) is not supported — at least one positive term is required.
</Callout>
