import React, { useState } from "react";
import AdminLayout from "./components/AdminLayout";
import ChatPanel from "./components/ChatPanel";
import KnowledgePanel from "./components/KnowledgePanel";

export default function Home() {
  const [activeMenu, setActiveMenu] = useState("chat");

  return (
    <AdminLayout activeMenu={activeMenu} onMenuChange={setActiveMenu}>
      {activeMenu === "chat" && <ChatPanel />}
      {activeMenu === "knowledge" && <KnowledgePanel />}
    </AdminLayout>
  );
}
