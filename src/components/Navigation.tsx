'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Domů' },
  { href: '/recenze', label: 'Recenze' },
  { href: '/rezervace', label: 'Rezervace' },
  { href: '/galerie', label: 'Galerie' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-neutral-900/95 backdrop-blur-md border-b border-orange-500/20 animate-fadeInDown">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-orange-500/50">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent group-hover:tracking-wider transition-all duration-300">
              PneuServis
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  pathname === item.href
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Contact Button */}
          <div className="hidden md:block">
            <a
              href="tel:+420123456789"
              className="px-5 py-2 bg-brown-600 hover:bg-brown-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-brown-600/50"
            >
              +420 123 456 789
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-800 border-t border-orange-500/20 animate-slideDown">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="tel:+420123456789"
              className="block px-3 py-2 mt-2 bg-brown-600 text-white rounded-lg font-semibold text-center"
            >
              +420 123 456 789
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

