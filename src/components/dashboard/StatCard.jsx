export default function StatCard({
  title,
  value,
  icon: Icon,
  color
}) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}
        >
          <Icon size={24} />
        </div>

      </div>
    </div>
  );
}