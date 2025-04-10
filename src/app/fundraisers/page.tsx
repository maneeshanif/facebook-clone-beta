'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { getInitials } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { FaSearch, FaHeart, FaHandHoldingHeart, FaPlus, FaShare, FaEllipsisH } from 'react-icons/fa';

interface Fundraiser {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  category: string;
  goal_amount: number;
  current_amount: number;
  donors_count: number;
  end_date: string;
  created_at: string;
  is_donated: boolean;
  organizer: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

export default function FundraisersPage() {
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'browse' | 'manage' | 'donated'>('browse');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFundraiser, setSelectedFundraiser] = useState<Fundraiser | null>(null);
  const [donationAmount, setDonationAmount] = useState<number>(10);
  const [showDonationModal, setShowDonationModal] = useState(false);
  
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'crisis', name: 'Crisis Relief' },
    { id: 'education', name: 'Education' },
    { id: 'environment', name: 'Environment' },
    { id: 'health', name: 'Health' },
    { id: 'animals', name: 'Animals' },
    { id: 'community', name: 'Community' },
  ];
  
  useEffect(() => {
    const fetchFundraisers = async () => {
      setIsLoading(true);
      
      // In a real app, we would fetch from Supabase
      // For now, we'll use mock data
      
      // Mock fundraisers data
      const mockFundraisers: Fundraiser[] = [
        {
          id: 'fundraiser1',
          title: 'Help Rebuild After Hurricane',
          description: 'Our community was devastated by Hurricane Maria. We need your help to rebuild homes and provide essential supplies to affected families.',
          cover_image: 'https://source.unsplash.com/random/800x600/?hurricane',
          category: 'crisis',
          goal_amount: 50000,
          current_amount: 32450,
          donors_count: 428,
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          is_donated: false,
          organizer: {
            id: 'user1',
            full_name: 'Jane Smith',
            avatar_url: null,
          },
        },
        {
          id: 'fundraiser2',
          title: 'College Scholarship Fund',
          description: 'Help provide scholarships to underprivileged students who dream of attending college but lack the financial means.',
          cover_image: 'https://source.unsplash.com/random/800x600/?graduation',
          category: 'education',
          goal_amount: 25000,
          current_amount: 18750,
          donors_count: 215,
          end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          is_donated: true,
          organizer: {
            id: 'user2',
            full_name: 'John Doe',
            avatar_url: null,
          },
        },
        {
          id: 'fundraiser3',
          title: 'Save the Rainforest',
          description: 'Help us protect and preserve the Amazon rainforest by supporting our conservation efforts and sustainable development initiatives.',
          cover_image: 'https://source.unsplash.com/random/800x600/?rainforest',
          category: 'environment',
          goal_amount: 100000,
          current_amount: 67890,
          donors_count: 1243,
          end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          is_donated: false,
          organizer: {
            id: 'user3',
            full_name: 'Alice Johnson',
            avatar_url: null,
          },
        },
        {
          id: 'fundraiser4',
          title: 'Medical Treatment for Sarah',
          description: 'Sarah was recently diagnosed with a rare form of cancer. Help her family cover the cost of her medical treatment and recovery.',
          cover_image: 'https://source.unsplash.com/random/800x600/?hospital',
          category: 'health',
          goal_amount: 75000,
          current_amount: 45678,
          donors_count: 876,
          end_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          is_donated: true,
          organizer: {
            id: 'user4',
            full_name: 'Bob Williams',
            avatar_url: null,
          },
        },
        {
          id: 'fundraiser5',
          title: 'Animal Shelter Renovation',
          description: 'Our local animal shelter needs urgent renovations to provide better care for abandoned and rescued animals.',
          cover_image: 'https://source.unsplash.com/random/800x600/?animal,shelter',
          category: 'animals',
          goal_amount: 30000,
          current_amount: 12345,
          donors_count: 321,
          end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          is_donated: false,
          organizer: {
            id: 'user5',
            full_name: 'Carol Brown',
            avatar_url: null,
          },
        },
        {
          id: 'fundraiser6',
          title: 'Community Garden Project',
          description: 'Help us transform an abandoned lot into a beautiful community garden that will provide fresh produce and a gathering space for our neighborhood.',
          cover_image: 'https://source.unsplash.com/random/800x600/?garden',
          category: 'community',
          goal_amount: 15000,
          current_amount: 9876,
          donors_count: 187,
          end_date: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
          is_donated: true,
          organizer: {
            id: 'user6',
            full_name: 'David Miller',
            avatar_url: null,
          },
        },
      ];
      
      setFundraisers(mockFundraisers);
      setIsLoading(false);
    };
    
    fetchFundraisers();
  }, []);
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const calculateProgress = (current: number, goal: number): number => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };
  
  const formatTimeLeft = (endDate: string): string => {
    const end = new Date(endDate);
    const now = new Date();
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) {
      return 'Ended';
    } else if (diffDays === 1) {
      return '1 day left';
    } else {
      return `${diffDays} days left`;
    }
  };
  
  const handleDonate = (fundraiserId: string) => {
    // Find the fundraiser
    const fundraiser = fundraisers.find(f => f.id === fundraiserId);
    if (!fundraiser) return;
    
    setSelectedFundraiser(fundraiser);
    setShowDonationModal(true);
  };
  
  const handleSubmitDonation = () => {
    if (!selectedFundraiser || donationAmount <= 0) return;
    
    // In a real app, we would process the donation through a payment gateway
    // and update the database
    // For now, we'll just update the local state
    
    setFundraisers(prev => 
      prev.map(fundraiser => 
        fundraiser.id === selectedFundraiser.id 
          ? { 
              ...fundraiser, 
              current_amount: fundraiser.current_amount + donationAmount,
              donors_count: fundraiser.donors_count + 1,
              is_donated: true
            } 
          : fundraiser
      )
    );
    
    setShowDonationModal(false);
    setDonationAmount(10);
    
    // Show success message
    alert(`Thank you for your donation of ${formatCurrency(donationAmount)} to "${selectedFundraiser.title}"!`);
  };
  
  const handleShareFundraiser = (fundraiserId: string) => {
    // In a real app, we would implement sharing functionality
    alert('Sharing functionality would be implemented here');
  };
  
  const filteredFundraisers = fundraisers.filter(fundraiser => {
    const matchesTab = 
      (activeTab === 'browse') ||
      (activeTab === 'manage' && fundraiser.organizer.id === 'user1') || // Assuming current user is user1
      (activeTab === 'donated' && fundraiser.is_donated);
    
    const matchesCategory = activeCategory === 'all' || fundraiser.category === activeCategory;
    
    const matchesSearch = fundraiser.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          fundraiser.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          fundraiser.organizer.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesCategory && matchesSearch;
  });
  
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
        <Sidebar className="sticky top-16 hidden w-1/5 lg:block" />
        
        <div className="w-full lg:w-4/5">
          {selectedFundraiser && !showDonationModal ? (
            <div>
              {/* Fundraiser header */}
              <div className="mb-6 overflow-hidden rounded-lg bg-white shadow">
                <div className="relative h-64 w-full">
                  <img
                    src={selectedFundraiser.cover_image}
                    alt={selectedFundraiser.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <div className="mb-4 flex flex-col items-start justify-between md:flex-row md:items-center">
                    <div>
                      <div className="mb-1 flex items-center">
                        <span className="mr-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                          {categories.find(c => c.id === selectedFundraiser.category)?.name || selectedFundraiser.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatTimeLeft(selectedFundraiser.end_date)}
                        </span>
                      </div>
                      <h1 className="text-2xl font-bold">{selectedFundraiser.title}</h1>
                    </div>
                    
                    <div className="mt-4 flex space-x-2 md:mt-0">
                      <button
                        onClick={() => handleDonate(selectedFundraiser.id)}
                        className="flex items-center rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                      >
                        <FaHandHoldingHeart className="mr-2" />
                        Donate
                      </button>
                      <button
                        onClick={() => handleShareFundraiser(selectedFundraiser.id)}
                        className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        <FaShare className="mr-2" />
                        Share
                      </button>
                      <button
                        onClick={() => setSelectedFundraiser(null)}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="mb-2 flex items-end justify-between">
                      <div>
                        <span className="text-2xl font-bold">{formatCurrency(selectedFundraiser.current_amount)}</span>
                        <span className="ml-1 text-gray-500">raised of {formatCurrency(selectedFundraiser.goal_amount)} goal</span>
                      </div>
                      <span className="text-sm text-gray-500">{selectedFundraiser.donors_count} donors</span>
                    </div>
                    <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
                      <div 
                        className="h-full rounded-full bg-blue-600" 
                        style={{ width: `${calculateProgress(selectedFundraiser.current_amount, selectedFundraiser.goal_amount)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mb-6 flex items-center">
                    <div className="mr-3">
                      {selectedFundraiser.organizer.avatar_url ? (
                        <Image
                          src={selectedFundraiser.organizer.avatar_url}
                          alt={selectedFundraiser.organizer.full_name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                          {getInitials(selectedFundraiser.organizer.full_name)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Organized by</p>
                      <Link href={`/profile/${selectedFundraiser.organizer.id}`} className="font-semibold hover:underline">
                        {selectedFundraiser.organizer.full_name}
                      </Link>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="mb-2 text-lg font-semibold">About this fundraiser</h2>
                    <p className="whitespace-pre-line text-gray-700">{selectedFundraiser.description}</p>
                  </div>
                </div>
              </div>
              
              {/* Recent donors */}
              <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-lg font-semibold">Recent Donors</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                        {getInitials('Michael Johnson')}
                      </div>
                      <div className="ml-3">
                        <p className="font-semibold">Michael Johnson</p>
                        <p className="text-sm text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(50)}</p>
                      <p className="text-sm text-gray-500">❤️ Sending love and support!</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                        {getInitials('Sarah Williams')}
                      </div>
                      <div className="ml-3">
                        <p className="font-semibold">Sarah Williams</p>
                        <p className="text-sm text-gray-500">5 hours ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(100)}</p>
                      <p className="text-sm text-gray-500">Happy to help!</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                        {getInitials('Anonymous')}
                      </div>
                      <div className="ml-3">
                        <p className="font-semibold">Anonymous</p>
                        <p className="text-sm text-gray-500">1 day ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(25)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Fundraisers</h1>
                  <p className="text-gray-600">Support causes you care about</p>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <button className="flex items-center rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
                    <FaPlus className="mr-2" />
                    Create Fundraiser
                  </button>
                </div>
              </div>
              
              <div className="mb-6 flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search Fundraisers"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 pl-10 focus:border-blue-500 focus:outline-none"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-500" />
                </div>
                
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 focus:border-blue-500 focus:outline-none"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6 flex border-b border-gray-300">
                <button
                  onClick={() => setActiveTab('browse')}
                  className={`mr-4 pb-2 font-medium ${
                    activeTab === 'browse'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Browse
                </button>
                <button
                  onClick={() => setActiveTab('manage')}
                  className={`mr-4 pb-2 font-medium ${
                    activeTab === 'manage'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Your Fundraisers
                </button>
                <button
                  onClick={() => setActiveTab('donated')}
                  className={`mr-4 pb-2 font-medium ${
                    activeTab === 'donated'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Donated
                </button>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredFundraisers.length > 0 ? (
                  filteredFundraisers.map(fundraiser => (
                    <div
                      key={fundraiser.id}
                      className="overflow-hidden rounded-lg bg-white shadow transition-transform hover:scale-105"
                    >
                      <div
                        className="relative h-40 w-full cursor-pointer"
                        onClick={() => setSelectedFundraiser(fundraiser)}
                      >
                        <img
                          src={fundraiser.cover_image}
                          alt={fundraiser.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                          {categories.find(c => c.id === fundraiser.category)?.name || fundraiser.category}
                        </div>
                        <div className="absolute bottom-2 right-2 rounded-full bg-black bg-opacity-70 px-2 py-1 text-xs text-white">
                          {formatTimeLeft(fundraiser.end_date)}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3
                          className="mb-2 cursor-pointer font-semibold line-clamp-2"
                          onClick={() => setSelectedFundraiser(fundraiser)}
                        >
                          {fundraiser.title}
                        </h3>
                        
                        <div className="mb-3">
                          <div className="mb-1 flex items-end justify-between text-sm">
                            <span className="font-semibold">{formatCurrency(fundraiser.current_amount)}</span>
                            <span className="text-gray-500">of {formatCurrency(fundraiser.goal_amount)}</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                            <div 
                              className="h-full rounded-full bg-blue-600" 
                              style={{ width: `${calculateProgress(fundraiser.current_amount, fundraiser.goal_amount)}%` }}
                            ></div>
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {fundraiser.donors_count} donors
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm">
                          <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-xs text-gray-700">
                            {getInitials(fundraiser.organizer.full_name)}
                          </div>
                          <span className="text-gray-600">{fundraiser.organizer.full_name}</span>
                        </div>
                        
                        <div className="mt-3 flex space-x-2">
                          <button
                            onClick={() => handleDonate(fundraiser.id)}
                            className="flex-1 rounded-md bg-blue-600 py-1 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            Donate
                          </button>
                          <button
                            onClick={() => handleShareFundraiser(fundraiser.id)}
                            className="flex-1 rounded-md border border-gray-300 bg-white py-1 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full rounded-lg bg-white p-8 text-center shadow">
                    <p className="text-gray-600">
                      {activeTab === 'browse'
                        ? 'No fundraisers found matching your criteria.'
                        : activeTab === 'manage'
                        ? 'You haven\'t created any fundraisers yet.'
                        : 'You haven\'t donated to any fundraisers yet.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Donation Modal */}
      {showDonationModal && selectedFundraiser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Donate to {selectedFundraiser.title}</h2>
            
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Donation Amount
              </label>
              <div className="flex flex-wrap gap-2">
                {[5, 10, 25, 50, 100].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setDonationAmount(amount)}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      donationAmount === amount
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
                <div className="relative w-full">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 pl-8 focus:border-blue-500 focus:outline-none"
                    placeholder="Other amount"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <select className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none">
                <option>Credit Card</option>
                <option>PayPal</option>
                <option>Bank Transfer</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDonationModal(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDonation}
                className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                disabled={donationAmount <= 0}
              >
                Donate {formatCurrency(donationAmount)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
