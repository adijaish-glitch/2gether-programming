import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Sparkles, Trash2, User, Shield, Crown } from "lucide-react";
import type { Role } from "../../hooks/use-socket";

const AVATAR_COLORS = [
  { id: "blue",   bg: "#1d4ed8", ring: "#3b82f6" },
  { id: "violet", bg: "#7c3aed", ring: "#a855f7" },
  { id: "rose",   bg: "#be123c", ring: "#f43f5e" },
  { id: "amber",  bg: "#b45309", ring: "#f59e0b" },
  { id: "emerald",bg: "#065f46", ring: "#10b981" },
  { id: "cyan",   bg: "#0e7490", ring: "#06b6d4" },
  { id: "pink",   bg: "#9d174d", ring: "#ec4899" },
  { id: "slate",  bg: "#334155", ring: "#64748b" },
];

const ADJECTIVES = ["Clever","Swift","Mighty","Cosmic","Neon","Pixel","Turbo","Crispy","Quantum","Glitch"];
const NOUNS = ["Coder","Hacker","Ninja","Wizard","Dev","Builder","Ranger","Bot","Shark","Fox"];
export function randomName() {
  return `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]}${NOUNS[Math.floor(Math.random() * NOUNS.length)]}`;
}

export function getSavedAvatarColor(): string {
  return localStorage.getItem("2gether-avatar-color") ?? "blue";
}
export function saveAvatarColor(id: string) {
  localStorage.setItem("2gether-avatar-color", id);
}

interface AccountSettingsProps {
  username: string;
  myRole?: Role;
  isHost?: boolean;
  onChangeUsername: (name: string) => void;
}

export function AccountSettings({ username, myRole, isHost = false, onChangeUsername }: AccountSettingsProps) {
  const [open, setOpen] = useState(false);
  const [editName, setEditName] = useState(username);
  const [saved, setSaved] = useState(false);
  const [avatarColorId, setAvatarColorId] = useState(getSavedAvatarColor);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setEditName(username); }, [username]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const avatarColor = AVATAR_COLORS.find(c => c.id === avatarColorId) ?? AVATAR_COLORS[0];
  const initials = username.slice(0, 2).toUpperCase();

  const handleSaveName = () => {
    const trimmed = editName.trim();
    if (!trimmed || trimmed === username || trimmed.length < 2) return;
    onChangeUsername(trimmed);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleColorChange = (id: string) => {
    setAvatarColorId(id);
    saveAvatarColor(id);
  };

  const handleClearData = () => {
    localStorage.removeItem("2gether-username");
    localStorage.removeItem("2gether-avatar-color");
    window.location.href = "/";
  };

  const roleLabel = isHost ? "Host" : myRole === "driver" ? "Driver" : myRole === "navigator" ? "Navigator" : "Observer";
  const roleColor = isHost ? "text-[#f59e0b]" : myRole === "driver" ? "text-[#3b82f6]" : myRole === "navigator" ? "text-[#a855f7]" : "text-[#94a3b8]";

  const showRoleUI = myRole !== undefined;

  return (
    <div ref={panelRef} className="relative z-[60]">
      <button
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-[#1e293b] ${open ? "bg-[#1e293b]" : ""}`}
        title="Account settings"
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-md ring-2 ring-offset-1 ring-offset-[#1a2744] transition-all"
          style={{ backgroundColor: avatarColor.bg, "--tw-ring-color": avatarColor.ring } as React.CSSProperties}
        >
          {initials}
        </div>
        <span className="text-xs font-medium text-[#f8fafc] flex max-w-[80px] truncate">{username}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-72 bg-[#1a2744] border border-[#334155] rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-3 border-b border-[#334155] flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-white shadow-lg ring-2 ring-offset-2 ring-offset-[#1a2744] transition-all"
                  style={{ backgroundColor: avatarColor.bg, outlineColor: avatarColor.ring }}
                >
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#f8fafc] truncate max-w-[140px]">{username}</p>
                  {showRoleUI && (
                    <p className={`text-[11px] font-semibold flex items-center gap-1 ${roleColor}`}>
                      {isHost && <Crown size={10} />}
                      {roleLabel}
                    </p>
                  )}
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-[#94a3b8] hover:text-[#f8fafc] p-1 rounded transition-colors">
                <X size={14} />
              </button>
            </div>

            <div className="p-4 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] flex items-center gap-1.5">
                  <User size={10} /> Display Name
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-1 bg-[#0f172a] border border-[#334155] focus-within:border-[#3b82f6]/60 focus-within:ring-1 focus-within:ring-[#3b82f6]/20 rounded-lg px-3 py-2 transition-all">
                    <input
                      ref={inputRef}
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") handleSaveName(); }}
                      maxLength={24}
                      className="flex-1 bg-transparent text-sm text-[#f8fafc] focus:outline-none font-medium min-w-0"
                      placeholder="Your name..."
                    />
                    <button
                      type="button"
                      onClick={() => setEditName(randomName())}
                      className="text-[#94a3b8] hover:text-[#3b82f6] transition-colors shrink-0"
                      title="Random name"
                    >
                      <Sparkles size={13} />
                    </button>
                  </div>
                  <button
                    onClick={handleSaveName}
                    disabled={!editName.trim() || editName.trim() === username || editName.trim().length < 2}
                    className={`px-3 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      saved
                        ? "bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30"
                        : "bg-[#3b82f6]/10 text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-[#3b82f6]/20 hover:border-[#3b82f6]"
                    }`}
                  >
                    {saved ? <Check size={14} /> : "Save"}
                  </button>
                </div>
                {saved && (
                  <p className="text-[11px] text-[#10b981] flex items-center gap-1">
                    <Check size={10} /> Username updated
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
                  Avatar Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {AVATAR_COLORS.map(color => (
                    <button
                      key={color.id}
                      onClick={() => handleColorChange(color.id)}
                      className={`w-7 h-7 rounded-full transition-all hover:scale-110 active:scale-95 ${
                        avatarColorId === color.id ? "ring-2 ring-white ring-offset-2 ring-offset-[#1a2744] scale-110" : ""
                      }`}
                      style={{ backgroundColor: color.bg }}
                      title={color.id}
                    />
                  ))}
                </div>
              </div>

              {showRoleUI && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] flex items-center gap-1.5">
                    <Shield size={10} /> Session Role
                  </label>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold ${
                    isHost ? "bg-[#f59e0b]/10 border-[#f59e0b]/20 text-[#f59e0b]"
                           : myRole === "driver" ? "bg-[#3b82f6]/10 border-[#3b82f6]/20 text-[#3b82f6]"
                           : myRole === "navigator" ? "bg-[#a855f7]/10 border-[#a855f7]/20 text-[#a855f7]"
                           : "bg-[#1e293b]/50 border-[#334155] text-[#94a3b8]"
                  }`}>
                    {isHost && <Crown size={12} />}
                    <span>{roleLabel}</span>
                    <span className="ml-auto text-[10px] opacity-60 font-normal">
                      {isHost ? "You created this room"
                      : myRole === "driver" ? "You have edit access"
                      : myRole === "navigator" ? "Read-only mode"
                      : "No role assigned"}
                    </span>
                  </div>
                </div>
              )}

              <div className="border-t border-[#334155] pt-4 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">Account</p>
                <button
                  onClick={handleClearData}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-[#ef4444]/80 hover:text-[#ef4444] hover:bg-[#ef4444]/10 border border-transparent hover:border-[#ef4444]/20 transition-colors"
                >
                  <Trash2 size={13} />
                  Clear saved data &amp; sign out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
