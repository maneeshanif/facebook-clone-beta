'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { getInitials } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { FaSearch, FaUsers, FaLock, FaGlobe, FaPlus, FaEllipsisH, FaThumbsUp, FaComment, FaShare, FaTimes, FaCamera } from 'react-icons/fa';

interface Group {
  id: string;
  name: string;
  description: string;
  cover_image: string | null;
  privacy: 'public' | 'private' | 'closed';
  members_count: number;
  posts_count: number;
  created_at: string;
  is_member: boolean;
}

interface Post {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  likes_count: number;
  comments_count: number;
  user: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'discover' | 'your-groups'>('your-groups');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [groupPosts, setGroupPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true);

      // In a real app, we would fetch from Supabase
      // For now, we'll use mock data

      // Mock groups data
      const mockGroups: Group[] = [
        {
          id: 'group1',
          name: 'Photography Enthusiasts',
          description: 'A group for people who love photography. Share your photos, tips, and discuss photography techniques.',
          cover_image: 'https://source.unsplash.com/random/1200x400/?photography',
          privacy: 'public',
          members_count: 1542,
          posts_count: 342,
          created_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
          is_member: true,
        },
        {
          id: 'group2',
          name: 'Hiking Adventures',
          description: 'For hiking enthusiasts to share their adventures, trail recommendations, and outdoor tips.',
          cover_image: 'https://source.unsplash.com/random/1200x400/?hiking',
          privacy: 'public',
          members_count: 876,
          posts_count: 156,
          created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
          is_member: true,
        },
        {
          id: 'group3',
          name: 'Web Developers',
          description: 'A community for web developers to share knowledge, ask questions, and discuss the latest technologies.',
          cover_image: 'https://source.unsplash.com/random/1200x400/?coding',
          privacy: 'closed',
          members_count: 2345,
          posts_count: 567,
          created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          is_member: true,
        },
        {
          id: 'group4',
          name: 'Foodies Unite',
          description: 'Share your favorite recipes, restaurant recommendations, and food photos.',
          cover_image: 'https://source.unsplash.com/random/1200x400/?food',
          privacy: 'public',
          members_count: 4321,
          posts_count: 987,
          created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          is_member: false,
        },
        {
          id: 'group5',
          name: 'Book Club',
          description: 'Discuss books, share recommendations, and join our monthly book discussions.',
          cover_image: 'https://source.unsplash.com/random/1200x400/?books',
          privacy: 'private',
          members_count: 654,
          posts_count: 234,
          created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          is_member: false,
        },
        {
          id: 'group6',
          name: 'Fitness Motivation',
          description: 'Share your fitness journey, workout tips, and motivate each other to stay healthy.',
          cover_image: 'https://source.unsplash.com/random/1200x400/?fitness',
          privacy: 'public',
          members_count: 1987,
          posts_count: 432,
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          is_member: false,
        },
      ];

      setGroups(mockGroups);
      setIsLoading(false);
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      // In a real app, we would fetch posts for the selected group from Supabase
      // For now, we'll use mock data

      // Mock posts data
      const mockPosts: Post[] = [
        {
          id: 'post1',
          content: 'Just took this amazing photo during my hike yesterday. What do you think?',
          image_url: 'https://source.unsplash.com/random/800x600/?nature',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          likes_count: 42,
          comments_count: 7,
          user: {
            id: 'user1',
            full_name: 'Jane Smith',
            avatar_url: null,
          },
        },
        {
          id: 'post2',
          content: 'Has anyone tried this new camera? I\'m thinking of upgrading and would love some feedback.',
          image_url: 'https://source.unsplash.com/random/800x600/?camera',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          likes_count: 15,
          comments_count: 23,
          user: {
            id: 'user2',
            full_name: 'John Doe',
            avatar_url: null,
          },
        },
        {
          id: 'post3',
          content: 'Here\'s a tip for better landscape photography: Use a small aperture (high f-number) to get more of the scene in focus.',
          image_url: null,
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          likes_count: 78,
          comments_count: 12,
          user: {
            id: 'user3',
            full_name: 'Alice Johnson',
            avatar_url: null,
          },
        },
      ];

      setGroupPosts(mockPosts);
    }
  }, [selectedGroup]);

  const formatMembersCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M members`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K members`;
    } else {
      return `${count} members`;
    }
  };

  const formatTimeAgo = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) {
      return `${diffSeconds} seconds ago`;
    } else if (diffSeconds < 3600) {
      return `${Math.floor(diffSeconds / 60)} minutes ago`;
    } else if (diffSeconds < 86400) {
      return `${Math.floor(diffSeconds / 3600)} hours ago`;
    } else if (diffSeconds < 604800) {
      return `${Math.floor(diffSeconds / 86400)} days ago`;
    } else if (diffSeconds < 2592000) {
      return `${Math.floor(diffSeconds / 604800)} weeks ago`;
    } else if (diffSeconds < 31536000) {
      return `${Math.floor(diffSeconds / 2592000)} months ago`;
    } else {
      return `${Math.floor(diffSeconds / 31536000)} years ago`;
    }
  };

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'public':
        return <FaGlobe className="text-green-600" />;
      case 'private':
        return <FaLock className="text-red-600" />;
      case 'closed':
        return <FaUsers className="text-blue-600" />;
      default:
        return <FaGlobe className="text-green-600" />;
    }
  };

  const handleJoinGroup = (groupId: string) => {
    // In a real app, we would update the membership in Supabase
    // For now, we'll just update the local state
    setGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? { ...group, is_member: true, members_count: group.members_count + 1 }
          : group
      )
    );
  };

  const handleLeaveGroup = (groupId: string) => {
    // In a real app, we would update the membership in Supabase
    // For now, we'll just update the local state
    setGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? { ...group, is_member: false, members_count: group.members_count - 1 }
          : group
      )
    );

    // If the selected group is the one being left, go back to the groups list
    if (selectedGroup?.id === groupId) {
      setSelectedGroup(null);
    }
  };

  const filteredGroups = groups.filter(group => {
    const matchesTab = activeTab === 'discover' ? !group.is_member : group.is_member;
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          group.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

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

      <div className="container mx-auto flex flex-1 flex-col lg:flex-row px-4 py-6">
        <Sidebar className="sticky top-16 hidden w-full lg:w-1/5 lg:block" />

        <div className="w-full px-0 sm:px-4 lg:w-4/5 lg:pl-4">
          {selectedGroup ? (
            <div>
              {/* Group header */}
              <div className="mb-6 overflow-hidden rounded-lg bg-white shadow">
                <div className="relative h-48 w-full">
                  {selectedGroup.cover_image ? (
                    <Image
                      src={selectedGroup.cover_image}
                      alt={selectedGroup.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
                    <div>
                      <div className="flex items-center">
                        <h1 className="text-2xl font-bold">{selectedGroup.name}</h1>
                        <div className="ml-2 flex items-center text-sm text-gray-500">
                          {getPrivacyIcon(selectedGroup.privacy)}
                          <span className="ml-1 capitalize">{selectedGroup.privacy}</span>
                        </div>
                      </div>
                      <p className="text-gray-500">
                        {formatMembersCount(selectedGroup.members_count)} • {selectedGroup.posts_count} posts
                      </p>
                    </div>

                    <div className="mt-4 flex md:mt-0">
                      {selectedGroup.is_member ? (
                        <button
                          onClick={() => handleLeaveGroup(selectedGroup.id)}
                          className="rounded-md bg-gray-200 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-300"
                        >
                          Leave Group
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoinGroup(selectedGroup.id)}
                          className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                        >
                          Join Group
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedGroup(null)}
                        className="ml-2 rounded-md border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Back to Groups
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-gray-700">{selectedGroup.description}</p>
                  </div>
                </div>
              </div>

              {/* Group posts */}
              <div className="space-y-4">
                {selectedGroup.is_member && (
                  <div className="rounded-lg bg-white p-4 shadow">
                    <div className="flex items-center">
                      <div className="mr-2 h-10 w-10 overflow-hidden rounded-full bg-gray-300">
                        {/* User avatar would go here */}
                      </div>
                      <input
                        type="text"
                        placeholder={`Write something to ${selectedGroup.name}...`}
                        className="flex-1 rounded-full border border-gray-300 bg-gray-100 px-4 py-2 focus:border-blue-500 focus:bg-white focus:outline-none"
                        onClick={() => alert('Post creation would open here')}
                        readOnly
                      />
                    </div>
                  </div>
                )}

                {groupPosts.map(post => (
                  <div key={post.id} className="rounded-lg bg-white p-4 shadow">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center">
                        {post.user.avatar_url ? (
                          <Image
                            src={post.user.avatar_url}
                            alt={post.user.full_name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                            {getInitials(post.user.full_name)}
                          </div>
                        )}
                        <div className="ml-3">
                          <Link href={`/profile/${post.user.id}`} className="font-semibold hover:underline">
                            {post.user.full_name}
                          </Link>
                          <p className="text-xs text-gray-500">
                            {formatTimeAgo(post.created_at)}
                          </p>
                        </div>
                      </div>
                      <button className="text-gray-500 hover:text-gray-700">
                        <FaEllipsisH />
                      </button>
                    </div>

                    <div className="mb-3">
                      <p className="whitespace-pre-line">{post.content}</p>
                    </div>

                    {post.image_url && (
                      <div className="mb-3">
                        <div className="relative h-64 w-full">
                          <Image
                            src={post.image_url}
                            alt="Post image"
                            fill
                            className="rounded-lg object-contain"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between border-b border-t border-gray-200 py-2 text-sm text-gray-500">
                      <div>
                        {post.likes_count} likes • {post.comments_count} comments
                      </div>
                    </div>

                    <div className="mt-2 flex">
                      <button className="flex flex-1 items-center justify-center py-2 hover:bg-gray-100">
                        <FaThumbsUp className="mr-2" />
                        Like
                      </button>
                      <button className="flex flex-1 items-center justify-center py-2 hover:bg-gray-100">
                        <FaComment className="mr-2" />
                        Comment
                      </button>
                      <button className="flex flex-1 items-center justify-center py-2 hover:bg-gray-100">
                        <FaShare className="mr-2" />
                        Share
                      </button>
                    </div>
                  </div>
                ))}

                {groupPosts.length === 0 && (
                  <div className="rounded-lg bg-white p-6 text-center shadow">
                    <p className="text-gray-500">No posts in this group yet.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Groups</h1>
                  <p className="text-gray-600">Connect with people who share your interests</p>
                </div>

                <div className="mt-4 md:mt-0">
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                  >
                    <FaPlus className="mr-2" />
                    Create New Group
                  </button>
                </div>
              </div>

              <div className="mb-6 flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search Groups"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 pl-10 focus:border-blue-500 focus:outline-none"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-500" />
                </div>
              </div>

              <div className="mb-6 flex border-b border-gray-300">
                <button
                  onClick={() => setActiveTab('your-groups')}
                  className={`mr-4 pb-2 font-medium ${
                    activeTab === 'your-groups'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Your Groups
                </button>
                <button
                  onClick={() => setActiveTab('discover')}
                  className={`mr-4 pb-2 font-medium ${
                    activeTab === 'discover'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Discover
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredGroups.length > 0 ? (
                  filteredGroups.map(group => (
                    <div
                      key={group.id}
                      className="overflow-hidden rounded-lg bg-white shadow transition-transform hover:scale-105"
                    >
                      <div
                        className="relative h-32 w-full cursor-pointer"
                        onClick={() => setSelectedGroup(group)}
                      >
                        {group.cover_image ? (
                          <Image
                            src={group.cover_image}
                            alt={group.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
                        )}
                      </div>
                      <div className="p-4">
                        <div
                          className="mb-2 cursor-pointer"
                          onClick={() => setSelectedGroup(group)}
                        >
                          <div className="flex items-center">
                            <h3 className="font-semibold">{group.name}</h3>
                            <div className="ml-2 text-sm text-gray-500">
                              {getPrivacyIcon(group.privacy)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatMembersCount(group.members_count)}
                          </p>
                        </div>

                        {group.is_member ? (
                          <button
                            onClick={() => handleLeaveGroup(group.id)}
                            className="w-full rounded-md bg-gray-200 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                          >
                            Leave
                          </button>
                        ) : (
                          <button
                            onClick={() => handleJoinGroup(group.id)}
                            className="w-full rounded-md bg-blue-600 py-1 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            Join
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full rounded-lg bg-white p-8 text-center shadow">
                    <p className="text-gray-600">
                      {activeTab === 'your-groups'
                        ? 'You haven\'t joined any groups yet.'
                        : 'No groups found matching your search.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Create Group Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg bg-white p-4 sm:p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Create New Group</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Group Name</label>
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter group name"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Privacy</label>
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none">
                    <option value="public">Public - Anyone can see who's in the group and what they post</option>
                    <option value="closed">Closed - Anyone can find the group, but only members can see posts</option>
                    <option value="secret">Secret - Only members can find the group and see posts</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    rows={3}
                    placeholder="What is this group about?"
                  ></textarea>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Cover Photo</label>
                  <label className="flex cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 hover:bg-gray-50">
                    <input type="file" className="hidden" accept="image/*" />
                    <div className="text-center">
                      <FaCamera className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-500">Click to add a cover photo</p>
                    </div>
                  </label>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      alert('Your group has been created! (This is a demo)');
                      setShowCreateForm(false);
                    }}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Create Group
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
