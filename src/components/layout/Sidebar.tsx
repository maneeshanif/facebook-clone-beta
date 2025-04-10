'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn, getInitials } from '@/lib/utils';
import { FaUserFriends, FaStore, FaVideo, FaCalendarAlt, FaBookmark, FaFlag, FaGamepad, FaBriefcase, FaHandHoldingHeart } from 'react-icons/fa';
import { BsPeopleFill, BsClockHistory } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { profile } = useSelector((state: RootState) => state.user);

  return (
    <aside className={cn("rounded-lg bg-white p-4 shadow", className)}>
      <nav>
        <ul className="space-y-2">
          {profile?.id ? (
            <li>
              <Link
                href={`/profile/${profile.id}`}
                className="flex items-center rounded-lg p-2 hover:bg-gray-100"
              >
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    width={36}
                    height={36}
                    className="mr-3 rounded-full"
                  />
                ) : (
                  <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                    {getInitials(profile.full_name)}
                  </div>
                )}
                <span className="font-medium">{profile.full_name}</span>
              </Link>
            </li>
          ) : null}

          <li>
            <Link
              href="/friends"
              className="flex items-center rounded-lg p-2 hover:bg-gray-100"
            >
              <FaUserFriends className="mr-3 text-blue-600" size={24} />
              <span>Friends</span>
            </Link>
          </li>

          <li>
            <Link
              href="/groups"
              className="flex items-center rounded-lg p-2 hover:bg-gray-100"
            >
              <BsPeopleFill className="mr-3 text-blue-600" size={24} />
              <span>Groups</span>
            </Link>
          </li>

          <li>
            <Link
              href="/marketplace"
              className="flex items-center rounded-lg p-2 hover:bg-gray-100"
            >
              <FaStore className="mr-3 text-blue-600" size={24} />
              <span>Marketplace</span>
            </Link>
          </li>

          <li>
            <Link
              href="/jobs"
              className="flex items-center rounded-lg p-2 hover:bg-gray-100"
            >
              <FaBriefcase className="mr-3 text-blue-600" size={24} />
              <span>Jobs</span>
            </Link>
          </li>

          <li>
            <Link
              href="/watch"
              className="flex items-center rounded-lg p-2 hover:bg-gray-100"
            >
              <FaVideo className="mr-3 text-blue-600" size={24} />
              <span>Watch</span>
            </Link>
          </li>

          <li>
            <Link
              href="/gaming"
              className="flex items-center rounded-lg p-2 hover:bg-gray-100"
            >
              <FaGamepad className="mr-3 text-blue-600" size={24} />
              <span>Gaming</span>
            </Link>
          </li>

          <li>
            <Link
              href="/memories"
              className="flex items-center rounded-lg p-2 hover:bg-gray-100"
            >
              <BsClockHistory className="mr-3 text-blue-600" size={24} />
              <span>Memories</span>
            </Link>
          </li>

          <li>
            <Link
              href="/events"
              className="flex items-center rounded-lg p-2 hover:bg-gray-100"
            >
              <FaCalendarAlt className="mr-3 text-blue-600" size={24} />
              <span>Events</span>
            </Link>
          </li>

          <li>
            <Link
              href="/saved"
              className="flex items-center rounded-lg p-2 hover:bg-gray-100"
            >
              <FaBookmark className="mr-3 text-blue-600" size={24} />
              <span>Saved</span>
            </Link>
          </li>

          <li>
            <Link
              href="/fundraisers"
              className="flex items-center rounded-lg p-2 hover:bg-gray-100"
            >
              <FaHandHoldingHeart className="mr-3 text-blue-600" size={24} />
              <span>Fundraisers</span>
            </Link>
          </li>

          <li>
            <Link
              href="/pages"
              className="flex items-center rounded-lg p-2 hover:bg-gray-100"
            >
              <FaFlag className="mr-3 text-blue-600" size={24} />
              <span>Pages</span>
            </Link>
          </li>
        </ul>
      </nav>

      <hr className="my-4 border-gray-300" />

      <div>
        <h3 className="mb-2 font-semibold text-gray-500">Your Shortcuts</h3>
        <ul className="space-y-2">
          <li>
            <Link
              href="#"
              className="flex items-center rounded-lg p-2 hover:bg-gray-100"
            >
              <div className="mr-3 h-8 w-8 rounded bg-gray-200"></div>
              <span>Gaming Group</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center rounded-lg p-2 hover:bg-gray-100"
            >
              <div className="mr-3 h-8 w-8 rounded bg-gray-200"></div>
              <span>Tech News</span>
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="flex items-center rounded-lg p-2 hover:bg-gray-100"
            >
              <div className="mr-3 h-8 w-8 rounded bg-gray-200"></div>
              <span>Job Seekers</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
