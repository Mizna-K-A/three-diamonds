'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './components/Adminsidebar';
import { Menu } from 'lucide-react';

// Map path segments to human-readable names
const PAGE_TITLES = {
  '/admin': 'Dashboard',
  '/admin/properties': 'Properties',
  '/admin/viewings': 'Viewing Requests',
  '/admin/proposals': 'Proposal Requests',
  '/admin/contacts': 'Contact Submissions',
  '/admin/property-types': 'Property Types',
  '/admin/property-statuses': 'Property Statuses',
  '/admin/tags': 'Property Tags',
  '/admin/insights': 'Insights',
  '/admin/hero-slides': 'Home Slides',
  '/admin/team': 'Team Members',
  '/admin/agents': 'Agents',
  '/admin/testimonials': 'Testimonials',
  '/admin/contact-info': 'Contact Info',
};

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Get current page title — match longest prefix first
  const currentTitle = Object.entries(PAGE_TITLES)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([path]) => pathname === path || pathname?.startsWith(path + '/'))?.[1]
    ?? 'Admin';

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      {/* Main content with left margin for sidebar */}
      <main className="lg:ml-60 transition-all duration-300">
        {/* Mobile header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-[#111111] border-b border-gray-800 h-14 flex items-center px-4 gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors shrink-0"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-white font-semibold text-sm truncate">{currentTitle}</span>
            <span className="text-gray-600 text-xs hidden xs:inline">· Admin</span>
          </div>
        </div>

        {/* Content with padding for mobile header */}
        <div className="pt-14 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}