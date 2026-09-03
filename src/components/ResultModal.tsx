import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Gift, CheckCircle2, Flame, Umbrella as UmbrellaIcon, Scissors, PackageCheck, Award, HeartHandshake, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { soundFx } from '../utils/audio';
import { Participant, PrizeConfig } from '../types';

interface ResultModalProps {
  prize: PrizeConfig;
  participant: Participant;
  onDone: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  prize,
  participant,
  onDone,
}) => {
  useEffect(() => {
    if (prize.isWin) {
      soundFx.playWin();

      // Launch pleasant celebratory confetti
      const count = 200;
      const defaults = {
        origin: { y: 0.6 },
        zIndex: 9999,
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
        colors: ['#0d9488', '#0284c7', '#f59e0b', '#10b981'],
      });
      fire(0.2, {
        spread: 60,
        colors: ['#0d9488', '#6366f1', '#f59e0b'],
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }
  }, [prize.isWin]);

  const getPrizeIcon = () => {
    switch (prize.id) {
      case 'kettle':
        return <Flame className="w-12 h-12 text-teal-600" />;
      case 'umbrella':
        return <UmbrellaIcon className="w-12 h-12 text-sky-600" />;
      case 'scissor':
        return <Scissors className="w-12 h-12 text-emerald-600" />;
      case 'mystery_gift':
        return <Gift className="w-12 h-12 text-indigo-600" />;
      case 'product':
        return <PackageCheck className="w-12 h-12 text-cyan-600" />;
      default:
        return <HeartHandshake className="w-12 h-12 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl border border-slate-200 overflow-hidden relative"
      >
        {/* Decorative background orb */}
        <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-cyan-100/40 blur-xl pointer-events-none"></div>

        {/* Win Status Banner */}
        <div className="relative z-10">
          {prize.isWin ? (
            <>
              {/* Header */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider mb-3 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600 fill-cyan-500" />
                <span className="text-cyan-600">Official Campaign Winner</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-tight uppercase">
                CONGRATULATIONS!
              </h2>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-600 mt-1.5">
                YOU WON
              </p>

              {/* Prize Highlight Box */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="my-4 py-5 px-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-white shadow-xs flex items-center justify-center mb-3 border border-slate-200/80">
                  {getPrizeIcon()}
                </div>

                <h3 className="text-2xl font-black text-slate-800 tracking-wider uppercase">
                  {prize.name}
                </h3>
              </motion.div>

              {/* MR Claim Instruction */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 mb-5">
                <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                  “Please show this screen to your MR to claim your reward.”
                </p>
                <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600 font-mono">
                  <span>Pharmacist: <strong className="text-slate-800">{participant.name}</strong></span>
                  <span className="bg-cyan-50 text-cyan-700 border border-cyan-200 px-2 py-0.5 rounded-lg font-bold">{participant.claimCode}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Blank result */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Participation Verified</span>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-slate-50 shadow-xs flex items-center justify-center mx-auto mb-3 text-slate-400 border border-slate-200">
                <Award className="w-8 h-8" />
              </div>

              <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                BETTER LUCK NEXT TIME!
              </h2>

              <p className="text-xs text-slate-500 font-medium mt-2 mb-5 leading-relaxed">
                “Thank you for participating.”
              </p>

              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 mb-5 text-left text-xs text-slate-600">
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-400">Pharmacist:</span>
                  <span className="font-semibold text-slate-800">{participant.name}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-400">Pharmacy:</span>
                  <span className="font-semibold text-slate-800">{participant.pharmacyName}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-400">City:</span>
                  <span className="font-semibold text-slate-800">{participant.city}</span>
                </div>
              </div>
            </>
          )}

          {/* DONE Button */}
          <button
            id="btn-result-done"
            onClick={onDone}
            className="w-full py-4 px-6 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-cyan-200 active:scale-95 transition-all cursor-pointer"
          >
            DONE
          </button>
        </div>
      </motion.div>
    </div>
  );
};
