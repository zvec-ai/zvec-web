import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';
import { GithubInfo } from 'fumadocs-ui/components/github-info';
import DocsProductSwitcher from '@/components/DocsProductSwitcher';
import DocsRepoInfo from '@/components/DocsRepoInfo';
import DocsScrollReset from '@/components/DocsScrollReset';


function RepositoryInfo({ owner, repo }: { owner: string; repo: string }) {
  if (process.env.NODE_ENV === 'development') {
    return (
      <a
        className="zvec-docs-repo-info"
        href={`https://github.com/${owner}/${repo}`}
        target="_blank"
        rel="noreferrer noopener"
      >
        {owner}/{repo}
      </a>
    );
  }

  return <GithubInfo className="zvec-docs-repo-info" owner={owner} repo={repo} />;
}


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
        footer: (
          <DocsRepoInfo
            key="github-info"
            lang={lang}
            zvec={<RepositoryInfo owner="alibaba" repo="zvec" />}
            grep={<RepositoryInfo owner="zvec-ai" repo="zvec-grep" />}
          />
        ),
      }}
      tabs={false}
      tree={source.pageTree[lang]}
    >
      <DocsScrollReset lang={lang} />
      {children}
    </DocsLayout >
  );
}
