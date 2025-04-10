'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { getInitials } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import { FaUserPlus, FaUserMinus, FaCheck, FaTimes, FaSearch } from 'react-icons/fa';

interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  sender: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  created_at: string;
  friend: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

interface SuggestedFriend {
  id: string;
  full_name: string;
  avatar_url: string | null;
  mutual_friends: number;
}

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'requests' | 'suggestions'>('all');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [suggestedFriends, setSuggestedFriends] = useState<SuggestedFriend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchUserAndFriends = async () => {
      setIsLoading(true);
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = '/login';
        return;
      }
      
      setCurrentUserId(session.user.id);
      
      // In a real app, we would fetch from Supabase
      // For now, we'll use mock data
      
      // Mock friends data
      const mockFriends: Friend[] = [
        {
          id: '1',
          user_id: session.user.id,
          friend_id: 'friend1',
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          friend: {
            id: 'friend1',
            full_name: 'Jane Smith',
            avatar_url: null,
          },
        },
        {
          id: '2',
          user_id: session.user.id,
          friend_id: 'friend2',
          created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          friend: {
            id: 'friend2',
            full_name: 'John Doe',
            avatar_url: null,
          },
        },
        {
          id: '3',
          user_id: session.user.id,
          friend_id: 'friend3',
          created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          friend: {
            id: 'friend3',
            full_name: 'Alice Johnson',
            avatar_url: null,
          },
        },
      ];
      
      // Mock friend requests data
      const mockFriendRequests: FriendRequest[] = [
        {
          id: '1',
          sender_id: 'user1',
          receiver_id: session.user.id,
          status: 'pending',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          sender: {
            id: 'user1',
            full_name: 'Bob Williams',
            avatar_url: null,
          },
        },
        {
          id: '2',
          sender_id: 'user2',
          receiver_id: session.user.id,
          status: 'pending',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          sender: {
            id: 'user2',
            full_name: 'Carol Brown',
            avatar_url: null,
          },
        },
      ];
      
      // Mock suggested friends data
      const mockSuggestedFriends: SuggestedFriend[] = [
        {
          id: 'suggested1',
          full_name: 'David Miller',
          avatar_url: null,
          mutual_friends: 5,
        },
        {
          id: 'suggested2',
          full_name: 'Eve Davis',
          avatar_url: null,
          mutual_friends: 3,
        },
        {
          id: 'suggested3',
          full_name: 'Frank Wilson',
          avatar_url: null,
          mutual_friends: 2,
        },
        {
          id: 'suggested4',
          full_name: 'Grace Taylor',
          avatar_url: null,
          mutual_friends: 1,
        },
      ];
      
      setFriends(mockFriends);
      setFriendRequests(mockFriendRequests);
      setSuggestedFriends(mockSuggestedFriends);
      setIsLoading(false);
    };
    
    fetchUserAndFriends();
  }, []);
  
  const handleAcceptRequest = async (requestId: string) => {
    try {
      // In a real app, we would update the request in Supabase
      // For now, we'll just update the local state
      
      // Find the request
      const request = friendRequests.find(req => req.id === requestId);
      if (!request) return;
      
      // Remove from requests
      setFriendRequests(prev => prev.filter(req => req.id !== requestId));
      
      // Add to friends
      const newFriend: Friend = {
        id: Date.now().toString(),
        user_id: currentUserId!,
        friend_id: request.sender_id,
        created_at: new Date().toISOString(),
        friend: {
          id: request.sender_id,
          full_name: request.sender.full_name,
          avatar_url: request.sender.avatar_url,
        },
      };
      
      setFriends(prev => [...prev, newFriend]);
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };
  
  const handleRejectRequest = async (requestId: string) => {
    try {
      // In a real app, we would update the request in Supabase
      // For now, we'll just update the local state
      setFriendRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };
  
  const handleAddFriend = async (userId: string) => {
    try {
      // In a real app, we would create a friend request in Supabase
      // For now, we'll just update the local state
      
      // Find the suggested friend
      const suggestedFriend = suggestedFriends.find(friend => friend.id === userId);
      if (!suggestedFriend) return;
      
      // Remove from suggestions
      setSuggestedFriends(prev => prev.filter(friend => friend.id !== userId));
      
      // Show a success message
      alert(`Friend request sent to ${suggestedFriend.full_name}`);
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };
  
  const handleRemoveFriend = async (friendId: string) => {
    try {
      // In a real app, we would delete the friendship in Supabase
      // For now, we'll just update the local state
      setFriends(prev => prev.filter(friend => friend.id !== friendId));
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };
  
  const filteredFriends = friends.filter(friend => 
    friend.friend.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredSuggestions = suggestedFriends.filter(friend => 
    friend.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Friends</h1>
          <p className="text-gray-600">Connect with friends and manage your friend requests</p>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search friends"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-gray-300 bg-gray-100 px-4 py-2 pl-10 focus:border-blue-500 focus:bg-white focus:outline-none"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
          </div>
        </div>
        
        <div className="mb-6 flex border-b border-gray-300">
          <button
            onClick={() => setActiveTab('all')}
            className={`mr-4 pb-4 font-medium ${
              activeTab === 'all'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`mr-4 pb-4 font-medium ${
              activeTab === 'requests'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Friend Requests ({friendRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`mr-4 pb-4 font-medium ${
              activeTab === 'suggestions'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Suggestions
          </button>
        </div>
        
        {/* All Friends */}
        {activeTab === 'all' && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFriends.length > 0 ? (
              filteredFriends.map(friend => (
                <div key={friend.id} className="rounded-lg bg-white p-4 shadow">
                  <div className="flex items-center">
                    <div className="mr-3">
                      {friend.friend.avatar_url ? (
                        <Image
                          src={friend.friend.avatar_url}
                          alt={friend.friend.full_name}
                          width={60}
                          height={60}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-300 text-2xl text-gray-700">
                          {getInitials(friend.friend.full_name)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Link href={`/profile/${friend.friend.id}`} className="font-semibold hover:underline">
                        {friend.friend.full_name}
                      </Link>
                      <p className="text-sm text-gray-500">
                        Friends since {new Date(friend.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => handleRemoveFriend(friend.id)}
                        className="rounded-md bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
                      >
                        <FaUserMinus className="mr-1 inline" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-lg bg-white p-8 text-center shadow">
                <p className="text-gray-600">No friends found matching your search.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Friend Requests */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {friendRequests.length > 0 ? (
              friendRequests.map(request => (
                <div key={request.id} className="rounded-lg bg-white p-4 shadow">
                  <div className="flex items-center">
                    <div className="mr-3">
                      {request.sender.avatar_url ? (
                        <Image
                          src={request.sender.avatar_url}
                          alt={request.sender.full_name}
                          width={60}
                          height={60}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-300 text-2xl text-gray-700">
                          {getInitials(request.sender.full_name)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Link href={`/profile/${request.sender.id}`} className="font-semibold hover:underline">
                        {request.sender.full_name}
                      </Link>
                      <p className="text-sm text-gray-500">
                        Sent you a friend request {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                      >
                        <FaCheck className="mr-1 inline" />
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="rounded-md bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
                      >
                        <FaTimes className="mr-1 inline" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg bg-white p-8 text-center shadow">
                <p className="text-gray-600">No friend requests at the moment.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Friend Suggestions */}
        {activeTab === 'suggestions' && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map(friend => (
                <div key={friend.id} className="rounded-lg bg-white p-4 shadow">
                  <div className="flex items-center">
                    <div className="mr-3">
                      {friend.avatar_url ? (
                        <Image
                          src={friend.avatar_url}
                          alt={friend.full_name}
                          width={60}
                          height={60}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-300 text-2xl text-gray-700">
                          {getInitials(friend.full_name)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Link href={`/profile/${friend.id}`} className="font-semibold hover:underline">
                        {friend.full_name}
                      </Link>
                      <p className="text-sm text-gray-500">
                        {friend.mutual_friends} mutual friend{friend.mutual_friends !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => handleAddFriend(friend.id)}
                        className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                      >
                        <FaUserPlus className="mr-1 inline" />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-lg bg-white p-8 text-center shadow">
                <p className="text-gray-600">No suggestions found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
