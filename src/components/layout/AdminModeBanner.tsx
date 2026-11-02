import React from 'react';
import { useCockpit } from '../../context/CockpitContext';
import { ShieldAlert, Clock, LogOut } from 'lucide-react';

export const AdminModeBanner: React.FC = () => {
  const { isAdminMode, adminSessionSecondsLeft, currentUser, exitAdminMode } = useCockpit();

  if (!isAdminMode) return null;

  const minutes = Math.floor(adminSessionSecondsLeft / 60);
  const seconds = adminSessionSecondsLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const isLowTime = adminSessionSecondsLeft < 300; // under 5 minutes

  return (
    <div className={`w-full px-6 py-2 flex flex-wrap items-center justify-between transition-colors ${
      isLowTime 
        ? 'bg-[#B71C1C] text-white' 
        : 'bg-[#181827] text-white border-b border-[#2C2C42]'
    }`}>
      <div className="flex items-center space-x-3 text-xs font-medium">
        <div className="flex items-center px-2 py-0.5 rounded-md bg-[#2B2B44] text-[#D7F36A] font-semibold text-xs border border-[#3A3A54]">
          <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-[#D7F36A]" />
          Admin Mode Active
        </div>
        <span className="hidden sm:inline text-[#8E8EA0]">|</span>
        <span className="font-semibold text-white">{currentUser.name}</span>
        <span className="text-[#8E8EA0]">({currentUser.roleName})</span>
        <span className="hidden md:inline px-2 py-0.5 rounded bg-[#2B2B44] text-[#C5C5D2] text-[11px] font-mono">
          Scope: {currentUser.adminScope || 'General Operations'}
        </span>
      </div>

      <div className="flex items-center space-x-4 text-xs mt-1 sm:mt-0">
        <div className="flex items-center space-x-1.5 bg-[#2B2B44] px-2.5 py-1 rounded-md border border-[#3A3A54]">
          <Clock className={`w-3.5 h-3.5 ${isLowTime ? 'text-white' : 'text-[#D7F36A]'}`} />
          <span className="text-[#8E8EA0]">Session Timeout:</span>
          <span className="font-mono font-semibold text-white">
            {timeFormatted}
          </span>
        </div>

        <button
          onClick={exitAdminMode}
          className="flex items-center space-x-1 bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer"
          title="Exit Admin Mode"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Admin</span>
        </button>
      </div>
    </div>
  );
};
