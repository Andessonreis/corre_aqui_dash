import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Configurações globais do middleware
 */
const CONFIG = {
  PUBLIC_ROUTES: new Set(["/signin", "/signup"]),
  PROTECTED_PREFIXES: ["/dashboard", "/profile", "/settings"], 
};

/**
 * Verifica se a rota é pública
 */
const isPublicRoute = (pathname: string): boolean => CONFIG.PUBLIC_ROUTES.has(pathname);

/**
 * Verifica se a rota é protegida (prefix-based)
 */
const isProtectedRoute = (pathname: string): boolean => CONFIG.PROTECTED_PREFIXES.some(route => pathname.startsWith(route));

/**
 * Middleware para proteção de rotas e controle de autenticação
 */
export async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const token = cookies.get("sb-access-token")?.value?.trim();

  const isAuthenticated = Boolean(token); 
  const pathname = nextUrl.pathname;

  // Se a rota for pública, não há necessidade de verificar a autenticação
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Redirecionamento da home se não autenticado
  if (pathname === "/" && !isAuthenticated) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // Bloqueia acesso a rotas protegidas se não autenticado
  if (!isAuthenticated && isProtectedRoute(pathname)) {
    console.info(`[Middleware] Bloqueando acesso não autorizado a ${pathname}`);
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // Permite acesso normalmente
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // Ignora arquivos estáticos e APIs
};
