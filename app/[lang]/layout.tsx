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
  applicationCategory: 'DatabaseApplication',
  operatingSystem: 'Linux, macOS, Windows',
  description: 'An open-source, in-process vector database by Alibaba — lightweight, lightning-fast, and battle-tested.',
  author: {
    '@type': 'Organization',
    name: 'Alibaba',
    url: 'https://www.alibabagroup.com/',
  }
};


const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Zvec',
  url: SITE_URL,
  logo: `${SITE_URL}/img/zvec-logo-light.png`,
  parentOrganization: {
    '@type': 'Organization',
    name: 'Alibaba Group',
    url: 'https://www.alibabagroup.com/',
    sameAs: [
      'https://en.wikipedia.org/wiki/Alibaba_Group',
      'https://www.linkedin.com/company/chinese-alibaba-group/',
      'https://github.com/alibaba',
    ],
  },
  department: {
    '@type': 'Organization',
    name: 'Tongyi Lab',
    sameAs: [
      'https://x.com/Ali_TongyiLab',
    ],
  },
  sameAs: [
    'https://github.com/alibaba/zvec',
    'https://pypi.org/project/zvec/',
    'https://www.npmjs.com/package/@zvec/zvec',
  ],
};


const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Zvec',
  url: SITE_URL,
  inLanguage: ['en', 'zh'],
  publisher: {
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
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
      </head>
      <body className="flex flex-col min-h-screen">
        <Provider params={params} >{children}</Provider>
      </body>
    </html>
  );
}
