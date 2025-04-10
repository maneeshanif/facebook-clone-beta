'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getInitials } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { FaSearch, FaPlay, FaBookmark } from 'react-icons/fa';

interface Game {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  category: string;
  players_count: number;
  is_saved: boolean;
  is_played: boolean;
}

interface GameStream {
  id: string;
  title: string;
  game_id: string;
  game_title: string;
  thumbnail: string;
  viewers_count: number;
  created_at: string;
  streamer: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

export default function GamingPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [streams, setStreams] = useState<GameStream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'played' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  useEffect(() => {
    const fetchGamesAndStreams = async () => {
      setIsLoading(true);

      // In a real app, we would fetch from Supabase
      // For now, we'll use mock data

      // Mock games data
      const mockGames: Game[] = [
        {
          id: 'game1',
          title: 'Candy Crush Saga',
          description: 'Match colorful candies in this fun puzzle game. Swap and match your way through hundreds of levels in this delicious puzzle adventure.',
          cover_image: 'https://source.unsplash.com/random/800x600/?candy',
          category: 'Puzzle',
          players_count: 1500000,
          is_saved: true,
          is_played: true,
        },
        {
          id: 'game2',
          title: 'Farmville',
          description: 'Build and customize your farm in this social farming simulation game. Plant crops, raise animals, and trade with friends.',
          cover_image: 'https://source.unsplash.com/random/800x600/?farm',
          category: 'Simulation',
          players_count: 800000,
          is_saved: false,
          is_played: true,
        },
        {
          id: 'game3',
          title: 'Words With Friends',
          description: 'Challenge your friends to a game of words in this social word game. Test your vocabulary and strategic thinking.',
          cover_image: 'https://source.unsplash.com/random/800x600/?words',
          category: 'Word',
          players_count: 650000,
          is_saved: true,
          is_played: false,
        },
        {
          id: 'game4',
          title: 'Criminal Case',
          description: 'Solve murder cases by finding hidden objects and analyzing clues. Become the best detective in this thrilling game.',
          cover_image: 'https://source.unsplash.com/random/800x600/?detective',
          category: 'Hidden Object',
          players_count: 450000,
          is_saved: false,
          is_played: false,
        },
        {
          id: 'game5',
          title: 'Dragon City',
          description: 'Breed and collect dragons in this fantasy simulation game. Build your own dragon city and battle with other players.',
          cover_image: 'https://source.unsplash.com/random/800x600/?dragon',
          category: 'Simulation',
          players_count: 750000,
          is_saved: false,
          is_played: true,
        },
        {
          id: 'game6',
          title: 'Poker',
          description: 'Play poker with friends and players from around the world. Test your skills and luck in this classic card game.',
          cover_image: 'https://source.unsplash.com/random/800x600/?poker',
          category: 'Card',
          players_count: 950000,
          is_saved: true,
          is_played: true,
        },
      ];

      // Mock streams data
      const mockStreams: GameStream[] = [
        {
          id: 'stream1',
          title: 'Pro Poker Tournament - Final Table',
          game_id: 'game6',
          game_title: 'Poker',
          thumbnail: 'https://source.unsplash.com/random/800x450/?poker,tournament',
          viewers_count: 12500,
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          streamer: {
            id: 'user1',
            full_name: 'Jane Smith',
            avatar_url: null,
          },
        },
        {
          id: 'stream2',
          title: 'Dragon City - Breeding Rare Dragons',
          game_id: 'game5',
          game_title: 'Dragon City',
          thumbnail: 'https://source.unsplash.com/random/800x450/?dragon,fantasy',
          viewers_count: 8700,
          created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          streamer: {
            id: 'user2',
            full_name: 'John Doe',
            avatar_url: null,
          },
        },
        {
          id: 'stream3',
          title: 'Candy Crush Level 2000+ Walkthrough',
          game_id: 'game1',
          game_title: 'Candy Crush Saga',
          thumbnail: 'https://source.unsplash.com/random/800x450/?candy,colorful',
          viewers_count: 5300,
          created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          streamer: {
            id: 'user3',
            full_name: 'Alice Johnson',
            avatar_url: null,
          },
        },
      ];

      setGames(mockGames);
      setStreams(mockStreams);
      setIsLoading(false);
    };

    fetchGamesAndStreams();
  }, []);

  const formatPlayersCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M players`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K players`;
    } else {
      return `${count} players`;
    }
  };

  const formatViewersCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M viewers`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K viewers`;
    } else {
      return `${count} viewers`;
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
    } else {
      return `${Math.floor(diffSeconds / 86400)} days ago`;
    }
  };

  const handleSaveGame = (gameId: string) => {
    // In a real app, we would update the saved status in Supabase
    // For now, we'll just update the local state
    setGames(prev =>
      prev.map(game =>
        game.id === gameId
          ? { ...game, is_saved: !game.is_saved }
          : game
      )
    );
  };

  const handlePlayGame = (gameId: string) => {
    // In a real app, we would update the played status in Supabase and redirect to the game
    // For now, we'll just update the local state
    setGames(prev =>
      prev.map(game =>
        game.id === gameId
          ? { ...game, is_played: true }
          : game
      )
    );

    // Find the game and set it as selected
    const game = games.find(g => g.id === gameId);
    if (game) {
      setSelectedGame(game);
    }
  };

  const filteredGames = games.filter(game => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'played' && game.is_played) ||
      (activeTab === 'saved' && game.is_saved);

    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.category.toLowerCase().includes(searchQuery.toLowerCase());

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

      <div className="container mx-auto flex flex-1 px-4 py-6">
        <Sidebar className="sticky top-16 hidden w-1/5 lg:block" />

        <div className="w-full px-0 sm:px-4 lg:w-4/5">
          {selectedGame ? (
            <div>
              {/* Game header */}
              <div className="mb-6 overflow-hidden rounded-lg bg-white shadow">
                <div className="relative h-64 w-full">
                  <Image
                    src={selectedGame.cover_image}
                    alt={selectedGame.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h1 className="text-3xl font-bold text-white">{selectedGame.title}</h1>
                    <p className="text-white">{selectedGame.category} • {formatPlayersCount(selectedGame.players_count)}</p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
                    <div className="flex-1">
                      <p className="text-gray-700">{selectedGame.description}</p>
                    </div>

                    <div className="mt-4 flex space-x-2 md:mt-0 md:ml-4">
                      <button
                        onClick={() => handlePlayGame(selectedGame.id)}
                        className="flex items-center rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                      >
                        <FaPlay className="mr-2" />
                        Play Now
                      </button>

                      <button
                        onClick={() => handleSaveGame(selectedGame.id)}
                        className={`flex items-center rounded-md px-4 py-2 font-semibold ${
                          selectedGame.is_saved
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <FaBookmark className="mr-2" />
                        {selectedGame.is_saved ? 'Saved' : 'Save'}
                      </button>

                      <button
                        onClick={() => setSelectedGame(null)}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Back to Games
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Game streams */}
              <div className="mb-6">
                <h2 className="mb-4 text-xl font-semibold">Live Streams</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {streams.filter(stream => stream.game_id === selectedGame.id).length > 0 ? (
                    streams
                      .filter(stream => stream.game_id === selectedGame.id)
                      .map(stream => (
                        <div
                          key={stream.id}
                          className="overflow-hidden rounded-lg bg-white shadow transition-transform hover:scale-105"
                        >
                          <div className="relative h-40 w-full">
                            <Image
                              src={stream.thumbnail}
                              alt={stream.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute bottom-2 left-2 rounded bg-red-600 bg-opacity-90 px-2 py-1 text-xs text-white">
                              LIVE
                            </div>
                            <div className="absolute bottom-2 right-2 rounded bg-black bg-opacity-70 px-2 py-1 text-xs text-white">
                              {formatViewersCount(stream.viewers_count)}
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex">
                              {stream.streamer.avatar_url ? (
                                <Image
                                  src={stream.streamer.avatar_url}
                                  alt={stream.streamer.full_name}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                                  {getInitials(stream.streamer.full_name)}
                                </div>
                              )}
                              <div className="ml-3 flex-1">
                                <h3 className="font-semibold line-clamp-1">{stream.title}</h3>
                                <p className="text-sm text-gray-500">
                                  {stream.streamer.full_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {formatTimeAgo(stream.created_at)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="col-span-full rounded-lg bg-white p-8 text-center shadow">
                      <p className="text-gray-600">No live streams for this game at the moment.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Similar games */}
              <div>
                <h2 className="mb-4 text-xl font-semibold">Similar Games</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {games
                    .filter(game => game.category === selectedGame.category && game.id !== selectedGame.id)
                    .slice(0, 3)
                    .map(game => (
                      <div
                        key={game.id}
                        className="overflow-hidden rounded-lg bg-white shadow transition-transform hover:scale-105"
                      >
                        <div
                          className="relative h-40 w-full cursor-pointer"
                          onClick={() => setSelectedGame(game)}
                        >
                          <Image
                            src={game.cover_image}
                            alt={game.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div
                            className="mb-2 cursor-pointer"
                            onClick={() => setSelectedGame(game)}
                          >
                            <h3 className="font-semibold">{game.title}</h3>
                            <p className="text-sm text-gray-500">
                              {game.category} • {formatPlayersCount(game.players_count)}
                            </p>
                          </div>

                          <div className="flex space-x-2">
                            <button
                              onClick={() => handlePlayGame(game.id)}
                              className="flex-1 rounded-md bg-blue-600 py-1 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                              Play
                            </button>
                            <button
                              onClick={() => handleSaveGame(game.id)}
                              className={`flex-1 rounded-md py-1 text-sm font-semibold ${
                                game.is_saved
                                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {game.is_saved ? 'Saved' : 'Save'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Gaming</h1>
                  <p className="text-gray-600">Play games and watch gaming content</p>
                </div>
              </div>

              <div className="mb-6 flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search Games"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 pl-10 focus:border-blue-500 focus:outline-none"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-500" />
                </div>
              </div>

              <div className="mb-6 flex border-b border-gray-300">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`mr-4 pb-2 font-medium ${
                    activeTab === 'all'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Games
                </button>
                <button
                  onClick={() => setActiveTab('played')}
                  className={`mr-4 pb-2 font-medium ${
                    activeTab === 'played'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Recently Played
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`mr-4 pb-2 font-medium ${
                    activeTab === 'saved'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Saved Games
                </button>
              </div>

              {/* Live Streams */}
              {activeTab === 'all' && (
                <div className="mb-8">
                  <h2 className="mb-4 text-xl font-semibold">Live Now</h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {streams.map(stream => (
                      <div
                        key={stream.id}
                        className="overflow-hidden rounded-lg bg-white shadow transition-transform hover:scale-105"
                      >
                        <div className="relative h-40 w-full">
                          <Image
                            src={stream.thumbnail}
                            alt={stream.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute bottom-2 left-2 rounded bg-red-600 bg-opacity-90 px-2 py-1 text-xs text-white">
                            LIVE
                          </div>
                          <div className="absolute bottom-2 right-2 rounded bg-black bg-opacity-70 px-2 py-1 text-xs text-white">
                            {formatViewersCount(stream.viewers_count)}
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex">
                            {stream.streamer.avatar_url ? (
                              <Image
                                src={stream.streamer.avatar_url}
                                alt={stream.streamer.full_name}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700">
                                {getInitials(stream.streamer.full_name)}
                              </div>
                            )}
                            <div className="ml-3 flex-1">
                              <h3 className="font-semibold line-clamp-1">{stream.title}</h3>
                              <p className="text-sm text-gray-500">
                                {stream.streamer.full_name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {stream.game_title} • {formatTimeAgo(stream.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Games Grid */}
              <div>
                <h2 className="mb-4 text-xl font-semibold">
                  {activeTab === 'all' ? 'All Games' :
                   activeTab === 'played' ? 'Recently Played' : 'Saved Games'}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredGames.length > 0 ? (
                    filteredGames.map(game => (
                      <div
                        key={game.id}
                        className="overflow-hidden rounded-lg bg-white shadow transition-transform hover:scale-105"
                      >
                        <div
                          className="relative h-40 w-full cursor-pointer"
                          onClick={() => setSelectedGame(game)}
                        >
                          <Image
                            src={game.cover_image}
                            alt={game.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div
                            className="mb-2 cursor-pointer"
                            onClick={() => setSelectedGame(game)}
                          >
                            <h3 className="font-semibold">{game.title}</h3>
                            <p className="text-sm text-gray-500">
                              {game.category} • {formatPlayersCount(game.players_count)}
                            </p>
                          </div>

                          <div className="flex space-x-2">
                            <button
                              onClick={() => handlePlayGame(game.id)}
                              className="flex-1 rounded-md bg-blue-600 py-1 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                              {game.is_played ? 'Play Again' : 'Play'}
                            </button>
                            <button
                              onClick={() => handleSaveGame(game.id)}
                              className={`flex-1 rounded-md py-1 text-sm font-semibold ${
                                game.is_saved
                                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {game.is_saved ? 'Saved' : 'Save'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full rounded-lg bg-white p-8 text-center shadow">
                      <p className="text-gray-600">
                        {activeTab === 'all'
                          ? 'No games found matching your search.'
                          : activeTab === 'played'
                          ? 'You haven\'t played any games yet.'
                          : 'You haven\'t saved any games yet.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
