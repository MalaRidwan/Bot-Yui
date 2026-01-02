const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

// --- PENGATURAN BOT ---
const NOMOR_BOT = '6285156906427'; 
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
            '--disable-gpu'
        ]
    }
});

client.on('qr', (qr) => {
    console.log('SCAN QR INI JIKA PAIRING GAGAL:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('----------------------------');
    console.log('Yui V.70 ONLINE! SIAP TEMPUR!');
    console.log('----------------------------');
});

client.on('message', async (msg) => {
    if (msg.body) {
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
        console.log('SEDANG MENGINISIALISASI BROWSER...');
        await client.initialize();
        
        // Jeda 10 detik biar halaman WA Web ke-load sempurna sebelum minta kode
        console.log('MENUNGGU KONEKSI STABIL (10 DETIK)...');
        setTimeout(async () => {
            try {
                console.log('MENGAMBIL KODE PAIRING UNTUK: ' + NOMOR_BOT);
                const pairingCode = await client.requestPairingCode(NOMOR_BOT);
                console.log('----------------------------');
                console.log('KODE PAIRING LU ADALAH: ' + pairingCode);
                console.log('----------------------------');
                console.log('Masukkan kode di atas ke WhatsApp HP lu!');
            } catch (err) {
                console.log('Gagal ambil kode, coba stop (CTRL+C) terus jalanin lagi.');
                console.log('Detail Error:', err.message);
            }
        }, 10000);

    } catch (err) {
        console.log('Gagal Inisialisasi:', err.message);
    }
}

startBot();
