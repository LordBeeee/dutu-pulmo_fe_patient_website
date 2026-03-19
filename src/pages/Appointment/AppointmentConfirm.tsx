import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';

import type { Doctor } from '@/types/doctor';
import type { UserProfile } from '@/types/user';
import AppointmentBreadcrumb from '@/components/appointment/AppointmentBreadcrumb';
import AppointmentSteps from '@/components/appointment/AppointmentSteps';
import AppointmentInfoCard from '@/components/appointment/appointmentconfirm/AppointmentInfoCard';
import PatientInfoCard from '@/components/appointment/appointmentconfirm/PatientInfoCard';
import AgreementSection from '@/components/appointment/appointmentconfirm/AgreementSection';
import PaymentSummaryCard from '@/components/appointment/appointmentconfirm/PaymentSummaryCard';
import type { TimeSlot } from '@/components/appointment/TimeSlotSection';
import { useCreateAppointment } from '@/hooks/use-appointments';
import { useMyPatient } from '@/hooks/use-profile';

interface AppointmentConfirmState {
  doctor: Doctor;
  user: UserProfile;
  selectedDate: string;
  selectedSlotId: string;
  selectedSlot: TimeSlot;
  appointmentType: 'all' | 'online' | 'offline';
  chiefComplaint?: string;
  symptomsInput?: string;
  patientNotesHtml?: string;
}

export default function AppointmentConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const createAppointmentMutation = useCreateAppointment();
  const myPatientQuery = useMyPatient();

  const state = location.state as AppointmentConfirmState | null;

  if (!state) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-grow">
        <p className="text-red-500 mb-4">Không có dữ liệu đặt lịch.</p>
        <button onClick={() => navigate('/appointment')} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Quay lại
        </button>
      </main>
    );
  }

  const {
    doctor,
    user,
    selectedDate,
    selectedSlot,
    selectedSlotId,
    appointmentType,
    chiefComplaint: stateChiefComplaint = '',
    symptomsInput = '',
    patientNotesHtml = '',
  } = state;

  const parsedSymptoms = symptomsInput
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const chiefComplaint = stateChiefComplaint || (parsedSymptoms.length > 0 ? `Khám ${parsedSymptoms[0]}` : 'Khám bệnh');

  const isMeaningfulHtml = (value: string) => {
    const plain = value
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim();
    return plain.length > 0;
  };

  const sanitizeRichText = (html: string): string => {
    if (!html) return '';

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    doc.querySelectorAll('script, style, iframe, object, embed').forEach((node) => node.remove());

    doc.querySelectorAll('*').forEach((element) => {
      [...element.attributes].forEach((attribute) => {
        const name = attribute.name.toLowerCase();
        const value = attribute.value.trim().toLowerCase();

        if (name.startsWith('on') || value.startsWith('javascript:')) {
          element.removeAttribute(attribute.name);
        }
      });
    });

    return doc.body.innerHTML;
  };

  const safePatientNotesHtml = isMeaningfulHtml(patientNotesHtml) ? sanitizeRichText(patientNotesHtml) : '';

  const handleConfirmAppointment = async () => {
    try {
      setLoading(true);

      const patientId = myPatientQuery.data?.id;
      if (!patientId) {
        throw new Error('Không tìm thấy patientId');
      }

      if (!doctor.primaryHospital?.id) {
        throw new Error('Không tìm thấy bệnh viện của bác sĩ');
      }

      const appointment = await createAppointmentMutation.mutateAsync({
        timeSlotId: selectedSlotId,
        patientId,
        hospitalId: doctor.primaryHospital.id,
        subType: 'SCHEDULED',
        sourceType: 'EXTERNAL',
        chiefComplaint,
        symptoms: parsedSymptoms,
        patientNotes: safePatientNotesHtml || '',
      });

      toast.success('Đặt lịch thành công');

      navigate('/appointment-success', {
        state: {
          appointment,
          doctor,
          user,
          selectedDate,
          selectedSlot,
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error && (error as any).response?.data?.message
          ? typeof (error as any).response.data.message === 'string'
            ? (error as any).response.data.message
            : (error as any).response.data.message.message
          : error instanceof Error
            ? error.message
            : 'Có lỗi xảy ra khi tạo lịch';
      console.error(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-grow">
      <AppointmentBreadcrumb />
      <h1 className="text-2xl font-bold mb-8">Đặt lịch khám</h1>
      <AppointmentSteps currentStep={2} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <AppointmentInfoCard
            doctor={doctor}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            appointmentType={appointmentType}
          />
          <PatientInfoCard user={user} />
          <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Thông tin bổ sung</h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-2">Lý do khám</p>
                <p className="font-medium text-slate-900">{chiefComplaint}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-2">Triệu chứng</p>
                {parsedSymptoms.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {parsedSymptoms.map((symptom) => (
                      <span
                        key={symptom}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="font-medium text-slate-900">---</p>
                )}
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-2">Ghi chú bệnh nhân</p>
                {safePatientNotesHtml ? (
                  <div
                    className="prose prose-sm max-w-none text-slate-900 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0"
                    dangerouslySetInnerHTML={{ __html: safePatientNotesHtml }}
                  />
                ) : (
                  <p className="font-medium text-slate-900">---</p>
                )}
              </div>
            </div>
          </section>

          <AgreementSection onConfirm={handleConfirmAppointment} onBack={() => navigate(-1)} loading={loading} />
        </div>

        <div className="space-y-6">
          <PaymentSummaryCard selectedSlot={selectedSlot} />
        </div>
      </div>
    </main>
  );
}

