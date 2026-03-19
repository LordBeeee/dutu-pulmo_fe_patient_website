import type { ReviewResponseDto } from '@/types/review.types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ReviewItemProps {
  review: ReviewResponseDto;
  showDoctorInfo?: boolean;
}

export default function ReviewItem({ review, showDoctorInfo = false }: ReviewItemProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`material-symbols-outlined text-sm ${
          i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
        }`}
        style={{ fontVariationSettings: i < rating ? "'FILL' 1" : "'FILL' 0" }}
      >
        star
      </span>
    ));
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy', { locale: vi });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="py-6 border-b border-slate-100 last:border-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            {review.reviewerAvatar ? (
              <img src={review.reviewerAvatar} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-slate-400">person</span>
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-tight">
              {review.isAnonymous ? 'Người dùng ẩn danh' : review.reviewerName || 'Bệnh nhân'}
            </p>
            <p className="text-xs text-slate-500 mt-1">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5 bg-slate-50 px-3 py-1.5 rounded-full">
          {renderStars(review.rating)}
          <span className="text-xs font-bold text-slate-600 ml-1">{review.rating}/5</span>
        </div>
      </div>

      <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm">
        {review.comment}
      </p>

      {showDoctorInfo && (review.doctorName || review.doctorAvatar) && (
        <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-blue-50/50 rounded-xl border border-blue-100/50 w-fit">
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Bác sĩ:</span>
          <div className="h-5 w-5 rounded-full bg-blue-100 overflow-hidden">
             {review.doctorAvatar ? (
               <img src={review.doctorAvatar} alt="" className="h-full w-full object-cover" />
             ) : (
               <span className="material-symbols-outlined text-[14px] text-blue-500">doctor</span>
             )}
          </div>
          <span className="text-xs font-semibold text-slate-700">{review.doctorName}</span>
        </div>
      )}

      {review.doctorResponse && (
        <div className="mt-4 rounded-2xl bg-slate-50 p-4 border border-slate-100 relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-blue-600 text-lg">reply</span>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Phản hồi từ bác sĩ
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
            "{review.doctorResponse}"
          </p>
          {review.responseAt && (
            <p className="text-[10px] text-slate-400 mt-2 text-right">
              Đã phản hồi vào {formatDate(review.responseAt)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
