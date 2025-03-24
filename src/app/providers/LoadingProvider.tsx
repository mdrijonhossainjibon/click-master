'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import LoadingScreen from '../components/LoadingScreen';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  showLoading: (label?: string) => void;
  hideLoading: () => void;
  label: string;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [label, setLabel] = useState('Loading...');

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const showLoading = useCallback((customLabel?: string) => {
    if (customLabel) setLabel(customLabel);
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
    setLabel('Loading...');
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setLoading,
        showLoading,
        hideLoading,
        label
      }}
    >
      {children}
      {isLoading && <LoadingScreen label={label} spinning={isLoading} />}
    </LoadingContext.Provider>
  );
}