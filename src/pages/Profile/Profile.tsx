import { useEffect, useMemo, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

import { useLogout } from '@/hooks/use-auth';
import {
  useCountries,
  useEthnicities,
  useProfile,
  useProvinces,
  useUpdateMyUser,
  useUploadAvatar,
  useWards,
} from '@/hooks/use-profile';
import { profileService } from '@/services/profile.service';
import { useAuthStore } from '@/store/auth.store';

type Option = {
  value: string;
  label: string;
};

type FormData = {
  fullName: string;
  gender: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  occupation: string;
  CCCD: string;
  nationality: string;
  ethnicity: string;
  province: string;
  ward: string;
  address: string;
};

const EMPTY_FORM: FormData = {
  fullName: '',
  gender: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  occupation: '',
  CCCD: '',
  nationality: '',
  ethnicity: '',
  province: '',
  ward: '',
  address: '',
};

function Profile() {
  const navigate = useNavigate();
  const logout = useLogout();
  const user = useAuthStore((state) => state.user);

  const profileQuery = useProfile();
  const countriesQuery = useCountries();
  const ethnicitiesQuery = useEthnicities();
  const provincesQuery = useProvinces();
  const updateUserMutation = useUpdateMyUser();
  const uploadAvatarMutation = useUploadAvatar();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [occupationOption, setOccupationOption] = useState<Option | null>(null);
  const [avatarUrl, setAvatarUrl] = useState('');

  const wardsQuery = useWards(formData.province || undefined);

  useEffect(() => {
    if (!profileQuery.data) return;

    const me = profileQuery.data;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData({
      fullName: me.fullName ?? '',
      gender: me.gender ?? '',
      email: me.email ?? '',
      phone: me.phone ?? '',
      dateOfBirth: me.dateOfBirth ?? '',
      occupation: me.occupation ?? '',
      CCCD: me.CCCD ?? '',
      nationality: me.nationality ?? '',
      ethnicity: me.ethnicity ?? '',
      province: me.provinceCode ?? '',
      ward: me.wardCode ?? '',
      address: me.address ?? '',
    });


    setAvatarUrl(me.avatarUrl ?? '');
  }, [profileQuery.data]);

  useEffect(() => {
    const occupationCode = formData.occupation;
    if (!occupationCode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOccupationOption(null);
      return;
    }

    void profileService
      .getOccupationByCode(occupationCode)
      .then((occupation) => {
        setOccupationOption({
          value: occupation.code,
          label: occupation.name,
        });
      })
      .catch(() => {
        setOccupationOption({
          value: occupationCode,
          label: `Mã nghề: ${occupationCode}`,
        });
      });
  }, [formData.occupation]);

  const countries = countriesQuery.data ?? [];
  const ethnicities = ethnicitiesQuery.data ?? [];
  const provinces = provincesQuery.data ?? [];
  const wards = wardsQuery.data ?? [];

  const loading = updateUserMutation.isPending;

  const loadOccupations = async (inputValue: string) => {
    const keyword = inputValue.trim();
    const items = await profileService.searchOccupations(keyword || undefined);

    return items.map((item) => ({
      value: item.code,
      label: item.name,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === 'province') {
      setFormData((prev) => ({
        ...prev,
        province: value,
        ward: '',
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadAvatar = async (file: File) => {
    try {
      const previewUrl = URL.createObjectURL(file);
      setAvatarUrl(previewUrl);

      const result = await uploadAvatarMutation.mutateAsync(file);
      setAvatarUrl(result.url);
      toast.success('Upload avatar thành công');
    } catch (error) {
      const errorMessage =
        error instanceof Error && (error as any).response?.data?.message
          ? typeof (error as any).response.data.message === 'string'
            ? (error as any).response.data.message
            : (error as any).response.data.message.message
          : error instanceof Error
            ? error.message
            : 'Upload avatar thất bại';
      console.error(errorMessage);
      toast.error(errorMessage);
    }
  };

  const payload = useMemo(
    () => ({
      fullName: formData.fullName,
      phone: formData.phone,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth || null,
      CCCD: formData.CCCD || null,
      nationality: formData.nationality || null,
      ethnicity: formData.ethnicity || null,
      occupation: formData.occupation || null,
      provinceCode: formData.province || null,
      wardCode: formData.ward || null,
      address: formData.address || null,
    }),
    [formData],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = user?.id || profileQuery.data?.id;

    if (!userId) {
      toast.error('Không tìm thấy user id');
      return;
    }

    try {
      await updateUserMutation.mutateAsync({ userId, payload });
      toast.success('Cập nhật thông tin thành công');
    } catch (error) {
      const errorMessage =
        error instanceof Error && (error as any).response?.data?.message
          ? typeof (error as any).response.data.message === 'string'
            ? (error as any).response.data.message
            : (error as any).response.data.message.message
          : error instanceof Error
            ? error.message
            : 'Cập nhật thất bại';
      console.error(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (profileQuery.isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border transition-colors">Đang tải hồ sơ...</div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-72 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors text-center">
            <div className="flex flex-col items-center">
              <label className="relative inline-block cursor-pointer">
                <img src={avatarUrl || 'https://via.placeholder.com/150'} alt="Avatar" className="w-20 h-20 rounded-full object-cover border" />
                <span className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-xs">edit</span>
                </span>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    await handleUploadAvatar(file);
                  }}
                />
              </label>
            </div>
          </div>

          <nav className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-2 transition-colors">
            <ul className="space-y-1">
              <li>
                <Link
                  to="/my-reviews"
                  className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium"
                >
                  <span className="material-symbols-outlined text-[20px]">rate_review</span>
                  <span className="text-sm">Đánh giá của tôi</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/favorites"
                  className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium"
                >
                  <span className="material-symbols-outlined text-[20px]">favorite</span>
                  <span className="text-sm">Danh sách yêu thích</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/reports"
                  className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium"
                >
                  <span className="material-symbols-outlined text-[20px]">flag</span>
                  <span className="text-sm">Báo cáo của tôi</span>
                </Link>
              </li>
              <li className="pt-4 border-t mt-4 border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors font-medium"
                >
                  <span className="material-icons-outlined text-[20px]">logout</span>
                  <span className="text-sm">Đăng xuất</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <div className="flex-1 space-y-6">
          <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-1">Thông tin cá nhân</h2>
              <p className="text-slate-500 text-sm">Quản lý thông tin hồ sơ của bạn để bảo mật tài khoản</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Họ và tên</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border rounded-xl outline-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Giới tính</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border rounded-xl outline-none">
                    <option value="">-- Chọn giới tính --</option>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Ngày sinh</label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-xl" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Email</label>
                  <input type="email" value={formData.email} readOnly className="w-full px-4 py-2.5 border rounded-xl" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Số điện thoại</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-xl" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Nghề nghiệp</label>
                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    loadOptions={loadOccupations}
                    value={occupationOption}
                    placeholder="Chọn nghề nghiệp..."
                    isClearable
                    onChange={(option) => {
                      setOccupationOption(option as Option | null);
                      setFormData((prev) => ({
                        ...prev,
                        occupation: option ? String((option as Option).value) : '',
                      }));
                    }}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold">CCCD / CMND</label>
                  <input type="text" name="CCCD" value={formData.CCCD} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-xl" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Quốc tịch</label>
                  <select name="nationality" value={formData.nationality} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-xl bg-slate-50">
                    <option value="">-- Chọn quốc gia --</option>
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Dân tộc</label>
                  <select name="ethnicity" value={formData.ethnicity} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-xl bg-slate-50">
                    <option value="">-- Chọn dân tộc --</option>
                    {ethnicities.map((e) => (
                      <option key={e.code} value={e.code}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Tỉnh / Thành phố</label>
                  <select name="province" value={formData.province} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-xl bg-slate-50">
                    <option value="">-- Chọn tỉnh / thành --</option>
                    {provinces.map((p) => (
                      <option key={p.code} value={p.code}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Phường / Xã</label>
                  <select name="ward" value={formData.ward} onChange={handleChange} disabled={wards.length === 0} className="w-full px-4 py-2.5 border rounded-xl bg-slate-50 disabled:bg-slate-100">
                    <option value="">-- Chọn phường / xã --</option>
                    {wards.map((w) => (
                      <option key={w.code} value={w.code}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Đường</label>
                <textarea rows={3} className="w-full px-4 py-2.5 border rounded-xl shadow-none" name="address" value={formData.address} onChange={handleChange}></textarea>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button type="submit" disabled={loading} className="px-8 py-2 bg-primary text-white rounded-xl">
                  {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm shadow-lg transition-colors">
            <h3 className="text-lg font-bold mb-2">Xác nhận đăng xuất</h3>
            <p className="text-slate-500 text-sm mb-6">Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?</p>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="px-4 py-2 rounded-xl border">
                Hủy
              </button>

              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                  navigate('/login');
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-xl"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Profile;
