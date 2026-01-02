const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

// --- PENGATURAN BOT ---
const API_KEY_GEMINI = 'AIzaSyBzxNr68JjBPG4wNC9NK-hl9opRDQ1kBaw'; 
const URL_GEMINI = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: '/data/data/com.termux/files/usr/bin/chromium', 
        handleSIGINT: false,
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu',
            '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ]
    }
});

// Munculin QR Code di Terminal
client.on('qr', (qr) => {
    console.log('----------------------------');
    console.log('SCAN QR DI BAWAH INI WAN:');
    qrcode.generate(qr, { small: true });
    console.log('----------------------------');
});

client.on('ready', () => {
    console.log('----------------------------');
    console.log('YUI V.72 ONLINE!');
    console.log('Tester lu (0895320302320) udah bisa chat sekarang.');
    console.log('----------------------------');
});

client.on('message', async (msg) => {
    // Filter khusus buat nomor tester lu
    if (msg.from === '62895320302320@c.us') {
        try {
            const response = await axios.post(`${URL_GEMINI}?key=${API_KEY_GEMINI}`, {
                contents: [{ parts: [{ text: msg.body }] }]
            });
            const aiReply = response.data.candidates[0].content.parts[0].text;
            msg.reply(aiReply);
        } catch (error) {
            console.error('Error Gemini:', error.message);
        }
    }
});

// Inisialisasi Bot
console.log('LAGI NYALAIN BROWSER, TUNGGUIN BENTAR...');
client.initialize();
