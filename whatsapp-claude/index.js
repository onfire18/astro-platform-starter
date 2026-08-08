'use strict';

require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const Anthropic = require('@anthropic-ai/sdk');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const MODEL = process.env.CLAUDE_MODEL || 'claude-haiku-4-5-20251001';
const MAX_TOKENS = parseInt(process.env.MAX_TOKENS || '1024', 10);
const MAX_HISTORY = parseInt(process.env.MAX_HISTORY || '40', 10); // messages kept per session
const SYSTEM_PROMPT =
    process.env.SYSTEM_PROMPT ||
    'You are a helpful assistant. Reply concisely and clearly. You are chatting via WhatsApp — ' +
    'keep formatting simple, no markdown headers or bullet-heavy walls of text unless asked.';

// ---------------------------------------------------------------------------
// Anthropic client
// ---------------------------------------------------------------------------
if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ERROR: ANTHROPIC_API_KEY is not set in .env');
    process.exit(1);
}
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// In-memory conversation history (resets when the script restarts)
/** @type {{ role: 'user' | 'assistant'; content: string }[]} */
const history = [];

// ---------------------------------------------------------------------------
// WhatsApp client
// ---------------------------------------------------------------------------
const client = new Client({
    authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    }
});

client.on('qr', (qr) => {
    console.log('\n📱 Scan this QR code with WhatsApp (Settings → Linked Devices → Link a Device):\n');
    qrcode.generate(qr, { small: true });
});

client.on('loading_screen', (percent) => {
    process.stdout.write(`\rLoading WhatsApp Web … ${percent}%`);
});

client.on('authenticated', () => {
    console.log('\n✅ Authenticated — session saved, no QR scan needed next time.');
});

client.on('auth_failure', (msg) => {
    console.error('\n❌ Authentication failed:', msg);
    process.exit(1);
});

client.on('ready', () => {
    console.log(`\n🤖 Ready! Send a message to yourself in WhatsApp to chat with Claude (${MODEL}).`);
    console.log('   !reset — clears conversation history\n');
});

client.on('disconnected', (reason) => {
    console.warn('\n⚠️  WhatsApp disconnected:', reason);
    console.warn('   Restart the script to reconnect.');
});

// ---------------------------------------------------------------------------
// Message handler
// ---------------------------------------------------------------------------
client.on('message_create', async (msg) => {
    // Only handle messages I sent to myself (Saved Messages / "Gespeicherte Chats")
    if (!msg.fromMe) return;

    // client.info is available after 'ready'
    const myId = client.info?.wid?._serialized;
    if (!myId) return;
    if (msg.to !== myId) return; // sent to someone else

    const text = msg.body.trim();
    if (!text) return;

    // Special command: reset history
    if (text.toLowerCase() === '!reset') {
        history.length = 0;
        const chat = await msg.getChat();
        await chat.sendMessage('🗑️ Conversation history cleared.');
        return;
    }

    const chat = await msg.getChat();

    try {
        // Show typing indicator while Claude thinks
        await chat.sendStateTyping();

        // Add message to history and keep it bounded
        history.push({ role: 'user', content: text });
        if (history.length > MAX_HISTORY) history.splice(0, history.length - MAX_HISTORY);

        const response = await anthropic.messages.create({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            system: SYSTEM_PROMPT,
            messages: history
        });

        const reply = response.content[0]?.text ?? '(no response)';

        // Add Claude's reply to history
        history.push({ role: 'assistant', content: reply });
        if (history.length > MAX_HISTORY) history.splice(0, history.length - MAX_HISTORY);

        await chat.clearState();
        await chat.sendMessage(reply);

    } catch (err) {
        await chat.clearState();
        console.error('[Claude error]', err?.message ?? err);
        await chat.sendMessage('⚠️ Something went wrong: ' + (err?.message ?? 'unknown error'));
    }
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
client.initialize();
