# Search Guide (/en/docs/zvec-grep/search)



Zvec-Grep offers complementary routes behind one `zg query` command. Start with the route that matches what you know, then narrow the search space before increasing the result count.

## Choose a Route [#choose-a-route]

| Your intent                                          | Command                                               | Behavior                  |
| ---------------------------------------------------- | ----------------------------------------------------- | ------------------------- |
| Discover by meaning or combine meaning with keywords | `zg query "authentication flow"`                      | Hybrid ranked sample      |
| Rank known terms by relevance                        | `zg query --fts "AuthService"`                        | BM25-ranked sample        |
| Search only by conceptual similarity                 | `zg query --vector "where credentials are validated"` | Vector-ranked sample      |
| Find every literal or regex occurrence               | `zg query --rg -n -F "AuthService" src`               | Exhaustive unless bounded |

<Callout type="info" className="text-base">
  Use `--rg` for exact or exhaustive work. Use indexed retrieval when wording or location is unknown, or when the answer requires relationships across files.
</Callout>

The default positional query combines lexical and vector retrieval:

```bash
zg query --human "where are user preferences restored at startup" --limit 5
```

When a question also contains exact anchors, fuse them into one ranked plan:

```bash
zg query --hybrid "authentication flow" --fts "ForbiddenError" --fuse --limit 10
```

## Narrow the Workspace [#narrow-the-workspace]

```bash
zg query "plugin lifecycle" -g "src/**" -g "!src/generated/**" -t ts
```

| Option                                   | Use it to                   |
| ---------------------------------------- | --------------------------- |
| `-g`, `--glob`, `--iglob`                | Include or exclude paths    |
| `-t`, `--type`, `-T`, `--type-not`       | Filter file types           |
| `--modified-after` / `--modified-before` | Filter by modification time |

## Control Results and Freshness [#control-results-and-freshness]

| Option                            | Effect                            |
| --------------------------------- | --------------------------------- |
| `--limit <n>`                     | Maximum results per query group   |
| `--human`                         | Fuller terminal-oriented previews |
| `--preview none\|short\|full`     | Indexed source preview size       |
| `--debug` / `--trace`             | Query and per-hit diagnostics     |
| `--refresh background\|wait\|off` | Index freshness policy            |

Indexed results report `fresh` or `possibly_stale`. Use `--refresh wait` only when the latest file changes must be included.

## Improve Weak Results [#improve-weak-results]

1. Confirm the workspace root and index state with `zg status`.
2. Restrict the query to relevant paths or file types.
3. Add one or two concrete anchors with `--fts`.
4. Switch to `--rg` when the target text is known.
5. Review [Supported Content](../supported-content/) and the selected [Embedding Models](../embedding-models/).

Run `zg help query` for the installed version's complete flag reference. If results remain weak, follow [Troubleshooting](../troubleshooting/).
