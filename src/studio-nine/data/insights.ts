// Real articles carried over from the live site (bodies in src/content/insights/*.html, extracted from the multipager source and Kedar's repo snapshot).
import index from '../content/insights/index.json';
export type Post = { slug: string; cat: string; min: number; date: string; title: string; dek: string; words: number; img: string };
export const posts: Post[] = index as Post[];
const bodies = import.meta.glob('../content/insights/*.html', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
export const bodyFor = (slug: string) => bodies[`../content/insights/${slug}.html`] || '';
