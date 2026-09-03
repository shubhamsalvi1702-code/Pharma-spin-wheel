import React, { useState } from 'react';
import { User, Phone, Store, MapPin, CheckSquare, Square, AlertCircle, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { RegistrationFormData } from '../types';

interface RegistrationModalProps {
  initialData?: Partial<RegistrationFormData>;
  onSubmit: (data: RegistrationFormData) => Promise<void> | void;
  isLoading: boolean;
  serverError: string | null;
  onBackToLanding: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  initialData,
  onSubmit,
  isLoading,
  serverError,
  onBackToLanding,
}) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    pharmacyName: initialData?.pharmacyName || '',
    city: initialData?.city || '',
    consentAccepted: initialData?.consentAccepted || false,
  });

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    pharmacyName?: string;
    city?: string;
    consent?: string;
  }>({});

  const handleChange = (field: keyof RegistrationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Pharmacist Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Please enter a valid name';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile Number is required';
    }

    if (!formData.pharmacyName.trim()) {
      newErrors.pharmacyName = 'Pharmacy Name is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.consentAccepted) {
      newErrors.consent = 'Please agree to participate before continuing';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 flex flex-col justify-between min-h-[calc(100vh-3.5rem)]">
      {/* Header Banner */}
      <div className="text-center pt-1 pb-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider mb-2 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
          <span className="text-cyan-600">Quick Pharmacist Registration</span>
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          Enter Your Details
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Fill in the 4 details below to activate your spin on the reward wheel.
        </p>
      </div>

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm"
      >
        <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
          {/* Server Error Alert */}
          {serverError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="font-medium">{serverError}</div>
            </div>
          )}

          {/* 1. Pharmacist Name */}
          <div>
            <label htmlFor="input-pharmacist-name" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Pharmacist Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="input-pharmacist-name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Ramesh Patil"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all ${
                  errors.name ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-cyan-600'
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-[11px] text-red-600 font-medium mt-1">{errors.name}</p>
            )}
          </div>

          {/* 2. Mobile Number */}
          <div>
            <label htmlFor="input-mobile-number" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="input-mobile-number"
                type="tel"
                placeholder="Enter mobile phone number"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono ${
                  errors.phone ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-cyan-600'
                }`}
              />
            </div>
            {errors.phone ? (
              <p className="text-[11px] text-red-600 font-medium mt-1">{errors.phone}</p>
            ) : (
              <p className="text-[10px] text-slate-400 mt-1 font-medium">Single spin per mobile phone number.</p>
            )}
          </div>

          {/* 3. Pharmacy Name */}
          <div>
            <label htmlFor="input-pharmacy-name" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Pharmacy Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Store className="w-4 h-4" />
              </div>
              <input
                id="input-pharmacy-name"
                type="text"
                placeholder="e.g. Apollo Pharmacy / Sanjivani Chemist"
                value={formData.pharmacyName}
                onChange={(e) => handleChange('pharmacyName', e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all ${
                  errors.pharmacyName ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-cyan-600'
                }`}
              />
            </div>
            {errors.pharmacyName && (
              <p className="text-[11px] text-red-600 font-medium mt-1">{errors.pharmacyName}</p>
            )}
          </div>

          {/* 4. City */}
          <div>
            <label htmlFor="input-city-name" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                id="input-city-name"
                type="text"
                placeholder="e.g. Mumbai, Pune, Ahmedabad, Delhi"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className={`w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all ${
                  errors.city ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-cyan-600'
                }`}
              />
            </div>
            {errors.city && (
              <p className="text-[11px] text-red-600 font-medium mt-1">{errors.city}</p>
            )}
          </div>

          {/* Consent Checkbox */}
          <div className="pt-1">
            <button
              id="checkbox-consent"
              type="button"
              onClick={() => handleChange('consentAccepted', !formData.consentAccepted)}
              className="flex items-start gap-2.5 text-left group cursor-pointer"
            >
              <div className="mt-0.5 shrink-0 text-cyan-600">
                {formData.consentAccepted ? (
                  <CheckSquare className="w-4.5 h-4.5 fill-cyan-600 text-white" />
                ) : (
                  <Square className="w-4.5 h-4.5 text-slate-300 group-hover:text-cyan-600" />
                )}
              </div>
              <span className="text-xs text-slate-700 leading-snug font-medium select-none">
                I agree to participate in the Spin & Win campaign. <span className="text-red-500">*</span>
              </span>
            </button>
            {errors.consent && (
              <p className="text-[11px] text-red-600 font-medium mt-1 pl-7">{errors.consent}</p>
            )}
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              id="btn-continue-to-spin"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-cyan-200 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Details...</span>
                </>
              ) : (
                <>
                  <span>CONTINUE TO SPIN</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Back button */}
      <div className="text-center py-2">
        <button
          id="btn-back-to-landing"
          type="button"
          onClick={onBackToLanding}
          className="text-xs text-slate-400 hover:text-slate-700 font-medium underline underline-offset-2 cursor-pointer"
        >
          ← Back to Campaign Overview
        </button>
      </div>
    </div>
  );
};
