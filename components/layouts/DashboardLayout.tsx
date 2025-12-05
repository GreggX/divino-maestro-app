import { ReactNode } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { DashboardNav } from './DashboardNav';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <DashboardNav />
      <main className="py-10">{children}</main>
    </div>
  );
}
