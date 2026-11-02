import React, { useState } from 'react';
import { useCockpit } from '../../context/CockpitContext';
import { Lock, KeyRound, AlertCircle, X, ShieldAlert, ShieldCheck } from 'lucide-react';

export const AdminStepUpModal: React.FC = () => {
  const { isStepUpModalOpen, closeStepUpModal, performStepUpLogin, currentUser } = useCockpit();
  const [passphrase, setPassphrase] = useState<string>('sirmaur2035');
  const [totpCode, setTotpCode] = useState<string>('203501');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isStepUpModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      const res = performStepUpLogin(passphrase, totpCode);
      setIsSubmitting(false);
      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
      }
    }, 400);
  };

  const fillDemoCredentials = () => {
    setPassphrase('sirmaur2035');
    setTotpCode('203501');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-[#EEEEEB] shadow-xl overflow-hidden">
        {/* Modal Header */}
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
              <h3 className="text-base font-bold text-white tracking-tight">Step-Up Authentication</h3>
              <p className="text-xs text-[#8E8EA0]">Level 2 operational security elevation</p>
            </div>
          </div>
        </div>

        {/* User Scope Banner */}
        <div className="bg-[#F7F7F4] border-b border-[#EEEEEB] px-6 py-3 text-xs flex items-center justify-between">
          <div>
            <span className="text-[#85858D]">Operating Identity: </span>
            <span className="font-semibold text-[#20202B]">{currentUser.name}</span>
          </div>
          <div className="text-right">
            <span className="text-[#85858D]">Scope: </span>
            <span className="font-semibold text-[#20202B] bg-white px-2 py-0.5 rounded border border-[#EEEEEB]">
              {currentUser.adminScope || 'General Operations'}
            </span>
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
              Admin Passphrase
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#85858D]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Enter admin passphrase"
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#F7F7F4] border border-[#EEEEEB] rounded-xl text-[#20202B] focus:bg-white focus:outline-hidden focus:border-[#20202B] transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#20202B] mb-1">
              Second Factor (TOTP Authenticator Code)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#85858D]">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="text"
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                placeholder="6-digit code (e.g. 203501)"
                className="w-full pl-9 pr-3.5 py-2 text-xs font-mono tracking-widest bg-[#F7F7F4] border border-[#EEEEEB] rounded-xl text-[#20202B] focus:bg-white focus:outline-hidden focus:border-[#20202B] transition"
                required
              />
            </div>
            <p className="text-[11px] text-[#85858D] mt-1">
              Sent to registered authenticator device. 30-minute idle session timeout applies.
            </p>
          </div>

          {/* Quick Demo Autofill Pill */}
          <div className="p-3 rounded-xl bg-[#F7F7F4] border border-[#EEEEEB] text-xs text-[#5A5A66] flex items-center justify-between">
            <div>
              <span className="font-semibold text-[#20202B]">Demo Credentials:</span>
              <div className="font-mono text-[11px] text-[#85858D]">Pass: <code className="text-[#20202B] font-bold">sirmaur2035</code> | 2FA: <code className="text-[#20202B] font-bold">203501</code></div>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-[11px] font-semibold text-[#20202B] hover:underline bg-white px-2.5 py-1 rounded-lg border border-[#EEEEEB] cursor-pointer"
            >
              Autofill
            </button>
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
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#202033] hover:bg-[#12121E] rounded-xl transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#D7F36A]" />
                  <span>Verify & Enter Admin Mode</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
