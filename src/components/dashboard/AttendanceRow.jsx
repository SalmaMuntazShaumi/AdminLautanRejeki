import StatusBadge from './StatusBadge';

export default function AttendanceRow({
  item
}) {
  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50">

      <td className="px-6 py-4 font-medium">
        {item.nama}
      </td>

      <td className="px-6 py-4">
        {item.tanggal}
      </td>

      <td className="px-6 py-4">
        {item.jamMasuk || '-'}
      </td>

      <td className="px-6 py-4">
        {item.jamKeluar || '-'}
      </td>

      <td className="px-6 py-4">
        <StatusBadge status={item.status} />
      </td>

    </tr>
  );
}