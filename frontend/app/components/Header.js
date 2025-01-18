'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';
import config from '../config';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const themeColors = colors[theme];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={`${themeColors.background} ${themeColors.border} border-b fixed w-full top-0 z-50`}>
      <div className="container mx-auto">
        <div className="flex items-center h-16">
          {/* Logo - Right */}
          <div className="flex-shrink-0 ml-4 md:ml-8">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt={config.title}
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className={`font-bold text-xl ${themeColors.text} hidden md:inline`}>{config.title}</span>
              <span className={`font-bold text-xl ${themeColors.text} md:hidden`}>{config.shortTitle}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden ml-auto p-2"
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
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-grow justify-center space-x-14 p-4">
            <Link href="/" className={`${themeColors.text} hover:text-blue-700 transition-colors`}>
              
            </Link>
            <Link href="/" className={`${themeColors.text} hover:text-blue-700 transition-colors`}>
              Home
            </Link>
            <Link href="/posts" className={`${themeColors.text} hover:text-blue-700 transition-colors`}>
              Posts
            </Link>
            <Link href="/categories" className={`${themeColors.text} hover:text-blue-700 transition-colors`}>
              Categories
            </Link>
            <Link href="/about" className={`${themeColors.text} hover:text-blue-700 transition-colors`}>
              About
            </Link>
          </nav>

          {/* Theme Toggle */}
          <div className="flex-shrink-0 mr-8">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${themeColors.secondary} ${themeColors.hover} transition-colors`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-4 items-center">
              <Link
                href="/"
                className={`${themeColors.text} hover:text-blue-700 transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/posts"
                className={`${themeColors.text} hover:text-blue-700 transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Posts
              </Link>
              <Link
                href="/categories"
                className={`${themeColors.text} hover:text-blue-700 transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/about"
                className={`${themeColors.text} hover:text-blue-700 transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
