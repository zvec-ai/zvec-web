import Link from 'next/link';
import ZvecGrepWorkflow from '@/components/ZvecGrepWorkflow';
import type { IconType } from 'react-icons';
import { FaWindows } from 'react-icons/fa6';
import {
  SiAndroid,
  SiApple,
  SiCplusplus,
  SiDart,
  SiGo,
  SiIos,
  SiLinux,
  SiNodedotjs,
  SiPython,
  SiRust,
} from 'react-icons/si';
import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Bot,
  Braces,
  Database,
  Gauge,
  Layers3,
  MonitorCog,
  SearchCode,
  ServerCog,
} from 'lucide-react';


const translations = {
  en: {
    title: 'Products across retrieval workflows',
    description: 'Zvec embeds retrieval in applications; Zvec-Grep brings local workspace search to people and AI agents.',
    capabilitiesLabel: 'ZVEC CAPABILITIES',
    retrievalTitle: 'Retrieval',
    retrieval: ['Dense vectors', 'Sparse vectors', 'Full-text · BM25', 'Hybrid retrieval', 'Grouped search', 'Scalar filters'],
    indexesTitle: 'Vector indexes',
    indexesLabel: 'INDEX TYPES',
    indexes: ['Flat', 'HNSW', 'IVF', 'DiskANN'],
    quantizationTitle: 'Quantization',
    quantization: ['FP16', 'INT8', 'INT4', 'RaBitQ', 'PQ'],
    performanceTitle: 'Performance',
    performanceNote: 'Cohere 10M · VectorDBBench',
    performanceConditions: '16 vCPU · 64 GiB · INT8 · up to 20 concurrent queries',
    performance: [['10M', 'vectors'], ['8,500+', 'QPS'], ['~1 h', 'build']],
    ecosystemTitle: 'Ecosystem & tools',
    runtimesLabel: 'RUNTIMES',
    sdksLabel: 'SDKs',
    toolsLabel: 'TOOLS & AGENTS',
    toolsTitle: 'Tools & agents',
    studioShort: 'Visual workbench',
    mcpShort: 'Agent-ready Zvec tools',
    skillsShort: 'Reusable retrieval guidance',
    coreLabel: 'EMBEDDED ENGINE',
    coreDescription: 'Dense, sparse, full-text, and hybrid retrieval embedded directly in your application.',
    coreTraits: ['Private', 'Open source'],
    sdkLayerTitle: 'SDK & APIs',
    searchLayerTitle: 'Search & indexes',
    platformLayerTitle: 'Runtime & platform',
    infrastructureLabel: 'INFRASTRUCTURE',
    infrastructure: ['SIMD', 'MMAP', 'Buffer pool', 'Thread pool'],
    exploreZvec: 'Explore Zvec',
    exploreGrep: 'Explore Zvec-Grep',
    poweredBy: 'Powered by Zvec',
    grep: {
      label: 'CLI & MCP',
      title: 'Zvec-Grep',
      description: 'Local search beyond exact keywords—for people and AI agents.',
    },
    studio: {
      label: 'DESKTOP WORKBENCH',
      title: 'Zvec Studio',
      description: 'Explore collections, inspect schemas and documents, and test queries visually.',
      tags: ['Browse', 'Inspect', 'Query'],
    },
    agents: {
      label: 'AGENT INTEGRATIONS',
      title: 'MCP & Agent Skills',
      description: 'Expose local retrieval to agent runtimes and reusable context workflows.',
      mcp: 'MCP Server',
      skills: 'Agent Skills',
    },
  },
  zh: {
    title: '覆盖不同检索工作流的产品',
    description: 'Zvec 将检索嵌入应用，Zvec-Grep 为开发者与 AI Agent 提供本地工作区搜索。',
    capabilitiesLabel: 'ZVEC 核心能力',
    retrievalTitle: '检索能力',
    retrieval: ['稠密向量', '稀疏向量', '全文检索 · BM25', '混合检索', '分组搜索', '标量过滤'],
    indexesTitle: '向量索引',
    indexesLabel: '索引类型',
    indexes: ['Flat', 'HNSW', 'IVF', 'DiskANN'],
    quantizationTitle: '向量量化',
    quantization: ['FP16', 'INT8', 'INT4', 'RaBitQ', 'PQ'],
    performanceTitle: '性能表现',
    performanceNote: 'Cohere 1000 万 · VectorDBBench',
    performanceConditions: '16 vCPU · 64 GiB · INT8 · 最高 20 并发',
    performance: [['1000 万', '向量'], ['8,500+', 'QPS'], ['约 1 小时', '构建']],
    ecosystemTitle: '生态与工具',
    runtimesLabel: '运行平台',
    sdksLabel: 'SDK',
    toolsLabel: '工具与 AGENT',
    toolsTitle: '工具与 Agent',
    studioShort: '可视化工作台',
    mcpShort: '面向 Agent 的 Zvec 工具',
    skillsShort: '可复用的检索指导',
    coreLabel: '嵌入式引擎',
    coreDescription: '将稠密、稀疏、全文与混合检索直接嵌入应用进程。',
    coreTraits: ['私有', '开源'],
    sdkLayerTitle: 'SDK 与 API',
    searchLayerTitle: '检索与索引',
    platformLayerTitle: '运行时与平台',
    infrastructureLabel: '基础设施',
    infrastructure: ['SIMD', 'MMAP', 'Buffer Pool', '线程池'],
    exploreZvec: '了解 Zvec',
    exploreGrep: '了解 Zvec-Grep',
    poweredBy: '基于 Zvec',
    grep: {
      label: 'CLI & MCP',
      title: 'Zvec-Grep',
      description: '不止于关键词的本地检索，开发者与 AI Agent 均可使用。',
    },
    studio: {
      label: '桌面工作台',
      title: 'Zvec Studio',
      description: '可视化浏览集合、检查 Schema 与文档，并快速调试查询。',
      tags: ['浏览', '检查', '查询'],
    },
    agents: {
      label: 'AGENT 集成',
      title: 'MCP 与 Agent Skills',
      description: '将本地检索接入 Agent 运行时与可复用的上下文工作流。',
      mcp: 'MCP Server',
      skills: 'Agent Skills',
    },
  },
};


const sdkLinks: Array<[string, IconType, string]> = [
  ['Python', SiPython, 'https://pypi.org/project/zvec/'],
  ['Node.js', SiNodedotjs, 'https://github.com/zvec-ai/zvec-node'],
  ['Go', SiGo, 'https://github.com/zvec-ai/zvec-go'],
  ['Rust', SiRust, 'https://github.com/zvec-ai/zvec-rust'],
  ['Dart', SiDart, 'https://github.com/zvec-ai/zvec-dart'],
  ['C / C++', SiCplusplus, 'https://github.com/alibaba/zvec'],
];
const platforms: Array<[string, IconType]> = [
  ['Linux', SiLinux],
  ['macOS', SiApple],
  ['Windows', FaWindows],
  ['Android', SiAndroid],
  ['iOS', SiIos],
];
function Tags({ items }: { items: string[]; }) {
  return <div className="zvec-surround-tag-list">{items.map((item) => <span key={item}>{item}</span>)}</div>;
}


export default function ProductMatrix({ lang }: { lang: string; }) {
  const t = translations[lang as keyof typeof translations] || translations.en;

  return (
    <section className="zvec-section" id="products">
      <div className="zvec-container">
        <div className="zvec-section-heading" style={{ width: '100%', maxWidth: 'none', marginInline: 'auto', textAlign: 'center' }}>
          <h2>{t.title}</h2>
          <p>{t.description}</p>
        </div>

        <div className="zvec-product-story-list">
          <section className="zvec-product-story zvec-product-story-engine" aria-labelledby="zvec-product-title">
            <div className="zvec-product-story-intro">
              <div className="zvec-product-story-kicker">
                <span className="zvec-icon-box"><Database aria-hidden="true" /></span>
                <small>{t.coreLabel}</small>
              </div>
              <h3 id="zvec-product-title">Zvec</h3>
              <p>{t.coreDescription}</p>
              <Tags items={t.coreTraits} />
              <Link className="zvec-product-story-link" href={`/${lang}/docs/db/`}>
                {t.exploreZvec}<ArrowRight aria-hidden="true" />
              </Link>
            </div>

            <div className="zvec-product-story-body" aria-label={t.capabilitiesLabel}>
              <div className="zvec-architecture-layout">
              <div className="zvec-architecture-stack">
                <article className="zvec-architecture-layer zvec-architecture-layer-sdk">
                  <div className="zvec-architecture-layer-head">
                    <Braces aria-hidden="true" />
                    <h3>{t.sdkLayerTitle}</h3>
                  </div>
                  <div className="zvec-architecture-sdk-list">
                    {sdkLinks.map(([name, SdkIcon, href]) => (
                      <a href={href} target="_blank" rel="noreferrer" key={name}>
                        <span><SdkIcon aria-hidden="true" /></span>
                        {name}
                      </a>
                    ))}
                  </div>
                </article>

                <article className="zvec-architecture-layer zvec-architecture-layer-search">
                  <div className="zvec-architecture-layer-head">
                    <SearchCode aria-hidden="true" />
                    <h3>{t.searchLayerTitle}</h3>
                  </div>
                  <div className="zvec-architecture-search-grid">
                    <div>
                      <small>{t.retrievalTitle}</small>
                      <Tags items={t.retrieval} />
                    </div>
                    <div>
                      <small>{t.indexesLabel}</small>
                      <Tags items={t.indexes} />
                    </div>
                    <div>
                      <small>{t.quantizationTitle}</small>
                      <Tags items={t.quantization} />
                    </div>
                  </div>
                </article>

                <article className="zvec-architecture-layer zvec-architecture-layer-platform">
                  <div className="zvec-architecture-layer-head">
                    <MonitorCog aria-hidden="true" />
                    <h3>{t.platformLayerTitle}</h3>
                  </div>
                  <div className="zvec-architecture-platform-grid">
                    <div>
                      <small>{t.infrastructureLabel}</small>
                      <Tags items={t.infrastructure} />
                    </div>
                    <div>
                      <small>{t.runtimesLabel}</small>
                      <div className="zvec-architecture-runtime-list">
                        {platforms.map(([platform, PlatformIcon]) => <span key={platform}><PlatformIcon aria-hidden="true" />{platform}</span>)}
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              <aside className="zvec-architecture-side">
                <Link className="zvec-architecture-performance" href={`/${lang}/docs/db/benchmarks/`}>
                  <div className="zvec-architecture-layer-head">
                    <Gauge aria-hidden="true" />
                    <h3>{t.performanceTitle}</h3>
                    <ArrowUpRight className="zvec-architecture-card-arrow" aria-hidden="true" />
                  </div>
                  <p className="zvec-surround-performance-note">{t.performanceNote}</p>
                  <p className="zvec-surround-performance-conditions">{t.performanceConditions}</p>
                  <div className="zvec-surround-stat-list">
                    {t.performance.map(([value, label]) => <span key={label}><strong>{value}</strong><small>{label}</small></span>)}
                  </div>
                </Link>

                <section className="zvec-architecture-tools">
                  <div className="zvec-architecture-layer-head"><Layers3 aria-hidden="true" /><h3>{t.toolsTitle}</h3></div>
                  <div className="zvec-architecture-tool-list">
                    <a href="https://github.com/zvec-ai/zvec-studio" target="_blank" rel="noreferrer">
                      <span><MonitorCog aria-hidden="true" /></span>
                      <div><strong>{t.studio.title}</strong><small>{t.studioShort}</small></div>
                      <ArrowUpRight aria-hidden="true" />
                    </a>
                    <a href="https://github.com/zvec-ai/zvec-mcp-server" target="_blank" rel="noreferrer">
                      <span><ServerCog aria-hidden="true" /></span>
                      <div><strong>{t.agents.mcp}</strong><small>{t.mcpShort}</small></div>
                      <ArrowUpRight aria-hidden="true" />
                    </a>
                    <a href="https://github.com/zvec-ai/zvec-agent-skills" target="_blank" rel="noreferrer">
                      <span><Bot aria-hidden="true" /></span>
                      <div><strong>{t.agents.skills}</strong><small>{t.skillsShort}</small></div>
                      <ArrowUpRight aria-hidden="true" />
                    </a>
                  </div>
                </section>
              </aside>
              </div>
            </div>
          </section>

          <section className="zvec-product-story zvec-product-story-grep" aria-labelledby="zvec-grep-product-title">
            <div className="zvec-product-story-intro">
              <div className="zvec-product-story-kicker">
                <span className="zvec-icon-box"><SearchCode aria-hidden="true" /></span>
                <small>{t.grep.label}</small>
              </div>
              <h3 id="zvec-grep-product-title">{t.grep.title}</h3>
              <p>{t.grep.description}</p>
              <div className="zvec-product-story-powered">{t.poweredBy}</div>
              <Link className="zvec-product-story-link" href={`/${lang}/docs/zvec-grep/`}>
                {t.exploreGrep}<ArrowRight aria-hidden="true" />
              </Link>
            </div>

            <div className="zvec-product-story-body">
              <ZvecGrepWorkflow lang={lang} />
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
