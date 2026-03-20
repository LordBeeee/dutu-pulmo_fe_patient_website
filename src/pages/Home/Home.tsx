import { Link } from 'react-router-dom';

import NewsCard from '@/components/home/NewsCard';
import PromoBanner from '@/components/home/PromoBanner';
import QuickActions, { type QuickAction } from '@/components/home/QuickActions';
import SpecialtyGrid from '@/components/home/SpecialtyGrid';
import { SAMPLE_NEWS } from '@/constants/news-data';
import { usePublicDoctors, useSpecialties } from '@/hooks/use-appointments';
import { useHospitals } from '@/hooks/useHospitals';

function Home() {
  const doctorsQuery = usePublicDoctors({ page: 1, limit: 4 });
  const hospitalsQuery = useHospitals({ page: 1, limit: 4 });
  const specialtiesQuery = useSpecialties();

  const doctors = doctorsQuery.data?.items ?? [];
  const hospitals = hospitalsQuery.data?.items ?? [];
  const specialties = specialtiesQuery.data ?? [];

  const quickActions: QuickAction[] = [
    {
      key: 'doctors',
      label: 'Đặt khám\nbác sĩ',
      iconName: 'person_search',
      color: '#0A7CFF',
      bg: '#EFF6FF',
      to: '/doctor',
    },
    {
      key: 'clinic',
      label: 'Phòng\nkhám',
      iconName: 'local_hospital',
      color: '#10B981',
      bg: '#F0FDF4',
      to: '/hospitals?type=clinic',
    },
    {
      key: 'hospital',
      label: 'Bệnh\nviện',
      iconName: 'apartment',
      color: '#0A7CFF',
      bg: '#EFF6FF',
      to: '/hospitals?type=hospital',
    },
    {
      key: 'support',
      label: 'Hỗ trợ',
      iconName: 'center_focus_strong',
      color: '#4F46E5',
      bg: '#EEF2FF',
      to: '/support',
    },
    {
      key: 'chat',
      label: 'Chat\nbác sĩ',
      iconName: 'chat_bubble',
      color: '#10B981',
      bg: '#F0FDF4',
      to: '/chat',
    },
    {
      key: 'video',
      label: 'Đặt lịch\ntư vấn',
      iconName: 'calendar_month',
      color: '#0A7CFF',
      bg: '#EFF6FF',
      to: '/doctor',
    },
    {
      key: 'records',
      label: 'Hồ sơ\nsức khỏe',
      iconName: 'assignment',
      color: '#10B981',
      bg: '#F0FDF4',
      to: '/medical-records',
    },
    {
      key: 'news',
      label: 'Tin\ntức',
      iconName: 'article',
      color: '#0A7CFF',
      bg: '#EFF6FF',
      to: '/news',
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <PromoBanner />
      <QuickActions actions={quickActions} />

      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold">Bác sĩ nổi bật</h2>
            <p className="text-slate-500 text-sm">Đội ngũ chuyên gia giàu kinh nghiệm</p>
          </div>
          <Link to="/doctor" className="text-primary font-semibold flex items-center gap-1 hover:underline">
            Xem tất cả
          </Link>
        </div>

        {doctorsQuery.isLoading ? (
          <div className="text-slate-400 text-sm">Đang tải bác sĩ...</div>
        ) : doctorsQuery.isError ? (
          <div className="text-red-500 text-sm">Không thể tải dữ liệu bác sĩ.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doctor) => (
              <Link key={doctor.id} to={`/doctor/${doctor.id}`} className="bg-card-light p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-slate-100 relative">
                  <img
                    alt={doctor.fullName}
                    className="w-full h-full object-cover"
                    src={doctor.avatarUrl || 'https://via.placeholder.com/300x300?text=Doctor'}
                  />
                  <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <span className="material-icons-round text-amber-400 text-sm">star</span>
                    <span className="text-xs font-bold">{Number(doctor.averageRating || 0).toFixed(1)}</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg line-clamp-1">{doctor.fullName}</h3>
                <p className="text-slate-500 text-sm mb-3 line-clamp-1">{doctor.specialty || 'Hô hấp'}</p>
                <div className="text-xs text-slate-400">{doctor.primaryHospital?.name || 'Chưa cập nhật'}</div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="text-2xl font-bold">Cơ sở y tế</h2>
            <Link to="/hospitals" className="text-primary font-semibold flex items-center gap-1 hover:underline">
              Xem tất cả
            </Link>
          </div>

          {hospitalsQuery.isLoading ? (
            <div className="text-slate-400 text-sm">Đang tải cơ sở y tế...</div>
          ) : hospitalsQuery.isError ? (
            <div className="text-red-500 text-sm">Không thể tải cơ sở y tế.</div>
          ) : (
            <div className="space-y-4">
              {hospitals.map((hospital) => (
                <Link
                  key={hospital.id}
                  to={`/hospitals/${hospital.id}`}
                  className="bg-card-light p-4 rounded-2xl border border-slate-100 flex gap-4 items-center hover:shadow-md transition-shadow"
                >
                  <div className="w-20 h-20 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden">
                    {hospital.logoUrl ? (
                      <img src={hospital.logoUrl} alt={hospital.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-icons-round text-primary text-3xl">local_hospital</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">{hospital.name}</h4>
                    <p className="text-xs text-slate-500 mb-2">{hospital.address || 'Đang cập nhật địa chỉ'}</p>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">Cơ sở y tế</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="text-2xl font-bold">Chuyên khoa</h2>
            <Link to="/specialties" className="text-primary font-semibold flex items-center gap-1 hover:underline">
              Xem tất cả
            </Link>
          </div>
          {specialtiesQuery.isLoading ? (
            <div className="text-slate-400 text-sm">Đang tải chuyên khoa...</div>
          ) : specialtiesQuery.isError ? (
            <div className="text-red-500 text-sm">Không thể tải chuyên khoa.</div>
          ) : (
            <SpecialtyGrid items={specialties} />
          )}
        </div>
      </div>

      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold">Tin tức y khoa</h2>
            <p className="text-slate-500 text-sm">Cập nhật thông tin sức khỏe mới nhất</p>
          </div>
          <Link to="/news" className="text-primary font-semibold flex items-center gap-1 hover:underline">
            Xem tất cả
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SAMPLE_NEWS.map((news) => (
            <NewsCard key={news.id} item={news} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
