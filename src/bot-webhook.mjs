/**
 * Server Webhook WhatsApp Bot untuk andreydigital.site
 * Menggunakan Fonnte Gateway + Auto-update ke laporan.json Kantor AI 3D
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LAPORAN_PATH = path.join(__dirname, 'laporan.json');

const PORT = 3000;

function prosesPesan(sender, message) {
  const q = (message || '').toLowerCase().trim();
  let reply = '';

  if (q.includes('harga') || q.includes('biaya') || q.includes('paket')) {
    reply = `Halo Kak! Terima kasih sudah menghubungi *andreydigital.site* 😊\n\nUntuk *Paket AI WhatsApp CS 24/7*:\n• Setup Awal: Rp1.500.000 (termasuk integrasi sistem & database pesanan)\n• Maintenance: Rp250.000/bln (monitoring 24/7 + server)\n\nBoleh tahu jenis bisnis Kakak saat ini agar kami rekomendasikan alur bot yang paling tepat?`;
  } else if (q.includes('demo') || q.includes('booking') || q.includes('jadwal') || q.includes('konsultasi')) {
    reply = `Tentu Kak! Kami sediakan sesi *Live Demo & Konsultasi Gratis* 1-on-1 via Google Meet.\n\nBoleh dibantu info Nama dan Jenis Usaha Kakak? Tim kami akan segera mengirimkan tautan jadwalnya.`;
  } else if (q.includes('sheets') || q.includes('pesanan') || q.includes('order') || q.includes('catat')) {
    reply = `Betul sekali Kak! Setiap ada pesanan masuk, AI akan otomatis mengekstrak nama, nomor telepon, dan item pesanan, lalu menyimpannya langsung ke *Google Sheets* tanpa perlu input manual.`;
  } else {
    reply = `Halo! Terima kasih telah menghubungi *andreydigital.site* — AI Automation Solutions 🚀\n\nSaya asisten virtual resmi yang aktif 24 jam nonstop. Ada yang bisa kami bantu seputar otomatisasi WhatsApp bisnis Anda hari ini?`;
  }

  // Update laporan.json kantor 3D secara realtime
  try {
    if (fs.existsSync(LAPORAN_PATH)) {
      const raw = fs.readFileSync(LAPORAN_PATH, 'utf-8');
      const data = JSON.parse(raw);
      data.admin = data.admin || {};
      data.admin.ringkasan = `Pesan baru masuk dari ${sender}: "${(message || '').slice(0, 45)}..."`;
      data.admin.angka = data.admin.angka || [];
      const chatMetric = data.admin.angka.find((m) => m.label === 'Chat dilayani');
      if (chatMetric) {
        const count = parseInt(chatMetric.nilai) || 0;
        chatMetric.nilai = `${count + 1} chat`;
      } else {
        data.admin.angka.push({ label: 'Chat dilayani', nilai: '1 chat' });
      }
      fs.writeFileSync(LAPORAN_PATH, JSON.stringify(data, null, 2));
      console.log(`[Kantor 3D] Laporan berhasil diperbarui dari chat ${sender}`);
    }
  } catch (err) {
    console.error('Gagal update laporan.json:', err.message);
  }

  return reply;
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        let sender = 'Pelanggan';
        let message = '';

        const contentType = req.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
          const json = JSON.parse(body || '{}');
          sender = json.sender || json.phone || 'Pelanggan';
          message = json.message || json.text || '';
        } else {
          const params = new URLSearchParams(body);
          sender = params.get('sender') || params.get('phone') || 'Pelanggan';
          message = params.get('message') || params.get('text') || '';
        }

        console.log(`[WA Masuk] Dari: ${sender} | Pesan: "${message}"`);
        const replyText = prosesPesan(sender, message);
        console.log(`[WA Balas] Ke: ${sender} | Balasan: "${replyText.slice(0, 50)}..."`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply: replyText }));
      } catch (e) {
        console.error('Error proses webhook:', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'active', service: 'andreydigital.site WhatsApp Bot Webhook' }));
  }
});

server.listen(PORT, () => {
  console.log(`✅ Webhook WhatsApp andreydigital.site aktif di http://localhost:${PORT}`);
});
