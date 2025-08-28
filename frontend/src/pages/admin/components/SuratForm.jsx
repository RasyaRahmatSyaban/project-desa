"use client";

import { useState } from "react";
import PropTypes from "prop-types";

const SuratForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isEdit = false,
  currentItem = null,
}) => {
  const [formErrors, setFormErrors] = useState({});

  // Validate form before submission
  const validateForm = () => {
    const errors = {};

    if (!formData.nomor.trim()) {
      errors.nomor = "Nomor surat wajib diisi";
    }

    if (!formData.perihal.trim()) {
      errors.perihal = "Perihal wajib diisi";
    }

    if (!formData.pengirim.trim()) {
      errors.pengirim =
        formData.jenis === "Surat Masuk"
          ? "Pengirim wajib diisi"
          : "Penerima wajib diisi";
    }

    if (!formData.tanggal) {
      errors.tanggal =
        formData.jenis === "Surat Masuk"
          ? "Tanggal terima wajib diisi"
          : "Tanggal kirim wajib diisi";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit();
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] || null });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      style={{ fontFamily: "poppins" }}
    >
      <div>
        <label
          htmlFor="jenis"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Jenis Surat
        </label>
        <select
          id="jenis"
          value={formData.jenis}
          onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          disabled={isEdit && currentItem?.id > 0} // Disable changing type for existing items
        >
          <option value="Surat Masuk">Surat Masuk</option>
          <option value="Surat Keluar">Surat Keluar</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="nomor"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nomor Surat
        </label>
        <input
          id="nomor"
          type="text"
          value={formData.nomor}
          onChange={(e) => setFormData({ ...formData, nomor: e.target.value })}
          className={`w-full px-4 py-2 border ${
            formErrors.nomor ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
          placeholder="Contoh: SM/2024/001"
        />
        {formErrors.nomor && (
          <p className="mt-1 text-sm text-red-500">{formErrors.nomor}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="perihal"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Perihal
        </label>
        <input
          id="perihal"
          type="text"
          value={formData.perihal}
          onChange={(e) =>
            setFormData({ ...formData, perihal: e.target.value })
          }
          className={`w-full px-4 py-2 border ${
            formErrors.perihal ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
          placeholder="Perihal surat"
        />
        {formErrors.perihal && (
          <p className="mt-1 text-sm text-red-500">{formErrors.perihal}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="pengirim"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {formData.jenis === "Surat Masuk" ? "Pengirim" : "Penerima"}
        </label>
        <input
          id="pengirim"
          type="text"
          value={formData.pengirim}
          onChange={(e) =>
            setFormData({ ...formData, pengirim: e.target.value })
          }
          className={`w-full px-4 py-2 border ${
            formErrors.pengirim ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
          placeholder={
            formData.jenis === "Surat Masuk" ? "Nama pengirim" : "Nama penerima"
          }
        />
        {formErrors.pengirim && (
          <p className="mt-1 text-sm text-red-500">{formErrors.pengirim}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="tanggal"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {formData.jenis === "Surat Masuk"
            ? "Tanggal Terima"
            : "Tanggal Kirim"}
        </label>
        <input
          id="tanggal"
          type="date"
          value={formData.tanggal}
          onChange={(e) =>
            setFormData({ ...formData, tanggal: e.target.value })
          }
          className={`w-full px-4 py-2 border ${
            formErrors.tanggal ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
        />
        {formErrors.tanggal && (
          <p className="mt-1 text-sm text-red-500">{formErrors.tanggal}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="upload-file"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Upload Dokumen {isEdit ? "Baru " : ""}(Opsional)
        </label>
        <input
          id="upload-file"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="w-full border border-gray-300 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
        />
        {isEdit && currentItem?.file && (
          <p className="mt-1 text-sm text-gray-500">
            File saat ini:{" "}
            <a
              href={`/storage/${currentItem.file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Lihat Dokumen
            </a>
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          {isEdit ? "Simpan Perubahan" : "Simpan"}
        </button>
      </div>
    </form>
  );
};

SuratForm.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  currentItem: PropTypes.object,
};

export default SuratForm;
