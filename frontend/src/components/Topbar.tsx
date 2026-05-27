'use client';

import { Bell, ChevronDown, ArrowLeft, Grip, Menu } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  let title = 'Assignment';
  let showBack = false;

  if (pathname === '/assignments/new') {
    title = 'Create Assignment';
    showBack = true;
  } else if (pathname.startsWith('/assignments/output/')) {
    title = 'Assignment Output';
    showBack = true;
  }

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-gradient-to-r from-orange-500 via-orange-400 to-green-500 backdrop-blur-md z-20 shrink-0 rounded-[32px] shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-orange-300/40 w-full relative">
      {/* Desktop Left */}
      <div className="hidden md:flex items-center gap-4">
        {showBack ? (
          <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700 transition-colors border border-gray-100/60 shadow-sm">
            <ArrowLeft size={16} />
          </button>
        ) : (
          <button className="w-8 h-8 flex items-center justify-center bg-gray-50/50 rounded-full text-gray-400 cursor-not-allowed border border-gray-100/30">
            <ArrowLeft size={16} />
          </button>
        )}
        <div className="flex items-center gap-2 text-white/80">
           <Grip size={18} className="text-white" />
           <span className="text-white font-semibold text-[15px] ml-1">{title}</span>
        </div>
      </div>

      {/* Mobile Left */}
      <div className="md:hidden flex items-center gap-2">
        {showBack ? (
           <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 transition-colors mr-2">
             <ArrowLeft size={18} />
           </button>
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-[#FF5E3A] to-[#F95016] rounded-xl flex items-center justify-center text-white font-bold text-xl leading-none pt-1">
            V
          </div>
        )}
        <span className="font-bold text-xl tracking-tight text-white">{showBack ? title : 'VedaAI'}</span>
      </div>
      
      {/* Right side controls */}
      <div className="flex items-center gap-3">
        {/* Desktop user menu */}
        <div className="hidden md:flex items-center gap-4">
          {/* Circular Notification Bell Button */}
          <button className="relative w-9 h-9 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white border border-white/20 shadow-sm transition-all hover:scale-[1.02]">
            <Bell size={18} className="text-white" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF5E3A] rounded-full border-2 border-white shadow-sm"></span>
          </button>
          
          {/* Profile Picker Dropdown */}
          <div className="flex items-center gap-2 bg-white/20 border border-white/20 rounded-full py-1 px-1.5 pr-3 shadow-sm hover:bg-white/30 cursor-pointer transition-all hover:scale-[1.01] hover:border-white/30">
            <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center border border-white shadow-sm bg-white">
              <img src="/john_doe_avatar.png" alt="John Doe Profile" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-bold text-white">John Doe</span>
            <ChevronDown size={14} className="text-white ml-0.5" />
          </div>
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-3">
          <button className="relative text-white p-1">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF5E3A] rounded-full border-2 border-white shadow-sm"></span>
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-white border border-gray-100 shadow-sm">
            <img src="/john_doe_avatar.png" alt="John Doe Profile" className="w-full h-full object-cover" />
          </div>
          <button className="text-white p-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 py-2 z-50 md:hidden flex flex-col overflow-hidden">
            <Link href="/" className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/groups" className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>My Groups</Link>
            <Link href="/assignments" className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>Assignments</Link>
            <Link href="/ai-toolkit" className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>AI Teacher's Toolkit</Link>
            <Link href="/library" className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50" onClick={() => setMobileMenuOpen(false)}>My Library</Link>
          </div>
        )}
      </div>
    </header>
  );
}
