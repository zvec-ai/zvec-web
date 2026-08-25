import { i18n } from '@/lib/i18n';
import { SITE_URL } from '@/lib/constants';
import type { Metadata } from 'next';
import { FaPython, FaNodeJs } from "react-icons/fa";
import { ArrowUpRight } from 'lucide-react';


const metaTranslations = {
  en: {
    title: 'API Reference',
    description: 'Official API reference for the Zvec vector database.',
  },
  zh: {
    title: 'API 参考',
    description: 'Zvec 向量数据库的官方 API 参考。',
  },
};


export async function generateMetadata({
  params,
}: { params: Promise<{ lang: string; }>; }): Promise<Metadata> {
  const { lang } = await params;
  const m = metaTranslations[lang as keyof typeof metaTranslations] || metaTranslations.en;
  const locale = lang === 'zh' ? 'zh_CN' : 'en_US';
  const url = `${SITE_URL}/${lang}/api-reference/`;

  return {
    title: m.title,
    description: m.description,
    openGraph: {
      type: 'website',
      siteName: 'Zvec',
      locale,
      url,
      title: m.title,
      description: m.description,
      images: '/img/header.png',
    },
    twitter: {
      card: 'summary_large_image',
      title: m.title,
      description: m.description,
      images: '/img/header.png',
    },
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/en/api-reference/`,
        zh: `${SITE_URL}/zh/api-reference/`,
        'x-default': `${SITE_URL}/en/api-reference/`,
      },
    },
  };
}


export async function generateStaticParams() {
  return i18n.languages.map((language) => ({ lang: language }));
}


export default async function Home({ params }: { params: Promise<{ lang: string; }>; }) {
  const { lang } = await params;

  const translations = {
    en: {
      title: 'Zvec API Reference',
      eyebrow: 'SDK DOCUMENTATION',
      description: 'Typed API documentation for Zvec language SDKs.',
      python: 'Python API Reference',
      pythonDescription: 'Classes, schemas, indexes, and query APIs for Python.',
      nodejs: 'Node.js API Reference',
      nodejsDescription: 'TypeScript-first APIs for Node.js applications.',
    },
    zh: {
      title: 'Zvec API 参考',
      eyebrow: 'SDK 文档',
      description: 'Zvec 多语言 SDK 的类型化接口文档。',
      python: 'Python API 参考',
      pythonDescription: 'Python 的类、Schema、索引与查询接口。',
      nodejs: 'Node.js API 参考',
      nodejsDescription: '面向 Node.js 应用的 TypeScript 优先接口。',
    },
  };
  const t = translations[lang as keyof typeof translations] || translations.en;

  return (
    <main className="zvec-container zvec-api-page">
      <div className="zvec-section-heading">
        <span className="zvec-eyebrow">{t.eyebrow}</span>
        <h1>{t.title}</h1>
        <p>{t.description}</p>
      </div>

      <div className="zvec-api-grid">

        <a
          href="/api-reference/python/"
          className="zvec-api-card"
        >
          <FaPython />
          <div>
            <h2>{t.python}</h2>
            <p>{t.pythonDescription}</p>
          </div>
          <ArrowUpRight />
        </a>

        <a
          href="/api-reference/nodejs/"
          className="zvec-api-card"
        >
          <FaNodeJs />
          <div>
            <h2>{t.nodejs}</h2>
            <p>{t.nodejsDescription}</p>
          </div>
          <ArrowUpRight />
        </a>

      </div>
    </main>
  );
}
