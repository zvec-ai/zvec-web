import Link from 'next/link';
import { ArrowRight } from 'lucide-react';


const translations = {
  en: {
    eyebrow: 'PERFORMANCE',
    title: 'Built for real workloads.',
    description: 'Cohere 10M benchmark results.',
    link: 'Benchmark details',
    metrics: [
      ['10M', 'vectors indexed'],
      ['~1 hour', 'index build time'],
      ['8,500+', 'queries per second'],
    ],
  },
  zh: {
    eyebrow: '性能',
    title: '面向真实负载。',
    description: 'Cohere 1000 万向量评测结果。',
    link: '评测详情',
    metrics: [
      ['1000 万', '索引向量数'],
      ['约 1 小时', '索引构建时间'],
      ['8,500+', '每秒查询数'],
    ],
  },
};


export default function PerformanceDemo({ lang }: { lang: string; }) {
  const t = translations[lang as keyof typeof translations] || translations.en;

  return (
    <section className="zvec-section zvec-performance-section">
      <div className="zvec-container zvec-performance-grid">
        <div className="zvec-section-heading">
          <span className="zvec-eyebrow">{t.eyebrow}</span>
          <h2>{t.title}</h2>
          <p>{t.description}</p>
          <Link className="zvec-text-link" href={`/${lang}/docs/db/benchmarks/`}>{t.link}<ArrowRight aria-hidden="true" /></Link>
        </div>
        <div className="zvec-metric-grid">
          {t.metrics.map(([value, label], index) => (
            <div key={label}>
              <span>0{index + 1}</span>
              <strong>{value}</strong>
              <small>{label}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
