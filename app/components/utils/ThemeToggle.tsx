import React, { useEffect, useState } from "react";
import {Moon, Sun} from "lucide-react"
import {Button} from "~/components/ui/button";

const THEME_KEY = "theme-mode";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // 初始化主题
  useEffect(() => {
    // 确保在客户端获取初始值
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) {
        const isDarkMode = saved === "dark";
        setIsDark(isDarkMode);
        document.documentElement.classList.toggle("dark", isDarkMode);
      } else {
        // 如果没有保存的值，跟随系统偏好
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDark(prefersDark);
        document.documentElement.classList.toggle("dark", prefersDark);
      }
    }
  }, []);

  // 切换主题时，写入 localStorage 并切换 class
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem(THEME_KEY, "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem(THEME_KEY, "light");
      }
    }
  }, [isDark]);

  return (
    <Button
      className={`px-3 py-2 rounded transition-colors duration-150 font-medium bg-black dark:bg-gray-300`}
      onClick={() => setIsDark((v) => !v)}
      title={isDark ? "切换为浅色模式" : "切换为深色模式"}
    >
      {isDark ? <Moon /> : <Sun />}
    </Button>
  );
}