import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';
import { GithubInfo } from 'fumadocs-ui/components/github-info';
import DocsProductSwitcher from '@/components/DocsProductSwitcher';


export async function generateMetadata({
  params,
}: LayoutProps<'/[lang]/docs'>): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang === 'zh' ? 'zh_CN' : 'en_US';

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      template: 'Zvec | %s',
      default: 'Zvec | Documentation',
    },
    openGraph: {
      type: 'website',
      siteName: 'Zvec',
      locale,
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}


export default async function Layout({
  params,
  children,
}: LayoutProps<'/[lang]/docs'>) {
  const { lang } = await params;

  return (
    <DocsLayout
      {...baseOptions(lang)}
      githubUrl={undefined}
      sidebar={{
        prefetch: false,
        banner: <DocsProductSwitcher key="product-switcher" lang={lang} />,
        footer: <GithubInfo key="github-info" className="zvec-docs-repo-info" owner="alibaba" repo="zvec" />,
      }}
      tabs={false}
      tree={source.pageTree[lang]}
    >
      {children}
    </DocsLayout >
  );
}
