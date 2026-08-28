# IVF-RaBitQ 索引 (/zh/docs/db/concepts/vector-index/ivf-rabitq-index)





IVF-RaBitQ 将 [IVF](../ivf-index/) 的聚类分区与 [RaBitQ](https://arxiv.org/abs/2405.12497) 量化结合起来：IVF 先缩小需要扫描的候选范围，RaBitQ 再以紧凑的二进制编码估算候选距离，从而同时降低查询计算量和索引内存占用。

<Callout className="text-base" type="info">
  **平台要求**：IVF-RaBitQ 目前仅支持 **Linux x86\_64**，CPU 需要支持 **AVX2 或 AVX512**。Zvec 会自动选择最佳运行时。
</Callout>

## 工作原理 [#工作原理]

### 索引构建阶段 ⚙️ [#索引构建阶段-️]

1. **训练 IVF 质心**：系统从训练数据中生成 `nlist` 个聚类质心。`sample_count` 可限制训练样本数，避免在超大数据集上使用全部向量训练。
2. **分配倒排列表**：每个向量被分配到最近的质心，并写入该质心对应的倒排列表。
3. **RaBitQ 编码**：系统对向量执行随机旋转，并围绕所属质心对向量进行量化。每个维度至少使用 1 位二进制编码；当 `total_bits` 大于 1 时，额外位用于提高距离估计精度。
4. **按批次组织编码**：同一倒排列表内的量化编码按批次布局，以便查询时并行计算。

### 查询阶段 🔍 [#查询阶段-]

1. **选择倒排列表**：系统先比较查询向量与所有质心，仅选择距离最近的 `nprobe` 个倒排列表。
2. **预处理查询向量**：查询向量经过与建库阶段一致的旋转，并生成批量距离估计所需的查询状态。
3. **批量估算距离**：系统先使用 1 位编码快速估算候选距离和误差下界，淘汰不可能进入 Top-K 的候选；再对保留下来的候选使用额外量化位提高估算精度。
4. **可选精确精化**：启用 `is_using_refiner` 后，系统扩大候选集，并使用原始 FP32 向量重新计算分数。

## 何时使用 IVF-RaBitQ？ [#何时使用-ivf-rabitq]

* ✅ 数据集规模很大，希望同时减少候选扫描量和向量内存占用
* ✅ 数据具有一定的聚类结构，适合通过 IVF 缩小搜索范围
* ✅ 可以接受离线聚类训练，并愿意针对 Recall 与延迟调节 `nlist` 和 `nprobe`
* ✅ 工作负载运行在支持 AVX2 或 AVX512 的 Linux x86\_64 服务器上

<Callout className="text-base" type="idea">
  **最佳实践**：先使用默认的 `total_bits=7`，主要通过 `nprobe` 调节查询时的 Recall 与延迟。只有在索引内存仍然过高且可以接受一定精度损失时，才降低 `total_bits`。

  对于相同的 RaBitQ 编码，IVF-RaBitQ 通常比 HNSW-RaBitQ 使用更少的结构性内存，但对聚类质量和查询参数更敏感。如果更关注低延迟和高 Recall，且可以承担图结构内存，可优先考虑 [HNSW-RaBitQ](../hnsw-rabitq-index/)；如果更关注大规模数据下的内存效率，可优先评估 IVF-RaBitQ。
</Callout>

## 优势 [#优势]

1. ✨ **双重缩减查询开销** — IVF 只扫描部分倒排列表，RaBitQ 再通过紧凑编码和位运算加速列表内距离估计
2. ✨ **内存效率高** — `total_bits=1` 时，单看量化向量载荷，理论上可缩小到 FP32 的约 1/32；实际索引还包含质心、文档 ID、对齐及其他元数据
3. ✨ **支持误差界剪枝** — 先使用低成本估算和下界过滤候选，仅对有机会进入 Top-K 的候选执行更精细的计算

## 权衡 [#权衡]

1. ⚠️ **平台受限** — 仅支持 Linux x86\_64，需要 AVX2 或 AVX512
2. ⚠️ **构建开销较大** — 需要训练质心、执行随机旋转并生成量化编码
3. ⚠️ **参数敏感** — `nlist` 和 `nprobe` 需要根据数据规模、分布、Recall 目标及延迟预算进行验证
4. ⚠️ **数据限制** — 仅支持 FP32 稠密向量、64–4095 维，以及 `L2`、`IP`、`COSINE` 距离度量

## 关键参数 [#关键参数]

### 索引构建参数 [#索引构建参数]

<div className="flex flex-row flex-wrap gap-3 items-center">
  <CodeExampleLinkButton url="../../../collections/create/schema/#ivf-rabitq-example" label="代码示例" />

  <PythonLinkButton url="/api-reference/python/params/#zvec.model.param.IvfRabitqIndexParam" label="Python API 参考" />

  <NodeJSLinkButton url="/api-reference/nodejs/interfaces/ZVecIvfRabitqIndexParams" label="Node.js API 参考" />
</div>

| 参数             | 默认值             | 描述                                   | 调参指南                                                                                                         |
| -------------- | --------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `metric_type`  | `MetricType.IP` | 用于比较向量的相似度度量；支持 `L2`、`IP` 和 `COSINE` | 根据 Embedding 模型的训练方式选择                                                                                       |
| `nlist`        | `1024`          | **聚类数（倒排列表数）** — 构建时将向量空间划分成的聚类数量    | 可从 `nlist` ≈ $\sqrt{N}$ 开始实验，其中 `N` 为向量数。更大的值会形成更小、更细的列表，但增加训练、质心比较及元数据开销。`nlist` 必须大于 `0`，并应确保训练样本数足以形成所需聚类 |
| `total_bits`   | `7`             | **RaBitQ 每维总量化位数** — 取值范围为 `1`–`9`   | 更大的值通常能提高距离估计精度和 Recall，但占用更多内存；`1` 表示仅使用基础二进制编码                                                             |
| `sample_count` | `0`             | **训练样本数** — `0` 表示使用全部向量训练聚类质心       | 超大数据集可设置一个小于总向量数的正整数，以减少训练时间和峰值内存；不得小于 `0`                                                                   |

<Callout className="text-base" type="info">
  Node.js 使用 camelCase 参数名：`metricType`、`nList`、`totalBits` 和 `sampleCount`。
</Callout>

### 索引查询参数 [#索引查询参数]

<div className="flex flex-row flex-wrap gap-3 items-center">
  <CodeExampleLinkButton url="../../../data-operations/query/single-vector/#ivf-rabitq-example" label="代码示例" />

  <PythonLinkButton url="/api-reference/python/params/#zvec.model.param.IvfRabitqQueryParam" label="Python API 参考" />

  <NodeJSLinkButton url="/api-reference/nodejs/interfaces/ZVecIvfRabitqQueryParams" label="Node.js API 参考" />
</div>

| 参数                 | 默认值     | 描述                                    | 调参指南                                                               |
| ------------------ | ------- | ------------------------------------- | ------------------------------------------------------------------ |
| `nprobe`           | `10`    | **查询时搜索的倒排列表数** — 系统选择距离查询向量最近的列表进行扫描 | 更大的值通常带来更高 Recall 和更高延迟。超过实际列表数时会按实际列表数处理；该值必须大于 `0`               |
| `radius`           | `0.0`   | **距离（相似度）阈值**，用于范围过滤                  | 仅返回满足阈值的 Document；如果必须获得完整 Top-K，请避免设置过严的阈值                        |
| `is_linear`        | `False` | 强制使用暴力线性检索，而不使用 IVF-RaBitQ 索引         | 仅用于调试、小型 Collection 或验证索引结果；大数据集下开销很高                              |
| `is_using_refiner` | `False` | 使用原始 FP32 向量对量化检索候选重新计算精确分数           | 需要更高精度时启用，但会增加候选读取和精确距离计算开销                                        |
| `scale_factor`     | `10.0`  | 启用 Refiner 时的候选扩展倍数                   | 更大的值为精化阶段提供更多候选，通常有利于 Recall，但会增加延迟；仅在 `is_using_refiner=True` 时生效 |

<Callout className="text-base" type="info">
  Node.js 中 `nprobe` 和 `radius` 名称不变，其余参数使用 `isLinear`、`isUsingRefiner` 和 `scaleFactor`。
</Callout>
