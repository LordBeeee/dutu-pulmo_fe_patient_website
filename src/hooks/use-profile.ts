import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { locationService } from '@/services/location.service';
import { profileService, type UpdateProfilePayload } from '@/services/profile.service';
import { useAuthStore } from '@/store/auth.store';

export const profileKeys = {
  me: ['profile', 'me'] as const,
  patient: ['profile', 'patient'] as const,
  countries: ['profile', 'countries'] as const,
  ethnicities: ['profile', 'ethnicities'] as const,
  occupations: (keyword?: string) => ['profile', 'occupations', keyword || ''] as const,
  occupationDetail: (code: string) => ['profile', 'occupation', code] as const,
  provinces: ['profile', 'provinces'] as const,
  wards: (provinceCode?: string) => ['profile', 'wards', provinceCode || ''] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.me,
    queryFn: () => profileService.getMe(),
  });
}

export function useMyPatient() {
  return useQuery({
    queryKey: profileKeys.patient,
    queryFn: () => profileService.getMyPatient(),
  });
}

export function useCountries() {
  return useQuery({
    queryKey: profileKeys.countries,
    queryFn: () => profileService.getCountries(),
  });
}

export function useEthnicities() {
  return useQuery({
    queryKey: profileKeys.ethnicities,
    queryFn: () => profileService.getEthnicities(),
  });
}

export function useOccupations(keyword?: string) {
  return useQuery({
    queryKey: profileKeys.occupations(keyword),
    queryFn: () => profileService.searchOccupations(keyword),
  });
}

export function useOccupationDetail(code?: string) {
  return useQuery({
    queryKey: profileKeys.occupationDetail(code || ''),
    queryFn: () => profileService.getOccupationByCode(code || ''),
    enabled: Boolean(code),
  });
}

export function useProvinces() {
  return useQuery({
    queryKey: profileKeys.provinces,
    queryFn: () => locationService.getProvinces(),
  });
}

export function useWards(provinceCode?: string) {
  return useQuery({
    queryKey: profileKeys.wards(provinceCode),
    queryFn: () => locationService.getProvinceWards(provinceCode || ''),
    enabled: Boolean(provinceCode),
  });
}

export function useUpdateMyUser() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: UpdateProfilePayload }) =>
      profileService.updateUser(userId, payload),
    onSuccess: (user) => {
      setUser(user);
      void queryClient.invalidateQueries({ queryKey: profileKeys.me });
      void queryClient.invalidateQueries({ queryKey: profileKeys.patient });
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (file: File) => profileService.uploadAvatar(file),
    onSuccess: (result) => {
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        setUser({ ...currentUser, avatarUrl: result.url });
      }
      void queryClient.invalidateQueries({ queryKey: profileKeys.me });
    },
  });
}

