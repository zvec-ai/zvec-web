# 本地 Server (/zh/docs/zvec-grep/server)



多数用户无需手动管理 Server。CLI 默认使用 `auto` 模式：已有可用服务时连接服务，否则直接执行。默认 stdio Agent 接入会自动启动并重新连接服务。

仅在连续执行 CLI 查询、使用 HTTP MCP 或排查问题时需要主动管理。常驻进程可以：

* 复用已加载的 Embedding 模型和运行时资源；
* 避免每条命令都重新初始化检索资源；
* 降低多个终端或脚本之间的模型冷启动开销。

## 管理服务 [#管理服务]

| 命令                               | 用途          |
| -------------------------------- | ----------- |
| `zg server on`                   | 在后台启动服务     |
| `zg server status`               | 查看当前状态      |
| `zg server status --check-ready` | 未就绪时返回非零退出码 |
| `zg server run`                  | 在前台运行服务     |
| `zg server off`                  | 停止后台服务      |

```bash
zg server on
zg server status --check-ready
zg server off
```

需要在当前终端观察进程和日志时，使用前台模式：

```bash
zg server run
```

## CLI 连接模式 [#cli-连接模式]

CLI 支持 `direct`、`server` 和 `auto` 三种模式。通过 `ZVEC_GREP_MODE` 或 `--mode` 覆盖默认的 `auto` 模式：

```bash
ZVEC_GREP_MODE=server zg query "发布清单"
zg query --mode server "发布清单"
```

`ZVEC_GREP_SERVER_URL` 用于指定 CLI 客户端连接的服务地址。

## 监听地址与鉴权 [#监听地址与鉴权]

服务仅监听本地回环地址，默认为 `127.0.0.1:7999`。主动启动时可以指定地址：

```bash
zg server on --listen 127.0.0.1:7999
zg server run --listen 127.0.0.1:7999
```

本地回环地址默认不启用鉴权。可以通过 Token 文件或环境变量要求 Bearer 鉴权：

```bash
zg server on --token-file /path/to/token
ZVEC_GREP_SERVER_TOKEN="your-token" zg server run
```

相关设置包括 `ZVEC_GREP_SERVER_TOKEN`、`ZVEC_GREP_SERVER_TOKEN_FILE` 和 `ZVEC_GREP_HOME`。工作区索引仍保存在 `<root>/.zvec-grep/` 下。

<Callout type="info">
  修改影响 Embedding 运行时的环境设置后，请重启服务。
</Callout>

当前版本支持的完整选项请运行 `zg help server` 和 `zg help environment`。服务无法就绪时，请查看[故障排查](../troubleshooting/)。
