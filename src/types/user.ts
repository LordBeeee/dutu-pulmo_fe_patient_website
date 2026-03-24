export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | string;
  avatarUrl: string | null;
  address?: string | null;
  CCCD?: string | null;
  occupation?: string | null;
  nationality?: string | null;
  ethnicity?: string | null;
  provinceCode?: string | null;
  wardCode?: string | null;
}
