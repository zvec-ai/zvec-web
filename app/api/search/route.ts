import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';


// Statically cached
export const revalidate = false;
export const { staticGET: GET } = createFromSource(source, {
  localeMap: {
    en: {
      language: 'english',
    },
    // zh: {
    //   components: {
    //     tokenizer: createTokenizer(),
    //   },
    //   search: {
    //     threshold: 0,
    //     tolerance: 0,
    //   },
    // },
  },
});
