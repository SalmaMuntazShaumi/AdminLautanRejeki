// components/common/LoadingSkeleton.jsx

export default function LoadingSkeleton() {
  return (
    <div className="space-y-3">

      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="h-14 bg-slate-100 rounded-xl animate-pulse"
        />
      ))}

    </div>
  );
}