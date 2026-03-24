export type ReportType = 'doctor' | 'appointment' | 'system';
export type ReportStatus = 'pending' | 'processing' | 'resolved' | 'rejected';

export interface CreateReportDto {
  reportType: ReportType;
  doctorId?: string;
  appointmentId?: string;
  content: string;
}

export interface ReportResponseDto {
  id: string;
  userId: string;
  reportType: ReportType;
  doctorId?: string;
  appointmentId?: string;
  content: string;
  status: ReportStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}
