'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


interface DocsRedirectProps {
  href: string;
  label: string;
}


export default function DocsRedirect({ href, label }: DocsRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    const destination = new URL(href, window.location.href);
    router.replace(`${destination.pathname}${destination.search}${destination.hash}`);
  }, [href, router]);

  return <Link href={href}>{label}</Link>;
}
