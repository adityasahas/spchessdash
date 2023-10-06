import React from "react";
import { Sidebar } from "./sidebar.styles";
import { Avatar, Tooltip, Button } from "@nextui-org/react";
import { UserDropdown } from "./companies-dropdown";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { AccountsIcon } from "../icons/sidebar/accounts-icon";
import { CustomersIcon } from "../icons/sidebar/customers-icon";
import { ProductsIcon } from "../icons/sidebar/products-icon";
import { ReportsIcon } from "../icons/sidebar/reports-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { useSidebarContext } from "../layout/layout-context";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react"
import { FiMenu, FiX } from 'react-icons/fi';  
import { DarkModeSwitch } from "./darkmodeswitch";
export const SidebarWrapper = () => {
  const router = useRouter();
  const { collapsed, setCollapsed } = useSidebarContext();

  const handleToggle = () => {
    setCollapsed();
  };

  return (
    <aside className="h-screen z-[202] sticky top-0 relative">
      <div className="block md:hidden p-4 z-203">
        <button onClick={handleToggle}>
          {collapsed ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={() => setCollapsed()} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <UserDropdown />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Home"
              icon={<HomeIcon />}
              isActive={router.pathname === "/home"}
              href="/home"
            />
            <SidebarMenu title="Dashboard">
              <SidebarItem
                isActive={router.pathname === "/regs"}
                title="Tournament Registrations"
                icon={<AccountsIcon />}
                href="regs"
              />

              <SidebarItem
                isActive={router.pathname === "/ladder"}
                title="Ladder Rankings (not working)"
                icon={<CustomersIcon />}
                href="ladder"
              />
              <SidebarItem
                isActive={router.pathname === "/games"}
                title="Game Archive (not working)"
                icon={<ProductsIcon />}
                href="games"
              />
              <SidebarItem
                isActive={router.pathname === "/challenges"}
                title="Challenges (not working)"
                icon={<ReportsIcon />}
                href="challenges"
              />
            </SidebarMenu>
            <SidebarMenu title="users">
              <SidebarItem
                isActive={router.pathname === "/users"}
                title="admin management"
                icon={<AccountsIcon />}
                href="users"
              />
            </SidebarMenu>
          </div>
          <div className={Sidebar.Footer()}>
            <Tooltip content={"Settings"} color="primary">
              <div className="max-w-fit">
                <SettingsIcon />
              </div>
            </Tooltip>
            <Button color="danger" onClick={() => signOut()} variant="light">
              Log Out
            </Button>
            <DarkModeSwitch />
          </div>
        </div>
      </div>
    </aside>
  );
};
