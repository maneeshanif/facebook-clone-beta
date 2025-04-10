'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { getInitials } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { FaSearch, FaBookmark, FaThumbsUp, FaComment, FaShare, FaEllipsisH, FaPlus } from 'react-icons/fa';

interface SavedItem {
  id: string;
  type: 'post' | 'video' | 'article' | 'marketplace' | 'event';
  title: string | null;
  content: string | null;
  image_url: string | null;
  link: string | null;
  saved_at: string;
  source: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
}

interface Collection {
  id: string;
  name: string;
  items_count: number;
  created_at: string;
}

export default function SavedPage() {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'collection'>('all');
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  useEffect(() => {
    const fetchSavedItems = async () => {
      setIsLoading(true);

      // In a real app, we would fetch from Supabase
      // For now, we'll use mock data

      // Mock saved items data
      const mockSavedItems: SavedItem[] = [
        {
          id: 'saved1',
          type: 'post',
          title: null,
          content: 'Just finished reading this amazing book! Highly recommend it to everyone who loves science fiction.',
          image_url: 'https://source.unsplash.com/random/800x600/?book',
          link: null,
          saved_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          source: {
            id: 'user1',
            name: 'Jane Smith',
            avatar_url: null,
          },
        },
        {
          id: 'saved2',
          type: 'article',
          title: '10 Tips for Better Productivity',
          content: 'Learn how to maximize your productivity with these simple tips that you can implement today.',
          image_url: 'https://source.unsplash.com/random/800x600/?productivity',
          link: 'https://example.com/productivity-tips',
          saved_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          source: {
            id: 'page1',
            name: 'Productivity Hacks',
            avatar_url: null,
          },
        },
        {
          id: 'saved3',
          type: 'video',
          title: 'How to Make Perfect Pasta',
          content: 'Chef Maria shows you the secrets to making perfect pasta every time.',
          image_url: 'https://source.unsplash.com/random/800x600/?pasta',
          link: 'https://example.com/pasta-video',
          saved_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          source: {
            id: 'page2',
            name: 'Cooking Masterclass',
            avatar_url: null,
          },
        },
        {
          id: 'saved4',
          type: 'marketplace',
          title: 'Vintage Camera for Sale',
          content: 'Vintage Nikon camera in excellent condition. Comes with original case and lens.',
          image_url: 'https://source.unsplash.com/random/800x600/?camera',
          link: '/marketplace/item123',
          saved_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          source: {
            id: 'user2',
            name: 'John Doe',
            avatar_url: null,
          },
        },
        {
          id: 'saved5',
          type: 'event',
          title: 'Web Development Workshop',
          content: 'Learn the latest web development techniques in this hands-on workshop.',
          image_url: 'https://source.unsplash.com/random/800x600/?coding',
          link: '/events/event123',
          saved_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          source: {
            id: 'page3',
            name: 'Tech Workshops',
            avatar_url: null,
          },
        },
        {
          id: 'saved6',
          type: 'post',
          title: null,
          content: 'Beautiful sunset at the beach today! 🌅',
          image_url: 'https://source.unsplash.com/random/800x600/?sunset,beach',
          link: null,
          saved_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          source: {
            id: 'user3',
            name: 'Alice Johnson',
            avatar_url: null,
          },
        },
      ];

      // Mock collections data
      const mockCollections: Collection[] = [
        {
          id: 'collection1',
          name: 'Recipes',
          items_count: 1,
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'collection2',
          name: 'Travel Ideas',
          items_count: 1,
          created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'collection3',
          name: 'Tech Articles',
          items_count: 1,
          created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      setSavedItems(mockSavedItems);
      setCollections(mockCollections);
      setIsLoading(false);
    };

    fetchSavedItems();
  }, []);

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

  const getItemTypeIcon = (type: string) => {
    switch (type) {
      case 'post':
        return null;
      case 'video':
        return <span className="rounded bg-red-600 px-2 py-1 text-xs text-white">Video</span>;
      case 'article':
        return <span className="rounded bg-blue-600 px-2 py-1 text-xs text-white">Article</span>;
      case 'marketplace':
        return <span className="rounded bg-green-600 px-2 py-1 text-xs text-white">Marketplace</span>;
      case 'event':
        return <span className="rounded bg-purple-600 px-2 py-1 text-xs text-white">Event</span>;
      default:
        return null;
    }
  };

  const handleUnsaveItem = (itemId: string) => {
    // In a real app, we would update the saved status in Supabase
    // For now, we'll just update the local state
    setSavedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return;

    // In a real app, we would create the collection in Supabase
    // For now, we'll just update the local state
    const newCollection: Collection = {
      id: `collection${collections.length + 1}`,
      name: newCollectionName,
      items_count: 0,
      created_at: new Date().toISOString(),
    };

    setCollections(prev => [...prev, newCollection]);
    setNewCollectionName('');
    setShowNewCollectionModal(false);
  };

  const filteredItems = savedItems.filter(item => {
    const matchesSearch =
      (item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (item.content?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      item.source.name.toLowerCase().includes(searchQuery.toLowerCase());

    // If a collection is active, we would filter by collection
    // For now, we'll just return all items since we don't have collection assignments in our mock data

    return matchesSearch;
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
              <h1 className="text-2xl font-bold">Saved Items</h1>
              <p className="text-gray-600">Items you&apos;ve saved for later</p>
            </div>

            <div className="mt-4 md:mt-0">
              <button
                onClick={() => setShowNewCollectionModal(true)}
                className="flex items-center rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
              >
                <FaPlus className="mr-2" />
                Create Collection
              </button>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search Saved Items"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 pl-10 focus:border-blue-500 focus:outline-none"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-500" />
            </div>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-4">
            {/* Collections sidebar */}
            <div className="md:col-span-1">
              <div className="rounded-lg bg-white p-3 shadow sm:p-4">
                <h2 className="mb-4 font-semibold">Collections</h2>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => {
                        setActiveTab('all');
                        setActiveCollection(null);
                      }}
                      className={`w-full rounded-md px-3 py-2 text-left ${
                        activeTab === 'all' && !activeCollection
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      All Items
                    </button>
                  </li>
                  {collections.map(collection => (
                    <li key={collection.id}>
                      <button
                        onClick={() => {
                          setActiveTab('collection');
                          setActiveCollection(collection.id);
                        }}
                        className={`w-full rounded-md px-3 py-2 text-left ${
                          activeCollection === collection.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {collection.name}
                        <span className="ml-2 text-xs text-gray-500">
                          ({collection.items_count})
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Saved items */}
            <div className="md:col-span-3">
              <div className="space-y-4">
                {filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <div key={item.id} className="rounded-lg bg-white p-3 shadow sm:p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center">
                          {item.source.avatar_url ? (
                            <Image
                              src={item.source.avatar_url}
                              alt={item.source.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                              {getInitials(item.source.name)}
                            </div>
                          )}
                          <div className="ml-3">
                            <Link href={`/profile/${item.source.id}`} className="font-semibold hover:underline">
                              {item.source.name}
                            </Link>
                            <div className="flex items-center text-xs text-gray-500">
                              <span>Saved {formatTimeAgo(item.saved_at)}</span>
                              {getItemTypeIcon(item.type) && (
                                <span className="ml-2">{getItemTypeIcon(item.type)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <button
                            onClick={() => handleUnsaveItem(item.id)}
                            className="mr-2 rounded-md bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
                          >
                            <FaBookmark className="mr-1 inline" />
                            Unsave
                          </button>
                          <button className="text-gray-500 hover:text-gray-700">
                            <FaEllipsisH />
                          </button>
                        </div>
                      </div>

                      {item.title && (
                        <h3 className="mb-2 text-base font-semibold sm:text-lg">
                          {item.link ? (
                            <a href={item.link} className="hover:underline">
                              {item.title}
                            </a>
                          ) : (
                            item.title
                          )}
                        </h3>
                      )}

                      {item.content && (
                        <div className="mb-3">
                          <p className="break-words whitespace-pre-line text-sm sm:text-base">{item.content}</p>
                        </div>
                      )}

                      {item.image_url && (
                        <div className="mb-3">
                          <Image
                            src={item.image_url}
                            alt={item.title || 'Saved item'}
                            width={800}
                            height={600}
                            className="w-full rounded-lg"
                          />
                        </div>
                      )}

                      <div className="mt-2 flex text-xs sm:text-sm">
                        <button className="flex flex-1 items-center justify-center rounded-md py-1 hover:bg-gray-100 sm:py-2">
                          <FaThumbsUp className="mr-1 sm:mr-2" />
                          <span className="hidden xs:inline">Like</span>
                        </button>
                        <button className="flex flex-1 items-center justify-center rounded-md py-1 hover:bg-gray-100 sm:py-2">
                          <FaComment className="mr-1 sm:mr-2" />
                          <span className="hidden xs:inline">Comment</span>
                        </button>
                        <button className="flex flex-1 items-center justify-center rounded-md py-1 hover:bg-gray-100 sm:py-2">
                          <FaShare className="mr-1 sm:mr-2" />
                          <span className="hidden xs:inline">Share</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg bg-white p-8 text-center shadow">
                    <p className="text-gray-600">
                      {searchQuery
                        ? 'No saved items found matching your search.'
                        : activeCollection
                        ? 'No items in this collection yet.'
                        : 'You haven\'t saved any items yet.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Collection Modal */}
      {showNewCollectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Create New Collection</h2>
            <input
              type="text"
              placeholder="Collection Name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowNewCollectionModal(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCollection}
                className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                disabled={!newCollectionName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
