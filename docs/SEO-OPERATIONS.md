# CubeIT search visibility and Google indexing runbook

Official canonical website: https://www.cubeit.solutions/

## Technical SEO changes
- Homepage content is server-rendered and readable in the initial HTML.
- Page-specific titles, descriptions, canonical URLs, social previews and structured data.
- Real public routes and work projects appear in /sitemap.xml.
- /robots.txt permits crawling and advertises the sitemap.
- /services returns an **indexable page with its own metadata**. Previously a Next.js proxy silently rewrote /services to /services-page, inheriting noindex metadata. This is now fixed.
- Legacy /services-page is a permanent HTTP 308 redirect to /services.
- /llms.txt is optional machine-readable background material for AI crawlers. It does not guarantee inclusion in any AI answer.

## Important: discovery vs indexing vs ranking
- A 200 HTTP response, sitemap listing and meta robots=index mean a URL is eligible to be crawled. They do not prove Google has crawled or indexed it.
- Google Search Console URL Inspection is the authoritative source for that domain's Google index status; web search site: queries are incomplete diagnostics.
- Google can decline to index a technically valid page. Search engine rankings are outside the website's direct control.
- There are other organizations called CubeIT; strengthen verified brand signals rather than stuffing keywords.

## Required Search Console setup
1. Verify the domain property cubeit.solutions by adding Google's TXT verification token in the DNS host. Keep existing A and CNAME records. Check if verification has already succeeded before changing DNS.
2. In Search Console submit https://www.cubeit.solutions/sitemap.xml.
3. Run URL Inspection on https://www.cubeit.solutions/ and https://www.cubeit.solutions/services. Inspect 'Page indexing' and the Google-selected canonical. Request indexing if they are not indexed and eligible.
4. Inspect the 'Pages' report for Crawled - currently not indexed, Discovered - currently not indexed, Duplicate, blocked, 404, soft 404, and any noindex exclusions.
5. Inspect Coverage/Performance after several days; record the exact status and date and compare changes weekly.
6. Verify the canonical https://www.cubeit.solutions/ is used consistently, and check that https://cubeit.solutions/ redirects 308 to the www host.
7. Set up Bing Webmaster Tools and submit the same sitemap.
8. Publish original service and project information and seek real citations/links from client sites and professional profiles, only with permission. Don't make up locations, awards, testimonials or results.
9. Confirm the returned source HTML contains genuine content, canonical URLs and robots=index on every sitemap URL.

## Key measurement
- Branded: CubeIT, CubeIT solutions, cubeit.solutions, CubeIT AI software.
- Commercial: CubeIT custom software, CubeIT SaaS, CubeIT AI development.
- Monitor: indexed pages, impressions, click-through rate, organic queries, referring websites, conversions, and Core Web Vitals.
- Allow normal crawl and indexing time; repeat URL inspection rather than adding artificial crawl tricks.

No SEO code change can force immediate Google indexing or guarantee #1 placement.
