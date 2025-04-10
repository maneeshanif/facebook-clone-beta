'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { getInitials } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { FaThumbsUp, FaComment, FaShare, FaBookmark, FaEllipsisH, FaSmile, FaImage, FaReply } from 'react-icons/fa';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  views: number;
  likes: number;
  comments: number;
  duration: string;
  created_at: string;
  is_liked?: boolean;
  user: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

export default function WatchPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'all' | 'live' | 'shows' | 'saved'>('all');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [savedVideos, setSavedVideos] = useState<string[]>([]);
  const [showShareOptions, setShowShareOptions] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);

      // In a real app, we would fetch from Supabase
      // For now, we'll use mock data

      // Mock videos data
      const mockVideos: Video[] = [
        {
          id: 'video1',
          title: 'Amazing Sunset at the Beach',
          description: 'Captured this beautiful sunset during my vacation. The colors were absolutely breathtaking!',
          thumbnail_url: 'https://source.unsplash.com/random/800x450/?sunset,beach',
          video_url: 'https://www.example.com/videos/sunset.mp4',
          views: 1542,
          likes: 342,
          comments: 56,
          duration: '3:24',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          user: {
            id: 'user1',
            full_name: 'Jane Smith',
            avatar_url: null,
          },
        },
        {
          id: 'video2',
          title: 'Mountain Hiking Adventure',
          description: 'Spent the weekend hiking in the mountains. The views were incredible and the air was so fresh!',
          thumbnail_url: 'https://source.unsplash.com/random/800x450/?mountains,hiking',
          video_url: 'https://www.example.com/videos/hiking.mp4',
          views: 2876,
          likes: 521,
          comments: 78,
          duration: '5:12',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          user: {
            id: 'user2',
            full_name: 'John Doe',
            avatar_url: null,
          },
        },
        {
          id: 'video3',
          title: 'City Lights at Night',
          description: 'The city comes alive at night with all these beautiful lights. Such an amazing atmosphere!',
          thumbnail_url: 'https://source.unsplash.com/random/800x450/?city,night',
          video_url: 'https://www.example.com/videos/city.mp4',
          views: 4231,
          likes: 876,
          comments: 124,
          duration: '4:45',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          user: {
            id: 'user3',
            full_name: 'Alice Johnson',
            avatar_url: null,
          },
        },
        {
          id: 'video4',
          title: 'Cooking Italian Pasta',
          description: 'Learn how to make authentic Italian pasta from scratch. Simple ingredients, amazing flavor!',
          thumbnail_url: 'https://source.unsplash.com/random/800x450/?pasta,cooking',
          video_url: 'https://www.example.com/videos/cooking.mp4',
          views: 8765,
          likes: 1243,
          comments: 215,
          duration: '12:38',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          user: {
            id: 'user4',
            full_name: 'Bob Williams',
            avatar_url: null,
          },
        },
        {
          id: 'video5',
          title: 'Cute Puppies Playing',
          description: 'Just some adorable puppies playing together. Guaranteed to brighten your day!',
          thumbnail_url: 'https://source.unsplash.com/random/800x450/?puppies,dogs',
          video_url: 'https://www.example.com/videos/puppies.mp4',
          views: 15432,
          likes: 3421,
          comments: 432,
          duration: '2:56',
          created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          user: {
            id: 'user5',
            full_name: 'Carol Brown',
            avatar_url: null,
          },
        },
        {
          id: 'video6',
          title: 'Drone Footage of Ocean Waves',
          description: 'Amazing aerial footage of ocean waves crashing against the shore. Shot with DJI Mavic Air 2.',
          thumbnail_url: 'https://source.unsplash.com/random/800x450/?ocean,waves',
          video_url: 'https://www.example.com/videos/ocean.mp4',
          views: 6543,
          likes: 987,
          comments: 132,
          duration: '6:21',
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          user: {
            id: 'user6',
            full_name: 'David Miller',
            avatar_url: null,
          },
        },
      ];

      setVideos(mockVideos);
      setIsLoading(false);
    };

    fetchVideos();
  }, []);

  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    } else {
      return views.toString();
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

  const filteredVideos = videos.filter(video => {
    if (activeCategory === 'all') return true;
    // In a real app, we would filter based on category
    return true;
  });

  const handleLikeVideo = () => {
    if (!selectedVideo) return;

    // Update the selected video
    const updatedVideo = {
      ...selectedVideo,
      likes: selectedVideo.is_liked ? selectedVideo.likes - 1 : selectedVideo.likes + 1,
      is_liked: !selectedVideo.is_liked
    };
    setSelectedVideo(updatedVideo);

    // Update the video in the list
    setVideos(videos.map(video =>
      video.id === selectedVideo.id ? updatedVideo : video
    ));
  };

  const handleAddComment = () => {
    if (!selectedVideo || !commentText.trim()) return;

    // Update the selected video
    const updatedVideo = {
      ...selectedVideo,
      comments: selectedVideo.comments + 1
    };
    setSelectedVideo(updatedVideo);

    // Update the video in the list
    setVideos(videos.map(video =>
      video.id === selectedVideo.id ? updatedVideo : video
    ));

    // Clear the comment text
    setCommentText('');

    // Show a success message
    alert('Comment added successfully!');
  };

  const handleSaveVideo = () => {
    if (!selectedVideo) return;

    if (savedVideos.includes(selectedVideo.id)) {
      // Remove from saved videos
      setSavedVideos(savedVideos.filter(id => id !== selectedVideo.id));
      alert('Video removed from saved items');
    } else {
      // Add to saved videos
      setSavedVideos([...savedVideos, selectedVideo.id]);
      alert('Video saved successfully!');
    }
  };

  const isVideoSaved = (videoId: string) => {
    return savedVideos.includes(videoId);
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

      <div className="container mx-auto flex flex-1 flex-col lg:flex-row px-4 py-6">
        <Sidebar className="sticky top-16 hidden w-full lg:w-1/5 lg:block" />

        <div className="w-full lg:w-4/5 lg:pl-4">
          {selectedVideo ? (
            <div className="mb-6">
              <div className="rounded-lg bg-white shadow">
                {/* Video player */}
                <div className="relative aspect-video w-full bg-black">
                  <div className="absolute inset-0">
                    <Image
                      src={selectedVideo.thumbnail_url}
                      alt={selectedVideo.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/800x450?text=Video+Thumbnail';
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-black bg-opacity-70 p-4 text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Video info */}
                <div className="p-4">
                  <h1 className="text-xl sm:text-2xl font-bold">{selectedVideo.title}</h1>
                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500">
                    <div className="mb-2 sm:mb-0">
                      {formatViews(selectedVideo.views)} views • {formatTimeAgo(selectedVideo.created_at)}
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-4">
                      <button
                        onClick={handleLikeVideo}
                        className={`flex items-center ${selectedVideo.is_liked ? 'text-blue-600' : ''}`}
                      >
                        <FaThumbsUp className="mr-1" />
                        {selectedVideo.likes}
                      </button>
                      <button
                        onClick={() => setShowComments(!showComments)}
                        className={`flex items-center ${showComments ? 'text-blue-600' : ''}`}
                      >
                        <FaComment className="mr-1" />
                        {selectedVideo.comments}
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setShowShareOptions(!showShareOptions)}
                          className="flex items-center"
                        >
                          <FaShare className="mr-1" />
                          <span className="hidden sm:inline">Share</span>
                        </button>

                        {showShareOptions && (
                          <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                            <button
                              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                alert('Shared to your timeline!');
                                setShowShareOptions(false);
                              }}
                            >
                              Share to your timeline
                            </button>
                            <button
                              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                alert('Shared in a message!');
                                setShowShareOptions(false);
                              }}
                            >
                              Share in a message
                            </button>
                            <button
                              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                alert('Shared to a group!');
                                setShowShareOptions(false);
                              }}
                            >
                              Share to a group
                            </button>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleSaveVideo}
                        className={`flex items-center ${isVideoSaved(selectedVideo.id) ? 'text-blue-600' : ''}`}
                      >
                        <FaBookmark className="mr-1" />
                        <span className="hidden sm:inline">
                          {isVideoSaved(selectedVideo.id) ? 'Saved' : 'Save'}
                        </span>
                      </button>
                      <button>
                        <FaEllipsisH />
                      </button>
                    </div>
                  </div>

                  <hr className="my-4 border-gray-200" />

                  {/* Channel info */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center mb-3 sm:mb-0">
                      {selectedVideo.user.avatar_url ? (
                        <Image
                          src={selectedVideo.user.avatar_url}
                          alt={selectedVideo.user.full_name}
                          width={40}
                          height={40}
                          className="rounded-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/40x40?text=User';
                          }}
                        />
                      ) : (
                        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                          {getInitials(selectedVideo.user.full_name)}
                        </div>
                      )}
                      <div className="ml-3">
                        <Link href={`/profile/${selectedVideo.user.id}`} className="font-semibold hover:underline">
                          {selectedVideo.user.full_name}
                        </Link>
                      </div>
                    </div>
                    <button className="self-start sm:self-auto rounded-md bg-blue-600 px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base font-semibold text-white hover:bg-blue-700">
                      Follow
                    </button>
                  </div>

                  <div className="mt-4">
                    <p className="whitespace-pre-line text-gray-700">{selectedVideo.description}</p>
                  </div>

                  {showComments && (
                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <h3 className="mb-4 text-lg font-semibold">Comments ({selectedVideo.comments})</h3>

                      <div className="mb-4 flex">
                        <div className="mr-2 flex-shrink-0">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-gray-700 text-xs">
                            U
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex flex-col">
                            <div className="flex">
                              <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-grow rounded-l-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                              />
                              <button
                                onClick={handleAddComment}
                                disabled={!commentText.trim()}
                                className="rounded-r-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
                              >
                                Post
                              </button>
                            </div>
                            <div className="mt-2 flex space-x-2">
                              <button className="rounded-full p-1 hover:bg-gray-100" title="Add emoji">
                                <FaSmile className="text-gray-500" />
                              </button>
                              <label className="cursor-pointer rounded-full p-1 hover:bg-gray-100" title="Add image">
                                <FaImage className="text-gray-500" />
                                <input type="file" className="hidden" accept="image/*" />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Sample comments */}
                        <div className="flex">
                          <div className="mr-2 flex-shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-gray-700 text-xs">
                              JD
                            </div>
                          </div>
                          <div>
                            <div className="rounded-lg bg-gray-100 p-3">
                              <p className="font-semibold">John Doe</p>
                              <p className="text-sm">Great video! Thanks for sharing.</p>
                            </div>
                            <div className="mt-1 flex space-x-2 text-xs text-gray-500">
                              <button className="flex items-center hover:text-blue-600">
                                <FaThumbsUp className="mr-1" />
                                Like
                              </button>
                              <button className="flex items-center hover:text-blue-600">
                                <FaReply className="mr-1" />
                                Reply
                              </button>
                              <span>2 hours ago</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex">
                          <div className="mr-2 flex-shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-gray-700 text-xs">
                              JS
                            </div>
                          </div>
                          <div>
                            <div className="rounded-lg bg-gray-100 p-3">
                              <p className="font-semibold">Jane Smith</p>
                              <p className="text-sm">I learned a lot from this. Looking forward to more content!</p>
                            </div>
                            <div className="mt-1 flex space-x-2 text-xs text-gray-500">
                              <button className="flex items-center hover:text-blue-600">
                                <FaThumbsUp className="mr-1" />
                                Like
                              </button>
                              <button className="flex items-center hover:text-blue-600">
                                <FaReply className="mr-1" />
                                Reply
                              </button>
                              <span>1 day ago</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex justify-between">
                <h2 className="text-xl font-semibold">More videos</h2>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="text-blue-600 hover:underline"
                >
                  Back to all videos
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Watch</h1>
              <p className="text-gray-600">Videos you might like</p>

              <div className="mt-4 flex space-x-4 border-b border-gray-300">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`pb-2 font-medium ${
                    activeCategory === 'all'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Videos
                </button>
                <button
                  onClick={() => setActiveCategory('live')}
                  className={`pb-2 font-medium ${
                    activeCategory === 'live'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Live
                </button>
                <button
                  onClick={() => setActiveCategory('shows')}
                  className={`pb-2 font-medium ${
                    activeCategory === 'shows'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Shows
                </button>
                <button
                  onClick={() => setActiveCategory('saved')}
                  className={`pb-2 font-medium ${
                    activeCategory === 'saved'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Saved
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map(video => (
              <div
                key={video.id}
                className="overflow-hidden rounded-lg bg-white shadow transition-transform hover:scale-105"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative">
                  <div className="relative h-48 w-full">
                    <Image
                      src={video.thumbnail_url}
                      alt={video.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/400x225?text=Video';
                      }}
                    />
                  </div>
                  <div className="absolute bottom-2 right-2 rounded bg-black bg-opacity-70 px-2 py-1 text-xs text-white">
                    {video.duration}
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex">
                    {video.user.avatar_url ? (
                      <Image
                        src={video.user.avatar_url}
                        alt={video.user.full_name}
                        width={32}
                        height={32}
                        className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/32x32?text=User';
                        }}
                      />
                    ) : (
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700 text-xs sm:text-sm">
                        {getInitials(video.user.full_name)}
                      </div>
                    )}
                    <div className="ml-2 sm:ml-3 flex-1">
                      <h3 className="font-semibold text-sm sm:text-base line-clamp-2">{video.title}</h3>
                      <p className="mt-1 text-xs sm:text-sm text-gray-500 truncate">
                        {video.user.full_name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {formatViews(video.views)} views • {formatTimeAgo(video.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
