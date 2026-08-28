# Full-Text Index (/en/docs/db/concepts/fts-index)





A full-text index is a data structure designed for &#x2A;**efficient keyword-based search over text content***.

It breaks text fields into terms (tokens), builds an inverted mapping from terms to documents, and uses BM25 scoring to return results **ranked by relevance** — without scanning every document.

## When to Use a Full-Text Index [#when-to-use-a-full-text-index]

Use a full-text index when you need to **search text content by keywords and rank results by relevance**. It excels in scenarios such as:

* ✅ Natural language queries: users type everyday language to find content
* ✅ Exact phrase matching: `"vector database"` matches the complete phrase, not individual words
* ✅ Boolean retrieval: `+machine -neural` to require or exclude specific terms
* ✅ Multi-language support: built-in tokenizers for English-like languages and Chinese
* ✅ Text-only use cases: build a full-text search collection with no vector fields at all

<Callout className="text-base" type="info">
  How does this differ from an [inverted index](../inverted-index/)? An **inverted index** accelerates exact-value filtering on scalar fields (e.g., `status = "active"`), while a **full-text index** tokenizes text content for keyword retrieval with relevance ranking.
</Callout>

## How Does It Work? [#how-does-it-work]

Imagine you have a collection of articles:

| Doc ID | Content                                                      |
| ------ | ------------------------------------------------------------ |
| 1      | Training and optimizing machine learning models              |
| 2      | Applications of deep learning in natural language processing |
| 3      | Combining vector databases with machine learning             |

<div className="fd-steps">
  <div className="fd-step">
    ### Tokenization [#1-tokenization]

    The full-text index first splits text into tokens using a configured tokenizer. With the default standard tokenizer:

    | Doc ID | Tokens                                                          |
    | ------ | --------------------------------------------------------------- |
    | 1      | `[training, optimizing, machine, learning, models]`             |
    | 2      | `[applications, deep, learning, natural, language, processing]` |
    | 3      | `[combining, vector, databases, machine, learning]`             |
  </div>

  <div className="fd-step">
    ### Token Filtering [#2-token-filtering]

    After tokenization, the full-text index applies token filters in the configured order. For example:

    * `lowercase`: converts tokens to lowercase for case-insensitive matching.

    The same tokenizer and filter configuration is used for both indexing and querying, so choose the text analysis strategy when defining the field.
  </div>

  <div className="fd-step">
    ### Building the Inverted Map [#3-building-the-inverted-map]

    The tokenized results are inverted into a mapping from each term to its list of documents:

    | Term      | Doc IDs     |
    | --------- | ----------- |
    | machine   | `[1, 3]`    |
    | learning  | `[1, 2, 3]` |
    | models    | `[1]`       |
    | deep      | `[2]`       |
    | vector    | `[3]`       |
    | databases | `[3]`       |
    | ...       | ...         |
  </div>

  <div className="fd-step">
    ### BM25 Scoring [#4-bm25-scoring]

    When you query "machine learning", the index locates documents containing those terms — `[1, 2, 3]` — then scores each document using the [BM25](https://en.wikipedia.org/wiki/Okapi_BM25) algorithm.

    BM25 ranks results based on three factors:

    | Factor                               | Effect                                                                                     |
    | ------------------------------------ | ------------------------------------------------------------------------------------------ |
    | **Term Frequency (TF)**              | More occurrences of the term in a document yield a higher score (with diminishing returns) |
    | **Inverse Document Frequency (IDF)** | Rarer terms across the collection receive higher weight                                    |
    | **Document Length**                  | Shorter documents score relatively higher for the same term                                |
  </div>

  <div className="fd-step">
    ### WAND Optimization [#5-wand-optimization]

    When a query contains multiple terms (e.g., "machine learning models"), the full-text index uses the &#x2A;*WAND (Weak AND)** algorithm to optimize retrieval:

    1. Pre-compute a score upper bound for each term
    2. Skip documents that cannot enter the top-k results
    3. Use a Block-Max strategy that operates on blocks of 128 documents for fast skipping

    This enables efficient top-k retrieval on large datasets without fully scoring every candidate document.
  </div>
</div>

## Tokenizers [#tokenizers]

Tokenizers determine how text is split into terms, directly affecting retrieval quality. The same tokenizer configuration is used for both indexing and querying. See [Tokenizers](../../data-operations/query/fts/#tokenizers) for configuration details.

## Key Parameters [#key-parameters]

### Index-Time Parameters [#index-time-parameters]

<div className="flex flex-row flex-wrap gap-3 items-center">
  <CodeExampleLinkButton url="../../collections/create/schema/#fts-example" label="Code Example" />

  <PythonLinkButton url="/api-reference/python/params/#zvec.model.param.FtsIndexParam" label="Python API Reference" />

  <NodeJSLinkButton url="/api-reference/nodejs/interfaces/ZVecFtsIndexParams" label="Node.js API Reference" />
</div>

| Parameter        | Description                                              | Tuning Guidance                                                                                                                                                                                                                                                 |
| ---------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tokenizer_name` | **Tokenizer** used to split text into searchable tokens  | Use `standard` for English-like text; it implements Unicode UAX #29 word boundaries and behaves similarly to Elasticsearch's standard tokenizer. Use `whitespace` when separators are already meaningful, and `jieba` for Chinese or mixed Chinese/English text |
| `filters`        | **Token filters** applied in sequence after tokenization | For English text, use `["lowercase", "stemmer"]`; for English-like text or text with diacritics, you can also add `ascii_folding` for accent-insensitive matching                                                                                               |
| `extra_params`   | **Tokenizer- and filter-specific JSON configuration**    | See the configuration sections for each tokenizer and token filter                                                                                                                                                                                              |

### Query-Time Parameters [#query-time-parameters]

<div className="flex flex-row flex-wrap gap-3 items-center">
  <CodeExampleLinkButton url="../../data-operations/query/fts/#performing-full-text-search" label="Code Example" />

  <PythonLinkButton url="/api-reference/python/params/#zvec.model.param.FtsQueryParam" label="Python API Reference" />

  <NodeJSLinkButton url="/api-reference/nodejs/interfaces/ZVecFtsQueryParams" label="Node.js API Reference" />
</div>

| Parameter                              | Description                                                              | Tuning Guidance                                                               |
| -------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `match_string` / `matchString`         | **Natural-language query text** that is tokenized by the field tokenizer | Use for simple user-entered search text                                       |
| `query_string` / `queryString`         | **Structured query expression** with phrases and boolean operators       | Use when callers need explicit required, excluded, grouped, or phrase terms   |
| `default_operator` / `defaultOperator` | **Default boolean operator** for adjacent bare terms                     | Use `OR` for broader recall, or `AND` when every bare term should be required |

## Full-Text Index vs. Vector Index [#full-text-index-vs-vector-index]

Full-text indexes and vector indexes address **different dimensions** of retrieval:

| Aspect           | Full-Text Index                       | Vector Index                                     |
| ---------------- | ------------------------------------- | ------------------------------------------------ |
| Matching         | Exact keyword matching                | Semantic similarity                              |
| Input            | Text keywords                         | Vector embeddings                                |
| Ranking          | BM25 score                            | Distance / similarity                            |
| Typical use case | "Documents containing these keywords" | "Documents semantically similar to this content" |

<Callout className="text-base" type="warn">
  In Zvec, full-text search and vector search are **mutually exclusive within one query route**: a single `Query` / `ZVecQuery` should not set both `fts` and `vector` / `id`. To combine keyword matching with semantic retrieval, use separate query routes with re-ranking, or run separate queries and merge the results in your application.
</Callout>

## Trade-offs [#trade-offs]

* ⚠️ **Storage overhead**: The inverted map, term frequencies, and position data require additional storage.
* ⚠️ **Write amplification**: Every write operation requires tokenization and index updates, adding write latency.
* ⚠️ **Tokenizer dependency**: Retrieval quality depends on tokenizer choice — for example, Chinese text requires the Jieba tokenizer rather than the default standard tokenizer.
