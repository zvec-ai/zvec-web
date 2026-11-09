import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';


// Statically cached
export const revalidate = false;
export const { staticGET: GET } = createFromSource(source);
