import { useState, useRef, useEffect } from "react";
import { Send, MessageSquare } from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: number;
}

interface ChatPanelProps {
  messages: Message[];
  currentUser: string;
  onSendMessage: (msg: string) => void;
  className?: string;
}

export function ChatPanel({ messages, currentUser, onSendMessage, className = "" }: ChatPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className={`flex flex-col bg-[#1a2744] border-l border-[#334155] ${className}`}>
      <div className="h-12 border-b border-[#334155] flex items-center px-4 shrink-0">
        <div className="flex items-center gap-2 text-sm font-medium text-[#f8fafc]">
          <MessageSquare size={16} className="text-[#3b82f6]" />
          <span>Team Chat</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[#64748b] text-sm text-center space-y-2 opacity-50">
            <MessageSquare size={32} />
            <p>No messages yet.<br />Say hello to your pair!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isSystem = msg.username === "System";
            const isMe = msg.username === currentUser;

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center my-2">
                  <span className="text-[11px] font-medium bg-[#1e293b] text-[#94a3b8] px-2 py-0.5 rounded-full">
                    {msg.message}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] ${isMe ? "ml-auto items-end" : "mr-auto items-start"}`}
              >
                <div className="flex items-baseline gap-2 mb-1 px-1">
                  <span className="text-[11px] font-semibold text-[#94a3b8]">
                    {isMe ? "You" : msg.username}
                  </span>
                  <span className="text-[9px] text-[#64748b]">
                    {format(msg.timestamp, "HH:mm")}
                  </span>
                </div>
                <div
                  className={`px-3 py-2 rounded-xl text-[13px] shadow-sm ${
                    isMe
                      ? "bg-[#3b82f6] text-white rounded-tr-sm"
                      : "bg-[#1e293b] text-[#f8fafc] rounded-tl-sm border border-[#334155]/50"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-3 border-t border-[#334155] bg-[#1a2744] shrink-0">
        <form
          onSubmit={handleSend}
          className="flex items-end gap-2 bg-[#0f172a] border border-[#334155] focus-within:border-[#3b82f6]/50 rounded-lg p-1 transition-all"
        >
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder="Type a message..."
            className="flex-1 max-h-32 min-h-[36px] bg-transparent text-sm resize-none focus:outline-none p-2 text-[#f8fafc] placeholder:text-[#64748b]"
            rows={1}
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="p-2 bg-[#3b82f6]/10 text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white rounded-md disabled:opacity-50 transition-colors shrink-0 mb-0.5 mr-0.5"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
