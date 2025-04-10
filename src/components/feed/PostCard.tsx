'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate, getInitials } from '@/lib/utils';
import { FaThumbsUp, FaComment, FaShare, FaEllipsisH, FaTrash, FaEdit, FaReply } from 'react-icons/fa';
import EmojiPicker from './EmojiPicker';

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
  const [commentImage, setCommentImage] = useState<File | null>(null);
  const [commentImagePreview, setCommentImagePreview] = useState<string | null>(null);
  const [comments, setComments] = useState<{
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: string;
    likes: number;
    is_liked: boolean;
    replies: Array<{
      id: string;
      comment_id: string;
      user_id: string;
      content: string;
      created_at: string;
      user: {
        full_name: string;
        avatar_url: string | null;
      };
    }>;
    user: {
      full_name: string;
      avatar_url: string | null;
    };
  }[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const optionsRef = useRef<HTMLDivElement>(null);
  const shareRef = useRef<HTMLDivElement>(null);

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

  // Close options menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
      if (shareRef.current && !shareRef.current.contains(event.target as Node)) {
        setShowShareOptions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          likes: 2,
          is_liked: false,
          replies: [
            {
              id: 'reply1',
              comment_id: '1',
              user_id: 'user2',
              content: 'I agree! Very helpful.',
              created_at: new Date(Date.now() - 1800000).toISOString(),
              user: {
                full_name: 'John Doe',
                avatar_url: null,
              },
            }
          ],
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
          likes: 1,
          is_liked: false,
          replies: [],
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

  const handleDeletePost = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      // In a real app, we would delete the post from the database
      alert('Post would be deleted in a real app');
      setShowOptions(false);
    }
  };

  const handleEditPost = () => {
    // In a real app, we would open an edit form
    alert('Post editing would be implemented in a real app');
    setShowOptions(false);
  };

  const handleShare = (type: string) => {
    // In a real app, we would implement actual sharing functionality
    alert(`Post shared ${type}`);
    setShowShareOptions(false);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev =>
      prev.map(comment => {
        if (comment.id === commentId) {
          const newIsLiked = !comment.is_liked;
          return {
            ...comment,
            is_liked: newIsLiked,
            likes: newIsLiked ? comment.likes + 1 : comment.likes - 1
          };
        }
        return comment;
      })
    );
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setReplyText('');
  };

  const handleAddReply = (commentId: string) => {
    if (!replyText.trim() || !currentUserId) return;

    const newReply = {
      id: Date.now().toString(),
      comment_id: commentId,
      user_id: currentUserId,
      content: replyText,
      created_at: new Date().toISOString(),
      user: {
        full_name: 'You', // In a real app, we would get the current user's name
        avatar_url: null,
      },
    };

    // Update the comments with the new reply
    setComments(prev =>
      prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, newReply]
          };
        }
        return comment;
      })
    );

    // Reset the reply state
    setReplyingTo(null);
    setReplyText('');
  };

  const handleEmojiSelect = (emoji: string) => {
    setCommentText(prev => prev + emoji);
  };

  const handleCommentImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setCommentImage(file);

    // Create a preview URL
    const reader = new FileReader();
    reader.onload = (event) => {
      setCommentImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddComment = async () => {
    if ((!commentText.trim() && !commentImage) || !currentUserId) return;

    // Create the new comment object
    const newComment = {
      id: Date.now().toString(),
      post_id: post.id,
      user_id: currentUserId,
      content: commentText,
      image_url: commentImagePreview,
      created_at: new Date().toISOString(),
      likes: 0,
      is_liked: false,
      replies: [],
      user: {
        full_name: 'You', // In a real app, we would get the current user's name
        avatar_url: null,
      },
    };

    // Optimistic update
    setComments(prev => [...prev, newComment]);
    setCommentText('');
    setCommentImage(null);
    setCommentImagePreview(null);

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
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/40x40?text=User';
                }}
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

        <div className="relative" ref={optionsRef}>
          <button
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
            onClick={() => setShowOptions(!showOptions)}
            aria-label="More options"
          >
            <FaEllipsisH />
          </button>

          {showOptions && (
            <div className="absolute right-0 top-10 z-10 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
              {post.user_id === currentUserId && (
                <>
                  <button
                    className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleEditPost}
                  >
                    <FaEdit className="mr-2" /> Edit Post
                  </button>
                  <button
                    className="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                    onClick={handleDeletePost}
                  >
                    <FaTrash className="mr-2" /> Delete Post
                  </button>
                </>
              )}
              <button
                className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  alert('Save post functionality would be implemented in a real app');
                  setShowOptions(false);
                }}
              >
                Save Post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post content */}
      <div className="px-4 pb-3">
        <p className="whitespace-pre-line break-words text-sm sm:text-base">{post.content}</p>
      </div>

      {/* Post image (if any) */}
      {post.image_url && (
        <div className="mb-3 relative h-[400px] w-full">
          <Image
            src={post.image_url}
            alt="Post image"
            fill
            className="object-contain rounded-md"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/800x600?text=Post+Image';
            }}
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
      <div className="flex border-b border-gray-300 text-xs sm:text-sm">
        <button
          onClick={handleLike}
          className={`flex flex-1 items-center justify-center py-2 hover:bg-gray-100 ${
            liked ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <FaThumbsUp className="mr-1 sm:mr-2" />
          <span>Like</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex flex-1 items-center justify-center py-2 text-gray-500 hover:bg-gray-100"
        >
          <FaComment className="mr-1 sm:mr-2" />
          <span>Comment</span>
        </button>

        <div className="relative flex flex-1" ref={shareRef}>
          <button
            className="flex w-full items-center justify-center py-2 text-gray-500 hover:bg-gray-100"
            onClick={() => setShowShareOptions(!showShareOptions)}
          >
            <FaShare className="mr-1 sm:mr-2" />
            <span>Share</span>
          </button>

          {showShareOptions && (
            <div className="absolute bottom-full left-0 mb-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-10">
              <button
                className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => handleShare('to your timeline')}
              >
                Share to your timeline
              </button>
              <button
                className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => handleShare('in a message')}
              >
                Share in a message
              </button>
              <button
                className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => handleShare('to a group')}
              >
                Share to a group
              </button>
            </div>
          )}
        </div>
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

            <div className="flex flex-1 flex-col">
              <div className="flex items-center rounded-full bg-gray-100 px-3 py-1">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 bg-transparent focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                />
                <div className="flex items-center">
                  <label className="cursor-pointer p-1 text-gray-500 hover:text-gray-700">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleCommentImageChange}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </label>
                  <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                </div>
              </div>

              {commentImagePreview && (
                <div className="relative mt-2 h-32 w-32 overflow-hidden rounded-md">
                  <img src={commentImagePreview} alt="Comment attachment" className="h-full w-full object-cover" />
                  <button
                    onClick={() => {
                      setCommentImage(null);
                      setCommentImagePreview(null);
                    }}
                    className="absolute right-1 top-1 rounded-full bg-gray-800 bg-opacity-70 p-1 text-white hover:bg-opacity-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Comments list */}
          <div className="space-y-3">
            {comments.map(comment => (
              <div key={comment.id} className="flex">
                <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                  {getInitials(comment.user.full_name)}
                </div>

                <div className="flex-1">
                  <div className="rounded-lg bg-gray-100 px-3 py-2">
                    <div className="font-semibold">{comment.user.full_name}</div>
                    <div>{comment.content}</div>
                    {comment.image_url && (
                      <div className="mt-2 max-w-xs overflow-hidden rounded-md">
                        <img
                          src={comment.image_url}
                          alt="Comment attachment"
                          className="max-h-48 w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/300x200?text=Image';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-1 flex space-x-3 text-xs text-gray-500">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className={`flex items-center hover:text-blue-600 ${comment.is_liked ? 'text-blue-600 font-semibold' : ''}`}
                    >
                      <FaThumbsUp className="mr-1" />
                      {comment.likes > 0 && comment.likes} Like{comment.likes !== 1 ? 's' : ''}
                    </button>
                    <button
                      onClick={() => handleReply(comment.id)}
                      className="flex items-center hover:text-blue-600"
                    >
                      <FaReply className="mr-1" />
                      Reply
                    </button>
                    <span>{formatTimeAgo(comment.created_at)}</span>
                  </div>

                  {/* Reply input */}
                  {replyingTo === comment.id && (
                    <div className="mt-2 flex">
                      <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-gray-700 text-xs">
                        {currentUserId ? 'U' : '?'}
                      </div>
                      <div className="flex flex-1 items-center">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="flex-1 rounded-l-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleAddReply(comment.id);
                            }
                          }}
                        />
                        <button
                          onClick={() => handleAddReply(comment.id)}
                          disabled={!replyText.trim()}
                          className="rounded-r-full bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700 disabled:bg-blue-300"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="mt-2 space-y-2 pl-8">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="flex">
                          <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-gray-700 text-xs">
                            {getInitials(reply.user.full_name)}
                          </div>
                          <div className="flex-1">
                            <div className="rounded-lg bg-gray-100 px-3 py-2">
                              <div className="font-semibold">{reply.user.full_name}</div>
                              <div>{reply.content}</div>
                            </div>
                            <div className="mt-1 flex space-x-3 text-xs text-gray-500">
                              <button className="flex items-center hover:text-blue-600">
                                <FaThumbsUp className="mr-1" />
                                Like
                              </button>
                              <span>{formatTimeAgo(reply.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
