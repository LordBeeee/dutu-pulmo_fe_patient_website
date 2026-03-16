function HospitalBreadcrumb() {
  return (
    <nav className="flex mb-6 text-sm font-medium">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li>
          <a className="text-slate-500 hover:text-primary" href="#">
            Trang chủ
          </a>
        </li>

        <li className="flex items-center">
          <span className="material-icons-outlined text-slate-400 text-sm">
            chevron_right
          </span>
          <a className="ml-1 text-slate-500 hover:text-primary" href="#">
            Danh sách bệnh viện
          </a>
        </li>

        <li className="flex items-center">
          <span className="material-icons-outlined text-slate-400 text-sm">
            chevron_right
          </span>
          <span className="ml-1 text-slate-900 font-semibold">
            Chi tiết bệnh viện
          </span>
        </li>
      </ol>
    </nav>
  );
}

export default HospitalBreadcrumb;