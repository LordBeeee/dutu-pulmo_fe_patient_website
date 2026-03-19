import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import DoctorCard from '@/components/Doctor/DoctorCard';
import DoctorEmpty from '@/components/Doctor/DoctorEmpty';
import DoctorFilter from '@/components/Doctor/DoctorFilter';
import DoctorLoading from '@/components/Doctor/DoctorLoading';
import DoctorPagination from '@/components/Doctor/DoctorPagination';
import { useDoctors } from '@/hooks/use-doctors';
import { useHospitals } from '@/hooks/useHospitals';
import { DEFAULT_DOCTOR_FILTERS, DOCTOR_SPECIALTIES } from '@/lib/constants';
import { doctorService, type TimeSlotResponse } from '@/services/doctor';
import type { Doctor as DoctorModel, DoctorFilters } from '@/types/doctor';

const EMPTY_DOCTORS: DoctorModel[] = [];

function formatDate(iso: string) {
  return iso.slice(0, 10);
}

function getDayLabel(iso: string) {
  const date = iso.slice(0, 10);

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  if (date === todayStr) return 'Hôm nay';
  if (date === tomorrowStr) return 'Ngày mai';

  return new Date(iso).toLocaleDateString('vi-VN');
}

function getNearestAvailableDateSlots(slots: TimeSlotResponse[]) {
  const today = new Date().toISOString().slice(0, 10);
  const grouped: Record<string, TimeSlotResponse[]> = {};

  slots.forEach((slot) => {
    if (!slot.isAvailable) return;

    const date = formatDate(slot.startTime);
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(slot);
  });

  const nearestDate = Object.keys(grouped)
    .filter((date) => date >= today)
    .sort()[0];

  return nearestDate ? grouped[nearestDate] : [];
}

function DoctorPage() {
  const [searchParams] = useSearchParams();
  const queryHospitalId = searchParams.get('hospitalId') ?? '';
  const querySpecialty = (() => {
    const value = searchParams.get('specialty');
    if (!value) return DEFAULT_DOCTOR_FILTERS.specialty;
    return DOCTOR_SPECIALTIES.includes(value as (typeof DOCTOR_SPECIALTIES)[number])
      ? value
      : DEFAULT_DOCTOR_FILTERS.specialty;
  })();

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<DoctorFilters>({
    ...DEFAULT_DOCTOR_FILTERS,
    hospitalId: queryHospitalId,
    specialty: querySpecialty,
  });
  const [nearestSlotsByDoctorId, setNearestSlotsByDoctorId] = useState<Record<string, TimeSlotResponse[]>>({});

  const doctorsQuery = useDoctors(page, filters);
  const hospitalListQuery = useHospitals({ page: 1, limit: 100 });
  console.log(hospitalListQuery.data?.items);
  const doctors = doctorsQuery.data?.data.items ?? EMPTY_DOCTORS;
  const totalPages = doctorsQuery.data?.data.meta.totalPages ?? 1;
  const totalItems = doctorsQuery.data?.data.meta.totalItems ?? 0;
  const hospitalOptions = useMemo(
    () =>
      (hospitalListQuery.data?.items ?? []).map((hospital) => ({
        id: hospital.id,
        name: hospital.name,
      })),
    [hospitalListQuery.data],
  );

  useEffect(() => {
    let mounted = true;

    async function fetchNearestSlots() {
      const result: Record<string, TimeSlotResponse[]> = {};

      await Promise.all(
        doctors.map(async (doctor) => {
          const slots = await doctorService.getDoctorTimeSlots(doctor.id);
          result[doctor.id] = getNearestAvailableDateSlots(slots);
        }),
      );

      if (mounted) {
        setNearestSlotsByDoctorId(result);
      }
    }

    if (doctors.length > 0) {
      void fetchNearestSlots();
    }

    return () => {
      mounted = false;
    };
  }, [doctors]);

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
        <Link to="/" className="hover:text-primary">Trang chủ</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="font-medium text-slate-900">Bác sĩ</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Danh sách bác sĩ</h1>
          <p className="text-slate-500 mt-1">Tìm bác sĩ phù hợp và đặt lịch khám nhanh chóng</p>
        </div>

        <div className="text-sm text-slate-500">
          Tổng số bác sĩ: <span className="font-semibold">{totalItems}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <DoctorFilter
          filters={filters}
          hospitalOptions={hospitalOptions}
          onChange={handleChangeFilters}
          onReset={handleResetFilters}
        />

        <div className="flex-1">
          {doctorsQuery.isLoading ? (
            <DoctorLoading />
          ) : doctorsQuery.isError ? (
            <div className="bg-white rounded-2xl border border-red-200 text-red-600 p-10 text-center">Không thể tải danh sách bác sĩ.</div>
          ) : doctors.length === 0 ? (
            <DoctorEmpty />
          ) : (
            <div className="space-y-4">
              {doctors.map((doctor) => {
                const nearestSlots = nearestSlotsByDoctorId[doctor.id] ?? [];
                const nearestDayLabel = nearestSlots[0] ? getDayLabel(nearestSlots[0].startTime) : null;

                return (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    nearestSlots={nearestSlots}
                    nearestDayLabel={nearestDayLabel}
                  />
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

export default DoctorPage;
