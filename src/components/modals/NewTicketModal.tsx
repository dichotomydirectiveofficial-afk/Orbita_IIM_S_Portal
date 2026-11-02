import React, { useState } from 'react';
import { useCockpit } from '../../context/CockpitContext';
import { TicketPriority, Ticket } from '../../types';
import { Wrench, X, CheckCircle2 } from 'lucide-react';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledLocation?: string;
}

export const NewTicketModal: React.FC<NewTicketModalProps> = ({ 
  isOpen, 
  onClose,
  prefilledLocation 
}) => {
  const { createTicket, currentUser } = useCockpit();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Ticket['category']>('Plumbing');
  const [priority, setPriority] = useState<TicketPriority>('P2');
  const [location, setLocation] = useState(prefilledLocation || `${currentUser.roomOrOffice}`);
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTicket({
      title,
      description,
      category,
      priority,
      location,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80',
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setTitle('');
      setDescription('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#EEEEEB] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#202033] text-white p-6 pb-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#2B2B44] text-[#D7F36A] flex items-center justify-center font-bold border border-[#3A3A54]">
              <Wrench className="w-5 h-5 text-[#D7F36A]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Report a Campus Issue</h3>
              <p className="text-xs text-[#8E8EA0]">Central Control Room Dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8E8EA0] hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EAF6EE] text-[#1C6E3E] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#20202B]">Ticket Dispatched Successfully</h4>
            <p className="text-xs text-[#85858D]">
              Assigned tracking ID with active SLA countdown. You will receive updates.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#20202B] mb-1">
                Issue Summary / Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Geyser water pressure leakage in Room 312"
                className="w-full px-3.5 py-2 text-xs bg-[#F7F7F4] border border-[#EEEEEB] rounded-xl text-[#20202B] focus:bg-white focus:outline-hidden focus:border-[#20202B] transition"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#20202B] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs bg-[#F7F7F4] border border-[#EEEEEB] rounded-xl text-[#20202B] focus:bg-white focus:outline-hidden focus:border-[#20202B] transition cursor-pointer"
                >
                  <option value="Plumbing">Plumbing & Water</option>
                  <option value="Electrical">Electrical & Power</option>
                  <option value="HVAC / Fan">HVAC / Fan / AC</option>
                  <option value="Mess / Food">Mess & Food Service</option>
                  <option value="Network">Wi-Fi & Network</option>
                  <option value="Furniture">Hostel Furniture</option>
                  <option value="Housekeeping">Housekeeping & Hygiene</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#20202B] mb-1">
                  Priority (SLA)
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-xs bg-[#F7F7F4] border border-[#EEEEEB] rounded-xl text-[#20202B] font-semibold focus:bg-white focus:outline-hidden focus:border-[#20202B] transition cursor-pointer"
                >
                  <option value="P1">P1 - Critical (Resolve &lt;4h)</option>
                  <option value="P2">P2 - High (Resolve &lt;24h)</option>
                  <option value="P3">P3 - Normal (Resolve &lt;72h)</option>
                  <option value="P4">P4 - Low (Resolve &lt;7d)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#20202B] mb-1">
                Specific Location (Room, Floor, or Block)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Hostel Block B, Room 312"
                className="w-full px-3.5 py-2 text-xs bg-[#F7F7F4] border border-[#EEEEEB] rounded-xl text-[#20202B] focus:bg-white focus:outline-hidden focus:border-[#20202B] transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#20202B] mb-1">
                Description of Fault
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what is broken, leak rate, or safety hazard..."
                className="w-full px-3.5 py-2 text-xs bg-[#F7F7F4] border border-[#EEEEEB] rounded-xl text-[#20202B] focus:bg-white focus:outline-hidden focus:border-[#20202B] transition"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#85858D] hover:text-[#20202B] hover:bg-[#F7F7F4] rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#202033] hover:bg-[#12121E] rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5 text-[#D7F36A]" />
                <span>Submit Ticket</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
