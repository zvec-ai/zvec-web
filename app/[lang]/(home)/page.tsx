import Ecosystem from '@/components/Ecosystem';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ProductMatrix from '@/components/ProductMatrix';
import { i18n } from '@/lib/i18n';
import { SITE_URL } from '@/lib/constants';
import type { Metadata } from 'next';


export async function generateStaticParams() {
  return i18n.languages.map((language) => ({ lang: language }));
}


export async function generateMetadata({
  params,
}: { params: Promise<{ lang: string; }>; }): Promise<Metadata> {
  const { lang } = await params;
  return {
    alternates: {
      canonical: `${SITE_URL}/${lang}/`,
      languages: {
        en: `${SITE_URL}/en/`,
        zh: `${SITE_URL}/zh/`,
        'x-default': `${SITE_URL}/en/`,
      },
    },
  };
}


export default async function HomePage({ params }: { params: Promise<{ lang: string; }>; }) {
  const { lang } = await params;

  return (
    <main className="zvec-home">
      <Hero lang={lang} />
      <ProductMatrix lang={lang} />
      <Ecosystem lang={lang} />
      <Footer lang={lang} />
    </main>
  );
}
