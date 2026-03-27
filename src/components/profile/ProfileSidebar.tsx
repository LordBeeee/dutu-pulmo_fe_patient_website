import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLogout } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { useUploadAvatar } from "@/hooks/use-profile";
import { toast } from "sonner";

export function ProfileSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useLogout();
  const { data: profile } = useProfile();
  const uploadAvatarMutation = useUploadAvatar();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const avatarUrl =
    avatarPreview || profile?.avatarUrl || "https://via.placeholder.com/150";

  const handleUploadAvatar = async (file: File) => {
    try {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      const result = await uploadAvatarMutation.mutateAsync(file);
      setAvatarPreview(result.upload.url);
      toast.success("Upload avatar thành công");
    } catch (error) {
      toast.error("Upload avatar thất bại");
      setAvatarPreview(null);
    }
  };

  const menuGroups = [
    {
      title: "Hồ sơ y tế",
      items: [
        { label: "Hồ sơ y tế", to: "/medical-records", icon: "folder_open" },
        { label: "Đơn thuốc", to: "/prescriptions", icon: "medication" },
      ],
    },
    {
      title: "Tiện ích",
      items: [
        { label: "Danh sách yêu thích", to: "/favorites", icon: "favorite" },
        { label: "Đánh giá của tôi", to: "/my-reviews", icon: "rate_review" },
        {
          label: "Lịch khám",
          to: "/appointment-schedule",
          icon: "calendar_today",
        },
        { label: "Tin nhắn", to: "/chat", icon: "chat_bubble" },
        { label: "Thông báo", to: "/notifications", icon: "notifications" },
      ],
    },
    {
      title: "Hỗ trợ & Tài khoản",
      items: [
        { label: "Hồ sơ cá nhân", to: "/profile", icon: "person" },
        { label: "Báo cáo của tôi", to: "/reports", icon: "flag" },
        { label: "Gửi báo cáo", to: "/reports/new", icon: "report_problem" },
        { label: "Cài đặt", to: "/settings", icon: "settings" },
        { label: "Đổi mật khẩu", to: "/change-password", icon: "lock" },
      ],
    },
  ];

  const isActive = (to: string) => location.pathname === to;

  return (
    <>
      <aside className="lg:w-72 space-y-6">
        {/* User Info Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors text-center">
          <div className="flex flex-col items-center">
            <label className="relative inline-block cursor-pointer group">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-md group-hover:opacity-90 transition-opacity"
              />
              <span className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[16px]">
                  edit
                </span>
              </span>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  await handleUploadAvatar(file);
                }}
              />
            </label>
            <div className="mt-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                {profile?.fullName || "Người dùng"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {profile?.email || profile?.phone || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-2 transition-colors">
          <div className="space-y-4">
            {menuGroups.map((group, idx) => (
              <div key={idx}>
                <h3 className="px-4 py-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  {group.title}
                </h3>
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                          isActive(item.to)
                            ? "bg-primary/10 text-primary"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {item.icon}
                        </span>
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors font-medium"
              >
                <span className="material-symbols-outlined text-[20px]">
                  logout
                </span>
                <span className="text-sm">Đăng xuất</span>
              </button>
            </div>
          </div>
        </nav>
      </aside>
      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] px-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm shadow-xl transition-colors scale-in-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
              Xác nhận đăng xuất
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Hủy
              </button>

              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                  navigate("/login");
                }}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 transition-all"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
