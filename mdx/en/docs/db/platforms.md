# Platform Support (/en/docs/db/platforms)





## Language SDKs [#language-sdks]

All SDKs share one stable C API boundary — pick your language to see the install command and prebuilt platform coverage.

<Tabs items="['Python', 'Node.js', 'Go', 'Rust', 'Java', 'Dart / Flutter', 'C / C++']">
  <Tab value="Python">
    ```bash
    pip install zvec
    ```

    * **Prebuilt coverage**:
      * Linux x86\_64 / ARM64 (supports both glibc and musl libc)
      * macOS x86\_64 / ARM64
      * Windows x86\_64 / ARM64
    * **Requirements**: 64-bit Python 3.10–3.14; no Python 3.10 wheel for Windows ARM64
    * **Repository**: [https://github.com/alibaba/zvec/tree/main/python](https://github.com/alibaba/zvec/tree/main/python)
  </Tab>

  <Tab value="Node.js">
    ```bash
    npm install @zvec/zvec
    ```

    * **Prebuilt coverage**:
      * Linux x86\_64 / ARM64 (glibc and musl)
      * macOS ARM64 / x64
      * Windows x64
    * **Repository**: [https://github.com/zvec-ai/zvec-node](https://github.com/zvec-ai/zvec-node)
  </Tab>

  <Tab value="Go">
    ```bash
    go get github.com/zvec-ai/zvec-go
    ```

    * **Prebuilt coverage**:
      * Linux x64 / ARM64
      * macOS ARM64
      * Windows x64
    * **Repository**: [https://github.com/zvec-ai/zvec-go](https://github.com/zvec-ai/zvec-go)
  </Tab>

  <Tab value="Rust">
    ```bash
    cargo add zvec-rust
    ```

    * **Prebuilt coverage**:
      * Linux x86\_64 / ARM64
      * macOS ARM64
      * Windows x64
    * **Repository**: [https://github.com/zvec-ai/zvec-rust](https://github.com/zvec-ai/zvec-rust)
  </Tab>

  <Tab value="Java">
    ```xml
    <dependency>
      <groupId>org.zvec</groupId>
      <artifactId>zvec-java</artifactId>
    </dependency>
    ```

    * **Prebuilt coverage**:
      * Linux x86\_64 / ARM64 (glibc 2.27 or newer)
      * macOS ARM64
      * Windows x64
    * **Repository**: [https://github.com/zvec-ai/zvec-java](https://github.com/zvec-ai/zvec-java)
  </Tab>

  <Tab value="Dart / Flutter">
    ```bash
    flutter pub add zvec
    ```

    * **Prebuilt coverage**:
      * Android arm64-v8a
      * iOS arm64
      * macOS ARM64
      * Linux x64
      * Windows x64
    * **Repository**: [https://github.com/zvec-ai/zvec-dart](https://github.com/zvec-ai/zvec-dart)
  </Tab>

  <Tab value="C / C++">
    ```bash
    # Pick the archive for your platform from the releases page
    curl -LO https://github.com/alibaba/zvec/releases/latest/download/zvec-sdk-linux-amd64.tar.gz
    ```

    * **Prebuilt coverage**:
      * Linux x86\_64 / ARM64 (supports both glibc and musl libc)
      * macOS x86\_64 / ARM64
      * Windows x86\_64 / ARM64
      * Android arm64-v8a
      * iOS arm64
    * **Repository**: [https://github.com/alibaba/zvec](https://github.com/alibaba/zvec)
  </Tab>
</Tabs>

## Supported Platforms [#supported-platforms]

The table summarizes Python wheels and C/C++ SDKs. Prebuilt coverage for other language SDKs is listed in the tabs above.

| Platform | Architectures                          | Prebuilt artifacts | Notes                             |
| -------- | -------------------------------------- | :----------------: | --------------------------------- |
| Linux    | x86\_64, ARM64                         |          ✅         | Supports both glibc and musl libc |
| macOS    | x86\_64 (Intel), ARM64 (Apple Silicon) |          ✅         |                                   |
| Windows  | x86\_64, ARM64                         |          ✅         | No Python 3.10 wheel for ARM64    |
| Android  | arm64-v8a                              |          ✅         | C/C++ SDK                         |
| iOS      | arm64                                  |          ✅         | C/C++ SDK                         |
| RISC-V   | riscv64                                |          ❌         | Build from source                 |

## Index Availability [#index-availability]

<Accordions type="single">
  <Accordion title="Show the full matrix (9 index types × 9 platforms)">
    | Index                                                                                                            | Linux x86\_64 | Linux ARM64 | macOS x86\_64 | macOS ARM64 | Windows x86\_64 | Windows ARM64 | Android arm64-v8a | iOS arm64 | RISC-V |
    | ---------------------------------------------------------------------------------------------------------------- | :-----------: | :---------: | :-----------: | :---------: | :-------------: | :-----------: | :---------------: | :-------: | :----: |
    | [Flat](../concepts/vector-index/flat-index/)                                                                     |       ✅       |      ✅      |       ✅       |      ✅      |        ✅        |       ✅       |         ✅         |     ✅     |    ✅   |
    | [IVF](../concepts/vector-index/ivf-index/)                                                                       |       ✅       |      ✅      |       ✅       |      ✅      |        ✅        |       ✅       |         ✅         |     ✅     |    ✅   |
    | [HNSW](../concepts/vector-index/hnsw-index/)                                                                     |       ✅       |      ✅      |       ✅       |      ✅      |        ✅        |       ✅       |         ✅         |     ✅     |    ✅   |
    | [Vamana](../concepts/vector-index/diskann-index/)                                                                |       ✅       |      ✅      |       ✅       |      ✅      |        ✅        |       ✅       |         ✅         |     ✅     |    ✅   |
    | Sparse vectors (Flat / HNSW)                                                                                     |       ✅       |      ✅      |       ✅       |      ✅      |        ✅        |       ✅       |         ✅         |     ✅     |    ✅   |
    | RaBitQ ([HNSW](../concepts/vector-index/hnsw-rabitq-index/) / [IVF](../concepts/vector-index/ivf-rabitq-index/)) |       ✅       |      ❌      |       ❌       |      ❌      |        ✅        |       ❌       |         ❌         |     ❌     |    ❌   |
    | [DiskANN](../concepts/vector-index/diskann-index/)                                                               |       ✅       |      ✅      |       ❌       |      ✅      |        ✅        |       ❌       |         ✅         |     ✅     |    ❌   |
    | [INVERT](../concepts/inverted-index/) (scalar)                                                                   |       ✅       |      ✅      |       ✅       |      ✅      |        ✅        |       ✅       |         ✅         |     ✅     |    ✅   |
    | [FTS](../concepts/fts-index/) (full-text)                                                                        |       ✅       |      ✅      |       ✅       |      ✅      |        ✅        |       ✅       |         ✅         |     ✅     |    ✅   |

    <Callout className="text-base" type="info">
      **RaBitQ** requires AVX2 and AVX-512, which is why it is limited to x86\_64 arch today.
    </Callout>
  </Accordion>
</Accordions>

## Related [#related]

<Cards>
  <Card title="Quickstart" href="../quickstart/" description="Install an SDK and run your first search" icon="<Rocket className=&#x22;text-teal-300&#x22; />" />

  <Card title="Building from Source" href="../build/" description="Compile Zvec for a platform without prebuilt artifacts" icon="<Cpu className=&#x22;text-teal-300&#x22; />" />

  <Card title="DiskANN Index" href="../concepts/vector-index/diskann-index/" description="Disk-based retrieval for billion-scale datasets" icon="<HardDrive className=&#x22;text-purple-300&#x22; />" />

  <Card title="Zvec-Grep" href="../../zvec-grep/" description="Local-first workspace search for humans and AI agents" icon="<SearchCode className=&#x22;text-purple-300&#x22; />" />
</Cards>
