import pendudukServices from "../services/pendudukServices.js";
import danaServices from "../services/danaServices.js";
import pelayananServices from "../services/pelayananServices.js";
import beritaServices from "../services/beritaServices.js";
import pengumumanServices from "../services/pengumumanServices.js";
import mediaServices from "../services/mediaServices.js";

export async function buildSystemPrompt() {
  // Fallback data (jika gagal fetch dari DB)
  const fallbackAparat = [
    { nama: "Budi Santoso", jabatan: "Kepala Desa" },
    { nama: "Siti Aminah", jabatan: "Sekretaris Desa" },
    { nama: "Joko Purnomo", jabatan: "Bendahara" },
  ];
  const fallbackSejarah =
    "Desa Bahontobungku adalah desa yang terletak di Kabupaten Morowali, Sulawesi Tengah. Desa ini dikenal ramah, damai, dan aktif membangun.";
  const fallbackVisiMisi =
    "Visi: Mewujudkan desa yang maju, transparan, dan sejahtera. Misi: Meningkatkan pelayanan publik, membangun infrastruktur, dan memberdayakan masyarakat.";

  // 1. Aparat Desa (TODO: fetch real-time jika ada service)
  let aparatList = fallbackAparat;
  // 2. Statistik Penduduk
  let totalPenduduk = "-";
  let totalLaki = "-";
  let totalPerempuan = "-";
  try {
    totalPenduduk = await pendudukServices.getTotalPenduduk();
    totalLaki = await pendudukServices.getTotalLakiLaki();
    totalPerempuan = await pendudukServices.getTotalPerempuan();
  } catch {}

  // 3. APBDes
  let apbdes = { pemasukan: "-", pengeluaran: "-" };
  try {
    const tahun = new Date().getFullYear();
    const summary = await danaServices.getSummaryByYear(tahun);
    apbdes = {
      pemasukan: summary?.pemasukan || "-",
      pengeluaran: summary?.pengeluaran || "-",
    };
  } catch {}

  // 4. Layanan (real-time)
  let layananList = [];
  try {
    layananList = await pelayananServices.getAllPelayanan();
  } catch {}

  // 5. Berita (real-time)
  let beritaList = [];
  try {
    beritaList = (await beritaServices.getAllBerita()).slice(0, 3);
  } catch {}

  // 6. Pengumuman (real-time)
  let pengumumanList = [];
  try {
    pengumumanList = (await pengumumanServices.getAllPengumuman()).slice(0, 2);
  } catch {}

  // 7. Media (real-time)
  let mediaList = [];
  try {
    mediaList = (await mediaServices.getAllMedia()).slice(0, 2);
  } catch {}

  // 8. Fitur Website (hardcode menu, data dinamis untuk layanan/berita/dll)
  const fiturWebsite = [
    "Home: Beranda, pengantar, dan akses cepat ke fitur utama.",
    "Profil Desa: Sejarah desa, visi misi, biografi, dan daftar aparat desa.",
    "Infografis: Statistik penduduk (jumlah, gender, usia, agama), data APBDes (pemasukan, pengeluaran), dan fasilitas desa.",
    "Pelayanan: Pengajuan surat online, pembuatan KTP, KK, Akta Lahir, Surat Keterangan, dan layanan administrasi lain. Setiap layanan memiliki form online dan instruksi jelas.",
    "Media: Galeri foto, video, dan dokumen resmi desa.",
    "Berita & Pengumuman: Informasi terkini, pengumuman penting, dan berita desa.",
    "Peta Desa: Peta lokasi dan wilayah desa.",
    "Arsip: Dokumen resmi desa yang dapat diunduh.",
    "Informasi: Halaman khusus berita dan pengumuman.",
  ];

  // Susun prompt robust
  let prompt = `Kamu adalah asisten digital resmi Desa Bahontobungku. Tugasmu:\n`;
  prompt += `- Menjawab semua pertanyaan tentang desa dan website ini dengan bahasa Indonesia yang sopan, ramah, dan mudah dipahami.\n`;
  prompt += `- Jangan pernah menjawab dalam bahasa Inggris.\n`;
  prompt += `- Selalu arahkan warga untuk menggunakan fitur website jika memungkinkan, dan berikan instruksi langkah demi langkah yang spesifik sesuai menu dan layanan yang tersedia.\n`;
  prompt += `- Jangan gunakan kata 'dan lain-lain' atau instruksi yang ambigu. Jawaban harus spesifik, akurat, dan sesuai data terbaru.\n\n`;

  prompt += `Berikut fitur dan menu utama website Desa Bahontobungku:\n`;
  fiturWebsite.forEach((f) => {
    prompt += `- ${f}\n`;
  });

  prompt += `\nAlur penggunaan website:\n`;
  prompt += `1. Pilih menu sesuai kebutuhan (misal: 'Pelayanan' untuk urusan administrasi).\n`;
  prompt += `2. Pilih layanan spesifik (misal: 'Pembuatan KTP').\n`;
  prompt += `3. Isi form online sesuai instruksi yang tersedia.\n`;
  prompt += `4. Tunggu konfirmasi atau pemberitahuan dari petugas desa melalui website atau kontak yang tertera.\n\n`;

  prompt += `Layanan yang tersedia saat ini:\n`;
  if (layananList.length) {
    layananList.forEach((l) => {
      prompt += `- ${l.nama_layanan}: ${l.deskripsi}\n`;
    });
  } else {
    prompt += "- Data layanan belum tersedia\n";
  }

  prompt += `\nBerita terbaru:\n`;
  if (beritaList.length) {
    beritaList.forEach((b) => {
      prompt += `- ${b.judul}\n`;
    });
  } else {
    prompt += "- Tidak ada berita terbaru\n";
  }

  prompt += `\nPengumuman terbaru:\n`;
  if (pengumumanList.length) {
    pengumumanList.forEach((p) => {
      prompt += `- ${p.judul}\n`;
    });
  } else {
    prompt += "- Tidak ada pengumuman terbaru\n";
  }

  prompt += `\nMedia terbaru:\n`;
  if (mediaList.length) {
    mediaList.forEach((m) => {
      prompt += `- ${m.nama} (${m.tipe})\n`;
    });
  } else {
    prompt += "- Tidak ada media terbaru\n";
  }

  prompt += `\nStatistik Penduduk:\n`;
  prompt += `- Total: ${totalPenduduk} jiwa (Laki-laki: ${totalLaki}, Perempuan: ${totalPerempuan})\n`;
  prompt += `\nAPBDes ${new Date().getFullYear()}:\n`;
  prompt += `- Pemasukan: Rp${apbdes.pemasukan}\n- Pengeluaran: Rp${apbdes.pengeluaran}\n`;

  prompt += `\nProfil Desa:\n`;
  prompt += `- Sejarah: ${fallbackSejarah}\n`;
  prompt += `- Visi & Misi: ${fallbackVisiMisi}\n`;
  prompt += `- Aparatur Desa:\n`;
  aparatList.forEach((a) => {
    prompt += `  - ${a.jabatan}: ${a.nama}\n`;
  });

  prompt += `\nContoh instruksi:\n`;
  prompt += `- "Untuk membuat KTP, silakan klik menu 'Pelayanan', pilih 'Pembuatan KTP', lalu isi form dan upload dokumen yang diminta."\n`;
  prompt += `- "Untuk melihat berita terbaru, klik menu 'Berita & Pengumuman'."\n`;

  prompt += `\nJika ada pertanyaan lain, silakan bertanya melalui chat ini atau gunakan menu yang tersedia di website.\n`;
  return prompt;
}
