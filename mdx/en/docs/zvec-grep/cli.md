# CLI Reference (/en/docs/zvec-grep/cli)



`zg` is the terminal and scripting interface to the same local search layer used by AI agents. Start with the command overview, then open the topic guide when you need retrieval or indexing details.

<Callout type="info" title="Use installed help as the command reference">
  Options can evolve between releases. Run `zg help`, `zg help <command>`, or `zg <command> --help` for the exact surface supported by your installed version.
</Callout>

## Command Map [#command-map]

| Command                       | Use it to                                      | Go deeper                                |
| ----------------------------- | ---------------------------------------------- | ---------------------------------------- |
| `zg query`                    | Search an index or run built-in ripgrep        | [Search Guide](../search/)               |
| `zg index` / `zg status`      | Build, update, or inspect a workspace index    | [Manage an Index](../indexing/)          |
| `zg install` / `zg uninstall` | Connect or disconnect AI agents                | [Connect AI Agents](../agents/)          |
| `zg server`                   | Start, stop, or inspect the local service      | [Local Server](../server/)               |
| `zg config` / `zg auth`       | Configure models, providers, and remote access | [Embedding Models](../embedding-models/) |
| `zg help` / `zg version`      | Inspect the installed command surface          | Use the installed help                   |

Before building a large index, also review [Supported Content](../supported-content/) to understand extraction and file-type boundaries.

## Common Starting Points [#common-starting-points]

```bash
# Search with the default hybrid route
zg query --human "where theme preferences are restored" --limit 5

# Build or inspect the current workspace index
zg index --embedding local/potion-code-16m-v2
zg status

# Connect an agent
zg install --target codex --yes
```

Use the topic guides for decision-making and workflows. Use this page—and the installed help—for command discovery.

## Use the Installed Reference [#use-the-installed-reference]

```bash
zg help
zg help query
zg help models
zg help file-types
zg help environment
zg version
```

The most frequently used environment settings are `ZVEC_GREP_MODE`, `ZVEC_GREP_EMBEDDING`, `ZVEC_GREP_MODEL_CACHE`, and `ZVEC_GREP_DEVICE`. Run `zg help environment` for the complete list and precedence rules.
