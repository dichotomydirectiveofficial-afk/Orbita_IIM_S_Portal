import React, { useState } from 'react';
import { useCockpit } from '../../context/CockpitContext';
import { USERS } from '../../data/mockData';
import { 
  QrCode, 
  Check, 
  Copy
} from 'lucide-react';

interface StudentIdBadgeCardProps {
  onOpenReportTicket?: (room?: string) => void;
}

export const StudentIdBadgeCard: React.FC<StudentIdBadgeCardProps> = () => {
  const { currentUser } = useCockpit();
  const [copiedId, setCopiedId] = useState(false);

  // Guarantee the ID card on the LMS workspace represents the authentic student persona
  const studentUser = currentUser.role === 'student' 
    ? currentUser 
    : (USERS.find(u => u.role === 'student') || USERS[0]);

  const studentRefId = studentUser.studentId || 'STD-2035-042';

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(studentRefId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="relative flex flex-col items-center select-none pt-2 pb-2">
      {/* Top Lanyard Anchor & Rivet (Fixed at top) */}
      <div className="flex flex-col items-center z-30 pointer-events-none">
        {/* Lanyard mount tab */}
        <div className="w-12 h-5 bg-gradient-to-b from-[#2a2a3e] to-[#1c1c2a] border-t border-x border-white/20 rounded-t-md shadow-xs" />
        
        {/* Clear nylon strap loop */}
        <div className="w-9 h-10 border-x-2 border-white/40 bg-white/15 backdrop-blur-xs flex items-center justify-center relative">
          <div className="w-1.5 h-full bg-white/10" />
        </div>
        
        {/* Silver metallic rivet & clip connector */}
        <div className="w-7 h-7 -mt-3.5 rounded-full bg-gradient-to-b from-slate-200 via-slate-400 to-slate-600 border border-white/90 shadow-md flex items-center justify-center relative z-40">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-300 shadow-inner" />
        </div>

        {/* Plastic clip hinge entering slot */}
        <div className="w-4 h-3.5 -mt-1 bg-white/25 border border-white/40 rounded-xs" />
      </div>

      {/* Hanging & Swinging Physical ID Badge */}
      <div className="w-full max-w-[430px] -mt-2 animate-id-swing">
        <div className="relative w-full bg-[#141420] text-white rounded-2xl p-6 border border-white/20 shadow-2xl overflow-hidden transition-all duration-300 hover:border-[#D7F36A]/40 group">
          
          {/* Subtle physical card texture / radial gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1c1c2e] via-[#141420] to-[#0c0c14] pointer-events-none" />
          
          {/* Beveled edge highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

          {/* Top Lanyard Slot Cutout */}
          <div className="relative z-10 w-20 h-3.5 mx-auto bg-[#0a0a10] border border-white/25 rounded-full mb-5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-center">
            <div className="w-10 h-1 bg-white/10 rounded-full" />
          </div>

          <div className="relative z-10 space-y-4">
            {/* Top Identity Block: Photo + Name + Program */}
            <div className="flex items-center space-x-4">
              <div className="relative shrink-0">
                <img 
                  src={studentUser.avatar} 
                  alt={studentUser.name} 
                  className="w-14 h-14 rounded-xl object-cover border border-white/25 shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#D7F36A] border-2 border-[#141420]" />
              </div>

              <div className="min-w-0 flex-1">
                <span className="text-xs font-mono text-[#D7F36A] font-semibold block truncate">
                  @{studentUser.name.toLowerCase().replace(/\s+/g, '.')}
                </span>
                <h2 className="text-xl font-mono font-bold text-white tracking-wide truncate mt-0.5">
                  {studentUser.name}
                </h2>
                <div className="text-[11px] font-mono text-slate-300 truncate mt-0.5">
                  MBA CORE • TERM IV (2026-27)
                </div>
              </div>
            </div>

            {/* QUICK-ACCESS ESSENTIALS (Spacious horizontal metrics) */}
            <div className="flex items-center justify-between py-3 my-1 border-y border-white/10 font-mono">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">CURRENT CGPA</span>
                <div className="flex items-baseline space-x-1 mt-0.5">
                  <span className="text-2xl font-bold text-[#D7F36A]">3.82</span>
                  <span className="text-[11px] text-slate-400">/ 4.00</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 block font-medium">ATTENDANCE</span>
                <div className="mt-0.5">
                  <span className="text-2xl font-bold text-white">92.4%</span>
                </div>
              </div>
            </div>

            {/* Bottom Row: QR Code Matrix & Copyable Student ID */}
            <div className="flex items-end justify-between pt-2 border-t border-white/15">
              {/* High Contrast Scannable QR Code */}
              <div className="p-2 bg-white rounded-xl shadow-inner flex items-center justify-center shrink-0 border border-slate-300">
                <QrCode className="w-13 h-13 text-[#141420]" />
              </div>

              {/* Identification Block */}
              <div className="text-right text-xs font-mono space-y-1">
                <div className="flex items-center justify-end space-x-1.5 text-slate-400 text-[11px]">
                  <span>STUDENT ID</span>
                  <button 
                    type="button"
                    onClick={handleCopyId}
                    className="hover:text-white p-0.5 rounded cursor-pointer transition"
                    title="Copy Student ID"
                  >
                    {copiedId ? (
                      <Check className="w-3.5 h-3.5 text-[#D7F36A]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <div className="font-bold text-base text-[#D7F36A] tracking-wider">
                  {studentRefId}
                </div>
                <div className="text-[11px] text-slate-400">
                  Indian Institute of Management Sirmaur
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
