import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: {
    template: '%s | Zvec',
    default: 'Documentation | Zvec',
  },
};


export default async function Layout({
  params,
  children,
}: LayoutProps<'/[lang]/docs'>) {
  const { lang } = await params;

  return (
    <DocsLayout
      {...baseOptions(lang)}
      tree={source.pageTree[lang]}
    >
      {children}
    </DocsLayout >
  );
}
