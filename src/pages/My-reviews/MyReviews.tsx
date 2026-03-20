import { useMyReviews, useDeleteReview } from '@/hooks/use-reviews';
import ReviewItem from '@/components/medical/ReviewItem';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function MyReviewsPage() {
  const { data: reviews = [], isLoading, isError, refetch } = useMyReviews();
  const deleteReview = useDeleteReview();

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này không?')) return;

    deleteReview.mutate(id, {
      onSuccess: () => {
        toast.success('Xóa đánh giá thành công.');
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error && (error as any).response?.data?.message
            ? typeof (error as any).response.data.message === 'string'
              ? (error as any).response.data.message
              : (error as any).response.data.message.message
            : error instanceof Error
              ? error.message
              : 'Có lỗi xảy ra khi xóa đánh giá';
        console.error(errorMessage);
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 transition-colors">Đánh giá của tôi</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">Quản lý các nhận xét và đánh giá bạn đã gửi cho bác sĩ</p>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-red-100 dark:border-red-900/30 p-8 text-center transition-colors">
            <span className="material-symbols-outlined text-red-400 text-4xl mb-2">error</span>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Lỗi khi tải danh sách đánh giá.</p>
            <button
              onClick={() => void refetch()}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-16 text-center shadow-sm transition-colors">
            <div className="h-20 w-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
               <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">rate_review</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 transition-colors">Chưa có đánh giá nào</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto transition-colors">
              Bạn chưa thực hiện đánh giá cho bác sĩ nào. Các đánh giá của bạn sẽ xuất hiện tại đây sau khi bạn hoàn thành lịch khám.
            </p>
            <Link 
              to="/appointment-schedule" 
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
            >
              Xem lịch khám đã hoàn thành
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                      <img src={review.doctorAvatar || 'https://via.placeholder.com/150'} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block leading-none mb-0.5 whitespace-nowrap">Bác sĩ</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{review.doctorName || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                    title="Xóa đánh giá"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
                <div className="px-6">
                   <ReviewItem review={review} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
