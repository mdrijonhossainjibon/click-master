'use client';

import { create } from 'zustand';

type ModalType = 'withdrawal' | 'deposit' | 'history' | 'topEarners' | 'rules' | 'about' | 'liveSupport';

interface ModalsState {
  isWithdrawalModalOpen: boolean;
  isHistoryModalOpen: boolean;
  isTopEarnersModalOpen: boolean;
  isRulesModalOpen: boolean;
  isAboutModalOpen: boolean;
  isLiveSupportModalOpen: boolean;
  setIsWithdrawalModalOpen: (isOpen: boolean) => void;
  setIsHistoryModalOpen: (isOpen: boolean) => void;
  setIsTopEarnersModalOpen: (isOpen: boolean) => void;
  setIsRulesModalOpen: (isOpen: boolean) => void;
  setIsAboutModalOpen: (isOpen: boolean) => void;
  setIsLiveSupportModalOpen: (isOpen: boolean) => void;
}

export const useModals = create<ModalsState>((set) => ({
  isWithdrawalModalOpen: false,
  isHistoryModalOpen: false,
  isTopEarnersModalOpen: false,
  isRulesModalOpen: false,
  isAboutModalOpen: false,
  isLiveSupportModalOpen: false,
  setIsWithdrawalModalOpen: (isOpen) => set({ isWithdrawalModalOpen: isOpen }),
  setIsHistoryModalOpen: (isOpen) => set({ isHistoryModalOpen: isOpen }),
  setIsTopEarnersModalOpen: (isOpen) => set({ isTopEarnersModalOpen: isOpen }),
  setIsRulesModalOpen: (isOpen) => set({ isRulesModalOpen: isOpen }),
  setIsAboutModalOpen: (isOpen) => set({ isAboutModalOpen: isOpen }),
  setIsLiveSupportModalOpen: (isOpen) => set({ isLiveSupportModalOpen: isOpen })
})); 