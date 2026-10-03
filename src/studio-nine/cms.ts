import type { APIContext } from 'astro';
import { stegaClean } from '@sanity/client/stega';
import { getClient, urlFor } from '../lib/sanity';
import { normalizeCopy } from './lib/i18n/translate';
import { localeFromPath, stripLocale } from './lib/i18n/routes';
export const pageKeys = ["home", "pricing", "rollouts", "teammate", "assets", "tours", "connectors", "contact", "security", "about", "for-artists", "for-managers", "for-labels", "for-partners", "enterprise", "demo", "insights", "changelog"] as const;
export function pageIdentity(path:string) {
 const page = stripLocale(path).slice(1) || 'home';
 return {locale:localeFromPath(path), page:pageKeys.includes(page as typeof pageKeys[number])?page:'shared'};
}
export function safeDestination(value:string) {
 return /^(?:\/(?!\/)|https:\/\/|mailto:|tel:|#)/i.test(value) && !/[\\\u0000-\u0020\u007f]/.test(value);
}
export interface ContentMaps {copy:Record<string,string>; media:Record<string,string>; links:Record<string,string>}
export function contentMaps(documents:any[]):ContentMaps {
 const maps:ContentMaps={copy:{},media:{},links:{}};
 for(const doc of documents){
  for(const item of doc?.copy||[])if(typeof item.sourceText==='string'&&typeof item.value==='string')maps.copy[normalizeCopy(stegaClean(item.sourceText))]=item.value;
  for(const item of doc?.media||[])if(item.source&&item.image?.asset)maps.media[stegaClean(item.source)]=urlFor(item.image).auto('format').url();
  for(const item of doc?.links||[])if(typeof item.sourceHref==='string'&&typeof item.value==='string'){
   const value=stegaClean(item.value);if(safeDestination(value))maps.links[stegaClean(item.sourceHref)]=value;
  }
 }
 return maps;
}
/** No cross-request cache: draft content must never enter a public response. */
export async function getDesignContent(context:APIContext):Promise<ContentMaps> {
 const {locale,page}=pageIdentity(context.url.pathname);
 const ids=[`marketing-v3-${locale}-shared`, `marketing-v3-${locale}-${page}`];
 try {
  const docs=await getClient(context as any).withConfig({timeout:3000,maxRetries:0}).fetch<any[]>(`*[_type == "marketingV3Page" && _id in $ids]{copy,media,links,"rank":select(pageKey=="shared"=>0,1)} | order(rank asc)`,{ids},{timeout:3000});
  return contentMaps(docs);
 } catch {
  // Keep the complete shipped design available during a CMS outage.
  console.warn('[marketing-cms] Content unavailable; using bundled page copy.');
  return contentMaps([]);
 }
}
