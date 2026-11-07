import type { Metadata } from "next";
import { SolutionsHub } from "@/components/solutions/SolutionsPages";
export const metadata: Metadata = {
 title: "Website Development, E-commerce, Software & AI in Pakistan",
 description: "Explore CubeIT website design and development, e-commerce stores, custom software, SaaS engineering and AI automation services for businesses in Pakistan.",
 alternates: {canonical:"/solutions"},
 openGraph: {title:"Website, Software & AI Solutions in Pakistan | CubeIT",description:"Purposeful business websites, online stores, custom software and intelligent automation. Discover how CubeIT designs and builds digital solutions.",url:"/solutions",type:"website",images:[{url:"/brand/cubeit-logo.png",width:532,height:569,alt:"CubeIT brand"}]},
 twitter:{card:"summary_large_image"}
};
export default function Page() {return <SolutionsHub/>;}
