import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Braces,
  FileCode,
  FileText,
  FileType,
  Gauge,
  GitMerge,
  LockKeyhole,
  MapPin,
  ScanSearch,
  SearchCode,
  SquareTerminal,
  UserRound,
} from 'lucide-react';


const translations = {
  en: {
    diagramLabel: 'Code, documents, and data flow through Zvec-Grep to people and AI agents',
    sourceKinds: ['CODE', 'MD', 'TXT', 'DATA'],
    commandMeta: 'exact · BM25 · vector · hybrid',
    resultTitle: 'Ranked evidence',
    resultMeta: 'paths · symbols · lines',
    advantages: ['Beyond keywords', 'Source-linked', 'Local CLI + MCP'],
    peopleTitle: 'People',
    agentsTitle: 'AI agents',
    benchmarkLabel: 'SWE-QA AGENT BENCHMARK',
    benchmark: [['+1.5 pp', 'quality'], ['−47%', 'tokens'], ['−59%', 'tool calls'], ['−38%', 'agent time']],
    scenariosLabel: 'COMMON WORKFLOWS',
    scenarios: [
      ['Workspace discovery', 'Find concepts and connections when filenames, symbols, or wording are unknown.'],
      ['Developer search', 'Search source code, documentation, and text data from one local CLI.'],
      ['Agent grounding', 'Give AI agents compact, source-linked evidence through local MCP.'],
    ],
  },
  zh: {
    diagramLabel: '代码、文档与数据通过 Zvec-Grep 流向开发者与 AI Agent',
    sourceKinds: ['代码', 'MD', '文本', '数据'],
    commandMeta: '精确 · BM25 · 向量 · 混合',
    resultTitle: '排序证据',
    resultMeta: '路径 · 符号 · 行号',
    advantages: ['不止关键词', '来源可追溯', '本地 CLI + MCP'],
    peopleTitle: '开发者',
    agentsTitle: 'AI Agent',
    benchmarkLabel: 'SWE-QA AGENT BENCHMARK',
    benchmark: [['+1.5 pp', '回答质量'], ['−47%', '输入 Token'], ['−59%', '工具调用'], ['−38%', 'Agent 耗时']],
    scenariosLabel: '典型工作流',
    scenarios: [
      ['工作区发现', '不知道文件名、符号或准确措辞时，发现相关概念与跨文件联系。'],
      ['开发者检索', '通过一个本地 CLI 检索源代码、文档和文本数据。'],
      ['Agent 上下文', '通过本地 MCP 为 AI Agent 提供紧凑、可追溯的证据。'],
    ],
  },
} as const;


const sourceIcons = [FileCode, FileText, FileType, Braces];
const advantageIcons = [GitMerge, MapPin, LockKeyhole];
const scenarioIcons = [SearchCode, SquareTerminal, Bot];


type ZvecGrepWorkflowProps = {
  lang: string;
  variant?: 'home' | 'docs';
  showBenchmark?: boolean;
};


export default function ZvecGrepWorkflow({
  lang,
  variant = 'home',
  showBenchmark = variant === 'home',
}: ZvecGrepWorkflowProps) {
  const locale = lang === 'zh' ? 'zh' : 'en';
  const t = translations[locale];

  return (
    <div className={`zvec-grep-workflow${variant === 'docs' ? ' zvec-grep-workflow-docs not-prose' : ''}`}>
      <div className={`zvec-grep-diagram${variant === 'docs' ? ' zvec-grep-diagram-docs' : ''}`} aria-label={t.diagramLabel}>
        <div className="zvec-grep-diagram-main">
          <div className="zvec-grep-diagram-sources">
            {t.sourceKinds.map((kind, index) => {
              const Icon = sourceIcons[index];
              return <span key={kind}><Icon aria-hidden="true" /><small>{kind}</small></span>;
            })}
          </div>

          <svg className="zvec-grep-diagram-source-lines" viewBox="0 0 72 200" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 28 C28 28 38 88 72 100" />
            <path d="M0 76 C30 76 40 96 72 100" />
            <path d="M0 124 C30 124 40 104 72 100" />
            <path d="M0 172 C28 172 38 112 72 100" />
          </svg>

          <Link className="zvec-grep-diagram-command" href={`/${locale}/docs/zvec-grep/`}>
            <div>
              <span className="zvec-grep-diagram-command-icon"><SquareTerminal aria-hidden="true" /></span>
              <strong><b aria-hidden="true">›</b>zg</strong>
              <i aria-hidden="true" />
              <span className="zvec-grep-diagram-command-action"><SearchCode aria-hidden="true" /></span>
            </div>
            <span className="zvec-grep-diagram-command-modes">
              {t.commandMeta.split(' · ').map((mode) => <small key={mode}>{mode}</small>)}
            </span>
          </Link>

          <ArrowRight className="zvec-grep-diagram-main-arrow" aria-hidden="true" />

          <div className="zvec-grep-diagram-result">
            <div><ScanSearch aria-hidden="true" /><span><i /><i /><i /></span></div>
            <strong>{t.resultTitle}</strong>
            <small>{t.resultMeta}</small>
          </div>

          <svg className="zvec-grep-diagram-branch-lines" viewBox="0 0 72 200" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 100 C34 100 34 48 72 48" />
            <path d="M0 100 C34 100 34 152 72 152" />
          </svg>

          <div className="zvec-grep-diagram-consumers">
            <span><UserRound aria-hidden="true" /><small>{t.peopleTitle}</small></span>
            <span><Bot aria-hidden="true" /><small>{t.agentsTitle}</small></span>
          </div>
        </div>

        <div className="zvec-grep-diagram-legend">
          {t.advantages.map((advantage, index) => {
            const Icon = advantageIcons[index];
            return <span key={advantage}><Icon aria-hidden="true" />{advantage}</span>;
          })}
        </div>

        {showBenchmark && (
          <Link className="zvec-grep-diagram-benchmark" href={`/${locale}/docs/zvec-grep/benchmarks/`}>
            <span><Gauge aria-hidden="true" /><small>{t.benchmarkLabel}</small><ArrowUpRight aria-hidden="true" /></span>
            <div>
              {t.benchmark.map(([value, label]) => <span key={label}><strong>{value}</strong><small>{label}</small></span>)}
            </div>
          </Link>
        )}
      </div>

      {variant === 'docs' && (
        <section className="zvec-grep-workflow-scenarios" aria-labelledby={`zvec-grep-scenarios-${locale}`}>
          <small id={`zvec-grep-scenarios-${locale}`}>{t.scenariosLabel}</small>
          <div>
            {t.scenarios.map(([title, description], index) => {
              const Icon = scenarioIcons[index];
              return (
                <article key={title}>
                  <Icon aria-hidden="true" />
                  <div><strong>{title}</strong><p>{description}</p></div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
