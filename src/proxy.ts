import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/app')) {
    // Lightweight cookie check — full validation happens in the server component
    const sessionCookie =
      request.cookies.get('kitabu.session_token') ??
      request.cookies.get('__Secure-kitabu.session_token')

    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*'],
}
