import { RootProvider } from 'fumadocs-ui/provider/next';
import SearchDialog from '@/components/search';
import type { ReactNode } from 'react';
import { i18nProvider } from 'fumadocs-ui/i18n';
import { translations } from '@/lib/i18n';


export async function Provider({ params, children }: { params: LayoutProps<'/[lang]'>['params'], children: ReactNode; }) {
  const { lang } = await params;

  return (
    <RootProvider
      i18n={i18nProvider(translations, lang)}
      search={{
        SearchDialog,
        preload: false,
      }}
    >
      {children}
    </RootProvider>
  );
}