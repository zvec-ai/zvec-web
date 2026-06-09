import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';
import { GithubInfo } from 'fumadocs-ui/components/github-info';


export async function generateMetadata({
  params,
}: LayoutProps<'/[lang]/docs'>): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang === 'zh' ? 'zh_CN' : 'en_US';

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      template: '%s | Zvec',
      default: 'Documentation | Zvec',
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
      sidebar={{ prefetch: false }}
      tree={source.pageTree[lang]}
      links={[
        {
          type: 'custom',
          children: <GithubInfo owner="alibaba" repo="zvec" />,
        },
      ]}
    >
      {children}
    </DocsLayout >
  );
}
