import React from 'react';
import { useCockpit } from '../../context/CockpitContext';
import { BrandLogo } from '../common/BrandLogo';
import { 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  ClipboardCheck, 
  Wrench, 
  UtensilsCrossed, 
  Package, 
  BellRing, 
  Zap, 
  HelpCircle, 
  BarChart3, 
  Kanban, 
  Building2, 
  ShieldCheck, 
  Lock,
  ChevronDown,
  LayoutDashboard,
  Brain,
  Shield
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    workspace, 
    setWorkspace, 
    activeLearnTab, 
    setActiveLearnTab, 
    activeCampusTab, 
    setActiveCampusTab, 
    activeOpsTab, 
    setActiveOpsTab,
    isAdminMode,
    openStepUpModal,
    currentUser,
    switchUser,
    availableUsers
  } = useCockpit();

  return (
    <aside className="w-60 bg-[#202033] text-white flex flex-col h-full shrink-0 select-none border-r border-[#2B2B44]">
      {/* Brand Header: Logo spans the entire section */}
      <div className="h-20 px-3.5 flex items-center justify-center border-b border-[#2C2C42]">
        <BrandLogo size="sidebar" />
      </div>

      {/* Workspace Switcher */}
      <div className="px-3 pt-4 pb-2">
        <div className="text-xs font-semibold text-[#8E8EA0] px-2 mb-2">
          Workspace
        </div>
        <div className="grid grid-cols-3 gap-1 bg-[#181827] p-1 rounded-xl">
          <button
            onClick={() => setWorkspace('learn')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition text-center cursor-pointer ${
              workspace === 'learn'
                ? 'bg-[#D7F36A] text-[#20202B] shadow-xs'
                : 'text-[#8E8EA0] hover:text-white'
            }`}
          >
            Learn
          </button>
          
          <button
            onClick={() => setWorkspace('campus')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition text-center cursor-pointer ${
              workspace === 'campus'
                ? 'bg-[#D7F36A] text-[#20202B] shadow-xs'
                : 'text-[#8E8EA0] hover:text-white'
            }`}
          >
            Campus
          </button>

          <button
            onClick={() => {
              if (isAdminMode) {
                setWorkspace('operations');
              } else {
                openStepUpModal();
              }
            }}
            className={`py-1.5 text-xs font-semibold rounded-lg transition text-center flex items-center justify-center space-x-1 cursor-pointer ${
              workspace === 'operations'
                ? 'bg-[#D7F36A] text-[#20202B] shadow-xs'
                : 'text-[#8E8EA0] hover:text-white'
            }`}
          >
            <span>Ops</span>
            {isAdminMode ? (
              <span className="w-1.5 h-1.5 rounded-full bg-[#268A50]" />
            ) : (
              <Lock className="w-3 h-3 text-[#8E8EA0]" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {workspace === 'learn' && (
          <>
            <div className="text-[11px] font-semibold text-[#8E8EA0] px-2 py-1.5">
              LMS Portal
            </div>
            
            <NavItem
              icon={<LayoutDashboard className="w-4 h-4" />}
              label="Dashboard"
              isActive={activeLearnTab === 'overview'}
              onClick={() => setActiveLearnTab('overview')}
            />
            <NavItem
              icon={<BookOpen className="w-4 h-4" />}
              label="Courses & Content"
              isActive={activeLearnTab === 'courses'}
              badge="4"
              onClick={() => setActiveLearnTab('courses')}
            />
            <NavItem
              icon={<ClipboardCheck className="w-4 h-4" />}
              label="Assignments"
              isActive={activeLearnTab === 'assignments'}
              badge="1 Due"
              onClick={() => setActiveLearnTab('assignments')}
            />
            <NavItem
              icon={<Calendar className="w-4 h-4" />}
              label="Timetable & Rooms"
              isActive={activeLearnTab === 'timetable'}
              onClick={() => setActiveLearnTab('timetable')}
            />
            <NavItem
              icon={<BarChart3 className="w-4 h-4" />}
              label="Learning Analytics"
              isActive={activeLearnTab === 'insights'}
              onClick={() => setActiveLearnTab('insights')}
            />
          </>
        )}

        {workspace === 'campus' && (
          <>
            <div className="text-[11px] font-semibold text-[#8E8EA0] px-2 py-1.5">
              Campus Services
            </div>
            
            <NavItem
              icon={<Wrench className="w-4 h-4" />}
              label="Control Room Tickets"
              isActive={activeCampusTab === 'tickets'}
              badge="2"
              onClick={() => setActiveCampusTab('tickets')}
            />
            <NavItem
              icon={<UtensilsCrossed className="w-4 h-4" />}
              label="Mess Operations"
              isActive={activeCampusTab === 'mess'}
              onClick={() => setActiveCampusTab('mess')}
            />
            <NavItem
              icon={<Package className="w-4 h-4" />}
              label="Parcels & Courier"
              isActive={activeCampusTab === 'parcels'}
              badge="1"
              onClick={() => setActiveCampusTab('parcels')}
            />
            <NavItem
              icon={<BellRing className="w-4 h-4" />}
              label="Campus Alerts"
              isActive={activeCampusTab === 'alerts'}
              onClick={() => setActiveCampusTab('alerts')}
            />
            <NavItem
              icon={<Zap className="w-4 h-4" />}
              label="Energy & Utilities"
              isActive={activeCampusTab === 'utilities'}
              onClick={() => setActiveCampusTab('utilities')}
            />
            <NavItem
              icon={<HelpCircle className="w-4 h-4" />}
              label="Helpdesk FAQ"
              isActive={activeCampusTab === 'services'}
              onClick={() => setActiveCampusTab('services')}
            />
          </>
        )}

        {workspace === 'operations' && (
          <>
            <div className="text-[11px] font-semibold text-[#8E8EA0] px-2 py-1.5 flex items-center justify-between">
              <span>Admin Console</span>
              <span className="px-1.5 py-0.2 rounded bg-[#2B2B44] text-[#D7F36A] text-xs font-mono">L2</span>
            </div>
            
            <NavItem
              icon={<LayoutDashboard className="w-4 h-4" />}
              label="Today (Triage)"
              isActive={activeOpsTab === 'today'}
              badge="Urgent"
              badgeColor="lime"
              onClick={() => setActiveOpsTab('today')}
            />
            <NavItem
              icon={<Kanban className="w-4 h-4" />}
              label="Control Room Board"
              isActive={activeOpsTab === 'control_room'}
              onClick={() => setActiveOpsTab('control_room')}
            />
            <NavItem
              icon={<Brain className="w-4 h-4" />}
              label="Mess Intelligence"
              isActive={activeOpsTab === 'mess_intelligence'}
              onClick={() => setActiveOpsTab('mess_intelligence')}
            />
            <NavItem
              icon={<Building2 className="w-4 h-4" />}
              label="Hostel & Facilities"
              isActive={activeOpsTab === 'hostel'}
              onClick={() => setActiveOpsTab('hostel')}
            />
            <NavItem
              icon={<GraduationCap className="w-4 h-4" />}
              label="Academic Operations"
              isActive={activeOpsTab === 'academic'}
              onClick={() => setActiveOpsTab('academic')}
            />
            <NavItem
              icon={<BarChart3 className="w-4 h-4" />}
              label="2035 KPI Scorecard"
              isActive={activeOpsTab === 'kpis'}
              onClick={() => setActiveOpsTab('kpis')}
            />
            <NavItem
              icon={<ShieldCheck className="w-4 h-4" />}
              label="Security Audit Log"
              isActive={activeOpsTab === 'audit_log'}
              onClick={() => setActiveOpsTab('audit_log')}
            />
          </>
        )}
      </div>

      {/* User profile & Persona switcher at bottom */}
      <div className="p-3 border-t border-[#2C2C42] bg-[#1B1B2C]">
        <div className="flex items-center space-x-3 mb-2 px-1">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-lg object-cover border border-[#3A3A54]"
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">{currentUser.name}</div>
            <div className="text-[11px] text-[#8E8EA0] truncate">{currentUser.roleName.split('(')[0]}</div>
          </div>
        </div>

        <div className="relative mt-2">
          <select
            value={currentUser.id}
            onChange={(e) => switchUser(e.target.value)}
            className="w-full text-xs font-medium bg-[#2B2B44] border border-[#3A3A54] text-white py-1.5 pl-2.5 pr-7 rounded-lg focus:outline-hidden appearance-none cursor-pointer"
          >
            {availableUsers.map((u) => (
              <option key={u.id} value={u.id} className="bg-[#202033] text-white">
                {u.name} ({u.role})
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#8E8EA0] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  badge?: string;
  badgeColor?: 'lime' | 'default';
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ 
  icon, 
  label, 
  isActive, 
  badge, 
  badgeColor = 'default',
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
        isActive
          ? 'bg-[#D7F36A] text-[#20202B] font-semibold shadow-xs'
          : 'text-[#C5C5D2] hover:bg-[#2B2B44] hover:text-white'
      }`}
    >
      <div className="flex items-center space-x-2.5">
        <span className={isActive ? 'text-[#20202B]' : 'text-[#8E8EA0]'}>
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </div>

      {badge && (
        <span
          className={`text-[11px] px-1.5 py-0.2 rounded-md font-mono font-medium ${
            isActive
              ? 'bg-[#20202B] text-[#D7F36A]'
              : badgeColor === 'lime'
              ? 'bg-[#D7F36A] text-[#20202B]'
              : 'bg-[#2B2B44] text-[#C5C5D2]'
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
};
