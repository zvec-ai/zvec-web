import { getLLMText } from '@/lib/get-llm-text';
import { source } from '@/lib/source';
import { notFound } from 'next/navigation';


export const dynamic = 'force-static';
export const revalidate = false;


type Params = Promise<{
  lang: string;
  slug?: string[];
}>;


export async function GET(_req: Request, { params }: { params: Params; }) {
  const { lang, slug = [] } = await params;

  const cleanSlug = slug.map((s, i) =>
    i === slug.length - 1 ? s.replace(/\.mdx$|\.md$/, '') : s
  );

  const page = source.getPage(cleanSlug, lang);
  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}


export function generateStaticParams() {
  return source
    .generateParams()
    .filter((p) => p.slug && p.slug.length > 0)
    .map(({ lang, slug }) => ({
      lang,
      slug: slug!.map((s, i) =>
        i === slug!.length - 1 ? `${s}.md` : s
      ),
    }));
}
