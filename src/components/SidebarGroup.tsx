import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import type { SidebarItem as ItemType } from "../lib/sidebar.config";
import { SidebarItem } from "./SidebarItem";

export const SidebarGroup = ({ item }: { item: ItemType }) => {
  const location = useLocation();

  // check nếu có child nào đang active
  const isChildActive = item.children?.some((child) =>
    location.pathname.startsWith(child.to || "")
  );

  const [open, setOpen] = useState(isChildActive);

  return (
    <div>
      {/* Parent */}
      <div
        onClick={() => setOpen(!open)}
        className={[
          "px-4 py-3 rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200",
          isChildActive
            ? "bg-blue-50 text-blue-600 font-semibold"
            : "text-gray-700 hover:bg-gray-100",
        ].join(" ")}
      >
        <div className="flex items-center gap-2">
          {item.icon}
          <span className="">{item.label}</span>
        </div>

        {/* Arrow */}
        <ChevronDown
          size={18}
          className={[
            "transition-transform duration-200",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </div>

      {/* Children */}
      <div
        className={[
          "overflow-hidden transition-all duration-300",
          open ? "max-h-96 mt-2" : "max-h-0",
        ].join(" ")}
      >
        <div className="ml-4 flex flex-col gap-1 border-l border-gray-200 pl-3">
          {item.children?.map((child) => (
            <SidebarItem key={child.key} item={child} />
          ))}
        </div>
      </div>
    </div>
  );
};