import { useState } from 'react';

// ─── Caption templates ────────────────────────────────────────────────────────

interface Template {
    id: string;
    label: string;
    icon: string;
    fields: string[];
    generate: (v: string[]) => string;
}

const TEMPLATES: Template[] = [
    {
        id: 'product',
        label: 'Produktvorstellung',
        icon: '✨',
        fields: ['Produkt / Dienstleistung', 'Kurzbeschreibung (1–2 Sätze)', 'Vorteil 1', 'Vorteil 2', 'Vorteil 3', 'Call to Action'],
        generate: ([p, d, v1, v2, v3, cta]) =>
            `✨ ${p}\n\n${d}\n\nDas bekommst du:\n✅ ${v1}\n✅ ${v2}\n✅ ${v3}\n\n👉 ${cta} – Link in Bio!\n\n`,
    },
    {
        id: 'motivation',
        label: 'Motivationspost',
        icon: '💪',
        fields: ['Motivations-Quote', 'Erklärung / kurze Story', 'Learning 1', 'Learning 2', 'Learning 3'],
        generate: ([q, story, l1, l2, l3]) =>
            `💪 "${q}"\n\n${story}\n\nMeine 3 wichtigsten Learnings:\n1️⃣ ${l1}\n2️⃣ ${l2}\n3️⃣ ${l3}\n\nTeile das mit jemandem, der das gerade braucht! 🙌\n\n`,
    },
    {
        id: 'sale',
        label: 'Angebot / Sale',
        icon: '🔥',
        fields: ['Angebotsname (z.B. 20% Rabatt)', 'Was wird angeboten?', 'Vorteil 1', 'Vorteil 2', 'Gültig bis (Datum)', 'Normalpreis (€)', 'Aktionspreis (€)'],
        generate: ([name, what, v1, v2, date, old, neu]) =>
            `🚨 NICHT VERPASSEN: ${name}! 🚨\n\n${what}\n\n✅ ${v1}\n✅ ${v2}\n\n⏰ Nur bis ${date}!\n💰 Statt ${old}€ – jetzt nur ${neu}€\n\n👉 Jetzt sichern → Link in Bio!\n\n`,
    },
    {
        id: 'bts',
        label: 'Behind the Scenes',
        icon: '🎬',
        fields: ['Thema (worum geht es?)', 'Einblick / Story (2–3 Sätze)', 'Interessante Detail / Fakt', 'Frage an die Community'],
        generate: ([topic, story, fact, q]) =>
            `🎬 Behind the Scenes: ${topic}\n\n${story}\n\nSpannend: ${fact}\n\n${q} Schreib's in die Kommentare! 👇\n\n`,
    },
    {
        id: 'testimonial',
        label: 'Kundenstimme',
        icon: '⭐',
        fields: ['Zitat des Kunden', 'Name / Beschreibung des Kunden', 'Dein Kommentar / Kontext', 'Call to Action (z.B. DM für mehr Info)'],
        generate: ([quote, who, comment, cta]) =>
            `⭐⭐⭐⭐⭐ Kundenstimme\n\n"${quote}"\n– ${who}\n\n${comment}\n\n👉 ${cta} – schreib mir eine DM!\n\n`,
    },
    {
        id: 'tips',
        label: 'Tipps-Post',
        icon: '💡',
        fields: ['Thema', 'Intro-Satz', 'Tipp 1', 'Tipp 2', 'Tipp 3', 'Tipp 4', 'Abschlussfrage'],
        generate: ([topic, intro, t1, t2, t3, t4, q]) =>
            `💡 ${topic}\n\n${intro}\n\n🔑 ${t1}\n⚡ ${t2}\n🎯 ${t3}\n💪 ${t4}\n\n${q} 👇\n\nSpeichere diesen Post für später! 📌\n\n`,
    },
    {
        id: 'launch',
        label: 'Launch / Ankündigung',
        icon: '🚀',
        fields: ['Was wird gelauncht?', 'Das ist NEU daran', 'Für wen ist es?', 'Vorteil 1', 'Vorteil 2', 'Wann ist es verfügbar?'],
        generate: ([what, neu, who, v1, v2, when]) =>
            `🚀 ES IST DA!\n\n${what} – ${neu}\n\nFür wen? ${who}\n\n✨ ${v1}\n✨ ${v2}\n\n📅 Ab ${when} verfügbar!\n\n👉 Trag dich jetzt ein – Link in Bio!\n\n`,
    },
    {
        id: 'personal',
        label: 'Persönlicher Post',
        icon: '🙋',
        fields: ['Thema / Headline', 'Persönliche Story (3–4 Sätze)', 'Was hast du daraus gelernt?', 'Frage an die Follower'],
        generate: ([topic, story, learn, q]) =>
            `🙋 ${topic}\n\n${story}\n\nMein größtes Learning: ${learn}\n\n${q}\n\nSchreib's in die Kommentare! 👇❤️\n\n`,
    },
];

// ─── Hashtag sets ─────────────────────────────────────────────────────────────

interface HashtagSet {
    id: string;
    label: string;
    icon: string;
    tags: string[];
}

const HASHTAG_SETS: HashtagSet[] = [
    {
        id: 'business',
        label: 'Business & Freelancer',
        icon: '💼',
        tags: [
            'freelancer', 'selbstständig', 'unternehmertum', 'entrepreneur', 'startup',
            'business', 'unternehmer', 'onlinebusiness', 'passiveseinkommen', 'digitalnomad',
            'solopreneur', 'businesstipps', 'erfolgreich', 'businesscoach', 'finanziellfreiheit',
            'nebeneinkommen', 'selbstständigkeit', 'unternehmerin', 'businesswomen', 'smallbusiness',
            'businessowner', 'buildingabusiness', 'mindset', 'erfolg', 'motivation',
            'wachstum', 'produktivität', 'remote', 'remotework', 'workfromanywhere',
        ],
    },
    {
        id: 'marketing',
        label: 'Marketing & Social Media',
        icon: '📣',
        tags: [
            'socialmedia', 'digitalmarketing', 'contentmarketing', 'socialmediatipps', 'instagram',
            'instagramtipps', 'marketing', 'onlinemarketing', 'contentcreator', 'contentcreation',
            'socialmediamanager', 'wachstum', 'reichweite', 'engagement', 'algorithm',
            'reels', 'instagramreels', 'storys', 'community', 'communitybuilding',
            'influencer', 'branding', 'markenaufbau', 'marketingstrategie', 'seo',
            'ads', 'werbung', 'funnelmarketing', 'emailmarketing', 'copywriting',
        ],
    },
    {
        id: 'ecommerce',
        label: 'E-Commerce & Shop',
        icon: '🛒',
        tags: [
            'onlineshop', 'ecommerce', 'shopify', 'handmade', 'etsy',
            'kaufen', 'sale', 'rabatt', 'angebot', 'neuheit',
            'produkt', 'qualität', 'versandkostenfrei', 'deutschland', 'österreich',
            'schweiz', 'dach', 'premium', 'exklusiv', 'limitiert',
            'neuware', 'bestseller', 'trendy', 'musthave', 'empfehlung',
            'shopping', 'onlineshopping', 'gutschein', 'deal', 'shoppingaddict',
        ],
    },
    {
        id: 'fitness',
        label: 'Fitness & Health',
        icon: '💪',
        tags: [
            'fitness', 'workout', 'training', 'sport', 'gesundheit',
            'fitnessmotivation', 'gym', 'bodybuilding', 'abnehmen', 'muskelaufbau',
            'gesundeleben', 'ernährung', 'healthy', 'healthylifestyle', 'fitlife',
            'personal trainer', 'personaltraining', 'homeworkout', 'crossfit', 'yoga',
            'laufen', 'running', 'marathon', 'triathlon', 'calisthenics',
            'supplement', 'protein', 'meal prep', 'diät', 'challenge',
        ],
    },
    {
        id: 'motivation',
        label: 'Motivation & Mindset',
        icon: '🧠',
        tags: [
            'motivation', 'mindset', 'erfolg', 'ziele', 'träume',
            'persönlichkeitsentwicklung', 'wachstum', 'positivevibes', 'positivdenken', 'glück',
            'inspiration', 'quote', 'zitat', 'dailymotivation', 'morgenroutine',
            'habits', 'gewohnheiten', 'produktivität', 'zeitmanagement', 'selbstdisziplin',
            'fokus', 'glaube', 'vertrauen', 'kraft', 'leben',
            'lebensfreude', 'dankbarkeit', 'manifest', 'lawofattraction', 'vision',
        ],
    },
    {
        id: 'food',
        label: 'Food & Kochen',
        icon: '🍽️',
        tags: [
            'food', 'foodie', 'kochen', 'rezepte', 'essen',
            'foodphotography', 'foodporn', 'homecooking', 'hausmannskost', 'vegetarisch',
            'vegan', 'veganfood', 'glutenfrei', 'laktosefrei', 'clean eating',
            'gesundessen', 'mealprep', 'baking', 'backen', 'kuchen',
            'dessert', 'süßes', 'snack', 'brunch', 'lunch',
            'dinner', 'instafood', 'foodblogger', 'deutsch', 'hausgemacht',
        ],
    },
    {
        id: 'lifestyle',
        label: 'Lifestyle & Travel',
        icon: '✈️',
        tags: [
            'lifestyle', 'travel', 'reisen', 'urlaub', 'wanderlust',
            'travelphotography', 'instatravel', 'traveler', 'backpacker', 'adventure',
            'explore', 'natur', 'outdoor', 'berg', 'meer',
            'strand', 'city', 'citytrip', 'europa', 'deutschland',
            'österreich', 'schweiz', 'fernweh', 'reiseblogger', 'reisefotos',
            'luxurytravel', 'roadtrip', 'camping', 'vanlife', 'minimalism',
        ],
    },
    {
        id: 'tech',
        label: 'Tech & Automatisierung',
        icon: '⚙️',
        tags: [
            'automatisierung', 'automation', 'tech', 'software', 'app',
            'ki', 'ai', 'chatgpt', 'digitalisierung', 'produktivität',
            'tools', 'workflow', 'zapier', 'nocode', 'lowcode',
            'programmieren', 'webdesign', 'developer', 'startup', 'innovation',
            'futureofwork', 'remotetools', 'saas', 'freelancertool', 'zeitsparen',
            'effizienz', 'prozesse', 'business', 'entrepreneur', 'digital',
        ],
    },
];

// ─── Bio templates ────────────────────────────────────────────────────────────

// ─── Component ────────────────────────────────────────────────────────────────

type Tab = 'caption' | 'hashtags' | 'bio';

export default function InstagramToolkit() {
    const [tab, setTab] = useState<Tab>('caption');

    // Caption state
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [fieldValues, setFieldValues] = useState<string[]>([]);
    const [selectedHashtagSets, setSelectedHashtagSets] = useState<string[]>([]);
    const [captionCopied, setCaptionCopied] = useState(false);

    // Hashtags state
    const [hashtagNiches, setHashtagNiches] = useState<string[]>([]);
    const [hashtagsCopied, setHashtagsCopied] = useState(false);

    // Bio state
    const [bioFields, setBioFields] = useState({
        role: '', specialty: '', value: '', fact: '', cta: '', link: '',
    });
    const [bioCopied, setBioCopied] = useState(false);

    // ── Caption logic ─────────────────────────────────────────────────────────

    const selectTemplate = (t: Template) => {
        setSelectedTemplate(t);
        setFieldValues(new Array(t.fields.length).fill(''));
        setSelectedHashtagSets([]);
        setCaptionCopied(false);
    };

    const allHashtags = HASHTAG_SETS.filter((s) => selectedHashtagSets.includes(s.id)).flatMap(
        (s) => s.tags
    );

    const generatedCaption = selectedTemplate
        ? selectedTemplate.generate(fieldValues) +
          (allHashtags.length > 0
              ? allHashtags
                    .slice(0, 30)
                    .map((t) => `#${t}`)
                    .join(' ')
              : '')
        : '';

    const copyCaption = async () => {
        await navigator.clipboard.writeText(generatedCaption);
        setCaptionCopied(true);
        setTimeout(() => setCaptionCopied(false), 2000);
    };

    // ── Hashtag logic ─────────────────────────────────────────────────────────

    const toggleNiche = (id: string) =>
        setHashtagNiches((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

    const selectedTags = HASHTAG_SETS.filter((s) => hashtagNiches.includes(s.id)).flatMap(
        (s) => s.tags
    );
    const hashtagText = selectedTags
        .slice(0, 30)
        .map((t) => `#${t}`)
        .join(' ');

    const copyHashtags = async () => {
        await navigator.clipboard.writeText(hashtagText);
        setHashtagsCopied(true);
        setTimeout(() => setHashtagsCopied(false), 2000);
    };

    // ── Bio logic ─────────────────────────────────────────────────────────────

    const generatedBio = [
        bioFields.role ? `🎯 ${bioFields.role}` : '',
        bioFields.specialty ? `✨ ${bioFields.specialty}` : '',
        bioFields.value ? `💡 ${bioFields.value}` : '',
        bioFields.fact ? `⚡ ${bioFields.fact}` : '',
        bioFields.cta ? `👇 ${bioFields.cta}` : '',
        bioFields.link ? `🔗 ${bioFields.link}` : '',
    ]
        .filter(Boolean)
        .join('\n');

    const copyBio = async () => {
        await navigator.clipboard.writeText(generatedBio);
        setBioCopied(true);
        setTimeout(() => setBioCopied(false), 2000);
    };

    // ── Styles ────────────────────────────────────────────────────────────────

    const inp =
        'w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition';
    const lbl = 'block text-xs font-medium text-neutral-400 mb-1.5';

    const tabs: { id: Tab; label: string; icon: string }[] = [
        { id: 'caption', label: 'Caption', icon: '✍️' },
        { id: 'hashtags', label: 'Hashtags', icon: '#️⃣' },
        { id: 'bio', label: 'Bio', icon: '👤' },
    ];

    return (
        <div className="space-y-5">
            {/* Tab navigation */}
            <div className="grid grid-cols-3 gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`py-2.5 px-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
                            tab === t.id
                                ? 'bg-brand-600 text-white shadow-lg shadow-brand-700/30'
                                : 'text-neutral-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <span>{t.icon}</span>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ── CAPTION GENERATOR ── */}
            {tab === 'caption' && (
                <div className="space-y-5">
                    {/* Template grid */}
                    {!selectedTemplate && (
                        <div>
                            <p className="text-sm text-neutral-400 mb-4">
                                Wähle einen Template-Typ:
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {TEMPLATES.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => selectTemplate(t)}
                                        className="bg-white/[0.03] hover:bg-white/8 border border-white/10 hover:border-brand-500/40 rounded-xl p-4 text-left transition group"
                                    >
                                        <div className="text-2xl mb-2">{t.icon}</div>
                                        <div className="text-xs font-medium text-neutral-300 group-hover:text-white">
                                            {t.label}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedTemplate && (
                        <>
                            {/* Back + template name */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedTemplate(null)}
                                    className="text-neutral-500 hover:text-white transition text-sm flex items-center gap-1"
                                >
                                    ← Zurück
                                </button>
                                <span className="text-white font-medium text-sm">
                                    {selectedTemplate.icon} {selectedTemplate.label}
                                </span>
                            </div>

                            {/* Form fields */}
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4">
                                <h3 className="text-sm font-medium text-neutral-300">Felder ausfüllen</h3>
                                {selectedTemplate.fields.map((fieldLabel, i) => (
                                    <div key={i}>
                                        <label className={lbl}>{fieldLabel}</label>
                                        <input
                                            type="text"
                                            className={inp}
                                            placeholder={`${fieldLabel}…`}
                                            value={fieldValues[i] ?? ''}
                                            onChange={(e) => {
                                                const next = [...fieldValues];
                                                next[i] = e.target.value;
                                                setFieldValues(next);
                                            }}
                                        />
                                    </div>
                                ))}

                                {/* Hashtag niche selector for caption */}
                                <div>
                                    <label className={lbl}>
                                        Hashtag-Themen (optional, max. 30 Hashtags)
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {HASHTAG_SETS.map((s) => (
                                            <button
                                                key={s.id}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedHashtagSets((p) =>
                                                        p.includes(s.id)
                                                            ? p.filter((x) => x !== s.id)
                                                            : [...p, s.id]
                                                    )
                                                }
                                                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                                                    selectedHashtagSets.includes(s.id)
                                                        ? 'bg-brand-600/30 border-brand-500/50 text-brand-300'
                                                        : 'border-white/10 text-neutral-500 hover:text-neutral-300 hover:border-white/20'
                                                }`}
                                            >
                                                {s.icon} {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-medium text-neutral-300">Vorschau</h3>
                                    <button
                                        onClick={copyCaption}
                                        disabled={!generatedCaption.trim()}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                            captionCopied
                                                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                                : 'bg-brand-600/20 border border-brand-500/30 text-brand-300 hover:bg-brand-600/30 disabled:opacity-40'
                                        }`}
                                    >
                                        {captionCopied ? '✓ Kopiert!' : '📋 Kopieren'}
                                    </button>
                                </div>
                                <pre className="text-sm text-neutral-300 whitespace-pre-wrap font-sans leading-relaxed min-h-[120px]">
                                    {generatedCaption || (
                                        <span className="text-neutral-600 italic">
                                            Fülle die Felder aus…
                                        </span>
                                    )}
                                </pre>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* ── HASHTAG MANAGER ── */}
            {tab === 'hashtags' && (
                <div className="space-y-5">
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                        <h3 className="text-sm font-medium text-neutral-300 mb-4">
                            Wähle deine Themen-Bereiche
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {HASHTAG_SETS.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => toggleNiche(s.id)}
                                    className={`p-3 rounded-xl border text-left transition ${
                                        hashtagNiches.includes(s.id)
                                            ? 'bg-brand-600/20 border-brand-500/50 text-white'
                                            : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20 hover:text-neutral-200'
                                    }`}
                                >
                                    <div className="text-xl mb-1">{s.icon}</div>
                                    <div className="text-xs font-medium">{s.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {hashtagNiches.length > 0 && (
                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-sm font-medium text-neutral-300">
                                        Deine Hashtags
                                    </h3>
                                    <p className="text-xs text-neutral-500 mt-0.5">
                                        {Math.min(selectedTags.length, 30)} / 30 Hashtags
                                    </p>
                                </div>
                                <button
                                    onClick={copyHashtags}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                        hashtagsCopied
                                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                            : 'bg-brand-600/20 border border-brand-500/30 text-brand-300 hover:bg-brand-600/30'
                                    }`}
                                >
                                    {hashtagsCopied ? '✓ Kopiert!' : '📋 Alle kopieren'}
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {selectedTags.slice(0, 30).map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2.5 py-1 bg-brand-600/10 border border-brand-500/20 rounded-lg text-xs text-brand-300"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <p className="text-xs text-neutral-500 font-mono leading-relaxed">
                                    {hashtagText}
                                </p>
                            </div>
                        </div>
                    )}

                    {hashtagNiches.length === 0 && (
                        <div className="py-10 text-center text-neutral-600 text-sm">
                            Wähle mindestens einen Bereich oben aus.
                        </div>
                    )}

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3 text-xs text-yellow-300">
                        💡 Instagram erlaubt bis zu 30 Hashtags pro Post. Mix aus großen (#fitness, 500M+)
                        und kleineren Hashtags (#freelancerdeutschland, &lt;500K) für beste Reichweite.
                    </div>
                </div>
            )}

            {/* ── BIO GENERATOR ── */}
            {tab === 'bio' && (
                <div className="space-y-5">
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 space-y-4">
                        <h3 className="text-sm font-medium text-neutral-300">Deine Instagram-Bio</h3>

                        {[
                            {
                                key: 'role' as const,
                                label: 'Deine Rolle / Berufsbezeichnung',
                                placeholder: 'z.B. Social Media Managerin',
                            },
                            {
                                key: 'specialty' as const,
                                label: 'Deine Spezialität / Was du machst',
                                placeholder: 'z.B. Helfe Unternehmen bei ihrer Online-Präsenz',
                            },
                            {
                                key: 'value' as const,
                                label: 'Dein Mehrwert für Follower',
                                placeholder: 'z.B. Tägliche Tipps für mehr Reichweite',
                            },
                            {
                                key: 'fact' as const,
                                label: 'Fun Fact / Persönliches (optional)',
                                placeholder: 'z.B. Kaffee-Süchtig ☕',
                            },
                            {
                                key: 'cta' as const,
                                label: 'Call to Action',
                                placeholder: 'z.B. Gratis Erstgespräch buchen',
                            },
                            {
                                key: 'link' as const,
                                label: 'Link-Beschreibung',
                                placeholder: 'z.B. autoflow.app',
                            },
                        ].map(({ key, label, placeholder }) => (
                            <div key={key}>
                                <label className={lbl}>{label}</label>
                                <input
                                    type="text"
                                    className={inp}
                                    placeholder={placeholder}
                                    value={bioFields[key]}
                                    onChange={(e) =>
                                        setBioFields((p) => ({ ...p, [key]: e.target.value }))
                                    }
                                />
                            </div>
                        ))}
                    </div>

                    {/* Bio preview */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium text-neutral-300">Vorschau</h3>
                            <button
                                onClick={copyBio}
                                disabled={!generatedBio}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                    bioCopied
                                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                        : 'bg-brand-600/20 border border-brand-500/30 text-brand-300 hover:bg-brand-600/30 disabled:opacity-40'
                                }`}
                            >
                                {bioCopied ? '✓ Kopiert!' : '📋 Kopieren'}
                            </button>
                        </div>

                        {/* Fake Instagram profile mockup */}
                        <div className="bg-white rounded-xl p-4 text-gray-900 text-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                                <div>
                                    <div className="font-semibold text-xs">dein_account</div>
                                    <div className="text-gray-400 text-xs">Instagram</div>
                                </div>
                            </div>
                            <pre className="text-xs whitespace-pre-wrap text-gray-800 font-sans leading-relaxed min-h-[80px]">
                                {generatedBio || (
                                    <span className="text-gray-400 italic">
                                        Fülle die Felder aus…
                                    </span>
                                )}
                            </pre>
                        </div>

                        <p className="text-xs text-neutral-600 mt-2">
                            Instagram Bio: max. 150 Zeichen ({generatedBio.length}/150)
                            {generatedBio.length > 150 && (
                                <span className="text-red-400 ml-1">– zu lang!</span>
                            )}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
