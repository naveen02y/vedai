'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutGrid, 
  Users, 
  FileText, 
  BookOpen, 
  Settings, 
  Sparkles,
  Layers
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { name: 'Home', href: '/', icon: LayoutGrid },
  { name: 'My Groups', href: '/groups', icon: Users },
  { name: 'Assignments', href: '/assignments', icon: FileText, badge: 10 },
  { name: "AI Teacher's Toolkit", href: '/ai-toolkit', icon: Layers },
  { name: 'My Library', href: '/library', icon: BookOpen },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 bg-gradient-to-b from-orange-500 via-orange-400 to-green-500 backdrop-blur-md h-[calc(100vh-2rem)] my-4 ml-4 flex-col justify-between py-6 px-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-10 sticky top-4 border border-orange-300/40 rounded-[32px]">
      <div>
        <div className="flex items-center gap-2.5 px-2 mb-8">
          <div className="w-9 h-9 bg-gradient-to-br from-[#FF5E3A] to-[#F95016] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_4px_12px_rgba(249,80,22,0.3)] pt-0.5">
            V
          </div>
          <span className="font-bold text-xl tracking-tight text-white">VedaAI</span>
        </div>

        <Link href="/assignments/new">
          <button className="w-full mb-8 bg-white/20 text-white hover:bg-white/30 shadow-[0_8px_20px_rgba(0,0,0,0.15)] rounded-full py-3 px-4 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] border border-white/20 hover:border-white/40 backdrop-blur-sm">
            <Sparkles size={16} className="text-white" />
            <span className="font-semibold text-sm">Create Assignment</span>
          </button>
        </Link>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href) && (item.href !== '/' || pathname === '/');
            return (
              <Link key={item.name} href={item.href}>
                <div className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors cursor-pointer",
                  isActive ? "bg-white/25 text-white font-semibold backdrop-blur-sm" : "text-white/80 hover:bg-white/15 hover:text-white"
                )}>
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className={cn(isActive ? "text-white" : "text-white/70")} />
                    {item.name}
                  </div>
                  {item.badge && (
                    <span className="bg-green-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </nav>
      </div>

      <div>
        <div className="px-3 py-2.5 mb-3 flex items-center gap-3 text-sm text-white/80 hover:text-white hover:bg-white/15 rounded-xl cursor-pointer transition-colors">
          <Settings size={18} className="text-white/70" />
          Settings
        </div>
        
        <div className="bg-white/20 rounded-2xl p-3 flex items-center gap-3 border border-white/20 shadow-sm backdrop-blur-sm">
          <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm bg-white">
             <img src="/school_avatar.png" alt="Delhi Public School Mascot" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">Delhi Public School</p>
            <p className="text-xs text-white/80 truncate font-medium">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
