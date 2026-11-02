import React, { useState } from 'react';
import { useCockpit } from '../../context/CockpitContext';
import { Lock, ShieldCheck, KeyRound, AlertCircle, X, ShieldAlert } from 'lucide-react';

export const AdminStepUpModal: React.FC = () => {
  const { isStepUpModalOpen, closeStepUpModal, performStepUpLogin } = useCockpit();
  const [adminPassId, setAdminPassId] = useState<string>('ADM-2035-SIRMAUR');
  const [passcode, setPasscode] = useState<string>('2035');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isStepUpModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      const res = performStepUpLogin(adminPassId, passcode);
      setIsSubmitting(false);
      if (!res.success) {
        setErrorMessage(res.error || 'Authorization failed. Please verify credentials.');
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-[#EEEEEB] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative bg-[#202033] text-white p-6 pb-5">
          <button
            onClick={closeStepUpModal}
            className="absolute top-4 right-4 text-[#8E8EA0] hover:text-white transition p-1 rounded-lg hover:bg-white/10 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#2B2B44] text-[#D7F36A] flex items-center justify-center border border-[#3A3A54]">
              <ShieldAlert className="w-5 h-5 text-[#D7F36A]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Administrative Authorization Pass</h3>
              <p className="text-xs text-[#8E8EA0]">Restricted Operations Console Clearance</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="flex items-start space-x-2 p-3 rounded-xl bg-[#FDE8E8] border border-[#D32F2F]/30 text-[#B71C1C] text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#20202B] mb-1">
              Admin Authorization ID Pass
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#85858D]">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={adminPassId}
                onChange={(e) => setAdminPassId(e.target.value)}
                placeholder="e.g. ADM-2035-SIRMAUR"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs font-mono font-bold bg-[#F7F7F4] border border-[#EEEEEB] rounded-xl text-[#20202B] focus:bg-white focus:outline-hidden focus:border-[#20202B] transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#20202B] mb-1">
              Security Passcode / PIN
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#85858D]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter 4-to-6 digit security PIN"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs font-mono tracking-widest bg-[#F7F7F4] border border-[#EEEEEB] rounded-xl text-[#20202B] focus:bg-white focus:outline-hidden focus:border-[#20202B] transition"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={closeStepUpModal}
              className="px-4 py-2 text-xs font-medium text-[#85858D] hover:text-[#20202B] hover:bg-[#F7F7F4] rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#202033] hover:bg-[#12121E] rounded-xl transition flex items-center space-x-2 cursor-pointer disabled:opacity-50 shadow-xs"
            >
              {isSubmitting ? (
                <span>Verifying Pass...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#D7F36A]" />
                  <span>Authorize & Enter Console</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
