import React from 'react';
import { Sparkles, Shield, Gift, Award, CheckCircle2, ChevronRight, PackageCheck, Umbrella, Flame, Scissors, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { PrizeConfig } from '../types';

interface LandingViewProps {
  onStart: () => void;
  prizes: PrizeConfig[];
}

export const LandingView: React.FC<LandingViewProps> = ({ onStart, prizes }) => {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-6 flex flex-col items-center justify-between min-h-[calc(100vh-3.5rem)]">
      {/* Top Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold mb-3 shadow-2xs"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest">Meyer Rewards</span>
        <span className="text-slate-300">|</span>
        <span className="text-slate-600 font-bold">Happy Pharmacist Day</span>
      </motion.div>

      {/* Main Campaign Hero Section */}
      <div className="text-center w-full my-auto flex flex-col items-center">
        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative inline-block mb-1"
        >
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight leading-none uppercase">
            MEYER REWARDS
          </h1>
          <p className="text-[11px] text-cyan-600 mt-1 uppercase tracking-[0.2em] font-extrabold">
            Happy Pharmacist Day Special
          </p>
        </motion.div>

        {/* Subheadline */}
        <motion.h2
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-xl font-bold text-slate-700 mt-2 tracking-tight"
        >
          Spin to reveal your surprise reward!
        </motion.h2>

        {/* Supporting Line */}
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-xs sm:text-sm text-slate-500 font-normal mt-1.5 max-w-xs mx-auto leading-relaxed"
        >
          All prizes are hidden on the wheel for a special surprise. Enter your details and spin to discover what you win!
        </motion.p>

        {/* Visual Showcase: Scissors, Kettle, Umbrella and 3 Surprises */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="w-full bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mt-5 mb-3 text-left"
        >
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-cyan-600" />
              Meyer Rewards Pool
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
              6 Rewards
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {/* 1. Scissors */}
            <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center hover:border-emerald-200 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5 shadow-2xs border border-emerald-100">
                <Scissors className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-800 tracking-wider uppercase">SCISSORS</span>
            </div>

            {/* 2. Kettle */}
            <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center hover:border-cyan-200 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center mb-1.5 shadow-2xs border border-cyan-100">
                <Flame className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-800 tracking-wider uppercase">KETTLE</span>
            </div>

            {/* 3. Umbrella */}
            <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center hover:border-sky-200 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-1.5 shadow-2xs border border-sky-100">
                <Umbrella className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-800 tracking-wider uppercase">UMBRELLA</span>
            </div>

            {/* 4. Surprise #1 */}
            <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center hover:border-indigo-200 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1.5 shadow-2xs border border-indigo-100 font-black text-sm">
                ?
              </div>
              <span className="text-[10px] font-bold text-slate-800 tracking-wider uppercase">SURPRISE #1</span>
            </div>

            {/* 5. Surprise #2 */}
            <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center hover:border-cyan-200 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center mb-1.5 shadow-2xs border border-cyan-100 font-black text-sm">
                ?
              </div>
              <span className="text-[10px] font-bold text-slate-800 tracking-wider uppercase">SURPRISE #2</span>
            </div>

            {/* 6. Surprise #3 */}
            <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center hover:border-slate-300 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center mb-1.5 shadow-2xs border border-slate-200 font-black text-sm">
                ?
              </div>
              <span className="text-[10px] font-bold text-slate-800 tracking-wider uppercase">SURPRISE #3</span>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Instant MR Verified Claim
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              1 Spin / Mobile
            </span>
          </div>
        </motion.div>
      </div>

      {/* Prominent CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="w-full pt-2 pb-3"
      >
        <button
          id="btn-start-spinning"
          onClick={onStart}
          className="w-full py-4 px-6 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-sm sm:text-base tracking-wider uppercase shadow-lg shadow-cyan-200 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>SPIN FOR SURPRISE REWARD</span>
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>
        <p className="text-[10px] text-center text-slate-400 mt-2.5 font-medium uppercase tracking-wider">
          Happy Pharmacist Day Celebration
        </p>
      </motion.div>
    </div>
  );
};
