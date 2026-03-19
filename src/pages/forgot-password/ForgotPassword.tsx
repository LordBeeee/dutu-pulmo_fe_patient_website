import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useForgotPassword } from '@/hooks/useForgotPassword';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
  }>({});
  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { email?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      newErrors.email = 'Email không đúng định dạng';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      await forgotPasswordMutation.mutateAsync({ email });
    } catch {
      // Keep the same behavior as mobile: do not reveal whether email exists.
    } finally {
      setLoading(false);
      navigate('/verify-otp', { state: { email, mode: 'reset' } });
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
                        <div className="mb-8">
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="mb-4">
                            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                                <span className="material-icons-round text-primary text-4xl">
                                air
                                </span>
                            </div>
                            </div>

                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                            Quên mật khẩu
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed px-4">
                            Nhập email liên kết với tài khoản của bạn để nhận mã xác thực
                            khôi phục mật khẩu.
                            </p>
                        </div>
                        </div>

                        <form className="space-y-6" noValidate onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Email
                            </label>
                            <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="material-icons-round text-gray-400 group-focus-within:text-primary transition-colors text-xl">
                                mail_outline
                                </span>
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email của bạn"
                                className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                required
                            />
                            {errors.email && (
                            <p className="text-sm text-red-500 mt-2">
                                {errors.email}
                            </p>
                            )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center"
                        >
                            {loading ? "Đang gửi..." : "Tiếp tục"}
                        </button>
                        </form>
                    </div>
                
                </section>

            </main>

        </div>
    )
    
}

export default ForgotPassword

