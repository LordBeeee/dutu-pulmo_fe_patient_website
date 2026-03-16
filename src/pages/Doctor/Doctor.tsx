import { useEffect, useState } from "react";
import type { Doctor as DoctorType, DoctorFilters } from "../../types/doctor";
import { getDoctors } from "../../services/doctor";
import { DEFAULT_DOCTOR_FILTERS } from "../../lib/constants";
import DoctorCard from "../../components/Doctor/DoctorCard";
import DoctorFilter from "../../components/Doctor/DoctorFilter";
import DoctorPagination from "../../components/Doctor/DoctorPagination";
import DoctorLoading from "../../components/Doctor/DoctorLoading";
import DoctorEmpty from "../../components/Doctor/DoctorEmpty";

function Doctor() {
  const [doctors, setDoctors] = useState<DoctorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<DoctorFilters>(DEFAULT_DOCTOR_FILTERS);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError("");

        const json = await getDoctors(page, filters);

        setDoctors(json.data.items || []);
        setTotalPages(json.data.meta.totalPages || 1);
        setTotalItems(json.data.meta.totalItems || 0);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Không thể tải danh sách bác sĩ.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [page, filters]);

  const handleChangeFilters = (nextFilters: DoctorFilters) => {
    setPage(1);
    setFilters(nextFilters);
  };

  const handleResetFilters = () => {
    setPage(1);
    setFilters(DEFAULT_DOCTOR_FILTERS);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <span className="hover:text-primary cursor-pointer">Trang chủ</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="font-medium text-slate-900">Bác sĩ</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Danh sách bác sĩ</h1>
          <p className="text-slate-500 mt-1">
            Tìm bác sĩ phù hợp và đặt lịch khám nhanh chóng
          </p>
        </div>

        <div className="text-sm text-slate-500">
          Tổng số bác sĩ: <span className="font-semibold">{totalItems}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <DoctorFilter
          filters={filters}
          onChange={handleChangeFilters}
          onReset={handleResetFilters}
        />

        <div className="flex-1">
          {loading ? (
            <DoctorLoading />
          ) : error ? (
            <div className="bg-white rounded-2xl border border-red-200 text-red-600 p-10 text-center">
              {error}
            </div>
          ) : doctors.length === 0 ? (
            <DoctorEmpty />
          ) : (
            <div className="space-y-4">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          )}

          <DoctorPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </main>
  );
}

export default Doctor;