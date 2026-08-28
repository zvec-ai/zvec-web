# Embedding Models (/en/docs/zvec-grep/embedding-models)



The embedding model affects language coverage, memory use, input length, indexing speed, and semantic quality.

## Recommended Starting Point [#recommended-starting-point]

Start with the built-in default:

```bash
zg index
```

Zvec-Grep uses `local/potion-code-16m-v2` when no model is configured. Change it only when the workspace needs different language coverage, input length, or retrieval quality.

## Configure Local Models [#configure-local-models]

### Defaults and overrides [#defaults-and-overrides]

For a new index, `--embedding` takes priority over `ZVEC_GREP_EMBEDDING`, then the configured global default. These are independent options:

```bash
# Use a model for this index only
zg index --embedding local/potion-multilingual-128m

# Set the default for future indexes
zg config model set local/potion-multilingual-128m --default

# Override the default for this process
ZVEC_GREP_EMBEDDING=local/potion-retrieval-32m zg index
```

### Supported local models [#supported-local-models]

| Model                                | Best for                               | Runtime        |
| ------------------------------------ | -------------------------------------- | -------------- |
| `local/potion-code-16m-v2`           | Fast first index for code              | Model2Vec FP16 |
| `local/potion-retrieval-32m`         | English documents                      | Model2Vec FP32 |
| `local/potion-multilingual-128m`     | Multilingual documents                 | Model2Vec FP32 |
| `local/all-minilm-l6-v2`             | Short English text                     | ONNX Q4        |
| `local/bge-small-en-v1.5`            | English passages                       | ONNX Q4        |
| `local/multilingual-e5-small`        | Compact multilingual retrieval         | ONNX Q8        |
| `local/jina-embeddings-v2-base-code` | Long-context multilingual code         | ONNX Q8        |
| `local/gte-modernbert-base`          | Long English documents                 | ONNX Q4        |
| `local/nomic-embed-text-v1.5`        | Long English documents and queries     | ONNX Q4        |
| `local/embeddinggemma-300m`          | Multilingual code and documents        | GGUF Q8\_0     |
| `local/qwen3-embedding-0.6b`         | Higher-capacity multilingual retrieval | GGUF Q8\_0     |

### Device and cache [#device-and-cache]

Transformer and GGUF models support `auto`, `cpu`, `metal`, `vulkan`, and `cuda`. Potion models use static lookup and do not benefit from a GPU.

```bash
zg index --embedding local/jina-embeddings-v2-base-code --device auto
zg config model set local/jina-embeddings-v2-base-code --device metal
```

Use `ZVEC_GREP_DEVICE` for a process-level override. Models are cached in `~/.zvec-grep/models` by default; change it with `--model-cache` or `ZVEC_GREP_MODEL_CACHE`.

### Change a local model [#change-a-local-model]

Existing indexes keep their stored model. Rebuild to change it; changing only the device does not require a rebuild.

```bash
zg index --rebuild --embedding local/potion-multilingual-128m
```

## Configure Remote Models [#configure-remote-models]

Remote models avoid local inference but send authorized workspace content and queries to the configured provider.

### Supported remote models [#supported-remote-models]

| Model                         | Best for                 |
| ----------------------------- | ------------------------ |
| `qwen/text-embedding-v4`      | Managed text retrieval   |
| `qwen/qwen3.7-text-embedding` | Very long text inputs    |
| `qwen/qwen3-vl-embedding`     | Text and image retrieval |

### Configure the provider [#configure-the-provider]

```bash
zg config provider set qwen --api-key "$DASHSCOPE_API_KEY"
zg config model set qwen/text-embedding-v4 --default
```

### Authorize remote access [#authorize-remote-access]

Provider credentials enable access but do not authorize data transfer. Use `--allow-remote` once, or grant access for the current workspace:

```bash
zg index --embedding qwen/text-embedding-v4 --allow-remote

zg auth grant --capability embedding --scope workspace \
  --embedding qwen/text-embedding-v4
```

Use `zg auth status` to inspect grants and `zg auth revoke` to remove them.

### Change remote configuration [#change-remote-configuration]

Changing the model or endpoint requires a rebuild. Changing only the API key does not.
