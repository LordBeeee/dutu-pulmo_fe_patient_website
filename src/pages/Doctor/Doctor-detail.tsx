import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DoctorBreadcrumb from "../../components/Doctor/Doctor-detail/DoctorBreadcrumb";
import DoctorInfoSections from "../../components/Doctor/Doctor-detail/DoctorInfoSections";
import DoctorMainCard from "../../components/Doctor/Doctor-detail/DoctorMainCard";
// import DoctorSidebar from "../../components/Doctor/Doctor-detail/DoctorSidebar";
import { getPublicDoctorDetail } from "../../services/doctor";
import type { DoctorDetail as DoctorDetailType } from "../../types/doctor";

function DoctorDetail() {
  const { id } = useParams<{ id: string }>();

  const [doctor, setDoctor] = useState<DoctorDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchDoctorDetail = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getPublicDoctorDetail(id);
        setDoctor(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
          Đang tải thông tin bác sĩ...
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-white border border-red-200 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Không thể tải dữ liệu</h2>
          <p className="text-slate-600 mb-4">{error || "Không tìm thấy bác sĩ"}</p>
          <Link
            to="/doctor"
            className="inline-flex items-center px-4 py-2 rounded-xl bg-primary text-white font-medium hover:opacity-90"
          >
            Quay lại danh sách bác sĩ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <DoctorBreadcrumb doctorName={doctor.fullName || "Chưa cập nhật"} />

      <main className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1  gap-8">
          <div className="lg:col-span-2 space-y-6">
            <DoctorMainCard doctor={doctor} />
            <DoctorInfoSections doctor={doctor} />
          </div>

          {/* <DoctorSidebar doctor={doctor} /> */}
        </div>
      </main>
    </>
  );
}

export default DoctorDetail;