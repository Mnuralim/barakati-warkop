"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Menu as MenuIcon,
  ShoppingCart,
  Clock,
  Heart,
  UserCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
} from "lucide-react";

export const UserSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navigation = [
    { name: "Beranda", href: "/beranda", icon: Home },
    { name: "Menu", href: "/menu", icon: MenuIcon },
    { name: "Keranjang", href: "/keranjang", icon: ShoppingCart },
    { name: "Riwayat Pesanan", href: "/riwayat", icon: Clock },
    { name: "Favorit", href: "/favorit", icon: Heart },
    { name: "Profil", href: "/profil", icon: UserCircle },
  ];

  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  return (
    <>
      {/* Navbar - always visible */}
      <div className="sticky top-0 left-0 right-0 z-50 bg-indigo-600 border-b-4 border-black shadow-[0px_8px_0px_0px_rgba(0,0,0,0.8)] p-3 flex justify-between items-center">
        <button
          onClick={toggleSidebar}
          className="bg-yellow-400 text-black p-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
        >
          {isCollapsed ? (
            <ChevronRight size={18} strokeWidth={2.5} />
          ) : (
            <ChevronLeft size={18} strokeWidth={2.5} />
          )}
        </button>

        <div className="flex items-center">
          <Link href="/beranda" className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10 bg-teal-500 rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
              <span className="text-white font-black">WK</span>
            </div>
            <span className="ml-2 font-black text-xl text-white">
              WARUNG KITA
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <button className="relative">
            <div className="relative">
              <ShoppingCart
                size={24}
                strokeWidth={2.5}
                className="text-white hover:text-yellow-400 transition-colors"
              />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-black font-bold">
                2
              </span>
            </div>
          </button>
          <button className="relative">
            <Bell
              size={24}
              strokeWidth={2.5}
              className="text-white hover:text-yellow-400 transition-colors"
            />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-black font-bold">
              3
            </span>
          </button>
        </div>
      </div>

      <div
        className={` ${
          isCollapsed
            ? "w-0 md:w-20 -translate-x-full md:translate-x-0 "
            : "w-72 border-r-4 border-black"
        } bg-white  shadow-[8px_0px_0px_0px_rgba(0,0,0,0.8)] min-h-screen transition-all duration-300 fixed left-0 top-16 z-40`}
      >
        <div
          className={`p-4 flex items-center justify-between border-b-4 border-black ${
            isCollapsed ? "hidden md:flex" : ""
          }`}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-teal-500 rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                <span className="text-white font-black">WK</span>
              </div>
              <span className="ml-2 font-black text-xl text-indigo-600 tracking-tight">
                WARUNG KITA
              </span>
            </div>
          )}
          {isCollapsed && (
            <Link href="/beranda" className="mx-auto">
              <div className="flex-shrink-0 w-10 h-10 bg-teal-500 rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                <span className="text-white font-black">WK</span>
              </div>
            </Link>
          )}
        </div>

        <div
          hidden={isCollapsed}
          className="px-4 py-4 bg-amber-100 mx-4 mt-4 border-2 border-black rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
        >
          <p className="text-xs font-bold text-amber-800">
            Selamat datang kembali
          </p>
          <p className="text-sm text-gray-800 mt-1 font-bold">Pengguna</p>
        </div>

        <nav className={`mt-4 px-3 ${isCollapsed ? "hidden md:block" : ""}`}>
          <ul className="space-y-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 ${
                      isCollapsed ? "justify-center" : "justify-start"
                    } ${
                      isActive
                        ? "bg-indigo-100  text-indigo-700 font-bold border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        : "text-gray-700 hover:bg-gray-100 border-2 border-transparent hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5"
                    } text-sm rounded-md transition-all`}
                  >
                    <Icon
                      className={isActive ? "text-indigo-600" : ""}
                      size={22}
                      strokeWidth={2.5}
                    />
                    {!isCollapsed && (
                      <span className="ml-3 font-medium">{item.name}</span>
                    )}
                    {!isCollapsed && isActive && (
                      <span className="ml-auto w-2 h-6 bg-indigo-600" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          className={`absolute bottom-4 ${
            isCollapsed ? "px-2 w-full hidden md:block" : "px-4 w-full"
          }`}
        >
          <button className="w-full bg-red-100 text-red-700 border-2 border-black p-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all flex items-center justify-center">
            <LogOut size={22} strokeWidth={2.5} />
            {!isCollapsed && <span className="ml-2">Keluar</span>}
          </button>
        </div>
      </div>
    </>
  );
};
