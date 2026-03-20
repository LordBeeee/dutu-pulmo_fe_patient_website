import { Outlet } from 'react-router-dom';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';

export default function ProfileLayout() {
  return (
    <div className="bg-slate-50/50 dark:bg-slate-950/20 min-h-screen transition-colors">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Dashboard Sidebar */}
          <div className="flex-shrink-0">
            <ProfileSidebar />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
