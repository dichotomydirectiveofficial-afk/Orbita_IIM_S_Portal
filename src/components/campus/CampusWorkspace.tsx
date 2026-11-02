import React, { useState } from 'react';
import { useCockpit } from '../../context/CockpitContext';
import { 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Camera, 
  TrendingDown,
  Zap,
  Droplet,
  WashingMachine,
  Building2,
  Award,
  Sparkles
} from 'lucide-react';

interface CampusWorkspaceProps {
  onOpenReportTicket: (prefilledLoc?: string) => void;
}

export const CampusWorkspace: React.FC<CampusWorkspaceProps> = ({ onOpenReportTicket }) => {
  const { 
    activeCampusTab, 
    tickets, 
    confirmTicketResolution, 
    mealSlots, 
    toggleSkipMeal,
    parcels,
    collectParcel,
    alerts,
    timetable,
    currentUser,
    searchQuery,
    showToast
  } = useCockpit();

  const [ticketFilter, setTicketFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [parcelOtpInput, setParcelOtpInput] = useState<{ [id: string]: string }>({});

  const faqArticles = [
    { q: 'How do I request hostel room maintenance or plumbing fixes?', a: 'Tap the "+ Report an Issue" button above. Select Category (Plumbing) and Severity. Technicians acknowledge within 15-60 minutes.' },
    { q: 'Can I opt out of tomorrow\'s dinner to prevent mess food waste?', a: 'Yes. Navigate to the Mess Operations tab and tap the "Skip Meal" button on the Dinner card. Your response directly adjusts tomorrow morning\'s kitchen production batch.' },
    { q: 'Where do I collect Amazon / DTDC courier parcels on campus?', a: 'All incoming packages are safely held at the Central Security Parcel Bay in the Admin Block Ground Floor. Provide your 4-digit pickup OTP displayed in the Parcels tab.' },
    { q: 'What should I do during mountain flash rains or shuttle delays?', a: 'Check the Campus Alerts banner at the top of your dashboard. Verified shuttle rescheduling and academic timetable accommodations are broadcast in real-time.' },
  ];

  // Helper to dynamically check if timetable lecture clashes with lunch service (12:30 - 14:00)
  const checkDiningClash = (timeStr: string): boolean => {
    const parts = timeStr.split('-').map(s => s.trim());
    if (parts.length !== 2) return false;
    const [startStr, endStr] = parts;
    const parseMinutes = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return (h || 0) * 60 + (m || 0);
    };
    const slotStart = parseMinutes(startStr);
    const slotEnd = parseMinutes(endStr);
    const lunchStart = 12 * 60 + 30; // 12:30
    const lunchEnd = 14 * 60; // 14:00
    return Math.max(slotStart, lunchStart) < Math.min(slotEnd, lunchEnd);
  };

  const lunchClashingSlots = timetable.filter(s => checkDiningClash(s.time));

  const filteredTickets = tickets.filter((t) => {
    if (ticketFilter === 'open' && (t.state === 'Closed' || t.state === 'Resolved')) return false;
    if (ticketFilter === 'resolved' && (t.state !== 'Resolved' && t.state !== 'Closed')) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTrack = t.trackingNumber.toLowerCase().includes(q);
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchLoc = t.location.toLowerCase().includes(q);
      const matchCat = t.category.toLowerCase().includes(q);
      const matchDesc = t.description.toLowerCase().includes(q);
      if (!matchTrack && !matchTitle && !matchLoc && !matchCat && !matchDesc) return false;
    }
    return true;
  });

  const displayedParcels = parcels.filter((p) => {
    if (currentUser.role === 'student' && p.recipientEmail !== currentUser.email) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTrack = p.trackingCode.toLowerCase().includes(q);
      const matchName = p.recipientName.toLowerCase().includes(q);
      const matchCourier = p.courier.toLowerCase().includes(q);
      const matchRoom = p.recipientRoom.toLowerCase().includes(q);
      if (!matchTrack && !matchName && !matchCourier && !matchRoom) return false;
    }
    return true;
  });

  const filteredFaqs = faqArticles.filter((f) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
  });

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Tab: Control Room Ticketing */}
      {activeCampusTab === 'tickets' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-[#20202B]">Active Campus Tickets and SLA Status</h3>
              <p className="text-xs text-[#85858D]">
                Single front door for all hostel, dining, electrical and AV repairs
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center space-x-1.5 bg-[#F7F7F4] p-1 rounded-xl border border-[#EEEEEB]">
                <button
                  onClick={() => setTicketFilter('all')}
                  className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                    ticketFilter === 'all' ? 'bg-[#202033] text-white shadow-xs' : 'text-[#5A5A66] hover:text-[#20202B]'
                  }`}
                >
                  All ({tickets.length})
                </button>
                <button
                  onClick={() => setTicketFilter('open')}
                  className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                    ticketFilter === 'open' ? 'bg-[#202033] text-white shadow-xs' : 'text-[#5A5A66] hover:text-[#20202B]'
                  }`}
                >
                  Open / Active ({tickets.filter(t => t.state !== 'Closed' && t.state !== 'Resolved').length})
                </button>
                <button
                  onClick={() => setTicketFilter('resolved')}
                  className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                    ticketFilter === 'resolved' ? 'bg-[#202033] text-white shadow-xs' : 'text-[#5A5A66] hover:text-[#20202B]'
                  }`}
                >
                  Resolved ({tickets.filter(t => t.state === 'Resolved' || t.state === 'Closed').length})
                </button>
              </div>

              <button
                onClick={() => onOpenReportTicket()}
                className="flex items-center space-x-1.5 px-4 py-2 bg-[#202033] hover:bg-[#12121E] text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4 text-[#D7F36A]" />
                <span>Report an Issue</span>
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
            {mealSlots.map((slot) => {
              const isLunch = slot.id === 'lunch';
              const hasTimetableClash = slot.hasTimetableClash || (isLunch && lunchClashingSlots.length > 0);

              return (
                <div
                  key={slot.id}
                  className={`bg-white rounded-2xl p-6 border transition flex flex-col justify-between ${
                    slot.isSkippedByCurrentUser
                      ? 'border-[#EEEEEB] bg-[#F7F7F4] opacity-80'
                      : hasTimetableClash
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

                    {hasTimetableClash && (
                      <div className="p-2 mb-3 bg-white rounded-lg border border-[#C27803]/30 text-xs text-[#9E5F00] flex items-start space-x-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-[#C27803] mt-0.5" />
                        <span>
                          {lunchClashingSlots.length > 0
                            ? `Class Clash: ${lunchClashingSlots.map(s => `${s.day} ${s.time.split(' - ')[0]} ${s.courseCode}`).join(', ')} overlap`
                            : 'Class Clash: Monday 13:15 SM-403 overlap'}
                        </span>
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
              );
            })}
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
                  onClick={() => showToast(`Rating recorded: ${star} of 5 stars submitted for today's meal.`, 'success')}
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
            {displayedParcels.length === 0 ? (
              <div className="col-span-2 bg-white rounded-2xl p-8 border border-[#EEEEEB] text-center space-y-2">
                <p className="text-sm font-bold text-[#20202B]">No Packages Waiting for Collection</p>
                <p className="text-xs text-[#85858D]">
                  {currentUser.role === 'student'
                    ? `No deliveries currently logged for ${currentUser.name} (${currentUser.roomOrOffice}).`
                    : 'No parcels matched the current search query.'}
                </p>
              </div>
            ) : (
              displayedParcels.map((parcel) => (
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
                              showToast(res.error || 'Invalid OTP', 'error');
                            } else {
                              showToast(`Package ${parcel.trackingCode} claimed successfully! Locker unlocked.`, 'success');
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
              ))
            )}
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

      {/* Tab: Hostel Living & Sustainability Status */}
      {activeCampusTab === 'utilities' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EEEEEB] gap-3">
            <div>
              <h3 className="text-base font-bold text-[#20202B]">Hostel Living & Sustainability Status</h3>
              <p className="text-xs text-[#85858D]">
                Student residence telemetry, laundry room capacity, and Paonta Sahib green campus metrics
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-[#20202B] bg-white px-3 py-1 rounded-xl border border-[#EEEEEB] self-start sm:self-auto">
              Resident Scope: {currentUser.block} ({currentUser.roomOrOffice})
            </span>
          </div>

          {/* Section 1: Hostel Block B Living & Infrastructure Uptime */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#EEEEEB] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#85858D]">Hostel Power Uptime</span>
                <span className="w-2 h-2 rounded-full bg-[#268A50]" />
              </div>
              <div className="text-2xl font-bold font-mono text-[#20202B]">99.8%</div>
              <p className="text-xs text-[#85858D]">Rooftop solar microgrid with instant DG synchronization</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EEEEEB] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#85858D]">Geyser Hot Water</span>
                <span className="w-2 h-2 rounded-full bg-[#268A50]" />
              </div>
              <div className="text-2xl font-bold font-mono text-[#1C6E3E]">Active</div>
              <p className="text-xs text-[#85858D]">Peak schedule: 06:00 - 10:00 & 18:00 - 22:00 daily</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EEEEEB] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#85858D]">RO Drinking Water</span>
                <span className="w-2 h-2 rounded-full bg-[#268A50]" />
              </div>
              <div className="text-2xl font-bold font-mono text-[#20202B]">TDS 68 ppm</div>
              <p className="text-xs text-[#85858D]">Floors 1-3 central purifiers certified compliant</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EEEEEB] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#85858D]">Hostel Wi-Fi 6 Mesh</span>
                <span className="w-2 h-2 rounded-full bg-[#268A50]" />
              </div>
              <div className="text-2xl font-bold font-mono text-[#20202B]">280 Mbps</div>
              <p className="text-xs text-[#85858D]">Zero packet loss across all study wings</p>
            </div>
          </div>

          {/* Section 2: Smart Laundry Room Telemetry */}
          <div className="bg-white p-6 rounded-2xl border border-[#EEEEEB] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#202033] text-[#D7F36A] flex items-center justify-center">
                  <WashingMachine className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#20202B]">Hostel Block B Laundry Bay Telemetry</h4>
                  <p className="text-xs text-[#85858D]">Ground Floor Common Utility Wing • Live IoT Cycle Sensors</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-[#EAF6EE] text-[#1C6E3E] border border-[#268A50]/30">
                  6 of 8 Available
                </span>
                <span className="text-xs text-[#85858D] font-medium hidden sm:inline">Off-Peak Window Now</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5 pt-1">
              {[
                { id: 'WM-01', status: 'available', cycle: 'Idle' },
                { id: 'WM-02', status: 'available', cycle: 'Idle' },
                { id: 'WM-03', status: 'busy', cycle: '14m remaining' },
                { id: 'WM-04', status: 'available', cycle: 'Idle' },
                { id: 'WM-05', status: 'available', cycle: 'Idle' },
                { id: 'WM-06', status: 'available', cycle: 'Idle' },
                { id: 'WM-07', status: 'busy', cycle: '22m remaining' },
                { id: 'WM-08', status: 'available', cycle: 'Idle' },
              ].map((m) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-xl border text-center space-y-1 transition ${
                    m.status === 'available'
                      ? 'bg-[#EAF6EE]/50 border-[#268A50]/30 text-[#1C6E3E]'
                      : 'bg-[#FEF7EA] border-[#C27803]/40 text-[#9E5F00]'
                  }`}
                >
                  <div className="font-mono text-xs font-bold">{m.id}</div>
                  <div className="text-[11px] font-semibold">
                    {m.status === 'available' ? 'Available' : 'Running'}
                  </div>
                  <div className="text-[11px] text-[#5A5A66] truncate">{m.cycle}</div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-[#F7F7F4] rounded-xl border border-[#EEEEEB] text-xs text-[#5A5A66] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-[#85858D]" />
                <span>Recommended Laundry Window: <strong>14:00 - 17:00</strong> (Minimal wait times during academic lecture hours)</span>
              </span>
              <span className="text-[#85858D] text-xs">Self-service detergent bay refilled daily</span>
            </div>
          </div>

          {/* Section 3: Green Campus Sustainability Leaderboard & Conservation Notices */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#EEEEEB] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#20202B]">Hostel Conservation Leaderboard (Week 44)</h4>
                  <p className="text-xs text-[#85858D]">Per-capita electricity and water conservation across residential halls</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#D7F36A] text-[#20202B]">
                  Block B: #1 Rank
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { block: 'Hostel Block B (Resident Hall)', kwh: '14.2 kWh/res', water: '112 L/res', delta: '-12.4%', rank: 1, isMe: true },
                  { block: 'Hostel Block A (Resident Hall)', kwh: '16.8 kWh/res', water: '128 L/res', delta: '-6.1%', rank: 2, isMe: false },
                  { block: 'Management Development Centre (MDC)', kwh: '21.5 kWh/res', water: '155 L/res', delta: '+2.3%', rank: 3, isMe: false },
                  { block: 'Faculty Enclave', kwh: '24.1 kWh/res', water: '168 L/res', delta: '-3.8%', rank: 4, isMe: false },
                ].map((row) => (
                  <div
                    key={row.block}
                    className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition ${
                      row.isMe ? 'bg-[#F7F7F4] border-[#20202B]/30' : 'bg-white border-[#EEEEEB]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        row.rank === 1 ? 'bg-[#202033] text-[#D7F36A]' : 'bg-[#EEEEEB] text-[#5A5A66]'
                      }`}>
                        #{row.rank}
                      </span>
                      <div>
                        <div className="font-bold text-[#20202B] flex items-center space-x-1.5">
                          <span>{row.block}</span>
                          {row.isMe && (
                            <span className="text-[11px] bg-[#202033] text-white px-1.5 py-0.5 rounded font-mono">
                              Your Residence
                            </span>
                          )}
                        </div>
                        <div className="text-[#85858D] text-[11px]">Usage: {row.kwh} • {row.water}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`font-mono font-semibold ${row.delta.startsWith('-') ? 'text-[#1C6E3E]' : 'text-[#B71C1C]'}`}>
                        {row.delta}
                      </span>
                      <div className="text-[11px] text-[#85858D]">vs term average</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#202033] text-white p-6 rounded-2xl border border-[#2B2B44] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-[#D7F36A]" />
                  <h4 className="text-sm font-bold text-white">Mountain Eco Guideline</h4>
                </div>
                <p className="text-xs text-[#8E8EA0] leading-relaxed">
                  IIM Sirmaur's Dhaula Kuan campus sits amidst fragile Shivalik foothill ecosystems. The campus microgrid generates clean solar energy during sunny daytime hours.
                </p>
                <div className="p-3.5 rounded-xl bg-[#181827] border border-[#2B2B44] space-y-2 text-xs">
                  <div className="font-bold text-[#D7F36A]">Resident Action Recommendations:</div>
                  <ul className="space-y-1.5 text-[#8E8EA0] text-xs">
                    <li className="flex items-start space-x-1.5">
                      <span className="text-[#D7F36A]">•</span>
                      <span>Switch off geyser switches after 10:00 AM.</span>
                    </li>
                    <li className="flex items-start space-x-1.5">
                      <span className="text-[#D7F36A]">•</span>
                      <span>Report washroom water leaks promptly via "+ Report an Issue".</span>
                    </li>
                    <li className="flex items-start space-x-1.5">
                      <span className="text-[#D7F36A]">•</span>
                      <span>Take advantage of off-peak hours for laundry utility runs.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-[#2B2B44] flex items-center justify-between text-xs text-[#8E8EA0]">
                <span>Green Initiatives Council</span>
                <span className="text-[#D7F36A] font-semibold">Vision 2035</span>
              </div>
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
            {filteredFaqs.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#85858D] bg-[#F7F7F4] rounded-xl border border-[#EEEEEB]">
                No FAQ articles matched your search query.
              </div>
            ) : (
              filteredFaqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#F7F7F4] border border-[#EEEEEB] space-y-1 text-xs">
                  <h4 className="font-bold text-[#20202B] flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#202033] shrink-0" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-[#5A5A66] leading-relaxed pl-3">{faq.a}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
