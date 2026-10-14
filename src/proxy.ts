import { NextResponse, type NextRequest } from "next/server";

// The public /services route must render its own page and indexable metadata.
// Redirect only the obsolete legacy URL; never rewrite /services to a
// noindex page, as that prevents search engines from indexing the service page.
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL("/services", request.url), 308);
}

export const config = {
  matcher: ["/services-page", "/services-page/"],
};
