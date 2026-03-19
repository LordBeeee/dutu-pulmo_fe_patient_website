import type { DoctorDetail } from "../../../types/doctor";
import { formatDate } from "../../../utils/doctor";
import DoctorReviews from "./DoctorReviews";

interface DoctorInfoSectionsProps {
  doctor: DoctorDetail;
}

function DoctorInfoSections({ doctor }: DoctorInfoSectionsProps) {
  const hospitalName = doctor.primaryHospital?.name || "Chưa cập nhật";
  const hospitalAddress =
    doctor.primaryHospital?.address ||
    [doctor.address, doctor.ward, doctor.province].filter(Boolean).join(", ") ||
    "Chưa cập nhật";

  const contactPhone = doctor.phone || doctor.primaryHospital?.phone || "Chưa cập nhật";
  const contactEmail = doctor.email || "Chưa cập nhật";

  return (
    <section className="space-y-6">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Giới thiệu</h2>
        <p className="text-slate-600 leading-relaxed whitespace-pre-line">
          {doctor.bio || doctor.expertiseDescription || "Chưa cập nhật thông tin giới thiệu."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Nơi làm việc</h2>
          <div className="space-y-3">
            <p className="font-semibold text-slate-900">{hospitalName}</p>
            <p className="text-sm text-slate-500">{hospitalAddress}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Thông tin liên hệ</h2>
          <div className="space-y-4">
            <div className="flex items-center text-sm">
              <span className="w-16 text-slate-400">SĐT:</span>
              <span className="font-medium text-slate-900">{contactPhone}</span>
            </div>

            <div className="flex items-center text-sm">
              <span className="w-16 text-slate-400">Email:</span>
              <span className="font-medium text-slate-900 break-all">{contactEmail}</span>
            </div>

            <div className="flex items-center text-sm">
              <span className="w-16 text-slate-400">Ngày sinh:</span>
              <span className="font-medium text-slate-900">
                {formatDate(doctor.dateOfBirth)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Kinh nghiệm làm việc</h2>
          <p className="text-slate-600 whitespace-pre-line">
            {doctor.workExperience || "Chưa cập nhật."}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Học vấn</h2>
          <p className="text-slate-600 whitespace-pre-line">
            {doctor.education || "Chưa cập nhật."}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Chuyên môn</h2>
          <p className="text-slate-600 whitespace-pre-line">
            {doctor.expertiseDescription || "Chưa cập nhật."}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">rate_review</span>
            Đánh giá từ bệnh nhân
          </h2>
          {doctor.id ? (
            <DoctorReviews doctorId={doctor.id} />
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">Chưa có thông tin đánh giá.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default DoctorInfoSections;