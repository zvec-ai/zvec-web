import '../global.css';
import { Inter } from 'next/font/google';
import { Provider } from './provider';
import 'katex/dist/katex.css';
import { JsonLd } from '@/components/JsonLd';
import { SITE_URL } from '@/lib/constants';


const inter = Inter({
  subsets: ['latin'],
});


const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Zvec',
  url: SITE_URL,
  applicationCategory: 'Database',
  description: 'A lightweight, lightning-fast in-process vector database by Alibaba.',
  author: {
    '@type': 'Organization',
    name: 'Alibaba',
  },
};


export default async function Layout({
  params,
  children,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params;

  return (
    <html lang={lang} className={inter.className} suppressHydrationWarning>
      <head>
        <JsonLd data={softwareJsonLd} />
      </head>
      <body className="flex flex-col min-h-screen">
        <Provider params={params} >{children}</Provider>
      </body>
    </html>
  );
}
