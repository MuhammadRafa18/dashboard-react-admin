import React, { useContext, useEffect, useRef, useState } from "react";
import { Menu, User as UserIcon, LogOut } from "lucide-react"; 
import profil from "../assets/profil.jpg";
import { AuthContext } from "../Store/AuthContext";
import { PagesContext } from "../Store/PagesProvider";

export const Navbar = () => {
  const { logout, User } = useContext(AuthContext);
    const { isSidebarOpen, setIsSidebarOpen } = useContext(PagesContext);
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Mau log out?")) {
      logout();
    }
  };
  const userName = User?.name || "Admin";
  const userRole = User?.role || "Super Admin";
  const userAvatar = User?.avatar || profil; 

  return (
    <header className="bg-bg-surface border-b border-border-light z-30 sticky top-0">
      <div className="px-4 md:px-8 h-16 flex justify-between md:justify-end items-center">

        {/* Hamburger Icon */}
        <button
          onClick={() => setIsSidebarOpen((!isSidebarOpen))} 
          className="p-2 hover:bg-gray-100 rounded-lg text-text-heading cursor-pointer md:hidden"
        >
          <Menu size={24} />
        </button>

        {/* Profile Section */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="flex items-center space-x-3 p-1.5 rounded-lg hover:bg-gray-50 transition border border-transparent hover:border-gray-200"
          >
            <img src={userAvatar} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-semibold text-text-heading leading-tight">{userName}</span>
              <span className="text-xs text-text-muted">{userRole}</span>
            </div>
          </button>

          {/* Clean Dropdown */}
          {openMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-bg-surface border border-border-light rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] py-2 animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-3 border-b border-border-light md:hidden">
                <p className="text-sm font-semibold text-text-heading">{userName}</p>
                <p className="text-xs text-text-muted">{userRole}</p>
              </div>

              <button className="w-full flex items-center px-4 py-2 text-sm text-text-body hover:bg-gray-50 hover:text-primary transition">
                <UserIcon size={16} className="mr-3" /> Profile Saya
              </button>

              <button
                onClick={handleLogout} // Hubungkan fungsi handleLogout
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition mt-1"
              >
                <LogOut size={16} className="mr-3" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};