import type { DoctorDetail } from "../../../types/doctor";
import { formatCurrency } from "../../../utils/doctor";

interface DoctorSidebarProps {
  doctor: DoctorDetail;
}

function DoctorSidebar({ doctor }: DoctorSidebarProps) {
  return (
    <aside className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sticky top-24">
        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">
            Giá khám
          </h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-primary">
              {formatCurrency(doctor.defaultConsultationFee)}
            </span>
            <span className="text-slate-400 text-sm">/ lượt</span>
          </div>
        </div>

        <div className="space-y-4">

          <button className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 rounded-xl">
            Đặt lịch khám ngay
          </button>
        </div>
      </div>
    </aside>
  );
}

export default DoctorSidebar;
