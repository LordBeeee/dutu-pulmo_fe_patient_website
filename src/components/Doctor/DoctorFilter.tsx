import { DOCTOR_SORT_OPTIONS, DOCTOR_SPECIALTIES } from '../../lib/constants';
import { getSpecialtyConfig } from '../home/SpecialtyConfig';
import type { DoctorFilters } from '../../types/doctor';

type HospitalOption = {
  id: string;
  name: string;
};

interface DoctorFilterProps {
  filters: DoctorFilters;
  hospitalOptions: HospitalOption[];
  onChange: (value: DoctorFilters) => void;
  onReset: () => void;
}

function DoctorFilter({ filters, hospitalOptions, onChange, onReset }: DoctorFilterProps) {
  const selectedSortValue = `${filters.sort}|${filters.order}`;

  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">filter_list</span>
            Bộ lọc tìm kiếm
          </h2>

          <button onClick={onReset} className="text-xs text-primary font-medium hover:underline">
            Xóa tất cả
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium block mb-2">Tìm kiếm</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onChange({ ...filters, search: e.target.value })}
              placeholder="Tên bác sĩ, chuyên khoa..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-3">Chuyên khoa</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="specialty"
                  checked={filters.specialty === 'ALL'}
                  onChange={() => onChange({ ...filters, specialty: 'ALL' })}
                />
                <span>Tất cả</span>
              </label>

              {DOCTOR_SPECIALTIES.map((specialty) => (
                <label key={specialty} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="specialty"
                    checked={filters.specialty === specialty}
                    onChange={() => onChange({ ...filters, specialty })}
                  />
                  <span>{getSpecialtyConfig(specialty).label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Bệnh viện/Phòng khám</label>
            <select
              value={filters.hospitalId}
              onChange={(e) => onChange({ ...filters, hospitalId: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">Tất cả cơ sở</option>
              {hospitalOptions.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-3">Loại lịch</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onChange({ ...filters, appointmentType: 'all' })}
                className={`py-2 text-sm rounded-lg border ${
                  filters.appointmentType === 'all'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                Tất cả
              </button>

              <button
                type="button"
                onClick={() => onChange({ ...filters, appointmentType: 'online' })}
                className={`py-2 text-sm rounded-lg border ${
                  filters.appointmentType === 'online'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                Online
              </button>

              <button
                type="button"
                onClick={() => onChange({ ...filters, appointmentType: 'offline' })}
                className={`py-2 text-sm rounded-lg border ${
                  filters.appointmentType === 'offline'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                Tại viện
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Sắp xếp</label>
            <select
              value={selectedSortValue}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('|');
                onChange({
                  ...filters,
                  sort,
                  order: order as 'ASC' | 'DESC',
                });
              }}
              className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2"
            >
              {DOCTOR_SORT_OPTIONS.map((option) => (
                <option key={`${option.sort}|${option.order}`} value={`${option.sort}|${option.order}`}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default DoctorFilter;
