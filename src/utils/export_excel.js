import * as XLSX from 'xlsx';
import { getWeekRange } from './week_helper';

export function exportAttendanceExcel(data, payload) {
  const { reportType, selectedDate, selectedMonth, selectedYear, selectedWeek } = payload;
  let filtered = [];

  if (reportType === 'daily') {
    filtered = data.filter((item) => item.date === selectedDate);
  }

  if (reportType === 'weekly' && selectedWeek) {
    const { start, end } = getWeekRange(selectedWeek);
    filtered = data.filter((item) => {
      if (!item.date) return false;
      const d = new Date(item.date);
      return d >= start && d <= end;
    });
  }

  if (reportType === 'monthly') {
    filtered = data.filter((item) => item.date?.startsWith(selectedMonth));
  }

  if (reportType === 'yearly') {
    filtered = data.filter((item) => item.date?.startsWith(selectedYear));
  }

  const rows = filtered.map((item) => ({
    Nama: item.nama ?? '-',
    Tanggal: item.date ?? '-',
    'Jam Masuk': item.clock_in ?? '-',
    'Jam Keluar': item.clock_out ?? '-',
    Status: item.status ?? '-',
    reason: item.early_out_reason ?? '-',
  }));

  if (rows.length === 0) {
    alert('Tidak ada data untuk periode yang dipilih.');
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook  = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Absensi')  ;
  XLSX.writeFile(workbook, `Absensi-${reportType}-${Date.now()}.xlsx`);
}