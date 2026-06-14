import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// These come from your Supabase project (Settings → API).
// Put them in a .env file (see .env.example). If they are missing,
// the app still runs – it just falls back to saving the profile
// locally in the browser instead of in the cloud.
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
    ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
          auth: {
              persistSession: true,
              autoRefreshToken: true,
              detectSessionInUrl: true,
          },
      })
    : null;

// Shape of the per-user company profile we store.
export interface CompanyProfile {
    senderName: string;
    senderStreet: string;
    senderCity: string;
    senderEmail: string;
    senderPhone: string;
    senderTaxId: string;
    senderWebsite: string;
    senderBank: string;
    senderIban: string;
    senderBic: string;
}

export const EMPTY_PROFILE: CompanyProfile = {
    senderName: '',
    senderStreet: '',
    senderCity: '',
    senderEmail: '',
    senderPhone: '',
    senderTaxId: '',
    senderWebsite: '',
    senderBank: '',
    senderIban: '',
    senderBic: '',
};

const LOCAL_KEY = 'autoflow-company-profile';

// Local (device) fallback so "enter once" works even before login is set up.
export function loadLocalProfile(): CompanyProfile | null {
    try {
        const raw = localStorage.getItem(LOCAL_KEY);
        return raw ? { ...EMPTY_PROFILE, ...JSON.parse(raw) } : null;
    } catch {
        return null;
    }
}

export function saveLocalProfile(profile: CompanyProfile): void {
    try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(profile));
    } catch {
        /* ignore quota / privacy mode errors */
    }
}
