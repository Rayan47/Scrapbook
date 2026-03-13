import { SignJWT } from 'jose';
import { NextResponse } from 'next/server';

// Encode the secret for the jose library
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req: Request) {
    try {
        const { password } = await req.json();

        if (password === process.env.SITE_PASSWORD) {
            // 1. Create the JWT token
            const token = await new SignJWT({ authenticated: true })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('2h') // Token expires in 2 hours
                .sign(SECRET);

            // 2. Set the token in an HTTP-only cookie
            const response = NextResponse.json({ success: true });
            response.cookies.set('auth-token', token, {
                httpOnly: true, // Prevents JavaScript access (XSS protection)
                secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
                sameSite: 'lax',
                maxAge: 60 * 60 * 2, // 2 hours in seconds
                path: '/',
            });

            return response;
        }

        return NextResponse.json(
            { success: false, message: 'Invalid password' },
            { status: 401 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}