'use client';

import { useEffect, useState } from 'react';

type User = {
    name?: string;
    email?: string;
    picture?: string;
    provider?: string;
};

export function ClientBackupCheck() {
    const [userData, setUserData] = useState<User | null>(null);

    useEffect(() => {
        try {
            const backupCookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('user_backup='));

            if (backupCookie) {
                const parsedData = JSON.parse(decodeURIComponent(backupCookie.split('=')[1]));
                setUserData(parsedData);
            }
        } catch (e) {
            console.error("Error parsing backup cookie:", e);
        }
    }, []);

    if (!userData) return null;

    return (
        <div className="mt-8 p-6 border rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Backup Cookie Data:</h3>
            <p className="mb-2">Name: {userData.name || 'Unknown'}</p>
            <p className="mb-2">Email: {userData.email || 'Unknown'}</p>
            {userData.provider && (
                <p className="text-gray-500">Connected via {userData.provider}</p>
            )}
        </div>
    );
}
