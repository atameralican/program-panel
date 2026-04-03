// Next.js'in sunucu taraflı response ve request tipleri
import { NextResponse, type NextRequest } from "next/server";
// Middleware'e özel Supabase client oluşturucu (cookie'leri okuyup yazabilen versiyon)
import { createMiddlewareClient } from "@/lib/supabase/middleware-client";

// Bu fonksiyon her HTTP isteğinde otomatik çalışır (sayfa, API, vb.)
export async function middleware(request: NextRequest) {

  // Supabase client'ı oluştur.
  // supabase     → auth işlemleri için (getUser, signOut vb.)
  // supabaseResponse → cookie'leri güncel tutan response nesnesi,
  //                    bunu döndürmezsen session cookie'leri kaybolur!
  const { supabase, supabaseResponse } = await createMiddlewareClient(request);

  // Supabase'e istek atarak JWT token'ı doğrular.
  // Token geçerliyse user nesnesi gelir, süresi dolmuşsa veya yoksa null gelir.
  // NOT: getSession() değil getUser() kullanıyoruz — getUser() token'ı
  // Supabase sunucusunda doğrular, daha güvenlidir.
  const { data: { user } } = await supabase.auth.getUser();

  // Gelen isteğin URL yolunu al (örn: "/admin", "/login", "/api/modules")
  const { pathname } = request.nextUrl;

  // Kullanıcı login sayfasına mı gidiyor?
  const isLoginPage = pathname === "/login";
  // Kullanıcı bir API endpoint'ine mi istek atıyor?
  const isApiRoute = pathname.startsWith("/api/");

  // ─── Kullanıcı giriş yapmamışsa ──────────────────────────────
  if (!user) {

    if (isApiRoute) {
      // API isteği geldi ama oturum yok → 401 JSON dön.
      // Frontend bunu catch edip login'e yönlendirebilir.
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!isLoginPage) {
      // Sayfa isteği geldi, login sayfası değil, oturum da yok.
      // Kullanıcıyı login sayfasına yönlendir.
      const url = request.nextUrl.clone(); // mevcut URL'yi kopyala
      url.pathname = "/login";             // hedefi /login yap
      return NextResponse.redirect(url);
    }
  }
  // ─────────────────────────────────────────────────────────────

  // ─── Kullanıcı giriş yapmışsa ────────────────────────────────
  if (user && isLoginPage) {
    // Zaten oturumu açık biri /login'e gitmeye çalışıyor.
    // Direkt admin paneline yönlendir, login sayfasını gösterme.
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }
  // ─────────────────────────────────────────────────────────────

  // Her şey normaldeyse isteği olduğu gibi devam ettir.
  // supabaseResponse'u döndürmek ZORUNLU — aksi halde Supabase
  // session cookie'lerini tarayıcıya yazamaz ve oturum kaybolur.
  return supabaseResponse;
}

// Middleware'in hangi rotalarda çalışacağını belirler.
export const config = {
  matcher: [
    // Şunları ATLA (middleware çalışmasın):
    //   _next/static  → JS/CSS gibi statik dosyalar
    //   _next/image   → Next.js resim optimizasyonu
    //   favicon.ico   → tarayıcı ikonu
    //   *.svg/png/jpg/jpeg/gif/webp → medya dosyaları
    // Geri kalan HER rotada çalış (/admin, /login, /api/... vb.)
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};