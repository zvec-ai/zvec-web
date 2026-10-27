# 平台支持 (/zh/docs/db/platforms)





## 语言 SDK [#语言-sdk]

所有 SDK 共享同一条稳定的 C API 边界——选择你的语言，查看安装命令与预编译产物覆盖。

<Tabs items="['Python', 'Node.js', 'Go', 'Rust', 'Java', 'Dart / Flutter', 'C / C++']">
  <Tab value="Python">
    ```bash
    pip install zvec
    ```

    * **预编译覆盖**：
      * Linux x86\_64 / ARM64（支持 glibc 和 musl 两种 C 标准库）
      * macOS x86\_64 / ARM64
      * Windows x86\_64 / ARM64
    * **版本要求**：64 位 Python 3.10–3.14；Windows ARM64 不提供 Python 3.10 wheel
    * **代码仓库**：[https://github.com/alibaba/zvec/tree/main/python](https://github.com/alibaba/zvec/tree/main/python)
  </Tab>

  <Tab value="Node.js">
    ```bash
    npm install @zvec/zvec
    ```

    * **预编译覆盖**：
      * Linux x86\_64 / ARM64（glibc 与 musl）
      * macOS ARM64 / x64
      * Windows x64
    * **代码仓库**：[https://github.com/zvec-ai/zvec-node](https://github.com/zvec-ai/zvec-node)
  </Tab>

  <Tab value="Go">
    ```bash
    go get github.com/zvec-ai/zvec-go
    ```

    * **预编译覆盖**：
      * Linux x64 / ARM64
      * macOS ARM64
      * Windows x64
    * **代码仓库**：[https://github.com/zvec-ai/zvec-go](https://github.com/zvec-ai/zvec-go)
  </Tab>

  <Tab value="Rust">
    ```bash
    cargo add zvec-rust
    ```

    * **预编译覆盖**：
      * Linux x86\_64 / ARM64
      * macOS ARM64
      * Windows x64
    * **代码仓库**：[https://github.com/zvec-ai/zvec-rust](https://github.com/zvec-ai/zvec-rust)
  </Tab>

  <Tab value="Java">
    ```xml
    <dependency>
      <groupId>org.zvec</groupId>
      <artifactId>zvec-java</artifactId>
    </dependency>
    ```

    * **预编译覆盖**：
      * Linux x86\_64 / ARM64（glibc 2.27 及以上）
      * macOS ARM64
      * Windows x64
    * **代码仓库**：[https://github.com/zvec-ai/zvec-java](https://github.com/zvec-ai/zvec-java)
  </Tab>

  <Tab value="Dart / Flutter">
    ```bash
    flutter pub add zvec
    ```

    * **预编译覆盖**：
      * Android arm64-v8a
      * iOS arm64
      * macOS ARM64
      * Linux x64
      * Windows x64
    * **代码仓库**：[https://github.com/zvec-ai/zvec-dart](https://github.com/zvec-ai/zvec-dart)
  </Tab>

  <Tab value="C / C++">
    ```bash
    # 从 Releases 页选择对应平台的 SDK 压缩包
    curl -LO https://github.com/alibaba/zvec/releases/latest/download/zvec-sdk-linux-amd64.tar.gz
    ```

    * **预编译覆盖**：
      * Linux x86\_64 / ARM64（支持 glibc 和 musl 两种 C 标准库）
      * macOS x86\_64 / ARM64
      * Windows x86\_64 / ARM64
      * Android arm64-v8a
      * iOS arm64
    * **代码仓库**：[https://github.com/alibaba/zvec](https://github.com/alibaba/zvec)
  </Tab>
</Tabs>

## 支持的软硬件平台 [#支持的软硬件平台]

下表汇总 Python wheel 与 C/C++ SDK 的平台覆盖，其他语言 SDK 的预编译覆盖范围见上方标签页。

| 平台      | 架构                                  | 预编译产物 | 说明                          |
| ------- | ----------------------------------- | :---: | --------------------------- |
| Linux   | x86\_64、ARM64                       |   ✅   | 支持 glibc 和 musl 两种 C 标准库    |
| macOS   | x86\_64（Intel）、ARM64（Apple Silicon） |   ✅   |                             |
| Windows | x86\_64、ARM64                       |   ✅   | ARM64 不提供 Python 3.10 wheel |
| Android | arm64-v8a                           |   ✅   | C/C++ SDK                   |
| iOS     | arm64                               |   ✅   | C/C++ SDK                   |
| RISC-V  | riscv64                             |   ❌   | 需源码构建                       |

## 索引可用性矩阵 [#索引可用性矩阵]

<Accordions type="single">
  <Accordion title="展开完整矩阵（9 类索引 × 9 平台）">
    | 索引                                                                                                              | Linux x86\_64 | Linux ARM64 | macOS x86\_64 | macOS ARM64 | Windows x86\_64 | Windows ARM64 | Android arm64-v8a | iOS arm64 | RISC-V |
    | --------------------------------------------------------------------------------------------------------------- | :-----------: | :---------: | :-----------: | :---------: | :-------------: | :-----------: | :---------------: | :-------: | :----: |
    | [Flat](../concepts/vector-index/flat-index/)                                                                    |       ✅       |      ✅      |       ✅       |      ✅      |        ✅        |       ✅       |         ✅         |     ✅     |    ✅   |
    | [IVF](../concepts/vector-index/ivf-index/)                                                                      |       ✅       |      ✅      |       ✅       |      ✅      |        ✅        |       ✅       |         ✅         |     ✅     |    ✅   |
    | [HNSW](../concepts/vector-index/hnsw-index/)                                                                    |       ✅       |      ✅      |       ✅       |      ✅      |        ✅        |       ✅       |         ✅         |     ✅     |    ✅   |
    | [Vamana](../concepts/vector-index/diskann-index/)                                                               |       ✅       |      ✅      |       ✅       |      ✅      |        ✅        |       ✅       |         ✅         |     ✅     |    ✅   |
    | 稀疏向量（Flat / HNSW）                                                                                               |       ✅       |      ✅      |       ✅       |      ✅      |        ✅        |       ✅       |         ✅         |     ✅     |    ✅   |
    | RaBitQ（[HNSW](../concepts/vector-index/hnsw-rabitq-index/) / [IVF](../concepts/vector-index/ivf-rabitq-index/)） |       ✅       |      ❌      |       ❌       |      ❌      |        ✅        |       ❌       |         ❌         |     ❌     |    ❌   |
    | [DiskANN](../concepts/vector-index/diskann-index/)                                                              |       ✅       |      ✅      |       ❌       |      ✅      |        ✅        |       ❌       |         ✅         |     ✅     |    ❌   |
    | [INVERT](../concepts/inverted-index/)（标量倒排）                                                                     |       ✅       |      ✅      |       ✅       |      ✅      |        ✅        |       ✅       |         ✅         |     ✅     |    ✅   |
    | [FTS](../concepts/fts-index/)（全文检索）                                                                             |       ✅       |      ✅      |       ✅       |      ✅      |        ✅        |       ✅       |         ✅         |     ✅     |    ✅   |

    <Callout className="text-base" type="info">
      **RaBitQ** 依赖 AVX2 与 AVX-512，因此目前仅支持 x86\_64 架构平台。
    </Callout>
  </Accordion>
</Accordions>

## 相关阅读 [#相关阅读]

<Cards>
  <Card title="快速开始" href="../quickstart/" description="安装 SDK 并跑通第一次检索" icon="<Rocket className=&#x22;text-teal-300&#x22; />" />

  <Card title="从源码构建" href="../build/" description="为没有预编译产物的平台自行编译 Zvec" icon="<Cpu className=&#x22;text-teal-300&#x22; />" />

  <Card title="DiskANN 索引" href="../concepts/vector-index/diskann-index/" description="面向十亿级数据的磁盘检索" icon="<HardDrive className=&#x22;text-purple-300&#x22; />" />

  <Card title="Zvec-Grep" href="../../zvec-grep/" description="面向人与 AI Agent 的本地工作区检索" icon="<SearchCode className=&#x22;text-purple-300&#x22; />" />
</Cards>
