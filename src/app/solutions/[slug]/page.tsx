import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SolutionDetail } from "@/components/solutions/SolutionsPages";
import { getSolution, solutions } from "@/lib/solutions";
const origin="https://www.cubeit.solutions";
type PageProps={params:Promise<{slug:string}>};
export function generateStaticParams(){return solutions.map(item=>({slug:item.slug}));}
export async function generateMetadata({params}:PageProps):Promise<Metadata>{
 const {slug}=await params;const item=getSolution(slug);
 if(!item)return {title:"Not Found",robots:{index:false}};
 const path=`/solutions/${slug}`;
 return {title:item.title,description:item.description,alternates:{canonical:path},openGraph:{title:`${item.title} | CubeIT`,description:item.description,url:path,type:"website",images:[{url:"/brand/cubeit-logo.png",width:532,height:569,alt:"CubeIT brand"}]},twitter:{card:"summary_large_image",title:`${item.shortTitle} | CubeIT`,description:item.description}};
}
export default async function Page({params}:PageProps){
 const {slug}=await params;const item=getSolution(slug);if(!item)notFound();
 const url=`${origin}/solutions/${slug}`;
 const schema={"@context":"https://schema.org","@graph":[
  {"@type":"Service","@id":`${url}#service`,name:item.title,description:item.description,url,provider:{"@id":`${origin}/#organization`},areaServed:{"@type":"Country",name:"Pakistan"},serviceType:item.shortTitle},
  {"@type":"BreadcrumbList","@id":`${url}#breadcrumbs`,itemListElement:[
   {"@type":"ListItem",position:1,name:"Home",item:origin},
   {"@type":"ListItem",position:2,name:"Solutions",item:`${origin}/solutions`},
   {"@type":"ListItem",position:3,name:item.shortTitle,item:url}
  ]}
 ]};
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/><SolutionDetail item={item}/></>;
}
