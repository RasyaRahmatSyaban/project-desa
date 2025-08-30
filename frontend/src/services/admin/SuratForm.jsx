"use client";

import { FaTimes, FaFileUpload } from "react-icons/fa";

const SuratForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isEdit,
  currentItem,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="mb-4">
        <label
          htmlFor="jenis"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Jenis Surat
        </label>
        <select
          id="jenis"
          name="jenis"
          value={formData.jenis}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          disabled={isEdit}
        >
          <option>Surat Masuk</option>
          <option>Surat Keluar</option>
        </select>
      </div>
      <div className="mb-4">
        <label
          htmlFor="nomor"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Nomor Surat
        </label>
        <input
          type="text"
          id="nomor"
          name="nomor"
          value={formData.nomor}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="perihal"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Perihal
        </label>
        <input
          type="text"
          id="perihal"
          name="perihal"
          value={formData.perihal}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="pengirim"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          {formData.jenis === "Surat Masuk" ? "Pengirim" : "Penerima"}
        </label>
        <input
          type="text"
          id="pengirim"
          name="pengirim"
          value={formData.pengirim}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="tanggal"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Tanggal {formData.jenis === "Surat Masuk" ? "Diterima" : "Dikirim"}
        </label>
        <input
          type="date"
          id="tanggal"
          name="tanggal"
          value={formData.tanggal}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      {!isEdit && (
        <div className="mb-4">
          <label
            htmlFor="file"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            File Surat
          </label>
          <div className="flex items-center justify-between">
            <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-100">
              <FaFileUpload className="text-2xl text-blue-500" />
              <span className="mt-2 text-base leading-normal">Pilih File</span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {formData.file && (
              <span className="ml-4 text-gray-700 text-sm">
                {formData.file.name}
              </span>
            )}
          </div>
        </div>
      )}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          <FaTimes className="inline-block mr-2" />
          Batal
        </button>
        <button
          type="submit"
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Simpan
        </button>
      </div>
    </form>
  );
};

export default SuratForm;
