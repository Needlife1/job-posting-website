"use client";

import { logout } from '@/lib/auth';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  
  const {data: session} = useSession();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href={'/'} className="flex items-center">
              <Image
                src="/logo.png"
                alt="Job Board Logo"
                width={40}
                height={40}
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Job Board
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              href={'/jobs'}
            >
              Browse Jobs
            </Link>

            {session ? (
              <>
                <Link
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  href={'/jobs/post'}
                >
                  Post a Jobs
                </Link>

                <Link
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  href={'/dashboard'}
                >
                  Dashboard
                </Link>

                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                href={'/auth/signin'}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
