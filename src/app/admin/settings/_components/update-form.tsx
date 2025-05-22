"use client";
import React, { useState } from "react";
import { useFormState } from "react-dom";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { ErrorMessage } from "../../_components/error-message";
import { updateAdmin } from "@/actions/auth";

interface Props {
  admin: {
    id: string;
    username: string;
  };
}

export const UpdateAdminForm = ({ admin }: Props) => {
  const [state, formAction] = useFormState(updateAdmin, { error: null });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="bg-neutral-50 border-4 border-neutral-700 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 rounded-none">
      <div className="flex items-center mb-6 border-b-4 border-indigo-600 pb-3">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-neutral-800">
          Perbarui Profil Admin
        </h2>
      </div>

      {state.error && <ErrorMessage message={state.error} />}

      <form action={formAction} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="username"
            className="block text-lg font-bold text-neutral-800"
          >
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-neutral-700" strokeWidth={2.5} />
            </div>
            <input
              type="text"
              id="username"
              name="username"
              defaultValue={admin?.username || ""}
              required
              className="pl-10 block w-full border-4 border-neutral-700 p-3 bg-white text-neutral-800 font-bold focus:border-indigo-500 focus:ring-0 transition-colors rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              placeholder="Masukkan username"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-lg font-bold text-neutral-800"
          >
            Password Baru
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-neutral-700" strokeWidth={2.5} />
            </div>
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              name="password"
              className="pl-10 block w-full border-4 border-neutral-700 p-3 bg-white text-neutral-800 font-bold focus:border-indigo-500 focus:ring-0 transition-colors rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
            >
              {isPasswordVisible ? (
                <EyeOff
                  className="h-5 w-5 text-neutral-700"
                  strokeWidth={2.5}
                />
              ) : (
                <Eye className="h-5 w-5 text-neutral-700" strokeWidth={2.5} />
              )}
            </button>
          </div>
          <p className="text-sm font-bold text-neutral-600 mt-1">
            Kosongkan jika tidak ingin mengubah. Password minimal 8 karakter.
          </p>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="bg-indigo-600 text-white border-4 border-neutral-700 px-6 py-3 font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all w-full md:w-auto"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
};
