import { cookies } from 'next/headers';
import { unstable_noStore } from 'next/cache';
import Image from 'next/image';
import { ClientBackupCheck } from './client-components';

type User = {
    name?: string;
    email?: string;
    picture?: string;
    provider?: string;
};

export default async function Profile() {
    unstable_noStore();

    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user');

    let user: User | null = null;

    if (userCookie) {
        try {
            user = JSON.parse(userCookie.value);
        } catch {
            user = null;
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            {!user ? (
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Not authenticated</h2>
                    <p>Please sign in to view your profile.</p>
                    <p className="mt-4 text-sm">
                        <a href="/" className="text-blue-500 hover:underline">Return to sign in</a>
                    </p>
                    {/* Client component to check for backup cookie */}
                    <ClientBackupCheck />
                </div>
            ) : (
                <>
                    <h1 className="text-3xl font-bold mb-4">Name: {user.name || 'User'}</h1>
                    {user.picture && (
                        <Image
                            src={user.picture}
                            alt={`Profile picture of ${user.name || 'user'}`}
                            width={128}
                            height={128}
                            className="rounded-full mb-4"
                            unoptimized={true}
                        />
                    )}
                    <p className="mb-2">Email: {user.email || 'Unknown'}</p>
                    {user.provider && (
                        <p className="text-gray-500">Connected via {user.provider}</p>
                    )}
                </>
            )}
        </div>
    );
}
