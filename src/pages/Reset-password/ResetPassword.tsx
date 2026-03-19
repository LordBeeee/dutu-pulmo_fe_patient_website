import { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { useResetPassword } from '@/hooks/useResetPassword';

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const state = (location.state || {}) as { email?: string; otp?: string };
    const email = state.email || searchParams.get('email') || '';
    const otp = state.otp || searchParams.get('otp') || '';

    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{
      password?: string;
      confirmPassword?: string;
    }>({});

    const resetPasswordMutation = useResetPassword();

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const nextErrors: typeof errors = {};

      if (!password) {
        nextErrors.password = 'Vui lòng nhập mật khẩu mới';
      } else if (password.length < 8) {
        nextErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
      }

      if (password !== confirmPassword) {
        nextErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
      }

      if (!email || !otp) {
        nextErrors.password = 'Thiếu email hoặc OTP để đặt lại mật khẩu';
      }

      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        return;
      }

      try {
        setLoading(true);
        setErrors({});

        await resetPasswordMutation.mutateAsync({
          email,
          otp,
          newPassword: password,
        });

        toast.success('Đặt lại mật khẩu thành công');
        navigate('/login');
      } catch (error) {
        const errorMessage =
          error instanceof Error && (error as any).response?.data?.message
            ? typeof (error as any).response.data.message === 'string'
              ? (error as any).response.data.message
              : (error as any).response.data.message.message
            : error instanceof Error
              ? error.message
              : 'Đặt lại mật khẩu thất bại';
        console.error(errorMessage);
        setErrors({
          password: errorMessage,
        });
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-300">

      <main className="flex min-h-screen">

        {/* ================== CỘT TRÁI ================== */}
        <section className="hidden lg:flex w-1/2 bg-primary relative flex-col items-center justify-center overflow-hidden p-12">

          {/* Hiệu ứng hình tròn */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[500px] h-[500px] border border-white/20 rounded-full flex items-center justify-center">
              <div className="w-[400px] h-[400px] border border-white/20 rounded-full flex items-center justify-center">
                <div className="w-[300px] h-[300px] border border-white/10 rounded-full pulse-soft"></div>
              </div>
            </div>

            <div className="absolute w-[500px] h-px bg-white/10 rotate-45"></div>
            <div className="absolute w-[500px] h-px bg-white/10 -rotate-45"></div>
          </div>

          {/* Nội dung trái */}
          <div className="relative z-10 text-center text-white max-w-lg">

            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 glass-effect rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="material-symbols-rounded text-white text-4xl">
                  medical_services
                </span>
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-6 tracking-tight leading-tight">
              Chăm sóc lá phổi,<br />bảo vệ tương lai
            </h1>

            <p className="text-white/80 text-lg leading-relaxed mb-12">
              Hệ thống quản lý và hỗ trợ sức khỏe hô hấp hiện đại nhất,<br/>
              giúp bạn theo dõi và cải thiện chức năng phổi mỗi ngày.
            </p>

            <div className="grid grid-cols-3 gap-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 glass-effect rounded-full flex items-center justify-center">
                  <span className="material-symbols-rounded text-sm">
                    analytics
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-widest font-semibold opacity-70">
                  Phân tích
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 glass-effect rounded-full flex items-center justify-center">
                  <span className="material-symbols-rounded text-sm">
                    calendar_month
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-widest font-semibold opacity-70">
                  Lịch hẹn
                </span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 glass-effect rounded-full flex items-center justify-center">
                  <span className="material-symbols-rounded text-sm">
                    lock
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-widest font-semibold opacity-70">
                  Bảo mật
                </span>
              </div>

            </div>

          </div>
        </section>

        {/* ================== CỘT PHẢI ================== */}
        <section className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-background-dark">

          <div className="w-full max-w-md">

            <div className="text-center mb-10">
              <div className=" flex items-center justify-center">
                <img src="/src/assets/Logo/logoduoi_konen.png" alt=""/>
              </div>
              
              <h2 className="text-3xl font-bold mb-2">Đặt lại mật khẩu</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed px-4">Nhập lại mật khẩu mới cho tài khoản.</p>
            </div>

            <form className="space-y-5" noValidate onSubmit={handleSubmit}>
              {/* Mật khẩu */}
              <div>
                <div className="flex items-center justify-between mb-1.5 ml-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mật khẩu mới
                  </label>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-rounded text-gray-400 text-xl">
                      lock
                    </span>
                  </div>

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-11 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary transition-all placeholder:text-gray-400"
                  />

                  <button type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    
                    <span className="material-symbols-rounded text-xl">
                      {showPassword ? "visibility_off" : "visibility"}
                      {/* visibility */}
                    </span>
                  </button>
                </div>
                <div className="flex items-center justify-between mt-1.5 ml-1">
                  <div>{errors.password && (
                    <p className="text-red-500 text-xs">{errors.password}</p>
                  )}</div>
                </div>

                <div className="flex items-center justify-between mb-1.5 ml-1">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Xác nhận mật khẩu
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-rounded text-gray-400 text-xl">
                      lock
                    </span>
                  </div>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-11 pr-11 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary transition-all placeholder:text-gray-400"
                  />

                  <button type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    
                    <span className="material-symbols-rounded text-xl">
                      {showPassword ? "visibility_off" : "visibility"}
                      {/* visibility */}
                    </span>
                  </button>
                </div>
                <div className="flex items-center justify-between mt-1.5 ml-1">
                  <div>{errors.confirmPassword && (
                    <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
                  )}</div>
                </div>
              </div>

              {/* Nút Đăng nhập */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Đang lưu..." : "Lưu mật khẩu mới"}
              </button>

            </form>


          </div>
        </section>

      </main>

    </div>
    )
}

export default ResetPassword

