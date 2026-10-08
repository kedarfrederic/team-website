/** Dry-run by default. Creates only new namespace documents; never overwrites editorial content or existing edits. */
import {createClient} from '@sanity/client';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {translateCopy} from '../src/studio-nine/lib/i18n/translate';
const inventory=JSON.parse(readFileSync(new URL('./content/studio-nine-inventory.json',import.meta.url),'utf8'));
const key=(value:string)=>createHash('sha256').update(value).digest('hex').slice(0,16);
const shared={pageKey:'shared',copy:inventory[0].copy.filter((v:string)=>inventory.every((p:any)=>p.copy.includes(v))),media:inventory[0].media.filter((v:string)=>inventory.every((p:any)=>p.media.includes(v))),links:inventory[0].links.filter((v:string)=>inventory.every((p:any)=>p.links.includes(v)))};
const split=[shared,...inventory.map((p:any)=>({...p,copy:p.copy.filter((v:string)=>!shared.copy.includes(v)),media:p.media.filter((v:string)=>!shared.media.includes(v)),links:p.links.filter((v:string)=>!shared.links.includes(v))}))];
const documents=split.flatMap((page:any)=>['en','ko'].map(locale=>({
 _id:`marketing-v3-${locale}-${page.pageKey}`,_type:'marketingV3Page',pageKey:page.pageKey,locale,
 copy:page.copy.map((sourceText:string)=>({_type:'copyItem',_key:key(sourceText),sourceText,value:locale==='ko'?translateCopy(sourceText):sourceText})),
 media:page.media.map((source:string)=>({_type:'mediaItem',_key:key(source),source})),
 links:page.links.map((sourceHref:string)=>({_type:'linkItem',_key:key(sourceHref),sourceHref,value:sourceHref})),
})));
for(const pageKey of ['insights','changelog'])documents.push({_id:`marketing-v3-en-${pageKey}`,_type:'marketingV3Page',pageKey,locale:'en',copy:[],media:[],links:[]});
console.log(JSON.stringify({project:'g1olb5am',dataset:'production',mode:process.argv.includes('--apply')?'create-if-missing':'dry-run',documents:documents.length,copyFields:documents.reduce((n:number,d:any)=>n+d.copy.length,0)}));
if(process.argv.includes('--apply')){
 const token=process.env.SANITY_WRITE_TOKEN||process.env.SANITY_AUTH_TOKEN;
 if(!token)throw new Error('A Sanity write token is required.');
 const client=createClient({projectId:'g1olb5am',dataset:'production',apiVersion:'2024-12-01',useCdn:false,token});
 const transaction=client.transaction();for(const document of documents)transaction.createIfNotExists(document);
 await transaction.commit();
 if(process.argv.includes('--add-missing-media')){
  const current=await client.fetch<any[]>('*[_type=="marketingV3Page" && _id in $ids]{_id,_rev,media}',{ids:documents.map((d:any)=>d._id)});
  let added=0;
  for(const doc of current){
   const expected=documents.find((d:any)=>d._id===doc._id)!;
   const missing=expected.media.filter((m:any)=>!doc.media?.some((old:any)=>old.source===m.source));
   if(missing.length){await client.patch(doc._id).ifRevisionId(doc._rev).setIfMissing({media:[]}).insert('after','media[-1]',missing).commit();added+=missing.length;}
  }
  console.log(`Added ${added} missing design image slots without replacing existing images or copy.`);
 }
 const saved=await client.fetch<string[]>('*[_type=="marketingV3Page" && _id in $ids]._id',{ids:documents.map((d:any)=>d._id)});
 if(saved.length!==documents.length)throw new Error('Readback did not find every new page document.');
 console.log(`Verified ${saved.length} localized page documents in your Sanity project.`);
}
