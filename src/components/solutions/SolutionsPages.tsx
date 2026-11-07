import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, ChevronRight, MoveUpRight } from "lucide-react";
import { Footer, Navbar } from "@/components/cubeit-site";
import { Solution, solutions } from "@/lib/solutions";
import { SolutionReveal } from "./solution-reveal";
import styles from "./solutions.module.css";
import { ArtifactScene, StoryRail, JourneyStory } from "./ImmersiveStories";

function Kicker({ children }: { children: React.ReactNode }) { return <span data-motion-kicker className={styles.kicker}><span className={styles.kickerDot} />{children}</span>; }
function Action({ href, children, secondary = false }: { href: string; children: React.ReactNode; secondary?: boolean }) {
 return <Link data-motion-action className={secondary ? styles.secondaryAction : styles.primaryAction} href={href}>{children}<ArrowUpRight size={18} aria-hidden="true" /></Link>;
}
function GridBackdrop() {return <div data-motion-depth className={styles.gridBackdrop} aria-hidden="true"><div className={styles.orbOne}/><div className={styles.orbTwo}/></div>;}
const digits = (index: number) => String(index + 1).padStart(2, "0");
function SolutionCard({item,index}:{item: Solution; index:number}) {
 return <Link data-motion-item href={`/solutions/${item.slug}`} className={styles.solutionCard} data-accent={item.accent}>
   <div className={styles.cardHeader}><span>{digits(index)} / 04</span><MoveUpRight aria-hidden="true" size={22}/></div>
   <div className={styles.cardArt} aria-hidden="true"><ArtifactScene kind={item.slug} compact /></div>
   <span className={styles.cardKicker}>{item.eyebrow}</span><h3>{item.shortTitle}</h3><p>{item.description}</p>
   <span className={styles.cardFooter}>Explore capability <ArrowUpRight aria-hidden="true" size={18}/></span>
 </Link>;
}
function ConnectStrip() {
 return <section data-motion-feature className={styles.contactStrip}><div><Kicker>THE NEXT STEP</Kicker><h2>Tell us the problem.<br/><em>We’ll shape the system.</em></h2><p>Bring your brief, your ideas, or just the problem you want solved. We’ll work out the right first conversation.</p></div><Action href="/contact">Start a project</Action></section>;
}
export function SolutionsHub() {
 return <div className={styles.page}><Navbar/><SolutionReveal/><main id="main-content">
  <section data-motion-hero className={styles.hero} aria-labelledby="solutions-heading"><GridBackdrop/><div className={styles.heroContent}>
   <Kicker>DESIGNED FOR BUSINESS. BUILT FOR WHAT'S NEXT.</Kicker>
   <h1 id="solutions-heading">The right digital<br/><span>system changes</span><br/>everything<span className={styles.period}>.</span></h1>
   <p>Websites, online stores, custom software and applied AI. CubeIT creates thoughtful digital experiences for businesses in Pakistan and beyond—designed to be useful, distinctive and built to grow.</p>
   <div className={styles.heroActions}><Action href="#explore">Explore solutions</Action><Action href="/contact" secondary>Talk to CubeIT</Action></div>
  </div><div data-motion-index className={styles.heroIndex} aria-hidden="true">01 / DISCOVER <ArrowDownRight size={19}/></div></section>
  <section id="explore" data-motion-section className={styles.contentSection}><div className={styles.sectionHeading}><div><Kicker>WHAT CAN WE BUILD?</Kicker><h2>Different challenges.<br/><span>One engineering mindset.</span></h2></div><p>Choose the problem that looks most like yours. Each capability has its own approach, requirements and decisions worth getting right.</p></div>
   <div data-motion-group className={styles.cardsGrid}>{solutions.map((item,index)=><SolutionCard key={item.slug} item={item} index={index}/>)}</div>
  </section>
  <StoryRail/>
  <section data-motion-feature className={styles.editorialBand}><div className={styles.bandLine}><span>THINK CLEARLY</span><span>DESIGN INTENTIONALLY</span><span>ENGINEER FOR REAL USE</span></div><h2>Not a template to fit your business.<br/><span>A system shaped around it.</span></h2><p>We connect product thinking, interaction design, engineering and ongoing improvement. Whether you need your first business website or a complex internal platform, we begin with what people actually need to do.</p><Action href="/our-work" secondary>Explore our work</Action></section>
  <section data-motion-section className={styles.contentSection}><div className={styles.sectionHeading}><div><Kicker>HOW WE WORK</Kicker><h2>A clear path<br/><span>from idea to launch.</span></h2></div></div><div data-motion-group className={styles.methodGrid}>{[{title:"Discover",body:"Identify users, business objectives, constraints and the problem worth solving."},{title:"Design",body:"Shape the structure, content and interactions before complexity creeps in."},{title:"Build",body:"Engineer the experience with testing, useful feedback and sensible milestones."},{title:"Improve",body:"Launch, measure and refine the product as real needs become clearer."}].map((item,index)=><article data-motion-item key={item.title}><span>{digits(index)}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></section>
  <ConnectStrip/>
 </main><Footer/></div>;
}
export function SolutionDetail({item}: {item:Solution}) {
 const other=solutions.filter(x=>x.slug!==item.slug);
 return <div className={styles.page}><Navbar/><SolutionReveal/><main id="main-content">
  <section data-motion-hero className={styles.detailHero} data-accent={item.accent}><GridBackdrop/><div className={styles.detailHeroCopy}>
   <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight size={14}/><Link href="/solutions">Solutions</Link><ChevronRight size={14}/><span>{item.shortTitle}</span></nav>
   <Kicker>{item.eyebrow}</Kicker><h1>{item.title}<span className={styles.period}>.</span></h1><p>{item.intro}</p>
   <div className={styles.heroActions}><Action href="/contact">Discuss your project</Action><Action href="#scope" secondary>What's included</Action></div>
  </div><div data-motion-art className={styles.detailArt} aria-hidden="true"><ArtifactScene kind={item.slug}/></div></section>
  <section id="scope" data-motion-section className={styles.contentSection}><div className={styles.sectionHeading}><div><Kicker>BUILD WHAT MATTERS</Kicker><h2>Purpose-led.<br/><span>Beautifully executed.</span></h2></div><p>{item.audience}</p></div>
   <div className={styles.deliverables}><div className={styles.deliverableIntro}><span>THE ENGAGEMENT</span><h3>What we can help you build</h3><p>Exact features, integrations and support terms are defined together during scoping.</p></div><ul data-motion-group>{item.deliverables.map((d,i)=><li data-motion-item key={d}><span>{digits(i)}</span>{d}<ArrowUpRight size={17} aria-hidden="true"/></li>)}</ul></div>
  </section>
  <JourneyStory item={item}/>
  <section data-motion-section className={styles.contentSection}><div className={styles.sectionHeading}><div><Kicker>THE QUESTIONS THAT MATTER</Kicker><h2>Before you<br/><span>get started.</span></h2></div><p>Specific answers to common questions from businesses planning a digital project in Pakistan.</p></div><div data-motion-group className={styles.faqList}>{item.questions.map((faq,index)=><details data-motion-item key={faq.question}><summary><span>{digits(index)}</span><strong>{faq.question}</strong><span className={styles.faqPlus} aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div></section>
  <section data-motion-feature className={styles.outcomeSection}><Kicker>THE GOAL</Kicker><h2>{item.outcome}</h2><Action href="/contact">Let's talk about yours</Action></section>
  <section data-motion-section className={styles.contentSection}><div className={styles.sectionHeading}><div><Kicker>EXPLORE FURTHER</Kicker><h2>More ways<br/><span>to build better.</span></h2></div><Link href="/solutions" className={styles.textLink}>All solutions <ArrowUpRight size={18}/></Link></div><div data-motion-group className={styles.relatedGrid}>{other.map((solution)=><Link data-motion-item href={`/solutions/${solution.slug}`} key={solution.slug}><span>{solution.eyebrow}</span><h3>{solution.shortTitle}</h3><ArrowUpRight size={24}/></Link>)}</div></section>
  <ConnectStrip/>
 </main><Footer/></div>;
}
