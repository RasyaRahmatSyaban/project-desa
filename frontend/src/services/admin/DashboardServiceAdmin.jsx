import BeritaServiceAdmin from "./BeritaServiceAdmin";
import PelayananServiceAdmin from "./PelayananServiceAdmin";
import PengumumanServiceAdmin from "./PengumumanServiceAdmin";
import SuratServiceAdmin from "./SuratServiceAdmin";
import MediaServiceAdmin from "./MediaServiceAdmin";

const DashboardServiceAdmin = {
  // Fetch all summary data for dashboard
  getDashboardSummary: async () => {
    try {
      // Fetch data in parallel for better performance
      const [beritaData, pelayananData, pengumumanData, suratData, mediaData] =
        await Promise.all([
          BeritaServiceAdmin.getAllBerita(),
          PelayananServiceAdmin.getAllPelayanan(),
          PengumumanServiceAdmin.getAllPengumuman(),
          SuratServiceAdmin.getAllSurat(),
          MediaServiceAdmin.getAllMedia(),
        ]);

      // Process berita data
      const beritaSummary = {
        total: beritaData.length,
        published: beritaData.filter((item) => item.status === "Dipublikasi")
          .length,
        draft: beritaData.filter((item) => item.status === "Draft").length,
        recent: beritaData.slice(0, 3).map((item) => ({
          id: item.id,
          judul: item.judul,
          kategori: item.kategori || "Umum",
          tanggal: item.tanggalTerbit,
          status: item.status || "Dipublikasi",
        })),
        byCategory: processBeritaCategories(beritaData),
      };

      // Process pelayanan data
      const pelayananSummary = {
        total: pelayananData.length,
        dokumenIdentitas: pelayananData.filter(
          (item) => item.kategori === "Dokumen Identitas"
        ).length,
        kependudukan: pelayananData.filter(
          (item) => item.kategori === "Kependudukan"
        ).length,
        pencatatanSipil: pelayananData.filter(
          (item) => item.kategori === "Pencatatan Sipil"
        ).length,
      };

      // Process pengumuman data
      const pengumumanSummary = {
        total: pengumumanData.length,
        active: pengumumanData.filter(
          (item) => new Date(item.tanggalSelesai) >= new Date()
        ).length,
        expired: pengumumanData.filter(
          (item) => new Date(item.tanggalSelesai) < new Date()
        ).length,
        recent: pengumumanData.slice(0, 3).map((item) => ({
          id: item.id,
          judul: item.judul,
          kategori: "Informasi", // Default category if not available
          tanggal: item.tanggalMulai,
          status:
            new Date(item.tanggalSelesai) < new Date() ? "Kadaluarsa" : "Aktif",
        })),
        byPriority: [
          { priority: "Tinggi", count: 2 }, // Placeholder data
          { priority: "Sedang", count: 2 },
          { priority: "Rendah", count: 1 },
        ],
      };

      // Process surat data
      const suratSummary = {
        total: suratData.length,
        masuk: suratData.filter((item) => item.jenis === "Surat Masuk").length,
        keluar: suratData.filter((item) => item.jenis === "Surat Keluar")
          .length,
        recent: suratData.slice(0, 3).map((item) => ({
          id: item.id,
          jenis: item.jenis,
          nomor: item.nomor,
          perihal: item.perihal,
          tanggal: item.tanggal,
          status:
            item.status ||
            (item.jenis === "Surat Masuk" ? "Diterima" : "Terkirim"),
        })),
        byMonth: processSuratByMonth(suratData),
      };

      // Process media data
      const mediaSummary = {
        total: mediaData.length,
        foto: mediaData.filter((item) => item.tipe === "foto").length,
        video: mediaData.filter((item) => item.tipe === "video").length,
        dokumen: mediaData.filter((item) => item.tipe === "dokumen").length,
      };

      // Generate alerts
      const alerts = generatealerts(pengumumanData, beritaData);

      return {
        berita: beritaSummary,
        pelayanan: pelayananSummary,
        pengumuman: pengumumanSummary,
        surat: suratSummary,
        media: mediaSummary,
        alerts,
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  },
};

// Helper function to process berita categories
function processBeritaCategories(beritaData) {
  const categories = {};

  beritaData.forEach((item) => {
    const category = item.kategori || "Umum";
    if (categories[category]) {
      categories[category]++;
    } else {
      categories[category] = 1;
    }
  });

  return Object.keys(categories).map((category) => ({
    category,
    count: categories[category],
  }));
}

// Helper function to process surat by month
function processSuratByMonth(suratData) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const currentYear = new Date().getFullYear();
  const monthlyCounts = Array(12).fill(0);

  suratData.forEach((item) => {
    const date = new Date(item.tanggal);
    if (date.getFullYear() === currentYear) {
      monthlyCounts[date.getMonth()]++;
    }
  });

  return months
    .map((month, index) => ({
      month,
      count: monthlyCounts[index],
    }))
    .slice(0, 6); // Return only first 6 months
}

// Helper function to generate alerts
function generatealerts(pengumumanData, beritaData) {
  const alerts = [];

  // Check for expiring announcements
  const expiringAnnouncements = pengumumanData.filter((item) => {
    const expiryDate = new Date(item.tanggalSelesai);
    const today = new Date();
    const daysUntilExpiry = Math.floor(
      (expiryDate - today) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry >= 0 && daysUntilExpiry <= 3;
  });

  if (expiringAnnouncements.length > 0) {
    alerts.push({
      id: 1,
      type: "warning",
      message: `${expiringAnnouncements.length} pengumuman akan kadaluarsa dalam 3 hari`,
      link: "/admin/pengumuman",
    });
  }

  // Check for recent news
  const currentMonth = new Date().getMonth();
  const recentNews = beritaData.filter((item) => {
    const newsDate = new Date(item.tanggalTerbit);
    return newsDate.getMonth() === currentMonth;
  });

  if (recentNews.length > 0) {
    alerts.push({
      id: 2,
      type: "info",
      message: `${recentNews.length} berita baru ditambahkan bulan ini`,
      link: "/admin/berita",
    });
  }

  return alerts;
}

export default DashboardServiceAdmin;
