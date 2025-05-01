"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from 'next/image';


export default function OAuthButton() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 text-slate-700 max-w-3xl w-full p-8 rounded-2xl border border-indigo-200 shadow-md flex justify-center items-center animate-pulse">
                <span className="font-medium">Loading your profile...</span>
            </div>
        );
    }

    return session ? (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 text-slate-700 max-w-3xl w-full p-8 rounded-2xl border border-indigo-200 shadow-lg transition-all">
            <div className="text-center space-y-6 flex flex-col items-center">
                {session.user?.image && (
                    <Image
                        width={120}
                        height={120}
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="rounded-full border-4 border-white shadow-md mb-2"
                    />
                )}
                <h1 className="text-3xl font-bold text-indigo-800">
                    {session.user?.name}
                </h1>
                <p className="text-slate-500 font-medium">{session.user?.email}</p>
                <button
                    className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2"
                    onClick={() => signOut()}
                >
                    <span>Sign out</span>
                </button>
            </div>
        </div>
    ) : (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 text-slate-700 max-w-3xl w-full p-8 rounded-2xl border border-indigo-200 shadow-lg transition-all">
            <div className="text-center space-y-4 flex flex-col items-center">
                <h2 className="text-2xl font-bold text-indigo-800 mb-4">Welcome</h2>
                <p className="text-slate-600 mb-6">Sign in to access your profile</p>
                <button
                    className="px-6 py-3 bg-white hover:bg-gray-50 text-slate-800 font-medium rounded-xl border border-slate-300 shadow-md transition-colors flex items-center justify-center space-x-2"
                    onClick={() => signIn("google")}
                >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                              fill="#4285F4"/>
                    </svg>
                    <span>Sign in with Google</span>
                </button>
            </div>
        </div>
    );
}
