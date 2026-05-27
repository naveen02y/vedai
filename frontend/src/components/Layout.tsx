'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#ECECEE] font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden p-4 pb-24 md:pb-4 gap-4 relative">
        <Topbar />
        <main className="flex-1 overflow-y-auto pr-1 relative">
          <div className="max-w-6xl mx-auto h-full">
            {children}
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
