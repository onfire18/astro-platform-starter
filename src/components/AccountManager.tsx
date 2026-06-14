import { useState, useEffect } from 'react';
import { useAuth } from '../lib/useAuth';
import { loadProfile, saveProfile } from '../lib/profile';
import { EMPTY_PROFILE, type CompanyProfile } from '../lib/supabase';

const FIELDS: { key: keyof CompanyProfile; label: string; placeholder: string; optional?: boolean }[] = [
    { key: 'senderName', label: 'Name / Firma', placeholder: 'Max Mustermann GmbH' },
    { key: 'senderEmail', label: 'E-Mail', placeholder: 'info@example.com' },
    { key: 'senderStreet', label: 'Straße & Hausnummer', placeholder: 'Musterstraße 1' },
    { key: 'senderCity', label: 'PLZ & Stadt', placeholder: '12345 Berlin' },
    { key: 'senderPhone', label: 'Telefon', placeholder: '+49 123 456789' },
    { key: 'senderTaxId', label: 'Steuernummer / USt-IdNr.', placeholder: 'DE123456789' },
    { key: 'senderBank', label: 'Bankname (freiwillig)', placeholder: 'Deutsche Bank', optional: true },
    { key: 'senderBic', label: 'BIC (freiwillig)', placeholder: 'DEUTDEDB', optional: true },
    { key: 'senderIban', label: 'IBAN (freiwillig)', placeholder: 'DE89 3704 0044 0532 0130 00', optional: true },
];

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
);

const inp =
    'w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition';
const lbl = 'block text-xs font-medium text-neutral-400 mb-1.5';

export default function AccountManager() {
    const { user, loading, configured, signInWithGoogle, signOut } = useAuth();
    const [profile, setProfile] = useState<CompanyProfile>(EMPTY_PROFILE);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        let active = true;
        loadProfile(user?.id ?? null).then((p) => {
            if (active && p) setProfile({ ...EMPTY_PROFILE, ...p });
        });
        return () => {
            active = false;
        };
    }, [user?.id]);

    const save = async () => {
        setSaving(true);
        setMsg('');
        const res = await saveProfile(user?.id ?? null, profile);
        setSaving(false);
        setMsg(res.ok ? (user ? '✓ In deinem Konto gespeichert' : '✓ Auf diesem Gerät gespeichert') : 'Fehler: ' + res.error);
        setTimeout(() => setMsg(''), 4000);
    };

    // ── Login not configured yet ──
    if (!configured) {
        return (
            <div className="space-y-5">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-5">
                    <h2 className="text-base font-semibold text-white mb-2">
                        🔐 Login noch nicht eingerichtet
                    </h2>
                    <p className="text-sm text-neutral-300 leading-relaxed mb-3">
                        Der Google-Login ist vorbereitet, muss aber einmalig mit deinem eigenen
                        Supabase-Projekt verbunden werden. Die genaue Schritt-für-Schritt-Anleitung
                        findest du in der Datei <code className="text-brand-300">SETUP-LOGIN.md</code> im
                        Projekt.
                    </p>
                    <p className="text-sm text-neutral-400">
                        Bis dahin kannst du dein Firmenprofil trotzdem nutzen – es wird lokal auf
                        diesem Gerät gespeichert.
                    </p>
                </div>
                <ProfileForm profile={profile} setProfile={setProfile} save={save} saving={saving} msg={msg} />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="py-16 flex justify-center">
                <span className="loading loading-spinner loading-md text-neutral-500" />
            </div>
        );
    }

    // ── Configured but logged out ──
    if (!user) {
        return (
            <div className="space-y-5">
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-2xl mx-auto mb-4">
                        🔑
                    </div>
                    <h2 className="text-lg font-semibold text-white mb-2">Anmelden</h2>
                    <p className="text-sm text-neutral-400 max-w-sm mx-auto mb-6">
                        Melde dich mit Google an, um dein Firmenprofil sicher zu speichern und auf
                        allen Geräten zu nutzen.
                    </p>
                    <button
                        onClick={signInWithGoogle}
                        className="inline-flex items-center gap-2.5 px-6 py-3 bg-white text-gray-800 font-semibold rounded-xl hover:bg-gray-100 transition"
                    >
                        <GoogleIcon />
                        Mit Google anmelden
                    </button>
                </div>
                <p className="text-xs text-neutral-600 text-center">
                    Oder ohne Anmeldung weiterarbeiten – dann wird dein Profil lokal gespeichert.
                </p>
                <ProfileForm profile={profile} setProfile={setProfile} save={save} saving={saving} msg={msg} />
            </div>
        );
    }

    // ── Logged in ──
    return (
        <div className="space-y-5">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-600/30 border border-brand-500/30 flex items-center justify-center text-brand-300 font-semibold">
                        {(user.email ?? '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="text-sm font-medium text-white">{user.email}</div>
                        <div className="text-xs text-green-400">● Angemeldet via Google</div>
                    </div>
                </div>
                <button
                    onClick={signOut}
                    className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition"
                >
                    Abmelden
                </button>
            </div>
            <ProfileForm profile={profile} setProfile={setProfile} save={save} saving={saving} msg={msg} />
        </div>
    );
}

function ProfileForm({
    profile,
    setProfile,
    save,
    saving,
    msg,
}: {
    profile: CompanyProfile;
    setProfile: (p: CompanyProfile) => void;
    save: () => void;
    saving: boolean;
    msg: string;
}) {
    return (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-5">
            <div>
                <h2 className="text-base font-semibold text-white">Firmenprofil</h2>
                <p className="text-sm text-neutral-400 mt-1">
                    Einmal ausfüllen – wird automatisch in jede neue Rechnung übernommen.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FIELDS.map((f) => (
                    <div key={f.key} className={f.key === 'senderIban' ? 'sm:col-span-2' : ''}>
                        <label className={lbl}>{f.label}</label>
                        <input
                            type="text"
                            className={inp}
                            placeholder={f.placeholder}
                            value={profile[f.key]}
                            onChange={(e) => setProfile({ ...profile, [f.key]: e.target.value })}
                        />
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
                <button
                    onClick={save}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50"
                >
                    {saving ? <span className="loading loading-spinner loading-xs" /> : null}
                    Profil speichern
                </button>
                {msg && <span className="text-xs text-neutral-300">{msg}</span>}
            </div>
        </div>
    );
}
