import React from "react";
import { toast } from "sonner";
import {
  useAddFavorite,
  useRemoveFavorite,
  useCheckFavoriteDoctor,
  useCheckFavoriteHospital,
} from "@/hooks/use-favorites";

interface FavoriteButtonProps {
  doctorId?: string;
  hospitalId?: string;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  doctorId,
  hospitalId,
  className = "",
}) => {
  const { data: favorite, isLoading } = doctorId
    ? useCheckFavoriteDoctor(doctorId)
    : useCheckFavoriteHospital(hospitalId!);

  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const isFavorite = !!favorite;

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    try {
      if (isFavorite) {
        await removeFavorite.mutateAsync(favorite.id);
        toast.success("Đã xóa khỏi danh sách yêu thích");
      } else {
        await addFavorite.mutateAsync({ doctorId, hospitalId });
        toast.success("Đã thêm vào danh sách yêu thích");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error && (error as any).response?.data?.message
          ? typeof (error as any).response.data.message === "string"
            ? (error as any).response.data.message
            : (error as any).response.data.message.message
          : error instanceof Error
            ? error.message
            : "Thao tác thất bại";
      console.error(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={addFavorite.isPending || removeFavorite.isPending}
      className={`p-2 rounded-full transition-all flex items-center justify-center ${
        isFavorite
          ? "bg-red-50 text-red-500 hover:bg-red-100"
          : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-500"
      } ${className}`}
      title={isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
    >
      <span
        className="material-symbols-outlined text-[20px]"
        style={{
          fontVariationSettings: `'FILL' ${isFavorite ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
        }}
      >
        favorite
      </span>
    </button>
  );
};

export default FavoriteButton;
