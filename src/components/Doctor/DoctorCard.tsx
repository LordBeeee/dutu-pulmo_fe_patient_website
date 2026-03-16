import { useNavigate } from "react-router-dom";
import type { Doctor } from "../../types/doctor";

interface DoctorCardProps {
doctor: Doctor;
}

function DoctorCard({ doctor }: DoctorCardProps) {
const navigate = useNavigate();
const goToDetail = () => {
    navigate(`/doctor/${doctor.id}`);
};
return (
<div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 transition-all hover:shadow-md">
    <div className="flex-shrink-0">
        <img
        src={doctor.avatarUrl || "https://via.placeholder.com/150"}
        alt={doctor.fullName}
        className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover bg-slate-100"
        />
    </div>

    <div className="flex-1">
    <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            {doctor.title || "Bác sĩ"}
        </p>

        <h3 className="text-xl font-bold mb-2">{doctor.fullName}</h3>

        <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-3 py-1 bg-blue-50 text-primary text-xs font-medium rounded-full">
            {doctor.specialty || "Chưa cập nhật chuyên khoa"}
            </span>

            <span className="flex items-center gap-1 text-xs text-slate-500">
            <span className="material-symbols-outlined text-sm">history</span>
            {doctor.yearsOfExperience || 0} năm kinh nghiệm
            </span>

            <span className="flex items-center gap-1 text-xs text-amber-600">
            <span className="material-symbols-outlined text-sm">star</span>
            {doctor.averageRating || "0.00"} ({doctor.totalReviews || 0} đánh giá)
            </span>
        </div>

        <div className="space-y-2 text-sm text-slate-600">
            <p className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">location_on</span>
            {doctor.primaryHospital?.name || "Chưa cập nhật bệnh viện"}
            </p>

            {doctor.phone && (
            <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">call</span>
                {doctor.phone}
            </p>
            )}

            {doctor.email && (
            <p className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">mail</span>
                {doctor.email}
            </p>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
            {doctor.hasOfflineFutureSlots && (
                <span className="px-2 py-1 rounded-lg text-xs bg-green-50 text-green-700 border border-green-200">
                Có lịch khám tại viện
                </span>
            )}

            {doctor.hasOnlineFutureSlots && (
                <span className="px-2 py-1 rounded-lg text-xs bg-blue-50 text-blue-700 border border-blue-200">
                Có lịch tư vấn online
                </span>
            )}

            {!doctor.hasOfflineFutureSlots && !doctor.hasOnlineFutureSlots && (
                <span className="px-2 py-1 rounded-lg text-xs bg-slate-50 text-slate-500 border border-slate-200">
                Chưa có lịch sắp tới
                </span>
            )}
            </div>
        </div>
        </div>

        <div className="md:text-right">
        <p className="text-xs text-slate-400 mb-1">Giá khám</p>
        <p className="text-lg font-bold text-primary">
            {Number(doctor.defaultConsultationFee || 0).toLocaleString("vi-VN")}đ
        </p>
        </div>
    </div>

    {doctor.bio && (
        <div className="mb-4">
        <p className="text-sm text-slate-600 leading-6 line-clamp-3">
            {doctor.bio}
        </p>
        </div>
    )}

    <div className="flex flex-wrap gap-3">

        {doctor.hasOnlineFutureSlots && (
            <button className="flex items-center gap-2 bg-green-500 text-white px-6 py-2.5 rounded-xl hover:bg-green-600 transition">
            <span className="material-symbols-outlined">videocam</span>
            Tư vấn
            </button>
        )}

        <button
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl hover:opacity-90 transition"
            onClick={() =>
            navigate("/appointment", {
                state: { doctorId: doctor.id },
            })
            }
        >
            <span className="material-symbols-outlined">event_available</span>
            Đặt lịch
        </button>

        <button
            onClick={goToDetail}
            className="flex items-center gap-2 border border-primary text-primary px-6 py-2.5 rounded-xl hover:bg-primary hover:text-white transition"
        >
            <span className="material-symbols-outlined">person_search</span>
            Chi tiết
        </button>
        
        <button className="p-2.5 border rounded-xl items-center justify-center flex hover:bg-slate-50 transition">
            <span className="material-symbols-outlined">favorite</span>
        </button>
        
    </div>
    </div>
</div>
);
}

export default DoctorCard;