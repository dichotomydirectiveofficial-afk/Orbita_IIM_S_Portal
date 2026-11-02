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
import { AlertTriangle, X } from 'lucide-react';

const CockpitMain: React.FC = () => {
  const { workspace, alerts, dismissAlert } = useCockpit();
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
