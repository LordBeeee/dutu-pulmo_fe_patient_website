import { Link, useParams } from 'react-router-dom';

import FavoriteButton from '@/components/ui/FavoriteButton';
import { getSpecialtyConfig } from '@/components/home/SpecialtyConfig';
import { useHospitalDetail, useHospitalDoctors } from '@/hooks/useHospitals';

function HospitalDetailPage() {
  const { id = '' } = useParams();
  const hospitalQuery = useHospitalDetail(id);
  const doctorsQuery = useHospitalDoctors(id, 1, 12);

  const hospital = hospitalQuery.data;
  const doctors = doctorsQuery.data?.items ?? [];

  if (hospitalQuery.isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-slate-500">Đang tải thông tin cơ sở y tế...</div>
      </main>
    );
  }

  if (hospitalQuery.isError || !hospital) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-red-200 p-8 text-red-600">Không tìm thấy thông tin cơ sở y tế.</div>
      </main>
    );
  }

  const isClinic = hospital.name.toLowerCase().includes('phòng khám') || hospital.name.toLowerCase().includes('phong kham');

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-primary">Trang chủ</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link to="/hospitals" className="hover:text-primary">Cơ sở y tế</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="font-medium text-slate-900 line-clamp-1">{hospital.name}</span>
      </div>

      <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-28 h-28 rounded-2xl bg-slate-50 overflow-hidden flex items-center justify-center flex-shrink-0">
            {hospital.logoUrl ? (
              <img src={hospital.logoUrl} alt={hospital.name} className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-4xl text-primary">apartment</span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <span
                  className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    isClinic ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  {isClinic ? 'Phòng khám' : 'Bệnh viện'}
                </span>

                <h1 className="mt-2 text-3xl font-bold text-slate-900">{hospital.name}</h1>
              </div>
              
              <FavoriteButton hospitalId={hospital.id} className="shadow-sm border border-slate-100" />
            </div>

            {hospital.address ? (
              <p className="mt-3 text-slate-600 flex items-start gap-2">
                <span className="material-symbols-outlined text-base">location_on</span>
                <span>{hospital.address}</span>
              </p>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              {hospital.phone ? (
                <a href={`tel:${hospital.phone}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:opacity-90">
                  <span className="material-symbols-outlined text-base">call</span>
                  {hospital.phone}
                </a>
              ) : null}

              {hospital.email ? (
                <a href={`mailto:${hospital.email}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-50 text-orange-700 hover:opacity-90">
                  <span className="material-symbols-outlined text-base">mail</span>
                  {hospital.email}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Đội ngũ bác sĩ</h2>
          <Link
            to={id ? `/doctor?hospitalId=${encodeURIComponent(id)}` : '/doctor'}
            className="text-primary font-semibold hover:underline"
          >
            Xem tất cả
          </Link>
        </div>

        {doctorsQuery.isLoading ? (
          <div className="text-slate-500 text-sm">Đang tải danh sách bác sĩ...</div>
        ) : doctorsQuery.isError ? (
          <div className="text-red-600 text-sm">Không thể tải danh sách bác sĩ.</div>
        ) : doctors.length === 0 ? (
          <div className="text-slate-500 text-sm">Chưa có bác sĩ tại cơ sở này.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doctor) => {
              const specialty = getSpecialtyConfig(doctor.specialty || '');

              return (
                <Link
                  key={doctor.id}
                  to={`/doctor/${doctor.id}`}
                  className="rounded-xl border border-slate-200 p-4 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center">
                      {doctor.avatarUrl ? (
                        <img src={doctor.avatarUrl} alt={doctor.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-primary font-bold">{doctor.fullName?.trim()?.charAt(0) || 'D'}</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-900 line-clamp-1">{doctor.fullName}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1">{doctor.title || 'Bác sĩ'}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span
                      className="px-2 py-1 rounded text-[11px] font-medium"
                      style={{ backgroundColor: specialty.bg, color: specialty.color }}
                    >
                      {specialty.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default HospitalDetailPage;
