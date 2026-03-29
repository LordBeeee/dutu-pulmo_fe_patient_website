import { useParams, useNavigate } from 'react-router-dom';
import { VideoPanel } from '@/components/Video/VideoPanel';
import { useVideoCallStatus } from '@/hooks/use-appointments';
import { Button } from '@/components/ui/button';
import { ChevronLeft, AlertCircle, Calendar } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth.store";

export default function VideoCallPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const {
    data: statusData,
    isLoading,
    isError,
  } = useVideoCallStatus(appointmentId || "");
  const { user } = useAuthStore();

  if (!appointmentId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <AlertCircle className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Thiếu thông tin cuộc gọi</h1>
        <p className="text-slate-500 mb-6">Mã lịch hẹn không hợp lệ hoặc đã bị xóa.</p>
        <Button onClick={() => navigate('/appointment-schedule')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Quay lại lịch hẹn
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-slate-500 font-medium">Đang kiểm tra trạng thái cuộc gọi...</p>
      </div>
    );
  }

  if (isError || !statusData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="bg-orange-50 p-4 rounded-full mb-4">
          <AlertCircle className="h-10 w-10 text-orange-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Không thể tải trạng thái</h1>
        <p className="text-slate-500 mb-6 font-medium">Đã có lỗi xảy ra khi kiểm tra quyền tham gia cuộc gọi.</p>
        <Button onClick={() => window.location.reload()}>Thử lại</Button>
      </div>
    );
  }

  if (!statusData.canJoin) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Card className="p-8 text-center shadow-xl border-slate-200">
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="h-10 w-10 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Chưa đến giờ tư vấn</h1>
          <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-100 italic text-slate-600">
            "{statusData.message || 'Hệ thống chưa cho phép bạn tham gia cuộc gọi này.'}"
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" onClick={() => navigate('/appointment-schedule')}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Lịch trình của tôi
            </Button>
            <Button variant="default" size="lg" onClick={() => window.location.reload()}>
              Làm mới trạng thái
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="h-[750px]">
        <VideoPanel
          appointmentId={appointmentId}
          userName={user?.fullName || ""}
          onJoined={() => console.log("Joined call")}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 border-l-4 border-l-blue-500">
          <h3 className="font-semibold text-slate-800 mb-1">Kiểm tra thiết bị</h3>
          <p className="text-sm text-slate-500">Đảm bảo bạn đã cho phép trình duyệt truy cập Camera và Micro.</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <h3 className="font-semibold text-slate-800 mb-1">Kết nối ổn định</h3>
          <p className="text-sm text-slate-500">Sử dụng Wifi hoặc mạng 4G mạnh để có chất lượng hình ảnh tốt nhất.</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <h3 className="font-semibold text-slate-800 mb-1">Không gian yên tĩnh</h3>
          <p className="text-sm text-slate-500">Chọn nơi đủ ánh sáng và ít tiếng ồn để bác sĩ dễ dàng tư vấn.</p>
        </Card>
      </div>
    </div>
  );
}
