'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { getInitials } from '@/lib/utils';
import { FaCamera, FaEdit, FaUserFriends } from 'react-icons/fa';
import PostCard from '@/components/feed/PostCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  bio: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  location: string | null;
  work: string | null;
  education: string | null;
}

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

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const profileId = unwrappedParams.id;

  // Get user data from Redux store
  const { profile: currentUserProfile } = useSelector((state: RootState) => state.user as { profile: Profile | null });

  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      setIsLoading(true);

      // Get current user
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setCurrentUserId(session.user.id);
        setIsCurrentUser(session.user.id === profileId);
      }

      // If this is the current user's profile and we have the data in Redux
      if (currentUserProfile && (profileId === currentUserProfile.id || profileId === 'user1')) {
        // Use the profile data from Redux
        const userProfile: Profile = {
          id: currentUserProfile.id,
          first_name: currentUserProfile.first_name,
          last_name: currentUserProfile.last_name,
          full_name: currentUserProfile.full_name,
          bio: currentUserProfile.bio || null,
          avatar_url: currentUserProfile.avatar_url,
          cover_url: null,
          location: currentUserProfile.location || 'Not specified',
          work: 'Software Engineer',
          education: 'Computer Science',
        };

        setProfile(userProfile);

      // In a real app, fetch posts from Supabase
      // For now, we'll use mock data
      const mockPosts: Post[] = [
        {
          id: '1',
          user_id: profileId,
          content: 'Just finished a great book! Would highly recommend it to everyone.',
          image_url: null,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          likes_count: 15,
          comments_count: 3,
          user: {
            full_name: profile ? profile.full_name : 'User',
            avatar_url: profile ? profile.avatar_url : null,
          },
        },
        {
          id: '2',
          user_id: profileId,
          content: 'Beautiful day at the beach! 🏖️',
          image_url: null,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          likes_count: 42,
          comments_count: 7,
          user: {
            full_name: profile ? profile.full_name : 'User',
            avatar_url: profile ? profile.avatar_url : null,
          },
        },
      ];

      setPosts(mockPosts);
      setIsLoading(false);
      } else {
        // Fallback to mock data for other profiles
        const mockProfile: Profile = {
          id: profileId,
          first_name: 'John',
          last_name: 'Doe',
          full_name: 'John Doe',
          bio: 'Software developer and photography enthusiast',
          avatar_url: null,
          cover_url: null,
          location: 'San Francisco, CA',
          work: 'Software Engineer at Tech Company',
          education: 'Computer Science, University of California',
        };

        setProfile(mockProfile);

        const mockPosts: Post[] = [
          {
            id: '1',
            user_id: profileId,
            content: 'Just finished a great book! Would highly recommend it to everyone.',
            image_url: null,
            created_at: new Date(Date.now() - 3600000).toISOString(),
            likes_count: 15,
            comments_count: 3,
            user: {
              full_name: mockProfile.full_name,
              avatar_url: mockProfile.avatar_url,
            },
          },
          {
            id: '2',
            user_id: profileId,
            content: 'Beautiful day at the beach! 🏖️',
            image_url: null,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            likes_count: 42,
            comments_count: 7,
            user: {
              full_name: mockProfile.full_name,
              avatar_url: mockProfile.avatar_url,
            },
          },
        ];

        // Add mock photos
        const mockPhotos = [
          'https://source.unsplash.com/random/300x300?nature',
          'https://source.unsplash.com/random/300x300?city',
          'https://source.unsplash.com/random/300x300?people',
          'https://source.unsplash.com/random/300x300?technology',
          'https://source.unsplash.com/random/300x300?food',
          'https://source.unsplash.com/random/300x300?architecture',
          'https://source.unsplash.com/random/300x300?business',
          'https://source.unsplash.com/random/300x300?animals',
          'https://source.unsplash.com/random/300x300?travel',
        ];

        setPhotos(mockPhotos);
        setPosts(mockPosts);
        setIsLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, [profileId, currentUserProfile]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-10 text-center">
        <h1 className="text-2xl font-bold">Profile not found</h1>
      </div>
    );
  }

  return (
    <div>
      {/* Cover photo */}
      <div className="relative h-40 w-full bg-gradient-to-r from-blue-400 to-blue-600 sm:h-48 md:h-64">
        {profile.cover_url && (
          <Image
            src={profile.cover_url}
            alt="Cover photo"
            fill
            className="object-cover"
          />
        )}

        {isCurrentUser && (
          <button className="absolute bottom-2 right-2 rounded-md bg-gray-800 bg-opacity-60 px-2 py-1 text-sm text-white hover:bg-opacity-80 sm:bottom-4 sm:right-4 sm:px-4 sm:py-2 sm:text-base">
            <FaCamera className="mr-1 inline sm:mr-2" />
            <span className="hidden xs:inline">Edit Cover Photo</span>
          </button>
        )}
      </div>

      {/* Profile info */}
      <div className="relative mx-auto -mt-16 max-w-5xl px-4 sm:-mt-20">
        <div className="flex flex-col items-center md:flex-row md:items-end">
          <div className="relative">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.full_name}
                width={120}
                height={120}
                className="rounded-full border-4 border-white bg-white sm:h-40 sm:w-40"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-gray-300 text-3xl text-gray-700 sm:h-40 sm:w-40 sm:text-4xl">
                {getInitials(profile.full_name)}
              </div>
            )}

            {isCurrentUser && (
              <button className="absolute bottom-1 right-1 rounded-full bg-gray-200 p-1.5 hover:bg-gray-300 sm:bottom-2 sm:right-2 sm:p-2">
                <FaCamera className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            )}
          </div>

          <div className="mt-3 flex-1 text-center md:ml-6 md:mt-0 md:text-left">
            <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">{profile.full_name}</h1>
            {profile.bio && <p className="mt-1 text-sm text-gray-600 sm:text-base">{profile.bio}</p>}

            <div className="mt-2 flex flex-wrap justify-center gap-2 text-xs text-gray-600 md:justify-start md:gap-4 md:text-sm">
              {profile.location && (
                <div className="flex items-center">
                  <span className="font-semibold">Lives in:</span> <span className="ml-1">{profile.location}</span>
                </div>
              )}

              {profile.work && (
                <div className="flex items-center">
                  <span className="font-semibold">Works at:</span> <span className="ml-1">{profile.work}</span>
                </div>
              )}

              {profile.education && (
                <div className="flex items-center">
                  <span className="font-semibold">Studied at:</span> <span className="ml-1">{profile.education}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:mt-4 md:mt-0 md:justify-start">
            {isCurrentUser ? (
              <button className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 sm:px-4 sm:py-2 sm:text-base">
                <FaEdit className="mr-1 inline h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                Edit Profile
              </button>
            ) : (
              <>
                <button className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 sm:px-4 sm:py-2 sm:text-base">
                  <FaUserFriends className="mr-1 inline h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                  Add Friend
                </button>
                <button className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-800 hover:bg-gray-300 sm:px-4 sm:py-2 sm:text-base">
                  Message
                </button>
              </>
            )}
          </div>
        </div>

        <hr className="my-6 border-gray-300" />

        {/* Tabs */}
        <div className="mb-4 border-b border-gray-300">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('posts')}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${activeTab === 'posts' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${activeTab === 'about' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('friends')}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${activeTab === 'friends' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
            >
              Friends
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${activeTab === 'photos' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
            >
              Photos
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard key={post.id} post={post} currentUserId={currentUserId} />
            ))}

            {posts.length === 0 && (
              <div className="rounded-lg bg-white p-6 text-center shadow">
                <p className="text-gray-500">No posts to show</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">About</h2>
            <div className="space-y-4">
              {profile?.bio && (
                <div>
                  <h3 className="font-semibold text-gray-700">Bio</h3>
                  <p className="mt-1">{profile.bio}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-700">Work</h3>
                <p className="mt-1">{profile?.work || 'Not specified'}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700">Education</h3>
                <p className="mt-1">{profile?.education || 'Not specified'}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700">Location</h3>
                <p className="mt-1">{profile?.location || 'Not specified'}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Friends</h2>
            <p className="text-gray-500">No friends to display.</p>
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Photos</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {photos.map((photo, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg relative">
                  <Image
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
