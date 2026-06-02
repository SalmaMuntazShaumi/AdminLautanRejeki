export function calculateStatistics(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return { total: 0, on_time: 0, late: 0, leave: 0 };
  }
  return {
    total:   data.length,
    on_time: data.filter((i) => i.status === 'on_time').length,
    late:    data.filter((i) => i.status === 'late').length,
    leave:   data.filter((i) => i.status === 'leave').length,
  };
}