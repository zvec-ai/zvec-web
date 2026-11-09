'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';


interface DocsRepoInfoProps {
  grep: ReactNode;
  lang: string;
  zvec: ReactNode;
}


export default function DocsRepoInfo({ grep, lang, zvec }: DocsRepoInfoProps) {
  const pathname = usePathname();
  const isGrep = pathname.startsWith(`/${lang}/docs/zvec-grep`);

  return isGrep ? grep : zvec;
}
