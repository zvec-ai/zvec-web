import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';


export default async function Layout({
  params,
  children,
}: LayoutProps<'/[lang]/docs'>) {
  const { lang } = await params;

  return (
    <div style={{ '--fd-nav-height': '60px' } as React.CSSProperties}>
      <DocsLayout
        {...baseOptions(lang)}
        sidebar={{ enabled: false, prefetch: false }}
        tree={source.getPageTree()}
      >
        {children}
      </DocsLayout>
    </div>
  );
}
