import Link from "next/link";
import { ArrowUpRight, ArrowRight, MoveUpRight, ShoppingBag, Code2, Workflow, Globe2 } from "lucide-react";
import { solutions, type Solution } from "@/lib/solutions";
import styles from "./solutions.module.css";

const positions = ["Discover", "Design", "Build", "Launch"];

export function ArtifactScene({ kind, compact = false }: { kind: Solution["slug"]; compact?: boolean }) {
  // Four different artifacts tell four different product stories.
  // All graphics are HTML/CSS and accessible text, not dependent on WebGL or JS.
  const type = kind.includes("ecommerce") ? "commerce" :
    kind.includes("custom-software") ? "software" :
    kind.includes("ai-automation") ? "ai" : "website";
  return (
    <div className={styles.artifact} data-artifact={type} data-compact={compact ? "true" : undefined}>
      <div className={styles.artifactAmbient} aria-hidden="true" />
      {type === "website" && <div className={styles.artifactWindow}>
        <div className={styles.artifactBrowser}><span/><span/><span/><div>cubeit.solutions / experience</div><Globe2 size={13}/></div>
        <div className={styles.websiteNav}><strong>ATELIER<span>.</span></strong><span>STUDIO &nbsp; ABOUT &nbsp; CONTACT</span><b>LET'S TALK ↗</b></div>
        <div className={styles.websiteHero}>
          <div><small>CRAFTED TO CONNECT</small><strong>Built for a<br/><em>better first impression.</em></strong><span>Explore the experience <ArrowUpRight size={13}/></span></div>
          <div className={styles.websiteSculpture}><i/><i/><i/></div>
        </div>
        <div className={styles.websiteFooter}><span>01 / A DISTINCT POINT OF VIEW</span><span>Scroll to explore ↓</span></div>
      </div>}
      {type === "commerce" && <div className={styles.artifactCommerce}>
        <div className={styles.commerceTop}><strong>THE EDIT.</strong><span>NEW IN &nbsp;&nbsp; COLLECTIONS &nbsp;&nbsp; JOURNAL</span><ShoppingBag size={18}/></div>
        <div className={styles.commerceHeading}><small>THE LATEST EDIT / 2026</small><strong>Made to<br/><em>be discovered.</em></strong></div>
        <div className={styles.commerceProducts}>{["01","02","03"].map((n,i)=><div className={styles.commerceProduct} key={n}>
          <div className={styles.commerceProductArt} data-shape={n}><span className={styles.productSculpture}/></div>
          <div><b>FORM / {n}</b><small>{["Everyday essential","New perspective","Considered design"][i]}</small></div>
        </div>)}</div>
        <div className={styles.commerceToast}><span className={styles.toastDot}/><div><strong>Order confirmed</strong><span>From browse to buy</span></div><ArrowUpRight size={15}/></div>
      </div>}
      {type === "software" && <div className={styles.artifactSoftware}>
        <div className={styles.softwareSide}><strong>C<span>·</span></strong><span className={styles.sideActive}>◈</span><span>▦</span><span>◉</span><span>⚙</span></div>
        <div className={styles.softwareBody}>
          <div className={styles.softwareTop}><div><small>PLATFORM / OVERVIEW</small><b>Operations, in sync.</b></div><span>● LIVE SYSTEM</span></div>
          <div className={styles.softwareStats}><div><span>Projects in motion</span><strong>24</strong><small>↑ Across your workspace</small></div><div><span>Tasks completed</span><strong>89%</strong><small>↑ Connected delivery</small></div></div>
          <div className={styles.softwareChart}><div className={styles.chartTitle}><b>Activity / this month</b><span>LIVE ANALYTICS</span></div><div className={styles.chartBars}>{[42,68,53,79,62,95,73,100,86,96,80,93].map((h,i)=><span key={i} style={{height:`${h}%`}}/>)}</div></div>
          <div className={styles.softwareBottom}><div><span className={styles.systemPulse}/> All systems connected</div><span>Updated just now</span></div>
        </div>
      </div>}
      {type === "ai" && <div className={styles.artifactAi}>
        <div className={styles.aiHeader}><div><Workflow size={18}/><strong>WORKFLOW / INTELLIGENCE</strong></div><span><i/> HUMAN IN CONTROL</span></div>
        <div className={styles.aiHeadline}><small>RESPONSIBLE AUTOMATION</small><strong>From complexity<br/><em>to clarity.</em></strong></div>
        <div className={styles.aiFlow}>
          <svg className={styles.aiConnections} viewBox="0 0 600 166" preserveAspectRatio="none" aria-hidden="true">
            <path d="M76 83 C145 83 145 36 215 36 S300 83 355 83 S460 83 524 83" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 10" />
            <path data-artifact-path d="M76 83 C145 83 145 36 215 36 S300 83 355 83 S460 83 524 83" fill="none" stroke="#7bdfff" strokeWidth="3" />
          </svg>
          <div className={styles.aiNode}><span>01</span><b>INPUT</b><small>Information</small></div>
          <div className={styles.aiNode}><span>02</span><b>INTERPRET</b><small>AI model</small></div>
          <div className={styles.aiNode}><span>03</span><b>REVIEW</b><small>Human check</small></div>
          <div className={styles.aiNode}><span>04</span><b>ACT</b><small>Workflow</small></div>
        </div>
        <div className={styles.aiFooter}><span className={styles.systemPulse}/> Human oversight at every critical step <ArrowRight size={16}/></div>
      </div>}
      <div className={styles.artifactCorner} aria-hidden="true"><span>BUILT WITH INTENT</span><span>◦</span></div>
    </div>
  );
}

export function StoryRail() {
  return <section className={styles.storyRail} aria-labelledby="showcase-title" data-story-rail>
    <div className={styles.storyRailViewport} data-rail-viewport>
      <div className={styles.railTopline}><span><i/> CUBEIT / WHAT WE BUILD</span><span>SCROLL TO EXPLORE &nbsp; ↘</span></div>
      <div className={styles.storyRailHeading}>
        <span>FOUR WAYS TO MAKE A DIFFERENCE</span>
        <h2 id="showcase-title">Not just what we build.<br/><em>How it comes to life.</em></h2>
      </div>
      <div className={styles.storyRailTrack} data-rail-track>
        {solutions.map((item,i)=><article className={styles.storyRailPanel} data-rail-panel key={item.slug} data-accent={item.accent}>
          <div className={styles.railPanelInfo}>
            <span className={styles.railNumber}>0{i+1} <i/> 04</span>
            <span className={styles.railCategory}>{item.eyebrow}</span>
            <h3>{item.shortTitle}<span>.</span></h3>
            <p>{item.description}</p>
            <Link href={`/solutions/${item.slug}`} className={styles.railLink}>Explore this capability <MoveUpRight size={19}/></Link>
          </div>
          <div className={styles.railPanelArt}><ArtifactScene kind={item.slug} compact /></div>
        </article>)}
      </div>
      <div className={styles.railProgress} aria-hidden="true"><span>01</span><div className={styles.railProgressTrack}><i data-rail-progress/></div><span>04</span></div>
    </div>
  </section>;
}

export function JourneyStory({item}: {item:Solution}) {
  return <section className={styles.journeySection} data-journey aria-labelledby="journey-title">
    <div className={styles.journeyHeader}><span className={styles.journeyEyebrow}>THE WAY WE BUILD / 0{item.steps.length} STAGES</span>
      <h2 id="journey-title">Every meaningful result<br/><em>starts with a decision.</em></h2>
    </div>
    <div className={styles.journeyGrid}>
      <div className={styles.journeyVisualWrap}>
        <div className={styles.journeyVisual} data-journey-visual>
          <div className={styles.journeyCircles} aria-hidden="true"><span/><span/><span/></div>
          <div className={styles.journeyVisualTop}><span>THE PROCESS</span><span><i/> IN MOTION</span></div>
          <div className={styles.journeyCenter}><span className={styles.journeyBigNumber} data-journey-number>01</span><div className={styles.journeyPulse} aria-hidden="true"/></div>
          <div className={styles.journeyVisualBottom}><span data-journey-label>{item.steps[0].title}</span><span>0{item.steps.length} STEPS / ONE OUTCOME</span></div>
          <div className={styles.journeyProgressTrack}><span data-journey-progress/></div>
        </div>
      </div>
      <div className={styles.journeySteps}>
        {item.steps.map((step,i)=><article className={styles.journeyStep} data-journey-step data-active={i===0?"true":"false"} key={step.title}>
          <div className={styles.journeyStepMeta}><span>0{i+1} / 0{item.steps.length}</span><span>{positions[i] ?? "Deliver"}</span></div>
          <h3>{step.title}</h3><p>{step.body}</p><span className={styles.journeyStepArrow}><ArrowUpRight size={24}/></span>
        </article>)}
      </div>
    </div>
  </section>;
}
