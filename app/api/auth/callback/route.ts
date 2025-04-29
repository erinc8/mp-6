import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url);
    const code = searchParams.get('code');


    if (!code) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Only Google OAuth token exchange
    const tokenEndpoint = 'https://oauth2.googleapis.com/token';
    const payload = new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.REDIRECT_URI!,
        grant_type: 'authorization_code',
    });

    const tokenRes = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload,
    });

    const tokenData = await tokenRes.json();
    const access_token = tokenData.access_token;

    if (!access_token) {
        return NextResponse.redirect(new URL('/?error=no_access_token', req.url));
    }

    // Fetch user info from Google
    const userInfoEndpoint = 'https://www.googleapis.com/oauth2/v2/userinfo';
    const userRes = await fetch(userInfoEndpoint, {
        headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: 'application/json',
        },
    });

    const user = await userRes.json();

    // Set user cookie
    const response = NextResponse.redirect(new URL('/profile', req.url));
    response.cookies.set({
        name: 'user',
        value: JSON.stringify({
            name: user.name,
            email: user.email,
            picture: user.picture,
            provider: 'google'
        }),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600,
        path: '/',
        sameSite: 'lax',
    });
    return response;
}
