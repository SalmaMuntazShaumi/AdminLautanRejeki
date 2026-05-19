export function calculateStatistics(data) {
  return {
    total: data.length,

    tepatWaktu: data.filter(
      (d) => d.status === 'Tepat Waktu'
    ).length,

    terlambat: data.filter(
      (d) => d.status === 'Terlambat'
    ).length
  };
}