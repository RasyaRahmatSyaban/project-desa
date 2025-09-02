"use client";

export default function VisiMisiDesa() {
  return (
    <section className="container mx-auto px-4 sm:px-6 py-12 md:py-16 flex flex-col items-center">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
          Visi & Misi
        </h2>
      </div>

      <div className="w-full max-w-4xl space-y-4">
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
          <div className="p-6 sm:p-10 md:p-12 text-center">
            <h3 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-800 mb-4">
              Bahontobungku Unggul, Masyarakat Sejahtera
            </h3>
            <p className="text-gray-600 text-sm sm:text-base md:text-xl max-w-2xl mx-auto">
              Mewujudkan desa yang unggul dengan masyarakat yang sejahtera
              melalui pembangunan berkelanjutan dan partisipatif.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
