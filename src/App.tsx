/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingView } from './components/LandingView';
import { RegistrationModal } from './components/RegistrationModal';
import { SpinWheel } from './components/SpinWheel';
import { ResultModal } from './components/ResultModal';
import { CompletionView } from './components/CompletionView';
import { AlreadyParticipatedModal } from './components/AlreadyParticipatedModal';
import { AdminDashboard } from './components/AdminDashboard';
import { soundFx } from './utils/audio';
import { CampaignConfig, Participant, PrizeConfig, RegistrationFormData } from './types';

export default function App() {
  const [currentStep, setCurrentStep] = useState<'landing' | 'registration' | 'wheel' | 'completion'>('landing');
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    phone: '',
    pharmacyName: '',
    city: '',
    consentAccepted: false,
  });

  const [prizes, setPrizes] = useState<PrizeConfig[]>([]);
  const [campaignConfig, setCampaignConfig] = useState<CampaignConfig | null>(null);

  // Active game states
  const [activeParticipant, setActiveParticipant] = useState<Participant | null>(null);
  const [currentPrize, setCurrentPrize] = useState<PrizeConfig | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showAlreadyParticipatedModal, setShowAlreadyParticipatedModal] = useState(false);
  const [previousParticipation, setPreviousParticipation] = useState<Participant | undefined>(undefined);

  // UI state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [isSubmittingSpin, setIsSubmittingSpin] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  // Fetch campaign config on mount
  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        setCampaignConfig(data);
        if (data.prizes) {
          setPrizes(data.prizes);
        }
      })
      .catch((err) => {
        console.error('Failed to load campaign config:', err);
      });
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.enabled = next;
  };

  // Start from Landing
  const handleStartLanding = () => {
    setCurrentStep('registration');
  };

  // Check phone and advance from registration
  const handleRegistrationSubmit = async (data: RegistrationFormData) => {
    setFormData(data);
    setRegistrationError(null);
    setIsVerifyingPhone(true);

    try {
      const res = await fetch('/api/check-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: data.phone }),
      });

      const json = await res.json();

      if (!res.ok) {
        setRegistrationError(json.error || 'Please enter a valid mobile phone number.');
        setIsVerifyingPhone(false);
        return;
      }

      if (json.alreadyParticipated) {
        setPreviousParticipation(json.participant);
        setShowAlreadyParticipatedModal(true);
        setIsVerifyingPhone(false);
        return;
      }

      // Allowed to continue to spin
      setIsVerifyingPhone(false);
      setCurrentStep('wheel');
    } catch (err) {
      setRegistrationError('Something went wrong. Please check your network and try again.');
      setIsVerifyingPhone(false);
    }
  };

  // Spin Request: calls backend /api/spin securely
  const handleSpinRequest = async (): Promise<{ sliceIndex: number; prize: PrizeConfig } | null> => {
    setIsSubmittingSpin(true);

    try {
      const res = await fetch('/api/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          pharmacyName: formData.pharmacyName,
          city: formData.city,
        }),
      });

      const data = await res.json();

      if (res.status === 409 || data.alreadyParticipated) {
        setPreviousParticipation(data.participant);
        setShowAlreadyParticipatedModal(true);
        setIsSubmittingSpin(false);
        return null;
      }

      if (!res.ok || !data.success) {
        setRegistrationError(data.error || 'Something went wrong. Please try again.');
        setIsSubmittingSpin(false);
        return null;
      }

      setActiveParticipant(data.participant);
      setCurrentPrize(data.prize);
      setIsSubmittingSpin(false);

      return {
        sliceIndex: data.sliceIndex,
        prize: data.prize,
      };
    } catch (err) {
      console.error('Spin API error:', err);
      setIsSubmittingSpin(false);
      return null;
    }
  };

  // Spin Animation Finished -> Open Result Modal
  const handleSpinComplete = (prize: PrizeConfig) => {
    setShowResultModal(true);
  };

  // Result Modal Done -> Advance to Completion Screen
  const handleResultDone = () => {
    setShowResultModal(false);
    setCurrentStep('completion');
  };

  // Reset to landing page
  const handleResetToHome = () => {
    setCurrentStep('landing');
    setRegistrationError(null);
  };

  return (
    <div className="min-h-screen bg-sleek-canvas flex flex-col justify-between selection:bg-cyan-600 selection:text-white relative">
      {/* Header */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onResetToHome={handleResetToHome}
        currentStep={currentStep}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col items-center justify-center w-full py-2">
        {currentStep === 'landing' && (
          <LandingView
            onStart={handleStartLanding}
            prizes={prizes}
          />
        )}

        {currentStep === 'registration' && (
          <RegistrationModal
            initialData={formData}
            onSubmit={handleRegistrationSubmit}
            isLoading={isVerifyingPhone}
            serverError={registrationError}
            onBackToLanding={() => setCurrentStep('landing')}
          />
        )}

        {currentStep === 'wheel' && (
          <SpinWheel
            participantData={formData}
            prizes={prizes}
            onSpinRequest={handleSpinRequest}
            onSpinComplete={handleSpinComplete}
            isSubmitting={isSubmittingSpin}
          />
        )}

        {currentStep === 'completion' && activeParticipant && (
          <CompletionView
            participant={activeParticipant}
            onResetToLanding={handleResetToHome}
          />
        )}
      </main>

      {/* Result Pop-up Modal */}
      {showResultModal && currentPrize && activeParticipant && (
        <ResultModal
          prize={currentPrize}
          participant={activeParticipant}
          onDone={handleResultDone}
        />
      )}

      {/* Already Participated Pop-up Modal */}
      {showAlreadyParticipatedModal && (
        <AlreadyParticipatedModal
          participant={previousParticipation}
          onViewPreviousResult={() => {
            setShowAlreadyParticipatedModal(false);
            if (previousParticipation) {
              setActiveParticipant(previousParticipation);
              setCurrentStep('completion');
            }
          }}
          onClose={() => setShowAlreadyParticipatedModal(false)}
        />
      )}

      {/* Admin Dashboard Drawer / Modal */}
      {isAdminOpen && (
        <AdminDashboard onClose={() => setIsAdminOpen(false)} />
      )}
    </div>
  );
}
