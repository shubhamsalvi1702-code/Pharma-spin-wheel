import React from 'react';
import { AlertTriangle, ShieldAlert, Award, ArrowRight, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Participant } from '../types';

interface AlreadyParticipatedModalProps {
  participant?: Participant;
  onViewPreviousResult: () => void;
  onClose: () => void;
}

export const AlreadyParticipatedModal: React.FC<AlreadyParticipatedModalProps> = ({
  participant,
  onViewPreviousResult,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl border border-slate-200 relative"
      >
        <button
          id="btn-close-already-participated"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 border border-amber-200 shadow-2xs">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">
          Already Participated
        </h3>

        <p className="text-xs font-bold text-slate-700 mt-2 leading-snug">
          “You have already participated in this campaign.”
        </p>

        <p className="text-[11px] text-slate-400 mt-1 mb-4">
          Each mobile number is entitled to exactly one spin in accordance with campaign rules.
        </p>

        {participant && (
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 mb-5 text-left text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400">Pharmacist:</span>
              <span className="font-bold text-slate-800">{participant.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400">Mobile:</span>
              <span className="font-mono font-bold text-slate-800">{participant.phone}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400">Prize Allocated:</span>
              <span className="font-extrabold text-cyan-700">{participant.prizeName}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Claim Code:</span>
              <span className="font-mono font-bold text-slate-800">{participant.claimCode}</span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {participant && (
            <button
              id="btn-view-previous-voucher"
              onClick={onViewPreviousResult}
              className="w-full py-3.5 px-4 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-200 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span>View Claim Voucher</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            id="btn-dismiss-already-participated"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
