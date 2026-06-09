import { zhCN } from '@fumadocs/language/zh-cn';
import { defineI18n } from 'fumadocs-core/i18n';
import { uiTranslations } from 'fumadocs-ui/i18n';


export const i18n = defineI18n({
  defaultLanguage: 'en',
  languages: ['en', 'zh'],
});


export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .preset('zh', zhCN())
  .add('ui', {
    en: {
      displayName: 'English',
    },
    zh: {
      displayName: '中文',
    },
  });
