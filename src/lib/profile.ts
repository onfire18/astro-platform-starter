import {
    supabase,
    type CompanyProfile,
    EMPTY_PROFILE,
    loadLocalProfile,
    saveLocalProfile,
} from './supabase';

// Loads the company profile for the signed-in user from Supabase.
// Falls back to the device-local copy when not signed in / not configured.
export async function loadProfile(userId: string | null): Promise<CompanyProfile | null> {
    if (supabase && userId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('data')
            .eq('id', userId)
            .maybeSingle();

        if (!error && data?.data) {
            return { ...EMPTY_PROFILE, ...(data.data as CompanyProfile) };
        }
        // No cloud row yet – fall through to any local copy.
    }
    return loadLocalProfile();
}

// Saves the company profile. Writes to Supabase when signed in,
// and always keeps a device-local copy as a safety net.
export async function saveProfile(
    userId: string | null,
    profile: CompanyProfile
): Promise<{ ok: boolean; error?: string }> {
    saveLocalProfile(profile);

    if (supabase && userId) {
        const { error } = await supabase
            .from('profiles')
            .upsert({ id: userId, data: profile, updated_at: new Date().toISOString() });

        if (error) return { ok: false, error: error.message };
    }
    return { ok: true };
}
