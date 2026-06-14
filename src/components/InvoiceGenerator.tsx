import { useState, useEffect } from 'react';
import { useAuth } from '../lib/useAuth';
import { loadProfile, saveProfile } from '../lib/profile';
import type { CompanyProfile } from '../lib/supabase';

const PROFILE_KEYS: (keyof CompanyProfile)[] = [
    'senderName',
    'senderStreet',
    'senderCity',
    'senderEmail',
    'senderPhone',
    'senderTaxId',
    'senderWebsite',
    'senderBank',
    'senderIban',
    'senderBic',
];

interface LineItem {
    id: string;
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
}

interface FormData {
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
    clientName: string;
    clientStreet: string;
    clientCity: string;
    clientEmail: string;
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    performancePeriod: string;
    lineItems: LineItem[];
    taxRate: number;
    notes: string;
}

type Section = 'sender' | 'recipient' | 'items' | 'details';

const today = new Date().toISOString().split('T')[0];

const defaultDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
};

const randomInvNum = () => {
    const now = new Date();
    const rand = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${rand}`;
};

const fmt = (n: number) =>
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n);

const UNITS = ['Stk.', 'Std.', 'Tag', 'Monat', 'km', 'kg', 'Liter', 'Pauschal'];

export default function InvoiceGenerator() {
    const [form, setForm] = useState<FormData>({
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
        clientName: '',
        clientStreet: '',
        clientCity: '',
        clientEmail: '',
        invoiceNumber: randomInvNum(),
        invoiceDate: today,
        dueDate: defaultDueDate(),
        performancePeriod: '',
        lineItems: [{ id: '1', description: '', quantity: 1, unit: 'Stk.', unitPrice: 0 }],
        taxRate: 19,
        notes: 'Bitte überweisen Sie den Rechnungsbetrag unter Angabe der Rechnungsnummer innerhalb von 14 Tagen.',
    });

    const [section, setSection] = useState<Section>('sender');
    const [generating, setGenerating] = useState(false);

    // ── Profile (enter sender data once, reuse everywhere) ──
    const { user, configured } = useAuth();
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileMsg, setProfileMsg] = useState('');

    // Auto-fill sender fields from the saved profile (cloud or device).
    useEffect(() => {
        let active = true;
        loadProfile(user?.id ?? null).then((profile) => {
            if (active && profile) {
                setForm((p) => ({ ...p, ...profile }));
            }
        });
        return () => {
            active = false;
        };
    }, [user?.id]);

    const handleSaveProfile = async () => {
        setSavingProfile(true);
        setProfileMsg('');
        const profile = Object.fromEntries(
            PROFILE_KEYS.map((k) => [k, form[k]])
        ) as unknown as CompanyProfile;
        const res = await saveProfile(user?.id ?? null, profile);
        setSavingProfile(false);
        if (res.ok) {
            setProfileMsg(
                user
                    ? '✓ In deinem Konto gespeichert'
                    : '✓ Auf diesem Gerät gespeichert'
            );
        } else {
            setProfileMsg('Fehler: ' + (res.error ?? 'unbekannt'));
        }
        setTimeout(() => setProfileMsg(''), 4000);
    };

    const set = <K extends keyof FormData>(k: K, v: FormData[K]) =>
        setForm((p) => ({ ...p, [k]: v }));

    const updateItem = (id: string, field: keyof LineItem, value: string | number) =>
        setForm((p) => ({
            ...p,
            lineItems: p.lineItems.map((it) => (it.id === id ? { ...it, [field]: value } : it)),
        }));

    const addItem = () =>
        setForm((p) => ({
            ...p,
            lineItems: [
                ...p.lineItems,
                { id: Date.now().toString(), description: '', quantity: 1, unit: 'Stk.', unitPrice: 0 },
            ],
        }));

    const removeItem = (id: string) =>
        setForm((p) => ({ ...p, lineItems: p.lineItems.filter((it) => it.id !== id) }));

    const subtotal = form.lineItems.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
    const taxAmount = subtotal * (form.taxRate / 100);
    const total = subtotal + taxAmount;

    const downloadPDF = async () => {
        setGenerating(true);
        try {
            const { default: jsPDF } = await import('jspdf');
            const doc = new jsPDF('p', 'mm', 'a4');

            const W = 210;
            const ml = 20;
            const mr = 20;
            const cw = W - ml - mr;

            const rightText = (text: string, y: number, size = 8.5) => {
                doc.setFontSize(size);
                doc.text(text, W - mr, y, { align: 'right' });
            };

            // --- Sender info (top right) ---
            let y = 18;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(100, 100, 100);

            const senderLines = [
                form.senderName,
                form.senderStreet,
                form.senderCity,
                form.senderEmail,
                form.senderPhone,
                form.senderTaxId ? `Steuernr.: ${form.senderTaxId}` : '',
                form.senderWebsite,
            ].filter(Boolean);

            senderLines.forEach((line) => {
                rightText(line, y);
                y += 4.5;
            });

            // --- Recipient (left) ---
            let ry = 50;

            // Small return address line
            doc.setFontSize(7.5);
            doc.setTextColor(140, 140, 140);
            const retAddr = [form.senderName, form.senderStreet, form.senderCity]
                .filter(Boolean)
                .join(' · ');
            doc.text(retAddr || 'Absender', ml, ry);
            ry += 2.5;
            doc.setDrawColor(190, 190, 190);
            doc.line(ml, ry, ml + 90, ry);
            ry += 6;

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10.5);
            doc.setTextColor(20, 20, 20);
            doc.text(form.clientName || 'Empfänger', ml, ry);
            ry += 5.5;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(50, 50, 50);
            if (form.clientStreet) { doc.text(form.clientStreet, ml, ry); ry += 5; }
            if (form.clientCity) { doc.text(form.clientCity, ml, ry); ry += 5; }
            if (form.clientEmail) { doc.text(form.clientEmail, ml, ry); ry += 5; }

            // --- Invoice title + details (right) ---
            let ty = 50;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(26);
            doc.setTextColor(20, 20, 20);
            rightText('RECHNUNG', ty, 26);
            ty += 12;

            const details: [string, string][] = [
                ['Rechnungsnummer:', form.invoiceNumber],
                ['Rechnungsdatum:', form.invoiceDate],
                ['Fälligkeitsdatum:', form.dueDate],
                ...(form.performancePeriod
                    ? [['Leistungszeitraum:', form.performancePeriod] as [string, string]]
                    : []),
            ];

            details.forEach(([label, val]) => {
                doc.setFontSize(8.5);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(60, 60, 60);
                doc.text(label, W - mr - 55, ty);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(20, 20, 20);
                rightText(val, ty, 8.5);
                ty += 5;
            });

            y = Math.max(ry, ty) + 10;

            // --- Subject line ---
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.setTextColor(20, 20, 20);
            doc.text(`Rechnung Nr. ${form.invoiceNumber}`, ml, y);
            y += 10;

            // --- Table header ---
            doc.setFillColor(22, 22, 22);
            doc.rect(ml, y, cw, 8, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(255, 255, 255);

            const c1 = ml + 3;
            const c2 = ml + 97;
            const c3 = ml + 118;
            const c4 = ml + 143;
            const c5 = W - mr;

            doc.text('Beschreibung', c1, y + 5.5);
            doc.text('Menge', c2, y + 5.5);
            doc.text('Einheit', c3, y + 5.5);
            doc.text('Einzelpreis', c4, y + 5.5);
            doc.text('Gesamt', c5, y + 5.5, { align: 'right' });
            y += 8;

            // --- Line items ---
            form.lineItems.forEach((item, i) => {
                const rowTotal = item.quantity * item.unitPrice;
                if (i % 2 === 0) {
                    doc.setFillColor(247, 247, 250);
                    doc.rect(ml, y, cw, 8, 'F');
                }
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8.5);
                doc.setTextColor(25, 25, 25);

                const desc =
                    item.description.length > 50
                        ? `${item.description.slice(0, 47)}...`
                        : item.description;

                doc.text(desc || '—', c1, y + 5.5);
                doc.text(item.quantity.toLocaleString('de-DE'), c2, y + 5.5);
                doc.text(item.unit || 'Stk.', c3, y + 5.5);
                doc.text(fmt(item.unitPrice), c4, y + 5.5);
                doc.text(fmt(rowTotal), c5, y + 5.5, { align: 'right' });
                y += 8;
            });

            doc.setDrawColor(210, 210, 210);
            doc.line(ml, y, W - mr, y);
            y += 10;

            // --- Totals ---
            const tx = W - mr - 75;
            const tv = W - mr;

            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(70, 70, 70);
            doc.text('Nettobetrag:', tx, y);
            doc.text(fmt(subtotal), tv, y, { align: 'right' });
            y += 5.5;

            const taxLabel =
                form.taxRate === 0 ? 'MwSt. 0% (§19 UStG)' : `MwSt. ${form.taxRate}%`;
            doc.text(`${taxLabel}:`, tx, y);
            doc.text(fmt(taxAmount), tv, y, { align: 'right' });
            y += 4;

            doc.setDrawColor(80, 80, 80);
            doc.line(tx, y, tv, y);
            y += 6;

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.setTextColor(20, 20, 20);
            doc.text('Gesamtbetrag:', tx, y);
            doc.text(fmt(total), tv, y, { align: 'right' });
            y += 15;

            // --- Payment info ---
            if (form.senderBank || form.senderIban || form.senderBic) {
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(20, 20, 20);
                doc.text('Zahlungsinformationen:', ml, y);
                y += 5;
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(60, 60, 60);
                doc.setFontSize(8.5);
                if (form.senderBank) { doc.text(`Bank: ${form.senderBank}`, ml, y); y += 4.5; }
                if (form.senderIban) { doc.text(`IBAN: ${form.senderIban}`, ml, y); y += 4.5; }
                if (form.senderBic) { doc.text(`BIC: ${form.senderBic}`, ml, y); y += 4.5; }
                y += 8;
            }

            // --- Notes ---
            if (form.notes) {
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(20, 20, 20);
                doc.text('Hinweise:', ml, y);
                y += 5;
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8.5);
                doc.setTextColor(60, 60, 60);
                const noteLines = doc.splitTextToSize(form.notes, cw);
                doc.text(noteLines, ml, y);
            }

            // --- Footer ---
            doc.setFontSize(7.5);
            doc.setTextColor(170, 170, 170);
            doc.text('Erstellt mit AutoFlow · autoflow.app', W / 2, 289, { align: 'center' });

            const filename = `Rechnung_${form.invoiceNumber}_${form.clientName || 'Kunde'}.pdf`;
            doc.save(filename);
        } catch (err) {
            console.error(err);
            alert('PDF konnte nicht erstellt werden. Bitte versuche es erneut.');
        } finally {
            setGenerating(false);
        }
    };

    const inp =
        'w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition';

    const lbl = 'block text-xs font-medium text-neutral-400 mb-1.5';

    const tabs: { id: Section; label: string }[] = [
        { id: 'sender', label: 'Von mir' },
        { id: 'recipient', label: 'An Kunde' },
        { id: 'items', label: 'Positionen' },
        { id: 'details', label: 'Details' },
    ];

    const canDownload = form.senderName.trim() !== '' && form.clientName.trim() !== '';

    return (
        <div className="space-y-5">
            {/* Tab navigation */}
            <div className="grid grid-cols-4 gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setSection(t.id)}
                        className={`py-2 px-1 rounded-lg text-xs sm:text-sm font-medium transition ${
                            section === t.id
                                ? 'bg-brand-600 text-white shadow-lg shadow-brand-700/30'
                                : 'text-neutral-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* === SECTION: VON (Sender) === */}
            {section === 'sender' && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-5">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                        <h2 className="text-base font-semibold text-white">Deine Informationen</h2>
                        {user ? (
                            <span className="text-xs text-brand-300 bg-brand-600/15 border border-brand-500/30 px-2.5 py-1 rounded-lg">
                                Angemeldet – wird in deinem Konto gespeichert
                            </span>
                        ) : (
                            <span className="text-xs text-neutral-500">
                                {configured ? (
                                    <>
                                        <a href="/account" className="text-brand-300 hover:underline">
                                            Anmelden
                                        </a>{' '}
                                        für geräteübergreifende Speicherung
                                    </>
                                ) : (
                                    'Wird auf diesem Gerät gespeichert'
                                )}
                            </span>
                        )}
                    </div>

                    <div className="bg-brand-600/10 border border-brand-500/20 rounded-xl px-4 py-3 text-sm text-brand-200/90">
                        💡 Diese Daten musst du nur <strong>einmal</strong> eingeben. Speichere sie als
                        Profil – ab dann werden sie automatisch in jede neue Rechnung übernommen.
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={lbl}>Name / Firma *</label>
                            <input
                                type="text"
                                className={inp}
                                placeholder="Max Mustermann GmbH"
                                value={form.senderName}
                                onChange={(e) => set('senderName', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={lbl}>E-Mail</label>
                            <input
                                type="email"
                                className={inp}
                                placeholder="info@example.com"
                                value={form.senderEmail}
                                onChange={(e) => set('senderEmail', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={lbl}>Straße & Hausnummer</label>
                            <input
                                type="text"
                                className={inp}
                                placeholder="Musterstraße 1"
                                value={form.senderStreet}
                                onChange={(e) => set('senderStreet', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={lbl}>PLZ & Stadt</label>
                            <input
                                type="text"
                                className={inp}
                                placeholder="12345 Berlin"
                                value={form.senderCity}
                                onChange={(e) => set('senderCity', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={lbl}>Telefon</label>
                            <input
                                type="tel"
                                className={inp}
                                placeholder="+49 123 456789"
                                value={form.senderPhone}
                                onChange={(e) => set('senderPhone', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={lbl}>Steuernummer / USt-IdNr.</label>
                            <input
                                type="text"
                                className={inp}
                                placeholder="DE123456789"
                                value={form.senderTaxId}
                                onChange={(e) => set('senderTaxId', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-1 border-t border-white/10">
                        <h3 className="text-sm font-medium text-neutral-300 mb-1">
                            Bankverbindung{' '}
                            <span className="text-neutral-500 font-normal">(freiwillig)</span>
                        </h3>
                        <p className="text-xs text-neutral-500 mb-4">
                            Erscheint nur auf der Rechnung, wenn du sie angibst.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={lbl}>Bankname</label>
                                <input
                                    type="text"
                                    className={inp}
                                    placeholder="Deutsche Bank"
                                    value={form.senderBank}
                                    onChange={(e) => set('senderBank', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={lbl}>BIC</label>
                                <input
                                    type="text"
                                    className={inp}
                                    placeholder="DEUTDEDB"
                                    value={form.senderBic}
                                    onChange={(e) => set('senderBic', e.target.value)}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className={lbl}>IBAN</label>
                                <input
                                    type="text"
                                    className={inp}
                                    placeholder="DE89 3704 0044 0532 0130 00"
                                    value={form.senderIban}
                                    onChange={(e) => set('senderIban', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 flex-wrap pt-1 border-t border-white/10">
                        <button
                            onClick={handleSaveProfile}
                            disabled={savingProfile}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
                        >
                            {savingProfile ? (
                                <span className="loading loading-spinner loading-xs" />
                            ) : (
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                    <polyline points="17 21 17 13 7 13 7 21" />
                                    <polyline points="7 3 7 8 15 8" />
                                </svg>
                            )}
                            Als Profil speichern
                        </button>
                        {profileMsg && (
                            <span className="text-xs text-neutral-300">{profileMsg}</span>
                        )}
                        <button
                            onClick={() => setSection('recipient')}
                            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-lg transition ml-auto"
                        >
                            Weiter →
                        </button>
                    </div>
                </div>
            )}

            {/* === SECTION: AN (Recipient) === */}
            {section === 'recipient' && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-5">
                    <h2 className="text-base font-semibold text-white">Empfänger</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className={lbl}>Name / Firma *</label>
                            <input
                                type="text"
                                className={inp}
                                placeholder="Kundenname GmbH"
                                value={form.clientName}
                                onChange={(e) => set('clientName', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={lbl}>Straße & Hausnummer</label>
                            <input
                                type="text"
                                className={inp}
                                placeholder="Beispielstraße 42"
                                value={form.clientStreet}
                                onChange={(e) => set('clientStreet', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={lbl}>PLZ & Stadt</label>
                            <input
                                type="text"
                                className={inp}
                                placeholder="10115 Berlin"
                                value={form.clientCity}
                                onChange={(e) => set('clientCity', e.target.value)}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className={lbl}>E-Mail des Kunden</label>
                            <input
                                type="email"
                                className={inp}
                                placeholder="buchhaltung@kunde.de"
                                value={form.clientEmail}
                                onChange={(e) => set('clientEmail', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={() => setSection('sender')}
                            className="px-5 py-2.5 text-neutral-400 hover:text-white text-sm font-medium rounded-lg hover:bg-white/5 transition"
                        >
                            ← Zurück
                        </button>
                        <button
                            onClick={() => setSection('items')}
                            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-lg transition"
                        >
                            Weiter →
                        </button>
                    </div>
                </div>
            )}

            {/* === SECTION: POSITIONEN (Line items) === */}
            {section === 'items' && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
                    <h2 className="text-base font-semibold text-white">Rechnungspositionen</h2>

                    <div className="hidden sm:grid grid-cols-12 gap-2 px-1 text-xs font-medium text-neutral-500">
                        <div className="col-span-5">Beschreibung</div>
                        <div className="col-span-2">Menge</div>
                        <div className="col-span-2">Einheit</div>
                        <div className="col-span-2">Preis (€)</div>
                        <div className="col-span-1"></div>
                    </div>

                    <div className="space-y-3">
                        {form.lineItems.map((item, idx) => (
                            <div
                                key={item.id}
                                className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 sm:space-y-0 sm:grid sm:grid-cols-12 sm:gap-2 sm:items-center"
                            >
                                <div className="sm:col-span-5">
                                    <label className="sm:hidden block text-xs text-neutral-500 mb-1">
                                        Beschreibung
                                    </label>
                                    <input
                                        type="text"
                                        className={inp}
                                        placeholder={`Leistung ${idx + 1}`}
                                        value={item.description}
                                        onChange={(e) =>
                                            updateItem(item.id, 'description', e.target.value)
                                        }
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="sm:hidden block text-xs text-neutral-500 mb-1">
                                        Menge
                                    </label>
                                    <input
                                        type="number"
                                        className={inp}
                                        min="0"
                                        step="0.01"
                                        value={item.quantity || ''}
                                        onChange={(e) =>
                                            updateItem(
                                                item.id,
                                                'quantity',
                                                parseFloat(e.target.value) || 0
                                            )
                                        }
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="sm:hidden block text-xs text-neutral-500 mb-1">
                                        Einheit
                                    </label>
                                    <select
                                        className={`${inp} bg-[#1a1130]`}
                                        value={item.unit}
                                        onChange={(e) =>
                                            updateItem(item.id, 'unit', e.target.value)
                                        }
                                    >
                                        {UNITS.map((u) => (
                                            <option key={u} value={u}>
                                                {u}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="sm:hidden block text-xs text-neutral-500 mb-1">
                                        Einzelpreis (€)
                                    </label>
                                    <input
                                        type="number"
                                        className={inp}
                                        min="0"
                                        step="0.01"
                                        placeholder="0,00"
                                        value={item.unitPrice || ''}
                                        onChange={(e) =>
                                            updateItem(
                                                item.id,
                                                'unitPrice',
                                                parseFloat(e.target.value) || 0
                                            )
                                        }
                                    />
                                </div>
                                <div className="sm:col-span-1 flex sm:justify-center">
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        disabled={form.lineItems.length === 1}
                                        className="w-8 h-8 rounded-lg text-neutral-600 hover:text-red-400 hover:bg-red-400/10 transition disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center text-lg"
                                        title="Position entfernen"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={addItem}
                        className="w-full py-3 border border-dashed border-white/15 rounded-xl text-neutral-500 hover:text-white hover:border-brand-500/40 hover:bg-brand-600/5 transition text-sm font-medium"
                    >
                        + Position hinzufügen
                    </button>

                    <div className="flex justify-between pt-1">
                        <button
                            onClick={() => setSection('recipient')}
                            className="px-5 py-2.5 text-neutral-400 hover:text-white text-sm font-medium rounded-lg hover:bg-white/5 transition"
                        >
                            ← Zurück
                        </button>
                        <button
                            onClick={() => setSection('details')}
                            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-lg transition"
                        >
                            Weiter →
                        </button>
                    </div>
                </div>
            )}

            {/* === SECTION: DETAILS === */}
            {section === 'details' && (
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-5">
                    <h2 className="text-base font-semibold text-white">Rechnungsdetails</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={lbl}>Rechnungsnummer *</label>
                            <input
                                type="text"
                                className={inp}
                                value={form.invoiceNumber}
                                onChange={(e) => set('invoiceNumber', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={lbl}>MwSt.-Satz</label>
                            <select
                                className={`${inp} bg-[#1a1130]`}
                                value={form.taxRate}
                                onChange={(e) => set('taxRate', parseInt(e.target.value))}
                            >
                                <option value={19}>19% – Regelsteuersatz</option>
                                <option value={7}>7% – Ermäßigt</option>
                                <option value={0}>0% – Kleinunternehmer (§19 UStG)</option>
                            </select>
                        </div>
                        <div>
                            <label className={lbl}>Rechnungsdatum *</label>
                            <input
                                type="date"
                                className={`${inp} bg-[#1a1130]`}
                                value={form.invoiceDate}
                                onChange={(e) => set('invoiceDate', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={lbl}>Fälligkeitsdatum *</label>
                            <input
                                type="date"
                                className={`${inp} bg-[#1a1130]`}
                                value={form.dueDate}
                                onChange={(e) => set('dueDate', e.target.value)}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className={lbl}>Leistungszeitraum (optional)</label>
                            <input
                                type="text"
                                className={inp}
                                placeholder="z.B. 01.01.2025 – 31.01.2025"
                                value={form.performancePeriod}
                                onChange={(e) => set('performancePeriod', e.target.value)}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className={lbl}>Hinweise / Zahlungsbedingungen</label>
                            <textarea
                                className={`${inp} min-h-[90px] resize-y`}
                                value={form.notes}
                                onChange={(e) => set('notes', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-start">
                        <button
                            onClick={() => setSection('items')}
                            className="px-5 py-2.5 text-neutral-400 hover:text-white text-sm font-medium rounded-lg hover:bg-white/5 transition"
                        >
                            ← Zurück
                        </button>
                    </div>
                </div>
            )}

            {/* === SUMMARY + DOWNLOAD === */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-neutral-300 mb-4">Zusammenfassung</h3>

                <div className="space-y-2.5 mb-5">
                    <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Nettobetrag</span>
                        <span className="text-white font-medium tabular-nums">{fmt(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">
                            {form.taxRate === 0 ? 'MwSt. (§19 UStG)' : `MwSt. ${form.taxRate}%`}
                        </span>
                        <span className="text-white font-medium tabular-nums">{fmt(taxAmount)}</span>
                    </div>
                    <div className="h-px bg-white/10"></div>
                    <div className="flex justify-between">
                        <span className="text-white font-semibold">Gesamtbetrag</span>
                        <span className="text-brand-400 font-bold text-xl tabular-nums">
                            {fmt(total)}
                        </span>
                    </div>
                </div>

                <button
                    onClick={downloadPDF}
                    disabled={generating || !canDownload}
                    className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition flex items-center justify-center gap-2.5 shadow-lg shadow-brand-700/30"
                >
                    {generating ? (
                        <>
                            <span className="loading loading-spinner loading-sm" />
                            PDF wird erstellt…
                        </>
                    ) : (
                        <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            PDF herunterladen
                        </>
                    )}
                </button>

                {!canDownload && (
                    <p className="text-xs text-neutral-600 text-center mt-2.5">
                        Bitte fülle "Name" unter "Von mir" und "An Kunde" aus.
                    </p>
                )}
            </div>
        </div>
    );
}
