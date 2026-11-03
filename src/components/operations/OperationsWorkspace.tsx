import React, { useState } from 'react';
import { useCockpit } from '../../context/CockpitContext';
import { TicketState } from '../../types';
import { 
  AlertTriangle, 
  Clock, 
  Wrench, 
  Brain, 
  Download,
  Zap,
  Droplet,
  Users,
  Flame,
  CheckCircle2,
  UtensilsCrossed
} from 'lucide-react';

export const OperationsWorkspace: React.FC = () => {
  const { 
    activeOpsTab, 
    setActiveOpsTab, 
    tickets, 
    updateTicketStatus, 
    assignTicketToStaff, 
    escalateTicketLevel,
    wasteRecords,
    forecastParams,
    updateForecastParams,
    problemRecords,
    kpis,
    auditLogs,
    currentUser,
    mealSlots,
    utilityTelemetry,
    showToast
  } = useCockpit();

  // Mess forecasting simulation state
  const [simAlpha, setSimAlpha] = useState(forecastParams.alpha);
  const [simBuffer, setSimBuffer] = useState(forecastParams.safetyBufferPercent);

  const handleForecastParamChange = (alpha: number, buffer: number) => {
    setSimAlpha(alpha);
    setSimBuffer(buffer);
    updateForecastParams({ alpha, safetyBufferPercent: buffer });
  };

  const overdueTickets = tickets.filter(t => t.isOverdue && t.state !== 'Closed');
  const criticalTickets = tickets.filter(t => t.priority === 'P1' && t.state !== 'Closed');

  // Deduplicate tickets using unique IDs to prevent React duplicate key crashes
  const triageTickets = Array.from(
    new Map([...criticalTickets, ...overdueTickets].map(t => [t.id, t])).values()
  );

  // Selected meal shift for kitchen production planning (defaults to Dinner)
  const [selectedMealSlotId, setSelectedMealSlotId] = useState<string>('dinner');
  const selectedSlot = mealSlots.find(s => s.id === selectedMealSlotId) || mealSlots[3];

  // Daily Kitchen Production Planning Sheet computations (Reactive to Skip Meal & Tuner Sliders)
  const enrolledDiners = 500;
  const declaredSkips = selectedSlot.skippedCount;
  const netConfirmedDemand = Math.max(0, enrolledDiners - declaredSkips);

  // Exponential Smoothing on past historical dinners (At = 450 actuals served, Ft = 455 prior forecast)
  const yesterdayActualServed = wasteRecords[wasteRecords.length - 1]?.mealsServed || 450;
  const priorPeriodForecast = wasteRecords[wasteRecords.length - 2]?.mealsServed || 455;
  const smoothedDemand = Math.round(simAlpha * yesterdayActualServed + (1 - simAlpha) * priorPeriodForecast);

  // Calibrated expected demand: combining the time-series trend with today's live skip census
  // Pre-booked skips provide an explicit ceiling so kitchen never over-prepares when students opt out
  const calibratedDemand = Math.min(smoothedDemand, netConfirmedDemand);
  const plannedQuantity = Math.round(calibratedDemand * (1 + simBuffer / 100));
  const batch1Target = Math.round(plannedQuantity * 0.75); // 75% pre-service cooking target
  const batch2Reserve = plannedQuantity - batch1Target;     // 25% postponement reserve

  // 3-Tier Newsvendor sizing
  const coreTierPortions = plannedQuantity;
  const committedPremiumPortions = Math.min(plannedQuantity, netConfirmedDemand);
  const liveFinishingPortions = Math.round(calibratedDemand * 0.4);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      {/* View Title & Scope Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#EEEEEB] pb-4 gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#20202B]">
            {activeOpsTab === 'today' && 'Operations Triage & Escalations'}
            {activeOpsTab === 'control_room' && 'Central Control Room Kanban Board'}
            {activeOpsTab === 'mess_intelligence' && 'Mess Intelligence & Demand Forecasting'}
            {activeOpsTab === 'hostel' && 'Hostel & Facilities Asset Oversight'}
            {activeOpsTab === 'academic' && 'Academic Operations & Room Routing'}
            {activeOpsTab === 'kpis' && 'IIM Sirmaur 2035 Strategic KPI Scorecard'}
            {activeOpsTab === 'audit_log' && 'Campus Operations Audit Trail & System Log'}
          </h2>
          <p className="text-xs text-[#85858D]">
            {activeOpsTab === 'today' && 'Real-time incident response, critical alerts, and SLA breach mitigation'}
            {activeOpsTab === 'control_room' && 'Multi-stage campus ticket pipeline and technician assignment'}
            {activeOpsTab === 'mess_intelligence' && 'Newsvendor model demand forecasting and food waste mitigation'}
            {activeOpsTab === 'hostel' && 'Occupancy metrics, block telemetry, and physical plant status'}
            {activeOpsTab === 'academic' && 'Exam hall logistics, lecture schedule changes, and classroom utilization'}
            {activeOpsTab === 'kpis' && 'Progress tracking across IIM Sirmaur 2035 institutional targets'}
            {activeOpsTab === 'audit_log' && 'Tamper-evident record of all dispatch, approval, and governance actions'}
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-[#85858D] font-mono">
          <span>Console Scope:</span>
          <span className="font-bold text-[#20202B] bg-[#EEEEEB] px-2.5 py-1 rounded-lg">
            {currentUser.adminScope || 'General Operations'}
          </span>
        </div>
      </div>

      {/* VIEW: Today (Triage) */}
      {activeOpsTab === 'today' && (
        <div className="space-y-6">
          {/* Urgent Alerts Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FDE8E8] border border-[#D32F2F]/30 p-6 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-[#B71C1C]">
                <span className="text-xs font-semibold">Critical P1 Tickets</span>
                <AlertTriangle className="w-4 h-4 text-[#B71C1C]" />
              </div>
              <div className="text-3xl font-bold text-[#B71C1C] font-mono">{criticalTickets.length}</div>
              <p className="text-xs text-[#B71C1C]/90">Immediate response required (&lt;4h resolution SLA)</p>
            </div>

            <div className="bg-[#FEF7EA] border border-[#C27803]/30 p-6 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-[#9E5F00]">
                <span className="text-xs font-semibold">SLA Overdue / Breached</span>
                <Clock className="w-4 h-4 text-[#9E5F00]" />
              </div>
              <div className="text-3xl font-bold text-[#9E5F00] font-mono">{overdueTickets.length}</div>
              <p className="text-xs text-[#9E5F00]/90">Auto-escalated to Level 2 Operations Admin</p>
            </div>

            <div className="bg-white border border-[#EEEEEB] p-6 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-[#20202B]">
                <span className="text-xs font-semibold">Active Problem Records</span>
                <Wrench className="w-4 h-4 text-[#85858D]" />
              </div>
              <div className="text-3xl font-bold text-[#20202B] font-mono">{problemRecords.length}</div>
              <p className="text-xs text-[#85858D]">Recurring failures (&ge;3x repeat) requiring RCA</p>
            </div>
          </div>

          {/* Attention Required Items */}
          <div className="bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#20202B]">Items Needing Administrative Action</h3>
                <p className="text-xs text-[#85858D]">Triage queues from Estate, Mess, and Academic desks</p>
              </div>
            </div>

            <div className="space-y-3">
              {triageTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 rounded-xl bg-[#F7F7F4] border border-[#EEEEEB] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-[#20202B] bg-white px-2 py-0.5 rounded border border-[#EEEEEB]">
                        {ticket.trackingNumber}
                      </span>
                      <span className="font-semibold text-[#B71C1C] bg-[#FDE8E8] px-2 py-0.5 rounded border border-[#D32F2F]/20">
                        {ticket.priority} - {ticket.category}
                      </span>
                      {ticket.isOverdue && (
                        <span className="font-semibold text-[#B71C1C]">● Overdue</span>
                      )}
                    </div>
                    <h4 className="font-bold text-[#20202B] text-sm">{ticket.title}</h4>
                    <p className="text-[#85858D] text-xs">{ticket.location} • Requester: {ticket.requesterName}</p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => assignTicketToStaff(ticket.id, 'Suresh Verma', 'Lead Maintenance Engineer')}
                      className="px-3.5 py-2 bg-[#202033] hover:bg-[#12121E] text-white rounded-xl font-medium cursor-pointer transition text-xs"
                    >
                      Assign Suresh (Lead Tech)
                    </button>
                    <button
                      onClick={() => escalateTicketLevel(ticket.id)}
                      className="px-3.5 py-2 bg-[#FDE8E8] hover:bg-[#FCD8D8] text-[#B71C1C] border border-[#D32F2F]/30 rounded-xl font-medium cursor-pointer transition text-xs"
                    >
                      Escalate (L{ticket.escalationLevel + 1})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: Control Room Board (Kanban / State Machine) */}
      {activeOpsTab === 'control_room' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#20202B]">Control Room Ticketing Board</h3>
              <p className="text-xs text-[#85858D]">Live 6-stage ticket state machine: Submitted &rarr; Acknowledged &rarr; In Progress &rarr; Resolved &rarr; Reopened &rarr; Closed</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {(['Submitted', 'Acknowledged', 'In progress', 'Resolved', 'Reopened', 'Closed'] as TicketState[]).map((state) => {
              const stateTickets = tickets.filter(t => t.state === state);
              return (
                <div key={state} className="bg-white rounded-2xl p-4 border border-[#EEEEEB] space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#EEEEEB]">
                      <span className="text-xs font-bold text-[#20202B]">{state}</span>
                      <span className="text-xs font-mono font-bold bg-[#F7F7F4] text-[#20202B] px-2 py-0.5 rounded border border-[#EEEEEB]">
                        {stateTickets.length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {stateTickets.length === 0 ? (
                        <div className="py-6 text-center text-[11px] text-[#85858D] bg-[#F7F7F4] rounded-xl border border-dashed border-[#EEEEEB]">
                          No tickets
                        </div>
                      ) : (
                        stateTickets.map((t) => (
                          <div
                            key={t.id}
                            className="bg-[#F7F7F4] p-3 rounded-xl border border-[#EEEEEB] space-y-2 text-xs hover:border-[#20202B]/30 transition"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[11px] font-medium text-[#85858D]">{t.trackingNumber}</span>
                              <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                                t.priority === 'P1' ? 'bg-[#FDE8E8] text-[#B71C1C]' : 'bg-white text-[#20202B] border border-[#EEEEEB]'
                              }`}>
                                {t.priority}
                              </span>
                            </div>

                            <h5 className="font-bold text-[#20202B] line-clamp-2 leading-snug">{t.title}</h5>
                            <p className="text-[11px] text-[#85858D] truncate">{t.location}</p>

                            <div className="pt-2 border-t border-[#EEEEEB] flex items-center justify-between text-[11px]">
                              <span className="text-[#85858D]">Due: {new Date(t.dueResolveTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              
                              {state === 'Submitted' && (
                                <button
                                  onClick={() => updateTicketStatus(t.id, 'Acknowledged')}
                                  className="text-[#20202B] font-bold hover:underline cursor-pointer"
                                >
                                  Ack &rarr;
                                </button>
                              )}
                              {state === 'Acknowledged' && (
                                <button
                                  onClick={() => updateTicketStatus(t.id, 'In progress')}
                                  className="text-[#20202B] font-bold hover:underline cursor-pointer"
                                >
                                  Start &rarr;
                                </button>
                              )}
                              {state === 'In progress' && (
                                <button
                                  onClick={() => updateTicketStatus(t.id, 'Resolved')}
                                  className="text-[#1C6E3E] font-bold hover:underline cursor-pointer"
                                >
                                  Resolve &rarr;
                                </button>
                              )}
                              {state === 'Resolved' && (
                                <button
                                  onClick={() => updateTicketStatus(t.id, 'Closed')}
                                  className="text-[#1C6E3E] font-bold hover:underline cursor-pointer"
                                >
                                  Close &rarr;
                                </button>
                              )}
                              {state === 'Reopened' && (
                                <button
                                  onClick={() => updateTicketStatus(t.id, 'In progress')}
                                  className="text-[#B71C1C] font-bold hover:underline cursor-pointer"
                                >
                                  Resume &rarr;
                                </button>
                              )}
                              {state === 'Closed' && (
                                <button
                                  onClick={() => updateTicketStatus(t.id, 'Reopened')}
                                  className="text-[#85858D] font-bold hover:underline cursor-pointer"
                                >
                                  Reopen &rarr;
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: Mess Intelligence & Forecasting Models */}
      {activeOpsTab === 'mess_intelligence' && (
        <div className="space-y-6">
          {/* Theory / Equations Header - Deep charcoal navy #202033 card with soft lime #D7F36A accents */}
          <div className="bg-[#202033] text-white rounded-2xl p-6 border border-[#2B2B44] space-y-3">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-[#D7F36A]" />
              <h3 className="text-base font-bold text-white">Mess Demand Optimization Engine</h3>
            </div>
            <p className="text-xs text-[#8E8EA0] leading-relaxed max-w-4xl">
              Integrating <strong className="text-white">Exponential Smoothing</strong> (F<sub>t+1</sub> = &alpha; A<sub>t</sub> + (1 - &alpha;) F<sub>t</sub>) with the <strong className="text-white">Newsvendor Model</strong> for perishable food inventory: Critical Fractile CR = C<sub>u</sub> / (C<sub>u</sub> + C<sub>o</sub>). Balances emergency shortage cost (C<sub>u</sub> = &#8377;120) against overage waste cost (C<sub>o</sub> = &#8377;45). Real-time pre-booked student skips directly offset base forecast to prevent plate dumping.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs font-mono">
              <div className="bg-[#181827] p-3 rounded-xl border border-[#2B2B44]">
                <span className="text-[#8E8EA0] text-xs block font-sans">CRITICAL RATIO (CR)</span>
                <span className="text-lg font-bold text-[#D7F36A]">0.727 (72.7%)</span>
              </div>
              <div className="bg-[#181827] p-3 rounded-xl border border-[#2B2B44]">
                <span className="text-[#8E8EA0] text-xs block font-sans">SMOOTHING CONSTANT (&alpha;)</span>
                <span className="text-lg font-bold text-white">{simAlpha}</span>
              </div>
              <div className="bg-[#181827] p-3 rounded-xl border border-[#2B2B44]">
                <span className="text-[#8E8EA0] text-xs block font-sans">SAFETY BUFFER</span>
                <span className="text-lg font-bold text-[#D7F36A]">+{simBuffer}%</span>
              </div>
              <div className="bg-[#181827] p-3 rounded-xl border border-[#2B2B44]">
                <span className="text-[#8E8EA0] text-xs block font-sans">FOOD WASTE REDUCTION</span>
                <span className="text-lg font-bold text-[#D7F36A]">-75.4%</span>
              </div>
            </div>
          </div>

          {/* Interactive Parameters Simulator */}
          <div className="bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEB]">
              <div>
                <h4 className="text-sm font-bold text-[#20202B]">Interactive Model Tuner</h4>
                <p className="text-xs text-[#85858D]">Simulate changing smoothing weight &alpha; and safety stock buffer</p>
              </div>
              <button
                onClick={() => handleForecastParamChange(0.35, 10)}
                className="text-xs text-[#20202B] hover:underline font-semibold cursor-pointer"
              >
                Reset to Optimized Defaults
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-[#20202B] mb-1">
                  <span>Exponential Smoothing Constant (&alpha;): {simAlpha}</span>
                  <span className="text-[#85858D] font-normal">{simAlpha > 0.5 ? 'Responsive to recent spikes' : 'Smoother long-term trend'}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.05"
                  value={simAlpha}
                  onChange={(e) => handleForecastParamChange(parseFloat(e.target.value), simBuffer)}
                  className="w-full h-2 bg-[#EEEEEB] rounded-lg appearance-none cursor-pointer accent-[#202033]"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-[#20202B] mb-1">
                  <span>Newsvendor Safety Stock Buffer: +{simBuffer}%</span>
                  <span className="text-[#85858D] font-normal">Targeting Service Level: {(forecastParams.criticalRatio * 100).toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="1"
                  value={simBuffer}
                  onChange={(e) => handleForecastParamChange(simAlpha, parseInt(e.target.value))}
                  className="w-full h-2 bg-[#EEEEEB] rounded-lg appearance-none cursor-pointer accent-[#202033]"
                />
              </div>
            </div>
          </div>

          {/* Daily Kitchen Production Planning Sheet */}
          <div className="bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EEEEEB] gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <UtensilsCrossed className="w-4 h-4 text-[#20202B]" />
                  <h4 className="text-sm font-bold text-[#20202B]">Daily Kitchen Production Planning Sheet</h4>
                </div>
                <p className="text-xs text-[#85858D] mt-0.5">
                  Dynamic coupling: Real-time skip declarations offset time-series forecast to prevent plate dumping
                </p>
              </div>

              {/* Shift Selector */}
              <div className="flex flex-wrap items-center gap-1.5 bg-[#F7F7F4] p-1 rounded-xl border border-[#EEEEEB] text-xs font-medium self-start sm:self-auto">
                <span className="text-[#85858D] text-[11px] font-semibold px-2">Shift:</span>
                {mealSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedMealSlotId(slot.id)}
                    className={`px-3 py-1 rounded-lg transition font-medium cursor-pointer ${
                      selectedMealSlotId === slot.id
                        ? 'bg-[#202033] text-[#D7F36A] font-bold shadow-xs'
                        : 'text-[#5A5A66] hover:text-[#20202B] hover:bg-white'
                    }`}
                  >
                    {slot.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Top 5 Planning Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-4 rounded-xl bg-[#F7F7F4] border border-[#EEEEEB] space-y-1">
                <span className="text-[11px] text-[#85858D] font-medium">Enrolled Diners</span>
                <div className="text-2xl font-bold font-mono text-[#20202B]">{enrolledDiners}</div>
                <p className="text-[11px] text-[#85858D]">Hostel residents base</p>
              </div>

              <div className="p-4 rounded-xl bg-[#FEF7EA] border border-[#C27803]/30 space-y-1">
                <span className="text-[11px] text-[#9E5F00] font-medium">Declared Skips</span>
                <div className="text-2xl font-bold font-mono text-[#9E5F00]">-{declaredSkips}</div>
                <p className="text-[11px] text-[#9E5F00]">{selectedSlot.name} live skips</p>
              </div>

              <div className="p-4 rounded-xl bg-[#EAF6EE] border border-[#268A50]/30 space-y-1">
                <span className="text-[11px] text-[#1C6E3E] font-medium">Net Confirmed Demand</span>
                <div className="text-2xl font-bold font-mono text-[#1C6E3E]">{netConfirmedDemand}</div>
                <p className="text-[11px] text-[#1C6E3E]">{enrolledDiners} − {declaredSkips} diners</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F7F4] border border-[#EEEEEB] space-y-1">
                <span className="text-[11px] text-[#85858D] font-medium">Smoothed Base (F<sub>t+1</sub>)</span>
                <div className="text-2xl font-bold font-mono text-[#20202B]">{smoothedDemand}</div>
                <p className="text-[11px] text-[#85858D]">&alpha; = {simAlpha} (from {yesterdayActualServed} actuals)</p>
              </div>

              <div className="p-4 rounded-xl bg-[#202033] text-white border border-[#2B2B44] space-y-1 col-span-2 md:col-span-1">
                <span className="text-[11px] text-[#8E8EA0] font-medium">Planned Production Target</span>
                <div className="text-2xl font-bold font-mono text-[#D7F36A]">{plannedQuantity}</div>
                <p className="text-[11px] text-[#8E8EA0]">+{simBuffer}% safety stock buffer</p>
              </div>
            </div>

            {/* Two-Batch Release Strategy (75% / 25% Postponement Reserve) */}
            <div className="p-5 rounded-2xl bg-[#F7F7F4] border border-[#EEEEEB] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h5 className="text-xs font-bold text-[#20202B]">
                    Two-Batch Release Target Pipeline
                  </h5>
                  <p className="text-xs text-[#85858D]">
                    Postponement model eliminates over-cooking before actual headcounts materialize
                  </p>
                </div>
                <div className="text-xs font-mono text-[#5A5A66]">
                  Target Total: <strong>{plannedQuantity} Plates</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#EEEEEB] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#20202B]">Batch 1: Pre-Service Cooking Target (75%)</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#EAF6EE] text-[#1C6E3E]">
                      {batch1Target} Plates
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#F7F7F4] rounded-full overflow-hidden border border-[#EEEEEB]">
                    <div className="h-full bg-[#202033] rounded-full" style={{ width: '75%' }} />
                  </div>
                  <p className="text-xs text-[#5A5A66] leading-relaxed">
                    Commence preparation 1.5h before meal door opening. Provides complete coverage for initial queue arrivals without holding excess perishable dishes on warmers.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#EEEEEB] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#20202B]">Batch 2: Postponement Reserve (25%)</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#FEF7EA] text-[#9E5F00]">
                      {batch2Reserve} Plates
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#F7F7F4] rounded-full overflow-hidden border border-[#EEEEEB]">
                    <div className="h-full bg-[#D7F36A] rounded-full" style={{ width: '25%' }} />
                  </div>
                  <p className="text-xs text-[#5A5A66] leading-relaxed">
                    Held in raw prep stage in cold holding. Triggered for live finishing midway through service only if remaining diners count exceeds Batch 1 residual servings.
                  </p>
                </div>
              </div>
            </div>

            {/* 3-Tier Newsvendor Sizing */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[#20202B]">
                    3-Tier Newsvendor Dish Sizing & Critical Ratio Alignment
                  </h5>
                  <p className="text-xs text-[#85858D]">
                    Matches stockout risk against overage costs dish by dish for {selectedSlot.name} ({selectedSlot.timing})
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Core Tier */}
                <div className="bg-white p-4 rounded-xl border border-[#EEEEEB] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#20202B]">Core Tier (Staples)</span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#EAF6EE] text-[#1C6E3E]">
                      CR = 0.909
                    </span>
                  </div>
                  <div className="text-[11px] text-[#85858D] truncate">
                    {selectedSlot.items.slice(1, 4).join(', ') || 'Steamed Rice, Yellow Dal, Phulkas'}
                  </div>
                  <div className="p-2.5 bg-[#F7F7F4] rounded-lg border border-[#EEEEEB] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#5A5A66]">Production Target:</span>
                      <strong className="font-mono text-[#20202B]">{coreTierPortions} portions</strong>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#85858D]">
                      <span>Underage Cost (C<sub>u</sub>):</span>
                      <span>₹100 / plate</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#85858D]">
                      <span>Overage Cost (C<sub>o</sub>):</span>
                      <span>₹10 / plate</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#5A5A66] leading-snug">
                    Safety stock layer. Inexpensive to prepare in volume, high stockout penalty. Guaranteed plentiful supply for all attendees.
                  </p>
                </div>

                {/* Committed Premium Tier */}
                <div className="bg-white p-4 rounded-xl border border-[#EEEEEB] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#20202B]">Committed Premium Tier</span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#FEF7EA] text-[#9E5F00]">
                      CR = 0.727
                    </span>
                  </div>
                  <div className="text-[11px] text-[#85858D] truncate">
                    {selectedSlot.items[0]} (Specialty Course)
                  </div>
                  <div className="p-2.5 bg-[#F7F7F4] rounded-lg border border-[#EEEEEB] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#5A5A66]">Production Target:</span>
                      <strong className="font-mono text-[#20202B]">{committedPremiumPortions} portions</strong>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#85858D]">
                      <span>Underage Cost (C<sub>u</sub>):</span>
                      <span>₹120 / plate</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#85858D]">
                      <span>Overage Cost (C<sub>o</sub>):</span>
                      <span>₹45 / plate</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#5A5A66] leading-snug">
                    Sized strictly against verified non-skipped diners. High perishable ingredient cost makes over-production the primary driver of mess financial loss.
                  </p>
                </div>

                {/* Live Finishing Tier */}
                <div className="bg-white p-4 rounded-xl border border-[#EEEEEB] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#20202B]">Live Finishing Tier</span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#202033] text-[#D7F36A]">
                      Postponement
                    </span>
                  </div>
                  <div className="text-[11px] text-[#85858D]">
                    Live Tawa Roti, Finishing Counters, Fried Accompaniments
                  </div>
                  <div className="p-2.5 bg-[#F7F7F4] rounded-lg border border-[#EEEEEB] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#5A5A66]">Batch Size:</span>
                      <strong className="font-mono text-[#20202B]">25-portion micro-batches</strong>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#85858D]">
                      <span>Live Cook Target:</span>
                      <strong className="font-mono text-[#20202B]">{liveFinishingPortions} portions</strong>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#85858D]">
                      <span>Lead Time:</span>
                      <span>8-10 mins continuous</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#5A5A66] leading-snug">
                    Zero holding inventory. Chefs bake directly to current line queue depth, ensuring warm delivery and zero end-of-service surplus waste.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Forecast vs Actual Meal Attendance Table */}
          <div className="bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-4">
            <h4 className="text-sm font-bold text-[#20202B]">Past 7 Days Production, Actuals and Waste Log</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F7F7F4] text-[#5A5A66] font-semibold border-b border-[#EEEEEB]">
                  <tr>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">Meal Slot</th>
                    <th className="py-2.5 px-4 text-right">Prepared</th>
                    <th className="py-2.5 px-4 text-right">Actual Served</th>
                    <th className="py-2.5 px-4 text-right">Waste (kg)</th>
                    <th className="py-2.5 px-4 text-right">Loss (₹)</th>
                    <th className="py-2.5 px-4 text-right">Surplus %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEEEEB] text-[#20202B]">
                  {wasteRecords.map((w, idx) => (
                    <tr key={idx} className="hover:bg-[#F7F7F4]">
                      <td className="py-2.5 px-4 font-mono">{w.date}</td>
                      <td className="py-2.5 px-4">{w.meal}</td>
                      <td className="py-2.5 px-4 font-mono font-bold text-right">{w.mealsPrepared}</td>
                      <td className="py-2.5 px-4 font-mono text-right">{w.mealsServed}</td>
                      <td className="py-2.5 px-4 font-mono text-[#B71C1C] font-bold text-right">{w.wasteKg} kg</td>
                      <td className="py-2.5 px-4 font-mono text-right">₹{w.financialLossInr.toLocaleString()}</td>
                      <td className="py-2.5 px-4 font-mono text-right">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${w.surplusRate > 15 ? 'bg-[#FDE8E8] text-[#B71C1C]' : 'bg-[#EAF6EE] text-[#1C6E3E]'}`}>
                          {w.surplusRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: Hostel & Infrastructure */}
      {activeOpsTab === 'hostel' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EEEEEB] gap-3">
            <div>
              <h3 className="text-base font-bold text-[#20202B]">Hostel & Facilities Asset Oversight</h3>
              <p className="text-xs text-[#85858D]">Central substation grid telemetry, automated anomaly mitigation, and repeat failure RCA</p>
            </div>
            <span className="text-xs font-mono font-semibold text-[#20202B] bg-white px-3 py-1 rounded-xl border border-[#EEEEEB] self-start sm:self-auto">
              Facilities Sync: Live IoT Telemetry
            </span>
          </div>

          {/* Raw Substation IoT & Physical Plant Telemetry (Relocated from Campus Services) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#20202B]">Dhaula Kuan Campus Substation Microgrid Telemetry</h4>
                <p className="text-xs text-[#85858D]">
                  100,000 daily meter readings across 5 substations and solar rooftop microgrids
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-[#1C6E3E] bg-[#EAF6EE] px-2.5 py-0.5 rounded-lg border border-[#268A50]/30">
                SCADA Live
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#EEEEEB] space-y-1">
                <span className="text-xs text-[#85858D] font-medium">Real-Time Electricity Load</span>
                <div className="text-2xl font-bold text-[#20202B] font-mono">{utilityTelemetry.electricityKw} kW</div>
                <p className="text-[11px] text-[#85858D]">Peak study hours load</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#EEEEEB] space-y-1">
                <span className="text-xs text-[#85858D] font-medium">Solar Array Generation</span>
                <div className="text-2xl font-bold text-[#1C6E3E] font-mono">{utilityTelemetry.solarGenerationKw} kW</div>
                <p className="text-[11px] text-[#85858D]">Rooftop Solar Array Phase 1</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#EEEEEB] space-y-1">
                <span className="text-xs text-[#85858D] font-medium">Daily Water Draw</span>
                <div className="text-2xl font-bold text-[#20202B] font-mono">{utilityTelemetry.waterKiloLiters} kL</div>
                <p className="text-[11px] text-[#85858D]">Campus consumption today</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#EEEEEB] space-y-1">
                <span className="text-xs text-[#85858D] font-medium">Clean Energy Offset</span>
                <div className="text-2xl font-bold text-[#20202B] font-mono">18.9%</div>
                <p className="text-[11px] text-[#85858D]">2035 Target: 40% Clean Energy</p>
              </div>
            </div>

            {/* Substation Feeder Breakdown */}
            <div className="p-4 rounded-xl bg-[#F7F7F4] border border-[#EEEEEB] space-y-3">
              <span className="text-xs font-bold text-[#20202B] block">
                5-Substation Microgrid Load Distribution
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                {[
                  { name: 'SS-01 (Academic)', load: '142 kW', pf: '0.98 PF', status: 'Optimal' },
                  { name: 'SS-02 (Hostels A/B)', load: '168 kW', pf: '0.94 PF', status: 'High' },
                  { name: 'SS-03 (Dining Mess)', load: '86 kW', pf: '0.96 PF', status: 'Optimal' },
                  { name: 'SS-04 (Admin/IT)', load: '48 kW', pf: '0.99 PF', status: 'Optimal' },
                  { name: 'SS-05 (Faculty Enclave)', load: '36 kW', pf: '0.97 PF', status: 'Optimal' },
                ].map((ss) => (
                  <div key={ss.name} className="bg-white p-3 rounded-xl border border-[#EEEEEB] space-y-1">
                    <span className="font-bold text-[#20202B] block truncate">{ss.name}</span>
                    <span className="font-mono text-xs font-semibold text-[#20202B]">{ss.load}</span>
                    <div className="text-[11px] text-[#85858D]">{ss.pf} • {ss.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Repeat Failure Problem Records */}
          <div className="space-y-4 pt-2">
            <div>
              <h4 className="text-sm font-bold text-[#20202B]">Recurring Incident Problem Records</h4>
              <p className="text-xs text-[#85858D]">Root-cause documentation for repeat failure hotspots requiring RCA</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {problemRecords.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#20202B] bg-[#F7F7F4] px-2.5 py-1 rounded-md border border-[#EEEEEB]">
                      {p.problemNumber}
                    </span>
                    <span className="text-xs font-semibold text-[#B71C1C] bg-[#FDE8E8] px-2.5 py-0.5 rounded-full border border-[#D32F2F]/20">
                      {p.repeatOccurrences}x Recurring Incidents
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#20202B]">{p.assetOrLocation}</h4>
                  <div className="text-xs text-[#85858D] font-medium">Category: {p.category}</div>

                  <div className="p-3 bg-[#F7F7F4] rounded-xl border border-[#EEEEEB] text-xs space-y-1.5">
                    <div className="font-bold text-[#20202B]">Root Cause Analysis (RCA):</div>
                    <p className="text-[#5A5A66] leading-relaxed">{p.rootCauseAnalysis}</p>
                  </div>

                  <div className="p-3 bg-[#EAF6EE] rounded-xl border border-[#268A50]/30 text-xs space-y-1">
                    <div className="font-bold text-[#1C6E3E]">Engineering Remedy:</div>
                    <p className="text-[#1C6E3E]">{p.remedyAction}</p>
                  </div>

                  <div className="text-xs text-[#85858D] pt-1 flex justify-between">
                    <span>Status: <strong className="text-[#20202B]">Approved</strong></span>
                    <span>Last Audit: {new Date(p.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: Academic Operations */}
      {activeOpsTab === 'academic' && (
        <div className="bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#20202B]">Academic Operations & SLA Health</h3>
            <p className="text-xs text-[#85858D]">Grading turnarounds, syllabus publication rates, room clash prevention</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-5 bg-[#F7F7F4] rounded-xl border border-[#EEEEEB]">
              <span className="text-[#85858D] font-medium">Courses Active with Content:</span>
              <div className="text-2xl font-bold text-[#20202B] font-mono mt-1">100% (4/4)</div>
              <p className="text-xs text-[#85858D] mt-0.5">At least 1 item published in 14 days</p>
            </div>

            <div className="p-5 bg-[#F7F7F4] rounded-xl border border-[#EEEEEB]">
              <span className="text-[#85858D] font-medium">Overdue Assignment Grading:</span>
              <div className="text-2xl font-bold text-[#1C6E3E] font-mono mt-1">0 Overdue</div>
              <p className="text-xs text-[#85858D] mt-0.5">Median turnaround: 1.8 days</p>
            </div>

            <div className="p-5 bg-[#F7F7F4] rounded-xl border border-[#EEEEEB]">
              <span className="text-[#85858D] font-medium">Timetable Clashes Flagged:</span>
              <div className="text-2xl font-bold text-[#9E5F00] font-mono mt-1">1 Active</div>
              <p className="text-xs text-[#85858D] mt-0.5">SM-403 Monday lunch overlap handled</p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: 2035 KPI Scorecard */}
      {activeOpsTab === 'kpis' && (
        <div className="bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#EEEEEB] gap-2">
            <div>
              <h3 className="text-base font-bold text-[#20202B]">Smart Campus 2035 Master KPI Scorecard</h3>
              <p className="text-xs text-[#85858D]">
                Live empirical benchmark tracking against the October 2026 Primary Survey of 42 students & staff
              </p>
            </div>
            <button
              onClick={() => showToast('Exporting live KPI scorecard as verified PDF and CSV...', 'info')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#202033] hover:bg-[#12121E] text-white rounded-xl text-xs font-semibold cursor-pointer transition"
            >
              <Download className="w-3.5 h-3.5 text-[#D7F36A]" />
              <span>Export Audit CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F7F7F4] text-[#5A5A66] font-semibold border-b border-[#EEEEEB]">
                <tr>
                  <th className="py-3 px-4">Metric / Operational Focus</th>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4 text-center">2026 Survey Baseline</th>
                  <th className="py-3 px-4 text-center">Current Live Cockpit</th>
                  <th className="py-3 px-4 text-center">2035 Proposed Target</th>
                  <th className="py-3 px-4">Status & Action Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEEEB] text-[#20202B]">
                {kpis.map((kpi) => (
                  <tr key={kpi.id} className="hover:bg-[#F7F7F4]">
                    <td className="py-3 px-4 font-bold text-[#20202B]">{kpi.name}</td>
                    <td className="py-3 px-4 text-[#85858D]">{kpi.category}</td>
                    <td className="py-3 px-4 text-center font-mono font-medium text-[#5A5A66] bg-[#F7F7F4]">
                      {kpi.surveyBaseline2026}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-[#20202B] bg-[#D7F36A]/20">
                      {kpi.currentValue}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-[#1C6E3E] bg-[#EAF6EE]">
                      {kpi.target2035}
                    </td>
                    <td className="py-3 px-4 text-xs text-[#5A5A66] leading-snug">
                      <span className="inline-block px-1.5 py-0.5 rounded bg-[#EAF6EE] text-[#1C6E3E] font-bold text-xs mr-1.5">
                        {kpi.status.toUpperCase()}
                      </span>
                      {kpi.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: Immutable Security Audit Log */}
      {activeOpsTab === 'audit_log' && (
        <div className="bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEB]">
            <div>
              <h3 className="text-base font-bold text-[#20202B]">Immutable Security Audit Trail</h3>
              <p className="text-xs text-[#85858D]">
                Tamper-evident log of all authentication elevations, ticket escalations, and broadcasts
              </p>
            </div>
            <span className="text-xs font-mono bg-[#F7F7F4] px-3 py-1 rounded-xl text-[#20202B] font-semibold border border-[#EEEEEB]">
              Retention: 5 Years
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F7F7F4] text-[#5A5A66] font-semibold border-b border-[#EEEEEB]">
                <tr>
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-4">Actor</th>
                  <th className="py-2.5 px-4">Action Event</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Details</th>
                  <th className="py-2.5 px-4">IP & Device</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEEEB] text-[#20202B]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F7F7F4]">
                    <td className="py-2.5 px-4 font-mono text-xs text-[#85858D]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-[#20202B]">
                      {log.actorName} <span className="text-xs text-[#85858D] font-normal">({log.actorRole})</span>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[#20202B] font-bold">{log.action}</td>
                    <td className="py-2.5 px-4">
                      <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-[#F7F7F4] text-[#20202B] border border-[#EEEEEB]">
                        {log.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-[#5A5A66]">{log.details}</td>
                    <td className="py-2.5 px-4 text-xs font-mono text-[#85858D]">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
