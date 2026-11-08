#!/usr/bin/env node
/**
 * SEO regression smoke test for built Next.js site.
 * Usage: npm run build && npm run start -- -p 3897
 *        node scripts/seo-smoke.mjs http://127.0.0.1:3897
 * Requires Node 22+, no external packages, does NOT test Google indexing.
 */
import assert from "node:assert/strict";

const origin = (process.argv[2] || "http://127.0.0.1:3897").replace(/\/$/, "");
const canonicalOrigin = "https://www.cubeit.solutions";
const slugs = [
  "website-development-pakistan",
  "ecommerce-development-pakistan",
  "custom-software-development-pakistan",
  "ai-automation-development-pakistan",
];
const paths = ["/", "/services", "/solutions", ...slugs.map(x=>`/solutions/${x}`), "/contact"];
let failures=0;
const check=(condition,message)=>{
  try{assert.ok(condition,message);console.log("PASS",message);}
  catch(err){failures++;console.error("FAIL",err.message);}
};
const fetchPage=async(path)=>{
  const res=await fetch(origin+path,{redirect:"manual"});
  return {status:res.status,text:await res.text(),headers:res.headers};
};
const wait=async()=>{
  for(let i=0;i<45;i++){
    try{const response=await fetch(origin+"/robots.txt");if(response.ok)return;}
    catch{}
    await new Promise(resolve=>setTimeout(resolve,1000));
  }
  throw Error("Next.js server not ready");
};
const attr=(html)=>html.match(new RegExp(`<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)`, "i"))?.[1]
  ?? html.match(new RegExp(`<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']`, "i"))?.[1];
try{
  await wait();
  const robots=await fetchPage("/robots.txt");
  check(robots.status===200,"robots.txt returns 200");
  check(/user-agent:\s*\*/i.test(robots.text),"robots.txt contains wildcard user-agent");
  check(!/disallow:\s*\//i.test(robots.text),"robots.txt does not disallow site root");
  check(robots.text.includes(`${canonicalOrigin}/sitemap.xml`),"robots.txt lists canonical sitemap");
  const sitemap=await fetchPage("/sitemap.xml");
  check(sitemap.status===200,"sitemap.xml returns 200");
  for(const path of paths)check(sitemap.text.includes(`<loc>${canonicalOrigin}${path}</loc>`),`sitemap contains ${path}`);
  for(const path of paths){
    const r=await fetchPage(path);
    check(r.status===200,`${path} returns HTTP 200`);
    check(/<title>[^<]+<\/title>/i.test(r.text),`${path} has title`);
    check(/<meta[^>]+name=["']description["']/i.test(r.text),`${path} has meta description`);
    check(/<h1[\s>]/i.test(r.text),`${path} has server-rendered H1`);
    check(attr(r.text)===`${canonicalOrigin}${path}`,`${path} has absolute intended canonical`);
    if(path.startsWith("/solutions/")){
      check(/application\/ld\+json/i.test(r.text),`${path} has structured data`);
      check(r.text.includes("BreadcrumbList"),`${path} includes breadcrumbs schema`);
      check(r.text.includes("Service"),`${path} includes service schema`);
      check(/<a\s[^>]*href=["']\/contact["']/i.test(r.text),`${path} has working HTML contact link`);
    }
  }
  const hub=await fetchPage("/solutions");
  for(const slug of slugs)check(hub.text.includes(`/solutions/${slug}`),`hub links to ${slug}`);
  const old=await fetchPage("/services-page");
  check([307,308].includes(old.status),"/services-page redirects permanently or temporarily");
  check((old.headers.get("location")??"").endsWith("/services"),"legacy services redirect targets /services");
}catch(error){failures++;console.error("SEO smoke test error:",error);}
if(failures){console.error(`${failures} SEO smoke check(s) failed`);process.exitCode=1;}
else console.log("All SEO smoke checks passed. These checks do not measure search-engine indexing.");
