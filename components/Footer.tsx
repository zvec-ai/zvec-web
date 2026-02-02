import Image from 'next/image';


const translations = {
  en: {
    copyright: '© {year} Alibaba Group',
    contactUs: 'Contact & Support',
    email: 'Email: zvec@alibaba-inc.com',
    githubIssues: 'GitHub Issues',
    discord: 'Join us on Discord',
    fumadocs: 'This website is built with Fumadocs.',
  },
  zh: {
    copyright: '© {year} Zvec, an open-source vector database by Alibaba Group',
    contactUs: '联系与支持',
    email: '邮箱：zvec@alibaba-inc.com',
    githubIssues: 'GitHub 问题反馈',
    discord: 'Join us on Discord',
    fumadocs: 'This website is built with Fumadocs.',
  },
};


export default function Footer({ lang }: { lang: string }) {
  const t = translations[lang as keyof typeof translations] || translations.en;
  const currentYear = new Date().getFullYear();
  const copyrightText = t.copyright.replace('{year}', currentYear.toString());

  return (
    <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-gray-500 dark:text-gray-400">
        {/* Logo Section — merged into one cell */}
        <div className="flex items-center justify-center md:justify-start">
          <Image
            src="/img/zvec-logo-light.svg"
            alt="Zvec Logo"
            width={100}
            height={40}
            priority
            className="dark:hidden"
          />
          <Image
            src="/img/zvec-logo-dark.svg"
            alt="Zvec Logo"
            width={100}
            height={40}
            priority
            className="hidden dark:block"
          />
        </div>

        {/* Contact & Support Links */}
        <div className="flex flex-col items-center md:items-start justify-center space-y-2">
          <span className="font-bold text-base">{t.contactUs}</span>
          <a
            href={`mailto:${t.email}`}
            className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors block"
          >
            {t.email}
          </a>
          <a
            href="https://github.com/alibaba/zvec/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors block"
          >
            {t.githubIssues}
          </a>
          <a
            href="https://discord.gg/rKddFBBu9z"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors block"
          >
            {t.discord}
          </a>
        </div>

        {/* Fumadocs Credit */}
        <div className="flex items-center justify-center md:justify-start">
          <a
            href="https://fumadocs.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {t.fumadocs}
          </a>
        </div>

        {/* Copyright Notice */}
        <div className="flex items-center justify-center md:justify-end">
          {copyrightText}
        </div>
      </div>
    </footer >
  );
}