import * as XLSX from 'xlsx';

export function exportAttendanceExcel(
  data,
  payload
) {
  const {
    reportType,
    selectedDate,
    selectedMonth,
    selectedYear
  } = payload;

  let filtered = [];

  if (reportType === 'daily') {
    filtered = data.filter(
      item => item.tanggal === selectedDate
    );
  }

  if (reportType === 'monthly') {
    filtered = data.filter(
      item =>
        item.tanggal.startsWith(selectedMonth)
    );
  }

  if (reportType === 'yearly') {
    filtered = data.filter(
      item =>
        item.tanggal.startsWith(selectedYear)
    );
  }

  const worksheet =
    XLSX.utils.json_to_sheet(filtered);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Absensi'
  );

  XLSX.writeFile(
    workbook,
    `Absensi-${Date.now()}.xlsx`
  );
}