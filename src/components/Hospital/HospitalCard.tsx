import { useNavigate } from "react-router-dom";
import type { Hospital } from "../../types/hospital";

interface HospitalCardProps {
  hospital: Hospital;
}

function HospitalCard({ hospital }: HospitalCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 transition-all hover:shadow-md">
      <div className="flex-shrink-0">
        <img
          src={hospital.logoUrl || "https://via.placeholder.com/300x200?text=Hospital"}
          alt={hospital.name}
          className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover bg-slate-100"
        />
      </div>

      <div className="flex-1">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Bệnh viện
            </p>

            <h3 className="text-xl font-bold mb-2">{hospital.name}</h3>

            <div className="flex flex-wrap gap-2 mb-3">
              {hospital.hospitalCode && (
                <span className="px-3 py-1 bg-blue-50 text-primary text-xs font-medium rounded-full">
                  Mã: {hospital.hospitalCode}
                </span>
              )}

              {hospital.province && (
                <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                  {hospital.province}
                </span>
              )}
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <p className="flex items-start gap-2">
                <span className="material-symbols-outlined text-lg mt-0.5">
                  location_on
                </span>
                <span>{hospital.address || "Chưa cập nhật địa chỉ"}</span>
              </p>

              {hospital.phone && (
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">call</span>
                  {hospital.phone}
                </p>
              )}

              {hospital.email && (
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">mail</span>
                  {hospital.email}
                </p>
              )}
            </div>
          </div>

          <div className="md:text-right">
            <p className="text-xs text-slate-400 mb-1">Khu vực</p>
            <p className="text-base font-semibold text-slate-700">
              {hospital.province || "Chưa cập nhật"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate(`/hospital/${hospital.id}`)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl hover:opacity-90 transition"
          >
            <span className="material-symbols-outlined">apartment</span>
            Chi tiết
          </button>

          {hospital.latitude && hospital.longitude && (
            <a
              href={`https://www.google.com/maps?q=${hospital.latitude},${hospital.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 border border-primary text-primary px-6 py-2.5 rounded-xl hover:bg-primary hover:text-white transition"
            >
              <span className="material-symbols-outlined">map</span>
              Xem bản đồ
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default HospitalCard;