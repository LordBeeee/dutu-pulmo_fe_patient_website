// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "https://dutu-pulmo-be.onrender.com";

// interface Hospital {
//   id: string;
//   name: string;
//   hospitalCode: string;
//   phone: string;
//   email: string;
//   address: string;
//   ward: string;
//   province: string;
//   latitude: string;
//   longitude: string;
//   logoUrl: string;
//   createdAt: string;
//   updatedAt: string;
// }

// function HopitalDeail() {
//   const { id } = useParams();
//   const [hospital, setHospital] = useState<Hospital | null>(null);

//   useEffect(() => {
//     const fetchHospital = async () => {
//         try {
//         const res = await fetch(`${API_BASE_URL}/hospitals/${id}`);
//         const result = await res.json();

//         console.log("Hospital API response:", result);
//         setHospital(result.data);
//         } catch (error) {
//         console.error("Error fetching hospital:", error);
//         }
//     };

//     if (id) fetchHospital();
//     }, [id]);

//   if (!hospital) return <div className="p-10">Loading...</div>;

//   return (
//     <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

//       {/* Breadcrumb */}
//       <nav className="flex mb-6 text-sm font-medium">
//         <ol className="inline-flex items-center space-x-1 md:space-x-3">
//           <li>
//             <a className="text-slate-500 hover:text-primary" href="#">
//               Trang chủ
//             </a>
//           </li>

//           <li className="flex items-center">
//             <span className="material-icons-outlined text-slate-400 text-sm">
//               chevron_right
//             </span>
//             <a className="ml-1 text-slate-500 hover:text-primary" href="#">
//               Danh sách bệnh viện
//             </a>
//           </li>

//           <li className="flex items-center">
//             <span className="material-icons-outlined text-slate-400 text-sm">
//               chevron_right
//             </span>
//             <span className="ml-1 text-slate-900 font-semibold">
//               Chi tiết bệnh viện
//             </span>
//           </li>
//         </ol>
//       </nav>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//         {/* LEFT */}
//         <div className="lg:col-span-2 space-y-6">

//           {/* Hospital Card */}
//           <div className="bg-white rounded-3xl p-8 border shadow-sm">
//             <div className="flex flex-col md:flex-row gap-6">

//               {/* Image */}
//               <div className="w-full md:w-56 h-48 md:h-56 rounded-2xl overflow-hidden">
//                 <img
//                   src={hospital.logoUrl}
//                   alt={hospital.name}
//                   className="w-full h-full object-cover"
//                 />
//               </div>

//               {/* Info */}
//               <div className="flex-grow">

//                 <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">
//                   BỆNH VIỆN
//                 </p>

//                 <h1 className="text-3xl font-bold mb-2">
//                   {hospital.name}
//                 </h1>

//                 <div className="flex gap-2 mb-4">

//                   <span className="px-3 py-1 bg-blue-50 text-primary text-xs font-semibold rounded-full">
//                     Mã: {hospital.hospitalCode}
//                   </span>

//                   <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full flex items-center gap-1">
//                     <span className="material-icons-outlined text-[14px]">
//                       location_on
//                     </span>
//                     {hospital.province}
//                   </span>

//                 </div>

//                 {/* Contact */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600 mb-6">

//                   <div className="flex items-start gap-3">
//                     <span className="material-icons-outlined text-primary">
//                       place
//                     </span>
//                     <p>{hospital.address}</p>
//                   </div>

//                   <div className="flex items-start gap-3">
//                     <span className="material-icons-outlined text-primary">
//                       call
//                     </span>
//                     <p>{hospital.phone}</p>
//                   </div>

//                   <div className="flex items-start gap-3">
//                     <span className="material-icons-outlined text-primary">
//                       mail
//                     </span>
//                     <p>{hospital.email}</p>
//                   </div>

//                 </div>

//                 {/* Buttons */}
//                 <div className="flex gap-3">

//                   <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl">
//                     <span className="material-icons-outlined text-lg">
//                       event_available
//                     </span>
//                     Đặt lịch khám ngay
//                   </button>

//                   <a
//                     href={`https://www.google.com/maps?q=${hospital.latitude},${hospital.longitude}`}
//                     target="_blank"
//                     className="flex items-center gap-2 px-6 py-3 border border-primary text-primary font-semibold rounded-xl"
//                   >
//                     <span className="material-icons-outlined text-lg">
//                       map
//                     </span>
//                     Xem bản đồ
//                   </a>

//                 </div>

//               </div>
//             </div>
//           </div>

//           {/* Map */}
//           <div className="bg-white rounded-3xl overflow-hidden border shadow-sm">

//             <div className="p-6 border-b flex items-center justify-between">
//               <h2 className="text-lg font-bold flex items-center gap-2">
//                 <span className="material-icons-outlined text-primary">
//                   explore
//                 </span>
//                 Vị trí & Bản đồ
//               </h2>
//             </div>

//             <iframe
//               className="w-full h-[350px]"
//               src={`https://maps.google.com/maps?q=${hospital.latitude},${hospital.longitude}&z=15&output=embed`}
//             />

//           </div>

//         </div>

//         {/* RIGHT */}
//         <div className="space-y-6">

//           {/* Extra Info */}
//           <div className="bg-white rounded-3xl p-6 border shadow-sm">

//             <h3 className="font-bold mb-4 flex items-center gap-2">
//               <span className="material-icons-outlined text-primary">
//                 info
//               </span>
//               Thông tin bổ sung
//             </h3>

//             <div className="space-y-4">

//               <div className="flex justify-between border-b pb-3">
//                 <span className="text-sm text-slate-500">Khu vực</span>
//                 <span className="text-sm font-semibold">
//                   {hospital.province}
//                 </span>
//               </div>

//               <div className="flex justify-between border-b pb-3">
//                 <span className="text-sm text-slate-500">Phường</span>
//                 <span className="text-sm font-semibold">
//                   {hospital.ward || "—"}
//                 </span>
//               </div>

//             </div>

//           </div>

//         </div>

//       </div>

//     </main>
//   );
// }

// export default HopitalDeail;
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HospitalBreadcrumb from "../../components/Hospital/HopitalDeail/HospitalBreadcrumb";
import HospitalExtraInfo from "../../components/Hospital/HopitalDeail/HospitalExtraInfo";
import HospitalHeaderCard from "../../components/Hospital/HopitalDeail/HospitalHeaderCard";
import HospitalMap from "../../components/Hospital/HopitalDeail/HospitalMap";
import { getDoctorsByHospital, getHospitalDetail } from "../../services/hospital";
import type { Hospital } from "../../types/hospital";
import type { Doctor } from "../../types/doctor";
import HospitalDoctorsList from "../../components/Hospital/HopitalDeail/HospitalDoctorsList";

function HospitalDetail() {
  const { id } = useParams();

  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchHospital = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getHospitalDetail(id);
        setHospital(data);
      } catch (err) {
        console.error(err);
        setError("Không tải được thông tin bệnh viện");
      } finally {
        setLoading(false);
      }
    };

    const fetchDoctors = async () => {
      try {
        setDoctorsLoading(true);

        const data = await getDoctorsByHospital(id, 1, 20);
        setDoctors(data);
      } catch (err) {
        console.error(err);
        setDoctors([]);
      } finally {
        setDoctorsLoading(false);
      }
    };

    fetchHospital();
    fetchDoctors();
  }, [id]);

  if (loading) {
    return <div className="p-10">Đang tải...</div>;
  }

  if (error) {
    return <div className="p-10 text-red-500">{error}</div>;
  }

  if (!hospital) {
    return <div className="p-10">Không có dữ liệu bệnh viện</div>;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <HospitalBreadcrumb />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <HospitalHeaderCard hospital={hospital} />
          <HospitalMap hospital={hospital} />
          <HospitalDoctorsList doctors={doctors} loading={doctorsLoading} />
        </div>

        <div className="space-y-6">
          <HospitalExtraInfo hospital={hospital} />
        </div>
      </div>
    </main>
  );
}

export default HospitalDetail;