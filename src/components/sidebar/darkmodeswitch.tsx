import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "@nextui-org/react";

export function DarkModeSwitch() {
  const { theme, setTheme } = useTheme();
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setIsLight(theme === "light");
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = isLight ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <div>
      <Switch isSelected={isLight} onChange={toggleTheme} />
    </div>
  );
}
