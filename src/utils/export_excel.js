import * as XLSX from 'xlsx';

export function exportAttendanceExcel(data, payload) {
  const { reportType, selectedDate, selectedMonth, selectedYear } = payload;

  let filtered = [];

  if (reportType === 'daily') {
    filtered = data.filter(
      (item) => item.date === selectedDate
    );
  }
  if (reportType === 'monthly') {
    filtered = data.filter(
      (item) => item.date?.startsWith(selectedMonth) // ← ?. agar tidak crash jika undefined
    );
  }
  if (reportType === 'yearly') {
    filtered = data.filter(
      (item) => item.date?.startsWith(selectedYear)
    );
  }

  // Rapikan kolom sebelum export
  const rows = filtered.map((item) => ({
    Nama:         item.nama      ?? '-',
    Tanggal:      item.date      ?? '-',
    'Jam Masuk':  item.clock_in  ?? '-',
    'Jam Keluar': item.clock_out ?? '-',
    Status:       item.status    ?? '-',
  }));

  if (rows.length === 0) {
    alert('Tidak ada data untuk periode yang dipilih.');
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook  = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Absensi');
  XLSX.writeFile(workbook, `Absensi-${reportType}-${Date.now()}.xlsx`);
}