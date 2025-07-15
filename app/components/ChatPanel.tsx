import React, { useRef, useState, useEffect } from "react";
import { Button } from "~/components/ui/button";

interface Message {
  role: "user" | "system";
  content: string;
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 初始化加载历史消息
  useEffect(() => {
    hisMsg().then(() => console.log("历史消息加载完成"));
  }, []);

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 获取历史消息
  const hisMsg = async () => {
    try {
      const resp = await fetch("http://localhost:5000/get_history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: "0d00" })
      });
      const data = await resp.json();
      if (!data || !data.data) {
        setMessages(() => []);
        return;
      }
      const hisList: Array<any> = data.data;
      hisList.reverse().forEach((item) => {
        displayMsg(item);
      });
    } catch (e) {
      setMessages((msgs) => [
        ...msgs,
        { role: "system", content: "网络异常，请稍后重试。" }
      ]);
    }
  }

  // 消息展示
  const displayMsg = (item: any) => {
    const msg: string = item.message
        let lines = msg.split("\$");
        if (lines.length > 1) {
          lines.forEach(line => {
            if (!line.trim()) return;
            setMessages((msgs) => [
              ...msgs,
              {role: item.role, content: line}
            ]);
          })
        } else {
          setMessages((msgs) => [
            ...msgs,
            {role: item.role, content: msg}
          ]);
        }
  }

  // 发送消息
  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const resp = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: input })
      });
      const data = await resp.json();
      const sysMsg: Message = {
        role: "system",
        content: data?.data || "系统无响应"
      };
      setMessages((msgs) => [...msgs, sysMsg]);
    } catch (e) {
      console.log("发送消息失败:", e);
      setMessages((msgs) => [
        ...msgs,
        { role: "system", content: "网络异常，请稍后重试。" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 回车发送
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="w-full max-w-7xl flex flex-col h-[75vh] bg-card rounded-lg shadow p-4 border border-border">
      {/* 消息区 */}
      <div className="flex-1 overflow-y-auto pr-2 mb-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20 select-none">开始你的对话吧~</div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex mb-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[80%] text-left whitespace-pre-line break-words shadow-sm transition-colors
                ${msg.role === "user"
                  ? "bg-blue-500 text-white dark:bg-blue-400 dark:text-gray-900"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"}
              `}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* 输入区 */}
      <div className="flex gap-2 items-center border-t pt-3">
        <input
          className="flex-1 px-4 py-2 rounded border bg-background text-foreground outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          type="text"
          placeholder="请输入你的问题..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          maxLength={200}
        />
        <Button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="h-10 px-6 font-semibold"
        >
          {loading ? "发送中..." : "发送"}
        </Button>
      </div>
    </div>
  );
} 