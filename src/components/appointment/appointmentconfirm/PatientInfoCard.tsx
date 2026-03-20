import type { UserProfile } from "../../../types/user";

interface PatientInfoCardProps {
  user: UserProfile;
}

export default function PatientInfoCard({ user }: PatientInfoCardProps) {
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Thông tin bệnh nhân
        </h2>

      </div>

      <div className="bg-white rounded-2xl p-8 card-shadow border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-y-8 gap-x-12">
        <div>
          <p className="text-xs text-slate-400 mb-1">Họ và tên</p>
          <p className="font-bold">{user.fullName || "Chưa cập nhật"}</p>
        </div>

        <div>
          <p className="text-xs text-slate-400 mb-1">Giới tính</p>
          <p className="font-bold">{user.gender || "Chưa cập nhật"}</p>
        </div>

        <div>
          <p className="text-xs text-slate-400 mb-1">Ngày sinh</p>
          <p className="font-bold">{user.dateOfBirth || "Chưa cập nhật"}</p>
        </div>

        <div>
          <p className="text-xs text-slate-400 mb-1">Điện thoại liên hệ</p>
          <p className="font-bold">{user.phone || "Chưa cập nhật"}</p>
        </div>

        <div>
          <p className="text-xs text-slate-400 mb-1">Mã căn cước công dân</p>
          <p className="font-bold">{user.CCCD || "Chưa cập nhật"}</p>
        </div>

        <div className="sm:col-span-3">
          <p className="text-xs text-slate-400 mb-1">Địa chỉ</p>
          <p className="font-medium text-slate-500">
            {user.address || "Chưa cập nhật"}
          </p>
        </div>
      </div>
    </section>
  );
}