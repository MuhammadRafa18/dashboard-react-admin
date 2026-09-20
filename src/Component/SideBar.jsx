import React, { useContext, useState } from "react";
import { AuthContext } from "../Store/AuthContext";
import { Link, useLocation, useNavigate } from "react-router";
import { PagesContext } from "../Store/PagesProvider";
import { LayoutDashboard, Database, Home, HelpCircle, Info, ChevronDown } from "lucide-react";

const MENU_ITEMS = [
  { title: "Dashboard", path: "/", icon: LayoutDashboard },
  {
    title: "Data",
    icon: Database,
    subItems: [
      { title: "Product", path: "/ProdukPage" },
      { title: "Categories", path: "/Categories" },
      { title: "Shipping Zone", path: "/ShippingZone" },
      { title: "Shipping", path: "/Shipping" },
      { title: "Type", path: "/Type" },
      { title: "User", path: "/UserAdmin", role: "super_admin" },
    ],
  },
  {
    title: "Home CMS",
    icon: Home,
    subItems: [
      { title: "Banner", path: "/Banner" },
      { title: "Result Product", path: "/Result" },
    ],
  },
  { title: "About", path: "/About", icon: Info },
  { title: "FAQ", path: "/Faq", icon: HelpCircle },
];

export const SideBar = () => {
  const { User } = useContext(AuthContext);
  const { isSidebarOpen, setIsSidebarOpen } = useContext(PagesContext);
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({}); 
  const location = useLocation();
  const userRole = "super_admin";
  const toggleSubmenu = (title) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };
  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 z-50 w-60 bg-bg-surface border-r border-border-light transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : " -translate-x-full md:translate-x-0"
        }`}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-border-light">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3 shadow-sm">
          <span className="text-white font-bold text-lg">A</span>
        </div>
        <span className="text-xl font-bold text-text-heading tracking-wide">Arliva</span>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)] hide-scrollbar">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isDropdownOpen = openMenus[item.title];

          return (
            <div key={item.title}>
              {item.subItems ? (
                // Menu dengan Dropdown
                <button
                  onClick={() => toggleSubmenu(item.title)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs md:text-sm  font-medium text-text-body hover:bg-gray-50 hover:text-primary transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={20} className="text-text-muted group-hover:text-primary transition-colors" />
                    <span>{item.title}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180 text-primary" : "text-text-muted"}`}
                  />
                </button>
              ) : (
                // Menu Link Biasa
                <Link
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)} // Tutup sidebar di mobile saat diklik
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-colors group ${isActive ? "bg-primary/10 text-primary" : "text-text-body hover:bg-gray-50 hover:text-primary"
                    }`}
                >
                  <Icon size={20} className={isActive ? "text-primary" : "text-text-muted group-hover:text-primary"} />
                  <span>{item.title}</span>
                </Link>
              )}

              {/* Submenu Items */}
              {item.subItems && isDropdownOpen && (
                <div className="ml-9 mt-1 mb-2 space-y-1 border-l-2 border-gray-100 pl-2 animate-in slide-in-from-top-2">
                  {item.subItems
                    .filter((sub) => !sub.role || sub.role === userRole)
                    .map((sub) => (
                      <Link
                        key={sub.title}
                        to={sub.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`block px-3 py-2 rounded-md text-xs md:text-sm transition-colors ${location.pathname === sub.path
                          ? "text-primary font-semibold bg-gray-50"
                          : "text-text-body hover:text-primary hover:bg-gray-50"
                          }`}
                      >
                        {sub.title}
                      </Link>
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
