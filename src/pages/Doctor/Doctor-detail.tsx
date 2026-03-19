import { Link, useParams } from 'react-router-dom';

import { usePublicDoctorDetail } from '@/hooks/use-doctors';
import DoctorBreadcrumb from '@/components/Doctor/Doctor-detail/DoctorBreadcrumb';
import DoctorInfoSections from '@/components/Doctor/Doctor-detail/DoctorInfoSections';
import DoctorMainCard from '@/components/Doctor/Doctor-detail/DoctorMainCard';
import DoctorSidebar from '@/components/Doctor/Doctor-detail/DoctorSidebar';

function DoctorDetail() {
  const { id } = useParams<{ id: string }>();
  const doctorQuery = usePublicDoctorDetail(id);

  if (doctorQuery.isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">Đang tải thông tin bác sĩ...</div>
      </div>
    );
  }

  if (doctorQuery.isError || !doctorQuery.data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-white border border-red-200 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Không thể tải dữ liệu</h2>
          <p className="text-slate-600 mb-4">Không tìm thấy bác sĩ hoặc đã có lỗi xảy ra</p>
          <Link to="/doctor" className="inline-flex items-center px-4 py-2 rounded-xl bg-primary text-white font-medium hover:opacity-90">
            Quay lại danh sách bác sĩ
          </Link>
        </div>
      </div>
    );
  }

  const doctor = doctorQuery.data;

  return (
    <>
      <DoctorBreadcrumb doctorName={doctor.fullName || 'Chưa cập nhật'} />

      <main className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <DoctorMainCard doctor={doctor} />
            <DoctorInfoSections doctor={doctor} />
          </div>

          <DoctorSidebar doctor={doctor} />
        </div>
      </main>
    </>
  );
}

export default DoctorDetail;

