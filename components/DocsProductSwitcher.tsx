'use client';

import Link from 'next/link';
import { Database, LayoutGrid, SearchCode } from 'lucide-react';
import { usePathname } from 'next/navigation';


export default function DocsProductSwitcher({ lang }: { lang: string }) {
  const pathname = usePathname();
  const isOverview = pathname === `/${lang}/docs` || pathname === `/${lang}/docs/`;
  const isZvec = pathname.startsWith(`/${lang}/docs/db`);
  const isGrep = pathname.startsWith(`/${lang}/docs/zvec-grep`);

  return (
    <nav className="zvec-docs-product-switcher" aria-label={lang === 'zh' ? '切换产品文档' : 'Switch product documentation'}>
      <Link className="zvec-docs-overview-link" href={`/${lang}/docs/`} data-active={isOverview}>
        <LayoutGrid aria-hidden="true" />
        {lang === 'zh' ? '产品总览' : 'Product Overview'}
      </Link>
      <div>
        <Link href={`/${lang}/docs/db/`} data-active={isZvec}>
          <Database aria-hidden="true" />
          Zvec
        </Link>
        <Link href={`/${lang}/docs/zvec-grep/`} data-active={isGrep}>
          <SearchCode aria-hidden="true" />
          Zvec-Grep
        </Link>
      </div>
    </nav>
  );
}
