import { getPageImage, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { LinkButton, PythonLinkButton, NodeJSLinkButton } from '@/components/LinkButton';
import { MarkdownCopyButton } from '@/components/ai/page-actions';
import { SITE_URL } from '@/lib/constants';
import { getBreadcrumbItems } from 'fumadocs-core/breadcrumb';
import { JsonLd } from '@/components/JsonLd';
import { getGitMtime } from '@/lib/git-mtime';
import { i18n } from '@/lib/i18n';


export default async function Page(props: PageProps<'/[lang]/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  const lang = params.lang as 'en' | 'zh';
  const t = {
    en: {
      pythonApi: 'Python API Reference',
      nodejsApi: 'Node.js API Reference',
      copyPage: 'Copy Page',
      reportIssue: '🐛 Report an Issue',
    },
    zh: {
      pythonApi: 'Python API 参考',
      nodejsApi: 'Node.js API 参考',
      copyPage: '复制页面',
      reportIssue: '🐛 反馈 Bug',
    },
  }[lang] || {
    pythonApi: 'Python API Reference',
    nodejsApi: 'Node.js API Reference',
    copyPage: 'Copy Page',
    reportIssue: '🐛 Report an Issue',
  };

  const MDX = page.data.body;
  const markdownUrl = `/mdx${page.url}.md`;
  const hasReference =
    page.data.pythonApiReference || page.data.nodejsApiReference;
  const isOverview = page.data.overview;

  const breadcrumbItems = getBreadcrumbItems(page.url, source.pageTree[lang], {
    includePage: true,
    includeRoot: { url: `/${lang}/docs` },
  });

  const pageTitle = page.data.extendedTitle.trim() ? page.data.extendedTitle : page.data.title;
  const mtime = getGitMtime(page.absolutePath);
  const canonicalUrl = `${SITE_URL}${page.url}/`;
  const issueUrl = page.url.includes('/docs/zvec-grep')
    ? 'https://github.com/zvec-ai/zvec-grep/issues'
    : 'https://github.com/alibaba/zvec/issues';

  const techArticleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: pageTitle,
    description: page.data.description,
    url: canonicalUrl,
    inLanguage: lang === 'zh' ? 'zh-CN' : 'en-US',
    ...(mtime ? { dateModified: mtime.toISOString() } : {}),
    author: {
      '@type': 'Organization',
      name: 'Alibaba',
      url: 'https://www.alibabagroup.com/',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Zvec',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/img/zvec-logo-light.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: typeof item.name === 'string' ? item.name : String(item.name),
      ...(item.url ? { item: `${SITE_URL}${item.url}/` } : {}),
    })),
  };

  return (
    <>
    <JsonLd data={techArticleJsonLd} />
    <JsonLd data={breadcrumbJsonLd} />
    <DocsPage
      className={`zvec-docs-page${isOverview ? ' zvec-docs-overview-page' : ''}`}
      toc={page.data.toc}
      full={page.data.full}
      footer={{ enabled: !isOverview }}
    >
      <DocsTitle className="zvec-docs-title">{page.data.extendedTitle.trim() ? page.data.extendedTitle : page.data.title}</DocsTitle>
      <DocsDescription className="zvec-docs-description">{page.data.description}</DocsDescription>
      {!isOverview && (
        <div className="zvec-docs-actions">
          <div className="flex flex-row flex-wrap gap-3 items-center">
            {page.data.pythonApiReference && (
              <PythonLinkButton url={page.data.pythonApiReference} label={t.pythonApi} />
            )}
            {page.data.nodejsApiReference && (
              <NodeJSLinkButton url={page.data.nodejsApiReference} label={t.nodejsApi} />
            )}
            <div className={hasReference ? "ml-auto" : ""}>
              <MarkdownCopyButton markdownUrl={markdownUrl} label={t.copyPage} />
            </div>
          </div>
        </div>
      )}
      <DocsBody className={`zvec-docs-body${isOverview ? ' zvec-docs-overview-body' : ''}`}>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
      {!isOverview && (
        <div className="zvec-docs-footer">
          <div className="flex flex-row flex-wrap gap-3 items-center">
            <LinkButton url={issueUrl} label={t.reportIssue} />
          </div>
        </div>
      )}
    </DocsPage>
    </>
  );
}

export async function generateStaticParams() {
  const params = source.generateParams();

  return [
    ...i18n.languages.map((lang) => ({ lang, slug: [] })),
    ...params.filter(({ slug }) => slug.length > 0),
  ];
}

export async function generateMetadata(
  props: PageProps<'/[lang]/docs/[[...slug]]'>,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  const pageTitle = page.data.extendedTitle.trim() ? page.data.extendedTitle : page.data.title;
  const ogImageUrl = getPageImage(page).url;

  const slug = (params.slug || []).join('/');
  const docsPath = slug ? `${slug}/` : '';

  return {
    title: pageTitle,
    description: page.data.description,
    openGraph: {
      type: 'article',
      siteName: 'Zvec',
      locale: params.lang === 'zh' ? 'zh_CN' : 'en_US',
      url: `${SITE_URL}/${params.lang}/docs/${docsPath}`,
      title: pageTitle,
      description: page.data.description,
      images: ogImageUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: page.data.description,
      images: ogImageUrl,
    },
    alternates: {
      canonical: `${SITE_URL}/${params.lang}/docs/${docsPath}`,
      languages: {
        en: `${SITE_URL}/en/docs/${docsPath}`,
        zh: `${SITE_URL}/zh/docs/${docsPath}`,
        'x-default': `${SITE_URL}/en/docs/${docsPath}`,
      },
    },
  };
}
