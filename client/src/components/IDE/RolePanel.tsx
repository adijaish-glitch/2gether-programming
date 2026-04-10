import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pen, Eye, X, ChevronDown, Crown, Users2 } from "lucide-react";
import type { Role } from "../../hooks/use-socket";

interface RolePanelProps {
  isHost: boolean;
  users: string[];
  roles: Record<string, Role>;
  currentUser: string;
  onAssignRole: (username: string, role: Role) => void;
}

const ROLE_STYLES = {
  driver: {
    label: "Driver",
    color: "text-[#3b82f6]",
    bg: "bg-[#3b82f6]/10",
    border: "border-[#3b82f6]/40",
    Icon: Pen,
  },
  navigator: {
    label: "Navigator",
    color: "text-[#a855f7]",
    bg: "bg-[#a855f7]/10",
    border: "border-[#a855f7]/40",
    Icon: Eye,
  },
} as const;

export function RoleBadge({ role }: { role: Role }) {
  if (!role) return null;
  const { label, color, bg, border, Icon } = ROLE_STYLES[role];
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${bg} ${color} ${border} uppercase tracking-wide`}>
      <Icon size={10} />
      {label}
    </span>
  );
}

export function RolePanel({ isHost, users, roles, currentUser, onAssignRole }: RolePanelProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const myRole = roles[currentUser] ?? null;

  if (!isHost && !myRole) return null;

  return (
    <div ref={ref} className="relative z-50">
      <button
        onClick={() => isHost && setOpen((v) => !v)}
        className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
          isHost
            ? "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30 hover:bg-[#f59e0b]/20 cursor-pointer"
            : "bg-[#1e293b]/50 text-[#94a3b8] border-[#334155]/50 cursor-default"
        }`}
        title={isHost ? "Assign driver/navigator roles" : undefined}
      >
        {isHost ? (
          <>
            <Crown size={13} />
            <span className="hidden sm:inline">Roles</span>
            <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
          </>
        ) : (
          <RoleBadge role={myRole} />
        )}
      </button>

      <AnimatePresence>
        {open && isHost && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 bg-[#1a2744] border border-[#334155] rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-[#334155] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown size={14} className="text-[#f59e0b]" />
                <span className="text-sm font-bold text-[#f8fafc]">Assign Roles</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-[#94a3b8] hover:text-[#f8fafc] transition-colors">
                <X size={14} />
              </button>
            </div>

            <div className="p-3 space-y-1.5 max-h-[300px] overflow-y-auto">
              {users.length === 0 && (
                <div className="text-center py-6 text-[#64748b] text-sm flex flex-col items-center gap-2">
                  <Users2 size={28} className="opacity-40" />
                  <span>Waiting for others to join...</span>
                </div>
              )}
              {users.map((uname) => {
                const role = roles[uname] ?? null;
                const isMe = uname === currentUser;
                return (
                  <div
                    key={uname}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#0f172a]/50 border border-[#334155]/40"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {uname[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-[#f8fafc] truncate">
                          {uname}{isMe && <span className="ml-1 text-[10px] text-[#94a3b8]">(you)</span>}
                        </div>
                        {role && (
                          <div className="mt-0.5 flex">
                            <RoleBadge role={role} />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onAssignRole(uname, role === "driver" ? null : "driver")}
                        title="Assign as Driver (types code)"
                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-all border ${
                          role === "driver"
                            ? "bg-[#3b82f6] text-white border-[#3b82f6]"
                            : "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/30 hover:bg-[#3b82f6]/25"
                        }`}
                      >
                        <Pen size={11} /> Driver
                      </button>
                      <button
                        onClick={() => onAssignRole(uname, role === "navigator" ? null : "navigator")}
                        title="Assign as Navigator (reviews code)"
                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-all border ${
                          role === "navigator"
                            ? "bg-[#a855f7] text-white border-[#a855f7]"
                            : "bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30 hover:bg-[#a855f7]/25"
                        }`}
                      >
                        <Eye size={11} /> Nav
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-4 py-3 border-t border-[#334155] bg-[#0f172a]/30">
              <p className="text-[11px] text-[#64748b] leading-relaxed">
                <strong className="text-[#3b82f6]">Driver</strong> controls the keyboard.{" "}
                <strong className="text-[#a855f7]">Navigator</strong> reviews and guides (read-only). Click a role button again to remove it.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
