# Local Server (/en/docs/zvec-grep/server)



Most users do not need to manage the Server. The CLI defaults to `auto`: it uses a ready local service when available and otherwise runs directly. The default stdio Agent integration starts and reconnects the service automatically.

Manage it explicitly only for repeated CLI queries, HTTP MCP connections, or troubleshooting. A resident process can:

* share one loaded Embedding model and its runtime resources;
* avoid reinitializing search resources for every command;
* reduce model cold starts across terminals and scripts.

## Manage the Service [#manage-the-service]

| Command                          | Purpose                             |
| -------------------------------- | ----------------------------------- |
| `zg server on`                   | Start the service in the background |
| `zg server status`               | Show its current state              |
| `zg server status --check-ready` | Exit non-zero unless it is ready    |
| `zg server run`                  | Run it in the foreground            |
| `zg server off`                  | Stop the background service         |

```bash
zg server on
zg server status --check-ready
zg server off
```

Use foreground mode when you want the process and logs in the current terminal:

```bash
zg server run
```

## Client Mode [#client-mode]

The CLI supports `direct`, `server`, and `auto` modes. Override the default `auto` mode with `ZVEC_GREP_MODE` or `--mode`:

```bash
ZVEC_GREP_MODE=server zg query "release checklist"
zg query --mode server "release checklist"
```

`ZVEC_GREP_SERVER_URL` selects the service URL used by CLI clients.

## Listen Address and Authentication [#listen-address-and-authentication]

The service listens on loopback and defaults to `127.0.0.1:7999`. Override the address when starting it explicitly:

```bash
zg server on --listen 127.0.0.1:7999
zg server run --listen 127.0.0.1:7999
```

Authentication is disabled by default on loopback. Use a token file or environment variable to require Bearer authentication:

```bash
zg server on --token-file /path/to/token
ZVEC_GREP_SERVER_TOKEN="your-token" zg server run
```

Related settings are `ZVEC_GREP_SERVER_TOKEN`, `ZVEC_GREP_SERVER_TOKEN_FILE`, and `ZVEC_GREP_HOME`. Workspace indexes remain under `<root>/.zvec-grep/`.

<Callout type="info">
  Restart the service after changing environment settings that affect its Embedding runtime.
</Callout>

For current options, run `zg help server` and `zg help environment`. If the service does not become ready, see [Troubleshooting](../troubleshooting/).
