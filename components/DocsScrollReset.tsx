'use client';

import { useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';


function getProduct(pathname: string, lang: string) {
  if (pathname.startsWith(`/${lang}/docs/zvec-grep`)) return 'zvec-grep';
  if (pathname.startsWith(`/${lang}/docs/db`)) return 'zvec';
  return 'overview';
}


export default function DocsScrollReset({ lang }: { lang: string }) {
  const pathname = usePathname();
  const previous = useRef({
    pathname,
    product: getProduct(pathname, lang),
  });

  useLayoutEffect(() => {
    if (previous.current.pathname === pathname) return;

    const product = getProduct(pathname, lang);
    const productChanged = product !== previous.current.product;
    previous.current = { pathname, product };

    const frame = requestAnimationFrame(() => {
      if (!window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }

      if (productChanged) {
        const sidebarScroll = document.querySelector<HTMLElement>(
          '#nd-sidebar > div:nth-child(2) > div:last-child',
        );
        sidebarScroll?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [lang, pathname]);

  return null;
}
