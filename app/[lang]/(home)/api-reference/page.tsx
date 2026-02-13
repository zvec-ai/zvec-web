import { i18n } from '@/lib/i18n';
import type { Metadata } from 'next';
import { FaPython, FaNodeJs } from "react-icons/fa";


export const metadata: Metadata = {
  title: 'API Reference',
};


export async function generateStaticParams() {
  return i18n.languages.map((language) => ({ lang: language }));
}


export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  const translations = {
    en: {
      title: 'Zvec API Reference',
      python: 'Python API Reference',
      nodejs: 'Node.js API Reference'
    },
    zh: {
      title: 'Zvec API 参考',
      python: 'Python API 参考',
      nodejs: 'Node.js API 参考'
    },
  };
  const t = translations[lang as keyof typeof translations] || translations.en;

  return (
    <main className="flex-1 w-[100%] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-left mb-20 tracking-tight leading-[1.2] pb-1 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
        {t.title}
      </h1>

      <div className="w-full h-px bg-gray-200 dark:bg-gray-600/50 mb-12"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        <a
          href="/api-reference/python/"
          className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl
                 bg-gradient-to-br from-[#3776AB]/15 to-[#FFD343]/20
                 dark:from-[#3776AB]/30 dark:to-[#FFD343]/25">
                <FaPython className="h-6 w-6 text-[#2B5B84] dark:text-[#8CC4FF]" />
              </span>
              <h2 className="min-w-0 text-xl font-semibold text-gray-900 dark:text-gray-100">
                {t.python}
              </h2>
            </div>
            <span className="shrink-0 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              →
            </span>
          </div>
        </a>

        <a
          href="/api-reference/nodejs/"
          className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl
                 bg-gradient-to-br from-[#3C873A]/15 to-[#68A063]/20
                 dark:from-[#3C873A]/30 dark:to-[#68A063]/25">
                <FaNodeJs className="h-6 w-6 text-[#2F6F2C] dark:text-[#7CDE7A]" />
              </span>
              <h2 className="min-w-0 text-xl font-semibold text-gray-900 dark:text-gray-100">
                {t.nodejs}
              </h2>
            </div>
            <span className="shrink-0 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              →
            </span>
          </div>
        </a>

      </div>
    </main>
  );
}