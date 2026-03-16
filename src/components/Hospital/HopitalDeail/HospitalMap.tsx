import type { Hospital } from "../../../types/hospital";

interface HospitalMapProps {
  hospital: Hospital;
}

function HospitalMap({ hospital }: HospitalMapProps) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border shadow-sm">
      <div className="p-6 border-b flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="material-icons-outlined text-primary">explore</span>
          Vị trí & Bản đồ
        </h2>
      </div>

      <iframe
        className="w-full h-[350px]"
        src={`https://www.google.com/maps?q=${hospital.latitude},${hospital.longitude}&hl=vi&z=16&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Hospital Map"
      />
    </div>
  );
}

export default HospitalMap;