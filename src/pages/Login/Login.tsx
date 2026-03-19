import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

import { useLogin } from '@/hooks/useLogin';
import { useAuthStore } from '@/store/auth.store';

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const loginMutation = useLogin();
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  useEffect(() => {
    if (accessToken && user) {
      navigate('/', { replace: true });
    }
  }, [accessToken, navigate, user]);

  const handleLogin = async () => {
    const newErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Email không đúng định dạng';
    }

    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    } else if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      newErrors.password =
        'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số và 1 ký tự đặc biệt';
    } else if (password.length > 128) {
      newErrors.password = 'Mật khẩu không quá 128 ký tự';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      await loginMutation.mutateAsync({ email, password });
      navigate('/');
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const status = error.response?.status;

      if (status === 401) {
        setErrors({ password: 'Mật khẩu hoặc email không đúng' });
        return;
      }

      if (status === 403) {
        setErrors({ email: 'Email chưa được xác nhận' });
        return;
      }

      setErrors({
        password: error.response?.data?.message || 'Đăng nhập thất bại',
      });
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
              
              <h2 className="text-3xl font-bold mb-2">Chào mừng trở lại</h2>
              <p className="text-gray-500">Đăng nhập để tiếp tục chăm sóc sức khỏe</p>
            </div>

            <form className="space-y-5"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (!loading) handleLogin();
            }}
            >
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
                  Email
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-rounded text-gray-400 text-xl">
                      mail
                    </span>
                  </div>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Nhập email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-gray-900 dark:text-white ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary transition-all placeholder:text-gray-400"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
                )}
              </div>


              {/* Mật khẩu */}
              <div>
                <div className="flex items-center justify-between mb-1.5 ml-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mật khẩu
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
                    placeholder="Nhập mật khẩu"
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

                  <a href="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
                    Quên mật khẩu?
                  </a>
                </div>
                
              </div>

              {/* Nút đăng nhập */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>

            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
              </div>

              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-background-dark px-4 text-gray-400 font-medium">
                  Hoặc đăng nhập bằng
                </span>
              </div>
            </div>

            {/* Social login buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group"
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlO_y1ImsVanJ1TMKj4bfdkzlT92AAIAT-EDZvFa4ticilaCTsayDawIH2t4lmfXpgIMN25mtKCyrCGfue2blPDcEjCl-fah6wel2yi_HB5BMOKL8EeapnXWsj0UufZvdAhu-5-ANcIrAH14lawbrfGbM6kYjisoFxqoHhX8N7AaRx4EQpBmCU7ehvKHXGomd7O1nrvqLi1PYYIV23TrILcNhPTnMOuGiPjZZ9gxs0vXs_OSvd6B2EDtVsz5eKroXVDRRF4-LS0w"
                  alt="Google Logo"
                  className="w-5 h-5"
                />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Google
                </span>
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group"
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxsNGm7iRGRnVsGyONxWJBzeMBNM2rlmITp_Z6B1BJc1kUaikscZ7tT1uYgGZIzt-12ER2VDJNGAANaT4dL1dv8cRlN7FKEx91kxiVC5NiKbq_kjHFj7R-36myj-h6NqO1qLkdCvVPZ5PmhFxxmUA5UH-8lC2koE-2bbYhoxwCodVbpkTjjXGsM5I_Y1X4ZVmw1XiRrMlPt4sTV6SNVRnKK1LdkGbSCR9RrWDy-bmDFUiZspkch19wYHaAV44_paW6U0kWqsKmeg"
                  alt="Facebook Logo"
                  className="w-5 h-5"
                />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Facebook
                </span>
              </button>
            </div>

            {/* Register link */}
            <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
              Bạn chưa có tài khoản?{" "}
              <a
                href="/register"
                className="text-primary font-bold hover:underline"
              >
                Đăng ký ngay
              </a>
            </p>

          </div>
        </section>

      </main>

    </div>
  )
}

export default Login


