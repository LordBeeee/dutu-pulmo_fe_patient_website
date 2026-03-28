import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useNotificationUnreadCount } from '@/hooks/use-notifications';
import { useState } from 'react';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const { data: unreadCount } = useNotificationUnreadCount();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const fullName = user?.fullName || 'Người dùng';
  const avatarUrl = user?.avatarUrl || '/src/assets/default-avatar.png';

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/doctor?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <span className="material-icons-round">{mobileOpen ? 'close' : 'menu'}</span>
          </button>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to="/" className="w-24 h-24 rounded-lg flex items-center justify-center">
              <img src="/src/assets/Logo/chu_ngang_ko.png" alt="" />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            <Link
              to="/"
              className={`${
                isActive('/') 
                  ? 'text-primary font-semibold border-b-2 border-primary' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-primary'
              } py-5 transition-colors`}
            >
              Trang chủ
            </Link>

            <Link
              to="/appointment-schedule"
              className={`${
                isActive('/appointment-schedule') 
                  ? 'text-primary font-semibold border-b-2 border-primary' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-primary transition-colors'
              } py-5`}
            >
              Lịch khám
            </Link>

            <Link
              to="/chat"
              className={`${
                isActive('/chat') 
                  ? 'text-primary font-semibold border-b-2 border-primary' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-primary transition-colors'
              } py-5`}
            >
              Tin nhắn
            </Link>

            <Link
              to="/chat-ai"
              className={`${
                isActive('/chat-ai') 
                  ? 'text-primary font-semibold border-b-2 border-primary' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-primary transition-colors'
              } flex items-center gap-1 py-5`}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Tìm bác sĩ, chuyên khoa..."
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/notifications"
              className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center justify-center"
            >
              <span className="material-icons-round">notifications</span>
              {!!unreadCount && Number(unreadCount) > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-600 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1 shadow-sm z-10 animate-in zoom-in duration-300">
                  {Number(unreadCount) > 99 ? '99+' : String(unreadCount)}
                </span>
              )}
            </Link>

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
      </div>

      {/* Mobile navigation drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] mt-16 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 animate-in slide-in-from-top duration-300 overflow-y-auto">
          <nav className="p-4 flex flex-col gap-2">
            {[
              { to: '/', label: 'Trang chủ', icon: 'home' },
              { to: '/appointment-schedule', label: 'Lịch khám', icon: 'calendar_today' },
              { to: '/chat', label: 'Tin nhắn', icon: 'chat_bubble' },
              { to: '/chat-ai', label: 'Chat AI', icon: 'auto_awesome' },
              { to: '/profile', label: 'Cá nhân', icon: 'person' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                  isActive(link.to)
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span className="material-icons-round">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            
            {/* Mobile search bar */}
            <div className="mt-4 px-4 pb-12">
              <div className="relative">
                <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="Tìm bác sĩ, chuyên khoa..."
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full py-3 pl-10 pr-4 text-sm"
                />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;

