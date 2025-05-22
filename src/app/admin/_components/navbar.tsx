"use client";

import { useState, useEffect, useRef } from "react";
import { User, LogOut, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/auth";

interface NavbarProps {
  className?: string;
  username?: string;
}

export function Navbar({ className = "", username }: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathName = usePathname();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node) &&
        isProfileOpen
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  if (pathName === "/login") {
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b-4 border-black bg-white px-4 md:px-6 ${className}`}
    >
      <div className="flex items-center">
        <h2
          className={`text-base md:text-lg font-black text-gray-800 ${
            isMobile ? "pl-12" : ""
          }`}
        >
          Selamat datang,{" "}
          <span className="text-teal-600 ">{username || "Admin"}</span>
        </h2>
      </div>

      <div className="relative profile-menu" ref={profileMenuRef}>
        <button
          onClick={toggleProfile}
          className="flex items-center gap-2 py-1.5 px-3  border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
          aria-expanded={isProfileOpen}
          aria-haspopup="true"
        >
          <div className="w-8 h-8 rounded-md bg-indigo-500 border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {username ? (
              username.charAt(0).toUpperCase()
            ) : (
              <User className="w-4 h-4" />
            )}
          </div>
          <span className="text-gray-800 hidden sm:block font-bold">
            {username || "User"}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
              isProfileOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] py-1 border-2 border-black z-50">
            <div className="px-4 py-3 border-b-2 border-black">
              <p className="text-sm font-bold text-gray-800 truncate">
                {username || "User"}
              </p>
            </div>
            <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 font-medium">
              <User className="w-4 h-4" />
              <span>Profil</span>
            </button>
            <form action={logout}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-100  font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
