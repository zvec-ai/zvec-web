import Link from 'next/link';
import {
  HardDrive,
  Gauge,
  Layers3,
  MonitorSmartphone,
} from 'lucide-react';


const translations = {
  en: {
    eyebrow: 'WHY LOCAL-FIRST',
    title: 'Retrieval where your data lives.',
    description: 'Private, fast, and available without another service.',
    features: [
      ['Local by default', 'Keep data on-device, even offline.'],
      ['Hybrid by design', 'Search meaning, keywords, and metadata together.'],
      ['Runs anywhere', 'Desktop, server, edge, and mobile.'],
      ['Built for scale', '10M vectors · 8,500+ QPS.'],
    ],
  },
  zh: {
    eyebrow: '为什么本地优先',
    title: '让检索运行在数据所在之处。',
    description: '更私密、更直接，也无需额外服务。',
    features: [
      ['数据默认留在本地', '离线环境也能使用。'],
      ['原生混合检索', '统一检索语义、关键词和元数据。'],
      ['覆盖多种运行环境', '桌面、服务端、边缘与移动端。'],
      ['面向规模化负载', '1000 万向量 · 8,500+ QPS。'],
    ],
  },
};


const icons = [HardDrive, Layers3, MonitorSmartphone, Gauge];
const links = [
  '/docs/db/',
  '/docs/db/data-operations/query/',
  '/docs/db/build/',
  '/docs/db/benchmarks/',
];


export default function FeatureCards({ lang }: { lang: string; }) {
  const t = translations[lang as keyof typeof translations] || translations.en;

  return (
    <section className="zvec-section zvec-section-muted">
      <div className="zvec-container">
        <div className="zvec-section-heading">
          <span className="zvec-eyebrow">{t.eyebrow}</span>
          <h2>{t.title}</h2>
          <p>{t.description}</p>
        </div>
        <div className="zvec-feature-grid">
          {t.features.map(([title, description], index) => {
            const Icon = icons[index];
            return (
              <Link className="zvec-feature-card" href={`/${lang}${links[index]}`} key={title}>
                <div className="zvec-icon-box"><Icon aria-hidden="true" /></div>
                <h3>{title}</h3>
                <p>{description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
