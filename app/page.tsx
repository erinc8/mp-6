import  OAuthButton  from '@/components/oAuthButton';


export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-8">CS391: MP-6 OAuth Demo</h1>
            <div className="space-y-4">

                <OAuthButton />
            </div>
        </main>
    );
}
