import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(405).end();
        return;
    }

    const { code } = req.query;
    if (!code || typeof code !== 'string') {
        res.redirect('/');
        return;
    }


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
        res.redirect('/?error=no_access_token');
        return;
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

    // Set the cookie (httpOnly, secure, SameSite=None)
    const userData = JSON.stringify({
        name: user.name,
        email: user.email,
        picture: user.picture,
        provider: 'google'
    });

    res.setHeader('Set-Cookie', [
        serialize('user', userData, {
            httpOnly: true,
            secure: true,
            maxAge: 3600,
            path: '/',
            sameSite: 'none',
        }),
        // Optional: backup cookie for client-side fallback
        serialize('user_backup', encodeURIComponent(userData), {
            httpOnly: false,
            secure: true,
            maxAge: 3600,
            path: '/',
            sameSite: 'none',
        }),
    ]);

    // Redirect to profile page
    res.redirect('/profile');
}
