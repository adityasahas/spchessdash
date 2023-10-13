import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarItem,
  User
} from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { DarkModeSwitch } from "./darkmodeswitch";
import { useSession, signOut } from "next-auth/react";
interface User {
  email: string;
  image: string;
}


export const UserDropdown = () => {
  const { data: session, status } = useSession();
  const user = session?.user as User;
  const loading = status === "loading";


  if (loading) {
    return null;
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <User
          className="transition-transform"
          name={session?.user?.name}
          description={session?.user?.email}
          avatarProps={{
            src: session?.user?.image || undefined,
            classNames: {
              base: "bg-gradient-to-br from-[#6499E9] to-[#BEFFF7]",
              icon: "text-black/80",
            },
          }}
        />
        {/* <img className="w-10 h-10 rounded-full " src={session?.user?.image || "/default.png" }/> */}
      </DropdownTrigger>
      <DropdownMenu
        aria-label="User menu actions"
        onAction={(actionKey) => console.log({ actionKey })}
      >
        <DropdownItem
          key="profile"
          className="flex flex-col justify-start w-full items-start"
        >
          <p>Signed in as</p>
          <p>{session?.user?.email || "No email available"}</p>
        </DropdownItem>

        <DropdownItem
          key="logout"
          color="danger"
          className="text-danger "
          onClick={() => signOut()}
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
