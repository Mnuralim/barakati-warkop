import React from "react";
import { useFormStatus } from "react-dom";

interface Props {
  modalMode: "add" | "edit";
}

export const SubmitButton = ({ modalMode }: Props) => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="sm:flex-1 py-3 px-4 bg-indigo-600 text-white border-4 border-neutral-700 font-bold shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all disabled:opacity-50"
      disabled={pending}
    >
      {pending
        ? modalMode === "edit"
          ? "Menyimpan..."
          : "Menambahkan..."
        : modalMode === "edit"
        ? "Simpan Perubahan"
        : "Tambah Menu"}
    </button>
  );
};
