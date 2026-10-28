import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_SESSAO, lerSessao } from "@/lib/sessao-token";

export async function middleware(req: NextRequest) {
  const sessao = await lerSessao(req.cookies.get(COOKIE_SESSAO)?.value);
  const naLogin = req.nextUrl.pathname.startsWith("/login");
  // O link de convite é aberto por quem ainda não tem senha
  if (req.nextUrl.pathname.startsWith("/convite/")) return NextResponse.next();

  if (!sessao && !naLogin) return NextResponse.redirect(new URL("/login", req.url));
  if (sessao && naLogin) return NextResponse.redirect(new URL("/", req.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|icon.svg|logo.svg|favicon-48.png|icon-192.png|icon-512.png|icon-maskable-512.png|apple-touch-icon.png).*)"],
};
