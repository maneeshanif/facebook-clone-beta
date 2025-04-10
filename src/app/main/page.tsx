'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import CreatePostCard from '@/components/feed/CreatePostCard';
import PostCard from '@/components/feed/PostCard';
import StoriesSection from '@/components/feed/StoriesSection';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import RightSidebar from '@/components/layout/RightSidebar';

interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  likes_count: number;
  comments_count: number;
  user: {
    full_name: string;
    avatar_url: string | null;
  };
}

export default function MainFeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserAndPosts = async () => {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUserId(session.user.id);
        
        // In a real app, fetch posts from Supabase
        // For now, we'll use mock data
        const mockPosts: Post[] = [
          {
            id: '1',
            user_id: 'user1',
            content: 'Just finished a great book! Would highly recommend it to everyone.',
            image_url: null,
            created_at: new Date(Date.now() - 3600000).toISOString(),
            likes_count: 15,
            comments_count: 3,
            user: {
              full_name: 'Jane Smith',
              avatar_url: null,
            },
          },
          {
            id: '2',
            user_id: 'user2',
            content: 'Beautiful day at the beach! 🏖️',
            image_url: null,
            created_at: new Date(Date.now() - 7200000).toISOString(),
            likes_count: 42,
            comments_count: 7,
            user: {
              full_name: 'John Doe',
              avatar_url: null,
            },
          },
          {
            id: '3',
            user_id: 'user3',
            content: 'Just got a new puppy! Meet Max 🐶',
            image_url: null,
            created_at: new Date(Date.now() - 10800000).toISOString(),
            likes_count: 87,
            comments_count: 12,
            user: {
              full_name: 'Alice Johnson',
              avatar_url: null,
            },
          },
        ];
        
        setPosts(mockPosts);
      }
      
      setIsLoading(false);
    };
    
    fetchUserAndPosts();
  }, []);
  
  const handlePostCreated = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto flex gap-4 px-4 py-4">
        <Sidebar className="sticky top-16 hidden w-1/5 lg:block" />
        <main className="w-full lg:w-3/5">
          <div className="space-y-4">
            <StoriesSection />
            
            <CreatePostCard userId={userId} onPostCreated={handlePostCreated} />
            
            <div className="space-y-4">
              {posts.map(post => (
                <PostCard key={post.id} post={post} currentUserId={userId} />
              ))}
            </div>
          </div>
        </main>
        <RightSidebar className="sticky top-16 hidden w-1/5 lg:block" />
      </div>
    </div>
  );
}
