import { api } from "@/services/api";
import type { UserProfile } from "@/types/user";
import { cleanParams } from "@/utils/query";

type ListResponse<T> = {
  items: T[];
};

export type EnumItem = {
  code: string;
  name: string;
};

export type UpdateProfilePayload = {
  fullName?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string | null;
  CCCD?: string | null;
  nationality?: string | null;
  ethnicity?: string | null;
  occupation?: string | null;
  provinceCode?: string | null;
  wardCode?: string | null;
  address?: string | null;
};

export type MyPatientProfile = {
  id: string;
  profileCode?: string;
  user?: UserProfile | null;
};

export const profileService = {
  getMe: async () => {
    const { data } = await api.get<UserProfile>("/users/me");
    return data;
  },

  getMyPatient: async () => {
    const { data } = await api.get<MyPatientProfile>("/patients/me");
    return data;
  },

  updateUser: async (userId: string, payload: UpdateProfilePayload) => {
    const { data } = await api.patch<UserProfile>(`/users/${userId}`, payload);
    return data;
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post<{ upload: { url: string } }>(
      "/users/me/avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return data;
  },

  getCountries: async () => {
    const { data } = await api.get<ListResponse<EnumItem>>("/enums/countries", {
      params: { page: 1, limit: 300 },
    });
    return data.items;
  },

  getEthnicities: async () => {
    const { data } = await api.get<ListResponse<EnumItem>>(
      "/enums/ethnicities",
      {
        params: { page: 1, limit: 300 },
      },
    );
    return data.items;
  },

  searchOccupations: async (search?: string) => {
    const { data } = await api.get<ListResponse<EnumItem>>(
      "/enums/occupations",
      {
        params: cleanParams({ limit: 20, search }),
      },
    );
    return data.items;
  },

  getOccupationByCode: async (code: string) => {
    const { data } = await api.get<EnumItem>(`/enums/occupations/${code}`);
    return data;
  },
};
