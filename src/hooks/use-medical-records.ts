import { useQuery } from "@tanstack/react-query";
import medicalService from "@/services/medical.service";
import { useAuthStore } from "@/store/auth.store";

export const useMedicalRecords = () => {
  const { user } = useAuthStore();
  const patientId = user?.patientId;

  return useQuery({
    queryKey: ["medical-records", patientId],
    queryFn: () => medicalService.getPatientRecords(patientId!),
    enabled: !!patientId,
  });
};

export const useMedicalRecordDetail = (recordId?: string) => {
  return useQuery({
    queryKey: ["medical-record", recordId],
    queryFn: () => medicalService.getMedicalRecordDetail(recordId!),
    enabled: !!recordId,
  });
};

export const useMedicalRecordPdf = (recordId?: string) => {
  return useQuery({
    queryKey: ["medical-record-pdf", recordId],
    queryFn: () => medicalService.getMedicalRecordPdf(recordId!),
    enabled: !!recordId,
  });
};
