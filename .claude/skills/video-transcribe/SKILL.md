---
name: video-transcribe
description: "Transcribes YouTube or other video URLs directly in Claude. Use when the user shares a video link and wants the transcript, a summary, key points, translation, or any content extracted from the video. Triggers on phrases like 'transkribiere', 'transcript', 'Video zusammenfassen', 'was sagt er in dem Video', 'fass das Video zusammen', 'Video Link', 'YouTube Link transkribieren'."
metadata:
  version: 1.0.0
---

# Video Transcribe Skill

Extracts and processes the full text transcript from any YouTube video URL — directly inside Claude Code, without leaving the conversation.

## How it Works

When the user shares a YouTube URL, execute this flow:

### Step 1 — Extract the Video ID

Parse the URL to get the video ID. Supported formats:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://youtube.com/shorts/VIDEO_ID`
- `https://m.youtube.com/watch?v=VIDEO_ID`

### Step 2 — Fetch the Transcript

Run this exact Python script via the Bash tool:

```python
#!/usr/bin/env python3
import sys, re, json, subprocess

url = sys.argv[1] if len(sys.argv) > 1 else ""

# --- Extract video ID ---
patterns = [
    r'(?:v=|youtu\.be/|shorts/|embed/)([A-Za-z0-9_-]{11})',
]
vid_id = None
for p in patterns:
    m = re.search(p, url)
    if m:
        vid_id = m.group(1)
        break

if not vid_id:
    print(json.dumps({"error": "VIDEO_ID_NOT_FOUND", "url": url}))
    sys.exit(1)

# --- Install if missing ---
try:
    import youtube_transcript_api
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", "youtube-transcript-api"])
    import youtube_transcript_api

# --- Fetch transcript ---
try:
    from youtube_transcript_api import YouTubeTranscriptApi
    api = YouTubeTranscriptApi()

    # Try to list available transcripts first
    transcript_list = api.list(vid_id)
    available = []
    for t in transcript_list:
        available.append({"lang": t.language_code, "name": t.language, "generated": t.is_generated})

    # Prefer manually created, then auto-generated
    # Try common languages in order
    preferred = ['de', 'en', 'es', 'fr', 'it', 'pt', 'nl', 'pl', 'ru']
    transcript_obj = None
    for lang in preferred:
        try:
            transcript_obj = transcript_list.find_transcript([lang])
            break
        except Exception:
            continue

    # Fallback: take first available
    if transcript_obj is None:
        for t in transcript_list:
            transcript_obj = t
            break

    if transcript_obj is None:
        print(json.dumps({
            "error": "NO_TRANSCRIPT",
            "video_id": vid_id,
            "available": available
        }))
        sys.exit(1)

    fetched = transcript_obj.fetch()
    snippets = fetched.snippets

    # Build outputs
    full_text = ' '.join(s.text.strip() for s in snippets)
    timestamped = '\n'.join(
        f"[{int(s.start // 60):02d}:{int(s.start % 60):02d}]  {s.text.strip()}"
        for s in snippets
    )

    print(json.dumps({
        "video_id": vid_id,
        "language": transcript_obj.language_code,
        "is_generated": transcript_obj.is_generated,
        "snippet_count": len(snippets),
        "duration_seconds": int(snippets[-1].start + snippets[-1].duration) if snippets else 0,
        "full_text": full_text,
        "timestamped": timestamped,
        "available_languages": available,
    }, ensure_ascii=False))

except Exception as e:
    print(json.dumps({"error": str(e), "video_id": vid_id}))
    sys.exit(1)
```

Save this as a temp script and run:
```bash
python3 /tmp/yt_transcript.py "YOUTUBE_URL_HERE"
```

Parse the JSON output.

### Step 3 — Handle the Result

**On success:**
- Show a brief header: `Transkript von [Video-ID] · [Sprache] · [Länge in Min]`
- Present the full timestamped transcript in a code block or formatted text
- Then immediately ask: **"Was soll ich damit machen?"** with these options:
  1. **Zusammenfassung** — 5–10 Bullet-Points der wichtigsten Aussagen
  2. **Key Insights** — Was sind die 3–5 wichtigsten Erkenntnisse?
  3. **Übersetzung** — In welche Sprache?
  4. **Artikel / Blog-Post** — Vollständiger Text basierend auf dem Video
  5. **Zitate extrahieren** — Alle zitierfähigen Aussagen mit Timestamp
  6. **Action Items** — Was wird im Video empfohlen oder gefordert?
  7. **Vollständiges Transkript** — Formatiert mit Timestamps ausgeben

**On `VIDEO_ID_NOT_FOUND`:**
- Tell the user the URL format isn't recognized
- Ask them to paste the raw YouTube URL

**On `NO_TRANSCRIPT`:**
- List available language codes from the `available` field
- If list is empty: explain that this video has no captions
- Suggest the MCP alternative (see Fallback Setup below)

**On network/proxy error (e.g., in cloud environments):**
- Explain that direct YouTube access is blocked in this environment
- Offer the MCP setup (see Fallback Setup)
- Ask if the user can paste the transcript text manually

---

## Fallback Setup (Zero-Setup Remote MCP)

If the Python approach fails due to network restrictions, guide the user to add the **ergut YouTube Transcript MCP** to their Claude Code config. This is a free, zero-setup remote MCP server.

**One-time setup — run in terminal:**
```bash
claude mcp add --transport sse youtube-transcript https://youtube-transcript-mcp.ergut.workers.dev/sse
```

Or manually add to `~/.claude.json` or `.claude/settings.json`:
```json
{
  "mcpServers": {
    "youtube-transcript": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://youtube-transcript-mcp.ergut.workers.dev/sse"
      ]
    }
  }
}
```

After setup, restart Claude Code. The `get_transcript` tool will appear automatically when YouTube URLs are detected.

---

## Supported Platforms

| Platform | Support | Notes |
|---|---|---|
| YouTube | Full | Auto-generated + manual captions |
| YouTube Shorts | Full | Same as regular YouTube |
| Vimeo | No | No public transcript API |
| TikTok | No | No caption API |
| Instagram | No | No caption API |
| Direct MP4 URL | No | Use Whisper locally |

For non-YouTube video transcription (MP4, Vimeo, etc.), recommend:
- **Local:** `whisper` CLI (`pip install openai-whisper`) — runs fully offline
- **Cloud:** AssemblyAI or Deepgram API

---

## Language Handling

- Auto-detects available languages
- Prefers German (`de`) then English (`en`) by default
- If the user asks for a specific language, pass it as preference
- Auto-generated captions are marked `[automatisch]` — accuracy varies

---

## Example Usage

User: "Kannst du dieses Video für mich transkribieren? https://youtu.be/dQw4w9WgXcQ"

Claude:
1. Runs the Python script with the URL
2. Parses the JSON result
3. Shows: `Transkript · en (auto) · 3:32 min · 47 Segmente`
4. Asks what to do with it
5. Executes the chosen action (summary, translation, etc.)
