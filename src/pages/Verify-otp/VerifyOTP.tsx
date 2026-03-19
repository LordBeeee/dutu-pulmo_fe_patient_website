import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useForgotPassword } from '@/hooks/useForgotPassword';
import { useResendOtp } from '@/hooks/useResendOtp';
import { useVerifyOtp } from '@/hooks/useVerifyOtp';

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as { email?: string; mode?: 'verify' | 'reset' };
  const email = state.email || '';
  const mode = state.mode || 'verify';

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(59);
  const [canResend, setCanResend] = useState(false);

  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();
  const forgotPasswordMutation = useForgotPassword();

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password', { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown === 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (otp.every((digit) => digit !== '')) {
      void handleVerifyOtp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const handleResendOtp = async () => {
    if (!email) return;

    try {
      setLoading(true);

      if (mode === 'reset') {
        await forgotPasswordMutation.mutateAsync({ email });
      } else {
        await resendOtpMutation.mutateAsync({ email });
      }

      setCountdown(59);
      setCanResend(false);
      setOtp(Array(6).fill(''));
      setError(null);
      inputsRef.current[0]?.focus();
    } catch {
      setError('Không thể gửi lại mã OTP. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');

    if (!email) {
      setError('Không tìm thấy email. Vui lòng thử lại từ đầu.');
      return;
    }

    if (mode === 'reset') {
      navigate('/reset-password', { state: { email, otp: otpCode } });
      return;
    }

    try {
      setLoading(true);
      await verifyOtpMutation.mutateAsync({ email, otp: otpCode });
      alert('Xác thực thành công');
      navigate('/login');
    } catch {
      setError('Mã OTP không hợp lệ hoặc đã hết hạn');
      setOtp(Array(6).fill(''));
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    if (index > 0 && otp[index - 1] === '') return;
    if (error) setError(null);

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const maskEmail = (emailInput: string) => {
    const [name, domain] = emailInput.split('@');
    if (!name || !domain) return emailInput;
    const visible = name.slice(0, 2);
    const hidden = '*'.repeat(Math.max(name.length - 2, 0));
    return `${visible}${hidden}@${domain}`;
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-[440px] bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl p-10 relative overflow-hidden">
        {/* <a className="absolute top-8 left-8 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors" href="/register">
          <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-[28px]">chevron_left</span>
        </a> */}

        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-slate-800 dark:text-white mb-8">Xác thực OTP</h1>

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-3xl">lock</span>
            </div>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Mã xác thực đã được gửi đến email</p>
          <p className="text-slate-800 dark:text-white font-bold text-lg">{email ? maskEmail(email) : ''}</p>
        </div>

        <div className="flex gap-4 justify-center mb-8">
          {otp.map((value, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              disabled={loading}
              className="w-14 h-14 text-center text-2xl font-bold rounded-2xl border focus:border-primary outline-none"
            />
          ))}
        </div>

        {error && <div className="text-center text-sm text-red-500 font-medium mb-6">{error}</div>}

        <div className="text-center mb-10">
          {!canResend ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-900/10 text-primary dark:text-blue-400 rounded-full text-xs font-semibold">
              <span className="material-symbols-outlined text-sm">schedule</span>
              Gửi lại mã sau {countdown}s
            </div>
          ) : (
            <button onClick={handleResendOtp} disabled={loading} className="text-primary text-sm font-semibold hover:underline disabled:opacity-50">
              Gửi lại mã OTP
            </button>
          )}
        </div>

        <div className="text-center text-sm font-medium mb-6">Mã OTP có hiệu lực trong 5 phút</div>
      </div>
    </div>
  );
}

export default VerifyOTP;

