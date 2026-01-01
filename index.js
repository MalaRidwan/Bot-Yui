const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

// --- 1. KONFIGURASI API GEMINI 2.0 FLASH ---
const API_KEY = "AIzaSyBzxNr68JjBPG4wNC9NK-hl9opRDQ1kBaw"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        handleSIGINT: false,
        // Konfigurasi ini buat bypass error library di Replit
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--single-process',
            '--no-zygote'
        ]
    }
});

const nomorPapa = '62895320302320@c.us';
const daftarMala = ['6282246827390@c.us', '6281343403421@c.us']; 

async function chatAI(pesan, instruksi) {
    try {
        await new Promise(resolve => setTimeout(resolve, 5000)); 
        const response = await axios.post(API_URL, {
            contents: [{ parts: [{ text: instruksi + "\n\nChat: " + pesan }] }]
        });
        if (response.data.candidates) {
            return response.data.candidates[0].content.parts[0].text;
        }
    } catch (err) {
        console.error("LOG GOOGLE:", err.response ? err.response.status : err.message);
        return null;
    }
}

client.on('qr', qr => {
    console.log('QR Code muncul (abaikan saja, kita pakai Pairing Code)...');
    qrcode.generate(qr, {small: true});
});

client.on('ready', async () => { 
    console.log('----------------------------');
    console.log('Yui Cloud Online! 🚀🧸'); 
    console.log('----------------------------');
    
    try {
        await client.sendMessage(nomorPapa, "Halo Papa! Yui V.68 udah Online. Tes respon dong!");
        console.log('Pesan perkenalan terkirim ke nomor Papa.');
    } catch (err) {
        console.log('Bot ready, tapi gagal kirim pesan awal.');
    }
});

client.on('message', async (msg) => {
    let prompt = "Lu Yui, asisten Papa Ridwan. Bahasa lu-gw santai.";
    if (msg.from === nomorPapa || daftarMala.includes(msg.from)) {
        const balasan = await chatAI(msg.body, prompt);
        if (balasan) msg.reply(balasan);
    }
});

client.initialize();

// --- JURUS PAIRING CODE (LOGIN VIA NOMOR 0851...) ---
setTimeout(async () => {
    try {
        const code = await client.getPairingCode('6285156906427'); 
        console.log('\n============================');
        console.log('MASUKIN KODE INI DI WA LU:');
        console.log('👉 ' + code + ' 👈');
        console.log('============================\n');
    } catch (err) {
        console.log('Gagal ambil Pairing Code. Cek Console buat error detail.');
    }
}, 10000);



