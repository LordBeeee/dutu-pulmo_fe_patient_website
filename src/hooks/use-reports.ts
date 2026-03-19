import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reportService } from '@/services/report.service';
import type { CreateReportDto } from '@/types/report';

export const reportKeys = {
  all: ['reports'] as const,
  myList: () => [...reportKeys.all, 'my'] as const,
  detail: (id: string) => [...reportKeys.all, 'detail', id] as const,
};

export function useReports() {
  return useQuery({
    queryKey: reportKeys.myList(),
    queryFn: () => reportService.getMyReports(),
  });
}

export function useReportDetail(reportId: string) {
  return useQuery({
    queryKey: reportKeys.detail(reportId),
    queryFn: () => reportService.getReportById(reportId),
    enabled: !!reportId,
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReportDto) => reportService.createReport(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reportKeys.all });
    },
  });
}
