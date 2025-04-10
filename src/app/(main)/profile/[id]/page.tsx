'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { getInitials } from '@/lib/utils';
import { FaCamera, FaEdit, FaUserFriends } from 'react-icons/fa';
import PostCard from '@/components/feed/PostCard';

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

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'friends' | 'photos'>('posts');
  const [friends, setFriends] = useState<{id: string; full_name: string; avatar_url: string | null}[]>([]);
  const [photos, setPhotos] = useState<{id: string; url: string; caption: string | null}[]>([]);

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      setIsLoading(true);

      // Get current user
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setCurrentUserId(session.user.id);
        setIsCurrentUser(session.user.id === params.id);
      }

      // In a real app, fetch profile from Supabase
      // For now, we'll use mock data
      const mockProfile: Profile = {
        id: params.id,
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

      // In a real app, fetch posts from Supabase
      // For now, we'll use mock data
      const mockPosts: Post[] = [
        {
          id: '1',
          user_id: params.id,
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
          user_id: params.id,
          content: 'Beautiful day at the beach! 🏖️',
          image_url: 'https://source.unsplash.com/random/800x600/?beach',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          likes_count: 42,
          comments_count: 7,
          user: {
            full_name: mockProfile.full_name,
            avatar_url: mockProfile.avatar_url,
          },
        },
        {
          id: '3',
          user_id: params.id,
          content: 'Exploring the mountains this weekend! 🏔️',
          image_url: 'https://source.unsplash.com/random/800x600/?mountains',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          likes_count: 38,
          comments_count: 5,
          user: {
            full_name: mockProfile.full_name,
            avatar_url: mockProfile.avatar_url,
          },
        },
      ];

      // Mock friends data
      const mockFriends = [
        { id: 'friend1', full_name: 'Jane Smith', avatar_url: null },
        { id: 'friend2', full_name: 'John Doe', avatar_url: null },
        { id: 'friend3', full_name: 'Alice Johnson', avatar_url: null },
        { id: 'friend4', full_name: 'Bob Williams', avatar_url: null },
        { id: 'friend5', full_name: 'Carol Brown', avatar_url: null },
        { id: 'friend6', full_name: 'David Miller', avatar_url: null },
      ];

      // Mock photos data
      const mockPhotos = [
        {
          id: 'photo1',
          url: 'https://source.unsplash.com/random/800x600/?beach',
          caption: 'Beautiful day at the beach!'
        },
        {
          id: 'photo2',
          url: 'https://source.unsplash.com/random/800x600/?mountains',
          caption: 'Exploring the mountains this weekend!'
        },
        {
          id: 'photo3',
          url: 'https://source.unsplash.com/random/800x600/?city',
          caption: 'City lights'
        },
        {
          id: 'photo4',
          url: 'https://source.unsplash.com/random/800x600/?food',
          caption: 'Delicious dinner'
        },
        {
          id: 'photo5',
          url: 'https://source.unsplash.com/random/800x600/?nature',
          caption: 'Nature walk'
        },
        {
          id: 'photo6',
          url: 'https://source.unsplash.com/random/800x600/?travel',
          caption: 'Travel memories'
        },
      ];

      setPosts(mockPosts);
      setFriends(mockFriends);
      setPhotos(mockPhotos);
      setIsLoading(false);
    };

    fetchProfileAndPosts();
  }, [params.id]);

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
      <div className="relative h-64 w-full bg-gradient-to-r from-blue-400 to-blue-600">
        {profile.cover_url && (
          <Image
            src={profile.cover_url}
            alt="Cover photo"
            fill
            className="object-cover"
          />
        )}

        {isCurrentUser && (
          <button className="absolute bottom-4 right-4 rounded-md bg-gray-800 bg-opacity-60 px-4 py-2 text-white hover:bg-opacity-80">
            <FaCamera className="mr-2 inline" />
            Edit Cover Photo
          </button>
        )}
      </div>

      {/* Profile info */}
      <div className="relative mx-auto -mt-20 max-w-5xl px-4">
        <div className="flex flex-col items-center md:flex-row md:items-end">
          <div className="relative">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.full_name}
                width={168}
                height={168}
                className="rounded-full border-4 border-white bg-white"
              />
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-white bg-gray-300 text-4xl text-gray-700">
                {getInitials(profile.full_name)}
              </div>
            )}

            {isCurrentUser && (
              <button className="absolute bottom-2 right-2 rounded-full bg-gray-200 p-2 hover:bg-gray-300">
                <FaCamera />
              </button>
            )}
          </div>

          <div className="mt-4 flex-1 text-center md:ml-6 md:text-left">
            <h1 className="text-3xl font-bold">{profile.full_name}</h1>
            {profile.bio && <p className="mt-1 text-gray-600">{profile.bio}</p>}

            <div className="mt-2 flex flex-wrap justify-center gap-4 text-sm text-gray-600 md:justify-start">
              {profile.location && (
                <div>
                  <span className="font-semibold">Lives in:</span> {profile.location}
                </div>
              )}

              {profile.work && (
                <div>
                  <span className="font-semibold">Works at:</span> {profile.work}
                </div>
              )}

              {profile.education && (
                <div>
                  <span className="font-semibold">Studied at:</span> {profile.education}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex space-x-2 md:mt-0">
            {isCurrentUser ? (
              <button className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
                <FaEdit className="mr-2 inline" />
                Edit Profile
              </button>
            ) : (
              <>
                <button className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
                  <FaUserFriends className="mr-2 inline" />
                  Add Friend
                </button>
                <button className="rounded-md bg-gray-200 px-4 py-2 font-semibold hover:bg-gray-300">
                  Message
                </button>
              </>
            )}
          </div>
        </div>

        <hr className="my-6 border-gray-300" />

        {/* Tabs */}
        <div className="mb-4 border-b border-gray-300">
          <nav className="-mb-px flex space-x-8">
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

        {/* Posts Tab */}
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

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">About</h2>

            <div className="space-y-6">
              {profile.bio && (
                <div>
                  <h3 className="mb-2 text-lg font-medium">Bio</h3>
                  <p className="text-gray-700">{profile.bio}</p>
                </div>
              )}

              <div>
                <h3 className="mb-2 text-lg font-medium">Basic Information</h3>
                <div className="space-y-2">
                  {profile.location && (
                    <div className="flex">
                      <span className="w-32 font-medium">Location:</span>
                      <span className="text-gray-700">{profile.location}</span>
                    </div>
                  )}

                  {profile.work && (
                    <div className="flex">
                      <span className="w-32 font-medium">Work:</span>
                      <span className="text-gray-700">{profile.work}</span>
                    </div>
                  )}

                  {profile.education && (
                    <div className="flex">
                      <span className="w-32 font-medium">Education:</span>
                      <span className="text-gray-700">{profile.education}</span>
                    </div>
                  )}
                </div>
              </div>

              {isCurrentUser && (
                <div className="pt-4">
                  <button className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
                    <FaEdit className="mr-2 inline" />
                    Edit Details
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Friends</h2>
              <span className="text-gray-500">{friends.length} friends</span>
            </div>

            {friends.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {friends.map(friend => (
                  <div key={friend.id} className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
                    <div className="flex items-center">
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
                      <div className="ml-3">
                        <Link href={`/profile/${friend.id}`} className="font-semibold hover:underline">
                          {friend.full_name}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p>No friends to show</p>
              </div>
            )}
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Photos</h2>
              <span className="text-gray-500">{photos.length} photos</span>
            </div>

            {photos.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {photos.map(photo => (
                  <div key={photo.id} className="overflow-hidden rounded-lg">
                    <div className="relative h-48 w-full">
                      <img
                        src={photo.url}
                        alt={photo.caption || 'Photo'}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {photo.caption && (
                      <div className="p-2">
                        <p className="text-sm text-gray-700">{photo.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p>No photos to show</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
