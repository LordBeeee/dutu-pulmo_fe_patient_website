function HospitalEmpty() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
      <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-3xl text-slate-400">
          apartment
        </span>
      </div>

      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        Không có bệnh viện nào
      </h3>

      <p className="text-slate-500">
        Hiện chưa có dữ liệu bệnh viện để hiển thị.
      </p>
    </div>
  );
}

export default HospitalEmpty;