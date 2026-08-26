import { HomeLayout } from 'fumadocs-ui/layouts/home';
import type { Metadata } from 'next';
import { baseOptions } from '@/lib/layout.shared';
import {
  NavbarMenuLink,
} from 'fumadocs-ui/layouts/home/navbar';
import { DatabaseIcon, ExternalLinkIcon, LayoutGridIcon, SearchCodeIcon } from 'lucide-react';
import { SITE_URL } from '@/lib/constants';
import { AlignedNavbarMenu } from '@/components/AlignedNavbarMenu';


function IconText({ icon, children }: { icon: React.ReactNode; children: string; }) {
  return (
    <span className="flex items-center gap-1">
      <span><p className="text-base">{children}</p></span>
      {icon}
    </span>
  );
}


const siteTitle = 'Zvec | Local-first retrieval infrastructure';
const siteDescription = 'Build semantic, full-text, and hybrid retrieval into applications, devices, tools, and AI agents with the open-source Zvec product stack.';


export async function generateMetadata({
  params,
}: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang === 'zh' ? 'zh_CN' : 'en_US';

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      template: 'Zvec | %s',
      default: siteTitle,
    },
    description: siteDescription,
    openGraph: {
      type: 'website',
      siteName: 'Zvec',
      locale,
      url: `${SITE_URL}/${lang}/`,
      title: siteTitle,
      description: siteDescription,
      images: '/img/header.png',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDescription,
      images: '/img/header.png',
    },
    alternates: {
      languages: {
        en: `${SITE_URL}/en/`,
        zh: `${SITE_URL}/zh/`,
        'x-default': `${SITE_URL}/en/`,
      },
    },
  };
}


const translations = {
  "en": {
    doc: 'Docs',
    benchmark: 'Benchmarks',
    blog: 'Blog',
    api: 'API Reference',
    overview: 'Overview',
    overviewDescription: 'Choose the right product and starting point',
    zvec: 'Zvec',
    zvecDescription: 'Embed retrieval directly in your application',
    zvecBenchmarkDescription: 'Indexing speed, QPS, recall, and scale',
    grep: 'Zvec-Grep',
    grepDescription: 'Search workspaces via CLI or agents',
    grepBenchmarkDescription: 'Retrieval quality and agent efficiency',
  },
  "zh": {
    doc: '文档',
    benchmark: '性能指标',
    blog: '博客',
    api: 'API 参考',
    overview: '总览',
    overviewDescription: '选择合适的产品与阅读起点',
    zvec: 'Zvec',
    zvecDescription: '将检索能力直接嵌入应用',
    zvecBenchmarkDescription: '索引速度、QPS、召回率与规模',
    grep: 'Zvec-Grep',
    grepDescription: '通过 CLI 或 Agent 搜索工作区',
    grepBenchmarkDescription: '检索质量与 Agent 效率',
  },
};


export default async function Layout({
  params,
  children,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  const t = translations[lang as keyof typeof translations] || translations.en;

  return (
    <HomeLayout
      {...baseOptions(lang)}
      links={[
        {
          type: 'custom',
          on: 'nav',
          children: (
            <AlignedNavbarMenu
              contentClassName="grid grid-cols-1 md:grid-cols-3"
              href={`/${lang}/docs/`}
              label={t.doc}
              maxWidth={980}
            >
                <NavbarMenuLink href={`/${lang}/docs/`} prefetch={false} className="zvec-nav-menu-card">
                  <LayoutGridIcon className="zvec-nav-menu-icon" />
                  <p className="zvec-nav-menu-title">
                    {t.overview}
                  </p>
                  <p className="zvec-nav-menu-description">
                    {t.overviewDescription}
                  </p>
                </NavbarMenuLink>
                <NavbarMenuLink href={`/${lang}/docs/db/`} prefetch={false} className="zvec-nav-menu-card">
                  <DatabaseIcon className="zvec-nav-menu-icon" />
                  <p className="zvec-nav-menu-title">
                    {t.zvec}
                  </p>
                  <p className="zvec-nav-menu-description">
                    {t.zvecDescription}
                  </p>
                </NavbarMenuLink>
                <NavbarMenuLink href={`/${lang}/docs/zvec-grep/`} prefetch={false} className="zvec-nav-menu-card">
                  <SearchCodeIcon className="zvec-nav-menu-icon" />
                  <p className="zvec-nav-menu-title">
                    {t.grep}
                  </p>
                  <p className="zvec-nav-menu-description zvec-nav-menu-description-nowrap">
                    {t.grepDescription}
                  </p>
                </NavbarMenuLink>
            </AlignedNavbarMenu>
          )
        },
        {
          type: 'custom',
          on: 'nav',
          children: (
            <AlignedNavbarMenu
              contentClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
              label={t.benchmark}
              maxWidth={658}
            >
                <NavbarMenuLink href={`/${lang}/docs/db/benchmarks/`} prefetch={false} className="zvec-nav-menu-card">
                  <DatabaseIcon className="zvec-nav-menu-icon" />
                  <p className="zvec-nav-menu-title">{t.zvec}</p>
                  <p className="zvec-nav-menu-description">{t.zvecBenchmarkDescription}</p>
                </NavbarMenuLink>
                <NavbarMenuLink href={`/${lang}/docs/zvec-grep/benchmarks/`} prefetch={false} className="zvec-nav-menu-card">
                  <SearchCodeIcon className="zvec-nav-menu-icon" />
                  <p className="zvec-nav-menu-title">{t.grep}</p>
                  <p className="zvec-nav-menu-description">{t.grepBenchmarkDescription}</p>
                </NavbarMenuLink>
            </AlignedNavbarMenu>
          ),
        },
        {
          text: <p className="text-base">{t.blog}</p>,
          url: `/${lang}/blog/`,
          secondary: false,
        },
        {
          text: <IconText icon={<ExternalLinkIcon />}>{t.api}</IconText>,
          url: `/${lang}/api-reference/`,
          secondary: false,
        },
      ]}
    >
      {children}
    </HomeLayout >
  );
}
