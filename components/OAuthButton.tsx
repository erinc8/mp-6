// src/components/OAuthButton.tsx
'use client';
import React from 'react';

export function OAuthButton() {
    const handleLogin = () => {
        const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

        const params = new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID!,
            redirect_uri: process.env.REDIRECT_URI!,
            scope: 'email profile',
            response_type: 'code',
            state: crypto.randomUUID(),
            access_type: 'offline',
            prompt: 'consent',
        });

        window.location.href = `${baseUrl}?${params}`;
    };

    return (
        <button
            onClick={handleLogin}
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 w-64 text-center"
        >
            Sign in with Google
        </button>
    );
}
