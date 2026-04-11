import { NavLink } from "react-router-dom";
import type { SidebarItem as ItemType } from "../lib/sidebar.config";

export const SidebarItem = ({ item }: { item: ItemType }) => {
  return (
    <NavLink
      to={item.to!}
      className={({ isActive }) =>
        [
          "px-4 py-4 rounded-xl flex items-center gap-2 transition",
          isActive
            ? "bg-blue-600 text-white"
            : "text-gray-600 hover:bg-blue-600 hover:text-white",
        ].join(" ")
      }
    >
      {item.icon}
      <span className="">{item.label}</span>
    </NavLink>
  );
};