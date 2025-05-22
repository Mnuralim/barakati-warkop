"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useFormState } from "react-dom";
import { loginAdmin } from "@/actions/auth";
import { LoginButton } from "./login-button";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [state, action] = useFormState(loginAdmin, {
    error: null,
  });

  return (
    <div className="bg-white border-4 border-black  rounded-md overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] ">
      <div className="p-6 border-b-4 border-black ">
        <div className="flex justify-center">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-teal-500 rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
              <span className="text-white font-black">IN</span>
            </div>
            <h1 className="font-black text-xl text-indigo-600 tracking-tight">
              Logo
            </h1>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-black text-gray-800 ">
            Selamat Datang Kembali
          </h2>
          <p className="text-gray-700  mt-2 font-medium">
            Masuk ke akun Anda untuk melanjutkan
          </p>
        </div>

        {state.error && (
          <div className="mb-6 p-4 bg-red-100  text-red-700  text-sm rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            {state.error}
          </div>
        )}

        <form action={action}>
          <div className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                className="w-full px-4 py-3 rounded-md 
                  border-2 border-black 
                  bg-white  text-gray-800
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 
                  shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                  focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                  hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                  transition-all"
                placeholder="username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 rounded-md 
                    border-2 border-black
                    bg-white text-gray-800
                    focus:outline-none focus:ring-2 focus:ring-indigo-500
                    shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                    focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                    hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                    transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 
                    text-gray-600 hover:text-gray-800
                    bg-gray-100 p-1 rounded-md border border-black"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-8">
              <LoginButton />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
