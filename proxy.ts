import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

// ─── Cache Sabiti 
const AUTH_CACHE_TAG = "supabase-auth-session" as const;

// ─── Korumalı ve Auth Rotaları 
const PROTECTED_ROUTES = ["/admin"];
const AUTH_ROUTES = ["/login"];

// ───  Route Kontrolü 
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => pathname.startsWith(route));
}

// ─── Proxy /////
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Response'u klonlayarak cookie yazma iznini sağlıyoruz
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // ─── Supabase SSR Client (proxy içinde) ────────────────────────────────────
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Önce request'e yaz (downstream için)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Response'u yenile, sonra response'a da yaz
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // ─── Session Kontrolü (Next.js cache tag ile) 
  // getUser() → Supabase'e token doğrulaması gönderir,
  // Next.js bunu AUTH_CACHE_TAG altında önbelleğe alır.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Cache tag i response header a ekliyoruz (revalidasyon için)
  response.headers.set("x-cache-tag", AUTH_CACHE_TAG);

  const isAuthenticated = !!user;

  // ─── Yönlendirme Mantığı ////

  //  giriş yapılmamış kullanıcı bir sayfaya gitmeye çalışıyorsa.
  if (!isAuthenticated && matchesRoute(pathname, PROTECTED_ROUTES)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    // Giriş sonrası geri dönmek için orijinal URL'yi saklıyoruz
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // giriş yapmış kullanıcı login sayfasına girmeye çalışırsa admin sayfasına
  if (isAuthenticated && matchesRoute(pathname, AUTH_ROUTES)) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    // Eğer redirectTo varsa oraya gönder, yoksa admin
    const redirectTo = request.nextUrl.searchParams.get("redirectTo");
    adminUrl.pathname = redirectTo ?? "/admin";
    return NextResponse.redirect(adminUrl);
  }

  return response;
}


export const config = {
  matcher: [
    /*
     * Aşağıdakileri ATLA:
     * - _next/static  (statik dosyalar)
     * - _next/image   (resim optimizasyonu)
     * - favicon.ico
     * - api rotaları  (kendi auth endpoint'lerin)
     * Gerisinde ÇALIŞ
     */
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};