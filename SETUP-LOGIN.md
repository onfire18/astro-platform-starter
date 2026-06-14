# 🔐 Login mit Google einrichten (AutoFlow)

Diese Anleitung verbindet AutoFlow mit **Supabase** (kostenlos) und aktiviert den
**Google-Login**. Dauer: ca. 15 Minuten. Du brauchst nichts zu programmieren –
nur klicken und kopieren.

> Solange das hier nicht eingerichtet ist, funktioniert die App trotzdem.
> Das Firmenprofil wird dann einfach lokal im Browser gespeichert.

---

## Schritt 1 – Supabase-Projekt erstellen

1. Geh auf **https://supabase.com** und melde dich an (kostenlos).
2. Klick auf **"New project"**.
3. Vergib einen Namen (z. B. `autoflow`) und ein Datenbank-Passwort.
4. Warte ~2 Minuten, bis das Projekt fertig ist.

---

## Schritt 2 – Die Profil-Tabelle anlegen

1. Im Supabase-Projekt links auf **"SQL Editor"** klicken.
2. **"New query"** wählen, den folgenden Code einfügen und auf **"Run"** klicken:

```sql
-- Tabelle für die Firmenprofile (ein Eintrag pro Nutzer)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Sicherheit: jeder darf nur seine eigenen Daten sehen/ändern
alter table public.profiles enable row level security;

create policy "Eigene Profile lesen"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Eigene Profile anlegen"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Eigene Profile ändern"
  on public.profiles for update
  using (auth.uid() = id);
```

---

## Schritt 3 – Google-Login aktivieren

### 3a) Google OAuth-Zugangsdaten erstellen

1. Geh auf **https://console.cloud.google.com**.
2. Oben ein neues Projekt anlegen (oder ein vorhandenes wählen).
3. Links zu **"APIs & Services" → "OAuth consent screen"**:
   - User Type: **External** → Create
   - App-Name, deine E-Mail eintragen → speichern (Rest kannst du überspringen).
4. Dann zu **"APIs & Services" → "Credentials"**:
   - **"Create Credentials" → "OAuth client ID"**
   - Application type: **Web application**
   - Bei **"Authorized redirect URIs"** diese URL eintragen (aus Supabase, siehe 3b):
     `https://DEINPROJEKT.supabase.co/auth/v1/callback`
   - **Create** klicken → du bekommst **Client ID** und **Client Secret**.

### 3b) In Supabase eintragen

1. Im Supabase-Projekt links auf **"Authentication" → "Providers"**.
2. **"Google"** auswählen und aktivieren.
3. **Client ID** und **Client Secret** von oben einfügen.
4. Die angezeigte **"Callback URL"** ist genau die, die du in Schritt 3a eingetragen hast.
5. **Save**.

---

## Schritt 4 – Zugangsdaten in AutoFlow eintragen

1. In Supabase: **"Settings" → "API"**.
2. Kopiere **"Project URL"** und **"anon public"** Key.
3. Lege im Projekt eine Datei **`.env`** an (Vorlage: `.env.example`) mit:

```
PUBLIC_SUPABASE_URL=https://DEINPROJEKT.supabase.co
PUBLIC_SUPABASE_ANON_KEY=dein-anon-public-key
```

4. Auf **Netlify** dieselben zwei Werte unter
   **Site configuration → Environment variables** eintragen und neu deployen.

---

## Fertig! ✅

Nach dem nächsten Deploy erscheint oben rechts **"Mit Google anmelden"**.
Nach dem Login wird das Firmenprofil sicher pro Nutzer in Supabase gespeichert
und automatisch in jede Rechnung übernommen.

> **Wichtig:** Der Login funktioniert nur in der **Online-Version** (Astro auf
> Netlify), nicht in der statischen HTML-Download-Version.
