'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CrisisModal } from '@/components/CrisisModal';
import { LegalModal } from '@/components/LegalModal';

export function Providers({ children }) {
  const [crisisOpen, setCrisisOpen] = useState(false);
  const [legalState, setLegalState] = useState({ isOpen: false, mode: 'terms' });

  const handleOpenLegal = (mode) => {
    setLegalState({ isOpen: true, mode });
  };

  return (
    <>
      <Header onOpenCrisis={() => setCrisisOpen(true)} />
      
      <div className="flex-1 flex flex-col">
        {children}
      </div>

      <Footer 
        onOpenLegal={handleOpenLegal} 
        onOpenCrisis={() => setCrisisOpen(true)} 
      />

      <CrisisModal 
        isOpen={crisisOpen} 
        onClose={() => setCrisisOpen(false)} 
      />

      <LegalModal 
        isOpen={legalState.isOpen} 
        mode={legalState.mode} 
        onClose={() => setLegalState({ isOpen: false, mode: 'terms' })} 
      />
    </>
  );
}
