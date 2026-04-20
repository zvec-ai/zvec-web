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
  const markdownUrl = `/mdx${page.url}.mdx`;
  const hasReference =
    page.data.pythonApiReference || page.data.nodejsApiReference;

  return (
    <DocsPage
      tableOfContent={{
        style: 'clerk',
      }}
      toc={page.data.toc}
      full={page.data.full}
    >
      <DocsTitle>{page.data.extendedTitle.trim() ? page.data.extendedTitle : page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <div className="border-t pt-6 mt-6">
        <div className="flex flex-row flex-wrap gap-3 items-center border-b pb-6">
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
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
      <div className="border-t pt-6 mt-6">
        <div className="flex flex-row flex-wrap gap-3 items-center border-b pb-6">
          <LinkButton url="https://github.com/alibaba/zvec/issues" label={t.reportIssue} />
        </div>
      </div>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
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

  return {
    title: pageTitle,
    description: page.data.description,
    openGraph: {
      type: 'article',
      siteName: 'Zvec',
      locale: params.lang === 'zh' ? 'zh_CN' : 'en_US',
      url: `${SITE_URL}/${params.lang}/docs/${slug}/`,
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
      languages: {
        en: `${SITE_URL}/en/docs/${slug}/`,
        zh: `${SITE_URL}/zh/docs/${slug}/`,
      },
    },
  };
}
