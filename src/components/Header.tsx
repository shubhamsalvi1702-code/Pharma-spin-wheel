import React from 'react';
import { Volume2, VolumeX, ShieldCheck, Stethoscope } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenAdmin: () => void;
  onResetToHome?: () => void;
  currentStep: string;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenAdmin,
  onResetToHome,
  currentStep,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand & Logo */}
        <button
          id="btn-header-home"
          onClick={onResetToHome}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-95 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600 font-black text-lg border border-cyan-100 shadow-2xs">
            +
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-slate-800 font-sans uppercase">
                MEYER<span className="text-cyan-600">REWARDS</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200/80 uppercase tracking-wider">
                Special
              </span>
            </div>
            <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-wider leading-none mt-0.5">
              Happy Pharmacist Day
            </p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            id="btn-toggle-audio"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute audio' : 'Unmute audio'}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-cyan-600 hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            title={soundEnabled ? 'Sound On' : 'Sound Off'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          <button
            id="btn-open-admin-portal"
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-white hover:bg-cyan-50 hover:text-cyan-700 border border-slate-200 shadow-2xs hover:border-cyan-200 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};
