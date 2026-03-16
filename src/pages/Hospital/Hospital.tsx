import { useEffect, useState } from "react";
import type { Hospital as HospitalType } from "../../types/hospital";
import { getHospitals } from "../../services/hospital";
import HospitalCard from "../../components/Hospital/HospitalCard";
import HospitalLoading from "../../components/Hospital/HospitalLoading";
import HospitalEmpty from "../../components/Hospital/HospitalEmpty";
import HospitalPagination from "../../components/Hospital/HospitalPagination";

function Hospital() {
  const [hospitals, setHospitals] = useState<HospitalType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true);
        setError("");

        const json = await getHospitals(page, 9);

        console.log("Hospital API response:", json);

        setHospitals(json.data.items || []);
        setTotalPages(json.data.meta.totalPages || 1);
        setTotalItems(json.data.meta.totalItems || 0);
      } catch (err) {
        console.error("Error fetching hospitals:", err);
        setError("Không thể tải danh sách bệnh viện.");
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [page]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <span className="hover:text-primary cursor-pointer">Trang chủ</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="font-medium text-slate-900">Bệnh viện</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Danh sách bệnh viện</h1>
          <p className="text-slate-500 mt-1">
            Tìm bệnh viện phù hợp để khám và điều trị nhanh chóng
          </p>
        </div>

        <div className="text-sm text-slate-500">
          Tổng số bệnh viện: <span className="font-semibold">{totalItems}</span>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {loading ? (
          <HospitalLoading />
        ) : error ? (
          <div className="bg-white rounded-2xl border border-red-200 text-red-600 p-10 text-center">
            {error}
          </div>
        ) : hospitals.length === 0 ? (
          <HospitalEmpty />
        ) : (
          <div className="space-y-4">
            {hospitals.map((hospital) => (
              <HospitalCard key={hospital.id} hospital={hospital} />
            ))}
          </div>
        )}

        <HospitalPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </main>
  );
}

export default Hospital;