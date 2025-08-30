# Layanan User (`frontend/src/services/user/`)

Dokumen ini merangkum status penggunaan setiap file service di folder `frontend/src/services/user/`. Hasil audit: semua file saat ini **digunakan** di codebase.

## Ringkasan Penggunaan

- **APBDesServiceUser.jsx**
  - Digunakan oleh: `src/components/Infografis/APBDes.jsx`
  - Import: `import APBDesServiceUser from "../../services/user/APBDesServiceUser";`

- **AparatServiceUser.jsx**
  - Digunakan oleh: `src/components/ProfilDesa/CarouselProfil.jsx`
  - Import: `import AparatServiceUser from "../../services/user/AparatServiceUser";`

- **BeritaServiceUser.jsx**
  - Digunakan oleh:
    - `src/pages/Information.jsx`
    - `src/pages/BeritaDetail.jsx`
  - Import: `import BeritaServiceUser from "../services/user/BeritaServiceUser";`

- **ChatbotServiceUser.jsx**
  - Digunakan oleh: `src/components/FloatingChatbot.jsx`
  - Import: `import ChatbotServiceUser from "../services/user/ChatbotServiceUser";`

- **MediaServiceUser.jsx**
  - Digunakan oleh: `src/pages/Media.jsx`
  - Import: `import MediaServiceUser from "../services/user/MediaServiceUser";`
  - Catatan: Nama file jamak ("MediaServices") sementara alias import tunggal ("MediaService"). Disarankan konsisten.

- **PelayananServiceUser.jsx**
  - Digunakan oleh: `src/pages/Pelayanan.jsx`
  - Import: `import PelayananServiceUser from "../services/user/PelayananServiceUser";`

- **PendudukServiceUser.jsx**
  - Digunakan oleh:
    - `src/components/Infografis/Penduduk.jsx`
    - `src/components/Infografis/PendudukStats.jsx`
  - Import: `import PendudukServiceUser from "../../services/user/PendudukServiceUser";`

- **PengumumanServiceUser.jsx**
  - Digunakan oleh: `src/components/Pengumuman.jsx`
  - Import: `import PengumumanServiceUser from "../services/user/PengumumanServiceUser";`

- **SuratServiceUser.jsx**
  - Digunakan oleh: `src/pages/Arsip.jsx`
  - Import: `import SuratServiceUser from "../services/user/SuratServiceUser";`

- **authServiceUser.jsx**
  - Digunakan oleh:
    - `src/pages/admin/AdminManagement.jsx`
    - `src/components/admin/LogoutAdminDialog.jsx`
  - Import: `import { logout } from "../../services/user/authServiceUser";`

- **Lint & Test**: Tambahkan lint rule/tes untuk mendeteksi file tak terpakai di masa depan.

Terakhir diperbarui: 2025-08-30.
