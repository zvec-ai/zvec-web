import Link from 'next/link';
import { blog } from '@/lib/source';
import { i18n } from '@/lib/i18n';
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Blog',
};


export async function generateStaticParams() {
  return i18n.languages.map((language) => ({ lang: language }));
}


function PlaceholderDiagram() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 w-full h-full flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 text-blue-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>
  );
}


function BlogCard({
  post,
  lang,
}: {
  post: {
    url: string;
    slugs: string[];
    data: {
      title: string;
      date?: string;
      image?: string;
      description?: string;
    };
  };
  lang: string;
}) {
  const { title, date, image, description } = post.data;
  const hasImage = image && typeof image === 'string';

  return (
    <Link href={`/${lang}/blog/${post.slugs[0]}`} className="block group h-full">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col hover:-translate-y-1.5">
        <div className="relative h-64 w-full">
          {hasImage ? (
            <img
              src={image}
              alt=""
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <PlaceholderDiagram />
          )}
        </div>
        <div className="p-7 flex flex-col flex-grow">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed mb-4 flex-grow">
              {description}
            </p>
          )}
          {date && (
            <time className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-auto pt-4 border-t border-gray-100 dark:border-gray-700/50">
              {date}
            </time>
          )}
        </div>
      </div>
    </Link>
  );
}


export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const posts = blog.getPages(lang);

  const translations = {
    en: {
      title: 'Zvec Blog',
      zeroPosts: 'No posts yet.',
    },
    zh: {
      title: 'Zvec 博客',
      zeroPosts: '敬请期待',
    },
  };
  const t = translations[lang as keyof typeof translations] || translations.en;

  return (
    <main className="flex-1 w-[100%] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-left mb-20 tracking-tight leading-[1.2] pb-1 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
        {t.title}
      </h1>

      <div className="w-full h-px bg-gray-200 dark:bg-gray-600/50 mb-12"></div>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 dark:text-gray-400 italic">{t.zeroPosts}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {posts.map((post) => (
            <BlogCard key={post.url} post={post} lang={lang} />
          ))}
        </div>
      )}
    </main>
  );
}