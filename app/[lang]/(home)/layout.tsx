import { HomeLayout } from 'fumadocs-ui/layouts/home';
import type { Metadata } from 'next';
import { baseOptions } from '@/lib/layout.shared';
import {
  NavbarMenu,
  NavbarMenuContent,
  NavbarMenuLink,
  NavbarMenuTrigger,
} from 'fumadocs-ui/layouts/home/navbar';
import Link from 'fumadocs-core/link';
import { DatabaseIcon, ExternalLinkIcon, LightbulbIcon, PackageIcon, RocketIcon } from 'lucide-react';


function IconText({ icon, children }: { icon: React.ReactNode; children: string }) {
  return (
    <span className="flex items-center gap-1">
      <span><p className="text-base">{children}</p></span>
      {icon}
    </span>
  );
}


export const metadata: Metadata = {
  title: {
    template: '%s | Zvec',
    default: 'Zvec | A lightweight, lightning-fast, in-process vector database',
  },
};


const translations = {
  "en": {
    doc: 'Docs',
    benchmark: 'Benchmarks',
    blog: 'Blog',
    api: 'API Reference',
    quickstart: 'Quickstart',
    quickstartDescription: 'Get started in minutes',
    concepts: 'Concepts',
    conceptsDescription: 'Understand the key concepts',
    collections: 'Collections',
    collectionsDescription: 'Learn more about collections',
    dataOperations: 'Data Operations',
    dataOperationsDescription: 'Learn more about data operations',
  },
  "zh": {
    doc: '文档',
    benchmark: '性能指标',
    blog: '博客',
    api: 'API 参考',
    quickstart: '快速开始',
    quickstartDescription: '轻松入门，开箱即用',
    concepts: '概念',
    conceptsDescription: '了解核心概念和术语',
    collections: 'Collections',
    collectionsDescription: '了解如何管理 collections',
    dataOperations: '数据操作',
    dataOperationsDescription: '了解如何高效操作和管理数据',
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
            <NavbarMenu>
              <NavbarMenuTrigger>
                <Link href={`/${lang}/docs/`} prefetch={false}>
                  <p className="text-base">
                    {t.doc}
                  </p>
                </Link>
              </NavbarMenuTrigger>
              <NavbarMenuContent className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full max-w-[85vw] mx-auto">
                <NavbarMenuLink href={`/${lang}/docs/quickstart/`} prefetch={false} className="lg:col-start-1 bg-transparent">
                  <RocketIcon className="bg-blue-500 dark:bg-fd-primary text-fd-primary-foreground p-1 mb-2 rounded-md" />
                  <p className="font-medium">
                    {t.quickstart}
                  </p>
                  <p className="text-fd-muted-foreground text-sm">
                    {t.quickstartDescription}
                  </p>
                </NavbarMenuLink>
                <NavbarMenuLink href={`/${lang}/docs/concepts`} prefetch={false} className="lg:col-start-2 bg-transparent">
                  <LightbulbIcon className="bg-blue-500 dark:bg-fd-primary text-fd-primary-foreground p-1 mb-2 rounded-md" />
                  <p className="font-medium">
                    {t.concepts}
                  </p>
                  <p className="text-fd-muted-foreground text-sm">
                    {t.conceptsDescription}
                  </p>
                </NavbarMenuLink>
                <NavbarMenuLink href={`/${lang}/docs/collections`} prefetch={false} className="lg:col-start-3 bg-transparent">
                  <PackageIcon className="bg-blue-500 dark:bg-fd-primary text-fd-primary-foreground p-1 mb-2 rounded-md" />
                  <p className="font-medium">
                    {t.collections}
                  </p>
                  <p className="text-fd-muted-foreground text-sm">
                    {t.collectionsDescription}
                  </p>
                </NavbarMenuLink>
                <NavbarMenuLink href={`/${lang}/docs/data-operations`} prefetch={false} className="lg:col-start-4 bg-transparent">
                  <DatabaseIcon className="bg-blue-500 dark:bg-fd-primary text-fd-primary-foreground p-1 mb-2 rounded-md" />
                  <p className="font-medium">
                    {t.dataOperations}
                  </p>
                  <p className="text-fd-muted-foreground text-sm">
                    {t.dataOperationsDescription}
                  </p>
                </NavbarMenuLink>
              </NavbarMenuContent>
            </NavbarMenu>
          )
        },
        {
          text: <p className="text-base">{t.benchmark}</p>,
          url: `/${lang}/docs/benchmarks`,
          secondary: false,
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
