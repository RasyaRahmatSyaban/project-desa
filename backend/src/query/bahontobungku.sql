-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 02, 2025 at 04:24 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bahontobungku`
--

-- --------------------------------------------------------

--
-- Table structure for table `aparatur`
--

CREATE TABLE `aparatur` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `nip` varchar(30) NOT NULL,
  `jabatan` varchar(100) NOT NULL,
  `foto` mediumblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `berita`
--

CREATE TABLE `berita` (
  `id` int(11) NOT NULL,
  `foto` varchar(255) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `isi` text NOT NULL,
  `tanggalTerbit` date NOT NULL,
  `penulis` varchar(100) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'Dipublikasi'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `berita`
--

INSERT INTO `berita` (`id`, `foto`, `judul`, `isi`, `tanggalTerbit`, `penulis`, `status`) VALUES
(17, '1742685090038.png', 'Teknologi AI Semakin Canggih, Mampukah Menggantikan Pekerjaan Manusia?', 'Kecerdasan buatan (AI) telah mengalami perkembangan pesat dalam beberapa dekade terakhir dan kini diterapkan di berbagai sektor, termasuk kesehatan, pendidikan, manufaktur, dan industri kreatif. Teknologi ini memungkinkan otomatisasi tugas-tugas rutin yang sebelumnya memerlukan campur tangan manusia, seperti pengolahan data besar (big data), layanan pelanggan melalui chatbot, hingga analisis prediktif di bidang kesehatan.\r\n\r\nMeskipun AI menawarkan efisiensi dan kecepatan yang luar biasa, muncul kekhawatiran mengenai potensi hilangnya pekerjaan manusia di beberapa sektor. Penelitian menunjukkan bahwa pekerjaan dengan tugas yang bersifat repetitif dan berbasis aturan cenderung paling rentan tergantikan oleh teknologi. Contohnya, pekerjaan di bidang administrasi, produksi pabrik, dan layanan pelanggan dapat diotomatisasi sebagian besar dengan sistem AI.\r\n\r\nNamun, para ahli menyatakan bahwa ada keterampilan manusia yang sulit ditiru oleh AI, seperti kreativitas, empati, dan pengambilan keputusan berbasis moral atau etika. Selain itu, pekerjaan yang melibatkan interaksi interpersonal yang kompleks—seperti psikologi, seni, dan manajemen strategis—masih sangat bergantung pada kemampuan manusia. Oleh karena itu, meskipun AI dapat mengotomatisasi banyak tugas, kemampuan berpikir kritis dan kreativitas manusia tetap tak tergantikan.\r\n\r\nUntuk menghadapi era digital ini, tenaga kerja diimbau untuk mengembangkan keterampilan baru yang sesuai dengan kebutuhan pasar kerja yang terus berubah. Pelatihan di bidang teknologi, analitik data, serta kemampuan komunikasi dan kolaborasi menjadi semakin penting agar tetap relevan di dunia kerja yang dipengaruhi oleh kecerdasan buatan.', '2025-03-21', 'amirul maulana', 'Dipublikasi'),
(18, '1742685253522.png', 'Pemerintah Luncurkan Program Digitalisasi Pendidikan 2025', 'Pemerintah Indonesia secara resmi meluncurkan program digitalisasi pendidikan yang ditargetkan akan berjalan penuh pada tahun 2025. Program ini merupakan bagian dari upaya pemerintah untuk meningkatkan literasi digital di kalangan siswa dan guru, terutama di daerah terpencil yang memiliki keterbatasan akses terhadap teknologi.\r\n\r\nDalam program ini, pemerintah berencana mendistribusikan perangkat elektronik seperti laptop, tablet, dan akses internet gratis ke lebih dari 10.000 sekolah di seluruh Indonesia. Selain itu, guru akan diberikan pelatihan intensif untuk meningkatkan kemampuan mereka dalam memanfaatkan teknologi digital dalam proses pembelajaran. Menteri Pendidikan menegaskan bahwa tujuan utama program ini adalah mengurangi kesenjangan akses teknologi di berbagai wilayah dan mempersiapkan generasi muda menghadapi tantangan di era digital.\r\n\r\nSebagai langkah awal, pemerintah telah memulai uji coba di beberapa provinsi dengan hasil yang cukup positif. Banyak siswa yang sebelumnya tidak memiliki akses ke perangkat teknologi kini dapat mengikuti pembelajaran daring dan mengakses sumber daya pendidikan global. Selain itu, kurikulum juga akan disesuaikan dengan kebutuhan industri masa depan, mencakup mata pelajaran seperti pemrograman dasar, keamanan siber, dan kecerdasan buatan.\r\n\r\nMasyarakat menyambut baik program ini, terutama di daerah terpencil yang selama ini mengalami kesulitan dalam mendapatkan akses pendidikan berkualitas. Meski demikian, tantangan tetap ada, termasuk perlunya infrastruktur teknologi yang memadai dan memastikan bahwa semua siswa memiliki kesempatan yang sama dalam mengakses teknologi.\r\n\r\n', '2024-06-21', 'fufufafa', 'Draft'),
(19, '1742685345794.png', ' Harga Bahan Pokok Naik, Masyarakat Mulai Khawatir', 'Kenaikan harga bahan pokok yang terjadi dalam beberapa bulan terakhir menimbulkan kekhawatiran di kalangan masyarakat. Barang-barang kebutuhan sehari-hari seperti beras, minyak goreng, gula, dan telur mengalami lonjakan harga yang signifikan, terutama di pasar tradisional. Banyak keluarga di Indonesia, khususnya di kalangan menengah ke bawah, merasa terbebani oleh meningkatnya biaya hidup.\r\n\r\nPedagang di pasar mengeluhkan berkurangnya daya beli konsumen akibat kenaikan harga ini. Seorang pedagang di Jakarta mengungkapkan bahwa penjualan mereka turun hingga 30% dalam sebulan terakhir karena masyarakat mulai berhemat. Selain itu, kelangkaan beberapa komoditas di daerah terpencil semakin memperburuk situasi, memaksa warga untuk membayar harga yang jauh lebih tinggi dari biasanya.\r\n\r\nPemerintah menyatakan telah mengambil langkah untuk menekan kenaikan harga melalui kebijakan operasi pasar dan subsidi. Kementerian Perdagangan bekerja sama dengan Bulog melakukan distribusi bahan pokok dengan harga terjangkau di berbagai wilayah terdampak. Meski demikian, banyak masyarakat yang berharap pemerintah dapat mengambil langkah yang lebih cepat dan efektif untuk meringankan beban ekonomi, terutama menjelang musim liburan akhir tahun yang biasanya memicu lonjakan harga lebih lanjut.\r\n\r\n', '2025-03-21', 'Admin', 'Dipublikasi'),
(20, '1742685435886.png', 'Startup Lokal Raih Pendanaan Rp50 Miliar untuk Ekspansi', 'Sebuah startup teknologi kesehatan asal Indonesia baru-baru ini berhasil mengamankan pendanaan seri B sebesar Rp50 miliar dari sejumlah investor terkemuka. Pendanaan ini akan digunakan untuk memperluas jangkauan layanan telemedisin ke daerah-daerah terpencil yang masih minim akses terhadap fasilitas kesehatan.\r\n\r\nPerusahaan ini berfokus pada penyediaan layanan konsultasi medis secara daring (telemedicine) yang memungkinkan pasien di berbagai daerah untuk berkonsultasi dengan dokter tanpa harus datang ke rumah sakit. CEO startup tersebut menyatakan bahwa dengan pendanaan ini, mereka akan meningkatkan infrastruktur teknologi berbasis kecerdasan buatan (AI) untuk membantu proses diagnosa yang lebih akurat dan cepat.\r\n\r\nSelain memperluas jangkauan, perusahaan berencana meluncurkan fitur baru berupa layanan pemantauan kesehatan jarak jauh untuk pasien dengan penyakit kronis seperti diabetes dan hipertensi. Langkah ini diharapkan dapat membantu mengurangi beban rumah sakit dan memberikan solusi praktis bagi pasien yang membutuhkan perawatan berkelanjutan.\r\n\r\nKeberhasilan mendapatkan pendanaan ini menunjukkan bahwa sektor teknologi kesehatan di Indonesia memiliki potensi besar untuk berkembang, terutama di tengah meningkatnya kebutuhan layanan kesehatan yang efisien dan terjangkau.', '2025-03-22', 'Admin', 'Dipublikasi'),
(21, '1742685507703.png', 'Kompetisi Coding Nasional Menarik Ribuan Peserta', 'Kompetisi coding nasional tahun ini berhasil menarik perhatian ribuan peserta dari seluruh Indonesia, mulai dari pelajar sekolah menengah hingga profesional di bidang teknologi. Acara ini bertujuan untuk mengembangkan keterampilan pemrograman dan mendorong inovasi di kalangan generasi muda yang tertarik di bidang teknologi informasi.\r\n\r\nDalam kompetisi ini, peserta dihadapkan pada berbagai tantangan pemrograman, termasuk pengembangan aplikasi berbasis kecerdasan buatan, keamanan siber, dan analisis data besar (big data). Selain memperebutkan hadiah uang tunai dan perangkat teknologi canggih, pemenang utama akan mendapatkan kesempatan untuk magang di beberapa perusahaan teknologi terkemuka di Indonesia.\r\n\r\nSalah satu juri kompetisi menyatakan bahwa kualitas peserta tahun ini mengalami peningkatan signifikan, terutama dalam kemampuan pemecahan masalah dan kreativitas dalam menciptakan solusi teknologi. Kompetisi ini diharapkan tidak hanya menjadi ajang unjuk kemampuan tetapi juga menjadi wadah untuk membangun jaringan profesional dan membuka peluang karier di masa depan.\r\n\r\nDengan meningkatnya minat terhadap bidang teknologi, diharapkan kompetisi seperti ini dapat terus berkembang dan menjadi batu loncatan bagi talenta-talenta muda Indonesia untuk bersaing di tingkat global.', '2025-03-22', 'anus', 'Dipublikasi'),
(22, '1742685662203.png', 'Pemerintah Siapkan Regulasi Ketat untuk Melawan Kejahatan Siber', 'Dalam menghadapi meningkatnya ancaman kejahatan siber, pemerintah Indonesia tengah mempersiapkan regulasi baru yang bertujuan melindungi data pribadi dan memperkuat keamanan digital nasional. Langkah ini diambil sebagai respons terhadap maraknya kasus peretasan dan kebocoran data yang merugikan masyarakat serta institusi pemerintah.\r\n\r\nMenteri Komunikasi dan Informatika menyatakan bahwa regulasi baru ini akan mencakup aturan ketat mengenai perlindungan data pengguna, kewajiban perusahaan digital untuk melaporkan insiden siber, dan sanksi berat bagi pihak yang terbukti melakukan pelanggaran. Selain itu, pemerintah akan membentuk lembaga khusus yang bertugas memantau dan merespons ancaman siber secara cepat dan efektif.\r\n\r\nPara ahli keamanan siber menyambut baik inisiatif ini, namun menekankan pentingnya kolaborasi antara sektor publik dan swasta untuk menciptakan ekosistem digital yang aman. Edukasi kepada masyarakat mengenai praktik keamanan siber, seperti penggunaan kata sandi yang kuat dan kewaspadaan terhadap phishing, juga dinilai krusial dalam mencegah kejahatan digital di masa depan.\r\n\r\nDengan regulasi ini, diharapkan Indonesia dapat memperkuat pertahanan siber nasional dan memberikan perlindungan yang lebih baik bagi warga di era digital yang terus berkembang.\r\n\r\n', '2025-03-22', 'Admin', 'Dipublikasi'),
(23, '1742706506913.png', 'Inovasi Energi Terbarukan di Indonesia Semakin Berkembang', ' Indonesia terus mendorong inovasi di bidang energi terbarukan sebagai bagian dari upaya mengurangi ketergantungan pada bahan bakar fosil dan menjaga kelestarian lingkungan. Pemerintah menargetkan 23% dari total energi nasional berasal dari sumber terbarukan pada tahun 2025, termasuk energi surya, angin, biomassa, dan hidroelektrik.\r\n\r\nSejumlah proyek besar di sektor ini mulai menunjukkan hasil positif. Salah satunya adalah pembangunan Pembangkit Listrik Tenaga Surya (PLTS) terapung di Cirata, Jawa Barat, yang menjadi PLTS terapung terbesar di Asia Tenggara. Proyek ini diharapkan dapat menyediakan energi bersih bagi ratusan ribu rumah tangga dan mengurangi emisi karbon secara signifikan.\r\n\r\nSelain itu, startup lokal juga berperan dalam mempercepat transisi energi bersih. Beberapa di antaranya mengembangkan teknologi panel surya berbasis Internet of Things (IoT) yang memungkinkan pemantauan konsumsi energi secara real-time. Dengan dukungan kebijakan yang tepat dan investasi berkelanjutan, Indonesia memiliki potensi besar menjadi pemimpin energi terbarukan di kawasan Asia Tenggara.', '2025-03-22', 'Admin', 'Dipublikasi'),
(24, '1742706593367.png', ' Generasi Z Semakin Dominan di Pasar Kerja, Apa Dampaknya?', 'Generasi Z, yang lahir antara tahun 1997 hingga 2012, kini mulai memasuki pasar kerja secara masif dan membawa perubahan signifikan dalam budaya kerja di berbagai perusahaan. Dengan karakteristik yang adaptif terhadap teknologi, mereka cenderung mengutamakan fleksibilitas, keseimbangan kerja-hidup (work-life balance), dan lingkungan kerja yang inklusif.\r\n\r\nStudi terbaru menunjukkan bahwa perusahaan yang menawarkan kebijakan kerja hybrid atau remote lebih diminati oleh generasi ini. Mereka juga menghargai transparansi, kesempatan pengembangan diri, dan budaya kerja yang mendukung kesehatan mental.\r\n\r\nNamun, kehadiran Generasi Z juga menantang model kerja tradisional. Banyak organisasi perlu menyesuaikan strategi manajemen dan komunikasi agar dapat memaksimalkan potensi mereka. Dengan kemampuan digital yang tinggi dan pendekatan inovatif, Generasi Z diyakini mampu mendorong transformasi bisnis dan menciptakan cara kerja yang lebih efisien dan modern di masa depan.', '2025-03-22', 'Admin', 'Dipublikasi'),
(25, '1742706692707.png', 'Industri Game di Indonesia Tumbuh Pesat, Peluang Karier Meningkat', 'Industri game di Indonesia mengalami pertumbuhan pesat dalam beberapa tahun terakhir, didorong oleh meningkatnya jumlah pemain dan dukungan pemerintah terhadap ekosistem ekonomi kreatif. Data dari Asosiasi Game Indonesia (AGI) menunjukkan bahwa pendapatan industri game di Indonesia mencapai triliunan rupiah setiap tahunnya, dengan mayoritas berasal dari game berbasis mobile.\r\n\r\nPertumbuhan ini membuka peluang karier baru di berbagai bidang, seperti pengembangan game, desain grafis, manajemen komunitas, dan eSports. Banyak pengembang lokal kini mulai menarik perhatian global dengan menghasilkan game yang tidak hanya memiliki kualitas tinggi tetapi juga mengangkat budaya Indonesia.\r\n\r\nPemerintah, melalui program Digital Talent Scholarship, turut memberikan pelatihan di bidang pengembangan game untuk menciptakan talenta lokal yang kompetitif. Dengan dukungan yang berkelanjutan, Indonesia berpotensi menjadi pemain utama di kancah industri game global dan menciptakan ribuan lapangan kerja baru di masa depan.\r\n\r\n10. Judul: Kesehatan Mental di Kalangan Mahasiswa Jadi Sorotan Serius\r\nIsi: Kesehatan mental di kalangan mahasiswa menjadi perhatian utama seiring dengan meningkatnya tekanan akademik dan tuntutan sosial. Penelitian menunjukkan bahwa lebih dari 60% mahasiswa di Indonesia mengalami stres, kecemasan, atau depresi ringan hingga berat selama masa studi mereka.\r\n\r\nFaktor utama yang berkontribusi terhadap masalah ini meliputi beban tugas yang berat, ekspektasi tinggi dari keluarga, dan kesulitan dalam menyeimbangkan kehidupan pribadi serta akademik. Selain itu, pandemi COVID-19 memperburuk kondisi ini dengan isolasi sosial dan ketidakpastian masa depan.\r\n\r\nSebagai respons, banyak perguruan tinggi mulai menyediakan layanan konseling gratis dan ruang aman bagi mahasiswa untuk membicarakan masalah mereka. Pakar kesehatan mental mendorong pentingnya edukasi dan kampanye kesadaran mental di lingkungan kampus guna menciptakan suasana yang lebih mendukung dan inklusif.\r\n\r\nDiharapkan, dengan perhatian yang lebih besar terhadap kesehatan mental, mahasiswa dapat menyelesaikan pendidikan mereka dengan kondisi fisik dan mental yang lebih baik, siap menghadapi tantangan di masa depan.', '2025-03-23', 'Admin', 'Dipublikasi');

-- --------------------------------------------------------

--
-- Table structure for table `danakeluar`
--

CREATE TABLE `danakeluar` (
  `id` int(11) NOT NULL,
  `tahun` int(11) NOT NULL,
  `bulan` int(11) NOT NULL,
  `jumlah` decimal(15,2) NOT NULL,
  `kategori` varchar(255) NOT NULL,
  `keterangan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `danakeluar`
--

INSERT INTO `danakeluar` (`id`, `tahun`, `bulan`, `jumlah`, `kategori`, `keterangan`, `created_at`, `updated_at`) VALUES
(1, 2025, 1, 1000000.00, 'perbaikan fasilitas', 'tambal jalan', '2025-03-18 12:31:15', '2025-03-18 12:31:15'),
(2, 2025, 2, 12000000.00, 'perbaikan fasilitas', 'tambal jalan', '2025-03-18 12:31:20', '2025-03-18 12:31:20');

-- --------------------------------------------------------

--
-- Table structure for table `danamasuk`
--

CREATE TABLE `danamasuk` (
  `id` int(11) NOT NULL,
  `tahun` int(11) NOT NULL,
  `bulan` int(11) NOT NULL,
  `jumlah` decimal(15,2) NOT NULL,
  `sumber` varchar(255) NOT NULL,
  `keterangan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `danamasuk`
--

INSERT INTO `danamasuk` (`id`, `tahun`, `bulan`, `jumlah`, `sumber`, `keterangan`, `created_at`, `updated_at`) VALUES
(1, 2025, 1, 5000000.00, 'Dana Desa', 'Bantuan dari pemerintah', '2025-03-18 12:30:22', '2025-03-18 12:30:22'),
(2, 2025, 2, 23000000.00, 'Dana Desa', 'Bantuan dari pemerintah', '2025-03-18 12:30:28', '2025-03-18 12:31:33');

-- --------------------------------------------------------

--
-- Table structure for table `kepalakeluarga`
--

CREATE TABLE `kepalakeluarga` (
  `id` int(10) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `nik` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kepalakeluarga`
--

INSERT INTO `kepalakeluarga` (`id`, `nama`, `nik`) VALUES
(2, 'Talo', '7829836512009'),
(4, 'Rasya', '1234567890123456');

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `tipe` enum('foto','video','dokumen') NOT NULL,
  `file` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `media`
--

INSERT INTO `media` (`id`, `nama`, `tipe`, `file`, `deskripsi`, `thumbnail`, `created_at`, `updated_at`) VALUES
(39, 'Organisasi Siswa Intra Madrasah', 'foto', '1742682918625.png', 'Siswi madrasah sedang melaksanakan sholat secara berjamaah', NULL, '2025-03-22 22:35:18', '2025-03-22 22:35:18'),
(40, 'Himpunan Mahasiswa Teknik Informatika Universitas Tadulako', 'foto', '1742683022801.png', 'Kegiatan Mahasiswa HMTI', NULL, '2025-03-22 22:37:02', '2025-03-22 22:37:02'),
(41, 'Valorant', 'foto', '1742683076843.png', 'Balita Di desa bahontobungku bermain valo', NULL, '2025-03-22 22:37:56', '2025-03-22 22:37:56'),
(42, 'Genshin Impact', 'video', '1742683143267.mp4', 'komunitas lansia di desa bahontobungku bermain genshin impact', '1742683143288.jpg', '2025-03-22 22:39:03', '2025-03-22 22:39:03'),
(43, 'Dokumen peresmian website', 'dokumen', '1742683236833.pdf', 'dokumen berisi tanda tangan kontrak peresmian website desa', NULL, '2025-03-22 22:40:36', '2025-03-22 22:40:36'),
(44, 'Amirul Maulana', 'foto', '1742683358580.png', 'foto amirul maulana', NULL, '2025-03-22 22:42:38', '2025-03-22 22:42:38'),
(45, 'pemukulan pencuri', 'video', '1742683466944.mp4', 'warga desa bahontobungku menghajar pencuri', '1742683467173.jpg', '2025-03-22 22:44:27', '2025-03-22 22:44:27'),
(46, 'surat peresmian UU TNI', 'dokumen', '1742683560570.pdf', 'surat berisi peresmian UU TNI', NULL, '2025-03-22 22:46:00', '2025-03-22 22:46:00'),
(47, 'Pusat Informasi Dan Konseling Remaja', 'dokumen', '1742683619249.pdf', 'Dokumen berisi fadhil akmal', NULL, '2025-03-22 22:46:59', '2025-03-22 22:46:59'),
(48, 'Surat cinta untuk starla', 'dokumen', '1742683650852.pdf', 'last child', NULL, '2025-03-22 22:47:30', '2025-03-22 22:47:30'),
(49, 'Gotong royong', 'video', '1742683741301.mp4', 'dokumentasi kegiatan gotong royong', '1742683741555.jpg', '2025-03-22 22:49:01', '2025-03-22 22:49:01'),
(50, 'pemakaman pendukung barca', 'video', '1742683801359.mp4', 'halaa madrid', '1742683801362.jpg', '2025-03-22 22:50:01', '2025-03-22 22:50:01');

-- --------------------------------------------------------

--
-- Table structure for table `pelayanan`
--

CREATE TABLE `pelayanan` (
  `id` int(11) NOT NULL,
  `nama_layanan` varchar(255) NOT NULL,
  `kategori` enum('Dokumen Identitas','Kependudukan','Pencatatan Sipil') NOT NULL,
  `deskripsi` text NOT NULL,
  `link_google_form` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pelayanan`
--

INSERT INTO `pelayanan` (`id`, `nama_layanan`, `kategori`, `deskripsi`, `link_google_form`, `created_at`, `updated_at`) VALUES
(1, 'Akta Lahir', 'Dokumen Identitas', 'Bl bla bla bla', 'inilink.biyly', '2025-03-19 22:24:24', '2025-03-19 22:26:32'),
(2, 'Surat Keterangan apalah', 'Kependudukan', 'Bl bla bla bla', 'inilink.biyly', '2025-03-19 22:25:10', '2025-03-19 22:25:10'),
(3, 'Surat Keterangan apalahhhh', 'Pencatatan Sipil', 'Bl bla bla bla', 'inilink.biyly', '2025-03-19 22:25:49', '2025-03-21 06:01:43'),
(5, 'Pembuatan KTP', 'Dokumen Identitas', 'anu', 'https//anjayya', '2025-03-21 06:02:17', '2025-03-21 19:41:13'),
(6, 'aaaaa', 'Kependudukan', 'aaaa', 'aaa', '2025-03-21 19:41:30', '2025-03-21 19:41:30');

-- --------------------------------------------------------

--
-- Table structure for table `penduduk`
--

CREATE TABLE `penduduk` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `nik` varchar(16) NOT NULL,
  `alamat` text NOT NULL,
  `tanggalLahir` date NOT NULL,
  `jenisKelamin` enum('Laki-laki','Perempuan') NOT NULL,
  `agama` varchar(50) NOT NULL,
  `id_kepalakeluarga` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `penduduk`
--

INSERT INTO `penduduk` (`id`, `nama`, `nik`, `alamat`, `tanggalLahir`, `jenisKelamin`, `agama`, `id_kepalakeluarga`) VALUES
(2, 'Rasya', '72102380232', 'Jl. Jalanan , Palu', '2025-03-20', 'Perempuan', 'Hindu', 2),
(3, 'Nia Ramadhani', '721112380232', 'Jl. Bawah Atas No. 10, Palu', '2002-12-24', 'Perempuan', 'kristen', NULL),
(4, 'Fadhil Akmal', '7211123822322', 'Jl. Atas Bawah No. 10, Palu', '2002-03-24', 'Laki-laki', 'kristen', NULL),
(5, 'Mirul', '721112382232', 'Jl. Jalanan , Palu', '2001-12-12', 'Laki-laki', 'kristen', NULL),
(8, 'Mirul', '7211123822132', 'Jl. Jalanan , Palu', '2001-12-12', 'Laki-laki', 'kristen', NULL),
(9, 'Mirul Maula', '72111238221322', 'Jl. Jalanan , Palu', '2001-12-12', 'Laki-laki', 'kristen', NULL),
(10, 'mirul', '1234567890123456', 'Jl. Merdeka No. 1', '1990-01-01', 'Laki-laki', 'Islam', 4),
(14, 'mirul', '912679032461234', 'Jl. Merdeka No. 1', '1990-01-01', 'Laki-laki', 'Islam', 4),
(15, 'mirul', '91267903461234', 'Jl. Merdeka No. 1', '1990-01-01', 'Laki-laki', 'Islam', 4);

-- --------------------------------------------------------

--
-- Table structure for table `pengumuman`
--

CREATE TABLE `pengumuman` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `isi` text NOT NULL,
  `tanggalMulai` date NOT NULL,
  `tanggalSelesai` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pengumuman`
--

INSERT INTO `pengumuman` (`id`, `judul`, `isi`, `tanggalMulai`, `tanggalSelesai`) VALUES
(5, 'Pelayanan pembuatan KTP saat ini masih ditinjau karena ada kesalahan sistem', 'mohon maaf atas ketidak nyamanan masyarakat terkait proses pelayanan pembuatan kartu tanda penduduk pada website ini karena sedang dilakukan maintenance rutin', '2025-03-23', '2025-03-30'),
(6, 'Teknologi AI Semakin Canggih, Mampukah Menggantikan Pekerjaan Manusia?', 'tidak', '2025-03-23', '2025-03-30');

-- --------------------------------------------------------

--
-- Table structure for table `suratkeluar`
--

CREATE TABLE `suratkeluar` (
  `id` int(11) NOT NULL,
  `nomorSurat` varchar(50) NOT NULL,
  `penerima` varchar(100) NOT NULL,
  `perihal` text NOT NULL,
  `tanggalKirim` date NOT NULL,
  `file` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suratkeluar`
--

INSERT INTO `suratkeluar` (`id`, `nomorSurat`, `penerima`, `perihal`, `tanggalKirim`, `file`) VALUES
(5, 'SK/2024/001	', 'Kementerian Pendidikan', 'Balasan Permohonan Data Mahasiswa	', '2025-03-22', '1742684444018.pdf'),
(6, 'SK/2024/003	', 'Universitas Tadulako', 'Konfirmasi Penerimaan Proposal	', '2025-03-22', '1742684528019.pdf');

-- --------------------------------------------------------

--
-- Table structure for table `suratmasuk`
--

CREATE TABLE `suratmasuk` (
  `id` int(11) NOT NULL,
  `nomorSurat` varchar(50) NOT NULL,
  `pengirim` varchar(100) NOT NULL,
  `perihal` text NOT NULL,
  `tanggalTerima` date NOT NULL,
  `file` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suratmasuk`
--

INSERT INTO `suratmasuk` (`id`, `nomorSurat`, `pengirim`, `perihal`, `tanggalTerima`, `file`) VALUES
(18, 'SM/2024/001', 'Dinas Pendidikan', 'Undangan Rapat Koordinasi', '2025-03-22', '1742684094007.pdf'),
(19, 'SM/2024/002', 'Kementerian Pendidikan', 'Permohonan Data Mahasiswa', '2025-03-22', '1742684123515.pdf'),
(20, 'SM/2024/003', 'PT. Telekomunikasi', 'Pemberitahuan Pemeliharaan Sistem', '2025-03-22', '1742684152760.pdf'),
(21, 'SM/2024/004	', 'PT. Sumber Makmur', 'Konfirmasi Pesanan Alat Tulis', '2025-03-22', '1742684187460.pdf'),
(22, 'SM/2024/005', 'Universitas Indonesia', 'Permohonan Izin Penelitian', '2025-03-22', '1742684218228.pdf'),
(23, 'SM/2024/006', 'Divisi Keuangan', 'Laporan Hasil Audit Internal', '2025-03-22', '1742684246847.pdf'),
(24, 'SM/2024/007	', 'PT. Cipta Abadi', 'Pengajuan Kerjasama', '2025-03-22', '1742684279230.pdf'),
(25, 'SM/2024/008	', 'Badan Kepegawaian', 'Permintaan Data Kepegawaian	', '2025-03-22', '1742684308435.pdf'),
(26, 'SM/2024/009	', 'Universitas Gadjah Mada', 'Undangan Seminar Nasional	', '2025-03-22', '1742684335577.pdf'),
(27, 'SM/2024/010	', 'Lembaga Pelatihan', 'Informasi Jadwal Pelatihan	', '2025-03-22', '1742684406246.pdf'),
(28, 'SK/2024/002', 'PT. Bina Sejahtera', 'Undangan Rapat Evaluasi	', '2025-03-22', '1742684481291.pdf'),
(29, 'SK/2024/004	', 'Dinas Sosial', 'Permohonan Dukungan Kegiatan	', '2025-03-22', '1742684557994.pdf'),
(30, 'SK/2024/005	', 'PT. Citra Karya', 'Penawaran Kerjasama	', '2025-03-22', '1742684582882.pdf');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `nama`, `email`, `password`) VALUES
(1, 'admin', 'bahontobungku@gmail.com', '$2b$10$0lhM4fnWmiuHUIK.KW0pJONH/ovPl4yQVErHW24NrCCc6w4xrBMAO');

-- Tambahan untuk fitur manajemen admin/user (role & last_login)
ALTER TABLE `user`
  ADD COLUMN `role` ENUM('superadmin', 'admin') NOT NULL DEFAULT 'admin',
  ADD COLUMN `last_login` DATETIME DEFAULT NULL;

-- Pastikan ada minimal satu superadmin (update user utama)
UPDATE `user` SET `role` = 'superadmin' WHERE `email` = 'bahontobungku@gmail.com';

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aparatur`
--
ALTER TABLE `aparatur`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `berita`
--
ALTER TABLE `berita`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `danakeluar`
--
ALTER TABLE `danakeluar`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `danamasuk`
--
ALTER TABLE `danamasuk`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kepalakeluarga`
--
ALTER TABLE `kepalakeluarga`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pelayanan`
--
ALTER TABLE `pelayanan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `penduduk`
--
ALTER TABLE `penduduk`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nik` (`nik`),
  ADD KEY `fk_kepalakeluarga` (`id_kepalakeluarga`);

--
-- Indexes for table `pengumuman`
--
ALTER TABLE `pengumuman`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `suratkeluar`
--
ALTER TABLE `suratkeluar`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nomorSurat` (`nomorSurat`);

--
-- Indexes for table `suratmasuk`
--
ALTER TABLE `suratmasuk`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nomorSurat` (`nomorSurat`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `aparatur`
--
ALTER TABLE `aparatur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `berita`
--
ALTER TABLE `berita`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `danakeluar`
--
ALTER TABLE `danakeluar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `danamasuk`
--
ALTER TABLE `danamasuk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `kepalakeluarga`
--
ALTER TABLE `kepalakeluarga`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `pelayanan`
--
ALTER TABLE `pelayanan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `penduduk`
--
ALTER TABLE `penduduk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `pengumuman`
--
ALTER TABLE `pengumuman`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `suratkeluar`
--
ALTER TABLE `suratkeluar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `suratmasuk`
--
ALTER TABLE `suratmasuk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `penduduk`
--
ALTER TABLE `penduduk`
  ADD CONSTRAINT `fk_kepalakeluarga` FOREIGN KEY (`id_kepalakeluarga`) REFERENCES `kepalakeluarga` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
