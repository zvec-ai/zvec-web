'use client';
import { RootProvider } from 'fumadocs-ui/provider/next';
import SearchDialog from '@/components/search';
import type { ReactNode } from 'react';
import { defineI18nUI } from 'fumadocs-ui/i18n';
import { i18n } from '@/lib/i18n';


const { provider } = defineI18nUI(i18n, {
  translations: {
    en: {
      displayName: 'English',
    },
    // zh: {
    //   displayName: '中文',
    //   toc: '目录',
    //   search: '搜索',
    //   lastUpdate: '最后更新于',
    //   searchNoResult: '没有结果',
    //   previousPage: '上一页',
    //   nextPage: '下一页',
    // },
  },
});


export async function Provider({ params, children }: { params: LayoutProps<'/[lang]'>['params'], children: ReactNode }) {
  const { lang } = await params;

  return (
    <RootProvider
      i18n={provider(lang)}
      search={{
        SearchDialog,
        preload: false,
      }}
    >
      {children}
    </RootProvider>
  );
}