'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { cn, getInitials } from '@/lib/utils';
import { BsSearch, BsThreeDots } from 'react-icons/bs';

interface RightSidebarProps {
  className?: string;
}

interface Friend {
  id: string;
  full_name: string;
  avatar_url: string | null;
  online: boolean;
}

export default function RightSidebar({ className }: RightSidebarProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for now - in a real app, this would come from the database
  useEffect(() => {
    const mockFriends: Friend[] = [
      { id: '1', full_name: 'Jane Smith', avatar_url: null, online: true },
      { id: '2', full_name: 'John Doe', avatar_url: null, online: true },
      { id: '3', full_name: 'Alice Johnson', avatar_url: null, online: false },
      { id: '4', full_name: 'Bob Williams', avatar_url: null, online: true },
      { id: '5', full_name: 'Carol Brown', avatar_url: null, online: false },
      { id: '6', full_name: 'David Miller', avatar_url: null, online: true },
      { id: '7', full_name: 'Eve Davis', avatar_url: null, online: false },
      { id: '8', full_name: 'Frank Wilson', avatar_url: null, online: true },
    ];
    
    setFriends(mockFriends);
  }, []);
  
  const filteredFriends = friends.filter(friend => 
    friend.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <aside className={cn("rounded-lg bg-white p-4 shadow", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700">Contacts</h2>
        <div className="flex space-x-2">
          <button className="rounded-full p-1 hover:bg-gray-200">
            <BsSearch />
          </button>
          <button className="rounded-full p-1 hover:bg-gray-200">
            <BsThreeDots />
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search friends"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
      </div>
      
      <ul className="space-y-2">
        {filteredFriends.map(friend => (
          <li key={friend.id}>
            <button className="flex w-full items-center rounded-lg p-2 hover:bg-gray-100">
              <div className="relative">
                {friend.avatar_url ? (
                  <Image
                    src={friend.avatar_url}
                    alt={friend.full_name}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                    {getInitials(friend.full_name)}
                  </div>
                )}
                {friend.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>
                )}
              </div>
              <span className="ml-3">{friend.full_name}</span>
            </button>
          </li>
        ))}
      </ul>
      
      <hr className="my-4 border-gray-300" />
      
      <div>
        <h3 className="mb-2 font-semibold text-gray-500">Group Conversations</h3>
        <ul className="space-y-2">
          <li>
            <button className="flex w-full items-center rounded-lg p-2 hover:bg-gray-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                G
              </div>
              <span className="ml-3">Gaming Squad</span>
            </button>
          </li>
          <li>
            <button className="flex w-full items-center rounded-lg p-2 hover:bg-gray-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                F
              </div>
              <span className="ml-3">Family Group</span>
            </button>
          </li>
          <li>
            <button className="flex w-full items-center rounded-lg p-2 hover:bg-gray-100">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                W
              </div>
              <span className="ml-3">Work Team</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}
