import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import { toast } from 'sonner';

import { useCreateReport } from '@/hooks/use-reports';
import { useAppointments } from '@/hooks/use-appointments';
import { doctorService } from '@/services/doctor';
import type { ReportType } from '@/types/report';

interface ReportFormData {
  reportType: ReportType;
  doctorId?: string;
  appointmentId?: string;
  content: string;
}

const REPORT_TYPE_OPTIONS = [
  { value: 'doctor', label: 'Báo cáo bác sĩ', icon: 'person_off', description: 'Khiếu nại về thái độ hoặc chuyên môn của bác sĩ' },
  { value: 'appointment', label: 'Báo cáo lịch khám', icon: 'event_busy', description: 'Sự cố liên quan đến việc đặt lịch, hủy lịch' },
  { value: 'system', label: 'Báo cáo hệ thống', icon: 'bug_report', description: 'Lỗi kỹ thuật, hiển thị hoặc tính năng trên website' },
];

export default function NewReportPage() {
  const navigate = useNavigate();
  const createReportMutation = useCreateReport();
  const { data: appointmentData } = useAppointments({ limit: 50 });
  const appointments = appointmentData?.items || [];

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<ReportFormData>({
    defaultValues: {
      reportType: 'system',
      content: '',
    },
  });

  const selectedType = watch('reportType');

  const loadDoctorOptions = async (inputValue: string) => {
    try {
      const response = await doctorService.getDoctors(1, {
        search: inputValue,
        specialty: 'ALL',
        hospitalId: '',
        appointmentType: 'all',
        sort: 'fullName',
        order: 'ASC',
      });
      return response.data.items.map((doc) => ({
        value: doc.id,
        label: `${doc.title || 'Bác sĩ'} ${doc.fullName} - ${doc.specialty}`,
        doc
      }));
    } catch (error) {
      console.error('Error loading doctors:', error);
      return [];
    }
  };

  const onSubmit = async (data: ReportFormData) => {
    try {
      await createReportMutation.mutateAsync(data);
      toast.success('Báo cáo của bạn đã được gửi thành công. Chúng tôi sẽ xử lý sớm nhất.');
      navigate('/reports');
    } catch (error) {
      const errorMessage =
        error instanceof Error && (error as any).response?.data?.message
          ? typeof (error as any).response.data.message === 'string'
            ? (error as any).response.data.message
            : (error as any).response.data.message.message
          : error instanceof Error
            ? error.message
            : 'Gửi báo cáo thất bại';
      toast.error(errorMessage);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-primary">Trang chủ</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link to="/reports" className="hover:text-primary">Báo cáo</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="font-medium text-slate-900">Gửi báo cáo</span>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900">Tạo báo cáo mới</h1>
          <p className="text-slate-500 mt-1">Cung cấp thông tin chi tiết để chúng tôi có thể hỗ trợ bạn tốt nhất</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
          {/* Loại báo cáo */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-900 block">Bạn muốn báo cáo về vấn đề gì?</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {REPORT_TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setValue('reportType', option.value as ReportType);
                    setValue('doctorId', undefined);
                    setValue('appointmentId', undefined);
                  }}
                  className={`flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-all ${
                    selectedType === option.value
                      ? 'border-primary bg-primary/5 ring-4 ring-primary/10'
                      : 'border-slate-100 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <span className={`material-symbols-outlined text-3xl mb-2 ${
                    selectedType === option.value ? 'text-primary' : 'text-slate-400'
                  }`}>
                    {option.icon}
                  </span>
                  <span className={`text-sm font-bold ${
                    selectedType === option.value ? 'text-primary' : 'text-slate-600'
                  }`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* Chọn bác sĩ */}
            {selectedType === 'doctor' && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 block">Chọn bác sĩ</label>
                <Controller
                  name="doctorId"
                  control={control}
                  render={({ field }) => (
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      placeholder="Nhập tên bác sĩ để tìm kiếm..."
                      loadOptions={loadDoctorOptions}
                      onChange={(option) => field.onChange(option?.value)}
                      classNamePrefix="react-select"
                      className="text-sm"
                    />
                  )}
                />
              </div>
            )}

            {/* Chọn lịch khám */}
            {selectedType === 'appointment' && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 block">Chọn lịch khám</label>
                <Controller
                  name="appointmentId"
                  control={control}
                  render={({ field }) => (
                    <select
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      <option value="">-- Chọn một lịch khám gần đây --</option>
                      {appointments.map((apt) => (
                        <option key={apt.id} value={apt.id}>
                          #{apt.appointmentNumber} - {apt.doctor?.fullName} ({new Date(apt.scheduledAt || '').toLocaleDateString('vi-VN')})
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
            )}

            {/* Nội dung báo cáo */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 block">Nội dung báo cáo</label>
              <Controller
                name="content"
                control={control}
                rules={{ required: 'Vui lòng nhập nội dung báo cáo', minLength: { value: 10, message: 'Nội dung phải từ 10 ký tự trở lên' } }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={6}
                    placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
                    className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm ${
                      errors.content ? 'border-red-500' : 'border-slate-200'
                    }`}
                  />
                )}
              />
              {errors.content && (
                <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>
              )}
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/reports')}
              className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={createReportMutation.isPending}
              className="flex-[2] py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all disabled:opacity-50 disabled:shadow-none"
            >
              {createReportMutation.isPending ? 'Đang gửi...' : 'Gửi báo cáo'}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4">
        <span className="material-symbols-outlined text-amber-500">info</span>
        <div className="text-sm text-slate-600">
          <p className="font-bold text-slate-900 mb-1">Quy định xử lý báo cáo:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Báo cáo sẽ được quản trị viên xem xét trong 24-48 giờ làm việc.</li>
            <li>Chúng tôi có thể liên hệ với bạn qua số điện thoại đã đăng ký để xác minh thêm.</li>
            <li>Các báo cáo sai sự thật có thể dẫn đến việc hạn chế tài khoản.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
