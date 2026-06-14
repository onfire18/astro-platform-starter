import { useAuth } from '../lib/useAuth';

const GoogleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24">
        <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
        />
        <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
        />
        <path
            fill="#FBBC05"
            d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
        />
        <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
        />
    </svg>
);

export default function AuthWidget() {
    const { user, loading, configured, signInWithGoogle, signOut } = useAuth();

    // If Supabase isn't set up yet, don't show a broken login button.
    if (!configured) {
        return (
            <a
                href="/account"
                className="no-underline px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-500 hover:text-white hover:bg-white/5 transition"
                title="Login einrichten"
            >
                Konto
            </a>
        );
    }

    if (loading) {
        return <span className="loading loading-spinner loading-xs text-neutral-500" />;
    }

    if (user) {
        const initial = (user.email ?? '?').charAt(0).toUpperCase();
        return (
            <div className="flex items-center gap-2">
                <a href="/account" className="no-underline flex items-center gap-2 group">
                    <div className="w-7 h-7 rounded-full bg-brand-600/30 border border-brand-500/30 flex items-center justify-center text-brand-300 text-xs font-semibold">
                        {initial}
                    </div>
                    <span className="hidden sm:inline text-xs text-neutral-400 group-hover:text-white max-w-[140px] truncate">
                        {user.email}
                    </span>
                </a>
                <button
                    onClick={signOut}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-500 hover:text-white hover:bg-white/5 transition"
                >
                    Abmelden
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={signInWithGoogle}
            className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-800 text-xs font-semibold rounded-lg hover:bg-gray-100 transition"
        >
            <GoogleIcon />
            <span className="hidden sm:inline">Mit Google anmelden</span>
            <span className="sm:hidden">Anmelden</span>
        </button>
    );
}
