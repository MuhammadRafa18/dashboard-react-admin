import { Navbar } from "../Component/Navbar";
import { Footers } from "../Component/Footers";
import { SideBar } from "../Component/SideBar";
import { Outlet } from "react-router";
import { useContext, useState } from "react";
import { PagesContext } from "../Store/PagesProvider";
import { UseAction } from "../hooks/UseAction";

export const Layouts = () => {
  const { isSidebarOpen, setIsSidebarOpen, showConfirmModal,
    selectedItem, setSelectedItem, toggleConfig, setToggleConfig, setShowConfirmModal } = useContext(PagesContext);
  const { HandleToggle } = UseAction();

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      {/* Sidebar untuk Desktop & Mobile */}
      <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Responsive Padding: p-4 di mobile, p-8 di desktop */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto hide-scrollbar">
          <Outlet />
        </main>

      </div>

      {/* Overlay untuk Mobile ketika sidebar terbuka */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {/* Pop up toggle */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6">

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v4m0 4h.01M10.29 3.86l-7.82 14A2 2 0 004.2 21h15.6a2 2 0 001.73-3.14l-7.82-14a2 2 0 00-3.42 0z"
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Nonaktifkan Produk?
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Apakah kamu yakin ingin menonaktifkan produk ini?
                </p>


              </div>
            </div>

            <div className="flex justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:cursor-pointer"
              >
                No
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!toggleConfig) return;
                  HandleToggle(
                    toggleConfig.endpoint,
                    toggleConfig.id,
                    toggleConfig.isActive,
                    toggleConfig.refetch
                  );
                  setShowConfirmModal(false);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 hover:cursor-pointer"
              >
                Yes, Nonaktifkan
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
