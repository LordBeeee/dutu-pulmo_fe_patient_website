import type { Hospital } from "../../../types/hospital";

interface HospitalHeaderCardProps {
  hospital: Hospital;
}

function HospitalHeaderCard({ hospital }: HospitalHeaderCardProps) {
  return (
    <div className="bg-white rounded-3xl p-8 border shadow-sm">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-56 h-48 md:h-56 rounded-2xl overflow-hidden">
          <img
            src={hospital.logoUrl}
            alt={hospital.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-grow">
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">
            BỆNH VIỆN
          </p>

          <h1 className="text-3xl font-bold mb-2">{hospital.name}</h1>

          <div className="flex gap-2 mb-4 flex-wrap">
            <span className="px-3 py-1 bg-blue-50 text-primary text-xs font-semibold rounded-full">
              Mã: {hospital.hospitalCode}
            </span>

            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full flex items-center gap-1">
              <span className="material-icons-outlined text-[14px]">
                location_on
              </span>
              {hospital.province}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600 mb-6">
            <div className="flex items-start gap-3">
              <span className="material-icons-outlined text-primary">
                place
              </span>
              <p>{hospital.address}</p>
            </div>

            <div className="flex items-start gap-3">
              <span className="material-icons-outlined text-primary">call</span>
              <p>{hospital.phone}</p>
            </div>

            <div className="flex items-start gap-3">
              <span className="material-icons-outlined text-primary">mail</span>
              <p>{hospital.email}</p>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl">
              <span className="material-icons-outlined text-lg">
                event_available
              </span>
              Đặt lịch khám ngay
            </button>

            <a
              href={`https://www.google.com/maps?q=${hospital.latitude},${hospital.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-3 border border-primary text-primary font-semibold rounded-xl"
            >
              <span className="material-icons-outlined text-lg">map</span>
              Xem bản đồ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HospitalHeaderCard;