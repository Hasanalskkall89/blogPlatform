'use client';

import Image from 'next/image';
import config from '../config';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
        About Blog Platform
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
        <div>
          <Image
            src="/about-image.png"
            alt="Platform Image"
            width={500}
            height={300}
            className="rounded-full shadow-lg"
          />
        </div>
        <div className="text-gray-800 dark:text-gray-100">
          <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            We strive to build bridges and share stories through our blog platform.
            We focus on delivering quality content and engaging multimedia experiences.
          </p>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            We believe that content is a powerful tool for communication and understanding.
            We work to deliver authentic and meaningful stories to our audience.
          </p>
        </div>
      </div>

      <div className="text-gray-800 dark:text-gray-100 mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Goals</h2>
        <ul className="list-disc list-inside space-y-3 mr-4 text-gray-600 dark:text-gray-300">
          <li>Enhance content sharing and discovery</li>
          <li>Host engaging multimedia content</li>
          <li>Support creative talents and writers</li>
          <li>Document and preserve valuable content</li>
          <li>Build a community of readers and content creators</li>
        </ul>
      </div>

      {/* Documents Section */}
      <div className="text-gray-800 dark:text-gray-100 mb-12">
        <h2 className="text-2xl font-semibold mb-6">Platform Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="/assets/constitution.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 border border-gray-100 dark:border-gray-700"
          >
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Platform Constitution</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">View the Blog Platform Constitution</p>
            </div>
          </a>

          <a
            href="/assets/identification.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 border border-gray-100 dark:border-gray-700"
          >
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Identification Card</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">View the Platform Identification</p>
            </div>
          </a>
        </div>
      </div>

      <div className="text-gray-800 dark:text-gray-100">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          We welcome your feedback and suggestions. You can contact us via:
        </p>
        <ul className="list-none space-y-2 text-gray-600 dark:text-gray-300">
          <li>
            <strong className="text-gray-800 dark:text-gray-100">Email:</strong>{' '}
            <a href={`mailto:${config.email}`} className="hover:underline hover:text-blue-500">
              {config.email}
            </a>
          </li>
          <li>
            <strong className="text-gray-800 dark:text-gray-100">Address:</strong> Germany - Berlin
          </li>
        </ul>
      </div>
    </div>
  );
}

