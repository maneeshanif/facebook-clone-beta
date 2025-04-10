'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { getInitials } from '@/lib/utils';
import { FaImage, FaVideo, FaSmile, FaTimes } from 'react-icons/fa';

interface CreatePostCardProps {
  userId: string | null;
  onPostCreated: (post: any) => void;
}

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

export default function CreatePostCard({ userId, onPostCreated }: CreatePostCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (userId) {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .eq('id', userId)
          .single();

        if (!error && data) {
          setProfile(data);
        }
      }
    };

    fetchProfile();
  }, [userId]);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);

    // Create a preview URL for the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!postContent.trim() || !userId) return;

    setIsSubmitting(true);

    try {
      let imageUrl = null;

      // If there's a selected image, upload it to Supabase Storage
      if (selectedImage) {
        try {
          // In a real app, we would upload to Supabase Storage
          // For now, we'll just use the preview URL
          imageUrl = imagePreviewUrl;

          // This is how you would upload to Supabase Storage in a real app:
          /*
          const { data, error } = await supabase.storage
            .from('post-images')
            .upload(`${userId}/${Date.now()}-${selectedImage.name}`, selectedImage);

          if (error) throw error;

          // Get the public URL for the uploaded image
          const { data: { publicUrl } } = supabase.storage
            .from('post-images')
            .getPublicUrl(data.path);

          imageUrl = publicUrl;
          */
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          // Continue without the image if upload fails
        }
      }

      // Create the post object
      const newPost = {
        id: Date.now().toString(),
        user_id: userId,
        content: postContent,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
        likes_count: 0,
        comments_count: 0,
        user: {
          full_name: profile?.full_name || 'User',
          avatar_url: profile?.avatar_url,
        },
      };

      // In a real app, we would save to Supabase
      // const { error } = await supabase.from('posts').insert(newPost);
      // if (error) throw error;

      // Notify parent component about the new post
      onPostCreated(newPost);

      // Reset form
      setPostContent('');
      setSelectedImage(null);
      setImagePreviewUrl(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="flex items-center space-x-2">
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.full_name}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700">
              {profile ? getInitials(profile.full_name) : 'U'}
            </div>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 rounded-full bg-gray-100 px-4 py-2 text-left text-gray-500 hover:bg-gray-200"
          >
            What's on your mind, {profile?.full_name?.split(' ')[0] || 'there'}?
          </button>
        </div>

        <hr className="my-3 border-gray-300" />

        <div className="flex justify-between">
          <button className="flex flex-1 items-center justify-center rounded-lg py-2 hover:bg-gray-100">
            <FaVideo className="mr-2 text-red-500" />
            <span>Live Video</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex flex-1 items-center justify-center rounded-lg py-2 hover:bg-gray-100"
          >
            <FaImage className="mr-2 text-green-500" />
            <span>Photo/Video</span>
          </button>

          <button className="flex flex-1 items-center justify-center rounded-lg py-2 hover:bg-gray-100">
            <FaSmile className="mr-2 text-yellow-500" />
            <span>Feeling/Activity</span>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
            <div className="border-b border-gray-300 p-4">
              <h3 className="text-center text-xl font-semibold">Create Post</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4 flex items-center">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                    {profile ? getInitials(profile.full_name) : 'U'}
                  </div>
                )}
                <span className="ml-2 font-semibold">{profile?.full_name}</span>
              </div>

              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What's on your mind?"
                className="min-h-[150px] w-full resize-none rounded-lg border-none p-2 text-lg focus:outline-none"
                autoFocus
              />

              {/* Image preview */}
              {imagePreviewUrl && (
                <div className="mt-4 relative">
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    className="w-full rounded-lg max-h-60 object-contain"
                  />
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 rounded-full p-1 text-white hover:bg-opacity-100"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              )}

              <div className="mt-4 rounded-lg border border-gray-300 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Add to your post</span>
                  <div className="flex space-x-2">
                    <label className="rounded-full p-2 hover:bg-gray-100 cursor-pointer">
                      <FaImage className="text-green-500" size={20} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                    <button className="rounded-full p-2 hover:bg-gray-100">
                      <FaVideo className="text-red-500" size={20} />
                    </button>
                    <button className="rounded-full p-2 hover:bg-gray-100">
                      <FaSmile className="text-yellow-500" size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4">
              <button
                onClick={handleSubmit}
                disabled={!postContent.trim() || isSubmitting}
                className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
