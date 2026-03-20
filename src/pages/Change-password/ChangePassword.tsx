import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useChangePassword } from '@/hooks/use-auth';
import type { ChangePasswordDto } from '@/types/auth.types';

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const changePasswordMutation = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ChangePasswordDto>();

  const newPassword = watch('newPassword');

  const onSubmit = async (data: ChangePasswordDto) => {
    try {
      await changePasswordMutation.mutateAsync(data);
      toast.success('Đổi mật khẩu thành công!');
      navigate('/profile');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Đổi mật khẩu thất bại';
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Đổi mật khẩu</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Vui lòng nhập mật khẩu hiện tại và mật khẩu mới của bạn.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          {/* Mật khẩu cũ */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 dark:text-slate-200 block">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              {...register('oldPassword', { required: 'Vui lòng nhập mật khẩu hiện tại' })}
              className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm dark:text-white ${
                errors.oldPassword ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
              }`}
            />
            {errors.oldPassword && (
              <p className="text-xs text-red-500">{errors.oldPassword.message}</p>
            )}
          </div>

          {/* Mật khẩu mới */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 dark:text-slate-200 block">
              Mật khẩu mới
            </label>
            <input
              type="password"
              {...register('newPassword', {
                required: 'Vui lòng nhập mật khẩu mới',
                minLength: { value: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                  message: 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt',
                },
              })}
              className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm dark:text-white ${
                errors.newPassword ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
              }`}
            />
            {errors.newPassword && (
              <p className="text-xs text-red-500">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 dark:text-slate-200 block">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              {...register('confirmPassword', {
                required: 'Vui lòng xác nhận mật khẩu mới',
                validate: (value) => value === newPassword || 'Mật khẩu xác nhận không khớp',
              })}
              className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm dark:text-white ${
                errors.confirmPassword ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex-1 py-3 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="flex-[2] py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all disabled:opacity-50 disabled:shadow-none"
            >
              {changePasswordMutation.isPending ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
