"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Home,
  Settings,
  ShoppingCart,
  BarChart,
  LogOut,
  User,
  NotebookIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/auth";

interface SidebarProps {
  className?: string;
  username?: string;
}

export function Sidebar({ className = "", username }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        window.innerWidth < 1024 &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isMounted]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: <Home className="w-5 h-5" />, href: "/admin" },
    {
      name: "Menu",
      icon: <ShoppingCart className="w-5 h-5" />,
      href: "/admin/menu",
    },
    {
      name: "Pesanan",
      icon: <BarChart className="w-5 h-5" />,
      href: "/admin/order",
    },
    {
      name: "Laporan",
      icon: <NotebookIcon className="w-5 h-5" />,
      href: "/admin/report",
    },
    {
      name: "Pengaturan",
      icon: <Settings className="w-5 h-5" />,
      href: "/admin/settings",
    },
  ];

  if (pathName === "/login") {
    return null;
  }

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-3.5 left-4 p-2 rounded-md bg-indigo-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all z-30 lg:hidden"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-opacity-30 z-20 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        ref={sidebarRef}
        className={`
          fixed left-0 top-0 h-full z-30
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          transition-transform duration-300 ease-in-out
          w-72 bg-white border-r-4 border-black
          shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] lg:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]
          ${className}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b-4 border-black">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-teal-500 rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                <span className="text-white font-black">IN</span>
              </div>
              <h1 className="font-black text-xl text-indigo-600 tracking-tight">
                Pemesanan
              </h1>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-md hover:bg-gray-100 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          <nav className="flex-1 pt-5 pb-4 overflow-y-auto">
            <div className="px-4 mb-6">
              <div className="py-3 px-4 bg-amber-100 border-2 border-black rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-xs font-bold text-amber-800">
                  Selamat datang kembali
                </p>
                <p className="text-sm text-gray-800 mt-1 font-bold">
                  {username || "Admin"}
                </p>
              </div>
            </div>
            <ul className="space-y-2 px-3">
              {menuItems.map((item, index) => {
                const isActive =
                  pathName.split("/").slice(0, 3).join("/") === item.href;
                return (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-3 text-sm rounded-md transition-all border-2 ${
                        isActive
                          ? "bg-indigo-100 text-indigo-700 font-bold border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                          : "text-gray-700 hover:bg-gray-100 border-transparent hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5"
                      }`}
                      onClick={closeSidebarOnMobile}
                    >
                      <span
                        className={`flex-shrink-0 ${
                          isActive ? "text-indigo-600" : ""
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="ml-3 font-medium">{item.name}</span>
                      {isActive && (
                        <span className="ml-auto w-2 h-6 bg-indigo-600" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 mt-auto border-t-4 border-black">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-md bg-teal-500 border-2 border-black flex-shrink-0 flex items-center justify-center text-white font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {username ? (
                  username.charAt(0).toUpperCase()
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <p className="text-sm font-bold text-gray-800 truncate">
                  {username || "User"}
                </p>
              </div>
              <form action={logout}>
                <button
                  className="p-2 cursor-pointer bg-red-100 hover:bg-red-200 rounded-md text-red-700 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                  title="Logout"
                  type="submit"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
