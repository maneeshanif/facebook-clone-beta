'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate, getInitials } from '@/lib/utils';
import { FaThumbsUp, FaComment, FaShare, FaEllipsisH } from 'react-icons/fa';

interface PostCardProps {
  post: {
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
  };
  currentUserId: string | null;
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<any[]>([]);

  const handleLike = async () => {
    // Optimistic update
    const newLikedState = !liked;
    const likeDelta = newLikedState ? 1 : -1;
    setLiked(newLikedState);
    setLikesCount(prev => prev + likeDelta);

    try {
      // In a real app, we would update the like in the database
      // For example:
      /*
      if (newLikedState) {
        // Add like
        const { error } = await supabase
          .from('likes')
          .insert({
            post_id: post.id,
            user_id: currentUserId,
            created_at: new Date().toISOString()
          });

        if (error) throw error;
      } else {
        // Remove like
        const { error } = await supabase
          .from('likes')
          .delete()
          .match({
            post_id: post.id,
            user_id: currentUserId
          });

        if (error) throw error;
      }

      // Update post likes count
      const { error: updateError } = await supabase
        .from('posts')
        .update({ likes_count: likesCount + likeDelta })
        .eq('id', post.id);

      if (updateError) throw updateError;
      */
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert optimistic update on error
      setLiked(!newLikedState);
      setLikesCount(prev => prev - likeDelta);
    }
  };

  // Load comments when showing comments section
  useEffect(() => {
    if (showComments && comments.length === 0) {
      // In a real app, we would fetch comments from the database
      // For now, we'll just simulate it with mock data
      const mockComments = [
        {
          id: '1',
          post_id: post.id,
          user_id: 'user1',
          content: 'Great post! Thanks for sharing.',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          user: {
            full_name: 'Jane Smith',
            avatar_url: null,
          },
        },
        {
          id: '2',
          post_id: post.id,
          user_id: 'user2',
          content: 'I totally agree with this!',
          created_at: new Date(Date.now() - 7200000).toISOString(),
          user: {
            full_name: 'John Doe',
            avatar_url: null,
          },
        },
      ];

      // Only add mock comments if the post has comments
      if (post.comments_count > 0) {
        setComments(mockComments);
      }
    }
  }, [showComments, comments.length, post.id, post.comments_count]);

  const handleAddComment = async () => {
    if (!commentText.trim() || !currentUserId) return;

    // Create the new comment object
    const newComment = {
      id: Date.now().toString(),
      post_id: post.id,
      user_id: currentUserId,
      content: commentText,
      created_at: new Date().toISOString(),
      user: {
        full_name: 'You', // In a real app, we would get the current user's name
        avatar_url: null,
      },
    };

    // Optimistic update
    setComments(prev => [...prev, newComment]);
    setCommentText('');

    try {
      // In a real app, we would save the comment to the database
      // For example:
      /*
      // Insert comment
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: post.id,
          user_id: currentUserId,
          content: commentText,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update post comments count
      const { error: updateError } = await supabase
        .from('posts')
        .update({ comments_count: post.comments_count + 1 })
        .eq('id', post.id);

      if (updateError) throw updateError;
      */
    } catch (error) {
      console.error('Error adding comment:', error);
      // Remove the comment on error
      setComments(prev => prev.filter(c => c.id !== newComment.id));
    }
  };

  return (
    <div className="rounded-lg bg-white shadow">
      {/* Post header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <Link href={`/profile/${post.user_id}`}>
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
          </Link>

          <div className="ml-3">
            <Link href={`/profile/${post.user_id}`} className="font-semibold hover:underline">
              {post.user.full_name}
            </Link>
            <p className="text-sm text-gray-500">
              {formatDate(new Date(post.created_at))}
            </p>
          </div>
        </div>

        <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
          <FaEllipsisH />
        </button>
      </div>

      {/* Post content */}
      <div className="px-4 pb-3">
        <p className="whitespace-pre-line">{post.content}</p>
      </div>

      {/* Post image (if any) */}
      {post.image_url && (
        <div className="mb-3">
          <img
            src={post.image_url}
            alt="Post image"
            className="w-full max-h-[600px] object-contain rounded-md"
          />
        </div>
      )}

      {/* Post stats */}
      <div className="border-b border-t border-gray-300 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
              <FaThumbsUp size={10} />
            </div>
            <span className="ml-2 text-sm text-gray-500">{likesCount}</span>
          </div>

          <div className="text-sm text-gray-500">
            <button onClick={() => setShowComments(!showComments)}>
              {post.comments_count + comments.length} comments
            </button>
          </div>
        </div>
      </div>

      {/* Post actions */}
      <div className="flex border-b border-gray-300">
        <button
          onClick={handleLike}
          className={`flex flex-1 items-center justify-center py-2 hover:bg-gray-100 ${
            liked ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <FaThumbsUp className="mr-2" />
          <span>Like</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex flex-1 items-center justify-center py-2 text-gray-500 hover:bg-gray-100"
        >
          <FaComment className="mr-2" />
          <span>Comment</span>
        </button>

        <button className="flex flex-1 items-center justify-center py-2 text-gray-500 hover:bg-gray-100">
          <FaShare className="mr-2" />
          <span>Share</span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="p-4">
          {/* Comment input */}
          <div className="mb-4 flex">
            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-gray-700">
              {/* In a real app, we would show the current user's avatar */}
              {currentUserId ? 'U' : '?'}
            </div>

            <div className="flex-1 rounded-full bg-gray-100 px-3 py-1">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full bg-transparent focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddComment();
                  }
                }}
              />
            </div>
          </div>

          {/* Comments list */}
          <div className="space-y-3">
            {comments.map(comment => (
              <div key={comment.id} className="flex">
                <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                  {getInitials(comment.user.full_name)}
                </div>

                <div className="rounded-lg bg-gray-100 px-3 py-2">
                  <div className="font-semibold">{comment.user.full_name}</div>
                  <div>{comment.content}</div>
                </div>
              </div>
            ))}

            {comments.length === 0 && (
              <p className="text-center text-sm text-gray-500">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
