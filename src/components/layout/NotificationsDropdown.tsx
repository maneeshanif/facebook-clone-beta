'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { getInitials } from '@/lib/utils';
import { FaBell, FaUserPlus, FaComment, FaThumbsUp, FaBirthdayCake } from 'react-icons/fa';

interface Notification {
  id: string;
  type: 'friend_request' | 'comment' | 'like' | 'birthday' | 'mention';
  content: string;
  user: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  created_at: string;
  is_read: boolean;
  link: string;
}

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Fetch notifications
    const fetchNotifications = async () => {
      // In a real app, we would fetch from Supabase
      // For now, we'll use mock data
      
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'friend_request',
          content: 'sent you a friend request',
          user: {
            id: 'user1',
            full_name: 'Jane Smith',
            avatar_url: null,
          },
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          is_read: false,
          link: '/friends',
        },
        {
          id: '2',
          type: 'like',
          content: 'liked your post',
          user: {
            id: 'user2',
            full_name: 'John Doe',
            avatar_url: null,
          },
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          is_read: false,
          link: '/profile/me',
        },
        {
          id: '3',
          type: 'comment',
          content: 'commented on your post',
          user: {
            id: 'user3',
            full_name: 'Alice Johnson',
            avatar_url: null,
          },
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          is_read: true,
          link: '/profile/me',
        },
        {
          id: '4',
          type: 'birthday',
          content: 'has a birthday today',
          user: {
            id: 'user4',
            full_name: 'Bob Williams',
            avatar_url: null,
          },
          created_at: new Date().toISOString(),
          is_read: true,
          link: '/profile/user4',
        },
        {
          id: '5',
          type: 'mention',
          content: 'mentioned you in a comment',
          user: {
            id: 'user5',
            full_name: 'Carol Brown',
            avatar_url: null,
          },
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          is_read: true,
          link: '/profile/me',
        },
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.is_read).length);
    };
    
    fetchNotifications();
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleNotificationClick = (notificationId: string) => {
    // Mark notification as read
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, is_read: true } 
          : notification
      )
    );
    
    // Update unread count
    setUnreadCount(prev => Math.max(0, prev - 1));
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, is_read: true }))
    );
    setUnreadCount(0);
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'friend_request':
        return <FaUserPlus className="text-blue-600" />;
      case 'comment':
        return <FaComment className="text-green-600" />;
      case 'like':
        return <FaThumbsUp className="text-red-600" />;
      case 'birthday':
        return <FaBirthdayCake className="text-purple-600" />;
      default:
        return <FaBell className="text-blue-600" />;
    }
  };
  
  const formatNotificationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffMinutes < 24 * 60) {
      return `${Math.floor(diffMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffMinutes / (24 * 60))}d ago`;
    }
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full bg-gray-200 p-2 text-gray-700 hover:bg-gray-300"
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount}
          </div>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 md:w-96">
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h3 className="text-lg font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div>
                {notifications.map(notification => (
                  <Link
                    key={notification.id}
                    href={notification.link}
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`block border-b border-gray-100 p-4 hover:bg-gray-50 ${
                      !notification.is_read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex">
                      <div className="mr-3 flex-shrink-0">
                        {notification.user.avatar_url ? (
                          <Image
                            src={notification.user.avatar_url}
                            alt={notification.user.full_name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                            {getInitials(notification.user.full_name)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start">
                          <div className="flex-1">
                            <p className={`${!notification.is_read ? 'font-semibold' : ''}`}>
                              <span className="font-semibold">{notification.user.full_name}</span>{' '}
                              {notification.content}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatNotificationTime(notification.created_at)}
                            </p>
                          </div>
                          <div className="ml-2 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-200 p-2 text-center">
            <Link href="/notifications" className="block p-2 text-sm text-blue-600 hover:bg-gray-50">
              See all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
