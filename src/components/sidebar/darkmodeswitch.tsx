import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "@nextui-org/react";

export function DarkModeSwitch() {
  const { theme, setTheme } = useTheme();



  const isLight = theme === 'light';

  return (
    <div>
      <Switch isSelected={isLight} onChange={(checked) => setTheme(checked ? 'light' : 'dark')} />
    </div>
  );
};
