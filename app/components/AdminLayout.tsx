import React from "react";
import { Button } from "~/components/ui/button";
import ThemeToggle from "~/components/utils/ThemeToggle";

interface AdminLayoutProps {
    activeMenu: string;
    onMenuChange: (menu: string) => void;
    children: React.ReactNode;
}

const menus = [
    { key: "chat", label: "聊天" },
    { key: "knowledge", label: "知识库管理" },
];

export default function AdminLayout({ activeMenu, onMenuChange, children }: AdminLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* Header */}
            <header className="bg-card shadow flex items-center justify-between px-8 h-16 transition-colors duration-300">
                <div className="text-xl font-bold text-blue-600 dark:text-blue-300">Karen RAG</div>
                {/* Navigation */}
                <nav className="flex gap-2 items-center">
                    <ThemeToggle />
                    {menus.map((menu) => (
                        <Button
                            key={menu.key}
                            className={`px-3 py-2 rounded transition-colors duration-150 font-medium bg-black dark:bg-gray-300`}
                            onClick={() => onMenuChange(menu.key)}
                        >
                            {menu.label}
                        </Button>
                    ))}
                </nav>
            </header>
            {/* Body */}
            <main className="w-full flex-1 p-8 flex flex-col items-center justify-start">
                {children}
            </main>
            {/* Footer */}
            <footer className="bg-card text-center text-gray-400 py-4 border-t transition-colors duration-300 dark:text-gray-500">© 2025 Karen RAG System</footer>
        </div>
    );
} 