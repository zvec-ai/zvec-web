import Link from 'next/link';
import { BookOpen, Rocket } from 'lucide-react';


const translations = {
  "en": {
    title: 'Zvec',
    description1: "A lightweight, lightning-fast, in-process vector database",
    description2: "High-Performance semantic search, ",
    description2_highlight: "made simple",
    button1: 'Get Started',
    button2: 'Learn More',
  },
  "zh": {
    title: 'Zvec',
    description1: "轻量级、低延迟、进程内的向量数据库",
    description2: "高性能语义搜索",
    description2_highlight: "简单易用",
    button1: '立即体验',
    button2: '了解更多',
  },
};


function Background() {
  return (
    <div>
      {/* Proxima */}
      < svg
        className="absolute top-1/5 left-1/8 w-48 h-48 opacity-50"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="80" cy="25" r="2.5" fill="#FF6B6B" />
        <line x1="50" y1="20" x2="80" y2="25" stroke="#FF6B6B" strokeWidth="1" />
        <circle cx="20" cy="30" r="2.5" fill="#4ECDC4" />
        <circle cx="50" cy="20" r="2.5" fill="#4ECDC4" />
        <circle cx="40" cy="60" r="2.5" fill="#4ECDC4" />
        <circle cx="70" cy="50" r="2.5" fill="#4ECDC4" />
        <line x1="20" y1="30" x2="50" y2="20" stroke="#4ECDC4" strokeWidth="1" />
        <line x1="40" y1="60" x2="70" y2="50" stroke="#4ECDC4" strokeWidth="1" />
      </svg >
      <svg
        className="absolute top-1/3 right-1/12 w-48 h-48 opacity-50"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="25" cy="40" r="2.5" fill="#FF6B6B" />
        <line x1="25" y1="40" x2="60" y2="30" stroke="#FF6B6B" strokeWidth="1" />
        <circle cx="60" cy="30" r="2.5" fill="#4ECDC4" />
        <circle cx="50" cy="70" r="2.5" fill="#4ECDC4" />
        <circle cx="80" cy="60" r="2.5" fill="#4ECDC4" />
        <circle cx="70" cy="20" r="2.5" fill="#4ECDC4" />
        <line x1="60" y1="30" x2="70" y2="20" stroke="#4ECDC4" strokeWidth="1" />
        <line x1="50" y1="70" x2="80" y2="60" stroke="#4ECDC4" strokeWidth="1" />
      </svg>
      {/* Stars in dark background */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-transparent hidden dark:block">
        {/* Blinking stars */}
        <div className="absolute top-1/5 left-1/5 w-1.5 h-1.5 bg-white/80 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-white/80 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/5 left-1/3 w-1.5 h-1.5 bg-white/80 rounded-full animate-pulse"></div>
        {/* Stars*/}
        {[
          { top: '12%', left: '18%', size: '1.8px', opacity: '50%' },
          { top: '24%', left: '82%', size: '1.6px', opacity: '45%' },
          { top: '35%', left: '10%', size: '2.0px', opacity: '55%' },
          { top: '42%', left: '70%', size: '1.4px', opacity: '40%' },
          { top: '55%', left: '25%', size: '1.7px', opacity: '50%' },
          { top: '18%', left: '55%', size: '1.5px', opacity: '45%' },
          { top: '68%', left: '85%', size: '1.9px', opacity: '50%' },
          { top: '75%', left: '30%', size: '1.6px', opacity: '45%' },
          { top: '30%', left: '40%', size: '1.8px', opacity: '50%' },
          { top: '50%', left: '90%', size: '1.4px', opacity: '40%' },
          { top: '65%', left: '15%', size: '1.7px', opacity: '48%' },
          { top: '10%', left: '70%', size: '1.5px', opacity: '42%' },
          { top: '45%', left: '5%', size: '1.9px', opacity: '52%' },
          { top: '80%', left: '60%', size: '1.6px', opacity: '45%' },
          { top: '20%', left: '5%', size: '1.7px', opacity: '48%' },
          { top: '28%', left: '22%', size: '1.5px', opacity: '44%' },
          { top: '60%', left: '75%', size: '1.7px', opacity: '47%' },
          { top: '85%', left: '20%', size: '1.4px', opacity: '41%' },
          { top: '5%', left: '40%', size: '1.6px', opacity: '46%' },
          { top: '72%', left: '50%', size: '1.8px', opacity: '49%' },
        ].map(({ top, left, size, opacity }, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              top,
              left,
              width: size,
              height: size,
              backgroundColor: `rgba(255, 255, 255, ${parseInt(opacity) / 100})`,
              animation: `twinkle ${2.5 + (i % 3) * 0.5}s infinite alternate`,
            }}
          />
        ))}
      </div >
    </div>
  )
}


function Buttons({ lang, fontFamily }: { lang: string, fontFamily: string }) {
  const t = translations[lang as keyof typeof translations] || translations.en;

  if (fontFamily == "Comic Sans MS") {
    {/* Cartoon-style Buttons */ }
    return (
      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <Link
          href={`/${lang}/docs/quickstart/`}
          prefetch={false}
          className="
              group relative px-8 py-4 bg-[#FF6B6B] text-white font-bangers text-xl rounded-3xl
              border-4 border-black dark:border-[#9CA3AF]
              shadow-[4px_4px_0_0_#000000] dark:shadow-[4px_4px_0_0_#9CA3AF] hover:shadow-[6px_6px_0_0_#000000] dark:hover:shadow-[6px_6px_0_0_#9CA3AF]
              active:translate-y-1 transition-all duration-150 ease-out flex items-center justify-center gap-3 transform hover:scale-105"
          aria-label={`${t.button1} - ${t.title}`}
        >
          <Rocket size={24} strokeWidth={2.5} />
          {t.button1}
        </Link>
        <Link
          href={`/${lang}/docs/`}
          prefetch={false}
          className="
              group relative px-8 py-4 bg-[#FFE66D] text-[#2E294E] font-bangers text-xl rounded-3xl
              border-4 border-black dark:border-[#9CA3AF]
              shadow-[4px_4px_0_0_#000000] dark:shadow-[4px_4px_0_0_#9CA3AF] hover:shadow-[6px_6px_0_0_#000000] dark:hover:shadow-[6px_6px_0_0_#9CA3AF]
              active:translate-y-1 transition-all duration-150 ease-out flex items-center justify-center gap-3 transform hover:scale-105"
          aria-label={`${t.button2} - ${t.title}`}
        >
          <BookOpen size={24} strokeWidth={2.5} />
          {t.button2}
        </Link>
      </div>
    )
  } else {
    {/* Regular-style Buttons */ }
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href={`/${lang}/docs/quickstart/`}
          prefetch={false}
          className="group relative px-8 py-4 bg-gradient-to-r from-emerald-700 to-teal-700 dark:from-emerald-600 dark:to-teal-600 text-white font-medium rounded-xl shadow-2xl shadow-emerald-700/25 dark:shadow-emerald-600/20 hover:shadow-emerald-700/35 dark:hover:shadow-emerald-600/25 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
          aria-label={`${t.button1} - ${t.title}`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <Rocket size={18} strokeWidth={2} />
          {t.button1}
        </Link>
        <Link
          href={`/${lang}/docs/`}
          prefetch={false}
          className="group relative px-8 py-4 bg-gradient-to-br from-amber-300/50 via-orange-150/80 to-rose-50/30 dark:from-stone-800/40 dark:via-amber-900/20 dark:to-stone-900/30 backdrop-blur-md border border-amber-200/60 dark:border-amber-700/40 text-amber-900 dark:text-amber-100 font-medium rounded-xl hover:bg-gradient-to-br hover:from-amber-300/70 hover:via-amber-200/60 hover:to-amber-100/60 dark:hover:from-stone-700/50 dark:hover:via-amber-800/30 dark:hover:to-stone-800/40 hover:-translate-y-0.5 hover:border-amber-300/80 dark:hover:border-amber-600/60 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-amber-500/10 dark:shadow-amber-800/10 hover:shadow-xl hover:shadow-amber-500/15 dark:hover:shadow-amber-800/15"
          aria-label={`${t.button2} - ${t.title}`}
        >
          <BookOpen size={18} strokeWidth={2} />
          {t.button2}
        </Link>
      </div>
    )
  }
}


function Content({ lang, fontFamily }: { lang: string, fontFamily: string }) {
  const t = translations[lang as keyof typeof translations] || translations.en;

  const fadeUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 1.2 } },
  };

  let secondLine;
  if (lang === 'zh') {
    secondLine = (
      <>
        <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent font-medium tracking-tight">
          {t.description2_highlight}
        </span >
        <span>{t.description2}</span>
      </>
    );
  } else {
    secondLine = (
      <>
        <span>{t.description2}</span>
        <span
          className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent font-medium tracking-tight"
          style={{ fontSize: '1.1em' }}
        >
          {t.description2_highlight}
        </span>
      </>
    );
  }

  return (
    < div className="relative z-10 text-center text-gray-900 dark:text-white px-6 max-w-4xl mx-auto" >
      <h1
        className="font-black tracking-tight leading-none sm:mb-8 md:mb-12"
        style={{
          fontFamily: fontFamily,
          fontSize: 'clamp(3.5rem, 10vw, 8rem)',
          letterSpacing: '-0.02em',
          lineHeight: '0.9'
        }}
      >
        {t.title}
      </h1>
      <div
        className="text-2xl md:text-3xl leading-relaxed mb-12 opacity-90"
        style={{ fontFamily: fontFamily }}
      >
        <div>{t.description1}</div>
        <div className="flex flex-wrap justify-center items-baseline gap-x-2">{secondLine}</div>
      </div>
      <Buttons lang={lang} fontFamily={fontFamily} />
    </div>)
}


export default function Hero({ lang, fontFamily }: { lang: string, fontFamily: string }) {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <Background />
      <Content lang={lang} fontFamily={fontFamily} />
    </section >
  );
}