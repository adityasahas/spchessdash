import React from "react";
import { useSidebarContext } from "../layout/layout-context";
import clsx from "clsx";

interface Props {
  title: string;
  icon: React.ReactNode;
  isActive?: boolean;
  href?: string;
}

export const SidebarItem: React.FC<Props> = ({
  icon,
  title,
  isActive,
  href = "",
}) => {
  const { collapsed, setCollapsed } = useSidebarContext();

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (window.innerWidth < 768) {
      setCollapsed();
    }
    if (href) {
      window.location.href = href;
    }
  };

  return (
    <a
      href={href}
      className="text-default-900 active:bg-none max-w-full"
      onClick={handleClick}
    >
      <div
        className={clsx(
          isActive
            ? "bg-primary-100 [&_svg_path]:fill-primary-500"
            : "hover:bg-default-100",
          "flex gap-2 w-full min-h-[44px] h-full items-center px-3.5 rounded-xl cursor-pointer transition-all duration-150 active:scale-[0.98]"
        )}
      >
        {icon}
        <span className="text-default-900">{title}</span>
      </div>
    </a>
  );
};
