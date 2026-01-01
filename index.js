const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

// --- PENGATURAN BOT ---
const NOMOR_BOT = '6285156906427'; // Nomor Bot lu yang baru, Wan!
const API_KEY_GEMINI = 'AIzaSyBzxNr68JjBPG4wNC9NK-hl9opRDQ1kBaw'; 
const URL_GEMINI = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        handleSIGINT: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('SCAN QR INI JIKA PAIRING GAGAL:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot Yui V.68 udah Online, Wan! Siap layanin tester lu di 0895320302320.');
});

client.on('message', async (msg) => {
    // Bot cuma bales chat, lu bisa tes dari nomor tester lu tadi
    if (msg.body) {
        try {
            const response = await axios.post(`${URL_GEMINI}?key=${API_KEY_GEMINI}`, {
                contents: [{ parts: [{ text: msg.body }] }]
            });
            const aiReply = response.data.candidates[0].content.parts[0].text;
            msg.reply(aiReply);
        } catch (error) {
            console.error('Error Gemini:', error.response ? error.response.data : error.message);
        }
    }
});

async function startBot() {
    try {
        console.log('SEDANG MENGAMBIL KODE PAIRING UNTUK ' + NOMOR_BOT + '...');
        await client.initialize();
        const pairingCode = await client.requestPairingCode(NOMOR_BOT);
        console.log('----------------------------');
        console.log('KODE PAIRING LU ADALAH:', pairingCode);
        console.log('----------------------------');
        console.log('Buka WA Nomor Bot > Perangkat Tautan > Tautkan dg nomor telepon.');
    } catch (err) {
        console.log('Error detail:', err.message);
    }
}

startBot();
