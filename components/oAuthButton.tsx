"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function OAuthButton() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="bg-amber-200 text-black max-w-3xl w-full p-6 rounded-xl border-2 flex justify-center items-center">
                <span>Loading...</span>
            </div>
        );
    }

    return session ? (
        <div className="bg-amber-200 text-black max-w-3xl w-full space-y-8 p-6 rounded-xl border-2">
            <div className="text-center space-y-2 flex flex-col items-center">
                <h1 className="text-3xl font-bold tracking-tight">
                    {session.user?.email} <br />
                    {session.user?.name}
                </h1>
                {session.user?.image && (
                    <img
                        width={100}
                        height={100}
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="rounded-full"
                    />
                )}
                <button
                    className="text-blue-950 p-2 bg-white border-2 mt-4"
                    onClick={() => signOut()}
                >
                    Sign out
                </button>
            </div>
        </div>
    ) : (
        <div className="accent-blue-200 text-black max-w-3xl w-full space-y-8 p-6 rounded-xl border-2">
            <div className="text-center space-y-2 flex flex-col items-center">
                <button
                    className="text-blue-950 p-2 bg-white border-2 mt-4"
                    onClick={() => signIn("google")}
                >
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}
