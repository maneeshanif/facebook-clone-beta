'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { getInitials } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import { FaUser, FaLock, FaBell, FaGlobe, FaShieldAlt, FaQuestionCircle } from 'react-icons/fa';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
}

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }
      
      try {
        // Try to get profile from profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          // If profile doesn't exist in the table, create a basic one from auth data
          const userData = session.user.user_metadata || {};
          
          const newProfile = {
            id: session.user.id,
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            full_name: userData.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            avatar_url: null,
            bio: null,
          };
          
          setProfile(newProfile);
          setFirstName(newProfile.first_name);
          setLastName(newProfile.last_name);
          setBio(newProfile.bio || '');
        } else {
          setProfile(data);
          setFirstName(data.first_name);
          setLastName(data.last_name);
          setBio(data.bio || '');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [router]);
  
  const handleSaveProfile = async () => {
    if (!profile) return;
    
    setIsSaving(true);
    setSuccessMessage('');
    
    try {
      // Update user metadata in auth
      await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`,
        }
      });
      
      // Try to update profile in profiles table
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: profile.id,
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`,
          email: profile.email,
          bio: bio,
          updated_at: new Date().toISOString(),
        });
      
      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      
      setSuccessMessage('Profile updated successfully!');
      
      // Update local state
      setProfile({
        ...profile,
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        bio: bio,
      });
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
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
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>
        
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="rounded-lg bg-white p-4 shadow">
              <div className="mb-6 flex items-center">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-300 text-2xl text-gray-700">
                    {profile ? getInitials(profile.full_name) : 'U'}
                  </div>
                )}
                <div className="ml-3">
                  <h2 className="font-semibold">{profile?.full_name}</h2>
                  <p className="text-sm text-gray-600">{profile?.email}</p>
                </div>
              </div>
              
              <nav>
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => setActiveTab('general')}
                      className={`flex w-full items-center rounded-md px-3 py-2 ${
                        activeTab === 'general' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FaUser className="mr-3" />
                      General
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('security')}
                      className={`flex w-full items-center rounded-md px-3 py-2 ${
                        activeTab === 'security' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FaLock className="mr-3" />
                      Security
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('notifications')}
                      className={`flex w-full items-center rounded-md px-3 py-2 ${
                        activeTab === 'notifications' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FaBell className="mr-3" />
                      Notifications
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('privacy')}
                      className={`flex w-full items-center rounded-md px-3 py-2 ${
                        activeTab === 'privacy' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FaShieldAlt className="mr-3" />
                      Privacy
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('language')}
                      className={`flex w-full items-center rounded-md px-3 py-2 ${
                        activeTab === 'language' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FaGlobe className="mr-3" />
                      Language
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('help')}
                      className={`flex w-full items-center rounded-md px-3 py-2 ${
                        activeTab === 'help' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FaQuestionCircle className="mr-3" />
                      Help & Support
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <div className="rounded-lg bg-white p-6 shadow">
              {/* Success message */}
              {successMessage && (
                <div className="mb-4 rounded-md bg-green-50 p-4 text-green-700">
                  {successMessage}
                </div>
              )}
              
              {/* General settings */}
              {activeTab === 'general' && (
                <div>
                  <h2 className="mb-4 text-xl font-semibold">General Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          First Name
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={profile?.email || ''}
                        disabled
                        className="mt-1 block w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 px-3 py-2 shadow-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                    </div>
                    
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    
                    <div className="pt-4">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Security settings */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="mb-4 text-xl font-semibold">Security Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        id="currentPassword"
                        type="password"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <button
                        className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Change Password
                      </button>
                    </div>
                    
                    <hr className="my-6 border-gray-300" />
                    
                    <div>
                      <h3 className="mb-2 text-lg font-medium">Two-Factor Authentication</h3>
                      <p className="mb-4 text-gray-600">Add an extra layer of security to your account</p>
                      
                      <button
                        className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      >
                        Enable Two-Factor Authentication
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Notifications settings */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="mb-4 text-xl font-semibold">Notification Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Receive email notifications</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" className="peer sr-only" defaultChecked />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Friend Requests</h3>
                        <p className="text-sm text-gray-600">Receive notifications for friend requests</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" className="peer sr-only" defaultChecked />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Comments</h3>
                        <p className="text-sm text-gray-600">Receive notifications when someone comments on your posts</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" className="peer sr-only" defaultChecked />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Likes</h3>
                        <p className="text-sm text-gray-600">Receive notifications when someone likes your posts</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" className="peer sr-only" defaultChecked />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Messages</h3>
                        <p className="text-sm text-gray-600">Receive notifications for new messages</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" className="peer sr-only" defaultChecked />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                      </label>
                    </div>
                    
                    <div className="pt-4">
                      <button
                        className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Privacy settings */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="mb-4 text-xl font-semibold">Privacy Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 font-medium">Who can see your profile</h3>
                      <select className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500">
                        <option>Everyone</option>
                        <option>Friends only</option>
                        <option>Only me</option>
                      </select>
                    </div>
                    
                    <div>
                      <h3 className="mb-2 font-medium">Who can see your posts</h3>
                      <select className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500">
                        <option>Everyone</option>
                        <option>Friends only</option>
                        <option>Only me</option>
                      </select>
                    </div>
                    
                    <div>
                      <h3 className="mb-2 font-medium">Who can send you friend requests</h3>
                      <select className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500">
                        <option>Everyone</option>
                        <option>Friends of friends</option>
                        <option>Nobody</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Profile Search</h3>
                        <p className="text-sm text-gray-600">Allow people to find you by searching your name</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" className="peer sr-only" defaultChecked />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
                      </label>
                    </div>
                    
                    <div className="pt-4">
                      <button
                        className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Save Privacy Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Language settings */}
              {activeTab === 'language' && (
                <div>
                  <h2 className="mb-4 text-xl font-semibold">Language Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                        Display Language
                      </label>
                      <select
                        id="language"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      >
                        <option value="en">English (US)</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="it">Italiano</option>
                        <option value="pt">Português</option>
                        <option value="ru">Русский</option>
                        <option value="ja">日本語</option>
                        <option value="zh">中文</option>
                        <option value="ar">العربية</option>
                        <option value="hi">हिन्दी</option>
                      </select>
                    </div>
                    
                    <div className="pt-4">
                      <button
                        className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Save Language Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Help & Support */}
              {activeTab === 'help' && (
                <div>
                  <h2 className="mb-4 text-xl font-semibold">Help & Support</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-2 font-medium">Frequently Asked Questions</h3>
                      <div className="space-y-2">
                        <div className="rounded-md bg-gray-50 p-4">
                          <h4 className="font-medium">How do I change my password?</h4>
                          <p className="mt-1 text-sm text-gray-600">
                            You can change your password in the Security tab of your settings.
                          </p>
                        </div>
                        <div className="rounded-md bg-gray-50 p-4">
                          <h4 className="font-medium">How do I delete my account?</h4>
                          <p className="mt-1 text-sm text-gray-600">
                            To delete your account, please contact our support team.
                          </p>
                        </div>
                        <div className="rounded-md bg-gray-50 p-4">
                          <h4 className="font-medium">How do I report a problem?</h4>
                          <p className="mt-1 text-sm text-gray-600">
                            You can report problems using the form below or by contacting our support team.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="mb-2 font-medium">Contact Support</h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                            Subject
                          </label>
                          <input
                            id="subject"
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            placeholder="What is your issue about?"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                            Message
                          </label>
                          <textarea
                            id="message"
                            rows={4}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            placeholder="Describe your issue in detail..."
                          />
                        </div>
                        
                        <div className="pt-2">
                          <button
                            className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
