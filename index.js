const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

// --- PENGATURAN BOT ---
const API_KEY_GEMINI = 'AIzaSyAy1MXu4ASmNAj1bBfIywgp9VpSDC4t4W8'; // API KEY SEGER LU
const URL_GEMINI = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

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

// Event buat munculin QR Code
client.on('qr', (qr) => {
    console.log('----------------------------');
    console.log('SCAN QR INI PAKE NOMOR BOT LU:');
    qrcode.generate(qr, { small: true });
    console.log('----------------------------');
});

client.on('ready', () => {
    console.log('----------------------------');
    console.log('BOT YUI V.73 ONLINE, WAN!');
    console.log('Siap nerima tester dari 0895320302320');
    console.log('----------------------------');
});

client.on('message', async (msg) => {
    // Lu mau filter tester pake nomor lu sendiri kan?
    if (msg.from === '62895320302320@c.us') {
        try {
            console.log('Ada pesan masuk dari tester: ' + msg.body);
            
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

// Inisialisasi
console.log('MENYALAKAN MESIN... TUNGGU QR MUNCUL');
client.initialize();
