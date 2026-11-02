import React, { useState } from 'react';
import { useCockpit } from '../../context/CockpitContext';
import { 
  Wrench, 
  UtensilsCrossed, 
  Package, 
  BellRing, 
  Zap, 
  HelpCircle, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Camera, 
  TrendingDown
} from 'lucide-react';

interface CampusWorkspaceProps {
  onOpenReportTicket: (prefilledLoc?: string) => void;
}

export const CampusWorkspace: React.FC<CampusWorkspaceProps> = ({ onOpenReportTicket }) => {
  const { 
    activeCampusTab, 
    setActiveCampusTab, 
    tickets, 
    confirmTicketResolution, 
    mealSlots, 
    toggleSkipMeal,
    parcels,
    collectParcel,
    alerts,
    utilityTelemetry
  } = useCockpit();

  const [ticketFilter, setTicketFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [parcelOtpInput, setParcelOtpInput] = useState<{ [id: string]: string }>({});

  const faqArticles = [
    { q: 'How do I request hostel room maintenance or plumbing fixes?', a: 'Tap the "+ Report an Issue" button above. Select Category (Plumbing) and Severity. Technicians acknowledge within 15-60 minutes.' },
    { q: 'Can I opt out of tomorrow\'s dinner to prevent mess food waste?', a: 'Yes. Navigate to the Mess Operations tab and tap the "Skip Meal" button on the Dinner card. Your response directly adjusts tomorrow morning\'s kitchen production batch.' },
    { q: 'Where do I collect Amazon / DTDC courier parcels on campus?', a: 'All incoming packages are safely held at the Central Security Parcel Bay in the Admin Block Ground Floor. Provide your 4-digit pickup OTP displayed in the Parcels tab.' },
    { q: 'What should I do during mountain flash rains or shuttle delays?', a: 'Check the Campus Alerts banner at the top of your dashboard. Verified shuttle rescheduling and academic timetable accommodations are broadcast in real-time.' },
  ];

  const filteredTickets = tickets.filter((t) => {
    if (ticketFilter === 'open') return t.state !== 'Closed' && t.state !== 'Resolved';
    if (ticketFilter === 'resolved') return t.state === 'Resolved' || t.state === 'Closed';
    return true;
  });

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Tab Selector */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#EEEEEB] pb-4 gap-3">
        <div className="flex items-center space-x-2">
          <CampusTabButton
            icon={<Wrench className="w-3.5 h-3.5" />}
            label="Control Room Tickets"
            count={tickets.filter(t => t.state !== 'Closed').length}
            isActive={activeCampusTab === 'tickets'}
            onClick={() => setActiveCampusTab('tickets')}
          />
          <CampusTabButton
            icon={<UtensilsCrossed className="w-3.5 h-3.5" />}
            label="Mess Operations"
            isActive={activeCampusTab === 'mess'}
            onClick={() => setActiveCampusTab('mess')}
          />
          <CampusTabButton
            icon={<Package className="w-3.5 h-3.5" />}
            label="Parcels & Courier"
            count={parcels.filter(p => p.status === 'ready_for_pickup').length}
            isActive={activeCampusTab === 'parcels'}
            onClick={() => setActiveCampusTab('parcels')}
          />
          <CampusTabButton
            icon={<BellRing className="w-3.5 h-3.5" />}
            label="Campus Alerts"
            count={alerts.length}
            isActive={activeCampusTab === 'alerts'}
            onClick={() => setActiveCampusTab('alerts')}
          />
          <CampusTabButton
            icon={<Zap className="w-3.5 h-3.5" />}
            label="Energy & Utilities"
            isActive={activeCampusTab === 'utilities'}
            onClick={() => setActiveCampusTab('utilities')}
          />
          <CampusTabButton
            icon={<HelpCircle className="w-3.5 h-3.5" />}
            label="Helpdesk FAQ"
            isActive={activeCampusTab === 'services'}
            onClick={() => setActiveCampusTab('services')}
          />
        </div>

        {activeCampusTab === 'tickets' && (
          <button
            onClick={() => onOpenReportTicket()}
            className="flex items-center space-x-1.5 px-4 py-2 bg-[#202033] hover:bg-[#12121E] text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D7F36A]" />
            <span>Report an Issue</span>
          </button>
        )}
      </div>

      {/* Tab: Control Room Ticketing */}
      {activeCampusTab === 'tickets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#20202B]">Active Campus Tickets and SLA Status</h3>
              <p className="text-xs text-[#85858D]">
                Single front door for all hostel, dining, electrical and AV repairs
              </p>
            </div>
            
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-[#85858D] font-medium">Filter:</span>
              <button
                onClick={() => setTicketFilter('all')}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  ticketFilter === 'all' ? 'bg-[#202033] text-white' : 'bg-white text-[#5A5A66] border border-[#EEEEEB]'
                }`}
              >
                All ({tickets.length})
              </button>
              <button
                onClick={() => setTicketFilter('open')}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  ticketFilter === 'open' ? 'bg-[#202033] text-white' : 'bg-white text-[#5A5A66] border border-[#EEEEEB]'
                }`}
              >
                Open / In Progress
              </button>
              <button
                onClick={() => setTicketFilter('resolved')}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  ticketFilter === 'resolved' ? 'bg-[#202033] text-white' : 'bg-white text-[#5A5A66] border border-[#EEEEEB]'
                }`}
              >
                Resolved / Closed
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredTickets.map((t) => (
              <div
                key={t.id}
                className={`bg-white rounded-2xl p-6 border transition ${
                  t.isOverdue
                    ? 'border-[#D32F2F] bg-[#FDE8E8]/40'
                    : 'border-[#EEEEEB] hover:border-[#20202B]/30'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#20202B] bg-[#F7F7F4] px-2.5 py-0.5 rounded-md border border-[#EEEEEB]">
                        {t.trackingNumber}
                      </span>

                      {/* Priority Badge */}
                      <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                        t.priority === 'P1'
                          ? 'bg-[#FDE8E8] text-[#B71C1C]'
                          : t.priority === 'P2'
                          ? 'bg-[#FEF7EA] text-[#9E5F00]'
                          : 'bg-[#F7F7F4] text-[#5A5A66] border border-[#EEEEEB]'
                      }`}>
                        {t.priority} Criticality
                      </span>

                      {/* State Badge */}
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#F7F7F4] text-[#20202B] border border-[#EEEEEB]">
                        {t.state}
                      </span>

                      {/* Problem Record Flag */}
                      {t.isProblemRecord && (
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#202033] text-[#D7F36A] flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#D7F36A]" />
                          <span>Problem Record (Repeat {t.repeatCountIn90Days}x in 90d)</span>
                        </span>
                      )}

                      {/* Escalation Level */}
                      {t.escalationLevel > 0 && (
                        <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-[#FDE8E8] text-[#B71C1C]">
                          Escalated: L{t.escalationLevel} Ops Admin
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-[#20202B]">{t.title}</h4>
                    <p className="text-xs text-[#5A5A66] leading-relaxed">{t.description}</p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#85858D] pt-1">
                      <span>Location: <strong className="text-[#20202B]">{t.location}</strong></span>
                      <span>Category: <strong className="text-[#20202B]">{t.category}</strong></span>
                      <span>Reported: {new Date(t.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                      {t.assignedTo && (
                        <span className="text-[#20202B] font-semibold">
                          Assigned: {t.assignedTo} ({t.assignedRole})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* SLA Countdown Card */}
                  <div className="lg:w-64 bg-[#F7F7F4] rounded-xl p-4 border border-[#EEEEEB] flex flex-col justify-between shrink-0 space-y-3">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center justify-between text-[#85858D]">
                        <span>Resolution SLA:</span>
                        <span className="font-semibold text-[#20202B]">{t.slaResolveLimitHours}h Limit</span>
                      </div>
                      <div className="flex items-center space-x-1.5 pt-1">
                        <Clock className={`w-4 h-4 ${t.isOverdue ? 'text-[#B71C1C]' : 'text-[#20202B]'}`} />
                        <span className={`text-xs font-mono font-semibold ${t.isOverdue ? 'text-[#B71C1C]' : 'text-[#20202B]'}`}>
                          {t.isOverdue ? 'SLA Breached' : 'Due: ' + new Date(t.dueResolveTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {/* Requester Confirmation */}
                    {t.state === 'Resolved' && (
                      <div className="pt-2 border-t border-[#EEEEEB] text-xs space-y-2">
                        <span className="font-semibold text-[#20202B] block">
                          Technician marked fixed. Please confirm:
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => confirmTicketResolution(t.id, true)}
                            className="px-2.5 py-1.5 bg-[#268A50] text-white rounded-lg font-semibold text-xs flex items-center justify-center space-x-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Fixed</span>
                          </button>
                          <button
                            onClick={() => confirmTicketResolution(t.id, false)}
                            className="px-2.5 py-1.5 bg-[#FDE8E8] text-[#B71C1C] border border-[#D32F2F]/30 rounded-lg font-semibold text-xs flex items-center justify-center space-x-1 cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reopen</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {t.state === 'Closed' && t.closureConfirmed && (
                      <div className="text-xs text-[#1C6E3E] font-medium flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirmed closed by requester</span>
                      </div>
                    )}
                  </div>
                </div>

                {t.photos && t.photos.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#EEEEEB] flex items-center space-x-3">
                    <span className="text-xs text-[#85858D] font-medium flex items-center space-x-1">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Attached Photographic Proof:</span>
                    </span>
                    <a
                      href={t.photos[0]}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#20202B] hover:underline font-semibold"
                    >
                      View Photo Evidence
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Mess Operations */}
      {activeCampusTab === 'mess' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-2">
            <div>
              <h3 className="text-base font-bold text-[#20202B]">Today's Dining Menu & Waste Reduction</h3>
              <p className="text-xs text-[#85858D]">
                Pre-booking optimization: Tap "Skip" if dining out to prevent kitchen over-preparation
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold bg-[#EAF6EE] text-[#1C6E3E] px-3 py-1.5 rounded-xl border border-[#268A50]/30">
              <TrendingDown className="w-4 h-4 text-[#1C6E3E]" />
              <span>Campus Food Waste Reduced to 11.8% (Target: &lt;15%)</span>
            </div>
          </div>

          {/* Meals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mealSlots.map((slot) => (
              <div
                key={slot.id}
                className={`bg-white rounded-2xl p-6 border transition flex flex-col justify-between ${
                  slot.isSkippedByCurrentUser
                    ? 'border-[#EEEEEB] bg-[#F7F7F4] opacity-80'
                    : slot.hasTimetableClash
                    ? 'border-[#C27803]/40 bg-[#FEF7EA]'
                    : 'border-[#EEEEEB] hover:border-[#20202B]/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#20202B]">{slot.name}</span>
                    <span className="text-xs font-mono font-semibold text-[#20202B] bg-[#F7F7F4] px-2 py-0.5 rounded border border-[#EEEEEB]">
                      {slot.timing}
                    </span>
                  </div>

                  {slot.hasTimetableClash && (
                    <div className="p-2 mb-3 bg-white rounded-lg border border-[#C27803]/30 text-xs text-[#9E5F00] flex items-start space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-[#C27803] mt-0.5" />
                      <span>Class Clash: Monday 13:15 SM-403 overlap</span>
                    </div>
                  )}

                  <div className="space-y-1.5 my-3 text-xs text-[#5A5A66]">
                    {slot.items.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#85858D] shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#EEEEEB] flex items-center justify-between text-xs text-[#85858D]">
                    <span>{slot.calories} kcal</span>
                    <span>Allergens: {slot.allergens.join(', ')}</span>
                  </div>
                </div>

                {/* Skip Action Button */}
                <div className="pt-4 mt-4 border-t border-[#EEEEEB]">
                  <button
                    onClick={() => toggleSkipMeal(slot.id)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                      slot.isSkippedByCurrentUser
                        ? 'bg-[#FEF7EA] text-[#9E5F00] border border-[#C27803]/40'
                        : 'bg-[#202033] text-white hover:bg-[#12121E]'
                    }`}
                  >
                    {slot.isSkippedByCurrentUser ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#9E5F00]" />
                        <span>Meal Skipped (Tap to Restore)</span>
                      </>
                    ) : (
                      <>
                        <span>Skip Meal (Dining Elsewhere)</span>
                      </>
                    )}
                  </button>

                  <div className="mt-2 text-xs text-[#85858D] text-center">
                    {slot.skippedCount} students skipping today
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Meal Rating Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#EEEEEB] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-[#20202B]">Rate Today's Meal</h4>
              <p className="text-xs text-[#85858D]">
                Student feedback is routed directly to Rajesh Negi (Mess Manager) and reviewed weekly.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => alert(`Rating recorded: ${star} of 5`)}
                  className="w-9 h-9 rounded-xl bg-[#F7F7F4] hover:bg-[#D7F36A] hover:text-[#20202B] border border-[#EEEEEB] flex items-center justify-center text-xs font-bold transition cursor-pointer text-[#20202B]"
                >
                  {star}★
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Parcels & Courier Desk */}
      {activeCampusTab === 'parcels' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#20202B]">Incoming Deliveries & Locker Pickups</h3>
              <p className="text-xs text-[#85858D]">
                Security-verified package holding with OTP authentication
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parcels.map((parcel) => (
              <div
                key={parcel.id}
                className="bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#20202B] bg-[#F7F7F4] px-2.5 py-1 rounded-md border border-[#EEEEEB]">
                    {parcel.trackingCode}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                    parcel.status === 'collected'
                      ? 'bg-[#F7F7F4] text-[#85858D]'
                      : 'bg-[#EAF6EE] text-[#1C6E3E]'
                  }`}>
                    {parcel.status === 'collected' ? 'Collected' : 'Ready for Pickup'}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-[#85858D] font-medium">{parcel.courier}</div>
                  <div className="text-[#20202B] font-bold">Recipient: {parcel.recipientName} ({parcel.recipientRoom})</div>
                  <div className="text-[#5A5A66]">Holding Bay: <strong className="text-[#20202B]">{parcel.storageLocker}</strong></div>
                  <div className="text-[#85858D] text-xs">Arrived: {new Date(parcel.receivedAt).toLocaleString()}</div>
                </div>

                {parcel.status === 'ready_for_pickup' && (
                  <div className="pt-3 border-t border-[#EEEEEB]">
                    <div className="p-3 bg-[#F7F7F4] rounded-xl border border-[#EEEEEB] mb-3 flex items-center justify-between text-xs">
                      <span className="text-[#5A5A66] font-medium">Pickup OTP:</span>
                      <span className="font-mono text-base font-bold text-[#20202B] tracking-wider">
                        {parcel.pickupOtp}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Enter 4-digit OTP"
                        value={parcelOtpInput[parcel.id] || ''}
                        onChange={(e) => setParcelOtpInput({ ...parcelOtpInput, [parcel.id]: e.target.value })}
                        className="flex-1 px-3 py-2 text-xs bg-white border border-[#EEEEEB] rounded-xl text-[#20202B] focus:outline-hidden focus:border-[#20202B]"
                      />
                      <button
                        onClick={() => {
                          const res = collectParcel(parcel.id, parcelOtpInput[parcel.id] || '');
                          if (!res.success) {
                            alert(res.error);
                          }
                        }}
                        className="px-4 py-2 text-xs font-semibold text-white bg-[#202033] hover:bg-[#12121E] rounded-xl transition cursor-pointer"
                      >
                        Claim Package
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Campus Resilience Alerts */}
      {activeCampusTab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#20202B]">Campus Resilience & Operational Advisories</h3>
              <p className="text-xs text-[#85858D]">
                Real-time situational announcements for weather, water disruptions, and transit
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {alerts.map((al) => (
              <div
                key={al.id}
                className="bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 text-[#20202B] font-bold">
                    <AlertTriangle className="w-5 h-5 text-[#C27803] shrink-0" />
                    <span className="text-base">{al.title}</span>
                  </div>
                  <span className="text-xs font-mono bg-[#F7F7F4] text-[#20202B] px-2.5 py-1 rounded-md border border-[#EEEEEB]">
                    Reach: {al.reachPercentage}% ({al.acknowledgedCount}/{al.totalAudience})
                  </span>
                </div>

                <p className="text-xs text-[#5A5A66] leading-relaxed bg-[#F7F7F4] p-4 rounded-xl border border-[#EEEEEB]">
                  {al.message}
                </p>

                <div className="flex items-center justify-between text-xs text-[#85858D] pt-1">
                  <span>Published by: <strong className="text-[#20202B]">{al.publishedBy}</strong></span>
                  <span>Active until: {new Date(al.activeUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Energy & Water Utilities */}
      {activeCampusTab === 'utilities' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#20202B]">Dhaula Kuan Campus Telemetry</h3>
              <p className="text-xs text-[#85858D]">
                100,000 daily meter readings across 5 substations and solar rooftop microgrids
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-[#20202B] bg-white px-3 py-1 rounded-xl border border-[#EEEEEB]">
              Telemetry Sync: Live
            </span>
          </div>

          {utilityTelemetry.anomalyDetected && (
            <div className="p-4 bg-[#FDE8E8] border border-[#D32F2F]/30 rounded-xl text-xs text-[#B71C1C] flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-[#D32F2F] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Automated Anomaly Detected in Block B Riser</h4>
                <p className="mt-0.5 leading-snug">{utilityTelemetry.anomalyMessage}</p>
                <span className="text-xs text-[#B71C1C] mt-1 block font-semibold">
                  A P1 ticket has been automatically generated and dispatched to Suresh Verma (Lead Engineer).
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#EEEEEB] space-y-1">
              <span className="text-xs text-[#85858D] font-medium">Real-Time Electricity</span>
              <div className="text-2xl font-bold text-[#20202B] font-mono">{utilityTelemetry.electricityKw} kW</div>
              <p className="text-xs text-[#85858D]">Peak study hours load</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#EEEEEB] space-y-1">
              <span className="text-xs text-[#85858D] font-medium">Solar Generation</span>
              <div className="text-2xl font-bold text-[#1C6E3E] font-mono">{utilityTelemetry.solarGenerationKw} kW</div>
              <p className="text-xs text-[#85858D]">Rooftop Solar Array Phase 1</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#EEEEEB] space-y-1">
              <span className="text-xs text-[#85858D] font-medium">Water Draw</span>
              <div className="text-2xl font-bold text-[#20202B] font-mono">{utilityTelemetry.waterKiloLiters} kL</div>
              <p className="text-xs text-[#85858D]">Daily campus consumption</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#EEEEEB] space-y-1">
              <span className="text-xs text-[#85858D] font-medium">Grid Offset Rate</span>
              <div className="text-2xl font-bold text-[#20202B] font-mono">18.9%</div>
              <p className="text-xs text-[#85858D]">2035 Target: 40% Clean Energy</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Helpdesk FAQ */}
      {activeCampusTab === 'services' && (
        <div className="bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#20202B]">Student Services Knowledge Base</h3>
            <p className="text-xs text-[#85858D]">
              Deflection answers to eliminate multi-office visits
            </p>
          </div>

          <div className="space-y-3">
            {faqArticles.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#F7F7F4] border border-[#EEEEEB] space-y-1 text-xs">
                <h4 className="font-bold text-[#20202B] flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#202033] shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-[#5A5A66] leading-relaxed pl-3">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface CampusTabButtonProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
  isActive: boolean;
  onClick: () => void;
}

const CampusTabButton: React.FC<CampusTabButtonProps> = ({ icon, label, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition flex items-center space-x-1.5 cursor-pointer ${
      isActive
        ? 'bg-[#202033] text-white shadow-xs'
        : 'text-[#85858D] hover:text-[#20202B] hover:bg-white'
    }`}
  >
    <span>{icon}</span>
    <span>{label}</span>
    {count !== undefined && count > 0 && (
      <span className={`text-[11px] px-1.5 py-0.2 rounded-md font-mono ${isActive ? 'bg-[#D7F36A] text-[#20202B]' : 'bg-[#EEEEEB] text-[#5A5A66]'}`}>
        {count}
      </span>
    )}
  </button>
);
