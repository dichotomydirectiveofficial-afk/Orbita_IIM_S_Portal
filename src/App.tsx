import React, { useState } from 'react';
import { CockpitProvider, useCockpit } from './context/CockpitContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { AdminModeBanner } from './components/layout/AdminModeBanner';
import { LearnWorkspace } from './components/learn/LearnWorkspace';
import { CampusWorkspace } from './components/campus/CampusWorkspace';
import { OperationsWorkspace } from './components/operations/OperationsWorkspace';
import { AdminStepUpModal } from './components/modals/AdminStepUpModal';
import { NewTicketModal } from './components/modals/NewTicketModal';
import { AlertTriangle, X, CheckCircle2, Bell } from 'lucide-react';

const CockpitMain: React.FC = () => {
  const { workspace, alerts, dismissAlert, toasts, dismissToast } = useCockpit();
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [prefilledLocation, setPrefilledLocation] = useState<string | undefined>(undefined);

  const handleOpenTicket = (room?: string) => {
    setPrefilledLocation(room);
    setIsNewTicketOpen(true);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-screen bg-[#F7F7F4] text-[#20202B] overflow-hidden">
      {/* Top Banner when in Admin Mode */}
      <AdminModeBanner />

      {/* Main Two-Column Shell */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation Sidebar - Fixed Deep Charcoal Navy #202033 */}
        <Sidebar />

        {/* Center & Right Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F7F7F4]">
          {/* Header */}
          <Header />

          {/* Active Campus Resilience Alerts Banner */}
          {alerts.length > 0 && (
            <div className="bg-[#FEF7EA] border-b border-[#EEEEEB] px-8 py-2.5 flex items-center justify-between text-xs text-[#9E5F00] shrink-0">
              <div className="flex items-center space-x-2 truncate">
                <AlertTriangle className="w-4 h-4 text-[#C27803] shrink-0" />
                <span className="font-semibold truncate">{alerts[0].title}:</span>
                <span className="hidden md:inline truncate text-[#5A5A66]">{alerts[0].message}</span>
              </div>
              <button
                onClick={() => dismissAlert(alerts[0].id)}
                className="text-[#9E5F00] p-1 hover:bg-[#20202B]/5 rounded-md transition shrink-0 cursor-pointer ml-3"
                aria-label="Acknowledge alert"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Dynamic Workspace Body */}
          <div className="flex-1 overflow-y-auto">
            {workspace === 'learn' && (
              <LearnWorkspace onOpenReportTicket={handleOpenTicket} />
            )}

            {workspace === 'campus' && (
              <CampusWorkspace onOpenReportTicket={handleOpenTicket} />
            )}

            {workspace === 'operations' && (
              <OperationsWorkspace />
            )}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <AdminStepUpModal />
      <NewTicketModal
        isOpen={isNewTicketOpen}
        onClose={() => setIsNewTicketOpen(false)}
        prefilledLocation={prefilledLocation}
      />

      {/* Sleek In-App Toast Notification Stack */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-lg flex items-start space-x-3 transition-all duration-200 ${
              toast.type === 'error'
                ? 'bg-[#FDE8E8] border-[#D32F2F]/30 text-[#B71C1C]'
                : toast.type === 'warning'
                ? 'bg-[#FEF7EA] border-[#C27803]/30 text-[#9E5F00]'
                : toast.type === 'success'
                ? 'bg-[#EAF6EE] border-[#268A50]/30 text-[#1C6E3E]'
                : 'bg-[#202033] border-[#2B2B44] text-white'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-[#D32F2F]" />}
              {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-[#C27803]" />}
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#1C6E3E]" />}
              {toast.type === 'info' && <Bell className="w-4 h-4 text-[#D7F36A]" />}
            </div>
            <div className="flex-1 text-xs font-medium leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 p-0.5 rounded hover:bg-black/10 transition cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <CockpitProvider>
      <CockpitMain />
    </CockpitProvider>
  );
}
