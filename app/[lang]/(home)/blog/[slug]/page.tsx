import { notFound } from 'next/navigation';
import { source } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';
import { blog } from '@/lib/source';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { i18n } from '@/lib/i18n';
import {
  DocsBody,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import { SITE_URL } from '@/lib/constants';
import { JsonLd } from '@/components/JsonLd';


export default async function Page(props: { params: Promise<{ slug: string; lang: string; }>; }) {
  const params = await props.params;
  const page = blog.getPage([params.slug], params.lang);
  if (!page) notFound();

  const MDX = page.data.body;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.data.title,
    description: page.data.description,
    datePublished: page.data.date,
    ...(page.data.image ? { image: new URL(page.data.image, SITE_URL).toString() } : {}),
    author: { '@type': 'Organization', name: 'Alibaba' },
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <DocsPage
        tableOfContent={{
          style: 'clerk',
        }}
        toc={page.data.toc}
        full={page.data.full}
      >
        <DocsTitle className="text-4xl">{page.data.title}</DocsTitle>
        <DocsBody>
          <MDX
            components={getMDXComponents({
              // this allows you to link to other pages with relative file paths
              a: createRelativeLink(source, page),
            })}
          />
        </DocsBody>
      </DocsPage>
    </>
  );
}


export function generateStaticParams() {
  const params = [];
  for (const lang of i18n.languages) {
    const pages = blog.getPages(lang);
    for (const page of pages) {
      if (page.slugs && page.slugs.length > 0) {
        params.push({
          lang,
          slug: page.slugs[0],
        });
      }
    }
  }
  return params;
}


export async function generateMetadata(props: { params: Promise<{ slug: string; lang: string; }>; }) {
  const params = await props.params;
  const page = blog.getPage([params.slug], params.lang);
  if (!page) notFound();

  const imageUrl = page.data.image
    ? new URL(page.data.image, SITE_URL).toString()
    : undefined;

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      type: 'article',
      siteName: 'Zvec',
      locale: params.lang === 'zh' ? 'zh_CN' : 'en_US',
      url: `${SITE_URL}/${params.lang}/blog/${params.slug}/`,
      title: page.data.title,
      description: page.data.description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.data.title,
      description: page.data.description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}