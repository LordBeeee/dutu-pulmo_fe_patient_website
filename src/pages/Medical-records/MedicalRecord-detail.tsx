import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMedicalRecordDetail } from '@/hooks/use-medical-records';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { MedicalRecordStatus } from '@/types/medical.types';

const STATUS_MAP: Record<MedicalRecordStatus, { label: string; color: string; bg: string; icon: string }> = {
  DRAFT: { label: 'Bản nháp', color: 'text-slate-600', bg: 'bg-slate-100', icon: 'draft' },
  IN_PROGRESS: { label: 'Đang xử lý', color: 'text-blue-600', bg: 'bg-blue-100', icon: 'pending' },
  COMPLETED: { label: 'Hoàn thành', color: 'text-green-600', bg: 'bg-green-100', icon: 'check_circle' },
  CANCELLED: { label: 'Đã hủy', color: 'text-red-600', bg: 'bg-red-100', icon: 'cancel' },
};

const SIGNED_MAP: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  SIGNED: { label: 'Đã ký số', icon: 'verified', color: 'text-green-600', bg: 'bg-green-50' },
  NOT_SIGNED: { label: 'Chưa ký', icon: 'pending_actions', color: 'text-slate-400', bg: 'bg-slate-50' },
};

function sanitizeRichText(html: string): string {
  if (!html) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  doc.querySelectorAll('script, style, iframe, object, embed').forEach((node) => node.remove());
  doc.querySelectorAll('*').forEach((el) => {
    [...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      if (name.startsWith('on') || attr.value.trim().toLowerCase().startsWith('javascript:')) {
        el.removeAttribute(attr.name);
      }
    });
  });
  return doc.body.innerHTML;
}

function Section({ title, children, icon }: { title: string; children: React.ReactNode; icon: string }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
        <h2 className="font-bold text-slate-900">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function InfoRow({ label, value, isRichText = false }: { label: string; value?: string | number | boolean | string[] | null; isRichText?: boolean }) {
  if (value === undefined || value === null || value === '') return null;
  
  let displayValue = String(value);
  if (Array.isArray(value)) {
    displayValue = value.join(', ');
  } else if (typeof value === 'boolean') {
    displayValue = value ? 'Có' : 'Không';
  }

  return (
    <div className="mb-4 last:mb-0">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      {isRichText ? (
        <div
          className="prose prose-sm max-w-none text-slate-900"
          dangerouslySetInnerHTML={{ __html: sanitizeRichText(displayValue) }}
        />
      ) : (
        <p className="text-slate-900 whitespace-pre-line">{displayValue}</p>
      )}
    </div>
  );
}

export default function MedicalRecordDetailPage() {
  const { recordId } = useParams();
  const navigate = useNavigate();
  const { data: record, isLoading, isError, refetch } = useMedicalRecordDetail(recordId);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-8" />
        <div className="space-y-6">
          <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-96 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError || !record) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <span className="material-symbols-outlined text-red-400 text-6xl mb-4">error</span>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Không tìm thấy hồ sơ</h1>
        <p className="text-slate-500 mb-8">Hồ sơ bạn đang tìm kiếm không tồn tại hoặc bạn không có quyền truy cập.</p>
        <div className="flex justify-center gap-4">
          <button onClick={() => navigate('/medical-records')} className="px-6 py-2 border border-slate-200 rounded-xl font-semibold">
            Quay lại danh sách
          </button>
          <button onClick={() => void refetch()} className="px-6 py-2 bg-primary text-white rounded-xl font-semibold">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const status = STATUS_MAP[record.status] || STATUS_MAP.DRAFT;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-primary">Trang chủ</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link to="/medical-records" className="hover:text-primary">Hồ sơ y tế</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="font-medium text-slate-900">{record.recordNumber}</span>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 flex flex-col md:flex-row justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary text-3xl">medical_information</span>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-900">Chi tiết hồ sơ y tế</h1>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.color} flex items-center gap-1`}>
                  <span className="material-symbols-outlined text-sm">{status.icon}</span>
                  {status.label}
                </span>
                {record.signedStatus && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${SIGNED_MAP[record.signedStatus].bg} ${SIGNED_MAP[record.signedStatus].color} flex items-center gap-1`}>
                    <span className="material-symbols-outlined text-sm">{SIGNED_MAP[record.signedStatus].icon}</span>
                    {SIGNED_MAP[record.signedStatus].label}
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-1 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400 w-24">Mã hồ sơ:</span>
                <span className="font-semibold text-slate-900">{record.recordNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400 w-24">Bệnh nhân:</span>
                <span className="font-semibold text-slate-900">{record.patient?.user?.fullName || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400 w-24">Bác sĩ:</span>
                <span className="font-semibold text-slate-900">{record.doctor?.fullName || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400 w-24">Ngày khám:</span>
                <span className="font-semibold text-slate-900">
                  {record.appointment?.scheduledAt 
                    ? format(new Date(record.appointment.scheduledAt), 'EEEE, dd/MM/yyyy', { locale: vi })
                    : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {record.pdfUrl && (
            <a
              href={record.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors"
            >
              <span className="material-symbols-outlined">picture_as_pdf</span>
              Bản gốc (PDF)
            </a>
          )}
          <Link
            to={`/doctor/${record.doctor?.id}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Đặt lịch khám lại
          </Link>
        </div>
      </div>

      {/* ── TÍNH LIÊN TỤC CỦA HỒ SƠ ── */}
      {record.previousRecord && (
        <section className="bg-blue-50/50 rounded-2xl border border-blue-100 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-blue-600">history</span>
            <h2 className="font-bold text-blue-900">Liên kết hồ sơ (Tiền sử gần nhất)</h2>
          </div>
          <Link 
            to={`/medical-records/${record.previousRecord.id}`}
            className="block bg-white rounded-xl border border-blue-200 p-4 hover:border-blue-400 transition-all hover:shadow-sm group"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg">
                #{record.previousRecord.recordNumber}
              </span>
              <span className="text-xs text-slate-500 italic">
                {record.previousRecord.recordType}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-slate-400 text-lg">calendar_today</span>
                <span className="text-slate-500">Ngày khám:</span>
                <span className="font-semibold text-slate-900">
                  {format(new Date(record.previousRecord.createdAt), 'dd/MM/yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-slate-400 text-lg">person</span>
                <span className="text-slate-500">Bác sĩ:</span>
                <span className="font-semibold text-slate-900">
                  {record.previousRecord.doctorName || '—'}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 flex justify-end">
              <span className="text-blue-600 text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                Xem chi tiết hồ sơ này
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* Detailed Info */}
      <div className="grid grid-cols-1 gap-6">
        {/* ── CHỈ SỐ SINH HIỆU ── */}
        {record.vitalSigns && (
          <Section title="Chỉ số sinh hiệu" icon="vital_signs">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4">
              <InfoRow label="Nhiệt độ (°C)" value={record.vitalSigns.temperature} />
              <InfoRow label="Huyết áp" value={record.vitalSigns.bloodPressure} />
              <InfoRow label="Nhịp tim (bpm)" value={record.vitalSigns.heartRate} />
              <InfoRow label="Nhịp thở (bpm)" value={record.vitalSigns.respiratoryRate} />
              <InfoRow label="SpO2 (%)" value={record.vitalSigns.spo2} />
              <InfoRow label="Chiều cao (cm)" value={record.vitalSigns.height} />
              <InfoRow label="Cân nặng (kg)" value={record.vitalSigns.weight} />
              <InfoRow label="BMI" value={record.vitalSigns.bmi} />
            </div>
          </Section>
        )}

        {/* ── BỆNH ÁN ── */}
        <Section title="Bệnh án" icon="history_edu">
          <InfoRow label="Lý do khám" value={record.chiefComplaint} />
          <InfoRow label="Quá trình bệnh lý" value={record.presentIllness} isRichText />
          <InfoRow label="Đánh giá lâm sàng" value={record.assessment} />
          <InfoRow label="Chẩn đoán" value={record.diagnosis} />
          <InfoRow label="Phác đồ điều trị" value={record.treatmentPlan} />
          <InfoRow label="Ghi chú theo dõi" value={record.progressNotes} />
          <InfoRow label="Hướng điều trị tiếp" value={record.followUpInstructions} />
        </Section>

        {/* ── BỆNH SỬ ── */}
        <Section title="Bệnh sử" icon="history">
          <InfoRow label="Tiền sử bệnh" value={record.medicalHistory} />
          <InfoRow label="Tiền sử phẫu thuật" value={record.surgicalHistory} />
          <InfoRow label="Tiền sử gia đình" value={record.familyHistory} />
          <InfoRow label="Dị ứng" value={record.allergies} />
          <InfoRow label="Bệnh mãn tính" value={record.chronicDiseases} />
          <InfoRow label="Thuốc đang dùng" value={record.currentMedications} />
        </Section>

        {/* ── LỐI SỐNG ── */}
        <Section title="Lối sống" icon="accessibility_new">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow 
              label="Hút thuốc" 
              value={record.smokingStatus ? `Có${record.smokingYears ? ` (${record.smokingYears} năm)` : ''}` : 'Không'} 
            />
            <InfoRow label="Rượu bia" value={record.alcoholConsumption} />
          </div>
        </Section>

        {/* ── TỔNG KẾT ── */}
        {(record.primaryDiagnosis || record.secondaryDiagnosis || record.dischargeCondition || record.fullRecordSummary) && (
          <Section title="Tổng kết ra viện" icon="fact_check">
            <InfoRow label="Chẩn đoán chính" value={record.primaryDiagnosis} />
            <InfoRow label="Chẩn đoán kèm" value={record.secondaryDiagnosis} />
            <InfoRow label="Tình trạng ra viện" value={record.dischargeCondition} />
            <InfoRow label="Tóm tắt hồ sơ" value={record.fullRecordSummary} />
          </Section>
        )}

        {/* ── TẦM SOÁT ── */}
        {record.screeningRequests && record.screeningRequests.length > 0 && (
          <Section title="Tầm soát" icon="lab_research">
            <div className="space-y-4">
              {record.screeningRequests?.map((sr, idx) => (
                <div key={sr.id} className={`pb-4 ${(record.screeningRequests?.length ?? 0) > 0 && idx < (record.screeningRequests?.length ?? 0) - 1 ? 'border-b border-slate-50' : ''}`}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-slate-900">{sr.screeningNumber || '—'}</p>
                    <p className="text-xs text-slate-500 uppercase font-medium">{sr.screeningType}</p>
                  </div>
                  {sr.result && (
                    <p className="text-sm text-slate-600 mt-1">Kết quả: {sr.result}</p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── ĐƠN THUỐC ── */}
        {record.prescriptions && record.prescriptions.length > 0 && (
          <Section title="Đơn thuốc" icon="pill">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {record.prescriptions?.map((p) => (
                <Link
                  key={p.id}
                  to={`/prescriptions/${p.id}`}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-all hover:shadow-sm group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary border border-slate-100 group-hover:border-primary/20">
                      <span className="material-symbols-outlined">medication</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{p.prescriptionNumber}</p>
                      <p className="text-xs text-slate-500">Nhấn để xem chi tiết</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
                </Link>
              ))}
            </div>
          </Section>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200">
        <button
          onClick={() => navigate('/medical-records')}
          className="flex items-center gap-2 text-slate-500 font-semibold hover:text-slate-700 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Quay lại danh sách hồ sơ
        </button>
      </div>
    </main>
  );
}
