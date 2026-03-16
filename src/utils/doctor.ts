export const formatDate = (date?: string) => {
  if (!date) return "Chưa cập nhật";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("vi-VN");
};

export const formatCurrency = (value?: string) => {
  const num = Number(value || 0);
  if (!num) return "Liên hệ";
  return `${num.toLocaleString("vi-VN")}đ`;
};

export const getGenderLabel = (gender?: string) => {
  if (gender === "MALE") return "Nam";
  if (gender === "FEMALE") return "Nữ";
  return "Chưa cập nhật";
};