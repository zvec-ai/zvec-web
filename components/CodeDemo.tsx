'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Copy } from 'lucide-react';


const translations = {
  en: {
    eyebrow: 'DEVELOPER EXPERIENCE',
    title: 'One API. No service.',
    description: 'Create, write, and search in-process.',
    docs: 'Read the quickstart',
    copy: 'Copy code',
    copied: 'Copied',
  },
  zh: {
    eyebrow: '开发体验',
    title: '一个 API，无需服务。',
    description: '进程内完成创建、写入与检索。',
    docs: '阅读快速开始',
    copy: '复制代码',
    copied: '已复制',
  },
};


const tabs = [
  {
    id: 'create',
    label: 'Create',
    code: `import zvec

collection = zvec.create_and_open(
    path="./zvec_data", schema=schema
)`,
  },
  {
    id: 'write',
    label: 'Write',
    code: `collection.insert([
    zvec.Doc(id="doc-1", vectors={"embedding": embedding})
])`,
  },
  {
    id: 'search',
    label: 'Search',
    code: `results = collection.query(
    queries=zvec.Query(
        field_name="embedding",
        vector=query_embedding,
    ),
    topk=10,
)`,
  },
];


export default function CodeDemo({ lang }: { lang: string; }) {
  const t = translations[lang as keyof typeof translations] || translations.en;
  const [active, setActive] = useState(tabs[2]);
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(active.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className="zvec-section zvec-code-section">
      <div className="zvec-container zvec-code-grid">
        <div className="zvec-section-heading">
          <span className="zvec-eyebrow">{t.eyebrow}</span>
          <h2>{t.title}</h2>
          <p>{t.description}</p>
          <Link className="zvec-text-link" href={`/${lang}/docs/db/quickstart/`}>{t.docs}<ArrowRight aria-hidden="true" /></Link>
        </div>
        <div className="zvec-code-window">
          <div className="zvec-code-toolbar">
            <div className="zvec-code-tabs">
              {tabs.map((tab) => (
                <button className={active.id === tab.id ? 'active' : ''} onClick={() => setActive(tab)} key={tab.id}>{tab.label}</button>
              ))}
            </div>
            <button className="zvec-copy-button" onClick={copyCode} aria-label={copied ? t.copied : t.copy}>
              {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              <span>{copied ? t.copied : t.copy}</span>
            </button>
          </div>
          <pre><code>{active.code}</code></pre>
        </div>
      </div>
    </section>
  );
}
