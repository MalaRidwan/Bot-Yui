const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

// --- PENGATURAN BOT ---
const NOMOR_BOT = '6285156906427'; // Ganti ke nomor WA yang mau jadi bot (pake 628)
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
            // Penyamaran biar gak error "Evaluation failed: t"
            '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ]
    }
});

client.on('qr', (qr) => {
    console.log('SCAN QR INI JIKA PAIRING GAGAL:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('----------------------------');
    console.log('BOT YUI ONLINE, WAN!');
    console.log('Silakan tes chat dari 0895320302320');
    console.log('----------------------------');
});

client.on('message', async (msg) => {
    // Lu cuma mau tes pake nomor lu kan? Ini filternya:
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

async function startBot() {
    try {
        console.log('INISIALISASI...');
        await client.initialize();
        
        console.log('MENUNGGU 15 DETIK (BIAR STABIL)...');
        setTimeout(async () => {
            try {
                console.log('MINTA KODE PAIRING...');
                const pairingCode = await client.requestPairingCode(NOMOR_BOT);
                console.log('----------------------------');
                console.log('KODE PAIRING LU: ' + pairingCode);
                console.log('----------------------------');
            } catch (err) {
                console.log('Gagal ambil kode. Detail:', err.message);
            }
        }, 15000);

    } catch (err) {
        console.log('Gagal Inisialisasi:', err.message);
    }
}

startBot();
