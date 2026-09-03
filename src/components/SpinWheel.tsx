import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Loader2, Award, Flame, Umbrella as UmbrellaIcon, Scissors, Gift, PackageCheck, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { soundFx } from '../utils/audio';
import { PrizeConfig, RegistrationFormData } from '../types';

interface SpinWheelProps {
  participantData: RegistrationFormData;
  prizes: PrizeConfig[];
  onSpinRequest: () => Promise<{ sliceIndex: number; prize: PrizeConfig } | null>;
  onSpinComplete: (prize: PrizeConfig) => void;
  isSubmitting: boolean;
}

export const SpinWheel: React.FC<SpinWheelProps> = ({
  participantData,
  prizes,
  onSpinRequest,
  onSpinComplete,
  isSubmitting,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [spinError, setSpinError] = useState<string | null>(null);
  const currentAngleRef = useRef(0);
  const lastTickAngleRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Wheel configuration
  const numSlices = 6;
  const sliceAngle = 360 / numSlices; // 60 degrees

  // Sleek alternating dual-tone palette for mystery surprise slices
  const sliceThemes = [
    { bg: '#ffffff', text: '#0e7490', label: 'SURPRISE', icon: '?' },
    { bg: '#e0f2fe', text: '#0369a1', label: 'MEYER GIFT', icon: '?' },
    { bg: '#f8fafc', text: '#047857', label: 'SURPRISE', icon: '?' },
    { bg: '#e0f2fe', text: '#4338ca', label: 'MEYER GIFT', icon: '?' },
    { bg: '#ffffff', text: '#0891b2', label: 'SURPRISE', icon: '?' },
    { bg: '#f1f5f9', text: '#334155', label: 'MEYER GIFT', icon: '?' },
  ];

  // Render SVG Slice Paths
  const getSlicePath = (index: number) => {
    const startAngle = index * sliceAngle;
    const endAngle = (index + 1) * sliceAngle;
    const radius = 180;
    const cx = 200;
    const cy = 200;

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
  };

  const handleStartSpin = async () => {
    if (isSpinning || isSubmitting) return;
    setSpinError(null);

    // Call backend API to securely retrieve winning slice
    const result = await onSpinRequest();
    if (!result) {
      return;
    }

    const { sliceIndex, prize } = result;

    setIsSpinning(true);

    // Mathematical alignment for top pointer (12 o'clock, 0° offset)
    const targetSliceRotation = (360 - (sliceIndex * 60 + 30)) % 360;

    // Add slight natural jitter within slice (±10 degrees)
    const jitter = (Math.random() - 0.5) * 16;

    // Add 6 to 8 full rotations
    const fullSpins = (6 + Math.floor(Math.random() * 2)) * 360;

    // Calculate next absolute rotation starting from current angle
    const currentBase = currentAngleRef.current;
    const currentModulo = currentBase % 360;
    let delta = targetSliceRotation - currentModulo;
    if (delta < 0) delta += 360;

    const finalTargetAngle = currentBase + fullSpins + delta + jitter;

    // Spin animation with custom physics easing and audio ticks
    const startTime = performance.now();
    const duration = 5200; // 5.2 seconds
    const startAngle = currentAngleRef.current;
    const totalChange = finalTargetAngle - startAngle;

    // Ease-out cubic with smooth deceleration
    const easeOutCustom = (t: number) => {
      return 1 - Math.pow(1 - t, 4);
    };

    const animateWheel = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCustom(progress);
      const currentVal = startAngle + totalChange * easedProgress;

      setRotationAngle(currentVal);
      currentAngleRef.current = currentVal;

      // Play tick sound when passing each slice peg (every 60 degrees)
      if (Math.abs(currentVal - lastTickAngleRef.current) >= 30) {
        soundFx.playTick(1 + progress * 0.2);
        lastTickAngleRef.current = currentVal;
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animateWheel);
      } else {
        // Animation finished!
        setIsSpinning(false);
        setTimeout(() => {
          onSpinComplete(prize);
        }, 500);
      }
    };

    animFrameRef.current = requestAnimationFrame(animateWheel);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 flex flex-col items-center justify-between min-h-[calc(100vh-3.5rem)]">
      {/* Participant Header Info */}
      <div className="w-full text-center pt-1 pb-2">
        <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-[10px] font-bold uppercase tracking-widest mb-1.5 shadow-2xs">
          <Sparkles className="w-3 h-3 text-cyan-600" />
          <span>Happy Pharmacist Day</span>
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none uppercase">
          MEYER REWARDS
        </h2>
        <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-[0.2em] font-medium">
          Surprise Wheel • Spin to Reveal
        </p>
      </div>

      {/* Wheel Area Container */}
      <div className="relative w-full flex items-center justify-center my-auto py-3">
        {/* Sleek Wheel Outer Frame */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
          {/* Top Pointer Indicator (Sleek Cyan Triangle Arrow) */}
          <div 
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-9 bg-cyan-600 z-30 drop-shadow-md clip-sleek-pointer"
          />

          {/* Wheel Frame with Sleek Border */}
          <div className="w-full h-full rounded-full border-[8px] border-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.08)] bg-white overflow-hidden relative flex items-center justify-center">
            {/* Rotating SVG Canvas */}
            <div
              className="w-full h-full rounded-full overflow-hidden relative z-10"
              style={{
                transform: `rotate(${rotationAngle}deg)`,
                transition: isSpinning ? 'none' : 'transform 0.1s ease-out',
              }}
            >
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full select-none"
                style={{ transformOrigin: 'center' }}
              >
                {/* 6 Equal Mystery Slices */}
                {sliceThemes.map((slice, i) => {
                  const angle = i * 60 + 30; // Center angle of slice in degrees
                  const rad = ((angle - 90) * Math.PI) / 180;
                  
                  // Position for surprise badge
                  const badgeX = 200 + 130 * Math.cos(rad);
                  const badgeY = 200 + 130 * Math.sin(rad);

                  // Position for surprise label text
                  const textX = 200 + 82 * Math.cos(rad);
                  const textY = 200 + 82 * Math.sin(rad);

                  return (
                    <g key={i}>
                      {/* Slice wedge */}
                      <path
                        d={getSlicePath(i)}
                        fill={slice.bg}
                        stroke="#e2e8f0"
                        strokeWidth="1.5"
                      />

                      {/* Mystery Question Mark Badge */}
                      <g
                        transform={`translate(${badgeX}, ${badgeY}) rotate(${angle})`}
                        textAnchor="middle"
                      >
                        <circle
                          cx="0"
                          cy="0"
                          r="17"
                          fill={slice.bg === '#ffffff' ? '#e0f2fe' : '#ffffff'}
                          stroke="#cbd5e1"
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="6"
                          fill={slice.text}
                          fontSize="18"
                          fontWeight="900"
                          fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
                        >
                          ?
                        </text>
                      </g>

                      {/* Mystery Surprise Label Text */}
                      <g
                        transform={`translate(${textX}, ${textY}) rotate(${angle})`}
                        textAnchor="middle"
                      >
                        <text
                          x="0"
                          y="4"
                          fill={slice.text}
                          fontSize="10.5"
                          fontWeight="900"
                          fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
                          letterSpacing="0.1em"
                        >
                          {slice.label}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {/* Inner Accent Ring */}
                <circle cx="200" cy="200" r="140" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.6" />

                {/* Center Hub Outer Ring */}
                <circle cx="200" cy="200" r="36" fill="#ffffff" stroke="#e2e8f0" strokeWidth="4" />
                
                {/* Center Hub Inner Core with MEYER initials */}
                <circle cx="200" cy="200" r="24" fill="#0891b2" />
                <text
                  x="200"
                  y="204"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="900"
                  fontFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
                  textAnchor="middle"
                  letterSpacing="0.05em"
                >
                  MEYER
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Spin Controls & Instructions */}
      <div className="w-full pt-2 pb-2">
        {spinError && (
          <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
            {spinError}
          </div>
        )}

        <button
          id="btn-spin-now"
          onClick={handleStartSpin}
          disabled={isSpinning || isSubmitting}
          className={`w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg tracking-wider uppercase shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            isSpinning || isSubmitting
              ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
              : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-200 active:scale-95'
          }`}
        >
          {isSpinning ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>SPINNING...</span>
            </>
          ) : isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>ALLOCATING PRIZE...</span>
            </>
          ) : (
            <>
              <span>SPIN NOW</span>
            </>
          )}
        </button>

        <p className="text-[10px] text-center text-slate-400 mt-2.5 font-medium uppercase tracking-wider">
          {isSpinning
            ? 'Good luck! Wheel is coming to a halt...'
            : 'Tap SPIN NOW and discover your reward!'}
        </p>

        {/* Verified Pharmacist Footer Bar */}
        <div className="mt-4 p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3 text-left">
          <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Verified Pharmacist</p>
            <p className="text-xs font-bold text-slate-700 truncate mt-0.5">{participantData.name} ({participantData.city})</p>
          </div>
        </div>
      </div>
    </div>
  );
};
