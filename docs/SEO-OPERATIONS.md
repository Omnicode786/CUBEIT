# CubeIT search visibility playbook

Canonical site: https://www.cubeit.solutions/

## What is implemented
- Server-rendered homepage content instead of a JavaScript-only loading shell.
- Consistent brand identity and canonical URL metadata on each public page.
- Page-specific titles, descriptions, social previews, and structured data.
- A Next.js /robots.txt and /sitemap.xml containing the real public pages and projects.
- /llms.txt as an optional human-readable AI crawler reference. No claim that it directly boosts rankings.
- The /services-page legacy path has a noindex directive and points to /services as canonical.
- Organization/WebSite entities and CreativeWork + BreadcrumbList markup for project pages.

## Owner-only setup (requires search engine account ownership)
1. Verify the domain property for cubeit.solutions in Google Search Console. Add the DNS TXT record provided by Google at the DNS host. Domain properties automatically cover www and apex.
2. Submit https://www.cubeit.solutions/sitemap.xml in Search Console.
3. Use URL Inspection for the homepage, services, portfolio, and a project detail; request indexing if the URLs are eligible.
4. Set up Bing Webmaster Tools and submit the same sitemap.
5. Inspect Pages (Indexing), Performance (Queries/Pages), and Core Web Vitals weekly.
6. Monitor branded queries (CubeIT, CubeIT solutions, CubeIT software), service-intent queries, clicks, impressions, CTR, and indexing trends.
7. Ensure the apex domain redirects with HTTP 301/308 to https://www.cubeit.solutions (and not the reverse). Configure the Vercel domain setting accordingly if needed.
8. Publish original, factually verifiable case studies, client testimonials only with permission, and real organization contact information when available. Do not invent offices, credentials, ratings or results.
9. Test social previews (Open Graph), structured data, sitemap, and initial server HTML after each significant change.

Search results and AI answer citations are controlled by search platforms, not this repository. No guaranteed first position or immediate indexing.
