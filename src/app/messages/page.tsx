'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { getInitials } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import { FaPaperPlane, FaImage, FaSmile, FaEllipsisH, FaSearch } from 'react-icons/fa';

interface Conversation {
  id: string;
  user: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  last_message: string;
  last_message_time: string;
  unread: number;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchUserAndConversations = async () => {
      setIsLoading(true);
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = '/login';
        return;
      }
      
      setCurrentUserId(session.user.id);
      
      // In a real app, we would fetch from Supabase
      // For now, we'll use mock data
      
      // Mock conversations data
      const mockConversations: Conversation[] = [
        {
          id: 'conv1',
          user: {
            id: 'user1',
            full_name: 'Jane Smith',
            avatar_url: null,
          },
          last_message: 'Hey, how are you doing?',
          last_message_time: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          unread: 2,
        },
        {
          id: 'conv2',
          user: {
            id: 'user2',
            full_name: 'John Doe',
            avatar_url: null,
          },
          last_message: 'Did you see the game last night?',
          last_message_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          unread: 0,
        },
        {
          id: 'conv3',
          user: {
            id: 'user3',
            full_name: 'Alice Johnson',
            avatar_url: null,
          },
          last_message: 'Thanks for the help!',
          last_message_time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          unread: 0,
        },
        {
          id: 'conv4',
          user: {
            id: 'user4',
            full_name: 'Bob Williams',
            avatar_url: null,
          },
          last_message: 'Let me know when you\'re free',
          last_message_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          unread: 0,
        },
      ];
      
      setConversations(mockConversations);
      setActiveConversation(mockConversations[0]);
      setIsLoading(false);
    };
    
    fetchUserAndConversations();
  }, []);
  
  useEffect(() => {
    if (activeConversation) {
      // In a real app, we would fetch messages from Supabase
      // For now, we'll use mock data
      
      // Mock messages data
      const mockMessages: Message[] = [
        {
          id: 'msg1',
          conversation_id: activeConversation.id,
          sender_id: activeConversation.user.id,
          content: 'Hey there!',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          is_read: true,
        },
        {
          id: 'msg2',
          conversation_id: activeConversation.id,
          sender_id: currentUserId!,
          content: 'Hi! How are you?',
          created_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
          is_read: true,
        },
        {
          id: 'msg3',
          conversation_id: activeConversation.id,
          sender_id: activeConversation.user.id,
          content: 'I\'m doing well, thanks for asking! How about you?',
          created_at: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
          is_read: true,
        },
        {
          id: 'msg4',
          conversation_id: activeConversation.id,
          sender_id: currentUserId!,
          content: 'Pretty good! Just working on some projects.',
          created_at: new Date(Date.now() - 21 * 60 * 60 * 1000).toISOString(),
          is_read: true,
        },
        {
          id: 'msg5',
          conversation_id: activeConversation.id,
          sender_id: activeConversation.user.id,
          content: 'That sounds interesting! What kind of projects?',
          created_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
          is_read: true,
        },
        {
          id: 'msg6',
          conversation_id: activeConversation.id,
          sender_id: currentUserId!,
          content: 'I\'m building a Facebook clone with Next.js!',
          created_at: new Date(Date.now() - 19 * 60 * 60 * 1000).toISOString(),
          is_read: true,
        },
        {
          id: 'msg7',
          conversation_id: activeConversation.id,
          sender_id: activeConversation.user.id,
          content: 'Wow, that\'s awesome! How\'s it going so far?',
          created_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
          is_read: true,
        },
        {
          id: 'msg8',
          conversation_id: activeConversation.id,
          sender_id: activeConversation.user.id,
          content: 'Hey, how are you doing?',
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          is_read: false,
        },
      ];
      
      setMessages(mockMessages);
      
      // Mark conversation as read
      setConversations(prev => 
        prev.map(conv => 
          conv.id === activeConversation.id 
            ? { ...conv, unread: 0 } 
            : conv
        )
      );
      
      // Scroll to bottom of messages
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [activeConversation, currentUserId]);
  
  useEffect(() => {
    // Scroll to bottom when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation || !currentUserId) return;
    
    // Create new message
    const newMsg: Message = {
      id: Date.now().toString(),
      conversation_id: activeConversation.id,
      sender_id: currentUserId,
      content: newMessage,
      created_at: new Date().toISOString(),
      is_read: false,
    };
    
    // Add to messages
    setMessages(prev => [...prev, newMsg]);
    
    // Update conversation
    setConversations(prev => 
      prev.map(conv => 
        conv.id === activeConversation.id 
          ? { 
              ...conv, 
              last_message: newMessage,
              last_message_time: new Date().toISOString(),
            } 
          : conv
      )
    );
    
    // Clear input
    setNewMessage('');
  };
  
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  const formatConversationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m`;
    } else if (diffMinutes < 24 * 60) {
      return `${Math.floor(diffMinutes / 60)}h`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  const filteredConversations = conversations.filter(conv => 
    conv.user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
        <div className="flex w-full overflow-hidden rounded-lg bg-white shadow">
          {/* Conversations list */}
          <div className="w-full border-r border-gray-300 md:w-1/3">
            <div className="border-b border-gray-300 p-4">
              <h2 className="text-2xl font-bold">Chats</h2>
              <div className="mt-2 relative">
                <input
                  type="text"
                  placeholder="Search messages"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-gray-300 bg-gray-100 px-4 py-2 pl-10 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-500" />
              </div>
            </div>
            
            <div className="h-[calc(100vh-13rem)] overflow-y-auto">
              {filteredConversations.length > 0 ? (
                filteredConversations.map(conversation => (
                  <div
                    key={conversation.id}
                    onClick={() => setActiveConversation(conversation)}
                    className={`cursor-pointer border-b border-gray-200 p-4 hover:bg-gray-50 ${
                      activeConversation?.id === conversation.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="relative mr-3">
                        {conversation.user.avatar_url ? (
                          <Image
                            src={conversation.user.avatar_url}
                            alt={conversation.user.full_name}
                            width={50}
                            height={50}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-xl text-gray-700">
                            {getInitials(conversation.user.full_name)}
                          </div>
                        )}
                        {conversation.unread > 0 && (
                          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            {conversation.unread}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold truncate">{conversation.user.full_name}</h3>
                          <span className="text-xs text-gray-500">
                            {formatConversationTime(conversation.last_message_time)}
                          </span>
                        </div>
                        <p className={`text-sm truncate ${conversation.unread > 0 ? 'font-semibold text-black' : 'text-gray-600'}`}>
                          {conversation.last_message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No conversations found
                </div>
              )}
            </div>
          </div>
          
          {/* Messages */}
          <div className="hidden w-2/3 flex-col md:flex">
            {activeConversation ? (
              <>
                {/* Conversation header */}
                <div className="flex items-center justify-between border-b border-gray-300 p-4">
                  <div className="flex items-center">
                    {activeConversation.user.avatar_url ? (
                      <Image
                        src={activeConversation.user.avatar_url}
                        alt={activeConversation.user.full_name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                        {getInitials(activeConversation.user.full_name)}
                      </div>
                    )}
                    <div className="ml-3">
                      <h3 className="font-semibold">{activeConversation.user.full_name}</h3>
                      <p className="text-xs text-gray-500">Active now</p>
                    </div>
                  </div>
                  <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                    <FaEllipsisH />
                  </button>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.sender_id !== currentUserId && (
                          <div className="mr-2 flex-shrink-0">
                            {activeConversation.user.avatar_url ? (
                              <Image
                                src={activeConversation.user.avatar_url}
                                alt={activeConversation.user.full_name}
                                width={32}
                                height={32}
                                className="rounded-full"
                              />
                            ) : (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-sm text-gray-700">
                                {getInitials(activeConversation.user.full_name)}
                              </div>
                            )}
                          </div>
                        )}
                        <div className="max-w-[70%]">
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              message.sender_id === currentUserId
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-800'
                            }`}
                          >
                            <p>{message.content}</p>
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {formatMessageTime(message.created_at)}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                
                {/* Message input */}
                <div className="border-t border-gray-300 p-4">
                  <div className="flex items-center">
                    <button className="mr-2 rounded-full p-2 text-gray-500 hover:bg-gray-100">
                      <FaImage />
                    </button>
                    <button className="mr-2 rounded-full p-2 text-gray-500 hover:bg-gray-100">
                      <FaSmile />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 rounded-full border border-gray-300 bg-gray-100 px-4 py-2 focus:border-blue-500 focus:bg-white focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="ml-2 rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center text-gray-500">
                  <p className="mb-2 text-xl">Select a conversation</p>
                  <p>Choose a conversation from the list to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
