import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAppointmentDetail } from "@/hooks/use-appointments";
import { useCreateReview } from "@/hooks/use-reviews";
import { Star } from "lucide-react";
import { toast } from "sonner";

export default function AppointmentReviewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appointmentId =
    searchParams.get("appointmentId") || searchParams.get("id");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isAnonymous] = useState(false);

  const { data: appointment, isLoading: isLoadingAppointment } =
    useAppointmentDetail(appointmentId || "");
  const createReview = useCreateReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!appointmentId || !appointment?.doctor?.id) {
      toast.error("Không tìm thấy thông tin cuộc hẹn.");
      return;
    }

    if (!comment.trim()) {
      toast.error("Vui lòng nhập nhận xét của bạn.");
      return;
    }

    createReview.mutate(
      {
        doctorId: appointment.doctor.id,
        appointmentId,
        rating,
        comment,
        isAnonymous,
      },
      {
        onSuccess: () => {
          toast.success("Gửi đánh giá thành công. Cảm ơn phản hồi của bạn!");
          navigate("/appointment-schedule/" + appointmentId);
        },
        onError: (error) => {
          const errorMessage =
            error instanceof Error && (error as any).response?.data?.message
              ? typeof (error as any).response.data.message === "string"
                ? (error as any).response.data.message
                : (error as any).response.data.message.message
              : error instanceof Error
                ? error.message
                : "Có lỗi xảy ra";
          console.error(errorMessage);
          toast.error(errorMessage);
        },
      },
    );
  };

  if (isLoadingAppointment) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-8" />
        <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <span className="material-symbols-outlined text-red-400 text-6xl mb-4">
          error
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Không tìm thấy lịch hẹn
        </h1>
        <p className="text-slate-500 mb-8">
          Vui lòng kiểm tra lại đường dẫn hoặc quay lại danh sách lịch khám.
        </p>
        <Link
          to="/appointment-schedule"
          className="px-6 py-2 bg-primary text-white rounded-xl font-semibold"
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const doctor = appointment.doctor;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-primary">
          Trang chủ
        </Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link to="/appointment-schedule" className="hover:text-primary">
          Lịch khám
        </Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link
          to={`/appointment-schedule/${appointmentId}`}
          className="hover:text-primary"
        >
          Chi tiết
        </Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="font-medium text-slate-900">Đánh giá</span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 text-center bg-slate-50/50 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Đánh giá dịch vụ
          </h1>
          <p className="text-slate-500 text-sm">
            Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi
          </p>

          <div className="mt-8 flex flex-col items-center">
            <div className="h-20 w-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-200 mb-4">
              {doctor?.avatarUrl ? (
                <img
                  src={doctor.avatarUrl}
                  alt={doctor.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined text-4xl">
                    person
                  </span>
                </div>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Bác sĩ: {doctor?.fullName || "---"}
            </h2>
            <p className="text-primary text-sm font-medium">
              {doctor?.specialty || "---"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
              Mức độ hài lòng
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-transform active:scale-95 hover:scale-110"
                >
                  <Star
                    size={48}
                    className={`${
                      star <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-bold text-amber-500">
              {rating === 5
                ? "Rất hài lòng"
                : rating === 4
                  ? "Hài lòng"
                  : rating === 3
                    ? "Bình thường"
                    : rating === 2
                      ? "Không hài lòng"
                      : "Rất tệ"}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
              Nhận xét của bạn
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về bác sĩ và chất lượng dịch vụ..."
              className="w-full min-h-[160px] rounded-2xl border border-slate-200 p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-4 px-6 rounded-2xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={createReview.isPending}
              className="flex-[2] py-4 px-6 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all disabled:opacity-50 disabled:shadow-none"
            >
              {createReview.isPending ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
