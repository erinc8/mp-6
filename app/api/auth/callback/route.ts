import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Exchange code for tokens
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

    // Create the user data
    const userData = JSON.stringify({
        name: user.name,
        email: user.email,
        picture: user.picture,
        provider: 'google'
    });

    // Set user cookie and return HTML for client-side redirect
    const html = `
      <html>
        <head>
          <meta http-equiv="refresh" content="0; url=/profile" />
          <script>
            // Set a client-side cookie as backup (less secure but helps with cookie issues)
            document.cookie = "user_backup=${encodeURIComponent(userData)}; path=/; max-age=3600";
            window.location.href = "/profile";
          </script>
        </head>
        <body>Redirecting...</body>
      </html>
    `;

    // Create response with proper headers
    const response = new NextResponse(html, {
        status: 200,
        headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-store',
        }
    });


    response.cookies.set({
        name: 'user',
        value: userData,
        httpOnly: true,
        secure: true,
        maxAge: 3600,
        path: '/',
        sameSite: 'none',
    });

    return response;
}
