import type { Doctor } from './doctor';
import type { UserProfile } from './user';

export type MedicalRecordStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type PrescriptionStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';

export interface Patient {
  id: string;
  profileCode?: string;
  user?: UserProfile;
}

export interface VitalSign {
  id: string;
  patientId: string;
  medicalRecordId?: string;
  temperature?: number;
  bloodPressure?: string;
  heartRate?: number;
  respiratoryRate?: number;
  spo2?: number;
  height?: number;
  weight?: number;
  bmi?: number;
  createdAt: string;
}

export interface PrescriptionItem {
  id: string;
  medicineId?: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions?: string;
  unit: string;
}

export interface ScreeningRequest {
  id: string;
  screeningNumber: string;
  screeningType: string;
  createdAt: string;
  medicalRecordId?: string;
  status: string;
  result?: string;
}

export interface MedicalRecord {
  id: string;
  recordNumber: string;
  patientId: string;
  patient?: Patient;
  doctorId?: string;
  doctor?: Doctor;
  appointmentId?: string;
  appointment?: any;
  chiefComplaint?: string;
  presentIllness?: string;
  medicalHistory?: string;
  physicalExamNotes?: string;
  assessment?: string;
  diagnosis?: string;
  treatmentPlan?: string;
  progressNotes?: string;
  status: MedicalRecordStatus;
  signedStatus?: 'SIGNED' | 'NOT_SIGNED';
  createdAt: string;
  updatedAt: string;
  pdfUrl?: string;
  vitalSigns?: VitalSign; // Changed from VitalSign[] to VitalSign for detail view consistency
  prescriptions?: Prescription[];
  followUpRequired?: boolean;
  nextAppointmentDate?: string;
  followUpInstructions?: string;
  
  // New fields from mobile
  surgicalHistory?: string;
  familyHistory?: string;
  allergies?: string[];
  chronicDiseases?: string[];
  currentMedications?: string[];
  smokingStatus?: boolean;
  smokingYears?: number;
  alcoholConsumption?: boolean;
  primaryDiagnosis?: string;
  secondaryDiagnosis?: string;
  dischargeCondition?: string;
  fullRecordSummary?: string;
  screeningRequests?: ScreeningRequest[];
}

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  patient?: Patient;
  doctorId?: string;
  doctor?: Doctor;
  medicalRecordId?: string;
  medicalRecord?: MedicalRecord;
  appointmentId?: string;
  diagnosis?: string;
  notes?: string;
  status: PrescriptionStatus;
  items: PrescriptionItem[];
  createdAt: string;
  pdfUrl?: string;
}

export interface MedicalRecordFilters {
  patientId: string;
  doctorId?: string;
  status?: MedicalRecordStatus;
  startDate?: string;
  endDate?: string;
}

export interface PrescriptionFilters {
  patientId: string;
  doctorId?: string;
  status?: PrescriptionStatus;
  startDate?: string;
  endDate?: string;
}
