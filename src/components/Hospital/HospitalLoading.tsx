function HospitalLoading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse"
        >
          <div className="flex gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-slate-200" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="h-6 w-2/3 bg-slate-200 rounded" />
              <div className="h-4 w-1/2 bg-slate-200 rounded" />
              <div className="h-4 w-1/3 bg-slate-200 rounded" />
              <div className="h-10 w-36 bg-slate-200 rounded-xl mt-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HospitalLoading;