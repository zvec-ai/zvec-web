import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { blog } from '@/lib/source';
import { i18n } from '@/lib/i18n';
import { SITE_URL } from '@/lib/constants';
import type { Metadata } from 'next';


const metaTranslations = {
  en: {
    title: 'Blog',
    description: 'Product updates, engineering deep dives, benchmarks, and practical stories from the Zvec local retrieval ecosystem.',
  },
  zh: {
    title: '博客',
    description: '来自 Zvec 本地检索生态的产品动态、工程实践、性能测试与应用案例。',
  },
};


export async function generateMetadata({
  params,
}: { params: Promise<{ lang: string; }>; }): Promise<Metadata> {
  const { lang } = await params;
  const m = metaTranslations[lang as keyof typeof metaTranslations] || metaTranslations.en;
  const locale = lang === 'zh' ? 'zh_CN' : 'en_US';
  const url = `${SITE_URL}/${lang}/blog/`;

  return {
    title: m.title,
    description: m.description,
    openGraph: {
      type: 'website',
      siteName: 'Zvec',
      locale,
      url,
      title: m.title,
      description: m.description,
      images: '/img/header.png',
    },
    twitter: {
      card: 'summary_large_image',
      title: m.title,
      description: m.description,
      images: '/img/header.png',
    },
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/en/blog/`,
        zh: `${SITE_URL}/zh/blog/`,
        'x-default': `${SITE_URL}/en/blog/`,
      },
    },
  };
}


export async function generateStaticParams() {
  return i18n.languages.map((language) => ({ lang: language }));
}


function PlaceholderDiagram() {
  return (
    <div className="zvec-blog-placeholder">
      <svg
        xmlns="http://www.w3.org/2000/svg"
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


function BlogCover({
  image,
  imageDark,
  title,
  loading,
}: {
  image: string;
  imageDark?: string;
  title: string;
  loading?: 'eager' | 'lazy';
}) {
  return (
    <>
      <img
        className={imageDark ? 'block dark:hidden' : undefined}
        src={image}
        alt={title}
        loading={loading}
      />
      {imageDark && (
        <img
          className="hidden dark:block"
          src={imageDark}
          alt=""
          loading={loading}
          aria-hidden="true"
        />
      )}
    </>
  );
}


function BlogCard({
  post,
  lang,
  category,
  readLabel,
}: {
  post: {
    url: string;
    slugs: string[];
    data: {
      title: string;
      date?: string;
      image?: string;
      imageDark?: string;
      description?: string;
    };
  };
  lang: string;
  category: string;
  readLabel: string;
}) {
  const { title, date, image, imageDark, description } = post.data;
  const hasImage = image && typeof image === 'string';

  return (
    <Link href={`/${lang}/blog/${post.slugs[0]}`} className="zvec-blog-card">
        <div className="zvec-blog-card-media">
          {hasImage ? (
            <BlogCover
              image={image}
              imageDark={imageDark}
              title={title}
              loading="lazy"
            />
          ) : (
            <PlaceholderDiagram />
          )}
        </div>
        <div className="zvec-blog-card-body">
          <div className="zvec-blog-card-meta">
            <span>{category}</span>
            {date && <time dateTime={date}>{date}</time>}
          </div>
          <h2>{title}</h2>
          {description && (
            <p>{description}</p>
          )}
          <span className="zvec-blog-card-action">{readLabel}<ArrowRight aria-hidden="true" /></span>
        </div>
    </Link>
  );
}


function getCategory(title: string, labels: { release: string; engineering: string; application: string; }) {
  if (/^Announcing Zvec|^Zvec v\d/i.test(title)) return labels.release;
  if (/mobile|windows|photo search|application/i.test(title)) return labels.application;
  return labels.engineering;
}


export default async function Home({ params }: { params: Promise<{ lang: string; }>; }) {
  const { lang } = await params;
  const posts = blog.getPages(lang).sort((a, b) => {
    const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
    const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
    return dateB - dateA;
  });

  const translations = {
    en: {
      title: 'Blog',
      description: 'Product updates, engineering deep dives, benchmarks, and practical retrieval stories.',
      featured: 'Latest article',
      latest: 'More articles',
      read: 'Read article',
      articleCount: (count: number) => `${count} articles`,
      categories: { release: 'Release', engineering: 'Engineering', application: 'Applications' },
      zeroPosts: 'No posts yet.',
    },
    zh: {
      title: '博客',
      description: '产品动态、工程实践、性能测试，以及真实检索场景。',
      featured: '最新文章',
      latest: '更多文章',
      read: '阅读文章',
      articleCount: (count: number) => `${count} 篇文章`,
      categories: { release: '版本发布', engineering: '工程技术', application: '应用实践' },
      zeroPosts: '敬请期待',
    },
  };
  const t = translations[lang as keyof typeof translations] || translations.en;
  const [featuredPost, ...latestPosts] = posts;

  return (
    <main className="zvec-blog-page">
      <div className="zvec-container">
        <div className="zvec-section-heading zvec-page-heading zvec-blog-heading">
          <h1>{t.title}</h1>
          <p>{t.description}</p>
        </div>

        {posts.length === 0 ? (
          <div className="zvec-blog-empty">
            <p>{t.zeroPosts}</p>
          </div>
        ) : featuredPost && (
          <>
            <section className="zvec-blog-featured" aria-labelledby="zvec-blog-featured-title">
              <span className="zvec-blog-section-label">{t.featured}</span>
              <Link href={`/${lang}/blog/${featuredPost.slugs[0]}`} className="zvec-blog-featured-card">
                <div className="zvec-blog-featured-media">
                  {featuredPost.data.image ? (
                    <BlogCover
                      image={featuredPost.data.image}
                      imageDark={featuredPost.data.imageDark}
                      title={featuredPost.data.title}
                      loading="eager"
                    />
                  ) : (
                    <PlaceholderDiagram />
                  )}
                </div>
                <div className="zvec-blog-featured-body">
                  <div className="zvec-blog-card-meta">
                    <span>{getCategory(featuredPost.data.title, t.categories)}</span>
                    {featuredPost.data.date && <time dateTime={featuredPost.data.date}>{featuredPost.data.date}</time>}
                  </div>
                  <h2 id="zvec-blog-featured-title">{featuredPost.data.title}</h2>
                  {featuredPost.data.description && <p>{featuredPost.data.description}</p>}
                  <span className="zvec-blog-card-action">{t.read}<ArrowRight aria-hidden="true" /></span>
                </div>
              </Link>
            </section>

            {latestPosts.length > 0 && (
              <section className="zvec-blog-latest" aria-labelledby="zvec-blog-latest-title">
                <div className="zvec-blog-list-heading">
                  <h2 id="zvec-blog-latest-title">{t.latest}</h2>
                  <span>{t.articleCount(latestPosts.length)}</span>
                </div>
                <div className="zvec-blog-grid">
                  {latestPosts.map((post) => (
                    <BlogCard
                      key={post.url}
                      post={post}
                      lang={lang}
                      category={getCategory(post.data.title, t.categories)}
                      readLabel={t.read}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
