import React, { useRef, useEffect } from 'react';
import { useCockpit } from '../../context/CockpitContext';
import { 
  Search, 
  Bell, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    isAdminMode, 
    openStepUpModal, 
    exitAdminMode,
    alerts,
    searchQuery,
    setSearchQuery,
    isNotificationOpen,
    setIsNotificationOpen
  } = useCockpit();

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="h-16 bg-[#FFFFFF] border-b border-[#EEEEEB] px-8 flex items-center justify-between shrink-0 relative z-20 gap-4">
      {/* Global Expanded Search Bar */}
      <div className="flex items-center flex-1 max-w-4xl">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#85858D]">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses, timetable, tickets, policies... (Cmd+K)"
            className="w-full pl-9 pr-14 py-2 text-xs bg-[#F7F7F4] border border-[#EEEEEB] rounded-xl focus:bg-white focus:outline-hidden focus:border-[#20202B] transition text-[#20202B] placeholder-[#85858D]"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] font-mono font-medium text-[#85858D] bg-white border border-[#EEEEEB] rounded shadow-2xs">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Action Controls & Profile */}
      <div className="flex items-center space-x-3 shrink-0">
        {/* Switch to Admin Mode button */}
        {!isAdminMode && (
          <button
            onClick={openStepUpModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#20202B] bg-[#F7F7F4] hover:bg-[#EEEEEB] border border-[#EEEEEB] transition cursor-pointer"
            title="Authenticate with Admin ID Pass to access Operations"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#20202B]" />
            <span className="hidden sm:inline">Admin Mode</span>
          </button>
        )}

        {isAdminMode && (
          <div className="flex items-center space-x-2">
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#EAF6EE] text-[#1C6E3E] border border-[#268A50]/30">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#1C6E3E]" />
              Admin Active
            </span>
            <button
              onClick={exitAdminMode}
              className="text-xs font-semibold text-[#B71C1C] hover:bg-[#FDE8E8] px-2.5 py-1 rounded-lg transition cursor-pointer"
            >
              Exit
            </button>
          </div>
        )}

        {/* Notifications Icon */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#20202B] hover:bg-[#F7F7F4] border border-[#EEEEEB] transition relative cursor-pointer"
            aria-label="Campus Alerts"
          >
            <Bell className="w-4 h-4" />
            {alerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D7F36A] ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-[#EEEEEB] p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEB]">
                <h4 className="text-xs font-bold text-[#20202B]">
                  Notifications & Bulletins
                </h4>
                <span className="text-xs bg-[#F7F7F4] text-[#20202B] px-2 py-0.5 rounded-full font-mono font-medium">
                  {alerts.length} Active
                </span>
              </div>
              <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                {alerts.map((al) => (
                  <div key={al.id} className="p-3 rounded-xl bg-[#F7F7F4] border border-[#EEEEEB] text-xs">
                    <div className="flex items-center space-x-1.5 text-[#20202B] font-semibold mb-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-[#C27803]" />
                      <span className="truncate">{al.title}</span>
                    </div>
                    <p className="text-xs text-[#5A5A66] leading-snug">{al.message}</p>
                    <div className="mt-2 text-[11px] text-[#85858D] flex justify-between">
                      <span>Reach: {al.reachPercentage}%</span>
                      <span>{new Date(al.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Info */}
        <div className="flex items-center pl-3 border-l border-[#EEEEEB] space-x-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-xl object-cover border border-[#EEEEEB]"
          />
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-[#20202B] leading-tight">
              {currentUser.name}
            </div>
            <div className="text-[11px] text-[#85858D]">
              {currentUser.role === 'student' ? 'MBA Student' : currentUser.role.replace('_', ' ')}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
