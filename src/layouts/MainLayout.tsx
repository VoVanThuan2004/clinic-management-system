import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { SideBar } from "../components/SideBar";
import { useState } from "react";

export const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Side bar */}
      <aside className="md:block hidden">
        <div className="sticky top-0">
          <SideBar />
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        {/* Header */}
        <Header isOpen={isOpen} setIsOpen={setIsOpen} />

        <main>
          <Outlet />
        </main>
      </div>

      <aside
        className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Sidebar */}
        <div
          className={`absolute top-0 left-0 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SideBar />
        </div>
      </aside>
    </div>
  );
};
