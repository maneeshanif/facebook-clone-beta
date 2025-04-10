'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { FaFacebook, FaSearch, FaHome, FaUserFriends, FaVideo, FaStore, FaGamepad } from 'react-icons/fa';
import { BsMessenger } from 'react-icons/bs';
import NotificationsDropdown from './NotificationsDropdown';
import { getInitials } from '@/lib/utils';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar_url: string | null;
}

export default function Navbar() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!error && data) {
          setProfile(data);
        }
      }
    };

    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left section */}
        <div className="flex items-center">
          <Link href="/" className="mr-2 text-blue-600">
            <FaFacebook size={40} />
          </Link>
          <div className="relative ml-2 hidden md:block">
            <input
              type="text"
              placeholder="Search Facebook"
              className="w-64 rounded-full bg-gray-100 py-2 pl-10 pr-4 focus:outline-none"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
          </div>
        </div>

        {/* Middle section - Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-2">
            <li className="rounded-lg px-10 py-2 hover:bg-gray-100">
              <Link href="/" className="text-blue-600">
                <FaHome size={25} />
              </Link>
            </li>
            <li className="rounded-lg px-10 py-2 hover:bg-gray-100">
              <Link href="/friends" className="text-gray-600">
                <FaUserFriends size={25} />
              </Link>
            </li>
            <li className="rounded-lg px-10 py-2 hover:bg-gray-100">
              <Link href="/watch" className="text-gray-600">
                <FaVideo size={25} />
              </Link>
            </li>
            <li className="rounded-lg px-10 py-2 hover:bg-gray-100">
              <Link href="/marketplace" className="text-gray-600">
                <FaStore size={25} />
              </Link>
            </li>
            <li className="rounded-lg px-10 py-2 hover:bg-gray-100">
              <Link href="/gaming" className="text-gray-600">
                <FaGamepad size={25} />
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right section */}
        <div className="flex items-center space-x-2">
          <Link href="/messages" className="rounded-full bg-gray-200 p-2 text-gray-700 hover:bg-gray-300">
            <BsMessenger size={20} />
          </Link>
          <NotificationsDropdown />
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center rounded-full hover:bg-gray-200"
            >
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                  {profile ? getInitials(profile.full_name) : 'U'}
                </div>
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                <Link
                  href={`/profile/${profile?.id}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Your Profile
                </Link>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
