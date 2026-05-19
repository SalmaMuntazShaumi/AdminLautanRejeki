import {
  Users,
  CheckCircle,
  Clock
} from 'lucide-react';

import StatCard from './StatCard';

export default function StatsGrid({
  statistics
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <StatCard
        title="Total Record"
        value={statistics.total}
        icon={Users}
        color="bg-sky-100 text-sky-700"
      />

      <StatCard
        title="Tepat Waktu"
        value={statistics.tepatWaktu}
        icon={CheckCircle}
        color="bg-emerald-100 text-emerald-700"
      />

      <StatCard
        title="Terlambat"
        value={statistics.terlambat}
        icon={Clock}
        color="bg-rose-100 text-rose-700"
      />

    </div>
  );
}