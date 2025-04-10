'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { getInitials } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';

interface Story {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
  image: string | null;
  content?: string;
  created_at: string;
}

export default function StoriesSection() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [storyContent, setStoryContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndStories = async () => {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setCurrentUserId(session.user.id);

        // Try to get user profile
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', session.user.id)
            .single();

          if (profileData) {
            setCurrentUserName(profileData.full_name);
            setCurrentUserAvatar(profileData.avatar_url);
          } else {
            // Fallback to user metadata
            const userData = session.user.user_metadata || {};
            setCurrentUserName(userData.full_name || session.user.email?.split('@')[0] || 'User');
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          // Fallback to user metadata
          const userData = session.user.user_metadata || {};
          setCurrentUserName(userData.full_name || session.user.email?.split('@')[0] || 'User');
        }
      }

      // For now, we'll use mock data for stories
      // In a real app, you would fetch stories from Supabase
      const mockStories: Story[] = [
        {
          id: '1',
          user: {
            id: 'current_user',
            name: 'Your Story',
            avatar: null,
          },
          image: null,
          content: 'Create your first story!',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          user: {
            id: 'user2',
            name: 'Jane Smith',
            avatar: null,
          },
          image: null,
          content: 'Having a great day at the beach! 🏖️',
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '3',
          user: {
            id: 'user3',
            name: 'John Doe',
            avatar: null,
          },
          image: null,
          content: 'Just finished a great book! 📚',
          created_at: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: '4',
          user: {
            id: 'user4',
            name: 'Alice Johnson',
            avatar: null,
          },
          image: null,
          content: 'Check out my new puppy! 🐶',
          created_at: new Date(Date.now() - 10800000).toISOString(),
        },
        {
          id: '5',
          user: {
            id: 'user5',
            name: 'Bob Williams',
            avatar: null,
          },
          image: null,
          content: 'Just got a promotion at work! 🎉',
          created_at: new Date(Date.now() - 14400000).toISOString(),
        },
      ];

      // Update the first story with current user info
      if (currentUserId) {
        mockStories[0].user.id = currentUserId;
        mockStories[0].user.name = currentUserName || 'Your Story';
        mockStories[0].user.avatar = currentUserAvatar;
      }

      setStories(mockStories);
    };

    fetchUserAndStories();
  }, [currentUserId, currentUserName, currentUserAvatar]);

  const handleCreateStory = () => {
    setIsCreateModalOpen(true);
  };

  const handleViewStory = (story: Story) => {
    setCurrentStory(story);
    setIsViewModalOpen(true);

    // Auto-close the story after 5 seconds
    setTimeout(() => {
      setIsViewModalOpen(false);
    }, 5000);
  };

  const handleSubmitStory = async () => {
    if (!storyContent.trim() || !currentUserId) return;

    setIsSubmitting(true);

    try {
      // In a real app, we would save to Supabase
      // For now, we'll just simulate it

      const newStory: Story = {
        id: Date.now().toString(),
        user: {
          id: currentUserId,
          name: currentUserName || 'You',
          avatar: currentUserAvatar,
        },
        image: null,
        content: storyContent,
        created_at: new Date().toISOString(),
      };

      // Update stories array
      setStories(prev => [newStory, ...prev.slice(1)]);
      setStoryContent('');
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating story:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {/* Create story card */}
        <div
          onClick={handleCreateStory}
          className="relative min-w-[120px] cursor-pointer overflow-hidden rounded-lg bg-white shadow transition-transform hover:scale-105"
        >
          <div className="h-48 bg-gray-200">
            {currentUserAvatar ? (
              <Image
                src={currentUserAvatar}
                alt="Your profile"
                fill
                className="object-cover opacity-50"
              />
            ) : null}
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center p-2 bg-white">
            <div className="absolute -top-6 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white ring-4 ring-white">
              <FaPlus />
            </div>
            <p className="mt-5 text-sm font-medium">Create Story</p>
          </div>
        </div>

        {/* Story cards */}
        {stories.slice(1).map(story => (
          <div
            key={story.id}
            onClick={() => handleViewStory(story)}
            className="relative min-w-[120px] cursor-pointer overflow-hidden rounded-lg shadow transition-transform hover:scale-105"
          >
            <div className="h-48 bg-gradient-to-b from-gray-500 to-gray-700">
              {story.image && (
                <Image
                  src={story.image}
                  alt={story.user.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="absolute inset-0 flex flex-col justify-between p-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 ring-4 ring-blue-600">
                {story.user.avatar ? (
                  <Image
                    src={story.user.avatar}
                    alt={story.user.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300 text-gray-700">
                    {getInitials(story.user.name)}
                  </div>
                )}
              </div>
              <p className="text-sm font-medium text-white">{story.user.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Create Story Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-300 p-4">
              <h3 className="text-xl font-semibold">Create Story</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4 flex items-center">
                {currentUserAvatar ? (
                  <Image
                    src={currentUserAvatar}
                    alt={currentUserName}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                    {getInitials(currentUserName)}
                  </div>
                )}
                <span className="ml-2 font-semibold">{currentUserName}</span>
              </div>

              <textarea
                value={storyContent}
                onChange={(e) => setStoryContent(e.target.value)}
                placeholder="What's on your mind?"
                className="min-h-[150px] w-full resize-none rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                autoFocus
              />

              <div className="mt-4">
                <button
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      // In a real app, you would upload the image to Supabase Storage
                      // For now, we'll just show a message
                      alert('Image upload functionality would be implemented in a real app');
                    };
                    input.click();
                  }}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Add Photo
                </button>
              </div>
            </div>

            <div className="border-t border-gray-300 p-4">
              <button
                onClick={handleSubmitStory}
                disabled={!storyContent.trim() || isSubmitting}
                className="w-full rounded-md bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Sharing...' : 'Share to Story'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Story Modal */}
      {isViewModalOpen && currentStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
          <div className="relative w-full max-w-lg">
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="absolute right-2 top-2 text-white hover:text-gray-300"
            >
              <FaTimes size={24} />
            </button>

            <div className="rounded-lg bg-gradient-to-b from-gray-800 to-gray-900 p-6 text-white">
              <div className="mb-4 flex items-center">
                {currentStory.user.avatar ? (
                  <Image
                    src={currentStory.user.avatar}
                    alt={currentStory.user.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                    {getInitials(currentStory.user.name)}
                  </div>
                )}
                <div className="ml-3">
                  <p className="font-semibold">{currentStory.user.name}</p>
                  <p className="text-xs text-gray-300">
                    {new Date(currentStory.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <div className="min-h-[200px] text-lg">
                {currentStory.content}
              </div>

              {currentStory.image && (
                <div className="mt-4">
                  <Image
                    src={currentStory.image}
                    alt="Story image"
                    width={400}
                    height={300}
                    className="rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
