import { api } from "../../services/api";
import { useEffect } from "react";

function Home () {
    useEffect(() => {
        api.get("/")
        .then(res => console.log("BE response:", res.data))
        .catch(err => console.error("API error:", err));
    }, []);
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            <section className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl shadow-primary/20">
                <img
                alt="Medical professional background"
                className="absolute inset-0 w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuClJJVgPF9GOC3xH4w2KaRnwvgNmG1xoQfKGMjKniddEKrSG3jWbbnmxg7s71UjRlAR5O7Xu3ateAGgLJCTSCoFkv3Wbt9yS4c-PE2ylfnE_kuZlJXBf8Y5R3AA36USOacOeU77glHhYOFZ8_LmW5gTUCFGhaj7chbBx8C3l-zCv9yTll63goXdIdwQZ6HjJ2A3tjr2WsSt0F0gvest1wpp0E9FnhcnR-OsdK8Nqvf65HXIZ3YR8KM_NWQdT3qOrf01ltJTkw_JQ6o"
                />

                <div className="absolute inset-0 banner-mask flex flex-col justify-center px-12 text-white">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-6 w-fit">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    Chăm sóc toàn diện
                </span>

                <h1 className="text-5xl font-extrabold mb-4 leading-tight max-w-xl">
                    Chăm sóc sức khỏe
                    <br />
                    phổi toàn diện
                </h1>

                <p className="text-lg text-white/90 mb-8 max-w-md">
                    Đặt lịch khám với các chuyên gia hàng đầu và nhận tư vấn AI tức thì cho
                    sức khỏe của bạn.
                </p>

                <div className="flex gap-4">
                    <button className="bg-white text-primary px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all flex items-center gap-2">
                    Khám phá ngay{" "}
                    <span className="material-icons-round">arrow_forward</span>
                    </button>
                </div>
                </div>

                <div className="absolute bottom-6 right-12 flex gap-2">
                <div className="w-8 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                </div>
            </section>

            <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                <a className="flex flex-col items-center group cursor-pointer" href="/doctor-appointment">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                        <span className="material-icons-round text-3xl">person_search</span>
                    </div>
                    <span className="text-sm font-medium text-center">Đặt khám bác sĩ</span>
                </a>

                {/* <div className="flex flex-col items-center group cursor-pointer">
                <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-500 mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-icons-round text-3xl">meeting_room</span>
                </div>
                <span className="text-sm font-medium text-center">Phòng khám</span>
                </div> */}
                <a className="flex flex-col items-center group cursor-pointer" href="/doctor">
                <div className="w-16 h-16 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-500 mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-icons-round text-3xl">medical_services</span>
                </div>
                <span className="text-sm font-medium text-center">Bác sĩ</span>
                </a>
                <a className="flex flex-col items-center group cursor-pointer" href="/hospital">
                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-500 mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-icons-round text-3xl">domain</span>
                </div>
                <span className="text-sm font-medium text-center">Bệnh viện</span>
                </a>

                <div className="flex flex-col items-center group cursor-pointer">
                <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-500 mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-icons-round text-3xl">psychology</span>
                </div>
                <span className="text-sm font-medium text-center">Phân tích AI</span>
                </div>

                <div className="flex flex-col items-center group cursor-pointer">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-500 mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-icons-round text-3xl">forum</span>
                </div>
                <span className="text-sm font-medium text-center">Chat bác sĩ</span>
                </div>

                <div className="flex flex-col items-center group cursor-pointer">
                <div className="w-16 h-16 bg-sky-50 dark:bg-sky-900/30 rounded-2xl flex items-center justify-center text-sky-500 mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-icons-round text-3xl">videocam</span>
                </div>
                <span className="text-sm font-medium text-center">Video call</span>
                </div>

                <div className="flex flex-col items-center group cursor-pointer">
                <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center text-rose-500 mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-icons-round text-3xl">content_paste</span>
                </div>
                <span className="text-sm font-medium text-center">Hồ sơ sức khỏe</span>
                </div>

                <div className="flex flex-col items-center group cursor-pointer">
                <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-500 mb-3 group-hover:scale-110 transition-transform">
                    <span className="material-icons-round text-3xl">newspaper</span>
                </div>
                <span className="text-sm font-medium text-center">Tin tức y khoa</span>
                </div>
            </section>
            {/* ================= BÁC SĨ NỔI BẬT ================= */}
            <section>
                <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Bác sĩ nổi bật</h2>
                    <p className="text-slate-500 text-sm">
                    Đội ngũ chuyên gia giàu kinh nghiệm
                    </p>
                </div>
                <a
                    href="#"
                    className="text-primary font-semibold flex items-center gap-1 hover:underline"
                >
                    Xem tất cả
                    <span className="material-icons-round text-base">
                    chevron_right
                    </span>
                </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Doctor 1 */}
                <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
                    <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800 relative">
                    <img
                        alt="Doctor 1"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBN6uN6wccj54II1-CUD1JwQH_B_8PiRS93-O0A8aBRjCbYymtGumk3NmdVrBe8fGcJ30EtUKQSg9GKYbUHDXaHIo8R3QAz3XriUGgLEnMLI6E0WIGrJOG6-Z-B9tUZw_p5VRxAsbOP1Lhz8nJyg2U7ERcQDOhFlq3AX96t97oF3mfPqi21_gGTJl8edv7YolGrZvd5A-O-mPoM504UhO3mhwck7t3FaMk7ZQmrwk6pFK_XU5nTOyzqxFVsuFbAjm8qBpu8x0pz4mE"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90 px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                        <span className="material-icons-round text-amber-400 text-sm">
                        star
                        </span>
                        <span className="text-xs font-bold">4.9</span>
                    </div>
                    </div>
                    <h3 className="font-bold text-lg">BS. Trần Văn A</h3>
                    <p className="text-slate-500 text-sm mb-3">Chuyên khoa Hô hấp</p>
                    <div className="flex items-center text-xs text-slate-400">
                    <span className="material-icons-round text-xs mr-1">
                        location_on
                    </span>
                    Hà Nội
                    </div>
                </div>

                {/* Doctor 2 */}
                <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
                    <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800 relative">
                    <img
                        alt="Doctor 2"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCa-okpoukgmOk2cbz7qRbBvlgaB4aWc0dxtostaG2zmK6Ytl4l5TLauxNNAuTtlOybXa06oocmMJqg1SRh0Q2uqcET1AtSsacfRaXMxLuvxI_JA4zro-p7w54V4XE0jFo9tjIcjKPfBVhEfUxSipHG16D8onMBue9cealZr9KA9ESnZXSzD_FoujcIHZx3CkyZCWDbZ0oyAHa6d_5G56vDdm697974F6ouslR_1ONKJhG0vh3GbhgBtePqf7OhSU6IjbpnyyTXt9U"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90 px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                        <span className="material-icons-round text-amber-400 text-sm">
                        star
                        </span>
                        <span className="text-xs font-bold">4.8</span>
                    </div>
                    </div>
                    <h3 className="font-bold text-lg">ThS.BS. Lê Thị B</h3>
                    <p className="text-slate-500 text-sm mb-3">
                    Chuyên khoa Nội tiết
                    </p>
                    <div className="flex items-center text-xs text-slate-400">
                    <span className="material-icons-round text-xs mr-1">
                        location_on
                    </span>
                    TP. Hồ Chí Minh
                    </div>
                </div>

                {/* Doctor 3 */}
                <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
                    <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800 relative">
                    <img
                        alt="Doctor 3"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuASySm33eZHDlPv6_th2B_JIRprg1ZJQrPhXQTqsxcL4r2pSLqAyqCcs9u2ODtBHN840WSvjSCywaARjz15s-TjOEu-q05ZLWlyzINoz0dYRRLP7GHoA2qkfSfTrGtE-SFTeMzWf7zhYoY0qTFW7LK-1U-raDTGuqH67iQRbk0DXQxM4p0FKMj2N_sRejRW4cddVlsv_2sce3cc1ifD78ZMvqrWHTo1VoKHeS2j-wCdnrxvhm7pY4C-i2CnCSez5lpClAS3j0KWoWY"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90 px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                        <span className="material-icons-round text-amber-400 text-sm">
                        star
                        </span>
                        <span className="text-xs font-bold">5.0</span>
                    </div>
                    </div>
                    <h3 className="font-bold text-lg">
                    PGS.TS. Nguyễn Văn C
                    </h3>
                    <p className="text-slate-500 text-sm mb-3">
                    Chuyên khoa Tim mạch
                    </p>
                    <div className="flex items-center text-xs text-slate-400">
                    <span className="material-icons-round text-xs mr-1">
                        location_on
                    </span>
                    Đà Nẵng
                    </div>
                </div>

                {/* Doctor 4 */}
                <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
                    <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800 relative">
                    <img
                        alt="Doctor 4"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHakgyRE7unNXHhKUCtl0m9yxi0X37ZqCYBuCsWdCCNm6nL_UkM-nahGdTcEtd4wgXmamidIfe9N4WQrM3NGeT8eeQwCkLIDofv1KvW5rpBdP5d5aVQdC3OUoLeXov7dbiJ1IZO66n_Aznd2_gO3GM6h_RFwCjDiSe-VD4mO48aDkPCDsMe-bUqKsd8nP66YHzZvdIdF9Fq1QQ42SwOImL6I0928dBJAiuaPG73YXt_ZFy6Q3GXmVKNUXofhRAZLi46VJKWaFnWQc"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90 px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                        <span className="material-icons-round text-amber-400 text-sm">
                        star
                        </span>
                        <span className="text-xs font-bold">4.7</span>
                    </div>
                    </div>
                    <h3 className="font-bold text-lg">BS. Phạm Thị D</h3>
                    <p className="text-slate-500 text-sm mb-3">
                    Chuyên khoa Hô hấp nhi
                    </p>
                    <div className="flex items-center text-xs text-slate-400">
                    <span className="material-icons-round text-xs mr-1">
                        location_on
                    </span>
                    Hà Nội
                    </div>
                </div>
                </div>
            </section>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-end">
                    <h2 className="text-2xl font-bold">Cơ sở y tế</h2>
                    <a href="#" className="text-primary font-semibold text-sm hover:underline">
                        Xem tất cả
                    </a>
                    </div>

                    <div className="space-y-4">
                    <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex gap-4 items-center hover:shadow-md transition-shadow cursor-pointer">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                        <span className="material-icons-round text-primary text-3xl">
                            local_hospital
                        </span>
                        </div>
                        <div className="flex-1">
                        <h4 className="font-bold">Bệnh viện Đa khoa Tâm Anh</h4>
                        <p className="text-xs text-slate-500 mb-2">
                            2B Phổ Quang, Phường 2, Q.Tân Bình, TP.HCM
                        </p>
                        <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded uppercase">
                            Bệnh viện
                        </span>
                        </div>
                        <span className="material-icons-round text-slate-300">
                        chevron_right
                        </span>
                    </div>

                    <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex gap-4 items-center hover:shadow-md transition-shadow cursor-pointer">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                        <span className="material-icons-round text-emerald-500 text-3xl">
                            health_and_safety
                        </span>
                        </div>
                        <div className="flex-1">
                        <h4 className="font-bold">
                            Shine Clinic By TS.BS Trần N.
                        </h4>
                        <p className="text-xs text-slate-500 mb-2">
                            88 Trương Quyền, P.6, Q.3, TP.HCM
                        </p>
                        <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded uppercase">
                            Phòng khám
                        </span>
                        </div>
                        <span className="material-icons-round text-slate-300">
                        chevron_right
                        </span>
                    </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex justify-between items-end">
                    <h2 className="text-2xl font-bold">Chuyên khoa</h2>
                    <a href="#" className="text-primary font-semibold text-sm hover:underline">
                        Xem tất cả
                    </a>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2 hover:bg-primary/5 transition-colors cursor-pointer group">
                        <span className="material-icons-round text-primary group-hover:scale-110 transition-transform">
                        air
                        </span>
                        <span className="text-xs font-semibold">Hô hấp</span>
                    </div>

                    <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2 hover:bg-primary/5 transition-colors cursor-pointer group">
                        <span className="material-icons-round text-green-500 group-hover:scale-110 transition-transform">
                        monitor_heart
                        </span>
                        <span className="text-xs font-semibold">PT Lồng ngực</span>
                    </div>

                    <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2 hover:bg-primary/5 transition-colors cursor-pointer group">
                        <span className="material-icons-round text-sky-500 group-hover:scale-110 transition-transform">
                        stethoscope
                        </span>
                        <span className="text-xs font-semibold">Nội hô hấp</span>
                    </div>

                    <div className="bg-card-light dark:bg-card-dark p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2 hover:bg-primary/5 transition-colors cursor-pointer group">
                        <span className="material-icons-round text-amber-500 group-hover:scale-110 transition-transform">
                        coronavirus
                        </span>
                        <span className="text-xs font-semibold">Lao phổi</span>
                    </div>
                    </div>
                </div>
            </div>
            <section>
                <div className="flex justify-between items-end mb-6">
                    <div>
                    <h2 className="text-2xl font-bold">Tin tức y khoa</h2>
                    <p className="text-slate-500 text-sm">
                        Cập nhật thông tin sức khỏe mới nhất
                    </p>
                    </div>
                    <a
                    href="#"
                    className="text-primary font-semibold flex items-center gap-1 hover:underline"
                    >
                    Xem tất cả
                    <span className="material-icons-round text-base">
                        chevron_right
                    </span>
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <article className="bg-card-light dark:bg-card-dark rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 group cursor-pointer shadow-sm hover:shadow-lg transition-all">
                    <div className="aspect-video relative overflow-hidden">
                        <img
                        alt="Lung health"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2mdz1QSSKRvjTcIcQJR6b7lbOaj0yCIjdhQnAUG3RnHwW91wLQi9udcjCEcCotMejFh663iD51GTfjpywqfnc0-yMTacLJaocXRo3jp5Dfck40Z3Y7pxNmDNTLL3qbKW5F6ZGWJJ_VAWzfZTqEQsGNYDbBftKELmHWJocDi8qA-lOHbNInCgqXIuO8BwVZ8umlB2SC6WcYTkeRrRTZMSkY2mI4XTAbz0cYFDoci97q5GEBrfDmHTFWvDE8MZ9s0x2EbP3f3eghIA"
                        />
                        <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded">
                        NỔI BẬT
                        </span>
                    </div>
                    <div className="p-6">
                        <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        Cách bảo vệ phổi hiệu quả trong mùa ô nhiễm
                        </h3>
                        <div className="flex items-center text-slate-400 text-xs">
                        <span className="material-icons-round text-sm mr-1">
                            calendar_today
                        </span>
                        20/10/2023
                        </div>
                    </div>
                    </article>

                    <article className="bg-card-light dark:bg-card-dark rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 group cursor-pointer shadow-sm hover:shadow-lg transition-all">
                    <div className="aspect-video relative overflow-hidden">
                        <img
                        alt="Healthy diet"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDckaBjcqynxQYMay4r_TmwYYrk9V1TMiSy54v0fhfR1UBJjLwxa8ZkcIh8MGJxPfKIpeTeN7gJQxfPo8JO9PevsjXgIM07wEllIMtr7NAtAPwMY1RYzXwFDFsV1lZkx8iJwIqgK5Ber71zceW0VanHyHMY29ABHFCSQcS7hZZC_Bk3Crw1VWhOEU2I8iAFAlpOSx6j0_7L_bLs9luA4C0Bra-sHabdsSDnmGIhJiqLLc8pZkevRdSfz_Jv7oK65qRgCH70PiI7mgo"
                        />
                    </div>
                    <div className="p-6">
                        <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        5 loại thực phẩm giúp thanh lọc phổi tự nhiên
                        </h3>
                        <div className="flex items-center text-slate-400 text-xs">
                        <span className="material-icons-round text-sm mr-1">
                            calendar_today
                        </span>
                        18/10/2023
                        </div>
                    </div>
                    </article>

                    <article className="bg-card-light dark:bg-card-dark rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 group cursor-pointer shadow-sm hover:shadow-lg transition-all">
                    <div className="aspect-video relative overflow-hidden">
                        <img
                        alt="Exercises"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0zbGGU-cG0aHwXZrgrIb1-6Luo5eshNxPKKt1PI6iBJ0RW9ANUnB9MSNDn2vDUmg9NY4BrKTnbZmI0nfzdYviUuge_nVE4glzaQg4LDOpEtU2_jC2R7x-UA5gGEh8iIaXkcFllrvVYYZO3Hj2-fv1ljyYpd7oYSWHtjQ6MnRP1ZBxSF4WyYgxLlcTVYaoxQqkhpKM9HDMPymtMW9BYEQVQLcqFDLuA-fKyq1eceRGlfrnHrQcjnpwzqaKGrgmGt6ErP2cOiaoVQI"
                        />
                    </div>
                    <div className="p-6">
                        <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        Các bài tập thở đơn giản giúp tăng dung tích phổi
                        </h3>
                        <div className="flex items-center text-slate-400 text-xs">
                        <span className="material-icons-round text-sm mr-1">
                            calendar_today
                        </span>
                        15/10/2023
                        </div>
                    </div>
                    </article>
                </div>
                </section>

        {/* Các section Bác sĩ, Cơ sở y tế, Chuyên khoa, Tin tức
            ĐÃ GIỮ NGUYÊN CẤU TRÚC & NỘI DUNG – JSX hợp lệ */}
        </main>
    );
}

export default Home