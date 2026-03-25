import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

const FAQ_ITEMS = [
  {
    question: "Cách đặt lịch khám?",
    answer:
      "Bạn chỉ cần chọn bác sĩ phù hợp, chọn khung giờ trống và xác nhận thông tin. Sau khi thanh toán (nếu có), lịch hẹn sẽ được ghi nhận ngay lập tức.",
  },
  {
    question: "Phương thức thanh toán?",
    answer:
      "Dutu Pulmo hỗ trợ thanh toán qua QR Code, ví điện tử và thẻ ngân hàng nội địa/quốc tế thông qua cổng thanh toán an toàn.",
  },
  {
    question: "Huỷ lịch & hoàn tiền?",
    answer:
      "Bạn có thể huỷ lịch trước ít nhất 24 giờ so với giờ hẹn. Tiền sẽ được hoàn lại vào tài khoản của bạn trong vòng 3-5 ngày làm việc.",
  },
  {
    question: "Tư vấn trực tuyến như thế nào?",
    answer:
      'Khi đến giờ hẹn, bạn vào mục "Lịch khám của tôi" và nhấn nút "Vào phòng khám" để bắt đầu cuộc gọi video với bác sĩ.',
  },
  {
    question: "Bảo mật thông tin y tế?",
    answer:
      "Toàn bộ dữ liệu khám bệnh và thông tin cá nhân của bạn được mã hóa và bảo mật tuyệt đối theo tiêu chuẩn quốc tế.",
  },
];

export default function SupportPage() {
  const user = useAuthStore((s) => s.user);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const fullName = user?.fullName;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900">
          Chào {fullName}, chúng tôi có thể giúp gì cho bạn?
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Tìm kiếm câu trả lời nhanh chóng hoặc kết nối trực tiếp với đội ngũ hỗ
          trợ của Dutu Pulmo.
        </p>
      </section>

      {/* Primary Support Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link
          to="/chat-ai"
          className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all flex items-start gap-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <span className="material-symbols-rounded text-3xl text-purple-600">
              auto_awesome
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
              Trợ lý AI Thông minh
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Tư vấn sức khỏe sơ bộ, giải đáp thắc mắc về triệu chứng và hướng
              dẫn sử dụng hệ thống 24/7.
            </p>
            <div className="mt-4 text-primary font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Trò chuyện ngay{" "}
              <span className="material-icons-round text-sm">
                arrow_forward
              </span>
            </div>
          </div>
        </Link>

        <Link
          to="/chat"
          className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all flex items-start gap-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <span className="material-symbols-rounded text-3xl text-blue-600">
              support_agent
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
              Chat với Chuyên viên
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Hỗ trợ trực tiếp từ đội ngũ CSKH về các vấn đề đặt lịch, thanh
              toán hoặc sự cố kỹ thuật.
            </p>
            <div className="mt-4 text-primary font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Kết nối ngay{" "}
              <span className="material-icons-round text-sm">
                arrow_forward
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* FAQ Section */}
      <section className="bg-slate-50 rounded-[40px] p-8 md:p-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center italic">
            Câu hỏi thường gặp
          </h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
                >
                  <span className="font-bold text-slate-800">
                    {faq.question}
                  </span>
                  <span
                    className={`material-icons-round transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`}
                  >
                    expand_more
                  </span>
                </button>
                <div
                  className={`px-6 transition-all duration-300 ease-in-out ${
                    openFaq === index
                      ? "max-h-40 py-5 border-t border-slate-50"
                      : "max-h-0 overflow-hidden"
                  }`}
                >
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Footer */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-8 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <span className="material-icons-round text-slate-600">phone</span>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Tổng đài hỗ trợ
            </p>
            <p className="font-bold text-slate-800">1900 0000</p>
          </div>
        </div>
        <div className="hidden md:block w-px h-8 bg-slate-200" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <span className="material-icons-round text-slate-600">mail</span>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Email liên hệ
            </p>
            <p className="font-bold text-slate-800">support@dutupulmo.vn</p>
          </div>
        </div>
        <div className="hidden md:block w-px h-8 bg-slate-200" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <span className="material-icons-round text-red-600 text-sm">
              report_problem
            </span>
          </div>
          <Link
            to="/reports/new"
            className="text-sm font-bold text-red-600 hover:underline"
          >
            Báo cáo sự cố hệ thống
          </Link>
        </div>
      </div>
    </div>
  );
}
