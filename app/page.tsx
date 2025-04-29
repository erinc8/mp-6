import { OAuthButton } from '@/components/OAuthButton';

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-8">OAuth Demo</h1>
            <div className="space-y-4">
                <OAuthButton />
            </div>
        </main>
    );
}
