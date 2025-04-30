import { cookies } from 'next/headers';

type User = {
    name?: string;
    email?: string;
    picture?: string;
    provider?: string;
};

export default async function Profile() {
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

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Not authenticated</h2>
                    <p>Please sign in to view your profile.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-4">Name:  {user.name || 'User'}</h1>
            {user.picture && (
                <img
                    src={user.picture}
                    alt={`Profile picture of ${user.name || 'user'}`}
                    className="w-32 h-32 rounded-full mb-4"
                />
            )}
            <p className="mb-2">Email: {user.email || 'Unknown'}</p>
            {user.provider && (
                <p className="text-gray-500">Connected via {user.provider}</p>
            )}
        </div>
    );
}
