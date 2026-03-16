import { Link } from "react-router-dom";
import type { Doctor } from "../../../types/doctor";

interface HospitalDoctorsListProps {
  doctors: Doctor[];
  loading?: boolean;
}

function HospitalDoctorsList({
  doctors,
  loading = false,
}: HospitalDoctorsListProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border shadow-sm">
      <h3 className="font-bold mb-4 flex items-center gap-2">
        <span className="material-icons-outlined text-primary">medical_services</span>
        Danh sách bác sĩ
      </h3>

      {loading ? (
        <div className="text-sm text-slate-500">Đang tải danh sách bác sĩ...</div>
      ) : doctors.length === 0 ? (
        <div className="text-sm text-slate-500">Chưa có bác sĩ nào.</div>
      ) : (
        <div className="space-y-4">
          {doctors.map((doctor) => (
            <Link
              key={doctor.id}
              to={`/doctor/${doctor.id}`}
              className="flex items-center gap-4 p-3 rounded-2xl border border-slate-200 hover:border-primary hover:shadow-sm transition"
            >
              <img
                src={doctor.avatarUrl || "https://via.placeholder.com/80x80?text=Doctor"}
                alt={doctor.fullName}
                className="w-16 h-16 rounded-2xl object-cover bg-slate-100 shrink-0"
              />

              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-slate-900 truncate">
                  {doctor.fullName}
                </h4>

                <p className="text-sm text-slate-500 truncate">
                  {doctor.specialty || "Chưa cập nhật chuyên khoa"}
                </p>

                <p className="text-sm text-slate-600 mt-1">
                  {doctor.yearsOfExperience ?? 0} năm kinh nghiệm
                </p>
              </div>

              <span className="material-icons-outlined text-slate-400">
                chevron_right
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default HospitalDoctorsList;