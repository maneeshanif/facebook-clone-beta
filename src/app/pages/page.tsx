'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getInitials } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { FaSearch, FaPlus, FaEllipsisH, FaThumbsUp, FaComment, FaShare } from 'react-icons/fa';

interface Page {
  id: string;
  name: string;
  category: string;
  profile_image: string | null;
  cover_image: string | null;
  likes_count: number;
  followers_count: number;
  is_following: boolean;
  is_admin: boolean;
  recent_post?: {
    id: string;
    content: string;
    image_url: string | null;
    posted_at: string;
    likes_count: number;
    comments_count: number;
  };
}

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'your_pages'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPages = async () => {
      setIsLoading(true);

      // In a real app, we would fetch from Supabase
      // For now, we will use mock data

      // Mock pages data
      const mockPages: Page[] = [
        {
          id: 'page1',
          name: 'Tech Innovations',
          category: 'Technology Company',
          profile_image: null,
          cover_image: 'https://source.unsplash.com/random/800x300/?technology',
          likes_count: 15420,
          followers_count: 16200,
          is_following: true,
          is_admin: false,
          recent_post: {
            id: 'post1',
            content: 'Excited to announce our new AI-powered product line coming next month! Stay tuned for more updates.',
            image_url: 'https://source.unsplash.com/random/800x600/?ai,technology',
            posted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            likes_count: 342,
            comments_count: 56,
          },
        },
        {
          id: 'page2',
          name: 'Nature Explorers',
          category: 'Environmental Organization',
          profile_image: null,
          cover_image: 'https://source.unsplash.com/random/800x300/?nature',
          likes_count: 8750,
          followers_count: 9100,
          is_following: false,
          is_admin: false,
        },
        {
          id: 'page3',
          name: 'Fitness First',
          category: 'Gym/Physical Fitness Center',
          profile_image: null,
          cover_image: 'https://source.unsplash.com/random/800x300/?fitness',
          likes_count: 12300,
          followers_count: 12800,
          is_following: true,
          is_admin: false,
          recent_post: {
            id: 'post2',
            content: 'Join our 30-day fitness challenge starting next week! Sign up at the front desk.',
            image_url: 'https://source.unsplash.com/random/800x600/?workout',
            posted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            likes_count: 189,
            comments_count: 27,
          },
        },
        {
          id: 'page4',
          name: 'Foodie Heaven',
          category: 'Restaurant',
          profile_image: null,
          cover_image: 'https://source.unsplash.com/random/800x300/?food',
          likes_count: 5600,
          followers_count: 5900,
          is_following: false,
          is_admin: false,
        },
        {
          id: 'page5',
          name: 'Creative Arts Studio',
          category: 'Art Studio',
          profile_image: null,
          cover_image: 'https://source.unsplash.com/random/800x300/?art',
          likes_count: 3200,
          followers_count: 3500,
          is_following: true,
          is_admin: true,
          recent_post: {
            id: 'post3',
            content: 'New art exhibition opening this weekend! Free entry for all visitors.',
            image_url: 'https://source.unsplash.com/random/800x600/?exhibition',
            posted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            likes_count: 78,
            comments_count: 12,
          },
        },
      ];

      setPages(mockPages);
      setIsLoading(false);
    };

    fetchPages();
  }, []);

  const formatTimeAgo = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      return `${Math.floor(diffDays / 30)} months ago`;
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    } else {
      return num.toString();
    }
  };

  const handleFollowPage = (pageId: string) => {
    // In a real app, we would update the follow status in Supabase
    // For now, we will just update the local state
    setPages(prev =>
      prev.map(page =>
        page.id === pageId
          ? { ...page, is_following: !page.is_following }
          : page
      )
    );
  };

  const filteredPages = pages.filter(page => {
    const matchesTab = activeTab === 'all' || (activeTab === 'your_pages' && page.is_admin);

    const matchesSearch =
      page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.category.toLowerCase().includes(searchQuery.toLowerCase());

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

      <div className="container mx-auto flex flex-1 px-4 py-6">
        <Sidebar className="sticky top-16 hidden w-1/5 lg:block" />

        <div className="w-full px-0 sm:px-4 lg:w-4/5">
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Pages</h1>
              <p className="text-gray-600">Discover and manage Facebook Pages</p>
            </div>

            <div className="mt-4 flex space-x-2 md:mt-0">
              <button className="flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 sm:px-4 sm:py-2 sm:text-base">
                <FaPlus className="mr-1 sm:mr-2" />
                Create New Page
              </button>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search Pages"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 pl-10 focus:border-blue-500 focus:outline-none"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-500" />
            </div>
          </div>

          <div className="mb-6 flex border-b border-gray-300">
            <button
              onClick={() => setActiveTab('all')}
              className={`mr-4 pb-2 font-medium ${
                activeTab === 'all'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Pages
            </button>
            <button
              onClick={() => setActiveTab('your_pages')}
              className={`mr-4 pb-2 font-medium ${
                activeTab === 'your_pages'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Your Pages
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPages.length > 0 ? (
              filteredPages.map(page => (
                <div key={page.id} className="overflow-hidden rounded-lg bg-white shadow">
                  <div className="relative h-32 w-full">
                    <Image
                      src={page.cover_image || 'https://source.unsplash.com/random/800x300/?abstract'}
                      alt={`${page.name} cover`}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="relative px-4 pb-4">
                    <div className="absolute -top-8 left-4 h-16 w-16 overflow-hidden rounded-lg border-4 border-white bg-white">
                      {page.profile_image ? (
                        <div className="relative h-full w-full">
                          <Image
                            src={page.profile_image}
                            alt={page.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xl text-gray-700">
                          {getInitials(page.name)}
                        </div>
                      )}
                    </div>

                    <div className="mt-10">
                      <Link href={`/pages/${page.id}`} className="text-lg font-semibold hover:underline">
                        {page.name}
                      </Link>
                      <p className="text-sm text-gray-500">{page.category}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        {formatNumber(page.likes_count)} likes • {formatNumber(page.followers_count)} followers
                      </p>

                      <div className="mt-3 flex justify-between">
                        <button
                          onClick={() => handleFollowPage(page.id)}
                          className={`flex items-center rounded-md px-3 py-1 text-sm font-medium ${
                            page.is_following
                              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {page.is_following ? 'Following' : 'Follow'}
                        </button>

                        {page.is_admin && (
                          <span className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                            Admin
                          </span>
                        )}
                      </div>

                      {page.recent_post && (
                        <div className="mt-4 rounded-lg border border-gray-200 p-3">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="mr-2 h-8 w-8 overflow-hidden rounded-lg">
                                {page.profile_image ? (
                                  <div className="relative h-full w-full">
                                    <Image
                                      src={page.profile_image}
                                      alt={page.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-gray-200 text-sm text-gray-700">
                                    {getInitials(page.name)}
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{page.name}</p>
                                <p className="text-xs text-gray-500">{formatTimeAgo(page.recent_post.posted_at)}</p>
                              </div>
                            </div>
                          </div>

                          <p className="mb-2 break-words text-sm">{page.recent_post.content}</p>

                          {page.recent_post.image_url && (
                            <div className="mb-2 overflow-hidden rounded">
                              <div className="relative h-32 w-full">
                                <Image
                                  src={page.recent_post.image_url}
                                  alt="Post image"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </div>
                          )}

                          <div className="flex text-xs text-gray-500">
                            <span>{formatNumber(page.recent_post.likes_count)} likes</span>
                            <span className="mx-1">•</span>
                            <span>{formatNumber(page.recent_post.comments_count)} comments</span>
                          </div>

                          <div className="mt-2 flex border-t border-gray-200 pt-2 text-xs">
                            <button className="flex flex-1 items-center justify-center rounded-md py-1 hover:bg-gray-100">
                              <FaThumbsUp className="mr-1" />
                              <span className="hidden xs:inline">Like</span>
                            </button>
                            <button className="flex flex-1 items-center justify-center rounded-md py-1 hover:bg-gray-100">
                              <FaComment className="mr-1" />
                              <span className="hidden xs:inline">Comment</span>
                            </button>
                            <button className="flex flex-1 items-center justify-center rounded-md py-1 hover:bg-gray-100">
                              <FaShare className="mr-1" />
                              <span className="hidden xs:inline">Share</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-lg bg-white p-8 text-center shadow">
                <p className="text-gray-600">
                  {activeTab === 'all'
                    ? 'No pages found matching your search criteria.'
                    : 'You are not an admin of any pages.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
