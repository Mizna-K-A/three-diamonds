'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Users,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Layout,
  Building2,
  Tag,
  Tags,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Properties', href: '/admin/properties', icon: Home }, // Add this
  { name: 'Property Types', href: '/admin/property-types', icon: Building2 },
  { name: 'Property Statuses', href: '/admin/property-statuses', icon: Tag },
  { name: 'Property Tags', href: '/admin/tags', icon: Tags },
];

export const Sidebar = ({ mobileOpen, onMobileClose }) => {
  const [minimized, setMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);


const handleLogout = async () => {
  await fetch("/api/admin/logout", { method: "POST" });
  router.push("/login");
};
  const isActive = (href) => pathname === href;

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-30 bg-black/80 lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        style={{
          fontFamily: "'DM Sans', sans-serif",
          width: minimized ? '72px' : '240px',
          transition: 'width 0.3s ease-in-out',
          backgroundColor: '#111111',
          borderRight: '1px solid #222222',
        }}
        className={`fixed top-0 left-0 h-full z-40 flex flex-col shadow-xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform lg:transition-[width] duration-300`}
      >
        {/* Logo / Brand */}
        <div className="relative flex items-center h-16 px-4 border-b border-gray-800">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Icon mark */}
            <div
              style={{
                backgroundColor: '#2a2a2a',
                minWidth: '36px',
              }}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
            >
              <Layout size={18} className="text-gray-400" strokeWidth={2} />
            </div>

            {/* Wordmark */}
            <div
              style={{
                opacity: minimized ? 0 : 1,
                transform: minimized ? 'translateX(-8px)' : 'translateX(0)',
                transition: 'opacity 0.2s, transform 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              <p
                style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.5px' }}
                className="text-white font-bold text-[15px] leading-none"
              >
                AdminPanel
              </p>
              <p className="text-gray-500 text-[10px] mt-0.5 font-medium tracking-widest uppercase">
                v1.0.0
              </p>
            </div>
          </div>

          {/* Mobile close */}
          <button
            onClick={onMobileClose}
            className="ml-auto lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
          {!minimized && (
            <p className="text-gray-600 text-[9px] font-semibold tracking-[0.15em] uppercase px-3 mb-3">
              MENU
            </p>
          )}

          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={minimized ? item.name : undefined}
                style={{
                  justifyContent: minimized ? 'center' : 'flex-start',
                }}
                className={`group relative flex items-center gap-3 h-10 px-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {active && (
                  <span
                    style={{
                      background: '#6b7280',
                    }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                  />
                )}

                <Icon
                  size={18}
                  strokeWidth={active ? 2.2 : 1.8}
                  style={{
                    color: active ? '#ffffff' : '#9ca3af',
                    minWidth: '18px',
                  }}
                />

                {!minimized && (
                  <span>{item.name}</span>
                )}

                {/* Tooltip when minimized */}
                {minimized && (
                  <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1 bg-gray-900 text-gray-300 text-xs font-medium rounded-lg border border-gray-800 shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-150 z-50">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 p-3 space-y-3">
          {/* User info */}
          {!minimized && (
            <div className="flex items-center gap-3 px-2 py-2">
              <div
                style={{
                  background: '#2a2a2a',
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 text-xs font-bold shrink-0"
              >
                AD
              </div>
              <div className="overflow-hidden">
                <p className="text-gray-300 text-sm font-semibold truncate leading-none">
                  Admin User
                </p>
                <p className="text-gray-600 text-xs mt-0.5 truncate">
                  admin@company.com
                </p>
              </div>
            </div>
          )}

          {/* Minimize Button */}
          <button
            onClick={() => setMinimized(!minimized)}
            className={`w-full flex items-center gap-3 h-10 px-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-150 ${
              minimized ? 'justify-center' : 'justify-between'
            }`}
          >
            <div className="flex items-center gap-3">
              {minimized ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              {!minimized && <span>Collapse</span>}
            </div>
            {!minimized && <span className="text-xs text-gray-600">⌘ B</span>}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title={minimized ? 'Logout' : undefined}
            style={{ justifyContent: minimized ? 'center' : 'flex-start' }}
            className="group relative w-full flex items-center gap-3 h-10 px-3 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 transition-all duration-150"
          >
            <LogOut size={18} strokeWidth={1.8} className="shrink-0" />
            {!minimized && <span>Log out</span>}

            {minimized && (
              <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1 bg-gray-900 text-gray-300 text-xs font-medium rounded-lg border border-gray-800 shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-150 z-50">
                Log out
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}