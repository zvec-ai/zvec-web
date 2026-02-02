import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { i18n } from '@/lib/i18n';
import Image from 'next/image';


export const logo = (
  <div>
    <div className="block dark:hidden">
      <img
        src="/img/zvec-logo-light.svg"
        alt="Zvec Logo"
        style={{ height: '45px', width: 'auto' }}
      />
    </div>
    <div className="hidden dark:block">
      <img
        src="/img/zvec-logo-dark.svg"
        alt="Zvec Logo"
        style={{ height: '45px', width: 'auto' }}
      />
    </div>
  </div>
);


export function baseOptions(locale: string): BaseLayoutProps {
  return {
    i18n,
    nav: {
      title: (
        <div>
          {logo}
        </div>
      ),
      url: `/${locale}`,
    },
    githubUrl: 'https://github.com/alibaba/zvec',
  };
}

