import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Not authorized, no token' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (pathname.startsWith('/api/admin') && decoded.role !== 'admin') {
        return new NextResponse(
            JSON.stringify({ success: false, message: 'Not authorized for this role' }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        );
    }

    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-user-id', decoded.id)
    requestHeaders.set('x-user-role', decoded.role)

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        }
    })
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Not authorized, token failed' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    );
  }
}

export const config = {
  matcher: ['/api/admin/:path*', '/api/cart/:path*', '/api/checkout/:path*'],
};
