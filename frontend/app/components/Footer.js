'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';
import config from '../config';

export default function Footer() {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  return (
    <footer className={`${themeColors.background} ${themeColors.border} border-t mt-auto`}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="/logo.png"
                alt={config.title}
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className={`font-bold text-xl ${themeColors.text}`}>{config.title}</span>
            </div>
            <p className={`${themeColors.textLight} mb-4`}>
              We believe in the power of culture as a tool for communication and understanding between peoples, and we work to provide diverse content through our platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`font-bold text-lg mb-4 ${themeColors.text}`}>Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className={`${themeColors.textLight} hover:text-blue-500 transition-colors`}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/posts" className={`${themeColors.textLight} hover:text-blue-500 transition-colors`}>
                  Posts
                </Link>
              </li>
              <li>
                <Link href="/categories" className={`${themeColors.textLight} hover:text-blue-500 transition-colors`}>
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className={`${themeColors.textLight} hover:text-blue-500 transition-colors`}>
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={`font-bold text-lg mb-4 ${themeColors.text}`}>Contact Us</h3>
            <ul className="space-y-2">
              <li className={themeColors.textLight}>
                Email: <a href={`mailto:${config.email}`} className="hover:underline">{config.email}</a>
              </li>
              <li className={themeColors.textLight}>
                Follow us on social media
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className={`mt-8 pt-4 border-t ${themeColors.border} text-center ${themeColors.textLight}`}>
          <p>  {new Date().getFullYear()}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
