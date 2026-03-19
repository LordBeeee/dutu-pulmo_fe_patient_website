import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import DoctorPagination from '@/components/Doctor/DoctorPagination';
import { useHospitalCities, useHospitals } from '@/hooks/useHospitals';

type HospitalTypeFilter = 'all' | 'hospital' | 'clinic';

function HospitalsPage() {
  const [searchParams] = useSearchParams();
  const initialTypeFilter = useMemo<HospitalTypeFilter>(() => {
    const value = searchParams.get('type');
    return value === 'clinic' || value === 'hospital' ? value : 'all';
  }, [searchParams]);

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [typeFilter, setTypeFilter] = useState<HospitalTypeFilter>(initialTypeFilter);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearchDebounced(searchInput.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const hospitalsQuery = useHospitals({
    search: searchDebounced || undefined,
    city: selectedCity || undefined,
    page,
    limit: 10,
  });
  const citiesQuery = useHospitalCities();

  const hospitals = useMemo(() => hospitalsQuery.data?.items ?? [], [hospitalsQuery.data]);
  const totalPages = hospitalsQuery.data?.meta?.totalPages ?? 1;
  const totalItems = hospitalsQuery.data?.meta?.totalItems ?? hospitals.length;

  const filteredHospitals = useMemo(() => {
    if (typeFilter === 'all') return hospitals;

    return hospitals.filter((item) => {
      const name = item.name.toLowerCase();
      const isClinic = name.includes('phòng khám') || name.includes('phong kham');
      if (typeFilter === 'clinic') return isClinic;
      return !isClinic;
    });
  }, [hospitals, typeFilter]);

  const handleResetFilters = () => {
    setPage(1);
    setSearchInput('');
    setSearchDebounced('');
    setSelectedCity('');
    setTypeFilter('all');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-primary">Trang chủ</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="font-medium text-slate-900">Cơ sở y tế</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Danh sách cơ sở y tế</h1>
          <p className="text-slate-500 mt-1">Tìm bệnh viện và phòng khám phù hợp</p>
        </div>

        <div className="text-sm text-slate-500">
          Tổng số cơ sở: <span className="font-semibold">{totalItems}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">filter_list</span>
                Bộ lọc tìm kiếm
              </h2>

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-primary font-medium hover:underline"
              >
                Xóa tất cả
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium block mb-2">Tìm kiếm</label>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Tên bệnh viện, phòng khám..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Tỉnh/Thành</label>
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setPage(1);
                    setSelectedCity(e.target.value);
                  }}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="">Tất cả</option>
                  {(citiesQuery.data ?? []).map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-3">Loại cơ sở</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'all', label: 'Tất cả' },
                    { key: 'hospital', label: 'Bệnh viện' },
                    { key: 'clinic', label: 'Phòng khám' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setTypeFilter(tab.key as HospitalTypeFilter)}
                      className={`py-2 px-2 text-xs whitespace-nowrap rounded-lg border ${
                        typeFilter === tab.key
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {hospitalsQuery.isLoading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-slate-500">Đang tải cơ sở y tế...</div>
          ) : hospitalsQuery.isError ? (
            <div className="bg-white rounded-2xl border border-red-200 p-8 text-red-600">Không thể tải danh sách cơ sở y tế.</div>
          ) : filteredHospitals.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-slate-500">Không tìm thấy cơ sở phù hợp.</div>
          ) : (
            <div className="space-y-4">
              {filteredHospitals.map((hospital) => {
                const isClinic = hospital.name.toLowerCase().includes('phòng khám') || hospital.name.toLowerCase().includes('phong kham');

                return (
                  <Link
                    key={hospital.id}
                    to={`/hospitals/${hospital.id}`}
                    className="bg-white rounded-2xl border border-slate-200 p-5 flex gap-4 hover:shadow-md transition"
                  >
                    <div className="w-20 h-20 rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {hospital.logoUrl ? (
                        <img src={hospital.logoUrl} alt={hospital.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-3xl text-primary">local_hospital</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isClinic ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                          }`}
                        >
                          {isClinic ? 'Phòng khám' : 'Bệnh viện'}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 line-clamp-1">{hospital.name}</h3>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{hospital.address || 'Đang cập nhật địa chỉ'}</p>

                      <div className="mt-2 text-xs text-slate-400 flex flex-wrap gap-3">
                        {hospital.phone ? <span>{hospital.phone}</span> : null}
                        {hospital.email ? <span>{hospital.email}</span> : null}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <DoctorPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </main>
  );
}

export default HospitalsPage;
