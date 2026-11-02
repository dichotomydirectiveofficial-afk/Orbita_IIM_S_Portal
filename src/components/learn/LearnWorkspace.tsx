import React, { useState } from 'react';
import { useCockpit } from '../../context/CockpitContext';
import { Course, Assignment, TimetableSlot } from '../../types';
import { STUDENT_ANALYTICS } from '../../data/mockData';
import { StudentIdBadgeCard } from '../common/StudentIdBadgeCard';
import { 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  AlertTriangle, 
  ChevronLeft,
  Calendar as CalendarIcon,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  FileText,
  PlayCircle,
  Upload,
  Award,
  ChevronDown,
  ChevronUp,
  Check,
  Wrench,
  Target,
  ShieldCheck,
  Activity,
  Sparkles,
  Download,
  GraduationCap,
  Flame,
  Layers,
  Compass,
  BarChart2
} from 'lucide-react';

interface LearnWorkspaceProps {
  onOpenReportTicket: (prefilledLoc?: string) => void;
}

export const LearnWorkspace: React.FC<LearnWorkspaceProps> = ({ onOpenReportTicket }) => {
  const { 
    courses, 
    assignments, 
    timetable, 
    activeLearnTab, 
    setActiveLearnTab,
    searchQuery,
    currentUser,
    alerts,
    submitAssignmentWork,
    showToast
  } = useCockpit();

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeVideoTitle, setActiveVideoTitle] = useState<string | null>(null);
  const [courseCategoryFilter, setCourseCategoryFilter] = useState<string>('all');
  
  // Interactive filters for Assignments and Timetable
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [timetableDayFilter, setTimetableDayFilter] = useState<string>('All');
  
  // Target GPA simulator state for Learning Analytics
  const [simulatedGpaGoal, setSimulatedGpaGoal] = useState<number>(3.85);

  // Inline Assignment Submission State (replaces floating SubmitAssignmentModal)
  const [expandedAssignmentId, setExpandedAssignmentId] = useState<string | null>(null);
  const [submissionFileNames, setSubmissionFileNames] = useState<Record<string, string>>({});
  const [submittedStatusMap, setSubmittedStatusMap] = useState<Record<string, boolean>>({});

  // Inline Timetable Issue Reporting State
  const [reportedRoomSlot, setReportedRoomSlot] = useState<string | null>(null);
  
  // Interactive mini-calendar state
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date(2026, 10, 3)); // Nov 3, 2026

  // Dynamic dining clash detection comparing lecture hours with Lunch service (12:30 - 14:00)
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

  const filteredCourses = courses.filter((c) => {
    const matchesCategory = courseCategoryFilter === 'all' || c.category.toLowerCase() === courseCategoryFilter.toLowerCase();
    if (!matchesCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchCode = c.code.toLowerCase().includes(q);
      const matchInst = c.instructor.toLowerCase().includes(q);
      const matchCat = c.category.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      if (!matchTitle && !matchCode && !matchInst && !matchCat && !matchDesc) return false;
    }
    return true;
  });

  const filteredAssignments = assignments.filter((a) => {
    if (assignmentFilter === 'pending') return a.status === 'pending';
    if (assignmentFilter === 'submitted') return a.status === 'submitted';
    if (assignmentFilter === 'graded') return a.status === 'graded';
    return true;
  });

  const filteredTimetable = timetable.filter((slot) => {
    if (timetableDayFilter !== 'All' && slot.day !== timetableDayFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchCourse = slot.courseName.toLowerCase().includes(q);
      const matchCode = slot.courseCode.toLowerCase().includes(q);
      const matchRoom = slot.room.toLowerCase().includes(q);
      const matchInst = slot.instructor.toLowerCase().includes(q);
      const matchDay = slot.day.toLowerCase().includes(q);
      if (!matchCourse && !matchCode && !matchRoom && !matchInst && !matchDay) return false;
    }
    return true;
  });

  // Calendar days generation
  const daysInMonth = 30; // November
  const firstDayOffset = 6; // starts on Sunday (index 6 in Mon-based week)
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleInlineSubmitAssignment = (asgId: string, e: React.FormEvent) => {
    e.preventDefault();
    const fileName = submissionFileNames[asgId] || 'IIM_Sirmaur_Course_Deliverable.pdf';
    submitAssignmentWork(asgId, fileName);
    setSubmittedStatusMap(prev => ({ ...prev, [asgId]: true }));
    setTimeout(() => {
      setSubmittedStatusMap(prev => ({ ...prev, [asgId]: false }));
    }, 3000);
  };

  const handleReportRoomQuick = (slotId: string) => {
    setReportedRoomSlot(slotId);
    setTimeout(() => setReportedRoomSlot(null), 3000);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      {/* ========================================================================= */}
      {/* SUB-WINDOW 1: OVERVIEW DASHBOARD COMPOSITION (Eduplex-inspired)          */}
      {/* ========================================================================= */}
      {activeLearnTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
          
          {/* COLUMN 1: PRIMARY / LEFT COLUMN */}
          <div className="space-y-6 flex flex-col">
            
            {/* Tactile All-Access Student ID Badge & Front-Facing LMS Telemetry */}
            <StudentIdBadgeCard onOpenReportTicket={onOpenReportTicket} />

            {/* Learning Activity Chart (Eduplex dark navy + lime style) */}
            <div className="bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-4">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h3 className="text-sm font-bold text-[#20202B]">Learning Activity</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-2xl font-bold text-[#20202B] font-mono">35h</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EAF6EE] text-[#1C6E3E] flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +9.3%
                    </span>
                    <span className="text-xs text-[#85858D]">vs last week</span>
                  </div>
                </div>
                <span className="text-xs font-medium text-[#85858D] bg-[#F7F7F4] px-2.5 py-1 rounded-lg border border-[#EEEEEB]">
                  This Week
                </span>
              </div>

              {/* Understated Bar Chart */}
              <div className="pt-4 pb-2">
                <div className="h-44 flex items-end justify-between gap-3 border-b border-[#EEEEEB] pb-2">
                  {[
                    { day: 'Mon', hours: 4.5, pct: 52, isPeak: false },
                    { day: 'Tue', hours: 6.2, pct: 72, isPeak: false },
                    { day: 'Wed', hours: 7.8, pct: 90, isPeak: false },
                    { day: 'Thu', hours: 5.4, pct: 62, isPeak: false },
                    { day: 'Fri', hours: 8.5, pct: 100, isPeak: true },
                    { day: 'Sat', hours: 3.2, pct: 38, isPeak: false },
                    { day: 'Sun', hours: 2.1, pct: 25, isPeak: false },
                  ].map((bar) => (
                    <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 group">
                      <span className="text-[11px] font-mono text-[#85858D] group-hover:text-[#20202B]">
                        {bar.hours}h
                      </span>
                      <div className="w-full bg-[#F7F7F4] rounded-t-lg h-32 flex items-end overflow-hidden">
                        <div
                          className={`w-full rounded-t-lg transition-all duration-300 ${
                            bar.isPeak ? 'bg-[#D7F36A]' : 'bg-[#202033]'
                          }`}
                          style={{ height: `${bar.pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-[#85858D]">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Courses Overview List (Navigates directly to Courses tab inline) */}
            <div className="bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#20202B]">Enrolled Courses</h3>
                  <p className="text-xs text-[#85858D]">Active term curriculum</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCourse(null);
                    setActiveLearnTab('courses');
                  }}
                  className="text-xs font-semibold text-[#20202B] hover:underline flex items-center cursor-pointer"
                >
                  View All ({courses.length})
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>

              <div className="space-y-3">
                {courses.slice(0, 4).map((course) => (
                  <div
                    key={course.id}
                    onClick={() => {
                      setSelectedCourse(course);
                      setActiveLearnTab('courses');
                    }}
                    className="p-3.5 rounded-xl border border-[#EEEEEB] hover:border-[#20202B]/30 hover:bg-[#F7F7F4]/50 transition cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-[#F7F7F4] overflow-hidden shrink-0 border border-[#EEEEEB]">
                        <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] font-mono font-bold text-[#20202B]">
                            {course.code}
                          </span>
                          <span className="text-[11px] text-[#85858D]">• {course.category}</span>
                        </div>
                        <h4 className="text-xs font-bold text-[#20202B] truncate">{course.title}</h4>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          <img src={course.instructorAvatar} alt={course.instructor} className="w-4 h-4 rounded-full object-cover" />
                          <span className="text-[11px] text-[#85858D] truncate">{course.instructor}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-bold text-[#20202B]">{course.progressPercent}%</div>
                      <div className="w-16 h-1.5 bg-[#EEEEEB] rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-[#202033] rounded-full" style={{ width: `${course.progressPercent}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* COLUMN 2: MIDDLE COLUMN */}
          <div className="space-y-6 flex flex-col">

            {/* Academic Performance Overview */}
            <div className="bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#20202B]">Academic Performance</h3>
                  <p className="text-xs text-[#85858D]">Quarterly evaluated metric breakdown</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#D7F36A] text-[#20202B]">
                  Top 15%
                </span>
              </div>

              <div className="space-y-4 pt-2">
                <MetricBar label="Lecture Participation" percentage={92} />
                <MetricBar label="Continuous Assessment" percentage={86} />
                <MetricBar label="Term Projects & Mid-Exams" percentage={84} />
              </div>

              <div className="mt-4 p-4 rounded-xl bg-[#F7F7F4] border border-[#EEEEEB] text-xs">
                <p className="text-[#5A5A66] italic leading-relaxed">
                  "Great consistency and strong engagement throughout the learning journey. Exceptional aptitude shown in Project 4 Smart Campus operations and quantitative demand forecasting models."
                </p>
              </div>
            </div>

            {/* Upcoming Lectures & Schedule */}
            <div className="bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#20202B]">Upcoming Lectures & Schedule</h3>
                  <p className="text-xs text-[#85858D]">Weekly timetable and room routing</p>
                </div>
                <button
                  onClick={() => setActiveLearnTab('timetable')}
                  className="text-xs font-semibold text-[#20202B] hover:underline cursor-pointer"
                >
                  Full View
                </button>
              </div>

              <div className="space-y-3">
                {timetable.slice(0, 4).map((slot) => (
                  <div
                    key={slot.id}
                    className="p-3.5 rounded-xl border border-[#EEEEEB] hover:bg-[#F7F7F4]/40 transition space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs font-medium text-[#85858D]">
                      <span>{slot.day}</span>
                      <span className="font-mono font-bold text-[#20202B] bg-[#F7F7F4] px-2 py-0.5 rounded border border-[#EEEEEB]">
                        {slot.time}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-[#20202B]">{slot.courseName}</h4>
                    
                    <div className="flex items-center justify-between text-[11px] text-[#85858D] pt-1">
                      <span>{slot.courseCode} • {slot.instructor}</span>
                      <span className="font-medium text-[#20202B] flex items-center">
                        <MapPin className="w-3 h-3 mr-0.5 text-[#85858D]" />
                        {slot.room.split(',')[1] || slot.room}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evaluated Work & Faculty Feedback (Balances Column 2 height perfectly) */}
            <div className="bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#20202B]">Evaluated Submissions & Feedback</h3>
                  <p className="text-xs text-[#85858D]">Graded deliverables & faculty remarks</p>
                </div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#EAF6EE] text-[#1C6E3E]">
                  {assignments.filter(a => a.status === 'graded').length} Graded
                </span>
              </div>

              <div className="space-y-3">
                {assignments
                  .filter((a) => a.status === 'graded' && a.mySubmission?.marksObtained !== undefined)
                  .slice(0, 2)
                  .map((asg) => (
                    <div key={asg.id} className="p-3.5 rounded-xl border border-[#EEEEEB] bg-[#F7F7F4]/40 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[#20202B] bg-white px-2 py-0.5 rounded border border-[#EEEEEB]">
                          {asg.courseCode}
                        </span>
                        <div className="flex items-center space-x-1 font-mono font-bold text-[#1C6E3E]">
                          <Award className="w-3.5 h-3.5" />
                          <span>{asg.mySubmission?.marksObtained}</span>
                          <span className="text-[#85858D] font-normal">/ {asg.totalMarks}</span>
                        </div>
                      </div>
                      <h4 className="font-bold text-[#20202B] leading-snug line-clamp-1">{asg.title}</h4>
                      {asg.mySubmission?.feedback && (
                        <p className="text-[11px] text-[#5A5A66] italic bg-white p-2.5 rounded-lg border border-[#EEEEEB] leading-relaxed">
                          "{asg.mySubmission.feedback}"
                        </p>
                      )}
                    </div>
                  ))}
              </div>

              <button
                onClick={() => {
                  setAssignmentFilter('graded');
                  setActiveLearnTab('assignments');
                }}
                className="w-full py-2 bg-[#F7F7F4] hover:bg-[#EEEEEB] text-xs font-semibold text-[#20202B] rounded-xl transition cursor-pointer text-center"
              >
                View All Graded Submissions
              </button>
            </div>

          </div>

          {/* COLUMN 3: RIGHT COLUMN */}
          <div className="space-y-6 flex flex-col lg:col-span-2 xl:col-span-1">

            {/* Compact Academic Calendar */}
            <div className="bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#20202B]">November 2026</h3>
                <div className="flex items-center space-x-1 text-[#85858D]">
                  <button className="p-1 hover:text-[#20202B] rounded transition cursor-pointer">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:text-[#20202B] rounded transition cursor-pointer">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-[#85858D]">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
              </div>

              {/* Day numbers */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {Array.from({ length: firstDayOffset }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2" />
                ))}
                {calendarDays.map((d) => {
                  const isToday = d === 3;
                  return (
                    <button
                      key={d}
                      onClick={() => setCurrentCalendarDate(new Date(2026, 10, d))}
                      className={`p-2 rounded-xl text-xs font-medium transition cursor-pointer flex items-center justify-center ${
                        isToday
                          ? 'bg-[#202033] text-white font-bold'
                          : 'text-[#20202B] hover:bg-[#F7F7F4]'
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Assignments (Direct inline flow to Assignments tab) */}
            <div className="bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#20202B]">Assignments</h3>
                  <p className="text-xs text-[#85858D]">Deadlines & submissions</p>
                </div>
                <span className="text-xs font-mono font-medium text-[#85858D]">
                  {assignments.length} Total
                </span>
              </div>

              <div className="space-y-3">
                {assignments.slice(0, 4).map((asg) => (
                  <div
                    key={asg.id}
                    className="p-3.5 rounded-xl border border-[#EEEEEB] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#20202B] bg-[#F7F7F4] px-2 py-0.5 rounded border border-[#EEEEEB]">
                        {asg.courseCode}
                      </span>
                      {asg.status === 'submitted' || asg.status === 'graded' ? (
                        <span className="text-[11px] font-semibold text-[#1C6E3E] bg-[#EAF6EE] px-2 py-0.5 rounded flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {asg.status === 'graded' ? 'Graded' : 'Submitted'}
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-[#9E5F00] bg-[#FEF7EA] px-2 py-0.5 rounded flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending Due
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-[#20202B] leading-snug">{asg.title}</h4>

                    <div className="text-[11px] text-[#85858D] flex justify-between">
                      <span>Max Marks: {asg.totalMarks}</span>
                      <span>Weightage: {asg.weightagePercent}%</span>
                    </div>

                    <div className="pt-2 border-t border-[#EEEEEB] flex items-center justify-between">
                      <span className="text-[11px] text-[#85858D]">
                        Due: {new Date(asg.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                      <button
                        onClick={() => {
                          setExpandedAssignmentId(asg.id);
                          setActiveLearnTab('assignments');
                        }}
                        className="px-3 py-1 bg-[#202033] hover:bg-[#12121E] text-white rounded-lg text-xs font-medium cursor-pointer transition"
                      >
                        {asg.status === 'graded' ? 'View Grade' : asg.status === 'submitted' ? 'View Work' : 'Submit'}
                      </button>
                    </div>
                  </div>
                ))}

                {assignments.length > 4 && (
                  <button
                    onClick={() => setActiveLearnTab('assignments')}
                    className="w-full py-2 bg-[#F7F7F4] hover:bg-[#EEEEEB] text-xs font-semibold text-[#20202B] rounded-xl transition cursor-pointer text-center"
                  >
                    View All {assignments.length} Deliverables
                  </button>
                )}
              </div>
            </div>

            {/* Campus Bulletin */}
            {alerts.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-[#EEEEEB] space-y-2 text-xs">
                <div className="flex items-center space-x-1.5 text-[#20202B] font-bold">
                  <AlertTriangle className="w-4 h-4 text-[#C27803]" />
                  <span>Campus Bulletin</span>
                </div>
                <h5 className="font-semibold text-[#20202B]">{alerts[0].title}</h5>
                <p className="text-[#5A5A66] leading-relaxed text-[11px]">{alerts[0].message}</p>
                <div className="pt-1 text-xs text-[#85858D]">
                  Updated by {alerts[0].publishedBy}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-WINDOW 2: COURSES & CONTENT (Inline Curriculum & Player)             */}
      {/* ========================================================================= */}
      {activeLearnTab === 'courses' && (
        <div className="space-y-6">
          {selectedCourse ? (
            /* Dedicated INLINE Course Curriculum & Lecture Stream (No Modal) */
            <div className="bg-white rounded-2xl border border-[#EEEEEB] overflow-hidden space-y-6">
              {/* Course Top Banner */}
              <div className="relative h-52 bg-[#202033] overflow-hidden">
                <img
                  src={selectedCourse.coverImage}
                  alt={selectedCourse.title}
                  className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#202033] via-[#202033]/60 to-transparent" />
                
                <div className="absolute top-5 left-6 right-6 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedCourse(null);
                      setActiveVideoTitle(null);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-xs flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to All Courses</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#D7F36A] text-[#20202B]">
                      {selectedCourse.code}
                    </span>
                    <span className="text-xs text-[#E2E2EA] font-medium bg-white/10 px-2.5 py-1 rounded">
                      {selectedCourse.category} • {selectedCourse.credits} Credits
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-5 left-6 right-6">
                  <h2 className="text-2xl font-bold text-white leading-snug">
                    {selectedCourse.title}
                  </h2>
                  <div className="flex items-center space-x-2 mt-2">
                    <img
                      src={selectedCourse.instructorAvatar}
                      alt={selectedCourse.instructor}
                      className="w-6 h-6 rounded-full object-cover border border-white/40"
                    />
                    <span className="text-xs text-[#C5C5D2] font-medium">{selectedCourse.instructor}</span>
                  </div>
                </div>
              </div>

              {/* Course Body: Description & Modules */}
              <div className="p-6 pt-0 space-y-6">
                {activeVideoTitle ? (
                  /* In-page Video Lecture Player */
                  <div className="p-6 bg-[#F7F7F4] text-[#20202B] rounded-2xl space-y-4 border border-[#EEEEEB]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#D7F36A]" />
                        <span className="text-xs font-bold text-[#20202B]">
                          Now Streaming Course Lecture
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveVideoTitle(null)}
                        className="text-xs text-[#85858D] hover:text-[#20202B] underline cursor-pointer"
                      >
                        Close Video Player
                      </button>
                    </div>
                    <div className="aspect-video max-h-[460px] mx-auto w-full bg-[#202033] rounded-xl flex flex-col items-center justify-center p-6 text-center border border-[#2B2B44] shadow-md">
                      <PlayCircle className="w-16 h-16 text-[#D7F36A] mb-3" />
                      <h4 className="text-base font-bold text-white">{activeVideoTitle}</h4>
                      <p className="text-xs text-[#8E8EA0] mt-1">High-Definition Lecture Stream (1080p, Adaptive Bitrate)</p>
                      <span className="mt-3 text-xs font-mono px-3 py-1 bg-white/10 text-white rounded-full">
                        Indian Institute of Management Sirmaur Video Network
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-xs font-bold text-[#20202B] mb-1.5">
                      Course Description & Pedagogical Goals
                    </h4>
                    <p className="text-xs text-[#5A5A66] leading-relaxed bg-[#F7F7F4] p-4 rounded-xl border border-[#EEEEEB]">
                      {selectedCourse.description}
                    </p>
                  </div>
                )}

                {/* Modules & Lessons List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-[#20202B]">
                      Curriculum Modules & Lessons ({selectedCourse.weeklyModules.length} Weeks)
                    </h4>
                    <span className="text-xs text-[#85858D] font-mono">
                      Progress: {selectedCourse.progressPercent}% ({selectedCourse.completedLessons}/{selectedCourse.totalLessons} Completed)
                    </span>
                  </div>

                  {selectedCourse.weeklyModules.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#85858D] bg-[#F7F7F4] rounded-xl">
                      Weekly module syllabus will be posted by the instructor for this term.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedCourse.weeklyModules.map((module) => (
                        <div
                          key={module.id}
                          className="p-5 rounded-2xl border border-[#EEEEEB] bg-white space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-[#20202B] bg-[#F7F7F4] px-2.5 py-1 rounded-lg border border-[#EEEEEB]">
                              Week {module.week}
                            </span>
                            <span className="text-xs font-bold text-[#20202B]">{module.title}</span>
                          </div>
                          <p className="text-xs text-[#85858D]">{module.description}</p>

                          <div className="space-y-2 pt-1">
                            {module.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between p-3 rounded-xl bg-[#F7F7F4] border border-[#EEEEEB] text-xs"
                              >
                                <div className="flex items-center space-x-3">
                                  {item.type === 'video' ? (
                                    <PlayCircle className="w-4 h-4 text-[#20202B]" />
                                  ) : (
                                    <FileText className="w-4 h-4 text-[#85858D]" />
                                  )}
                                  <span className="font-semibold text-[#20202B]">{item.title}</span>
                                </div>

                                <div className="flex items-center space-x-3">
                                  <span className="text-xs text-[#85858D]">{item.durationOrPages}</span>
                                  {item.type === 'video' ? (
                                    <button
                                      onClick={() => setActiveVideoTitle(item.title)}
                                      className="px-3 py-1.5 text-xs font-semibold text-white bg-[#202033] hover:bg-[#12121E] rounded-lg cursor-pointer transition flex items-center space-x-1"
                                    >
                                      <PlayCircle className="w-3.5 h-3.5 mr-1" />
                                      <span>Watch</span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => showToast(`Downloading: ${item.title} (${item.fileSize || 'PDF'})`, 'info')}
                                      className="px-3 py-1.5 text-xs font-medium text-[#20202B] bg-white border border-[#EEEEEB] hover:bg-[#F7F7F4] rounded-lg cursor-pointer transition flex items-center space-x-1"
                                    >
                                      <FileText className="w-3.5 h-3.5 mr-1 text-[#85858D]" />
                                      <span>Open PDF</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Course Grid (Clean, without redundant modal triggers) */
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#20202B]">Term IV Curriculum & Courses</h3>
                  <p className="text-xs text-[#85858D]">Access video lectures, syllabus modules, and course materials</p>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={courseCategoryFilter}
                    onChange={(e) => setCourseCategoryFilter(e.target.value)}
                    className="text-xs bg-white border border-[#EEEEEB] text-[#20202B] px-3 py-1.5 rounded-xl font-medium focus:outline-hidden focus:border-[#20202B] cursor-pointer"
                  >
                    <option value="all">All Disciplines</option>
                    <option value="Operations">Operations</option>
                    <option value="Analytics">Analytics</option>
                    <option value="Strategy">Strategy</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                  <span className="text-xs font-mono font-semibold text-[#20202B] bg-white border border-[#EEEEEB] px-3 py-1.5 rounded-xl">
                    {filteredCourses.length} Courses
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {filteredCourses.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCourse(c)}
                    className="bg-white rounded-2xl border border-[#EEEEEB] overflow-hidden hover:border-[#20202B]/40 transition duration-200 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 bg-[#F7F7F4] overflow-hidden border-b border-[#EEEEEB]">
                        <img src={c.coverImage} alt={c.title} className="w-full h-full object-cover" />
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-white text-[#20202B] shadow-xs">
                            {c.code}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-2.5">
                        <div className="flex items-center justify-between text-xs text-[#85858D] font-medium">
                          <span className="bg-[#F7F7F4] text-[#20202B] px-2 py-0.5 rounded border border-[#EEEEEB]">
                            {c.category}
                          </span>
                          <span>{c.duration}</span>
                        </div>

                        <h4 className="text-sm font-bold text-[#20202B] leading-snug line-clamp-2">
                          {c.title}
                        </h4>

                        <div className="flex items-center space-x-2 pt-2 border-t border-[#EEEEEB]">
                          <img src={c.instructorAvatar} alt={c.instructor} className="w-5 h-5 rounded-full object-cover border border-[#EEEEEB]" />
                          <span className="text-xs text-[#5A5A66] font-medium truncate">{c.instructor}</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-1">
                      <div className="flex justify-between text-xs font-medium text-[#85858D] mb-1">
                        <span>Progress</span>
                        <span className="text-[#20202B] font-bold font-mono">{c.progressPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#EEEEEB] rounded-full overflow-hidden">
                        <div className="h-full bg-[#202033] rounded-full" style={{ width: `${c.progressPercent}%` }} />
                      </div>
                      <div className="mt-2 text-xs text-[#85858D] flex justify-between">
                        <span>{c.completedLessons} of {c.totalLessons} Lessons</span>
                        <span className="text-[#20202B] font-semibold flex items-center">
                          Open <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-WINDOW 3: ASSIGNMENTS (Inline Expandable Details & Submission)         */}
      {/* ========================================================================= */}
      {activeLearnTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#20202B]">Course Assignments & Evaluations</h3>
              <p className="text-xs text-[#85858D]">Submit deliverables, track deadlines, and view instructor remarks directly inline</p>
            </div>
            
            <div className="flex items-center space-x-2 text-xs">
              <button
                onClick={() => setAssignmentFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
                  assignmentFilter === 'all'
                    ? 'bg-[#202033] text-white'
                    : 'bg-white text-[#5A5A66] border border-[#EEEEEB]'
                }`}
              >
                All ({assignments.length})
              </button>
              <button
                onClick={() => setAssignmentFilter('pending')}
                className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
                  assignmentFilter === 'pending'
                    ? 'bg-[#202033] text-white'
                    : 'bg-white text-[#5A5A66] border border-[#EEEEEB]'
                }`}
              >
                Pending Due ({assignments.filter(a => a.status === 'pending').length})
              </button>
              <button
                onClick={() => setAssignmentFilter('submitted')}
                className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
                  assignmentFilter === 'submitted'
                    ? 'bg-[#202033] text-white'
                    : 'bg-white text-[#5A5A66] border border-[#EEEEEB]'
                }`}
              >
                Submitted ({assignments.filter(a => a.status === 'submitted').length})
              </button>
              <button
                onClick={() => setAssignmentFilter('graded')}
                className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
                  assignmentFilter === 'graded'
                    ? 'bg-[#202033] text-white'
                    : 'bg-white text-[#5A5A66] border border-[#EEEEEB]'
                }`}
              >
                Graded ({assignments.filter(a => a.status === 'graded').length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredAssignments.map((asg) => {
              const isExpanded = expandedAssignmentId === asg.id;
              const mySub = asg.mySubmission;
              const isRecentlySubmitted = submittedStatusMap[asg.id];

              return (
                <div
                  key={asg.id}
                  className="bg-white rounded-2xl border border-[#EEEEEB] overflow-hidden transition"
                >
                  {/* Card Summary Header */}
                  <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#F7F7F4] text-[#20202B] border border-[#EEEEEB]">
                          {asg.courseCode}
                        </span>
                        <span className="text-xs text-[#85858D]">Weightage: {asg.weightagePercent}%</span>
                        {asg.status === 'graded' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-[#EAF6EE] text-[#1C6E3E]">
                            <Award className="w-3.5 h-3.5 mr-1" />
                            Graded ({asg.mySubmission?.marksObtained}/{asg.totalMarks})
                          </span>
                        ) : asg.status === 'submitted' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-[#EAF6EE] text-[#1C6E3E]">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Submitted
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-[#FEF7EA] text-[#9E5F00]">
                            <Clock className="w-3.5 h-3.5 mr-1" />
                            Pending Due
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-[#20202B]">{asg.title}</h4>

                      <div className="flex items-center space-x-4 text-xs text-[#85858D] pt-1">
                        <span>Due: {new Date(asg.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        <span>Max Marks: {asg.totalMarks}</span>
                        <span>Submissions: {asg.submissionsCount} / {asg.totalEnrolled}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <button
                        onClick={() => setExpandedAssignmentId(isExpanded ? null : asg.id)}
                        className="px-4 py-2.5 text-xs font-semibold text-white bg-[#202033] hover:bg-[#12121E] rounded-xl transition cursor-pointer flex items-center space-x-1.5"
                      >
                        <span>
                          {isExpanded 
                            ? 'Collapse' 
                            : asg.status === 'submitted' 
                              ? 'View Submission & Grade' 
                              : 'Submit Deliverable'}
                        </span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* INLINE EXPANDED SUBMISSION & EVALUATION PANEL (No Modal) */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-[#EEEEEB] bg-[#F7F7F4]/60 space-y-4">
                      {/* Assignment Instructions */}
                      <div className="p-4 bg-white rounded-xl border border-[#EEEEEB] text-xs text-[#20202B] space-y-2">
                        <div className="font-semibold text-[#20202B]">Deliverable Instructions & Requirements:</div>
                        <p className="text-[#5A5A66] leading-relaxed text-xs">
                          {asg.instructions}
                        </p>
                      </div>

                      {/* Evaluated Result or Submission Form */}
                      {mySub ? (
                        <div className="p-4 rounded-xl bg-[#EAF6EE] border border-[#268A50]/30 text-xs space-y-3">
                          <div className="flex items-center space-x-2 text-[#1C6E3E] font-bold">
                            <CheckCircle2 className="w-4 h-4 text-[#1C6E3E]" />
                            <span>Work Recorded & Verified</span>
                          </div>

                          <div className="bg-white p-3.5 rounded-lg border border-[#EEEEEB] text-xs space-y-1.5 font-mono text-[#20202B]">
                            <div>File: <span className="font-bold text-[#20202B]">{mySub.fileName}</span> ({mySub.fileSize})</div>
                            <div>Timestamp: <span className="text-[#85858D]">{new Date(mySub.submittedAt).toLocaleString()}</span></div>
                            <div>Receipt Token: <span className="text-[#20202B] font-bold">{mySub.receiptId}</span></div>
                          </div>

                          {mySub.marksObtained !== undefined && (
                            <div className="bg-white p-3.5 rounded-lg border border-[#EEEEEB] text-xs space-y-1">
                              <div className="flex items-center justify-between font-bold text-[#20202B]">
                                <span className="flex items-center space-x-1.5 text-[#20202B]">
                                  <Award className="w-4 h-4 text-[#202033]" />
                                  <span>Evaluated Grade</span>
                                </span>
                                <span className="text-base text-[#20202B] font-mono">{mySub.marksObtained} / {asg.totalMarks}</span>
                              </div>
                              <p className="text-xs text-[#85858D] italic mt-1">"{mySub.feedback}"</p>
                            </div>
                          )}
                        </div>
                      ) : isRecentlySubmitted ? (
                        <div className="p-5 text-center text-xs space-y-2 bg-white rounded-xl border border-[#268A50]/30">
                          <CheckCircle2 className="w-8 h-8 text-[#1C6E3E] mx-auto" />
                          <h4 className="font-bold text-[#20202B]">Deliverable Submitted Successfully</h4>
                          <p className="text-[#85858D] text-xs">Digital submission receipt generated and recorded.</p>
                        </div>
                      ) : (
                        <form onSubmit={(e) => handleInlineSubmitAssignment(asg.id, e)} className="p-5 bg-white rounded-xl border border-[#EEEEEB] space-y-4 text-xs">
                          <div>
                            <label className="block font-semibold text-[#20202B] mb-1">
                              Document / Report File Name
                            </label>
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={submissionFileNames[asg.id] || 'IIM_Sirmaur_Cockpit_Architecture_Project4.pdf'}
                                onChange={(e) => setSubmissionFileNames(prev => ({ ...prev, [asg.id]: e.target.value }))}
                                className="flex-1 px-3.5 py-2 bg-[#F7F7F4] border border-[#EEEEEB] rounded-xl text-xs text-[#20202B] focus:bg-white focus:outline-hidden focus:border-[#20202B]"
                                required
                              />
                              <span className="px-3 py-2 bg-[#F7F7F4] text-[#85858D] rounded-xl border border-[#EEEEEB] font-mono text-xs">
                                PDF
                              </span>
                            </div>
                            <p className="text-xs text-[#85858D] mt-1">Max file size 50 MB</p>
                          </div>

                          <label className="block p-4 border-2 border-dashed border-[#EEEEEB] rounded-xl text-center hover:bg-[#F7F7F4] transition cursor-pointer">
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf,.docx,.zip,.xlsx"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setSubmissionFileNames(prev => ({ ...prev, [asg.id]: file.name }));
                                  showToast(`File selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`, 'info');
                                }
                              }}
                            />
                            <Upload className="w-5 h-5 text-[#85858D] mx-auto mb-1" />
                            <span className="font-semibold text-[#20202B]">
                              {submissionFileNames[asg.id] ? `Selected: ${submissionFileNames[asg.id]}` : 'Select a file to upload'}
                            </span>
                            <p className="text-xs text-[#85858D] mt-0.5">Click or drag & drop (PDF, ZIP, DOCX supported)</p>
                          </label>

                          <div className="flex justify-end pt-1">
                            <button
                              type="submit"
                              className="px-5 py-2.5 font-bold text-white bg-[#202033] hover:bg-[#12121E] rounded-xl transition cursor-pointer flex items-center space-x-1.5"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Submit & Generate Receipt</span>
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-WINDOW 4: WEEKLY TIMETABLE                                           */}
      {/* ========================================================================= */}
      {activeLearnTab === 'timetable' && (
        <div className="bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#EEEEEB] gap-3">
            <div>
              <h3 className="text-base font-bold text-[#20202B]">Weekly Lecture & Classroom Schedule</h3>
              <p className="text-xs text-[#85858D]">Real-time room routing, faculty cabin allocations, and scheduling diagnostics</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                <button
                  key={day}
                  onClick={() => setTimetableDayFilter(day)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
                    timetableDayFilter === day
                      ? 'bg-[#202033] text-white'
                      : 'bg-[#F7F7F4] text-[#5A5A66] hover:bg-[#EEEEEB]'
                  }`}
                >
                  {day} {day === 'All' ? `(${timetable.length})` : `(${timetable.filter(t => t.day === day).length})`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTimetable.map((slot) => {
              const hasClash = slot.hasClash || checkDiningClash(slot.time);
              return (
                <div
                  key={slot.id}
                  className="p-4 rounded-xl border border-[#EEEEEB] bg-[#F7F7F4]/40 hover:bg-[#F7F7F4] transition space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-[#85858D]">{slot.day}</span>
                      <span className="text-xs font-mono font-bold text-[#20202B] bg-white px-2 py-0.5 rounded border border-[#EEEEEB]">
                        {slot.time}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#20202B] mb-1">{slot.courseName}</h4>
                    <p className="text-xs text-[#5A5A66]">{slot.courseCode} • {slot.instructor}</p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#EEEEEB] flex items-center justify-between text-xs">
                    <span className="font-medium text-[#20202B] flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-[#85858D]" />
                      {slot.room}
                    </span>
                    <button
                      onClick={() => onOpenReportTicket(slot.room)}
                      className="text-xs text-[#20202B] font-semibold hover:underline cursor-pointer"
                    >
                      Report Issue
                    </button>
                  </div>

                  {hasClash && (
                    <div className="mt-3 p-2 bg-white border border-[#C27803]/30 rounded-lg text-xs text-[#9E5F00] flex items-start space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#C27803] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Dining Clash: </span>
                        <span>Lecture overlaps with Lunch Service (12:30 - 14:00).</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-WINDOW 5: LEARNING INSIGHTS & EXECUTIVE ANALYTICS SUITE              */}
      {/* ========================================================================= */}
      {activeLearnTab === 'insights' && (
        <div className="space-y-6">
          {/* Executive Top Banner */}
          <div className="bg-white rounded-2xl p-6 border border-[#EEEEEB] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold bg-[#202033] text-[#D7F36A] px-2.5 py-0.5 rounded-md">
                  TERM IV TELEMETRY
                </span>
                <span className="text-xs font-semibold bg-[#EAF6EE] text-[#1C6E3E] px-2.5 py-0.5 rounded-md flex items-center">
                  <Award className="w-3.5 h-3.5 mr-1" />
                  Dean's Honor Roll Standing (Top 6.8%)
                </span>
                <span className="text-xs text-[#85858D] font-mono">
                  Cohort Rank #5 of 68
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#20202B] pt-1">
                Executive Academic Performance & Learning Analytics
              </h2>
              <p className="text-xs text-[#5A5A66]">
                Multi-dimensional scholar telemetry, cognitive study distribution, and predictive grade simulations for Aarav Sharma (STD-2035-042)
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => showToast('Exporting Certified Term IV Academic Record & Biometric Audit (PDF)...', 'info')}
                className="px-4 py-2.5 bg-[#202033] hover:bg-[#12121E] text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-2 shadow-xs"
              >
                <Download className="w-4 h-4 text-[#D7F36A]" />
                <span>Export Official Transcript</span>
              </button>
            </div>
          </div>

          {/* Top 4 Executive KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Cumulative GPA */}
            <div className="bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-3">
              <div className="flex items-center justify-between text-xs text-[#85858D]">
                <span className="font-medium">Cumulative GPA (CGPA)</span>
                <span className="font-semibold text-[#1C6E3E] bg-[#EAF6EE] px-2 py-0.5 rounded flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +0.06
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-[#20202B] font-mono">3.82</span>
                <span className="text-xs text-[#85858D] font-mono">/ 4.00</span>
              </div>
              <div className="pt-2 border-t border-[#EEEEEB] text-xs text-[#5A5A66] flex items-center justify-between">
                <span>Cohort Mean: <strong className="font-mono text-[#20202B]">3.42</strong></span>
                <span className="text-[#1C6E3E] font-medium font-mono">Top 6.8%</span>
              </div>
            </div>

            {/* Card 2: Biometric Attendance */}
            <div className="bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-3">
              <div className="flex items-center justify-between text-xs text-[#85858D]">
                <span className="font-medium">Physical Attendance</span>
                <span className="font-semibold text-[#1C6E3E] bg-[#EAF6EE] px-2 py-0.5 rounded">
                  Compliant
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-[#20202B] font-mono">92.4%</span>
                <span className="text-xs text-[#1C6E3E] font-mono">(+17.4% Buffer)</span>
              </div>
              <div className="pt-2 border-t border-[#EEEEEB] text-xs text-[#5A5A66] flex items-center justify-between">
                <span>104 / 112 Sessions</span>
                <span className="text-[#85858D]">19 Misses Allowed</span>
              </div>
            </div>

            {/* Card 3: Degree Credits Earned */}
            <div className="bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-3">
              <div className="flex items-center justify-between text-xs text-[#85858D]">
                <span className="font-medium">Degree Credit Progress</span>
                <span className="font-semibold text-[#20202B] bg-[#F7F7F4] px-2 py-0.5 rounded border border-[#EEEEEB]">
                  80.5%
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-[#20202B] font-mono">84.5</span>
                <span className="text-xs text-[#85858D] font-mono">/ 105.0 Credits</span>
              </div>
              <div className="pt-2 border-t border-[#EEEEEB] text-xs text-[#5A5A66] flex items-center justify-between">
                <span>Term IV: <strong className="text-[#20202B]">21.5 Cr Active</strong></span>
                <span className="text-[#1C6E3E]">On Track 2027</span>
              </div>
            </div>

            {/* Card 4: Evaluation Rate */}
            <div className="bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-3">
              <div className="flex items-center justify-between text-xs text-[#85858D]">
                <span className="font-medium">On-Time Evaluation Rate</span>
                <span className="font-semibold text-[#20202B] bg-[#F7F7F4] px-2 py-0.5 rounded border border-[#EEEEEB]">
                  Perfect
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-[#20202B] font-mono">100%</span>
                <span className="text-xs text-[#85858D] font-mono">On-Time</span>
              </div>
              <div className="pt-2 border-t border-[#EEEEEB] text-xs text-[#5A5A66] flex items-center justify-between">
                <span>14 of 14 Deliverables</span>
                <span className="text-[#85858D]">1.8d Faculty SLA</span>
              </div>
            </div>
          </div>

          {/* Section 1: Multi-Term CGPA Progression & Benchmark */}
          <div className="bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
              <div>
                <h3 className="text-base font-bold text-[#20202B]">
                  Term-by-Term CGPA Progression vs. Cohort Average
                </h3>
                <p className="text-xs text-[#85858D]">
                  Historical academic trajectory across MBA terms compared against cohort mean and Dean's Honor Roll cutoff (3.80)
                </p>
              </div>

              <div className="flex items-center space-x-4 text-xs font-medium text-[#5A5A66]">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#202033]" />
                  <span>Aarav Sharma</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#D7F36A]" />
                  <span>Dean's Cutoff (3.80)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#C5C5D2]" />
                  <span>Cohort Average</span>
                </div>
              </div>
            </div>

            {/* Progression Chart */}
            <div className="pt-6 pb-2 border-b border-[#EEEEEB]">
              <div className="h-56 flex items-end justify-between gap-6 px-4">
                {STUDENT_ANALYTICS.cgpaProgression.map((item) => {
                  const studentPct = ((item.gpa - 3.0) / 1.0) * 100;
                  const cohortPct = ((item.cohortAvg - 3.0) / 1.0) * 100;
                  const isCurrent = item.term.includes('Current');

                  return (
                    <div key={item.term} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="flex items-center space-x-2 text-xs font-mono font-bold">
                        <span className="text-[#20202B]">{item.gpa.toFixed(2)}</span>
                        <span className="text-[11px] text-[#85858D]">({item.cohortAvg.toFixed(2)})</span>
                      </div>

                      <div className="w-full max-w-[80px] h-40 bg-[#F7F7F4] rounded-t-xl flex items-end justify-center gap-1.5 p-1 relative border-b border-[#EEEEEB]">
                        {/* Cutoff line reference indicator */}
                        <div 
                          className="absolute inset-x-0 border-b-2 border-dashed border-[#D7F36A] pointer-events-none z-10" 
                          style={{ bottom: `${((3.80 - 3.0) / 1.0) * 100}%` }}
                        />

                        {/* Student Bar */}
                        <div
                          className={`w-6 rounded-t-md transition-all duration-300 relative z-20 ${
                            isCurrent ? 'bg-[#202033]' : 'bg-[#3A3A52]'
                          }`}
                          style={{ height: `${Math.max(studentPct, 15)}%` }}
                        />

                        {/* Cohort Mean Bar */}
                        <div
                          className="w-4 rounded-t-sm bg-[#D5D5DC] transition-all duration-300 relative z-10"
                          style={{ height: `${Math.max(cohortPct, 10)}%` }}
                        />
                      </div>

                      <span className={`text-[11px] font-medium text-center ${isCurrent ? 'font-bold text-[#20202B]' : 'text-[#85858D]'}`}>
                        {item.term.split(' ')[0]} {item.term.split(' ')[1]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-[#F7F7F4] rounded-xl border border-[#EEEEEB] flex flex-col md:flex-row md:items-center justify-between text-xs gap-3">
              <div className="flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-[#20202B] shrink-0 mt-0.5" />
                <span className="text-[#5A5A66]">
                  <strong>Trajectory Analysis:</strong> Aarav's GPA velocity (+0.06/term) is expanding at 2.4x the cohort rate. Strong performance in Operations Research and Predictive Modeling has pushed cumulative standing across the Dean's Honor Roll benchmark (3.80).
                </span>
              </div>
              <span className="text-xs font-mono font-semibold text-[#20202B] bg-white px-3 py-1 rounded-lg border border-[#EEEEEB] shrink-0">
                Dean's List Probability: 94.2%
              </span>
            </div>
          </div>

          {/* Section 2: Detailed Course Performance & Grade Breakdown Matrix */}
          <div className="bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
              <div>
                <h3 className="text-base font-bold text-[#20202B]">
                  Course-by-Course Grade & Performance Breakdown Matrix
                </h3>
                <p className="text-xs text-[#85858D]">
                  Component-wise continuous evaluation, verified biometric attendance buffer, and cohort percentile ranks
                </p>
              </div>

              <span className="text-xs font-mono font-medium text-[#85858D] bg-[#F7F7F4] px-3 py-1.5 rounded-xl border border-[#EEEEEB]">
                {STUDENT_ANALYTICS.coursePerformance.length} Enrolled Courses
              </span>
            </div>

            {/* Comprehensive Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#EEEEEB] text-[#85858D] font-semibold bg-[#F7F7F4]/60">
                    <th className="p-3.5 pl-4 rounded-l-xl">Course & Faculty</th>
                    <th className="p-3.5">Credits</th>
                    <th className="p-3.5">Biometric Attendance</th>
                    <th className="p-3.5">Continuous (50)</th>
                    <th className="p-3.5">Midterm (50)</th>
                    <th className="p-3.5">Projected Grade</th>
                    <th className="p-3.5">Cohort Percentile</th>
                    <th className="p-3.5 pr-4 rounded-r-xl">Academic Standing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEEEEB]">
                  {STUDENT_ANALYTICS.coursePerformance.map((c) => (
                    <tr key={c.courseCode} className="hover:bg-[#F7F7F4]/40 transition font-medium">
                      <td className="p-3.5 pl-4">
                        <div className="font-bold text-[#20202B] flex items-center space-x-1.5">
                          <span className="font-mono bg-[#F7F7F4] px-1.5 py-0.5 rounded border border-[#EEEEEB] text-[11px]">
                            {c.courseCode}
                          </span>
                          <span>{c.title}</span>
                        </div>
                        <div className="text-[11px] text-[#85858D] mt-0.5">{c.faculty}</div>
                      </td>

                      <td className="p-3.5 font-mono text-[#20202B] font-semibold">{c.credits.toFixed(1)}</td>

                      <td className="p-3.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-[#20202B]">{c.attendance}%</span>
                          <span className="text-[11px] text-[#1C6E3E] bg-[#EAF6EE] px-1.5 py-0.5 rounded font-mono">
                            +{c.safeMissBuffer} safe
                          </span>
                        </div>
                      </td>

                      <td className="p-3.5 font-mono text-[#20202B]">
                        <span className="font-bold">{c.continuousMarks}</span>
                        <span className="text-[#85858D]"> / {c.maxContinuous}</span>
                      </td>

                      <td className="p-3.5 font-mono text-[#20202B]">
                        <span className="font-bold">{c.midtermMarks}</span>
                        <span className="text-[#85858D]"> / {c.maxMidterm}</span>
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="w-7 h-7 rounded-lg bg-[#202033] text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                            {c.projectedGrade}
                          </span>
                          <span className="font-mono text-xs text-[#85858D]">({c.gradePoints.toFixed(1)} GP)</span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="space-y-1">
                          <div className="flex justify-between font-mono text-[11px]">
                            <span className="font-bold text-[#20202B]">{c.percentile}th</span>
                          </div>
                          <div className="w-20 h-1.5 bg-[#EEEEEB] rounded-full overflow-hidden">
                            <div className="h-full bg-[#202033] rounded-full" style={{ width: `${c.percentile}%` }} />
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 pr-4">
                        {c.status === 'distinction' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#EAF6EE] text-[#1C6E3E]">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Distinction
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#FEF7EA] text-[#9E5F00]">
                            <Clock className="w-3.5 h-3.5 mr-1" />
                            On Track
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Cognitive Study Habits & Time Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Panel 1: Discipline Time Allocation */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-4">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h3 className="text-base font-bold text-[#20202B]">
                    Discipline Time Allocation ({STUDENT_ANALYTICS.studyHabits.weeklyStudyHoursTotal} hrs/week)
                  </h3>
                  <p className="text-xs text-[#85858D]">Classroom lectures (18.0h) vs self-directed prep & case labs (20.4h)</p>
                </div>
              </div>

              <div className="space-y-3.5 pt-2">
                {STUDENT_ANALYTICS.studyHabits.disciplineSplit.map((split) => (
                  <div key={split.discipline} className="space-y-1 text-xs">
                    <div className="flex justify-between font-medium">
                      <span className="text-[#20202B] font-semibold">{split.discipline}</span>
                      <span className="font-mono text-[#85858D]">
                        {split.hours} hrs ({split.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#F7F7F4] rounded-full overflow-hidden border border-[#EEEEEB]">
                      <div
                        className="h-full rounded-full transition-all duration-300 bg-[#202033]"
                        style={{ width: `${split.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel 2: Weekly Heatmap & Concentration Windows */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-4">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h3 className="text-base font-bold text-[#20202B]">Daily Study Rhythm & Cognitive Windows</h3>
                  <p className="text-xs text-[#85858D]">Peak concentration slots and daily hour distribution</p>
                </div>
              </div>

              {/* Day Bars */}
              <div className="h-32 flex items-end justify-between gap-3 border-b border-[#EEEEEB] pb-2 pt-2">
                {STUDENT_ANALYTICS.studyHabits.dailyHours.map((d) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 group">
                    <span className="text-[11px] font-mono font-semibold text-[#85858D]">
                      {d.hours}h
                    </span>
                    <div className="w-full bg-[#F7F7F4] rounded-t-lg h-20 flex items-end overflow-hidden">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-300 ${
                          d.peak ? 'bg-[#D7F36A]' : 'bg-[#202033]'
                        }`}
                        style={{ height: `${d.pct}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-[#85858D]">{d.day}</span>
                  </div>
                ))}
              </div>

              {/* Time of Day Windows */}
              <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
                {STUDENT_ANALYTICS.studyHabits.timeOfDayConcentration.map((t) => (
                  <div key={t.period} className="p-3 bg-[#F7F7F4] rounded-xl border border-[#EEEEEB] space-y-1">
                    <div className="flex items-center justify-between font-semibold text-[#20202B]">
                      <span className="truncate">{t.period}</span>
                      <span className="font-mono text-xs">{t.pct}%</span>
                    </div>
                    <div className="text-[11px] text-[#85858D]">{t.time}</div>
                    <div className="text-[11px] text-[#1C6E3E] font-medium">{t.tag}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Core MBA Competencies & Benchmark Matrix */}
          <div className="bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
              <div>
                <h3 className="text-base font-bold text-[#20202B]">
                  Core MBA Management Competencies & Benchmark
                </h3>
                <p className="text-xs text-[#85858D]">
                  Quantitative modeling, strategic decision making, and executive defense skills assessed against IIM cohort baselines
                </p>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#D7F36A] text-[#20202B]">
                Dean's Mastery Level
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {STUDENT_ANALYTICS.competencies.map((comp) => {
                const delta = comp.score - comp.benchmark;
                return (
                  <div key={comp.skill} className="p-4 bg-[#F7F7F4]/60 rounded-xl border border-[#EEEEEB] space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-xs text-[#20202B] leading-snug">{comp.skill}</span>
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-white text-[#20202B] border border-[#EEEEEB] shrink-0">
                        {comp.level}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="font-bold text-[#20202B]">{comp.score}%</span>
                        <span className="text-[#85858D]">Cohort Avg: {comp.benchmark}%</span>
                      </div>
                      <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-[#EEEEEB]">
                        <div
                          className="h-full bg-[#202033] rounded-full transition-all duration-300"
                          style={{ width: `${comp.score}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-[11px] text-[#1C6E3E] font-medium flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      <span>+{delta}% above cohort baseline</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 5: Dean's Honor Roll Simulator & AI Prescriptive Guidance */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Simulator Widget */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-[#20202B]" />
                  <h3 className="text-base font-bold text-[#20202B]">Dean's List Target Simulator</h3>
                </div>
                <p className="text-xs text-[#85858D]">
                  Simulate minimum required marks on upcoming deliverables to reach target graduation CGPA
                </p>
              </div>

              <div className="p-4 bg-[#F7F7F4] rounded-xl border border-[#EEEEEB] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#5A5A66] font-semibold">Graduation Target CGPA:</span>
                  <span className="font-mono text-base font-bold text-[#20202B]">{simulatedGpaGoal.toFixed(2)}</span>
                </div>

                <div className="flex items-center space-x-2">
                  {[3.80, 3.82, 3.85, 3.90].map((goal) => (
                    <button
                      key={goal}
                      onClick={() => setSimulatedGpaGoal(goal)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold transition cursor-pointer ${
                        simulatedGpaGoal === goal
                          ? 'bg-[#202033] text-white'
                          : 'bg-white text-[#5A5A66] border border-[#EEEEEB] hover:bg-[#EEEEEB]'
                      }`}
                    >
                      {goal.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-white rounded-xl border border-[#EEEEEB] flex items-center justify-between">
                  <span className="text-[#5A5A66]">SM-403 Capstone Strategic Defense:</span>
                  <strong className="font-mono text-[#20202B]">&ge; {Math.min(50, Math.max(35, Math.round(50 * (0.78 + (simulatedGpaGoal - 3.80) * 1.6))))} / 50 Marks</strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#EEEEEB] flex items-center justify-between">
                  <span className="text-[#5A5A66]">BA-402 Final Time-Series Project:</span>
                  <strong className="font-mono text-[#20202B]">&ge; {Math.min(30, Math.max(20, Math.round(30 * (0.76 + (simulatedGpaGoal - 3.80) * 2.0))))} / 30 Marks</strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#EEEEEB] flex items-center justify-between">
                  <span className="text-[#5A5A66]">QM-406 Optimization Final:</span>
                  <strong className="font-mono text-[#20202B]">&ge; {Math.min(50, Math.max(36, Math.round(50 * (0.80 + (simulatedGpaGoal - 3.80) * 1.6))))} / 50 Marks</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#EAF6EE] border border-[#268A50]/30 text-xs text-[#1C6E3E] font-medium flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Current trajectory achieves {simulatedGpaGoal.toFixed(2)} target with {parseFloat(Math.max(60.0, Math.min(99.0, 97.4 - (simulatedGpaGoal - 3.80) * 192)).toFixed(1))}% statistical confidence.</span>
              </div>
            </div>

            {/* Right: AI Academic Advisory Guidance */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#EEEEEB] space-y-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#20202B]" />
                  <h3 className="text-base font-bold text-[#20202B]">AI Academic Advisory Insights</h3>
                </div>
                <p className="text-xs text-[#85858D]">
                  Automated performance synthesis calibrated to IIM Sirmaur academic council benchmarks
                </p>
              </div>

              <div className="space-y-3">
                {STUDENT_ANALYTICS.aiRecommendations.map((rec) => (
                  <div key={rec.id} className="p-4 bg-[#F7F7F4] rounded-xl border border-[#EEEEEB] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-[#20202B]">{rec.title}</h4>
                      <span className="font-mono text-[11px] text-[#5A5A66] bg-[#EEEEEB] px-2 py-0.5 rounded capitalize">
                        {rec.type}
                      </span>
                    </div>
                    <p className="text-[#5A5A66] leading-relaxed">
                      {rec.description}
                    </p>
                    <div className="pt-1">
                      <button
                        onClick={() => {
                          if (rec.id === 'rec-1') {
                            setActiveLearnTab('assignments');
                          } else if (rec.id === 'rec-2') {
                            setActiveLearnTab('timetable');
                          } else {
                            showToast('Downloading Official Biometric Attendance Audit Statement (PDF)...', 'info');
                          }
                        }}
                        className="text-xs font-semibold text-[#20202B] hover:underline flex items-center cursor-pointer"
                      >
                        <span>{rec.actionText}</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* Understated Metric Progress Bar */
const MetricBar: React.FC<{ label: string; percentage: number }> = ({ label, percentage }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-xs">
      <span className="text-[#5A5A66] font-medium">{label}</span>
      <span className="font-bold text-[#20202B] font-mono">{percentage}%</span>
    </div>
    <div className="w-full h-1.5 bg-[#EEEEEB] rounded-full overflow-hidden">
      <div
        className="h-full bg-[#202033] rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);
