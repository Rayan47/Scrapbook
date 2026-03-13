import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(request: NextRequest) {
    // 1. Get the token from cookies
    const token = request.cookies.get('auth-token')?.value;

    // 2. If no token exists, redirect to login
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        // 3. Verify the JWT token
        await jwtVerify(token, SECRET);

        // 4. Token is valid, let the request proceed
        return NextResponse.next();
    } catch (error) {
        // Token is invalid or expired, clear it and redirect
        console.log(error);
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('auth-token');
        return response;
    }
}

// 5. Specify which routes should be protected
export const config = {
    matcher: [
        /*
         * Match all request paths below /dashboard or /admin
         * You can add more protected routes to this array
         */
        '/open_book/:path*',
        '/admin/:path*',
        '/letters/:path*',
        '/api/entries/:path*',
        '/api/letters/:path*',
    ],
};