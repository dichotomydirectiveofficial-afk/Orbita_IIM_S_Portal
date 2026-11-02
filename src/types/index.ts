export type UserRole = 
  | 'student'          // R1: Aarav Sharma (Resident BBA)
  | 'faculty'          // R2: Prof. Meenakshi Sundaram
  | 'mess_manager'     // R3: Rajesh Negi
  | 'hostel_warden'    // R4: Vikramaditya Chauhan (Block B)
  | 'technician'       // R5: Suresh Verma
  | 'service_desk'     // R6: Pooja Bhatt
  | 'parcel_security'  // R7: Om Prakash
  | 'ops_director'     // R8: Kavita Joshi
  | 'sysadmin'         // R9: Ankit Singhal
  | 'academic_office'; // R10: Dr. Harpreet Kaur

export type Workspace = 'learn' | 'campus' | 'operations';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  studentId?: string;
  staffId?: string;
  role: UserRole;
  roleName: string;
  department: string;
  roomOrOffice: string;
  block: 'Block A' | 'Block B' | 'Faculty Enclave' | 'Academic Complex' | 'Admin Block';
  avatar: string;
  isAdminEligible: boolean;
  adminScope?: string;
}

// Learn LMS Models
export interface Course {
  id: string;
  code: string;
  title: string;
  category: 'Operations' | 'Analytics' | 'Strategy' | 'Finance' | 'Marketing';
  instructor: string;
  instructorAvatar: string;
  instructorEmail: string;
  term: string;
  credits: number;
  enrolledStudentsCount: number;
  coverImage: string;
  progressPercent: number;
  totalLessons: number;
  completedLessons: number;
  duration: string;
  status: 'active' | 'draft' | 'archived';
  description: string;
  weeklyModules: CourseModule[];
}

export interface CourseModule {
  id: string;
  week: number;
  title: string;
  description: string;
  items: ModuleItem[];
}

export interface ModuleItem {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'reading' | 'link';
  durationOrPages: string;
  fileSize?: string;
  isCompleted: boolean;
  url?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  instructions: string;
  dueDate: string;
  totalMarks: number;
  weightagePercent: number;
  attachmentName?: string;
  submissionsCount: number;
  totalEnrolled: number;
  status: 'pending' | 'submitted' | 'graded';
  mySubmission?: {
    submittedAt: string;
    fileName: string;
    fileSize: string;
    isLate: boolean;
    marksObtained?: number;
    feedback?: string;
    receiptId: string;
  };
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  time: string;
  courseCode: string;
  courseName: string;
  room: string;
  block: string;
  instructor: string;
  hasClash?: boolean;
}

// Campus Workspace Models
export type TicketPriority = 'P1' | 'P2' | 'P3' | 'P4';
export type TicketState = 
  | 'Submitted' 
  | 'Acknowledged' 
  | 'In progress' 
  | 'On hold' 
  | 'Resolved' 
  | 'Closed' 
  | 'Reopened'
  | 'Auto-closed' 
  | 'Cancelled' 
  | 'Merged';

export interface Ticket {
  id: string;
  trackingNumber: string;
  title: string;
  description: string;
  category: 'Plumbing' | 'Electrical' | 'HVAC / Fan' | 'Furniture' | 'Network' | 'Mess / Food' | 'Housekeeping';
  priority: TicketPriority;
  state: TicketState;
  location: string;
  block: string;
  requesterId: string;
  requesterName: string;
  requesterRole: string;
  assignedTo?: string;
  assignedRole?: string;
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  slaAckLimitMinutes: number;
  slaResolveLimitHours: number;
  dueResolveTime: string;
  isOverdue: boolean;
  escalationLevel: number; // 0: L0, 1: L1, 2: L2, 3: L3
  closureConfirmed?: boolean;
  autoCloseNoticeSent?: boolean;
  photos: string[];
  repeatCountIn90Days: number;
  isProblemRecord: boolean;
  problemId?: string;
}

export interface ProblemRecord {
  id: string;
  problemNumber: string;
  assetOrLocation: string;
  category: string;
  repeatOccurrences: number;
  rootCauseAnalysis: string;
  remedyAction: string;
  status: 'investigating' | 'action_plan_approved' | 'resolved';
  updatedAt: string;
}

export interface MealSlotInfo {
  id: 'breakfast' | 'lunch' | 'snacks' | 'dinner';
  name: string;
  timing: string;
  items: string[];
  calories: number;
  allergens: string[];
  isSpecialMenu?: boolean;
  preBookedCount: number;
  skippedCount: number;
  forecastCount: number;
  actualServedCount?: number;
  isSkippedByCurrentUser: boolean;
  hasTimetableClash?: boolean;
}

export interface WasteRecord {
  date: string;
  meal: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
  wasteKg: number;
  financialLossInr: number;
  mealsPrepared: number;
  mealsServed: number;
  surplusRate: number; // percentage
}

export interface ForecastModelParams {
  alpha: number; // exponential smoothing factor
  unitShortageCost: number; // Cu
  unitOverageCost: number; // Co
  criticalRatio: number; // CR = Cu / (Cu + Co)
  safetyBufferPercent: number;
}

export interface Parcel {
  id: string;
  trackingCode: string;
  courier: string;
  recipientName: string;
  recipientEmail: string;
  recipientRoom: string;
  receivedAt: string;
  pickupOtp: string;
  status: 'ready_for_pickup' | 'collected' | 'unclaimed_7d';
  storageLocker: string;
}

export interface CampusAlert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  publishedBy: string;
  publishedAt: string;
  activeUntil: string;
  targetScope: string;
  reachPercentage: number;
  acknowledgedCount: number;
  totalAudience: number;
  affectsClasses: boolean;
}

export interface UtilityTelemetry {
  timestamp: string;
  electricityKw: number;
  waterKiloLiters: number;
  solarGenerationKw: number;
  gridDemandKw: number;
  anomalyDetected: boolean;
  anomalyMessage?: string;
}

export interface KPIItem {
  id: string;
  name: string;
  category: 'Maintenance' | 'Mess Operations' | 'Academic' | 'Services';
  surveyBaseline2026: string;
  baselineNum: number;
  currentValue: string;
  currentNum: number;
  target2035: string;
  targetNum: number;
  unit: string;
  trend: 'improving' | 'stable' | 'attention';
  status: 'met' | 'on_track' | 'lagging';
  notes: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  actorEmail: string;
  action: string;
  category: 'AUTH' | 'TICKET' | 'MESS' | 'ALERT' | 'ACADEMIC' | 'SYSTEM';
  details: string;
  ipAddress: string;
  deviceInfo: string;
  isSensitive: boolean;
}
