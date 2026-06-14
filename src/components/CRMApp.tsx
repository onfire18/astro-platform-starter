import { useState, useEffect } from 'react';

interface Contact {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    source: string;
    status: 'new' | 'contacted' | 'converted' | 'lost';
    notes: string;
    createdAt: string;
}

type FilterStatus = 'all' | Contact['status'];

const STATUS_CONFIG: Record<Contact['status'], { label: string; color: string }> = {
    new: { label: 'Neu', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    contacted: { label: 'Kontaktiert', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
    converted: { label: 'Gewonnen', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
    lost: { label: 'Verloren', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
};

const SOURCES = ['Instagram', 'Website', 'Empfehlung', 'Messe', 'E-Mail', 'Telefon', 'Sonstiges'];

const EMPTY_FORM: Omit<Contact, 'id' | 'createdAt'> = {
    name: '', email: '', phone: '', company: '', source: '', status: 'new', notes: '',
};

export default function CRMApp() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [unavailable, setUnavailable] = useState(false);
    const [filter, setFilter] = useState<FilterStatus>('all');
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState<'add' | Contact | null>(null);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/contacts');
            const data = await res.json();
            setContacts(data.contacts ?? []);
            setUnavailable(data.unavailable === true);
        } catch {
            setUnavailable(true);
        } finally {
            setLoading(false);
        }
    };

    const openAdd = () => {
        setForm({ ...EMPTY_FORM });
        setModal('add');
    };

    const openEdit = (c: Contact) => {
        setForm({
            name: c.name, email: c.email, phone: c.phone,
            company: c.company, source: c.source, status: c.status, notes: c.notes,
        });
        setModal(c);
    };

    const closeModal = () => setModal(null);

    const saveContact = async () => {
        if (!form.name.trim()) return;
        setSaving(true);
        try {
            if (modal === 'add') {
                const res = await fetch('/api/contacts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form),
                });
                const data = await res.json();
                setContacts((p) => [data.contact, ...p]);
            } else if (modal && typeof modal === 'object') {
                const updated = { ...modal, ...form };
                await fetch('/api/contacts', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updated),
                });
                setContacts((p) => p.map((c) => (c.id === modal.id ? updated : c)));
            }
            closeModal();
        } catch {
            alert('Fehler beim Speichern. Bitte versuche es erneut.');
        } finally {
            setSaving(false);
        }
    };

    const deleteContact = async (id: string) => {
        if (!confirm('Kontakt wirklich löschen?')) return;
        setDeleting(id);
        try {
            await fetch(`/api/contacts?id=${id}`, { method: 'DELETE' });
            setContacts((p) => p.filter((c) => c.id !== id));
        } catch {
            alert('Fehler beim Löschen.');
        } finally {
            setDeleting(null);
        }
    };

    const setStatus = async (contact: Contact, status: Contact['status']) => {
        const updated = { ...contact, status };
        try {
            await fetch('/api/contacts', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated),
            });
            setContacts((p) => p.map((c) => (c.id === contact.id ? updated : c)));
        } catch {
            alert('Status konnte nicht gespeichert werden.');
        }
    };

    const filtered = contacts.filter((c) => {
        const matchStatus = filter === 'all' || c.status === filter;
        const q = search.toLowerCase();
        const matchSearch =
            !q ||
            c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.company.toLowerCase().includes(q);
        return matchStatus && matchSearch;
    });

    const counts: Record<FilterStatus, number> = {
        all: contacts.length,
        new: contacts.filter((c) => c.status === 'new').length,
        contacted: contacts.filter((c) => c.status === 'contacted').length,
        converted: contacts.filter((c) => c.status === 'converted').length,
        lost: contacts.filter((c) => c.status === 'lost').length,
    };

    const inp =
        'w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition';
    const lbl = 'block text-xs font-medium text-neutral-400 mb-1.5';

    return (
        <div className="space-y-5">
            {unavailable && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3 text-sm text-yellow-200">
                    CRM-Speicher ist nur auf Netlify verfügbar. Daten werden lokal nicht gespeichert.
                </div>
            )}

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Kontakte suchen…"
                        className={`${inp} pl-9`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-lg transition shadow-lg shadow-brand-700/30 whitespace-nowrap"
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Kontakt hinzufügen
                </button>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1.5 flex-wrap">
                {(
                    [
                        { id: 'all', label: 'Alle' },
                        { id: 'new', label: 'Neu' },
                        { id: 'contacted', label: 'Kontaktiert' },
                        { id: 'converted', label: 'Gewonnen' },
                        { id: 'lost', label: 'Verloren' },
                    ] as { id: FilterStatus; label: string }[]
                ).map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                            filter === f.id
                                ? 'bg-brand-600 text-white'
                                : 'bg-white/5 text-neutral-400 hover:text-white border border-white/10'
                        }`}
                    >
                        {f.label}
                        <span
                            className={`px-1.5 py-0.5 rounded text-xs ${
                                filter === f.id ? 'bg-white/20' : 'bg-white/10'
                            }`}
                        >
                            {counts[f.id]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Contact list */}
            {loading ? (
                <div className="py-16 flex flex-col items-center gap-3 text-neutral-500">
                    <span className="loading loading-spinner loading-md" />
                    <span className="text-sm">Kontakte werden geladen…</span>
                </div>
            ) : filtered.length === 0 ? (
                <div className="py-16 text-center text-neutral-500">
                    <div className="text-4xl mb-3">📋</div>
                    <p className="text-sm">
                        {search || filter !== 'all'
                            ? 'Keine Kontakte gefunden.'
                            : 'Noch keine Kontakte. Füge deinen ersten hinzu!'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((c) => (
                        <div
                            key={c.id}
                            className="bg-white/[0.03] border border-white/10 rounded-xl p-4 hover:border-white/20 transition group"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3 min-w-0">
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-full bg-brand-600/20 border border-brand-500/20 flex items-center justify-center shrink-0 text-brand-300 font-semibold text-sm">
                                        {c.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-semibold text-white text-sm truncate">
                                                {c.name}
                                            </span>
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_CONFIG[c.status].color}`}
                                            >
                                                {STATUS_CONFIG[c.status].label}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                                            {c.company && (
                                                <span className="text-xs text-neutral-400 truncate">
                                                    🏢 {c.company}
                                                </span>
                                            )}
                                            {c.email && (
                                                <span className="text-xs text-neutral-400 truncate">
                                                    ✉️ {c.email}
                                                </span>
                                            )}
                                            {c.phone && (
                                                <span className="text-xs text-neutral-400">
                                                    📞 {c.phone}
                                                </span>
                                            )}
                                            {c.source && (
                                                <span className="text-xs text-neutral-500">
                                                    via {c.source}
                                                </span>
                                            )}
                                        </div>
                                        {c.notes && (
                                            <p className="text-xs text-neutral-500 mt-1.5 line-clamp-2">
                                                {c.notes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {/* Actions */}
                                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition">
                                    <button
                                        onClick={() => openEdit(c)}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition"
                                        title="Bearbeiten"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => deleteContact(c.id)}
                                        disabled={deleting === c.id}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-red-400 hover:bg-red-400/10 transition disabled:opacity-40"
                                        title="Löschen"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6l-1 14H6L5 6" />
                                            <path d="M10 11v6M14 11v6" />
                                            <path d="M9 6V4h6v2" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            {/* Quick status change */}
                            <div className="flex gap-1.5 mt-3 pt-3 border-t border-white/5">
                                <span className="text-xs text-neutral-600 self-center mr-1">Status:</span>
                                {(Object.keys(STATUS_CONFIG) as Contact['status'][]).map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setStatus(c, s)}
                                        className={`px-2 py-0.5 rounded text-xs transition ${
                                            c.status === s
                                                ? STATUS_CONFIG[s].color + ' border'
                                                : 'text-neutral-500 hover:text-neutral-300'
                                        }`}
                                    >
                                        {STATUS_CONFIG[s].label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {modal !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={closeModal}
                    />
                    <div className="relative bg-[#1a1130] border border-white/15 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-base font-semibold text-white mb-5">
                            {modal === 'add' ? 'Neuer Kontakt' : 'Kontakt bearbeiten'}
                        </h3>

                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2">
                                    <label className={lbl}>Name *</label>
                                    <input
                                        type="text"
                                        className={inp}
                                        placeholder="Max Mustermann"
                                        value={form.name}
                                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className={lbl}>E-Mail</label>
                                    <input
                                        type="email"
                                        className={inp}
                                        placeholder="max@beispiel.de"
                                        value={form.email}
                                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className={lbl}>Telefon</label>
                                    <input
                                        type="tel"
                                        className={inp}
                                        placeholder="+49 123 …"
                                        value={form.phone}
                                        onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className={lbl}>Firma</label>
                                    <input
                                        type="text"
                                        className={inp}
                                        placeholder="GmbH / AG …"
                                        value={form.company}
                                        onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className={lbl}>Quelle</label>
                                    <select
                                        className={`${inp} bg-[#1a1130]`}
                                        value={form.source}
                                        onChange={(e) => setForm((p) => ({ ...p, source: e.target.value }))}
                                    >
                                        <option value="">– wählen –</option>
                                        {SOURCES.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className={lbl}>Status</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {(Object.keys(STATUS_CONFIG) as Contact['status'][]).map((key) => {
                                            const cfg = STATUS_CONFIG[key];
                                            return (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    onClick={() => setForm((p) => ({ ...p, status: key }))}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                                                        form.status === key
                                                            ? cfg.color
                                                            : 'border-white/10 text-neutral-400 hover:border-white/20'
                                                    }`}
                                                >
                                                    {cfg.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className={lbl}>Notizen</label>
                                    <textarea
                                        className={`${inp} min-h-[70px] resize-none`}
                                        placeholder="Wichtige Infos, nächste Schritte…"
                                        value={form.notes}
                                        onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-5">
                            <button
                                onClick={closeModal}
                                className="flex-1 py-2.5 text-sm font-medium text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={saveContact}
                                disabled={saving || !form.name.trim()}
                                className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white text-sm font-semibold rounded-lg transition flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <span className="loading loading-spinner loading-xs" />
                                ) : null}
                                {modal === 'add' ? 'Hinzufügen' : 'Speichern'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
