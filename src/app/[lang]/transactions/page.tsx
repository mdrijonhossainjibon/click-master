"use client";

import { useTranslation } from 'react-i18next';
import TransactionHistory from '@/components/TransactionHistory';

export default function TransactionsPage() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-[#0C0D0F]">
      <TransactionHistory />
    </div>
  );
} 