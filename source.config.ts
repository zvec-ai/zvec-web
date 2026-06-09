import { remarkSteps } from 'fumadocs-core/mdx-plugins';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import {
  defineCollections,
  defineConfig,
  defineDocs,
} from 'fumadocs-mdx/config';
import rehypeKatex from 'rehype-katex';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import { z } from 'zod';


// Define docs
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema.extend({
      extendedTitle: z.string().default(''),
      pythonApiReference: z.string().default(''),
      nodejsApiReference: z.string().default(''),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});


// Define blog posts
export const blogPosts = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: pageSchema.extend({
    date: z.string(),
    image: z.string().default(''),
    description: z.string().default(''),
  }),
});


export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMath, remarkDirective, remarkSteps],
    // Place it at first, it should be executed before the syntax highlighter
    rehypePlugins: (v) => [rehypeKatex, ...v],
  },
});
