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

export default async function Page(props: PageProps<'/[lang]/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  const MDX = page.data.body;

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
      {page.data.pythonApiReference || page.data.nodejsApiReference ? (
        <div className="border-t pt-6 mt-6">
          <div className="flex flex-row flex-wrap gap-3 items-center border-b pb-6">
            {page.data.pythonApiReference && (
              <PythonLinkButton url={page.data.pythonApiReference} label="Python API Reference" />
            )}
            {page.data.nodejsApiReference && (
              <NodeJSLinkButton url={page.data.nodejsApiReference} label="Node.js API Reference" />
            )}
          </div>
        </div>
      ) : null}
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
          <LinkButton url="https://github.com/alibaba/zvec/issues" label="🐛 Report an Issue" />
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

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
