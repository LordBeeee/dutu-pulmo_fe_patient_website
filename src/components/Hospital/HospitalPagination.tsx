interface HospitalPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function HospitalPagination({
  page,
  totalPages,
  onPageChange,
}: HospitalPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-12 flex-wrap">
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 ${
            page === i + 1
              ? "bg-primary text-white border-primary"
              : "text-slate-600"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}

export default HospitalPagination;