'use client';

import Link from 'next/link';
import { Fragment, useState } from 'react';
import { ArrowRight, Database, SearchCode } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';


const translations = {
  en: {
    title: 'Local-first retrieval.',
    titleAccent: 'Built in.',
    description: 'Embedded retrieval for applications. Local workspace search for developers and AI agents.',
    start: 'Get started',
    github: 'GitHub',
    productSelector: 'Choose a product example',
    examples: 'EXAMPLES',
    productDescriptions: {
      zvec: 'Embedded retrieval',
      grep: 'Workspace search',
    },
  },
  zh: {
    title: '本地优先检索',
    titleAccent: '内置即用。',
    description: '面向应用的嵌入式检索，面向开发者和 AI Agent 的本地工作区搜索。',
    start: '开始使用',
    github: 'GitHub',
    productSelector: '选择产品示例',
    examples: '示例',
    productDescriptions: {
      zvec: '嵌入式检索',
      grep: '工作区搜索',
    },
  },
};


type ProductId = 'zvec' | 'grep';
type Example = {
  id: string;
  label: string;
  language: 'python' | 'shell';
  code: string;
};


const productExamples: Record<ProductId, Example[]> = {
  zvec: [
    {
      id: 'create',
      label: 'Create',
      language: 'python',
      code: `schema = zvec.CollectionSchema(
    name="docs",
    vectors=zvec.VectorSchema(
        "embedding", zvec.DataType.VECTOR_FP32, 768
    ),
)
collection = zvec.create_and_open(
    path="./zvec_data", schema=schema
)`,
    },
    {
      id: 'insert',
      label: 'Insert',
      language: 'python',
      code: `collection.insert([
    zvec.Doc(
        id="doc-1",
        vectors={"embedding": embedding},
    )
])`,
    },
    {
      id: 'query',
      label: 'Query',
      language: 'python',
      code: `results = collection.query(
    queries=zvec.Query(
        field_name="embedding",
        vector=query_embedding,
    ),
    topk=10,
)`,
    },
  ],
  grep: [
    {
      id: 'index',
      label: 'Index',
      language: 'shell',
      code: `cd /path/to/workspace
zg index --embedding local/potion-code-16m-v2
zg status`,
    },
    {
      id: 'search',
      label: 'Search',
      language: 'shell',
      code: `zg query --human \\
  "where theme preferences are restored" \\
  --limit 5`,
    },
    {
      id: 'connect',
      label: 'Connect',
      language: 'shell',
      code: `zg install --target codex --yes
zg server status --check-ready`,
    },
  ],
};


const products = {
  zvec: {
    label: 'Zvec',
    exampleLabel: 'PYTHON SDK',
    github: 'https://github.com/alibaba/zvec',
    icon: Database,
  },
  grep: {
    label: 'Zvec-Grep',
    exampleLabel: 'ZG CLI',
    github: 'https://github.com/zvec-ai/zvec-grep',
    icon: SearchCode,
  },
};


function syntaxClass(token: string, language: Example['language']) {
  if (/^['"]/.test(token)) return 'zvec-syntax-string';
  if (/^\d/.test(token)) return 'zvec-syntax-number';
  if (token === 'zvec' || token === 'zg') return 'zvec-syntax-module';
  if (language === 'shell' && /^--/.test(token)) return 'zvec-syntax-param';
  if (language === 'shell' && /^(cd|index|status|query|install|server)$/.test(token)) return 'zvec-syntax-call';
  if (language === 'shell' && /^(?:local|\/path)\//.test(token)) return 'zvec-syntax-string';
  if (/^(CollectionSchema|VectorSchema|DataType|Doc|Query)$/.test(token)) return 'zvec-syntax-type';
  if (/^(create_and_open|insert|query)$/.test(token)) return 'zvec-syntax-call';
  if (/^(name|vectors|path|schema|id|field_name|vector|queries|topk)$/.test(token)) return 'zvec-syntax-param';
  return 'zvec-syntax-punctuation';
}


function highlightCode(example: Example) {
  const pythonPattern = /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:zvec|CollectionSchema|VectorSchema|DataType|Doc|Query|create_and_open|insert|query|name|vectors|path|schema|id|field_name|vector|queries|topk)\b|\b\d+\b|[()[\]{},.=]/g;
  const shellPattern = /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|--[\w-]+|\b(?:zg|cd|index|status|query|install|server)\b|(?:local|\/path)\/[\w./-]+|\b\d+\b|[\\=]/g;
  const pattern = example.language === 'python' ? pythonPattern : shellPattern;
  const lines = example.code.split('\n');

  return lines.map((line, lineIndex) => {
    const parts = [];
    let cursor = 0;

    for (const match of line.matchAll(pattern)) {
      const index = match.index ?? 0;
      if (index > cursor) parts.push(line.slice(cursor, index));
      parts.push(<span className={syntaxClass(match[0], example.language)} key={`${lineIndex}-${index}`}>{match[0]}</span>);
      cursor = index + match[0].length;
    }

    if (cursor < line.length) parts.push(line.slice(cursor));

    return <Fragment key={lineIndex}>{parts}{lineIndex < lines.length - 1 ? '\n' : null}</Fragment>;
  });
}


export default function Hero({ lang }: { lang: string; fontFamily?: string; }) {
  const t = translations[lang as keyof typeof translations] || translations.en;
  const [activeProduct, setActiveProduct] = useState<ProductId>('zvec');
  const [activeExampleId, setActiveExampleId] = useState(productExamples.zvec[0].id);
  const activeExamples = productExamples[activeProduct];
  const activeExample = activeExamples.find((example) => example.id === activeExampleId) || activeExamples[0];
  const activeProductMeta = products[activeProduct];

  function selectProduct(product: ProductId) {
    setActiveProduct(product);
    setActiveExampleId(productExamples[product][0].id);
  }

  return (
    <section className="zvec-hero">
      <div className="zvec-container zvec-hero-grid">
        <div className="zvec-hero-copy">
          <h1>
            <span className="zvec-hero-title-line">{t.title}</span>
            <span className="zvec-hero-title-line zvec-hero-title-accent">{t.titleAccent}</span>
          </h1>
          <p className="zvec-lead">{t.description}</p>
          <div className="zvec-actions">
            <Link className="zvec-button zvec-button-primary" href={`/${lang}/docs/`}>
              {t.start}
              <ArrowRight aria-hidden="true" />
            </Link>
            <a className="zvec-button zvec-button-secondary" href={activeProductMeta.github} target="_blank" rel="noreferrer">
              <FaGithub aria-hidden="true" />
              {t.github}
            </a>
          </div>
        </div>

        <div className="zvec-search-card" aria-label={`${activeProductMeta.label} ${t.examples}`}>
          <div className="zvec-hero-product-tabs" role="tablist" aria-label={t.productSelector}>
            {(Object.keys(products) as ProductId[]).map((productId) => {
              const product = products[productId];
              const ProductIcon = product.icon;
              return (
                <button
                  type="button"
                  role="tab"
                  className={activeProduct === productId ? 'active' : ''}
                  aria-selected={activeProduct === productId}
                  onClick={() => selectProduct(productId)}
                  key={productId}
                >
                  <ProductIcon aria-hidden="true" />
                  <span>
                    <strong>{product.label}</strong>
                    <small>{t.productDescriptions[productId]}</small>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="zvec-hero-example-bar">
            <span>{activeProductMeta.exampleLabel}</span>
            <div className="zvec-hero-code-tabs" role="tablist" aria-label={`${activeProductMeta.label} ${t.examples}`}>
            {activeExamples.map((example) => (
              <button
                type="button"
                role="tab"
                className={activeExample.id === example.id ? 'active' : ''}
                aria-selected={activeExample.id === example.id}
                onClick={() => setActiveExampleId(example.id)}
                key={example.id}
              >
                {example.label}
              </button>
            ))}
            </div>
          </div>
          <pre className="zvec-hero-code"><code key={`${activeProduct}-${activeExample.id}`}>{highlightCode(activeExample)}</code></pre>
        </div>
      </div>

    </section>
  );
}
