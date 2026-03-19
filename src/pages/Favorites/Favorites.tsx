import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites, useRemoveFavorite } from '@/hooks/use-favorites';
import FavoriteButton from '@/components/ui/FavoriteButton';
import { getSpecialtyConfig } from '@/components/home/SpecialtyConfig';

type TabType = 'doctors' | 'hospitals';

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('doctors');
  const { data: favorites = [], isLoading, isError, refetch } = useFavorites();

  const filteredFavorites = favorites.filter((f) =>
    activeTab === 'doctors' ? !!f.doctorId : !!f.hospitalId
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-primary">Trang chủ</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="font-medium text-slate-900">Yêu thích</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Danh sách yêu thích</h1>
          <p className="text-slate-500 mt-1">Quản lý các bác sĩ và cơ sở y tế bạn quan tâm</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('doctors')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'doctors'
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-lg">person</span>
            Bác sĩ
          </button>
          <button
            onClick={() => setActiveTab('hospitals')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'hospitals'
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-lg">local_hospital</span>
            Cơ sở y tế
          </button>
        </div>
      </div>

      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-slate-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="bg-white rounded-3xl border border-red-100 p-12 text-center">
            <span className="material-symbols-outlined text-red-400 text-5xl mb-4">error</span>
            <h3 className="text-lg font-bold text-slate-900">Đã có lỗi xảy ra</h3>
            <p className="text-slate-500 mt-2 mb-6">Không thể tải danh sách yêu thích của bạn.</p>
            <button
              onClick={() => void refetch()}
              className="px-8 py-3 bg-primary text-white rounded-2xl font-bold"
            >
              Thử lại
            </button>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl text-slate-300">
                {activeTab === 'doctors' ? 'person_off' : 'domain_disabled'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Danh sách trống</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">
              Bạn chưa thêm {activeTab === 'doctors' ? 'bác sĩ' : 'cơ sở y tế'} nào vào danh sách yêu thích.
            </p>
            <Link
              to={activeTab === 'doctors' ? '/doctor' : '/hospitals'}
              className="mt-8 inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
            >
              Xem danh sách {activeTab === 'doctors' ? 'bác sĩ' : 'cơ sở y tế'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((item) => {
              if (activeTab === 'doctors' && item.doctor) {
                const doctor = item.doctor;
                const specialty = getSpecialtyConfig(doctor.specialty || '');
                return (
                  <div key={item.id} className="bg-white rounded-3xl border border-slate-200 p-5 hover:shadow-lg transition-all group relative">
                    <div className="flex gap-4">
                      <div className="relative">
                        <img
                          src={doctor.avatarUrl || 'https://via.placeholder.com/150'}
                          alt={doctor.fullName}
                          className="w-20 h-20 rounded-2xl object-cover bg-slate-50"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                              {doctor.title || 'Bác sĩ'}
                            </span>
                            <h3 className="font-bold text-slate-900 line-clamp-1 mb-1">
                              {doctor.fullName}
                            </h3>
                          </div>
                          <FavoriteButton doctorId={doctor.id} className="!p-1.5" />
                        </div>
                        <span
                          className="inline-block px-2 py-0.5 rounded text-[10px] font-medium"
                          style={{ backgroundColor: specialty.bg, color: specialty.color }}
                        >
                          {specialty.label}
                        </span>
                        <div className="flex items-center gap-1 mt-2 text-amber-500">
                          <span className="material-symbols-outlined text-sm fill-current">star</span>
                          <span className="text-xs font-bold">{doctor.averageRating || '0.0'}</span>
                          <span className="text-[10px] text-slate-400">({doctor.totalReviews || 0})</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        <span className="line-clamp-1">{doctor.primaryHospital?.name || 'Chưa cập nhật'}</span>
                      </div>
                      <Link
                        to={`/doctor/${doctor.id}`}
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        Chi tiết
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                );
              }

              if (activeTab === 'hospitals' && item.hospital) {
                const hospital = item.hospital;
                const isClinic = hospital.name.toLowerCase().includes('phòng khám') || hospital.name.toLowerCase().includes('phong kham');
                return (
                  <div key={item.id} className="bg-white rounded-3xl border border-slate-200 p-5 hover:shadow-lg transition-all group relative">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-slate-50 overflow-hidden flex items-center justify-center flex-shrink-0">
                        {hospital.logoUrl ? (
                          <img src={hospital.logoUrl} alt={hospital.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-3xl text-primary">local_hospital</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              isClinic ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                            }`}>
                              {isClinic ? 'Phòng khám' : 'Bệnh viện'}
                            </span>
                            <h3 className="font-bold text-slate-900 line-clamp-2 mt-2 leading-snug">
                              {hospital.name}
                            </h3>
                          </div>
                          <FavoriteButton hospitalId={hospital.id} className="!p-1.5" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        <span className="line-clamp-1">{hospital.address || 'Chưa cập nhật'}</span>
                      </div>
                      <Link
                        to={`/hospitals/${hospital.id}`}
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        Chi tiết
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        )}
      </div>
    </main>
  );
}
