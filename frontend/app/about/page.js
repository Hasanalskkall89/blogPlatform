'use client';

import Image from 'next/image';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';
import config from '../config';

export default function About() {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className={`text-3xl font-bold mb-8 text-center ${themeColors.text}`}>
        About Our News Platform
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
        <div>
          <Image
            src="/about-image.png"
            alt="News Image"
            width={500}
            height={300}
            className="rounded-full shadow-lg"
          />
        </div>
        <div className={`${themeColors.text}`}>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="mb-4">
            We are a comprehensive news platform dedicated to bringing you the latest updates
            in news, sports, technology, and culture. Our mission is to provide accurate,
            timely, and engaging content to our readers worldwide.
          </p>
          <p className="mb-4">
            We believe in the power of quality journalism and strive to maintain high
            standards of reporting, ensuring our readers stay well-informed about current
            events, sports developments, and cultural trends.
          </p>
        </div>
      </div>

      <div className={`${themeColors.text} mb-12`}>
        <h2 className="text-2xl font-semibold mb-4">Our Goals</h2>
        <ul className="list-disc list-inside space-y-3 mr-4">
          <li>Deliver breaking news and in-depth coverage</li>
          <li>Provide comprehensive sports coverage</li>
          <li>Share engaging cultural and entertainment content</li>
          <li>Maintain high journalistic standards</li>
          <li>Build a community of informed readers</li>
        </ul>
      </div>

      {/* Documents Section */}
      <div className={`${themeColors.text} mb-12`}>
        <h2 className="text-2xl font-semibold mb-6">Editorial Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="/assets/guidelines.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Editorial Standards</h3>
              <p className="text-sm text-gray-600">View our editorial guidelines and policies</p>
            </div>
          </a>

          <a
            href="/assets/about.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">About Our Team</h3>
              <p className="text-sm text-gray-600">Meet our editorial team and contributors</p>
            </div>
          </a>
        </div>
      </div>

      <div className={`${themeColors.text}`}>
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-4">
          We welcome your feedback and suggestions. Get in touch with us through:
        </p>
        <ul className="list-none space-y-2">
          <li>
            <strong>Email:</strong>{' '}
            <a href={`mailto:${config.email}`} className="hover:underline">
              {config.email}
            </a>
          </li>
          <li>
            <strong>Address:</strong> Berlin, Germany
          </li>
        </ul>
      </div>
    </div>
  );
}
