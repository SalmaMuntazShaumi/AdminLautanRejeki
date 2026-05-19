export default function StatusBadge({
  status
}) {
  const isOnTime =
    status === 'Tepat Waktu';

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium
      ${
        isOnTime
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-rose-100 text-rose-700'
      }`}
    >
      {status}
    </span>
  );
}