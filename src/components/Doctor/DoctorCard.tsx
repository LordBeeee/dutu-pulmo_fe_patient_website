import { useNavigate } from 'react-router-dom';

import FavoriteButton from '@/components/ui/FavoriteButton';
import { getSpecialtyConfig } from '@/components/home/SpecialtyConfig';
import type { TimeSlotResponse } from '@/services/doctor';
import type { Doctor } from '@/types/doctor';

type DoctorCardProps = {
  doctor: Doctor;
  nearestSlots?: TimeSlotResponse[];
  nearestDayLabel?: string | null;
};

function DoctorCard({ doctor, nearestSlots = [], nearestDayLabel = null }: DoctorCardProps) {
  const navigate = useNavigate();
  const specialtyConfig = getSpecialtyConfig(doctor.specialty || '');

  const goToDetail = () => {
    navigate(`/doctor/${doctor.id}`);
  };

  return (
    <div
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 transition-all hover:shadow-md cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={goToDetail}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goToDetail();
        }
      }}
    >
      <div className="flex-shrink-0">
        <img
          src={doctor.avatarUrl || 'https://via.placeholder.com/150'}
          alt={doctor.fullName}
          className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover bg-slate-100"
        />
      </div>

      <div className="flex-1">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              {doctor.title || 'Bác sĩ'}
            </p>

            <h3 className="text-xl font-bold mb-2">{doctor.fullName}</h3>

            <div className="flex flex-wrap gap-2 mb-3">
              <span
                className="px-3 py-1 text-xs font-medium rounded-full"
                style={{ backgroundColor: specialtyConfig.bg, color: specialtyConfig.color }}
              >
                {specialtyConfig.label || 'Chưa cập nhật chuyên khoa'}
              </span>

              <span className="flex items-center gap-1 text-xs text-slate-500">
                <span className="material-symbols-outlined text-sm">history</span>
                {doctor.yearsOfExperience || 0} năm kinh nghiệm
              </span>

              <span className="flex items-center gap-1 text-xs text-amber-600">
                <span className="material-symbols-outlined text-sm">star</span>
                {doctor.averageRating || '0.00'} ({doctor.totalReviews || 0} đánh giá)
              </span>
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">location_on</span>
                {doctor.primaryHospital?.name || 'Chưa cập nhật bệnh viện'}
              </p>

              {nearestSlots.length > 0 ? (
                <div className="flex items-start gap-2 text-secondary">
                  <span className="material-symbols-outlined text-lg">calendar_today</span>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-slate-500">{nearestDayLabel}:</span>
                    <div className="flex flex-wrap gap-2">
                      {nearestSlots.slice(0, 3).map((slot) => (
                        <span key={slot.id} className="px-2 py-1 border rounded-lg text-xs bg-green-50">
                          {new Date(slot.startTime).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {' - '}
                          {new Date(slot.endTime).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="flex items-center gap-2 text-slate-400">
                  <span className="material-symbols-outlined text-lg">calendar_today</span>
                  Chưa có lịch khám khả dụng
                </p>
              )}
            </div>
          </div>

          <div className="md:text-right">
            <p className="text-xs text-slate-400 mb-1">Giá khám</p>
            <p className="text-lg font-bold text-primary">
              {Number(doctor.defaultConsultationFee || 0).toLocaleString('vi-VN')}đ
            </p>
          </div>
        </div>

        {doctor.bio ? (
          <div className="mb-4">
            <p className="text-sm text-slate-600 leading-6 line-clamp-3">{doctor.bio}</p>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl hover:opacity-90 transition"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/appointment', { state: { doctorId: doctor.id } });
            }}
          >
            <span className="material-symbols-outlined">event_available</span>
            Đặt lịch
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToDetail();
            }}
            className="flex items-center gap-2 border border-primary text-primary px-6 py-2.5 rounded-xl hover:bg-primary hover:text-white transition"
          >
            <span className="material-symbols-outlined">person_search</span>
            Chi tiết
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/chat?doctorId=${doctor.id}`);
            }}
            className="flex items-center gap-2 border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl hover:bg-slate-50 transition"
          >
            <span className="material-symbols-outlined">chat</span>
            Nhắn tin
          </button>

          <FavoriteButton doctorId={doctor.id} className="!p-2.5 border rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default DoctorCard;
