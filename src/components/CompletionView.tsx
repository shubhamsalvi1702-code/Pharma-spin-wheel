import React from 'react';
import { CheckCircle2, Award, Gift, Calendar, Clock, Store, MapPin, User, Phone, ShieldCheck, Flame, Umbrella as UmbrellaIcon, Scissors, PackageCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Participant } from '../types';

interface CompletionViewProps {
  participant: Participant;
  onResetToLanding?: () => void;
}

export const CompletionView: React.FC<CompletionViewProps> = ({
  participant,
  onResetToLanding,
}) => {
  const getPrizeIcon = () => {
    switch (participant.prizeId) {
      case 'kettle':
        return <Flame className="w-6 h-6 text-teal-600" />;
      case 'umbrella':
        return <UmbrellaIcon className="w-6 h-6 text-sky-600" />;
      case 'scissor':
        return <Scissors className="w-6 h-6 text-emerald-600" />;
      case 'mystery_gift':
        return <Gift className="w-6 h-6 text-indigo-600" />;
      case 'product':
        return <PackageCheck className="w-6 h-6 text-cyan-600" />;
      default:
        return <Award className="w-6 h-6 text-slate-500" />;
    }
  };

  const maskedPhone = participant.phone
    ? participant.phone.length > 5
      ? `${participant.phone.slice(0, 3)}••••${participant.phone.slice(-3)}`
      : participant.phone
    : '';

  return (
    <div className="w-full max-w-md mx-auto px-4 py-5 flex flex-col items-center justify-between min-h-[calc(100vh-3.5rem)]">
      {/* Top Completion Header */}
      <div className="text-center pt-2 pb-3 w-full">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2.5 shadow-2xs border border-emerald-100"
        >
          <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
        </motion.div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight uppercase">
          THANK YOU FOR PARTICIPATING!
        </h1>

        {participant.isWin ? (
          <p className="text-xs font-semibold text-cyan-800 mt-2 px-3 py-2 leading-relaxed bg-cyan-50 rounded-xl border border-cyan-100">
            “Please show your winning screen to your MR to claim your reward.”
          </p>
        ) : (
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Your participation has been successfully recorded in the campaign registry.
          </p>
        )}
      </div>

      {/* Official Digital Participation & Claim Pass */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden my-auto"
      >
        {/* Pass Header */}
        <div className={`px-4 py-3 flex items-center justify-between ${
          participant.isWin
            ? 'bg-slate-900 text-white'
            : 'bg-slate-800 text-white'
        }`}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {participant.isWin ? 'Pharmacist Winner Voucher' : 'Participation Receipt'}
            </span>
          </div>
          <span className="text-[11px] font-mono bg-white/10 px-2 py-0.5 rounded font-bold">
            {participant.claimCode}
          </span>
        </div>

        {/* Prize Outcome Section */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center">
              {getPrizeIcon()}
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                Reward Result
              </span>
              <span className="text-base font-black text-slate-800 tracking-tight uppercase">
                {participant.prizeName}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
              participant.isWin
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-600'
            }`}>
              {participant.isWin ? 'CLAIMABLE' : 'RECORDED'}
            </span>
          </div>
        </div>

        {/* Participant Details Table */}
        <div className="p-4 space-y-2.5 text-xs text-slate-700">
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Pharmacist Name
            </span>
            <span className="font-bold text-slate-800">{participant.name}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              Mobile Number
            </span>
            <span className="font-mono font-bold text-slate-800">{maskedPhone}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Store className="w-3.5 h-3.5 text-slate-400" />
              Pharmacy Name
            </span>
            <span className="font-bold text-slate-800">{participant.pharmacyName}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              City
            </span>
            <span className="font-bold text-slate-800">{participant.city}</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Date & Time
            </span>
            <span className="font-mono text-slate-600">{participant.date} at {participant.time}</span>
          </div>
        </div>

        {/* Security watermark footer */}
        <div className="bg-slate-50 px-4 py-2 text-[10px] text-slate-400 flex items-center justify-between font-mono border-t border-slate-100">
          <span>Ref ID: {participant.id}</span>
          <span>1 Spin / Mobile Verified</span>
        </div>
      </motion.div>

      {/* Done Button */}
      <div className="w-full pt-4 pb-2">
        <button
          id="btn-completion-done"
          onClick={() => {
            if (onResetToLanding) onResetToLanding();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-cyan-200 active:scale-95 transition-all cursor-pointer"
        >
          DONE
        </button>
      </div>
    </div>
  );
};
