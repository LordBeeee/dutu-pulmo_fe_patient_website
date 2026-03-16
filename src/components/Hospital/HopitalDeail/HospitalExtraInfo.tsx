import type { Hospital } from "../../../types/hospital";

interface HospitalExtraInfoProps {
  hospital: Hospital;
}

function HospitalExtraInfo({ hospital }: HospitalExtraInfoProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border shadow-sm">
      <h3 className="font-bold mb-4 flex items-center gap-2">
        <span className="material-icons-outlined text-primary">info</span>
        Thông tin bổ sung
      </h3>

      <div className="space-y-4">
        <div className="flex justify-between border-b pb-3">
          <span className="text-sm text-slate-500">Khu vực</span>
          <span className="text-sm font-semibold">{hospital.province}</span>
        </div>

        <div className="flex justify-between pb-3">
          <span className="text-sm text-slate-500">Phường</span>
          <span className="text-sm font-semibold">{hospital.ward || "—"}</span>
        </div>
      </div>
    </div>
  );
}

export default HospitalExtraInfo;