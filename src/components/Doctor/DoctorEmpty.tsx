function DoctorEmpty() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
      <div className="flex flex-col items-center gap-3">
        <span className="material-symbols-outlined text-5xl text-slate-400">
          sentiment_dissatisfied
        </span>
        <p className="text-lg font-semibold text-slate-700">
          Không có bác sĩ nào
        </p>
        <p className="text-sm text-slate-500">
          Hiện chưa có dữ liệu bác sĩ để hiển thị.
        </p>
      </div>
    </div>
  );
}

export default DoctorEmpty;