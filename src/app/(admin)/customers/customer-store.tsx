"use client";

import { createContext, useContext, useState, type ReactNode } from 'react';
import { previewCustomers, type Customer } from '@/lib/customer-preview';

const CustomerContext = createContext<{
  customers: Customer[]; addCustomer: (customer: Customer) => void;
  query: string; setQuery: (value: string) => void;
  page: number; setPage: (value: number) => void;
  size: 10 | 50 | 100; setSize: (value: 10 | 50 | 100) => void;
} | null>(null);

export default function CustomerStore({children}: {children: ReactNode}) {
  const [customers, setCustomers] = useState(previewCustomers);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState<10 | 50 | 100>(10);
  return <CustomerContext.Provider value={{customers, addCustomer: customer => setCustomers(rows => [customer,...rows]), query, setQuery, page, setPage, size, setSize}}>{children}</CustomerContext.Provider>;
}

export function useCustomers() {
  const context = useContext(CustomerContext);
  if (!context) throw new Error('CustomerStore is required');
  return context;
}
