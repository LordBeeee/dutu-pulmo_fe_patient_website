import { Link } from 'react-router-dom';

import { useAuthStore } from '@/store/auth.store';

function Header() {
  const user = useAuthStore((state) => state.user);

  const fullName = user?.fullName || 'Người dùng';
  const avatarUrl = user?.avatarUrl || '/src/assets/default-avatar.png';

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-24 h-24 rounded-lg flex items-center justify-center">
            <img src="/src/assets/Logo/chu_ngang_ko.png" alt="" />
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-6">
          <Link to="/" className="text-primary font-semibold border-b-2 border-primary py-5">
            Trang chủ
          </Link>

          <Link
            to="/appointment-schedule"
            className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors py-5"
          >
            Lịch khám
          </Link>

          <Link
            to="/chat"
            className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors py-5"
          >
            Tin nhắn
          </Link>

          <Link
            to="/chat-ai"
            className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors py-5"
          >
            <span className="material-icons-round text-sm">auto_awesome</span>
            Chat AI
          </Link>
        </nav>

        <div className="flex-grow max-w-md hidden md:block">
          <div className="relative">
            <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Tìm bác sĩ, chuyên khoa..."
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <span className="material-icons-round">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
          </button>

          <Link
            to="/profile"
            className="flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-slate-800"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-500 dark:text-slate-400">Xin chào,</p>
              <p className="text-sm font-semibold">{fullName}</p>
            </div>
            <img src={avatarUrl} alt="User avatar" className="w-9 h-9 rounded-full object-cover" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;

