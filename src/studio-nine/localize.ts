import {parse,serialize} from 'parse5';
import {stegaClean} from '@sanity/client/stega';
import {hasTranslation,localizedLink,canonicalLocalePath,type Locale} from './lib/i18n/routes';
import {translateCopy,normalizeCopy} from './lib/i18n/translate';
export function renderDesignHtml(html:string,locale:Locale,copyOverrides:Record<string,string>={},mediaOverrides:Record<string,string>={},linkOverrides:Record<string,string>={}){
 const textCopy=(text:string)=>{const value=copyOverrides[normalizeCopy(text)];return value===undefined?(locale==='ko'?translateCopy(text):text):(text.match(/^\s*/)?.[0]||'')+value+(text.match(/\s*$/)?.[0]||'');};
 const root:any=parse(html);
 const attr=(node:any,name:string)=>node.attrs?.find((a:any)=>a.name===name);
 const jsonCopy=(value:any,key='',ownerType=''):any=>{
  if(typeof value==='string'){
   if(mediaOverrides[value])return mediaOverrides[value];
   if(linkOverrides[value])return localizedLink(linkOverrides[value],locale);
   if(key==='inLanguage')return locale==='ko'?'ko-KR':'en';
   if(key.startsWith('@')||['applicationCategory','operatingSystem','priceCurrency','category'].includes(key))return value;
   if(locale==='ko'&&key==='url'&&ownerType!=='Organization'&&value.startsWith('https://teamrollouts.com')){
    const url=new URL(value);if(!url.hash&&hasTranslation(url.pathname)){url.pathname=canonicalLocalePath(url.pathname,'ko');return url.href;}
   }
   return textCopy(value);
  }
  if(Array.isArray(value))return value.map(v=>jsonCopy(v));
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,jsonCopy(v,k,value['@type'])]));
  return value;
 };
 const headingFragments:Record<string,Record<string,string>>={
  'Ask it anything about the release.':{'Ask it anything':'이 릴리스에 대해','about the':'','release.':'무엇이든 물어보세요.'},
  'Make the record. Team runs the release.':{'Team runs the':'Team과 함께','release.':'릴리스를 운영하세요.'},
  'Part of the same release.':{'Part of the same':'함께 연결되는','release.':'릴리스의 모든 것.'},
 };
 const textLeaves=(node:any):any[]=>node.nodeName==='#text'?[node]:(node.childNodes||[]).flatMap(textLeaves);
 const walk=(node:any)=>{
  if(locale==='ko'&&/^h[1-6]$/.test(node.nodeName)){
   const leaves=textLeaves(node);const key=leaves.map(n=>n.value.trim()).filter(Boolean).join(' ');const fragments=headingFragments[key];
   if(fragments)for(const leaf of leaves){const k=leaf.value.trim();if(k in fragments && (copyOverrides[normalizeCopy(k)]===undefined||stegaClean(copyOverrides[normalizeCopy(k)])===translateCopy(k)))leaf.value=fragments[k];}
  }
  if(node.nodeName==='#text'&&!['script','style'].includes(node.parentNode?.nodeName))node.value=textCopy(node.value);
  for(const a of node.attrs||[]){
   if(a.name==='href'&&node.nodeName==='a'&&!attr(node,'data-locale-choice'))a.value=localizedLink(linkOverrides[a.value]||a.value,locale);
   if(a.name==='src'&&node.nodeName==='img'&&mediaOverrides[a.value])a.value=mediaOverrides[a.value];
   if(node.nodeName==='meta'&&a.name==='content'&&['og:image','twitter:image'].includes(attr(node,'property')?.value||attr(node,'name')?.value)){const source=a.value.replace('https://teamrollouts.com','');if(mediaOverrides[source])a.value=mediaOverrides[source];}
   if((['alt','title','aria-label','placeholder','data-per-year','data-per-month','data-suffix'].includes(a.name)||node.nodeName==='meta'&&a.name==='content'&&['description','og:title','og:description','og:image:alt','twitter:title','twitter:description'].includes(attr(node,'name')?.value||attr(node,'property')?.value)))a.value=textCopy(a.value);
  }
  if(node.nodeName==='script'&&['application/json','application/ld+json'].includes(attr(node,'type')?.value)&&node.childNodes?.[0]){
   node.childNodes[0].value=JSON.stringify(jsonCopy(JSON.parse(node.childNodes[0].value))).replace(/</g,'\\u003c');
  }
  if(locale==='ko'&&node.nodeName==='a'){
   const href=attr(node,'href')?.value;
   if(href?.startsWith('/')&&!href.startsWith('//')&&!hasTranslation(new URL(href,'https://teamrollouts.com').pathname)&&!href.startsWith('/ko/')&&!href.startsWith('/img/')&&!href.startsWith('/logo/')){
    node.attrs.push({name:'hreflang',value:'en'});
    node.childNodes.push({nodeName:'#text',value:' (영어)',parentNode:node});
   }
  }
  for(const child of node.childNodes||[])walk(child);
  if(node.content)walk(node.content);
 };
 walk(root);
 const cleanMetadata=(node:any)=>{if(node.nodeName==='title')for(const t of node.childNodes||[])if(t.nodeName==='#text')t.value=stegaClean(t.value);if(node.nodeName==='meta')for(const a of node.attrs||[])if(a.name==='content')a.value=stegaClean(a.value);for(const child of node.childNodes||[])cleanMetadata(child);};cleanMetadata(root);
 return serialize(root);
}
