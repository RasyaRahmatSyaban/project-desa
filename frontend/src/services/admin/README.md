# Layanan Admin (`frontend/src/services/admin/`)

Dokumen ini merangkum status penggunaan setiap file service di folder `frontend/src/services/admin/`.

## Ringkasan Penggunaan

- **APBDesServiceAdmin.jsx**
  - Digunakan oleh: `src/components/admin/APBDes.jsx`
  - Import: `import APBDesServiceAdmin from "../../services/admin/APBDesServiceAdmin";`

- **AdminServiceAdmin.jsx**
  - Digunakan oleh:
    - `src/pages/admin/AdminManagement.jsx`
    - `src/components/admin/SettingAdminComp.jsx`
  - Import: `import AdminServiceAdmin from "../../services/admin/AdminServiceAdmin";`

- **AparatServiceAdmin.jsx**
  - Digunakan oleh: `src/pages/admin/AparatAdmin.jsx`
  - Import: `import AparatServiceAdmin from "../../services/admin/AparatServiceAdmin";`

- **BeritaServiceAdmin.jsx**
  - Digunakan oleh: `src/pages/admin/BeritaAdmin.jsx`
  - Import: `import BeritaServiceAdmin from "../../services/admin/BeritaServiceAdmin";`

- **DashboardServiceAdmin.jsx**
  - Digunakan oleh: `src/pages/admin/BerandaAdmin.jsx`
  - Import: `import DashboardServiceAdmin from "../../services/admin/DashboardServiceAdmin";`

- **MediaServiceAdmin.jsx**
  - Digunakan oleh: `src/pages/admin/MediaAdmin.jsx`
  - Import: `import MediaService from "../../services/admin/MediaServiceAdm";`
  - Catatan: Penamaan file `MediaServiceAdm.jsx` cukup unik; pertimbangkan konsistensi (mis. `MediaServiceAdmin.jsx`).

- **PelayananServiceAdmin.jsx**
  - Digunakan oleh: `src/pages/admin/PelayananAdmin.jsx`
  - Import: `import PelayananServiceAdmin from "../../services/admin/PelayananServiceAdmin";`

- **PendudukServiceAdmin.jsx**
  - Digunakan oleh:
    - `src/components/admin/Penduduk.jsx`
    - `src/components/admin/DetailKeluarga.jsx`
  - Import: `import PendudukServiceAdmin from "../../services/admin/PendudukServiceAdmin";`

- **PengumumanServiceAdmin.jsx**
  - Digunakan oleh: `src/pages/admin/PengumumanAdmin.jsx`
  - Import: `import PengumumanServiceAdmin from "../../services/admin/PengumumanServiceAdmin";`

- **SuratServiceAdmin.jsx**
  - Digunakan oleh: `src/pages/admin/SuratAdmin.jsx`
  - Import: `import SuratService from "../../services/admin/SuratServiceAdmin";`


- **Lint & Deteksi**: Pertimbangkan menambah rule lint/skrip untuk mendeteksi import/file tak terpakai.

Terakhir diperbarui: 2025-08-30.
