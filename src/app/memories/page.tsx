'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { getInitials } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { FaCalendarAlt, FaShare, FaEllipsisH, FaThumbsUp, FaComment } from 'react-icons/fa';

interface Memory {
  id: string;
  title: string;
  description: string;
  year: number;
  date: string;
  posts: {
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
  }[];
}

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  
  useEffect(() => {
    const fetchMemories = async () => {
      setIsLoading(true);
      
      // In a real app, we would fetch from Supabase
      // For now, we'll use mock data
      
      // Get current date for "On This Day" memories
      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      const currentDay = today.getDate();
      
      // Mock memories data
      const mockMemories: Memory[] = [
        {
          id: 'memory1',
          title: 'On This Day',
          description: `Memories from ${currentMonth}/${currentDay} over the years`,
          year: 0, // Special case for "On This Day"
          date: `${currentMonth}/${currentDay}`,
          posts: [
            {
              id: 'post1',
              content: 'Throwback to this amazing vacation! Can\'t believe it\'s been 3 years already.',
              image_url: 'https://source.unsplash.com/random/800x600/?vacation,beach',
              created_at: new Date(today.getFullYear() - 3, currentMonth - 1, currentDay).toISOString(),
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
              content: 'Happy birthday to my best friend! 🎂',
              image_url: 'https://source.unsplash.com/random/800x600/?birthday,party',
              created_at: new Date(today.getFullYear() - 1, currentMonth - 1, currentDay).toISOString(),
              likes_count: 65,
              comments_count: 12,
              user: {
                id: 'user1',
                full_name: 'Jane Smith',
                avatar_url: null,
              },
            },
          ],
        },
        {
          id: 'memory2',
          title: '2022 Highlights',
          description: 'Your most memorable moments from 2022',
          year: 2022,
          date: '2022',
          posts: [
            {
              id: 'post3',
              content: 'Graduated from university today! So proud of this achievement. 🎓',
              image_url: 'https://source.unsplash.com/random/800x600/?graduation',
              created_at: new Date(2022, 5, 15).toISOString(),
              likes_count: 128,
              comments_count: 34,
              user: {
                id: 'user1',
                full_name: 'Jane Smith',
                avatar_url: null,
              },
            },
            {
              id: 'post4',
              content: 'New job, new beginnings! Excited to start this journey.',
              image_url: 'https://source.unsplash.com/random/800x600/?office,work',
              created_at: new Date(2022, 7, 22).toISOString(),
              likes_count: 87,
              comments_count: 15,
              user: {
                id: 'user1',
                full_name: 'Jane Smith',
                avatar_url: null,
              },
            },
            {
              id: 'post5',
              content: 'Holiday season with the family. Grateful for these moments. ❤️',
              image_url: 'https://source.unsplash.com/random/800x600/?christmas,family',
              created_at: new Date(2022, 11, 25).toISOString(),
              likes_count: 93,
              comments_count: 8,
              user: {
                id: 'user1',
                full_name: 'Jane Smith',
                avatar_url: null,
              },
            },
          ],
        },
        {
          id: 'memory3',
          title: 'Summer Memories',
          description: 'Your summer adventures over the years',
          year: 0, // Special case for seasonal memories
          date: 'Summer',
          posts: [
            {
              id: 'post6',
              content: 'Beach day with friends! Perfect weather. ☀️',
              image_url: 'https://source.unsplash.com/random/800x600/?beach,friends',
              created_at: new Date(2021, 6, 12).toISOString(),
              likes_count: 56,
              comments_count: 9,
              user: {
                id: 'user1',
                full_name: 'Jane Smith',
                avatar_url: null,
              },
            },
            {
              id: 'post7',
              content: 'Hiking in the mountains. The view was breathtaking!',
              image_url: 'https://source.unsplash.com/random/800x600/?hiking,mountains',
              created_at: new Date(2020, 7, 5).toISOString(),
              likes_count: 72,
              comments_count: 11,
              user: {
                id: 'user1',
                full_name: 'Jane Smith',
                avatar_url: null,
              },
            },
          ],
        },
      ];
      
      setMemories(mockMemories);
      setIsLoading(false);
    };
    
    fetchMemories();
  }, []);
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffYears = now.getFullYear() - date.getFullYear();
    
    return `${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · ${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
  };
  
  const handleShareMemory = (memoryId: string) => {
    // In a real app, we would implement sharing functionality
    alert('Sharing functionality would be implemented here');
  };
  
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
        
        <div className="w-full lg:w-4/5">
          {selectedMemory ? (
            <div>
              {/* Memory header */}
              <div className="mb-6 rounded-lg bg-white p-6 shadow">
                <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
                  <div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 text-blue-600" size={24} />
                      <h1 className="text-2xl font-bold">{selectedMemory.title}</h1>
                    </div>
                    <p className="mt-1 text-gray-600">{selectedMemory.description}</p>
                  </div>
                  
                  <div className="mt-4 flex space-x-2 md:mt-0">
                    <button
                      onClick={() => handleShareMemory(selectedMemory.id)}
                      className="flex items-center rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                    >
                      <FaShare className="mr-2" />
                      Share
                    </button>
                    <button
                      onClick={() => setSelectedMemory(null)}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Back to Memories
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Memory posts */}
              <div className="space-y-4">
                {selectedMemory.posts.map(post => (
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
                            {formatDate(post.created_at)}
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
                        <img
                          src={post.image_url}
                          alt="Post image"
                          className="w-full rounded-lg"
                        />
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
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold">Memories</h1>
                <p className="text-gray-600">Look back on your memories and milestones</p>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {memories.map(memory => (
                  <div
                    key={memory.id}
                    className="overflow-hidden rounded-lg bg-white shadow transition-transform hover:scale-105"
                    onClick={() => setSelectedMemory(memory)}
                  >
                    {memory.posts[0]?.image_url ? (
                      <div className="relative h-48 w-full">
                        <img
                          src={memory.posts[0].image_url}
                          alt={memory.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h2 className="text-xl font-bold text-white">{memory.title}</h2>
                          <p className="text-sm text-white">{memory.description}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-48 w-full bg-gradient-to-r from-blue-400 to-blue-600">
                        <div className="absolute bottom-4 left-4 right-4">
                          <h2 className="text-xl font-bold text-white">{memory.title}</h2>
                          <p className="text-sm text-white">{memory.description}</p>
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2 text-blue-600" />
                          <span className="text-gray-600">{memory.date}</span>
                        </div>
                        <span className="text-sm text-gray-500">{memory.posts.length} memories</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
