'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { HiHome, HiNewspaper, HiVideoCamera, HiFolder, HiLogout, HiPhotograph } from 'react-icons/hi';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'Home', icon: HiHome, path: '/dashboard' },
    { name: 'Articles', icon: HiNewspaper, path: '/dashboard/posts' },
    { name: 'Videos', icon: HiVideoCamera, path: '/dashboard/videos' },
    { name: 'Categories', icon: HiFolder, path: '/dashboard/categories' },
    { name: 'Media Library', icon: HiPhotograph, path: '/dashboard/media' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="h-screen w-64 bg-white shadow-lg fixed right-0 top-0 flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
      </div>
      
      <nav className="mt-6 flex-grow">
        <ul>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-2 px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${
                    isActive ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600' : ''
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="border-t p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-6 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <HiLogout className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
