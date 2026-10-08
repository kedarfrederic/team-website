import consent from './ko/consent.json';
import homeA from './ko/home-a.json';
import homeB from './ko/home-b.json';
import pricingProducts from './ko/pricing-products.json';
import productsContact from './ko/products-contact.json';
import company from './ko/company.json';
import audiences from './ko/audiences.json';
import enterprise from './ko/enterprise.json';
export const koreanCopy: Record<string,string>={...consent,...homeA,...homeB,...pricingProducts,...productsContact,...company,...audiences,...enterprise};
export const normalizeCopy=(text:string)=>text.replace(/\s+/g,' ').trim();
export function translateCopy(text:string){const key=normalizeCopy(text);const translated=koreanCopy[key];if(translated===undefined)return text;const leading=text.match(/^\s*/)?.[0]||'';const trailing=text.match(/\s*$/)?.[0]||'';return leading+translated+trailing;}
