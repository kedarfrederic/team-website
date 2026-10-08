import {defineType,defineField} from 'sanity';
export const marketingV3Page=defineType({
 name:'marketingV3Page', title:'Website page · new design', type:'document',
 fields:[
  defineField({name:'pageKey',title:'Page',type:'string',readOnly:true,validation:r=>r.required()}),
  defineField({name:'locale',title:'Language',type:'string',readOnly:true,options:{list:[{title:'English',value:'en'},{title:'한국어',value:'ko'}]},validation:r=>r.required()}),
  defineField({name:'copy',title:'Page text',description:'Edit the text shown in the new design. English and Korean are independently published. Original text identifies the location; it is not shown instead of your edit.',type:'array',of:[{type:'object',name:'copyItem',fields:[
   {name:'sourceText',title:'Original design text',type:'text',readOnly:true,rows:2},
   {name:'value',title:'Text to display',type:'text',rows:3},
  ],preview:{select:{title:'sourceText',subtitle:'value'}}}]}),
  defineField({name:'media',title:'Images',description:'Replace a design image with an uploaded image. Layout and animation are preserved.',type:'array',of:[{type:'object',name:'mediaItem',fields:[
   {name:'source',title:'Design image',type:'string',readOnly:true},
   {name:'image',title:'Replacement image',type:'image',options:{hotspot:true}},
  ],preview:{select:{title:'source',media:'image'}}}]}),
  defineField({name:'links',title:'Links',type:'array',of:[{type:'object',name:'linkItem',fields:[
   {name:'sourceHref',title:'Original destination',type:'string',readOnly:true},
   {name:'value',title:'Destination',type:'string',validation:r=>r.custom(v=>!v||typeof v==='string'&&/^(?:\/(?!\/)|https:\/\/|mailto:|tel:|#)/i.test(v)&&!/[\\\u0000-\u0020\u007f]/.test(v)||'Use a site path, https, email, phone or section link.')},
  ],preview:{select:{title:'sourceHref',subtitle:'value'}}}]}),
 ],preview:{select:{title:'pageKey',locale:'locale'},prepare:({title,locale})=>({title:title==='home'?'Homepage':title,subtitle:locale==='ko'?'한국어':'English'})},
});
