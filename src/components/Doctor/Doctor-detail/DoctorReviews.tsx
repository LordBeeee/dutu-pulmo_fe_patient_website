import { useDoctorReviews } from '@/hooks/use-reviews';
import ReviewItem from '@/components/medical/ReviewItem';

interface DoctorReviewsProps {
  doctorId: string;
}

export default function DoctorReviews({ doctorId }: DoctorReviewsProps) {
  const { data: reviews = [], isLoading, isError } = useDoctorReviews(doctorId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-32 bg-slate-50 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
        <p>Lỗi khi tải đánh giá.</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <span className="material-symbols-outlined text-4xl mb-2 opacity-20">rate_review</span>
        <p className="text-sm">Chưa có đánh giá nào cho bác sĩ này.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
}
