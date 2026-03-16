import { Link } from "react-router-dom";

interface DoctorBreadcrumbProps {
  doctorName: string;
}

function DoctorBreadcrumb({ doctorName }: DoctorBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 py-4">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <li>
          <Link to="/" className="hover:text-primary">
            Trang chủ
          </Link>
        </li>

        <li>{">"}</li>

        <li>
          <Link to="/doctor" className="hover:text-primary">
            Bác sĩ
          </Link>
        </li>

        <li>{">"}</li>

        <li className="font-medium text-slate-900">{doctorName}</li>
      </ol>
    </nav>
  );
}

export default DoctorBreadcrumb;