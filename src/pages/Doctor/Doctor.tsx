// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// interface Doctor {
//   id: string;
//   fullName: string;
//   gender: "MALE" | "FEMALE";
//   avatarUrl: string | null;
//   title: string | null;
//   specialty: string;
//   yearsOfExperience: number;
//   address: string | null;
//   defaultConsultationFee: string;
//   bio?: string | null;
//   email?: string | null;
//   phone?: string | null;
//   averageRating?: string;
//   totalReviews?: number;
//   hasOfflineFutureSlots?: boolean;
//   hasOnlineFutureSlots?: boolean;
//   primaryHospital?: {
//     id: string;
//     name: string;
//     hospitalCode?: string;
//     phone?: string;
//     email?: string;
//     address?: string | null;
//   };
// }

// interface DoctorsResponse {
//   data: {
//     items: Doctor[];
//     meta: {
//       page: number;
//       limit: number;
//       totalPages: number;
//       totalItems: number;
//     };
//   };
// }

// function Doctor() {
//   const navigate = useNavigate();

//   const [doctors, setDoctors] = useState<Doctor[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const res = await fetch(
//           `https://dutu-pulmo-be.onrender.com/public/doctors?page=${page}&limit=10`
//         );

//         const json: DoctorsResponse = await res.json();

//         console.log("Doctors API response:", json);

//         setDoctors(json.data.items || []);
//         setTotalPages(json.data.meta.totalPages || 1);
//       } catch (err) {
//         console.error("Error fetching doctors:", err);
//         setError("Không thể tải danh sách bác sĩ.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDoctors();
//   }, [page]);

//   if (loading) {
//     return (
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <h1 className="text-2xl font-bold mb-6">Danh sách bác sĩ</h1>
//         <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
//           Đang tải danh sách bác sĩ...
//         </div>
//       </main>
//     );
//   }

//   if (error) {
//     return (
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <h1 className="text-2xl font-bold mb-6">Danh sách bác sĩ</h1>
//         <div className="bg-white rounded-2xl border border-red-200 text-red-600 p-10 text-center">
//           {error}
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
//         <span className="hover:text-primary cursor-pointer">Trang chủ</span>
//         <span className="material-symbols-outlined text-xs">chevron_right</span>
//         <span className="font-medium text-slate-900">Bác sĩ</span>
//       </div>

//       <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
//         <div>
//           <h1 className="text-2xl font-bold">Danh sách bác sĩ</h1>
//           <p className="text-slate-500 mt-1">
//             Tìm bác sĩ phù hợp và đặt lịch khám nhanh chóng
//           </p>
//         </div>

//         <div className="text-sm text-slate-500">
//           Tổng số bác sĩ: <span className="font-semibold">{doctors.length}</span>
//         </div>
//       </div>

//       <div className="space-y-4">
//         {doctors.length === 0 ? (
//           <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
//             <div className="flex flex-col items-center gap-3">
//               <span className="material-symbols-outlined text-5xl text-slate-400">
//                 sentiment_dissatisfied
//               </span>
//               <p className="text-lg font-semibold text-slate-700">
//                 Không có bác sĩ nào
//               </p>
//               <p className="text-sm text-slate-500">
//                 Hiện chưa có dữ liệu bác sĩ để hiển thị.
//               </p>
//             </div>
//           </div>
//         ) : (
//           doctors.map((doctor) => (
//             <div
//               key={doctor.id}
//               className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 transition-all hover:shadow-md"
//             >
//               <div className="flex-shrink-0">
//                 <img
//                   src={doctor.avatarUrl || "https://via.placeholder.com/150"}
//                   alt={doctor.fullName}
//                   className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover bg-slate-100"
//                 />
//               </div>

//               <div className="flex-1">
//                 <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
//                   <div>
//                     <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
//                       {doctor.title || "Bác sĩ"}
//                     </p>

//                     <h3 className="text-xl font-bold mb-2">{doctor.fullName}</h3>

//                     <div className="flex flex-wrap gap-2 mb-3">
//                       <span className="px-3 py-1 bg-blue-50 text-primary text-xs font-medium rounded-full">
//                         {doctor.specialty || "Chưa cập nhật chuyên khoa"}
//                       </span>

//                       <span className="flex items-center gap-1 text-xs text-slate-500">
//                         <span className="material-symbols-outlined text-sm">
//                           history
//                         </span>
//                         {doctor.yearsOfExperience || 0} năm kinh nghiệm
//                       </span>

//                       <span className="flex items-center gap-1 text-xs text-amber-600">
//                         <span className="material-symbols-outlined text-sm">
//                           star
//                         </span>
//                         {doctor.averageRating || "0.00"} ({doctor.totalReviews || 0} đánh giá)
//                       </span>
//                     </div>

//                     <div className="space-y-2 text-sm text-slate-600">
//                       <p className="flex items-center gap-2">
//                         <span className="material-symbols-outlined text-lg">
//                           location_on
//                         </span>
//                         {doctor.primaryHospital?.name || "Chưa cập nhật bệnh viện"}
//                       </p>

//                       {doctor.phone && (
//                         <p className="flex items-center gap-2">
//                           <span className="material-symbols-outlined text-lg">
//                             call
//                           </span>
//                           {doctor.phone}
//                         </p>
//                       )}

//                       {doctor.email && (
//                         <p className="flex items-center gap-2">
//                           <span className="material-symbols-outlined text-lg">
//                             mail
//                           </span>
//                           {doctor.email}
//                         </p>
//                       )}

//                       <div className="flex flex-wrap gap-2 pt-1">
//                         {doctor.hasOfflineFutureSlots && (
//                           <span className="px-2 py-1 rounded-lg text-xs bg-green-50 text-green-700 border border-green-200">
//                             Có lịch khám tại viện
//                           </span>
//                         )}

//                         {doctor.hasOnlineFutureSlots && (
//                           <span className="px-2 py-1 rounded-lg text-xs bg-blue-50 text-blue-700 border border-blue-200">
//                             Có lịch tư vấn online
//                           </span>
//                         )}

//                         {!doctor.hasOfflineFutureSlots &&
//                           !doctor.hasOnlineFutureSlots && (
//                             <span className="px-2 py-1 rounded-lg text-xs bg-slate-50 text-slate-500 border border-slate-200">
//                               Chưa có lịch sắp tới
//                             </span>
//                           )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="md:text-right">
//                     <p className="text-xs text-slate-400 mb-1">Giá khám</p>
//                     <p className="text-lg font-bold text-primary">
//                       {Number(doctor.defaultConsultationFee || 0).toLocaleString("vi-VN")}đ
//                     </p>
//                   </div>
//                 </div>

//                 {doctor.bio && (
//                   <div className="mb-4">
//                     <p className="text-sm text-slate-600 leading-6 line-clamp-3">
//                       {doctor.bio}
//                     </p>
//                   </div>
//                 )}

//                 <div className="flex flex-wrap gap-3">
//                   {doctor.hasOnlineFutureSlots && (
//                     <button className="flex items-center gap-2 bg-green-500 text-white px-6 py-2.5 rounded-xl hover:bg-green-600 transition">
//                       <span className="material-symbols-outlined">videocam</span>
//                       Tư vấn
//                     </button>
//                   )}

//                   <button
//                     className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl hover:opacity-90 transition"
//                     onClick={() =>
//                       navigate("/appointment", {
//                         state: {
//                           doctorId: doctor.id,
//                         },
//                       })
//                     }
//                   >
//                     <span className="material-symbols-outlined">
//                       event_available
//                     </span>
//                     Đặt lịch
//                   </button>

//                   <button className="p-2.5 border rounded-xl items-center justify-center flex hover:bg-slate-50 transition">
//                     <span className="material-symbols-outlined">favorite</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {totalPages > 1 && (
//         <div className="flex justify-center gap-2 mt-12 flex-wrap">
//           {Array.from({ length: totalPages }).map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setPage(i + 1)}
//               className={`w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 ${
//                 page === i + 1 ? "bg-primary text-white" : "text-slate-600"
//               }`}
//             >
//               {i + 1}
//             </button>
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }

// export default Doctor;
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