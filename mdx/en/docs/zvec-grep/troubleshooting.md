# Troubleshooting (/en/docs/zvec-grep/troubleshooting)



Start with three checks:

```bash
zg version
zg status
zg help
```

## The `zg` Command Is Unavailable [#the-zg-command-is-unavailable]

Zvec-Grep requires Node.js 22 or newer:

```bash
node --version
npm install -g @zvec/zvec-grep
zg version
```

If npm succeeds but `zg` is still missing, add npm's global binary directory to your shell `PATH`.

## The Index Is Missing or Stale [#the-index-is-missing-or-stale]

Run commands from the intended workspace root:

```bash
zg status --check-ready
zg index
zg query "release checklist" --refresh wait
```

Use `--rebuild` only when changing the embedding model or intentionally replacing stored index settings.

## Search Results Are Empty or Weak [#search-results-are-empty-or-weak]

1. Use `--rg` for known text, identifiers, paths, or regex.
2. Use `--fts` for known terms that need ranking.
3. Use the default hybrid query when wording or location is unknown.
4. Restrict broad workspaces with `-g`, `-t`, or `-T`.
5. Confirm that the content is indexed and the model fits it.

```bash
zg query "authentication flow" --debug --trace
zg index --debug
```

See [Search Guide](../search/), [Supported Content](../supported-content/), and [Embedding Models](../embedding-models/).

## Explicit Server Mode Is Not Ready [#explicit-server-mode-is-not-ready]

This applies only when using `--mode server` or an HTTP MCP connection. Default stdio Agent integrations manage the service automatically.

```bash
zg server status --check-ready
zg server on
zg server status --check-ready
```

Run `zg server run` when you need foreground logs. See [Local Server](../server/) for lifecycle, client mode, listen address, and authentication.

## An Agent Cannot Use Zvec-Grep [#an-agent-cannot-use-zvec-grep]

```bash
zg install --target codex --yes
```

Restart the Agent or open a new session. Exact identifiers and filenames may correctly use its native grep instead of Zvec-Grep. See [Connect AI Agents](../agents/).

## Remote Embedding Is Denied [#remote-embedding-is-denied]

Inspect or grant the separate workspace authorization:

```bash
zg auth status
zg auth grant --capability embedding --scope workspace --embedding qwen/text-embedding-v4
```

Use `--allow-remote` for one command, or choose a local model when content must not leave the machine.

## Reset Safely [#reset-safely]

```bash
zg index --rebuild --embedding local/potion-code-16m-v2
zg index --drop --yes
```

<Callout type="warn" title="Dropping is destructive">
  `--drop` deletes the workspace index, not the source files. Indexed search remains unavailable until you build another index.
</Callout>

When reporting a problem, include the version, operating system, failing command, relevant `zg status`, and sanitized diagnostics. Remove credentials, private paths, and sensitive excerpts.

[Open a Zvec-Grep issue](https://github.com/zvec-ai/zvec-grep/issues)
