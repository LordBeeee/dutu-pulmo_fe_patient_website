import { useMemo } from 'react';

import { getSpecialtyConfig } from '@/components/home/SpecialtyConfig';
import type { DoctorDetail } from '@/types/doctor';
import { getGenderLabel } from '@/utils/doctor';

interface DoctorMainCardProps {
  doctor: DoctorDetail;
}

function DoctorMainCard({ doctor }: DoctorMainCardProps) {
  const doctorName = doctor.fullName || 'Chưa cập nhật';
  const doctorTitle = doctor.title || 'Bác sĩ';
  const specialtyConfig = getSpecialtyConfig(doctor.specialty || '');
  const rating = Number(doctor.averageRating || 0).toFixed(2);
  const totalReviews = doctor.totalReviews || 0;
  const yearsOfExperience = doctor.yearsOfExperience || 0;

  const initial = useMemo(() => {
    if (!doctor.fullName) return 'D';
    return doctor.fullName.trim().charAt(0).toUpperCase();
  }, [doctor.fullName]);

  const genderLabel = getGenderLabel(doctor.gender);
  const hasAnySlot = doctor.hasOnlineFutureSlots || doctor.hasOfflineFutureSlots;

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          {doctor.avatarUrl ? (
            <img
              src={doctor.avatarUrl}
              alt={doctorName}
              className="w-40 h-40 md:w-48 md:h-48 rounded-2xl object-cover bg-slate-100 shadow-lg"
            />
          ) : (
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-7xl font-bold shadow-lg">
              {initial}
            </div>
          )}
        </div>

        <div className="flex-grow">
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                {doctorTitle}
              </span>
              <h1 className="text-3xl font-bold text-slate-900 mt-1">{doctorName}</h1>
              {doctor.position ? <p className="text-slate-500 mt-2">{doctor.position}</p> : null}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <span
              className="px-3 py-1 rounded-md text-xs font-medium"
              style={{ backgroundColor: specialtyConfig.bg, color: specialtyConfig.color }}
            >
              {specialtyConfig.label}
            </span>

            {doctor.position ? (
              <span className="px-3 py-1 bg-green-50 text-green-600 rounded-md text-xs font-medium">
                {doctor.position}
              </span>
            ) : null}

            {doctor.verifiedAt ? (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-md text-xs font-medium">
                Đã xác minh
              </span>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600">
            <div>
              <span className="font-bold text-slate-900">{rating}</span>
              <span className="ml-1 text-slate-400">({totalReviews} đánh giá)</span>
            </div>

            <div>
              <span className="font-medium text-slate-900">{yearsOfExperience} năm</span>
              <span className="ml-1 text-slate-400">kinh nghiệm</span>
            </div>

            <div>
              <span className="font-medium text-slate-900">{genderLabel}</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-4">
            {doctor.hasOfflineFutureSlots ? (
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded uppercase">
                Có lịch khám tại viện
              </span>
            ) : null}

            {doctor.hasOnlineFutureSlots ? (
              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded uppercase">
                Có lịch khám online
              </span>
            ) : null}

            {!hasAnySlot ? (
              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded uppercase">
                Chưa có lịch khám
              </span>
            ) : null}

            <span className="text-sm text-slate-500 italic">Hồ sơ bác sĩ công khai</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DoctorMainCard;
