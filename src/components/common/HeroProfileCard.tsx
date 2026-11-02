import React from 'react';
import { useCockpit } from '../../context/CockpitContext';
import { Mail, Phone, MapPin } from 'lucide-react';

export const HeroProfileCard: React.FC = () => {
  const { currentUser } = useCockpit();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
      {/* Deep Navy Profile Hero Card matching Institutional Navy */}
      <div className="lg:col-span-5 bg-[var(--lead)] text-[var(--on-lead)] rounded-xl p-6 flex flex-col justify-between border border-[var(--lead-line)]">
        {/* Top Active Status */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[var(--surface)] text-[var(--text)]">
            <span className="w-2 h-2 rounded-full bg-[var(--success)] mr-2" />
            Active
          </span>
          <span className="text-xs font-mono text-[var(--on-lead-2)] bg-black/20 px-2 py-0.5 rounded">
            IIM Sirmaur 2035
          </span>
        </div>

        {/* Avatar & Title */}
        <div className="text-center my-2">
          <div className="relative inline-block mx-auto mb-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-24 h-24 rounded-xl object-cover border border-white/20 mx-auto"
            />
          </div>
          <h2 className="text-xl font-bold text-white mb-0.5">{currentUser.name}</h2>
          <p className="text-xs font-mono text-[var(--on-lead-2)]">
            {currentUser.studentId || currentUser.staffId || 'ID-2035-001'} • Term IV 2026-27
          </p>
          <p className="text-xs text-[var(--on-lead-2)] mt-1 font-medium">{currentUser.roleName}</p>
        </div>

        {/* Contact Subcard */}
        <div className="bg-[var(--surface)] text-[var(--text)] rounded-lg p-4 mt-4 space-y-2.5 text-xs border border-[var(--line)]">
          <div className="flex items-center space-x-3 text-[var(--text-2)]">
            <div className="w-6 h-6 flex items-center justify-center shrink-0 text-[var(--text-3)]">
              <Mail className="w-4 h-4" />
            </div>
            <span className="truncate font-medium text-[var(--text)]">{currentUser.email}</span>
          </div>

          <div className="flex items-center space-x-3 text-[var(--text-2)]">
            <div className="w-6 h-6 flex items-center justify-center shrink-0 text-[var(--text-3)]">
              <Phone className="w-4 h-4" />
            </div>
            <span className="font-medium text-[var(--text)]">+91 98160 20351</span>
          </div>

          <div className="flex items-center space-x-3 text-[var(--text-2)]">
            <div className="w-6 h-6 flex items-center justify-center shrink-0 text-[var(--text-3)]">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="font-medium text-[var(--text)]">{currentUser.roomOrOffice}, Dhaula Kuan Campus</span>
          </div>
        </div>
      </div>

      {/* Performance Score & Gauge Card */}
      <div className="lg:col-span-7 bg-[var(--surface)] rounded-xl p-6 border border-[var(--line)] flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
          <div>
            <h3 className="text-sm font-bold text-[var(--text)]">Academic and Operations Performance</h3>
            <p className="text-xs text-[var(--text-3)]">Quarterly evaluated institutional index</p>
          </div>
          <span className="text-xs font-semibold text-[var(--lead-ink)] bg-[var(--lead-tint)] px-2.5 py-1 rounded-md">
            This Term
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-4 items-center">
          {/* Radial Gauge Meter */}
          <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Radial Arch SVG */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="var(--line)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="238.76"
                  strokeDashoffset="60"
                  strokeLinecap="round"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="var(--lead)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="238.76"
                  strokeDashoffset="82"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold text-[var(--text)] leading-none font-mono">88</span>
                <span className="text-xs text-[var(--text-3)] font-semibold mt-0.5">/ 100</span>
              </div>
            </div>
            <span className="mt-2 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[var(--surface-2)] text-[var(--text-2)] border border-[var(--line)]">
              Above Average
            </span>
          </div>

          {/* Metric Breakdown Bars */}
          <div className="md:col-span-7 space-y-3.5">
            <div>
              <div className="flex justify-between text-xs font-medium text-[var(--text-2)] mb-1.5">
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--series-1)]" />
                  <span>Lecture Participation</span>
                </span>
                <span className="font-bold text-[var(--text)] font-mono">92%</span>
              </div>
              <div className="w-full h-2 bg-[var(--surface-2)] rounded-full overflow-hidden flex">
                <div className="h-full bg-[var(--series-1)] rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-[var(--text-2)] mb-1.5">
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--series-2)]" />
                  <span>Quiz and Continuous Assessment</span>
                </span>
                <span className="font-bold text-[var(--text)] font-mono">86%</span>
              </div>
              <div className="w-full h-2 bg-[var(--surface-2)] rounded-full overflow-hidden flex">
                <div className="h-full bg-[var(--series-2)] rounded-full" style={{ width: '86%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-[var(--text-2)] mb-1.5">
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--series-4)]" />
                  <span>Term Projects and Mid-Exams</span>
                </span>
                <span className="font-bold text-[var(--text)] font-mono">84%</span>
              </div>
              <div className="w-full h-2 bg-[var(--surface-2)] rounded-full overflow-hidden flex">
                <div className="h-full bg-[var(--series-4)] rounded-full" style={{ width: '84%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Instructor / Mentor Feedback Quote */}
        <div className="bg-[var(--surface-2)] rounded-lg p-3 border border-[var(--line)] text-xs text-[var(--text-2)]">
          "Great consistency and strong engagement throughout the learning journey. Exceptional aptitude shown in Project 4 Smart Campus operations and quantitative demand forecasting models."
        </div>
      </div>
    </div>
  );
};
