'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Users, FileText, BookOpen, Layers } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { name: 'Home', href: '/', icon: LayoutGrid },
  { name: 'Assignments', href: '/assignments', icon: FileText, badge: 10 },
  { name: 'Library', href: '/library', icon: BookOpen },
  { name: 'AI Toolkit', href: '/ai-toolkit', icon: Layers },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-gradient-to-r from-orange-500 to-green-500 text-gray-400 rounded-3xl pb-2 pt-2 px-6 flex justify-between items-center shadow-[0_8px_30px_rgba(0,0,0,0.4)] z-50 h-[4.5rem]">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href) && (item.href !== '/' || pathname === '/');
        
        return (
          <Link key={item.name} href={item.href} className="flex flex-col items-center justify-center w-16 h-full gap-1">
            <div className="relative">
              <item.icon 
                size={22} 
                className={cn(isActive ? "text-white" : "text-gray-200")} 
              />
              {item.badge && (
                <span className="absolute -top-1 -right-2 bg-green-700 text-white text-[10px] font-bold px-1 rounded-full border border-orange-500">
                  {item.badge}
                </span>
              )}
            </div>
            <span className={cn(
              "text-[10px] font-medium text-center",
              isActive ? "text-white" : "text-gray-200"
            )}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
