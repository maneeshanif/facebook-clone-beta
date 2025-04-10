'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import { supabase } from '@/lib/supabase/client';
import { getInitials } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers, FaPlus, FaTimes, FaCamera } from 'react-icons/fa';

interface Event {
  id: string;
  title: string;
  description: string;
  cover_image: string | null;
  location: string;
  start_time: string;
  end_time: string;
  is_online: boolean;
  attendees_count: number;
  interested_count: number;
  created_at: string;
  is_attending: boolean;
  is_interested: boolean;
  host: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'hosting' | 'interested'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentDate] = useState(new Date());

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);

      // In a real app, we would fetch from Supabase
      // For now, we'll use mock data

      // Mock events data
      const mockEvents: Event[] = [
        {
          id: 'event1',
          title: 'Web Development Workshop',
          description: 'Learn the latest web development techniques and tools in this hands-on workshop. Perfect for beginners and intermediate developers looking to expand their skills.',
          cover_image: 'https://source.unsplash.com/random/1200x400/?coding',
          location: 'Tech Hub, San Francisco',
          start_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 hours duration
          is_online: false,
          attendees_count: 45,
          interested_count: 120,
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          is_attending: true,
          is_interested: false,
          host: {
            id: 'user1',
            full_name: 'Jane Smith',
            avatar_url: null,
          },
        },
        {
          id: 'event2',
          title: 'Photography Meetup',
          description: 'Join fellow photography enthusiasts for a day of shooting in the city. All skill levels welcome. Bring your camera and creativity!',
          cover_image: 'https://source.unsplash.com/random/1200x400/?photography',
          location: 'Golden Gate Park, San Francisco',
          start_time: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
          end_time: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(), // 5 hours duration
          is_online: false,
          attendees_count: 28,
          interested_count: 75,
          created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          is_attending: false,
          is_interested: true,
          host: {
            id: 'user2',
            full_name: 'John Doe',
            avatar_url: null,
          },
        },
        {
          id: 'event3',
          title: 'Virtual Book Club: Science Fiction',
          description: 'This month we\'re discussing "Project Hail Mary" by Andy Weir. Join us for a lively discussion about this exciting sci-fi novel!',
          cover_image: 'https://source.unsplash.com/random/1200x400/?books',
          location: 'Zoom Meeting',
          start_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 2 hours duration
          is_online: true,
          attendees_count: 32,
          interested_count: 48,
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          is_attending: true,
          is_interested: false,
          host: {
            id: 'user3',
            full_name: 'Alice Johnson',
            avatar_url: null,
          },
        },
        {
          id: 'event4',
          title: 'Hiking Trip: Mount Tamalpais',
          description: 'Join us for a day hike on Mount Tamalpais. We\'ll meet at the trailhead and enjoy beautiful views of the Bay Area.',
          cover_image: 'https://source.unsplash.com/random/1200x400/?hiking',
          location: 'Mount Tamalpais State Park',
          start_time: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
          end_time: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(), // 6 hours duration
          is_online: false,
          attendees_count: 15,
          interested_count: 42,
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          is_attending: false,
          is_interested: true,
          host: {
            id: 'user4',
            full_name: 'Bob Williams',
            avatar_url: null,
          },
        },
        {
          id: 'event5',
          title: 'Cooking Class: Italian Pasta',
          description: 'Learn how to make authentic Italian pasta from scratch with Chef Maria. All ingredients and tools provided.',
          cover_image: 'https://source.unsplash.com/random/1200x400/?pasta',
          location: 'Culinary Institute, Downtown',
          start_time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          end_time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 hours duration
          is_online: false,
          attendees_count: 20,
          interested_count: 35,
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          is_attending: true,
          is_interested: false,
          host: {
            id: 'user5',
            full_name: 'Carol Brown',
            avatar_url: null,
          },
        },
        {
          id: 'event6',
          title: 'Tech Startup Networking',
          description: 'Connect with fellow entrepreneurs, investors, and tech enthusiasts. Great opportunity to expand your network and share ideas.',
          cover_image: 'https://source.unsplash.com/random/1200x400/?networking',
          location: 'Innovation Hub, San Francisco',
          start_time: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
          end_time: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // 4 hours duration
          is_online: false,
          attendees_count: 75,
          interested_count: 130,
          created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          is_attending: false,
          is_interested: true,
          host: {
            id: 'user1',
            full_name: 'Jane Smith',
            avatar_url: null,
          },
        },
      ];

      setEvents(mockEvents);
      setIsLoading(false);
    };

    fetchEvents();
  }, []);

  const formatEventDate = (startTime: string, endTime: string): string => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const startDate = start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const startTime12h = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const endTime12h = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    return `${startDate}, ${startTime12h} - ${endTime12h}`;
  };

  const isEventPast = (endTime: string): boolean => {
    const end = new Date(endTime);
    return end < currentDate;
  };

  const handleAttendEvent = (eventId: string) => {
    // In a real app, we would update the attendance in Supabase
    // For now, we'll just update the local state
    setEvents(prev =>
      prev.map(event =>
        event.id === eventId
          ? {
              ...event,
              is_attending: true,
              attendees_count: event.attendees_count + 1,
              is_interested: false,
              interested_count: event.is_interested ? event.interested_count - 1 : event.interested_count
            }
          : event
      )
    );
  };

  const handleInterestedEvent = (eventId: string) => {
    // In a real app, we would update the interest in Supabase
    // For now, we'll just update the local state
    setEvents(prev =>
      prev.map(event =>
        event.id === eventId
          ? {
              ...event,
              is_interested: true,
              interested_count: event.interested_count + 1,
              is_attending: false,
              attendees_count: event.is_attending ? event.attendees_count - 1 : event.attendees_count
            }
          : event
      )
    );
  };

  const handleCancelAttendance = (eventId: string) => {
    // In a real app, we would update the attendance in Supabase
    // For now, we'll just update the local state
    setEvents(prev =>
      prev.map(event =>
        event.id === eventId
          ? {
              ...event,
              is_attending: false,
              attendees_count: event.attendees_count - 1
            }
          : event
      )
    );
  };

  const handleCancelInterest = (eventId: string) => {
    // In a real app, we would update the interest in Supabase
    // For now, we'll just update the local state
    setEvents(prev =>
      prev.map(event =>
        event.id === eventId
          ? {
              ...event,
              is_interested: false,
              interested_count: event.interested_count - 1
            }
          : event
      )
    );
  };

  const filteredEvents = events.filter(event => {
    const matchesTab =
      (activeTab === 'upcoming' && !isEventPast(event.end_time)) ||
      (activeTab === 'past' && isEventPast(event.end_time)) ||
      (activeTab === 'hosting' && event.host.id === 'user1') || // Assuming current user is user1
      (activeTab === 'interested' && (event.is_interested || event.is_attending));

    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
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

      <div className="container mx-auto flex flex-1 flex-col lg:flex-row px-4 py-6">
        <Sidebar className="sticky top-16 hidden w-full lg:w-1/5 lg:block" />

        <div className="w-full px-0 sm:px-4 lg:w-4/5 lg:pl-4">
          {selectedEvent ? (
            <div>
              {/* Event header */}
              <div className="mb-6 overflow-hidden rounded-lg bg-white shadow">
                <div className="relative h-64 w-full">
                  {selectedEvent.cover_image ? (
                    <Image
                      src={selectedEvent.cover_image}
                      alt={selectedEvent.title}
                      width={1200}
                      height={400}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
                  )}
                </div>

                <div className="p-4 sm:p-6">
                  <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold">{selectedEvent.title}</h1>
                      <div className="mt-2 space-y-1 text-sm sm:text-base text-gray-600">
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2 flex-shrink-0" />
                          <span className="break-words">{formatEventDate(selectedEvent.start_time, selectedEvent.end_time)}</span>
                        </div>
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
                          <span className="break-words">{selectedEvent.location}</span>
                          {selectedEvent.is_online && <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">Online</span>}
                        </div>
                        <div className="flex items-center">
                          <FaUsers className="mr-2 flex-shrink-0" />
                          <span>{selectedEvent.attendees_count} going • {selectedEvent.interested_count} interested</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 md:mt-0">
                      {isEventPast(selectedEvent.end_time) ? (
                        <div className="rounded-md bg-gray-200 px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base text-gray-700">
                          Past Event
                        </div>
                      ) : (
                        <>
                          {selectedEvent.is_attending ? (
                            <button
                              onClick={() => handleCancelAttendance(selectedEvent.id)}
                              className="rounded-md bg-gray-200 px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base font-semibold text-gray-700 hover:bg-gray-300"
                            >
                              ✓ Going
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAttendEvent(selectedEvent.id)}
                              className="rounded-md bg-blue-600 px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base font-semibold text-white hover:bg-blue-700"
                            >
                              Going
                            </button>
                          )}

                          {selectedEvent.is_interested ? (
                            <button
                              onClick={() => handleCancelInterest(selectedEvent.id)}
                              className="rounded-md bg-gray-200 px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base font-semibold text-gray-700 hover:bg-gray-300"
                            >
                              ✓ Interested
                            </button>
                          ) : (
                            <button
                              onClick={() => handleInterestedEvent(selectedEvent.id)}
                              className="rounded-md border border-gray-300 bg-white px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base font-semibold text-gray-700 hover:bg-gray-50"
                            >
                              Interested
                            </button>
                          )}
                        </>
                      )}

                      <button
                        onClick={() => setSelectedEvent(null)}
                        className="rounded-md border border-gray-300 bg-white px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Back to Events
                      </button>
                    </div>
                  </div>

                  <hr className="my-6 border-gray-200" />

                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2">
                      <h2 className="mb-2 text-xl font-semibold">Details</h2>
                      <p className="whitespace-pre-line text-gray-700">{selectedEvent.description}</p>
                    </div>

                    <div>
                      <h2 className="mb-2 text-xl font-semibold">Hosted By</h2>
                      <div className="flex items-center">
                        {selectedEvent.host.avatar_url ? (
                          <Image
                            src={selectedEvent.host.avatar_url}
                            alt={selectedEvent.host.full_name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                            {getInitials(selectedEvent.host.full_name)}
                          </div>
                        )}
                        <div className="ml-3">
                          <Link href={`/profile/${selectedEvent.host.id}`} className="font-semibold hover:underline">
                            {selectedEvent.host.full_name}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Events</h1>
                  <p className="text-gray-600">Discover events and activities near you</p>
                </div>

                <div className="mt-4 md:mt-0">
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                  >
                    <FaPlus className="mr-2" />
                    Create Event
                  </button>
                </div>
              </div>

              <div className="mb-6 flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search Events"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 pl-10 focus:border-blue-500 focus:outline-none"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-500" />
                </div>
              </div>

              <div className="mb-6 flex border-b border-gray-300">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`mr-4 pb-2 font-medium ${
                    activeTab === 'upcoming'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setActiveTab('hosting')}
                  className={`mr-4 pb-2 font-medium ${
                    activeTab === 'hosting'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Hosting
                </button>
                <button
                  onClick={() => setActiveTab('interested')}
                  className={`mr-4 pb-2 font-medium ${
                    activeTab === 'interested'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Interested
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`mr-4 pb-2 font-medium ${
                    activeTab === 'past'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Past
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map(event => (
                    <div
                      key={event.id}
                      className="overflow-hidden rounded-lg bg-white shadow transition-transform hover:scale-105"
                    >
                      <div
                        className="relative h-40 w-full cursor-pointer"
                        onClick={() => setSelectedEvent(event)}
                      >
                        {event.cover_image ? (
                          <Image
                            src={event.cover_image}
                            alt={event.title}
                            width={400}
                            height={200}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
                        )}
                        {event.is_online && (
                          <div className="absolute left-2 top-2 rounded-full bg-blue-600 bg-opacity-90 px-2 py-1 text-xs text-white">
                            Online
                          </div>
                        )}
                        {isEventPast(event.end_time) && (
                          <div className="absolute right-2 top-2 rounded-full bg-gray-800 bg-opacity-90 px-2 py-1 text-xs text-white">
                            Past
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div
                          className="mb-2 cursor-pointer"
                          onClick={() => setSelectedEvent(event)}
                        >
                          <h3 className="font-semibold line-clamp-1">{event.title}</h3>
                          <div className="mt-1 space-y-1 text-sm text-gray-500">
                            <div className="flex items-center">
                              <FaCalendarAlt className="mr-1" />
                              <span>{new Date(event.start_time).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <FaClock className="mr-1" />
                              <span>{new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex items-center">
                              <FaMapMarkerAlt className="mr-1" />
                              <span className="line-clamp-1">{event.location}</span>
                            </div>
                          </div>
                        </div>

                        {!isEventPast(event.end_time) && (
                          <div className="mt-2 flex space-x-2">
                            {event.is_attending ? (
                              <button
                                onClick={() => handleCancelAttendance(event.id)}
                                className="flex-1 rounded-md bg-gray-200 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                              >
                                ✓ Going
                              </button>
                            ) : (
                              <button
                                onClick={() => handleAttendEvent(event.id)}
                                className="flex-1 rounded-md bg-blue-600 py-1 text-sm font-semibold text-white hover:bg-blue-700"
                              >
                                Going
                              </button>
                            )}

                            {event.is_interested ? (
                              <button
                                onClick={() => handleCancelInterest(event.id)}
                                className="flex-1 rounded-md bg-gray-200 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                              >
                                ✓ Interested
                              </button>
                            ) : (
                              <button
                                onClick={() => handleInterestedEvent(event.id)}
                                className="flex-1 rounded-md border border-gray-300 bg-white py-1 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                              >
                                Interested
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full rounded-lg bg-white p-8 text-center shadow">
                    <p className="text-gray-600">
                      {activeTab === 'upcoming'
                        ? 'No upcoming events found.'
                        : activeTab === 'hosting'
                        ? 'You are not hosting any events.'
                        : activeTab === 'interested'
                        ? 'You are not interested in any events.'
                        : 'No past events found.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Create Event Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg bg-white p-4 sm:p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Create New Event</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Event Title</label>
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    placeholder="Where is the event?"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:flex-1">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Start Date & Time</label>
                    <input
                      type="datetime-local"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="w-full sm:flex-1 mt-4 sm:mt-0">
                    <label className="mb-1 block text-sm font-medium text-gray-700">End Date & Time</label>
                    <input
                      type="datetime-local"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    rows={3}
                    placeholder="What is this event about?"
                  ></textarea>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_online"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="is_online" className="ml-2 block text-sm text-gray-700">
                    This is an online event
                  </label>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Cover Photo</label>
                  <label className="flex cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 hover:bg-gray-50">
                    <input type="file" className="hidden" accept="image/*" />
                    <div className="text-center">
                      <FaCamera className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-500">Click to add a cover photo</p>
                    </div>
                  </label>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      alert('Your event has been created! (This is a demo)');
                      setShowCreateForm(false);
                    }}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Create Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
