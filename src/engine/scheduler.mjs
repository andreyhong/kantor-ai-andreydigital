/**
 * Scheduler Siklus Otonom Mandiri · andreydigital.site
 * Menjalankan siklus kerja 3 agen secara periodik di latar belakang,
 * mengevaluasi hasil sendiri, memperbaiki diri sampai Grade A (>=90/100),
 * dan memperbarui Kantor AI 3D otomatis.
 */

import { jalankanSiklusOtonom } from './autonomous-loop.mjs';

const SEKTOR_LIST = [
  'Restoran & Bisnis Kuliner F&B (Order & Reservasi)',
  'Klinik Estetika & Dokter Gigi (Appointment & Reminder)',
  'Toko Online / Retail Fashion (FAQ & Order Automation)',
  'Jasa Servis & Bengkel Otomotif (Booking Servis & Estimasi)',
  'Agensi Properti & Real Estate (Lead Qualifying & Jadwal Survey)',
  'Katering & Event Organizer (Pricelist & Down Payment Automation)'
];

const INTERVAL_MENIT = 60; // Siklus baru setiap 1 jam

let nomorSiklus = 3;
let sektorIndex = 1;

console.log(`[Scheduler Otonom] Berjalan di latar belakang. Siklus berikutnya setiap ${INTERVAL_MENIT} menit.`);

setInterval(async () => {
  const sektor = SEKTOR_LIST[sektorIndex % SEKTOR_LIST.length];
  sektorIndex++;
  nomorSiklus++;

  console.log(`\n⏰ [Scheduler Trigger] Memulai Siklus Otonom #${nomorSiklus} untuk ${sektor}...`);
  try {
    await jalankanSiklusOtonom(nomorSiklus, sektor);
  } catch (err) {
    console.error(`[Scheduler Error]`, err.message);
  }
}, INTERVAL_MENIT * 60 * 1000);
