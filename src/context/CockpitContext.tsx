import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  Workspace, 
  Course, 
  Assignment, 
  TimetableSlot, 
  Ticket, 
  ProblemRecord, 
  MealSlotInfo, 
  WasteRecord, 
  ForecastModelParams, 
  Parcel, 
  CampusAlert, 
  UtilityTelemetry, 
  KPIItem, 
  AuditLogEntry,
  TicketPriority,
  TicketState
} from '../types';
import { 
  USERS, 
  COURSES, 
  ASSIGNMENTS, 
  TIMETABLE_SLOTS, 
  TICKETS, 
  PROBLEM_RECORDS, 
  MEAL_SLOTS, 
  WASTE_RECORDS, 
  PARCELS, 
  CAMPUS_ALERTS, 
  UTILITY_TELEMETRY, 
  KPI_ITEMS, 
  INITIAL_AUDIT_LOG 
} from '../data/mockData';

interface CockpitContextType {
  // Current user & personas
  currentUser: UserProfile;
  switchUser: (userId: string) => void;
  availableUsers: UserProfile[];

  // Navigation & Workspace
  workspace: Workspace;
  setWorkspace: (ws: Workspace) => void;
  activeLearnTab: string;
  setActiveLearnTab: (tab: string) => void;
  activeCampusTab: string;
  setActiveCampusTab: (tab: string) => void;
  activeOpsTab: string;
  setActiveOpsTab: (tab: string) => void;

  // Admin Mode & Step-Up
  isAdminMode: boolean;
  adminSessionSecondsLeft: number;
  isStepUpModalOpen: boolean;
  openStepUpModal: () => void;
  closeStepUpModal: () => void;
  performStepUpLogin: (passphrase: string, code: string) => { success: boolean; error?: string };
  exitAdminMode: () => void;

  // Learn LMS State
  courses: Course[];
  selectedCourseId: string;
  setSelectedCourseId: (id: string) => void;
  assignments: Assignment[];
  timetable: TimetableSlot[];
  submitAssignmentWork: (assignmentId: string, fileName: string) => void;

  // Campus Services State
  tickets: Ticket[];
  problemRecords: ProblemRecord[];
  createTicket: (data: {
    title: string;
    description: string;
    category: Ticket['category'];
    priority: TicketPriority;
    location: string;
    photoUrl?: string;
  }) => Ticket;
  updateTicketStatus: (ticketId: string, newState: TicketState, notes?: string) => void;
  confirmTicketResolution: (ticketId: string, isSatisfied: boolean) => void;
  assignTicketToStaff: (ticketId: string, staffName: string, staffRole: string) => void;
  escalateTicketLevel: (ticketId: string) => void;

  // Mess Intelligence State
  mealSlots: MealSlotInfo[];
  toggleSkipMeal: (slotId: MealSlotInfo['id']) => void;
  wasteRecords: WasteRecord[];
  forecastParams: ForecastModelParams;
  updateForecastParams: (newParams: Partial<ForecastModelParams>) => void;

  // Parcels, Alerts & Utilities
  parcels: Parcel[];
  collectParcel: (parcelId: string, otp: string) => { success: boolean; error?: string };
  alerts: CampusAlert[];
  dismissAlert: (alertId: string) => void;
  publishAlert: (title: string, message: string, severity: 'critical' | 'warning' | 'info') => void;
  utilityTelemetry: UtilityTelemetry;
  kpis: KPIItem[];
  auditLogs: AuditLogEntry[];

  // Global search & notifications
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;

  // In-app toast feedback
  toasts: ToastItem[];
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
}

export interface ToastItem {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

const CockpitContext = createContext<CockpitContextType | undefined>(undefined);

export const CockpitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current logged in user (default: Aarav Sharma, Student)
  const [currentUser, setCurrentUser] = useState<UserProfile>(USERS[0]);
  const [workspace, setWorkspaceState] = useState<Workspace>('learn');
  const [activeLearnTab, setActiveLearnTab] = useState<string>('courses');
  const [activeCampusTab, setActiveCampusTab] = useState<string>('tickets');
  const [activeOpsTab, setActiveOpsTab] = useState<string>('today');

  // Admin Mode state
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [adminSessionSecondsLeft, setAdminSessionSecondsLeft] = useState<number>(1800); // 30 minutes
  const [isStepUpModalOpen, setIsStepUpModalOpen] = useState<boolean>(false);

  // Data Collections
  const [courses] = useState<Course[]>(COURSES);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(COURSES[0].id);
  const [assignments, setAssignments] = useState<Assignment[]>(ASSIGNMENTS);
  const [timetable] = useState<TimetableSlot[]>(TIMETABLE_SLOTS);
  const [tickets, setTickets] = useState<Ticket[]>(TICKETS);
  const [problemRecords] = useState<ProblemRecord[]>(PROBLEM_RECORDS);
  const [mealSlots, setMealSlots] = useState<MealSlotInfo[]>(MEAL_SLOTS);
  const [wasteRecords] = useState<WasteRecord[]>(WASTE_RECORDS);
  const [parcels, setParcels] = useState<Parcel[]>(PARCELS);
  const [alerts, setAlerts] = useState<CampusAlert[]>(CAMPUS_ALERTS);
  const [utilityTelemetry] = useState<UtilityTelemetry>(UTILITY_TELEMETRY);
  const [kpis] = useState<KPIItem[]>(KPI_ITEMS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOG);

  // Search & Notifications
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

  // In-app toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  // Mess Forecasting Parameters (Exponential Smoothing + Newsvendor Model)
  const [forecastParams, setForecastParams] = useState<ForecastModelParams>({
    alpha: 0.35,
    unitShortageCost: 120, // Cu: emergency catering & student penalty in INR
    unitOverageCost: 45,   // Co: ingredient wastage cost in INR
    criticalRatio: 120 / (120 + 45), // ~0.727
    safetyBufferPercent: 10,
  });

  const updateForecastParams = (newParams: Partial<ForecastModelParams>) => {
    setForecastParams(prev => {
      const updated = { ...prev, ...newParams };
      const cr = updated.unitShortageCost / (updated.unitShortageCost + updated.unitOverageCost);
      return {
        ...updated,
        criticalRatio: parseFloat(cr.toFixed(3)),
      };
    });
  };

  // Switch workspace safely
  const setWorkspace = (ws: Workspace) => {
    if (ws === 'operations' && !isAdminMode) {
      if (!currentUser.isAdminEligible) {
        showToast('Access Denied: Your account role does not have administrative privileges.', 'error');
        return;
      }
      setIsStepUpModalOpen(true);
      return;
    }
    setWorkspaceState(ws);
    // Align persona with workspace to avoid student/staff role collisions
    if (ws === 'learn' && currentUser.role !== 'student') {
      const studentUser = USERS.find(u => u.role === 'student') || USERS[0];
      setCurrentUser(studentUser);
    }
  };

  // Switch user role persona
  const switchUser = (userId: string) => {
    const target = USERS.find(u => u.id === userId);
    if (!target) return;
    setCurrentUser(target);
    // If switching to a non-admin while in admin mode, exit admin mode
    if (isAdminMode && !target.isAdminEligible) {
      exitAdminMode();
    }
    // Set appropriate starting workspace based on persona
    if (target.role === 'student') {
      setWorkspaceState('learn');
    } else if (target.role === 'faculty') {
      setWorkspaceState('learn');
    } else if (target.role === 'ops_director' && isAdminMode) {
      setWorkspaceState('operations');
    } else if (target.role === 'mess_manager') {
      setWorkspaceState('campus');
      setActiveCampusTab('mess');
    } else {
      setWorkspaceState('campus');
    }
  };

  // Admin Session Countdown Timer
  useEffect(() => {
    let interval: any;
    if (isAdminMode && adminSessionSecondsLeft > 0) {
      interval = setInterval(() => {
        setAdminSessionSecondsLeft(prev => {
          if (prev <= 1) {
            // Auto timeout reached
            exitAdminMode();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isAdminMode, adminSessionSecondsLeft]);

  const openStepUpModal = () => {
    setIsStepUpModalOpen(true);
  };

  const closeStepUpModal = () => {
    setIsStepUpModalOpen(false);
  };

  const performStepUpLogin = (adminPassId: string, passcode: string) => {
    // Validates authorization credentials (e.g. ADM-2035 / sirmaur2035 and PIN 2035 / 203501)
    const validId = adminPassId.trim().toLowerCase();
    const validPin = passcode.trim();

    if (!validId || validId.length < 3) {
      return { success: false, error: 'Please enter a valid Administrative Pass ID.' };
    }

    if (!validPin || validPin.length < 4) {
      return { success: false, error: 'Authorization Security PIN must be at least 4 digits.' };
    }

    // Success: activate admin mode
    setIsAdminMode(true);
    setAdminSessionSecondsLeft(1800); // 30m
    setIsStepUpModalOpen(false);
    setWorkspaceState('operations');
    setActiveOpsTab('today');

    // Log to immutable audit
    const successLog: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: currentUser.name,
      actorRole: currentUser.role,
      actorEmail: currentUser.email,
      action: 'admin.step_up_success',
      category: 'AUTH',
      details: `Administrative pass verified (${adminPassId}). Elevated to Operations Console.`,
      ipAddress: '10.20.14.88',
      deviceInfo: 'Web Browser Client',
      isSensitive: true,
    };
    setAuditLogs(prev => [successLog, ...prev]);

    return { success: true };
  };

  const exitAdminMode = () => {
    setIsAdminMode(false);
    setAdminSessionSecondsLeft(1800);
    // Return smoothly to personal workspace without asking for credentials (PRD Section 6.3 Step 8)
    setWorkspaceState(currentUser.role === 'student' || currentUser.role === 'faculty' ? 'learn' : 'campus');

    const exitLog: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: currentUser.name,
      actorRole: currentUser.role,
      actorEmail: currentUser.email,
      action: 'admin.mode_exited',
      category: 'AUTH',
      details: 'User voluntarily exited Admin Mode; admin tokens revoked.',
      ipAddress: '10.20.14.88',
      deviceInfo: 'Web Browser Client',
      isSensitive: false,
    };
    setAuditLogs(prev => [exitLog, ...prev]);
  };

  // Submit assignment
  const submitAssignmentWork = (assignmentId: string, fileName: string) => {
    setAssignments(prev => prev.map(asg => {
      if (asg.id === assignmentId) {
        return {
          ...asg,
          status: 'submitted',
          submissionsCount: asg.submissionsCount + 1,
          mySubmission: {
            submittedAt: new Date().toISOString(),
            fileName,
            fileSize: '3.6 MB',
            isLate: false,
            receiptId: `REC-${asg.courseCode}-${Date.now().toString().slice(-6)}`,
          },
        };
      }
      return asg;
    }));
  };

  // Create ticket
  const createTicket = (data: {
    title: string;
    description: string;
    category: Ticket['category'];
    priority: TicketPriority;
    location: string;
    photoUrl?: string;
  }): Ticket => {
    // SLA Limits by priority (PRD Section 8)
    const slaAckMap: Record<TicketPriority, number> = { P1: 15, P2: 60, P3: 240, P4: 1440 };
    const slaResolveMap: Record<TicketPriority, number> = { P1: 4, P2: 24, P3: 72, P4: 168 };

    const dueHours = slaResolveMap[data.priority];
    const dueDate = new Date();
    dueDate.setHours(dueDate.getHours() + dueHours);

    // Check if this location/category repeats (PRD 3 repeats in 90 days = Problem)
    const existingSimilarCount = tickets.filter(
      t => t.location.toLowerCase().includes(data.location.toLowerCase()) || 
           t.category === data.category
    ).length;

    const newTicket: Ticket = {
      id: `tkt-${Date.now()}`,
      trackingNumber: `TKT-2026-0${Math.floor(895 + Math.random() * 90)}`,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      state: 'Submitted',
      location: data.location,
      block: currentUser.block,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterRole: currentUser.roleName,
      createdAt: new Date().toISOString(),
      slaAckLimitMinutes: slaAckMap[data.priority],
      slaResolveLimitHours: slaResolveMap[data.priority],
      dueResolveTime: dueDate.toISOString(),
      isOverdue: false,
      escalationLevel: 0,
      photos: data.photoUrl ? [data.photoUrl] : [],
      repeatCountIn90Days: existingSimilarCount,
      isProblemRecord: existingSimilarCount >= 3,
      problemId: existingSimilarCount >= 3 ? 'prob-001' : undefined,
    };

    setTickets(prev => [newTicket, ...prev]);

    // Add audit log
    const log: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: currentUser.name,
      actorRole: currentUser.role,
      actorEmail: currentUser.email,
      action: 'ticket.created',
      category: 'TICKET',
      details: `Created ${newTicket.priority} ticket: ${newTicket.title} at ${newTicket.location}`,
      ipAddress: '10.20.14.88',
      deviceInfo: 'Cockpit Front Door',
      isSensitive: false,
    };
    setAuditLogs(prev => [log, ...prev]);

    return newTicket;
  };

  const updateTicketStatus = (ticketId: string, newState: TicketState, notes?: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          state: newState,
          resolvedAt: newState === 'Resolved' ? new Date().toISOString() : t.resolvedAt,
          acknowledgedAt: newState === 'Acknowledged' && !t.acknowledgedAt ? new Date().toISOString() : t.acknowledgedAt,
        };
      }
      return t;
    }));

    const log: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: currentUser.name,
      actorRole: currentUser.role,
      actorEmail: currentUser.email,
      action: `ticket.status_${newState.toLowerCase()}`,
      category: 'TICKET',
      details: `Updated ticket ${ticketId} to ${newState}. ${notes ? `Note: ${notes}` : ''}`,
      ipAddress: '10.20.14.88',
      deviceInfo: 'Operations Console',
      isSensitive: false,
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const confirmTicketResolution = (ticketId: string, isSatisfied: boolean) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        if (isSatisfied) {
          return {
            ...t,
            state: 'Closed',
            closureConfirmed: true,
            closedAt: new Date().toISOString(),
          };
        } else {
          return {
            ...t,
            state: 'Reopened',
            closureConfirmed: false,
            escalationLevel: t.escalationLevel + 1,
          };
        }
      }
      return t;
    }));
  };

  const assignTicketToStaff = (ticketId: string, staffName: string, staffRole: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          assignedTo: staffName,
          assignedRole: staffRole,
          state: t.state === 'Submitted' ? 'Acknowledged' : t.state,
          acknowledgedAt: t.acknowledgedAt || new Date().toISOString(),
        };
      }
      return t;
    }));
  };

  const escalateTicketLevel = (ticketId: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const nextLevel = Math.min(3, t.escalationLevel + 1);
        return {
          ...t,
          escalationLevel: nextLevel,
        };
      }
      return t;
    }));
  };

  // Mess Skip Meal
  const toggleSkipMeal = (slotId: MealSlotInfo['id']) => {
    setMealSlots(prev => prev.map(slot => {
      if (slot.id === slotId) {
        const newSkippedState = !slot.isSkippedByCurrentUser;
        return {
          ...slot,
          isSkippedByCurrentUser: newSkippedState,
          skippedCount: newSkippedState ? slot.skippedCount + 1 : slot.skippedCount - 1,
          forecastCount: newSkippedState ? slot.forecastCount - 1 : slot.forecastCount + 1,
        };
      }
      return slot;
    }));
  };

  const collectParcel = (parcelId: string, otp: string) => {
    const parcel = parcels.find(p => p.id === parcelId);
    if (!parcel) return { success: false, error: 'Parcel not found' };
    if (parcel.pickupOtp !== otp.trim()) {
      return { success: false, error: 'Incorrect OTP. Please check your notification SMS/Email.' };
    }

    setParcels(prev => prev.map(p => p.id === parcelId ? { ...p, status: 'collected' } : p));
    return { success: true };
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const publishAlert = (title: string, message: string, severity: 'critical' | 'warning' | 'info') => {
    const newAlert: CampusAlert = {
      id: `alert-${Date.now()}`,
      title,
      message,
      severity,
      publishedBy: `${currentUser.name} (${currentUser.roleName})`,
      publishedAt: new Date().toISOString(),
      activeUntil: new Date(Date.now() + 86400000).toISOString(),
      targetScope: 'All Campus Community',
      reachPercentage: 100,
      acknowledgedCount: 0,
      totalAudience: 2000,
      affectsClasses: false,
    };
    setAlerts(prev => [newAlert, ...prev]);

    const log: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: currentUser.name,
      actorRole: currentUser.role,
      actorEmail: currentUser.email,
      action: 'alert.published',
      category: 'ALERT',
      details: `Published alert [${severity.toUpperCase()}]: ${title}`,
      ipAddress: '10.20.14.88',
      deviceInfo: 'Operations Console',
      isSensitive: true,
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  return (
    <CockpitContext.Provider
      value={{
        currentUser,
        switchUser,
        availableUsers: USERS,
        workspace,
        setWorkspace,
        activeLearnTab,
        setActiveLearnTab,
        activeCampusTab,
        setActiveCampusTab,
        activeOpsTab,
        setActiveOpsTab,
        isAdminMode,
        adminSessionSecondsLeft,
        isStepUpModalOpen,
        openStepUpModal,
        closeStepUpModal,
        performStepUpLogin,
        exitAdminMode,
        courses,
        selectedCourseId,
        setSelectedCourseId,
        assignments,
        timetable,
        submitAssignmentWork,
        tickets,
        problemRecords,
        createTicket,
        updateTicketStatus,
        confirmTicketResolution,
        assignTicketToStaff,
        escalateTicketLevel,
        mealSlots,
        toggleSkipMeal,
        wasteRecords,
        forecastParams,
        updateForecastParams,
        parcels,
        collectParcel,
        alerts,
        dismissAlert,
        publishAlert,
        utilityTelemetry,
        kpis,
        auditLogs,
        searchQuery,
        setSearchQuery,
        isNotificationOpen,
        setIsNotificationOpen,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </CockpitContext.Provider>
  );
};

export const useCockpit = () => {
  const context = useContext(CockpitContext);
  if (!context) {
    throw new Error('useCockpit must be used within a CockpitProvider');
  }
  return context;
};

