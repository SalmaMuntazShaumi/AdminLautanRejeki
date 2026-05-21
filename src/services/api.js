import axios from 'axios';

const API_BASE_URL = 'http://api.lautanrejeki.id'; // Sesuaikan dengan hosting/local API kamu

export const absensiService = {
  // Mengambil semua data absensi
  getAllAbsensi: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/history`);
      return response.data;
    } catch (error) {
      console.error("Gagal memuat data absensi:", error);
      // Data fallback untuk keperluan simulasi/testing jika API belum live
      return [
        { id: 1, nama: "Ahmad Faisal", tanggal: "2026-05-19", jamMasuk: "07:55", jamKeluar: "17:01", status: "Tepat Waktu" },
        { id: 2, nama: "Siti Rahma", tanggal: "2026-05-19", jamMasuk: "08:15", jamKeluar: "17:00", status: "Terlambat" },
        { id: 3, nama: "Budi Santoso", tanggal: "2026-05-18", jamMasuk: "07:45", jamKeluar: "17:05", status: "Tepat Waktu" },
        { id: 4, nama: "Salma Muntaz", tanggal: "2026-04-15", jamMasuk: "07:50", jamKeluar: "17:00", status: "Tepat Waktu" },
        { id: 5, nama: "Pasya Kemal", tanggal: "2026-04-10", jamMasuk: "08:20", jamKeluar: "16:55", status: "Terlambat" },
      ];
    }
  }
};