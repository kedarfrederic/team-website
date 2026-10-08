import {getViteConfig} from 'astro/config';
const config={test:{include:['tests/**/*.test.ts'],testTimeout:30000}};
export default getViteConfig(config as Parameters<typeof getViteConfig>[0]);
