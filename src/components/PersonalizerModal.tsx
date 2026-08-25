import { useState, useEffect } from 'react';
import { Gift } from 'lucide-react';

interface PersonalizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  messageText: string;
  onSave: (name: string, message: string) => void;
  onReset: () => void;
}

export default function PersonalizerModal({
  isOpen,
  onClose,
  recipientName,
  messageText,
  onSave,
  onReset
}: PersonalizerModalProps) {
  const [modalName, setModalName] = useState(recipientName);
  const [modalMessage, setModalMessage] = useState(messageText);

  useEffect(() => {
    if (isOpen) {
      setModalName(recipientName);
      setModalMessage(messageText);
    }
  }, [isOpen, recipientName, messageText]);

  const handleSave = () => {
    onSave(modalName, modalMessage);
    onClose();
  };

  const handleReset = () => {
    onReset();
    // Close modal after resetting so user sees default values applied
    onClose();
  };

  return (
    <div
      className={`modal-overlay fixed inset-0 bg-slate-950/85 backdrop-blur-md z-3000 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {isOpen && (
        <div className="glass-card modal-card w-full max-w-lg p-8 relative flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
          <div className="modal-header flex justify-between items-center pb-2 border-b border-white/10">
            <h3 className="font-heading text-xl md:text-2xl text-primary font-bold flex items-center gap-2">
              <Gift className="w-6 h-6" /> Personalize Birthday Gift 🎁
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-2xl font-bold bg-transparent border-none cursor-pointer p-1"
            >
              &times;
            </button>
          </div>

          <div className="form-group flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-300">Recipient Name</label>
            <input
              type="text"
              value={modalName}
              onChange={(e) => setModalName(e.target.value)}
              className="form-control w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors"
              placeholder="Enter recipient name"
            />
          </div>

          <div className="form-group flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-300">Personal Birthday Message</label>
            <textarea
              value={modalMessage}
              onChange={(e) => setModalMessage(e.target.value)}
              rows={5}
              className="form-control w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white focus:outline-none focus:border-primary focus:bg-white/10 transition-colors resize-none"
              placeholder="Enter custom heartfelt message"
            />
          </div>

          <div className="flex gap-3 justify-end mt-4">
            <button
              onClick={handleReset}
              className="btn-secondary text-sm px-4 py-2.5"
            >
              Reset Default
            </button>
            <button
              onClick={handleSave}
              className="btn-glow text-sm px-6 py-2.5 cursor-pointer"
            >
              Save Changes ❤️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
