import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSpecialties } from "@/hooks/use-appointments";
import { getSpecialtyConfig } from '@/components/home/SpecialtyConfig';

export default function SpecialtiesPage() {
  const { data: items = [], isLoading, isError } = useSpecialties();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const { label } = getSpecialtyConfig(item);
      return label.toLowerCase().includes(searchTerm.toLowerCase()) || 
             item.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [items, searchTerm]);

  // Example grouping logic
  const groups = useMemo(() => {
    const internal = ['Pulmonology', 'Respiratory Medicine', 'Tuberculosis'];
    const surgical = ['Thoracic Surgery'];
    
    const grouped = {
      'Nội khoa': filteredItems.filter(item => internal.includes(item)),
      'Ngoại khoa': filteredItems.filter(item => surgical.includes(item)),
      'Khác': filteredItems.filter(item => !internal.includes(item) && !surgical.includes(item))
    };

    return Object.entries(grouped).filter(([_, list]) => list.length > 0);
  }, [filteredItems]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header & Search */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 text-center md:text-left">Danh mục Chuyên khoa</h1>
          <p className="text-slate-500 text-center md:text-left">Tìm kiếm bác sĩ theo chuyên khoa phù hợp với nhu cầu của bạn</p>
        </div>
        <div className="relative w-full md:w-96">
          <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            type="text"
            placeholder="Tìm tên chuyên khoa..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : isError ? (
        <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100">
          <span className="material-icons-round text-4xl text-red-500 mb-4">error_outline</span>
          <p className="text-red-600 font-medium">Không thể tải danh sách chuyên khoa. Vui lòng thử lại sau.</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
          <span className="material-icons-round text-4xl text-slate-300 mb-4">search_off</span>
          <p className="text-slate-500 font-medium">Không tìm thấy chuyên khoa nào phù hợp với "{searchTerm}"</p>
        </div>
      ) : (
        <div className="space-y-16">
          {groups.map(([groupName, specialties]) => (
            <div key={groupName} className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-slate-800">{groupName}</h2>
                <div className="flex-1 h-px bg-slate-100" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {specialties.map((item) => {
                  const { label, icon, color, bg } = getSpecialtyConfig(item);
                  return (
                    <Link
                      key={item}
                      to={`/doctor?specialty=${encodeURIComponent(item)}`}
                      className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all flex flex-col items-center text-center gap-4"
                    >
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner"
                        style={{ backgroundColor: bg }}
                      >
                        <span className="material-symbols-rounded text-3xl" style={{ color }}>
                          {icon}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-slate-800 group-hover:text-primary transition-colors line-clamp-2">
                          {label}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Khám ngay</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suggestion Section */}
      {!isLoading && !isError && (
        <section className="bg-primary/5 rounded-[40px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <h3 className="text-2xl font-bold text-slate-900">Bạn chưa biết chọn chuyên khoa nào?</h3>
            <p className="text-slate-600 leading-relaxed">
              Trò chuyện với Trợ lý AI của chúng tôi để được tư vấn sơ bộ dựa trên các triệu chứng bạn đang gặp phải.
            </p>
          </div>
          <Link
            to="/chat-ai"
            className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-rounded">auto_awesome</span>
            Tư vấn cùng AI
          </Link>
        </section>
      )}
    </div>
  );
}
