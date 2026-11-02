import React, { useState } from 'react';
import { Course } from '../../types';
import { 
  X, 
  PlayCircle, 
  FileText, 
  Wrench
} from 'lucide-react';

interface CourseDetailModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onReportClassroomIssue: (room: string) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  isOpen,
  onClose,
  onReportClassroomIssue,
}) => {
  const [activeVideoTitle, setActiveVideoTitle] = useState<string | null>(null);

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#EEEEEB] overflow-hidden max-h-[90vh] flex flex-col shadow-xl">
        {/* Course Banner */}
        <div className="relative h-44 bg-[#202033] shrink-0 overflow-hidden">
          <img
            src={course.coverImage}
            alt={course.title}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#202033] via-[#202033]/60 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-xl transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#D7F36A] text-[#20202B]">
                {course.code}
              </span>
              <span className="text-xs text-[#C5C5D2] font-medium">
                {course.category} • {course.credits} Credits
              </span>
            </div>
            <h3 className="text-lg font-bold text-white leading-snug">
              {course.title}
            </h3>
          </div>
        </div>

        {/* Action Header with Quick Classroom Issue Reporter */}
        <div className="px-6 py-3 bg-[#F7F7F4] border-b border-[#EEEEEB] flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <img
              src={course.instructorAvatar}
              alt={course.instructor}
              className="w-7 h-7 rounded-full object-cover border border-[#EEEEEB]"
            />
            <span className="font-semibold text-[#20202B]">{course.instructor}</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onReportClassroomIssue('Academic Complex, CR-102');
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white text-[#20202B] hover:bg-[#EEEEEB] rounded-xl border border-[#EEEEEB] font-semibold cursor-pointer transition text-xs"
            title="Report a classroom issue with prefilled room"
          >
            <Wrench className="w-3.5 h-3.5 text-[#20202B]" />
            <span>Report Classroom Issue (CR-102)</span>
          </button>
        </div>

        {/* Course Modules & Lessons */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeVideoTitle ? (
            <div className="p-4 bg-[#F7F7F4] text-[#20202B] rounded-xl space-y-3 border border-[#EEEEEB]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#20202B]">
                  Now Streaming Course Video
                </span>
                <button
                  onClick={() => setActiveVideoTitle(null)}
                  className="text-xs text-[#85858D] hover:text-[#20202B] underline cursor-pointer"
                >
                  Back to Modules
                </button>
              </div>
              <div className="aspect-video bg-[#202033] rounded-xl flex flex-col items-center justify-center p-6 text-center border border-[#2B2B44]">
                <PlayCircle className="w-12 h-12 text-[#D7F36A] mb-2" />
                <h4 className="text-sm font-bold text-white">{activeVideoTitle}</h4>
                <p className="text-xs text-[#8E8EA0] mt-1">High-Definition Lecture Stream (1080p, Adaptive Bitrate)</p>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h4 className="text-xs font-bold text-[#20202B] mb-1">
                  Course Description & Pedagogical Goals
                </h4>
                <p className="text-xs text-[#5A5A66] leading-relaxed bg-[#F7F7F4] p-4 rounded-xl border border-[#EEEEEB]">
                  {course.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#20202B] mb-2">
                  Weekly Syllabus & Content Items
                </h4>

                {course.weeklyModules.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[#85858D] bg-[#F7F7F4] rounded-xl">
                    Weekly module syllabus will be posted by the instructor for this term.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {course.weeklyModules.map((module) => (
                      <div
                        key={module.id}
                        className="p-4 rounded-xl border border-[#EEEEEB] bg-white space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-[#20202B] bg-[#F7F7F4] px-2 py-0.5 rounded border border-[#EEEEEB]">
                            Week {module.week}
                          </span>
                          <span className="text-xs font-bold text-[#20202B]">{module.title}</span>
                        </div>
                        <p className="text-xs text-[#85858D]">{module.description}</p>

                        <div className="space-y-2 pt-1">
                          {module.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-2.5 rounded-lg bg-[#F7F7F4] border border-[#EEEEEB] text-xs"
                            >
                              <div className="flex items-center space-x-2.5">
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
                                    className="px-3 py-1 text-xs font-semibold text-white bg-[#202033] hover:bg-[#12121E] rounded-lg cursor-pointer transition"
                                  >
                                    Watch
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => alert(`Downloading: ${item.title} (${item.fileSize || 'PDF'})`)}
                                    className="px-3 py-1 text-xs font-medium text-[#20202B] bg-white border border-[#EEEEEB] hover:bg-[#F7F7F4] rounded-lg cursor-pointer transition"
                                  >
                                    Open
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};
