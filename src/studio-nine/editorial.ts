import {getClient,isPreviewRequest} from '../lib/sanity';
import snapshot from './content/cms/published-snapshot.json';
import {getInsightPosts,getInsightPostBySlug,getChangelogEntries} from '../lib/queries';
/** Published snapshot is an outage fallback, never a substitute for missing drafts. */
async function read(context:any,query:(client:any)=>Promise<any>,fallback:any){
 try{return await query(getClient(context).withConfig({timeout:3000,maxRetries:0}));}
 catch(error){
  if(isPreviewRequest(context))throw error;
  console.warn('[editorial-cms] Using published snapshot during CMS outage.');
  return fallback;
 }
}
export const readPosts=(context:any)=>read(context,getInsightPosts,snapshot.posts.filter(p=>p.hiddenFromIndex!==true));
export const readPost=(context:any,slug:string)=>read(context,c=>getInsightPostBySlug(slug,c),snapshot.posts.find(p=>p.slug.current===slug));
export const readChangelog=(context:any)=>read(context,getChangelogEntries,snapshot.changelog);
