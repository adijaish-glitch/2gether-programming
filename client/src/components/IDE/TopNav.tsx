import { Link } from "wouter";
import { Users, Copy, Check, LogOut, Code2, Wifi, WifiOff } from "lucide-react";
import { useState } from "react";
import { RolePanel, RoleBadge } from "./RolePanel";
import { AccountSettings } from "./AccountSettings";
import type { Role } from "../../hooks/use-socket";

interface TopNavProps {
  roomId: string;
  usersOnline: number;
  isConnected: boolean;
  isHost: boolean;
  users: string[];
  roles: Record<string, Role>;
  currentUser: string;
  myRole: Role;
  onAssignRole: (username: string, role: Role) => void;
  onChangeUsername: (name: string) => void;
}

export function TopNav({
  roomId,
  usersOnline,
  isConnected,
  isHost,
  users,
  roles,
  currentUser,
  myRole,
  onAssignRole,
  onChangeUsername,
}: TopNavProps) {
  const [copied, setCopied] = useState(false);

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-12 border-b border-[#334155] bg-[#1a2744] flex items-center justify-between px-4 shrink-0 select-none">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-md bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6]">
            <Code2 size={18} />
          </div>
          <span className="font-semibold text-sm text-[#f8fafc] hidden sm:block">2gether Programming</span>
        </Link>
        <div className="w-px h-5 bg-[#334155] mx-2 hidden sm:block" />
        <div className="flex items-center gap-2 bg-[#0f172a]/50 px-2.5 py-1 rounded border border-[#334155]/50">
          <span className="text-xs font-mono text-[#94a3b8] uppercase tracking-wider">ROOM</span>
          <span className="text-xs font-mono text-[#f8fafc] font-medium">{roomId}</span>
          <button onClick={copyRoomId} className="ml-2 text-[#94a3b8] hover:text-[#f8fafc] transition-colors">
            {copied ? <Check size={14} className="text-[#10b981]" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Role assignment UI */}
        <RolePanel
          isHost={isHost}
          users={users}
          roles={roles}
          currentUser={currentUser}
          onAssignRole={onAssignRole}
        />

        <div className="flex items-center gap-2 text-xs font-medium text-[#94a3b8]">
          {isConnected
            ? <Wifi size={14} className="text-[#10b981]" />
            : <WifiOff size={14} className="text-[#ef4444]" />}
          <span className={isConnected ? "text-[#10b981]" : "text-[#ef4444]"}>
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium bg-[#1e293b]/50 px-2.5 py-1 rounded-full border border-[#334155]/50">
          <Users size={14} className={usersOnline > 1 ? "text-[#3b82f6]" : "text-[#94a3b8]"} />
          <span className="text-[#f8fafc]">{usersOnline} <span className="text-[#94a3b8] hidden sm:inline">online</span></span>
        </div>
        <AccountSettings
          username={currentUser}
          myRole={myRole}
          isHost={isHost}
          onChangeUsername={onChangeUsername}
        />
      </div>
    </div>
  );
}
