import axios from 'axios';

type Province = {
  code: number;
  name: string;
};

type Ward = {
  code: number;
  name: string;
};

type ProvinceDetail = {
  wards?: Ward[];
};

const locationApi = axios.create({
  baseURL: 'https://provinces.open-api.vn/api/v2',
  timeout: 30000,
});

export const locationService = {
  getProvinces: async () => {
    const { data } = await locationApi.get<Province[]>('/');
    return data;
  },
  getProvinceWards: async (provinceCode: string | number) => {
    const { data } = await locationApi.get<ProvinceDetail>(`/p/${provinceCode}`, {
      params: { depth: 2 },
    });
    return data.wards ?? [];
  },
};

export type { Province, Ward };

