class UserDTO {
  constructor(id, nama, email, token, role, last_login) {
    this.id = id;
    this.nama = nama;
    this.email = email;
    this.token = token;
    this.role = role;
    this.last_login = last_login;
  }
}

class PendudukDTO {
  constructor(
    id,
    nama,
    nik,
    alamat,
    tanggal_lahir,
    jenis_kelamin,
    agama,
    id_kepala_keluarga,
    nama_kepala_keluarga = null
  ) {
    this.id = id;
    this.nama = nama;
    this.nik = nik;
    this.alamat = alamat;
    this.tanggal_lahir = tanggal_lahir;
    this.jenis_kelamin = jenis_kelamin;
    this.agama = agama;
    this.id_kepala_keluarga = id_kepala_keluarga;
    this.nama_kepala_keluarga = nama_kepala_keluarga;
  }
}

class SuratMasukDTO {
  constructor(id, nomorSurat, pengirim, perihal, tanggalTerima, file) {
    this.id = id;
    this.nomorSurat = nomorSurat;
    this.pengirim = pengirim;
    this.perihal = perihal;
    this.tanggalTerima = tanggalTerima;
    this.file = file;
  }
}

class SuratKeluarDTO {
  constructor(id, nomorSurat, penerima, perihal, tanggalKirim, file) {
    this.id = id;
    this.nomorSurat = nomorSurat;
    this.penerima = penerima;
    this.perihal = perihal;
    this.tanggalKirim = tanggalKirim;
    this.file = file;
  }
}

class PengumumanDTO {
  constructor(id, judul, isi, tanggalMulai, tanggalSelesai) {
    this.id = id;
    this.judul = judul;
    this.isi = isi;
    this.tanggalMulai = tanggalMulai;
    this.tanggalSelesai = tanggalSelesai;
  }
}

class BeritaDTO {
  constructor(
    id,
    judul,
    foto,
    isi,
    tanggalTerbit,
    penulis,
    status = "Dipublikasi",
    kategori = "Umum"
  ) {
    this.id = id;
    this.judul = judul;
    this.foto = foto;
    this.isi = isi;
    this.tanggalTerbit = tanggalTerbit;
    this.penulis = penulis;
    this.status = status;
    this.kategori = kategori;
  }
}

class DanaMasukDTO {
  constructor(id, tahun, bulan, jumlah, sumber, keterangan) {
    this.id = id;
    this.tahun = tahun;
    this.bulan = bulan;
    this.jumlah = jumlah;
    this.sumber = sumber;
    this.keterangan = keterangan;
  }
}

class DanaKeluarDTO {
  constructor(id, tahun, bulan, jumlah, kategori, keterangan) {
    this.id = id;
    this.tahun = tahun;
    this.bulan = bulan;
    this.jumlah = jumlah;
    this.kategori = kategori;
    this.keterangan = keterangan;
  }
}

class MediaDTO {
  constructor(id, nama, tipe, file, deskripsi, thumbnail) {
    this.id = id;
    this.nama = nama;
    this.tipe = tipe;
    this.file = file;
    this.deskripsi = deskripsi;
    this.thumbnail = thumbnail;
  }
}

class PelayananDTO {
  constructor(nama_layanan, kategori, deskripsi, link_google_form) {
    this.nama_layanan = nama_layanan;
    this.kategori = kategori;
    this.deskripsi = deskripsi;
    this.link_google_form = link_google_form;
  }
}

class KepalaKeluargaDTO {
  constructor(id, nama, nik) {
    this.id = id;
    this.nama = nama;
    this.nik = nik;
  }
}

export {
  UserDTO,
  PendudukDTO,
  SuratMasukDTO,
  SuratKeluarDTO,
  PengumumanDTO,
  BeritaDTO,
  DanaMasukDTO,
  DanaKeluarDTO,
  MediaDTO,
  PelayananDTO,
  KepalaKeluargaDTO,
};
