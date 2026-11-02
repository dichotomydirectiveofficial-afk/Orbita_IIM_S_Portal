import React, { useState } from 'react';
import { Assignment } from '../../types';
import { useCockpit } from '../../context/CockpitContext';
import { X, Upload, CheckCircle2, Clock, Award } from 'lucide-react';

interface SubmitAssignmentModalProps {
  assignment: Assignment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SubmitAssignmentModal: React.FC<SubmitAssignmentModalProps> = ({
  assignment,
  isOpen,
  onClose,
}) => {
  const { submitAssignmentWork } = useCockpit();
  const [fileName, setFileName] = useState('IIM_Sirmaur_Cockpit_Architecture_Project4.pdf');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !assignment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitAssignmentWork(assignment.id, fileName);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  const mySub = assignment.mySubmission;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#EEEEEB] shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#202033] text-white p-6 pb-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#D7F36A] text-[#20202B]">
              {assignment.courseCode}
            </span>
            <h3 className="text-base font-bold text-white tracking-tight mt-2">
              {assignment.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8E8EA0] hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="p-4 bg-[#F7F7F4] rounded-xl border border-[#EEEEEB] text-xs text-[#20202B] space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-[#85858D]">Total Marks: {assignment.totalMarks}</span>
              <span className="text-[#20202B]">Weightage: {assignment.weightagePercent}%</span>
            </div>
            <div className="text-xs text-[#85858D] flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-[#85858D]" />
              <span>Due: {new Date(assignment.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <p className="mt-2 text-[#5A5A66] text-xs leading-relaxed pt-2 border-t border-[#EEEEEB]">
              {assignment.instructions}
            </p>
          </div>

          {/* Submission Status or Upload Form */}
          {mySub ? (
            <div className="p-4 rounded-xl bg-[#EAF6EE] border border-[#268A50]/30 text-xs space-y-3">
              <div className="flex items-center space-x-2 text-[#1C6E3E] font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#1C6E3E]" />
                <span>Work Submitted Successfully</span>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-[#EEEEEB] text-xs space-y-1.5 font-mono text-[#20202B]">
                <div>File: <span className="font-bold text-[#20202B]">{mySub.fileName}</span> ({mySub.fileSize})</div>
                <div>Timestamp: <span className="text-[#85858D]">{new Date(mySub.submittedAt).toLocaleString()}</span></div>
                <div>Receipt Token: <span className="text-[#20202B] font-bold">{mySub.receiptId}</span></div>
              </div>

              {mySub.marksObtained !== undefined && (
                <div className="bg-white p-3.5 rounded-lg border border-[#EEEEEB] text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#20202B]">
                    <span className="flex items-center space-x-1 text-[#20202B]">
                      <Award className="w-4 h-4 text-[#D7F36A]" />
                      <span>Evaluated Score</span>
                    </span>
                    <span className="text-base text-[#20202B] font-mono">{mySub.marksObtained} / {assignment.totalMarks}</span>
                  </div>
                  <p className="text-xs text-[#85858D] italic mt-1">"{mySub.feedback}"</p>
                </div>
              )}
            </div>
          ) : isSubmitted ? (
            <div className="p-6 text-center text-xs space-y-2">
              <CheckCircle2 className="w-10 h-10 text-[#1C6E3E] mx-auto" />
              <h4 className="font-bold text-[#20202B]">Assignment Submitted Successfully</h4>
              <p className="text-[#85858D] text-xs">Digital submission receipt generated and recorded.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#20202B] mb-1">
                  Document / Report File Name
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="flex-1 px-3.5 py-2 bg-[#F7F7F4] border border-[#EEEEEB] rounded-xl text-xs text-[#20202B] focus:bg-white focus:outline-hidden focus:border-[#20202B]"
                    required
                  />
                  <span className="px-3 py-2 bg-[#F7F7F4] text-[#85858D] rounded-xl border border-[#EEEEEB] font-mono text-xs">
                    PDF
                  </span>
                </div>
                <p className="text-xs text-[#85858D] mt-1">Max file size 50 MB</p>
              </div>

              <div className="p-5 border-2 border-dashed border-[#EEEEEB] rounded-xl text-center hover:bg-[#F7F7F4] transition cursor-pointer">
                <Upload className="w-6 h-6 text-[#85858D] mx-auto mb-1.5" />
                <span className="font-semibold text-[#20202B]">Select a file to upload</span>
                <p className="text-xs text-[#85858D] mt-0.5">PDF, ZIP, DOCX supported</p>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 font-medium text-[#85858D] hover:text-[#20202B] hover:bg-[#F7F7F4] rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 font-bold text-white bg-[#202033] hover:bg-[#12121E] rounded-xl transition cursor-pointer"
                >
                  Submit & Generate Receipt
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
