import { useState } from 'react';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

import { useRegister } from '@/hooks/useRegister';

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showconfirmPassword, setConfirmShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [success, setSuccess] = useState('');
  const registerMutation = useRegister();

  const handleRegister = async () => {
    const newErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Họ tên phải có ít nhất 2 ký tự';
    }

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
        'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số và ký tự đặc biệt';
    } else if (password.length > 128) {
      newErrors.password = 'Mật khẩu không quá 128 ký tự';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (!acceptTerms) {
      newErrors.terms = 'Bạn phải đồng ý với Điều khoản & Quy định';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      setSuccess('');

      await registerMutation.mutateAsync({ email, password, fullName });

      navigate('/verify-otp', { state: { email, mode: 'verify' } });
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 409) {
        setErrors({ email: 'Email đã tồn tại' });
      } else if (status === 400) {
        setErrors({ confirmPassword: message || 'Dữ liệu không hợp lệ' });
      } else if (status === 500) {
        setErrors({ confirmPassword: 'Hệ thống đang lỗi, vui lòng thử lại sau' });
      } else {
        setErrors({ confirmPassword: message || 'Đăng ký thất bại' });
      }
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
        <section className="w-full lg:w-1/2 p-8 bg-white dark:bg-background-dark">

            <div className="max-w-md mx-auto w-full">
                <div className="mb-5">
                <div className="flex-1 flex flex-row justify-center items-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                        Đăng ký tài khoản
                    </h2>
                    
                </div>
                
                <p className="text-gray-500 dark:text-gray-400">
                    Tham gia cùng chúng tôi để bắt đầu hành trình chăm sóc sức khỏe.
                </p>
                </div>

                <form
                  noValidate
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!loading) handleRegister();
                  }}
                >

                {/* Họ và tên */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Họ và tên
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Nhập họ tên của bạn"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-4 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                    />

                    <span className="material-icons-round absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                      person
                    </span>
                  </div>
                  {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Nhập email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                      />
                      <span className="material-icons-round absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                          mail
                      </span>
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                </div>

                {/* Mật khẩu */}
                <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Mật khẩu
                    </label>
                    <div className="relative">
                      <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-4 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                      />
                      <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)} 
                          className="material-icons-round absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                      >
                          {showPassword ? "visibility_off" : "visibility"}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    )}
                </div>

                {/* Xác nhận mật khẩu */}
                <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <input
                          type={showconfirmPassword ? "text" : "password"}
                          placeholder="Nhập lại mật khẩu"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-4 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                      />
                      <button
                          type="button"
                          onClick={() => setConfirmShowPassword(!showconfirmPassword)} 
                          className="material-icons-round absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                      >
                          {showconfirmPassword ? "visibility_off" : "visibility"}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                    )}
                </div>

                {/* Điều khoản */}
                <div className="flex items-center">
                    <input
                    id="terms"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => {
                      setAcceptTerms(e.target.checked);
                      setErrors((prev) => ({ ...prev, terms: undefined }));
                    }}
                    className="w-5 h-5 text-primary border-gray-300 dark:border-gray-700 rounded focus:ring-primary dark:bg-gray-800"
                    />
                    <label
                    htmlFor="terms"
                    className="ml-3 text-sm text-gray-600 dark:text-gray-400"
                    >
                    Tôi đồng ý với{" "}
                    <a className="text-primary font-medium hover:underline" href="#" target="_blank" rel="noopener noreferrer">
                        Điều khoản & Quy định
                    </a>
                    </label>
                </div>
                {errors.terms && (
                  <div className="text-red-500 text-xs mt-1" style={{ marginTop: "0.5rem" }}>{errors.terms}</div>
                )}
                {success && <p className="text-green-600 text-sm text-center">{success}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 active:scale-[0.98] transition-all"
                >
                  {loading ? "Đang đăng ký..." : "Đăng ký"}
                </button>
                </form>

                <div className="mt-8 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Đã có tài khoản?{" "}
                    <a className="text-primary font-bold hover:underline" href="/login">
                    Đăng nhập
                    </a>
                </p>
                </div>
            </div>
        </section>

      </main>

    </div>
  )
}

export default Register

