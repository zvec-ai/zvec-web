import Link from 'next/link';
import { CircleCheck, Component, Cpu, FileStack, Merge, Zap } from 'lucide-react';


const translations = {
  en: {
    header: {
      title: 'Meet Zvec',
      tagline: "The simple way to build AI applications with vectors",
      zvec: "With Zvec, ",
      description: "build high-performance applications without the complexity holding you back."
    },
    features: [
      {
        title: 'Blazing Fast',
        description: "Millisecond search at billion-vector scale.",
        link: '/docs/benchmarks/',
      },
      {
        title: 'Simple, Just Works',
        description: 'Get up and running in seconds — just install and go.',
        link: '/docs/quickstart/',
      },
      {
        title: 'Dense & Sparse Vectors',
        description: 'Support dense and sparse vectors, plus multi-vector queries.',
        link: '/docs/concepts/vector-embedding/',
      },
      {
        title: 'Filtered Vector Search',
        description: 'Combine semantic search with filters for precise, refined results.',
        link: '/docs/data-operations/query/#filtered-vector-similarity-search',
      },
      {
        title: 'Grouped Search',
        description: 'Run vector similarity searches with a "GROUP BY" style clause.',
        link: '/docs/data-operations/query/group/',
      },
      {
        title: 'In-Process by Design',
        description: 'Runs directly in your app. No external services required.',
        link: '/docs/',
      },
    ],
  },
  zh: {
    header: {
      title: 'Zvec 概览',
      tagline: "让 AI 开发更简单 — 从向量开始",
      zvec: "使用 Zvec, ",
      description: "构建高性能应用，无需被复杂性所束缚。"
    },
    features: [
      {
        title: '高性能',
        description: '历经阿里巴巴实战检验，毫秒级检索十亿级向量',
        link: '/docs/benchmarks/',
      },
      {
        title: '开箱即用，简单可靠',
        description: '安装即用，快速上手。',
        link: '/docs/quickstart/',
      },
      {
        title: '稠密向量与稀疏向量',
        description: '支持稠密向量和稀疏向量，并支持多向量混合查询。',
        link: '/docs/concepts/vector-embedding/',
      },
      {
        title: '带过滤条件的混合搜索',
        description: '将语义搜索与类 SQL 过滤条件结合使用，获得更精准的搜索结果。',
        link: '/docs/data-operations/query/#filtered-vector-similarity-search',
      },
      {
        title: '分组搜索',
        description: '使用 "GROUP BY" 风格语句进行向量相似性搜索。',
        link: '/docs/data-operations/query/group/',
      },
      {
        title: '进程内/嵌入式设计',
        description: '直接在程序进程中运行 — 无需依赖任何外部服务。',
        link: '/docs/',
      },
    ],
  },
};


function Header({ lang }: { lang: string }) {
  const t = translations[lang as keyof typeof translations] || translations.en;
  return (
    <div className="mb-10 max-w-4xl">
      {/* Title */}
      <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight tracking-tight relative group">
        {t.header.title}
      </h2>

      {/* Tagline */}
      <div className="relative mt-8 mb-12">
        {/* Decorative vertical line with gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500/60 via-blue-500/60 to-transparent rounded-full"></div>
        <p className="text-lg md:text-xl max-w-2xl max-w-2xl pl-6 opacity-90">
          {t.header.tagline}
        </p>
      </div>
    </div>
  )
}


function Footer({ lang }: { lang: string }) {
  const t = translations[lang as keyof typeof translations] || translations.en;
  return (
    <div className="
      relative mt-12 p-6 rounded-2xl
      border border-gray-200/50 dark:border-gray-700/50
      bg-gradient-to-br from-white/50 to-gray-50/30 dark:from-gray-900/30 dark:to-gray-800/30
      backdrop-blur-sm"
    >
      {/* Top accent */}
      <div className="absolute -top-px left-5 right-5 h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 via-60% to-transparent"></div>

      {/* Floating decorative element */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden [@media(min-width:1340px)]:block">
        <div className="relative">
          {/* Pulsing outer circle */}
          <div className="absolute inset-0 w-10 h-10">
            <div className="absolute inset-0 rounded-full border border-blue-400/30 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border border-teal-400/20 animate-ping [animation-delay:-0.5s]"></div>
          </div>
          {/* Main circle */}
          <div className="relative w-10 h-10 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-400/10 to-teal-400/10 p-[1.5px]">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-white/20 to-transparent dark:from-gray-900/30 dark:to-transparent backdrop-blur-sm"></div>
          </div>
          {/* Animated dots */}
          <div className="absolute -top-1 -right-1 w-3 h-3">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-teal-400 to-blue-400 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 to-blue-400 animate-ping opacity-75"></div>
          </div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-400 to-teal-400 animate-pulse [animation-delay:0.3s]"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 animate-ping opacity-75 [animation-delay:0.3s]"></div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="whitespace-normal lg:whitespace-nowrap text-center">
        <p className="text-lg md:text-xl text-gray-800 dark:text-gray-200 leading-relaxed">
          <span className="font-semibold bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent">
            {t.header.zvec}
          </span>
          <span className="ml-2">{t.header.description}</span>
        </p>
      </div>

      {/* Bottom accent */}
      <div className="absolute -bottom-px left-5 right-5 h-0.5 bg-gradient-to-r from-transparent via-teal-500/50 via-40% via-purple-500/50 via-60% to-transparent">
      </div>
    </div>
  )
}


const icons = {
  performance: <Zap className="w-7 h-7 text-white" />,
  simplicity: <CircleCheck className="w-7 h-7 text-white" />,
  multi_vector: <FileStack className="w-7 h-7 text-white" />,
  hybrid_search: <Merge className="w-7 h-7 text-white" />,
  grouped_search: <Component className="w-7 h-7 text-white" />,
  in_process: <Cpu className="w-7 h-7 text-white" />,
};


const iconMap = [icons.performance, icons.simplicity, icons.multi_vector, icons.hybrid_search, icons.grouped_search, icons.in_process];


function FeatureCardsCartoon({ lang }: { lang: string }) {
  const t = translations[lang as keyof typeof translations] || translations.en;

  const getCardColor = (index: number): string => {
    const colors = [
      'bg-[#FF9E80]', // coral
      'bg-[#A78BFA]', // violet
      'bg-[#FBBF24]', // amber
      'bg-[#60A5FA]', // blue
      'bg-[#34D399]', // emerald
      'bg-[#F472B6]', // pink
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {t.features.map((feat, index) => (
        <div key={index} className="group h-full">
          <Link
            href={`/${lang}${feat.link}`}
            className="block h-full"
            aria-label={`${feat.title} - ${feat.description}`}
          >
            {/* Feature Card */}
            <div
              className={`relative p-6 rounded-3xl border-4 border-black shadow-[6px_6px_0_0_#000] hover:shadow-[8px_8px_0_0_#000] transform hover:-translate-y-2 transition-all duration-200 ${getCardColor(index)} text-white flex flex-col justify-between min-h-[260px]`}
              style={{ fontFamily: 'Inter' }}
            >
              {/* Star Decorations */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-300 rounded-full border-2 border-black flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
              </div>
              {/* Icon */}
              <div className="mb-4 flex justify-center">
                <div className="w-12 h-12 rounded-2xl bg-black/20 backdrop-blur-sm flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  {iconMap[index % iconMap.length]}
                </div>
              </div>
              <div className="flex flex-col flex-grow">
                {/* Title */}
                <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                {/* Description */}
                <p className="opacity-90 mb-4 leading-relaxed">{feat.description}</p>
              </div>
              {/* "Learn more" arrow */}
              <div className="flex items-center gap-2 mt-2">
                <span className="font-bold">Learn more</span>
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}


function FeatureCardsHighTech({ lang }: { lang: string }) {
  const t = translations[lang as keyof typeof translations] || translations.en;

  function getIconColor(index: number): string {
    const colors = [
      'bg-gradient-to-br from-orange-500 via-amber-400 to-yellow-300 shadow-lg shadow-amber-500/25',
      'bg-gradient-to-br from-violet-600 via-purple-500 to-fuchsia-500 shadow-lg shadow-purple-500/25',
      'bg-gradient-to-br from-red-500 via-rose-500 to-pink-400 shadow-lg shadow-rose-500/25',
      'bg-gradient-to-br from-emerald-500 via-teal-400 to-cyan-500 shadow-lg shadow-emerald-500/20',
      'bg-gradient-to-br from-blue-500 via-sky-400 to-cyan-500 shadow-lg shadow-blue-500/20',
      'bg-gradient-to-br from-emerald-600 via-green-500 to-lime-400 shadow-lg shadow-emerald-500/25',
    ];
    return colors[index % colors.length];
  }

  return (
    < div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {
        t.features.map((feat, index) => {
          const isTealTheme = (index == 0 || index == 4);
          const isPurpleTheme = (index == 1 || index == 5);
          const isAmberTheme = (index == 2 || index == 3);
          return (
            <a
              key={index}
              href={`/${lang}${feat.link}`}
              className="group relative block"
              aria-label={`${feat.title} - ${feat.description}`}
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-teal-500/20 to-teal-500/10 rounded-2xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 scale-105 -z-10"></div>
              {/* Feature Card */}
              <div className="h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:border-teal-300/50 dark:hover:border-teal-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-teal-500/10 transform hover:-translate-y-2 relative overflow-hidden">
                {/* Top accent line */}
                {isTealTheme && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-blue-500 to-cyan-400"></div>
                )}
                {isPurpleTheme && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400"></div>
                )}
                {isAmberTheme && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400"></div>
                )}
                {/* Icon */}
                <div className="flex justify-start mb-6 relative">
                  {/* <div className="relative"> */}
                  <div className={`relative w-10 h-10 rounded-2xl flex items-center justify-center ${getIconColor(index)} transform group-hover:scale-110 transition-transform duration-300`}>
                    {iconMap[index % iconMap.length]}
                    {/* </div> */}
                  </div>
                </div>
                {/* Feature content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors">
                    <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      {feat.title}
                    </span>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                    {feat.description}
                  </p>
                  {/* Link with animated arrow */}
                  <div className="flex items-center gap-2 pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-sm font-medium bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400 bg-clip-text text-transparent">
                      {'Learn more'}
                    </span>
                    <svg
                      className="w-4 h-4 text-teal-500 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
                {/* Bottom decorative dots */}
                <div className="absolute bottom-4 right-4 flex gap-1 opacity-20">
                  {[1, 2, 3].map((dot) => (
                    <div
                      key={dot}
                      className="w-1 h-1 bg-current rounded-full"
                      style={{ animationDelay: `${dot * 100}ms` }}
                    ></div>
                  ))}
                </div>
              </div>
            </a>
          );
        })
      }
    </div >
  )
}


const FeatureCards: React.FC<{ lang: string }> = ({ lang }) => {
  return (
    <section className="py-18 px-4 sm:px-6 lg:px-16 relative overflow-hidden">
      <div className="max-w-4xl lg:max-w-5xl xl:max-w-[min(1280px,80vw)] mx-auto px-4 sm:px-6 lg:px-8">
        <Header lang={lang} />
        <div className="block dark:hidden">
          <FeatureCardsCartoon lang={lang} />
        </div>
        <div className="hidden dark:block">
          <FeatureCardsHighTech lang={lang} />
        </div>
        <Footer lang={lang} />
      </div>
    </section>
  );
};


export default FeatureCards;