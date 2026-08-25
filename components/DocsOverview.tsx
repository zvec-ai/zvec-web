import Link from 'next/link';
import { ArrowRight, Database, SearchCode } from 'lucide-react';


const translations = {
  en: {
    comparisonLabel: 'Choose by',
    dataFlowLabel: 'Data flow',
    flowLabels: ['Index', 'Search'],
    nextStepLabel: 'Start here',
    flows: [
      [
        ['Schema', 'Docs + vectors', 'insert / upsert', 'Indexes'],
        ['Vector / text / filters', 'query()', 'Ranked documents'],
      ],
      [
        ['Workspace files', 'Extract + chunk', 'BM25 + vector'],
        ['Query', 'Exact / hybrid', 'CLI / MCP', 'Human / agent'],
      ],
    ],
    comparisons: [
      {
        label: 'Best for',
        zvec: 'Embedding retrieval in an application',
        grep: 'Searching an existing code or document workspace',
      },
      {
        label: 'Typical scenarios',
        zvec: [
          'Search inside desktop, mobile, or server applications',
          'Local or private RAG and agent memory',
          'Hybrid search across products, documents, or catalogs',
        ],
        grep: [
          'Explore an unfamiliar repository from the terminal',
          'Give coding agents relevant code and documentation',
          'Search local notes, manuals, or project knowledge',
        ],
      },
      {
        label: 'Use through',
        zvec: 'Native SDKs',
        grep: 'CLI, MCP, or AI agents',
      },
      {
        label: 'Choose it when',
        zvec: 'You need control over schemas, indexes, data, and queries',
        grep: 'You want ready-to-use local search without building a retrieval layer',
      },
    ],
    products: [
      {
        label: 'Embedded retrieval',
        title: 'Zvec',
        action: 'Explore Zvec',
        href: '/docs/db/',
      },
      {
        label: 'Workspace search',
        title: 'Zvec-Grep',
        action: 'Explore Zvec-Grep',
        href: '/docs/zvec-grep/',
      },
    ],
  },
  zh: {
    comparisonLabel: '对比维度',
    dataFlowLabel: '数据链路',
    flowLabels: ['建索引', '检索'],
    nextStepLabel: '开始使用',
    flows: [
      [
        ['Schema', '文档与向量', 'insert / upsert', '索引'],
        ['向量 / 文本 / 过滤', 'query()', '排序结果'],
      ],
      [
        ['工作区文件', '提取与分块', 'BM25 + 向量'],
        ['查询', '精确 / 混合', 'CLI / MCP', '用户 / Agent'],
      ],
    ],
    comparisons: [
      {
        label: '适用场景',
        zvec: '在应用中嵌入检索能力',
        grep: '搜索已有的代码或文档工作区',
      },
      {
        label: '典型场景',
        zvec: [
          '为桌面端、移动端或服务端应用提供搜索',
          '构建本地或私有的 RAG 与 Agent 记忆',
          '检索产品、文档或目录中的混合数据',
        ],
        grep: [
          '从终端快速理解陌生代码仓库',
          '为编程 Agent 提供相关代码与文档',
          '搜索本地笔记、手册或项目知识',
        ],
      },
      {
        label: '使用方式',
        zvec: '原生 SDK',
        grep: 'CLI、MCP 或 AI Agent',
      },
      {
        label: '选择依据',
        zvec: '需要控制 Schema、索引、数据和查询流程',
        grep: '希望直接使用本地搜索，无需自行搭建检索层',
      },
    ],
    products: [
      {
        label: '嵌入式检索引擎',
        title: 'Zvec',
        action: '了解 Zvec',
        href: '/docs/db/',
      },
      {
        label: '本地工作区搜索',
        title: 'Zvec-Grep',
        action: '了解 Zvec-Grep',
        href: '/docs/zvec-grep/',
      },
    ],
  },
};


export default function DocsOverview({ lang }: { lang: string }) {
  const currentLang = lang === 'zh' ? 'zh' : 'en';
  const t = translations[currentLang];
  const icons = [Database, SearchCode];
  const localize = (href: string) => `/${currentLang}${href}`;

  return (
    <div className="zvec-docs-overview">
      <div className="zvec-docs-choice-table-wrap">
        <table className="zvec-docs-choice-table">
          <colgroup>
            <col className="zvec-docs-choice-axis" />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th>{t.comparisonLabel}</th>
              {t.products.map((product, index) => {
                const Icon = icons[index];
                return (
                  <th scope="col" key={product.title}>
                    <Link className="zvec-docs-choice-product" href={localize(product.href)}>
                      <span className="zvec-docs-overview-icon"><Icon aria-hidden="true" /></span>
                      <span>
                        <small>{product.label}</small>
                        <strong>{product.title}</strong>
                      </span>
                    </Link>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {t.comparisons.map((comparison) => (
              <tr key={comparison.label}>
                <th scope="row">{comparison.label}</th>
                {[comparison.zvec, comparison.grep].map((value, index) => (
                  <td key={index}>
                    {Array.isArray(value) ? (
                      <ul className="zvec-docs-scenario-list">
                        {value.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    ) : value}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row">{t.dataFlowLabel}</th>
              {t.flows.map((flow, flowIndex) => (
                <td key={t.products[flowIndex].title}>
                  <div className="zvec-docs-data-flow">
                    {flow.map((steps, laneIndex) => (
                      <div className="zvec-docs-data-flow-lane" key={t.flowLabels[laneIndex]}>
                        <strong>{t.flowLabels[laneIndex]}</strong>
                        <div>
                          {steps.map((step, stepIndex) => (
                            <span className="zvec-docs-data-flow-step" key={step}>
                              <span>{step}</span>
                              {stepIndex < steps.length - 1 && <ArrowRight aria-hidden="true" />}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
            <tr className="zvec-docs-choice-actions">
              <th scope="row">{t.nextStepLabel}</th>
              {t.products.map((product) => (
                <td key={product.title}>
                  <Link className="zvec-docs-overview-action" href={localize(product.href)}>
                    {product.action}<ArrowRight aria-hidden="true" />
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
