'use client';

import { useState, useEffect } from 'react';
import { FaSun, FaCloud, FaCloudRain, FaSnowflake, FaCloudSun, FaBolt, FaWind, FaSearch } from 'react-icons/fa';

interface WeatherData {
  location: string;
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'partly-cloudy' | 'rainy' | 'snowy' | 'stormy' | 'windy';
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  forecast: {
    day: string;
    condition: 'sunny' | 'cloudy' | 'partly-cloudy' | 'rainy' | 'snowy' | 'stormy' | 'windy';
    high: number;
    low: number;
  }[];
}

export default function WeatherWidget() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  
  useEffect(() => {
    // In a real app, we would get the user's location and fetch real weather data
    // For now, we'll use mock data
    
    const fetchWeatherData = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock weather data
      const mockWeatherData: WeatherData = {
        location: searchLocation || 'San Francisco, CA',
        temperature: 72,
        condition: 'sunny',
        high: 75,
        low: 62,
        humidity: 65,
        windSpeed: 8,
        forecast: [
          {
            day: 'Today',
            condition: 'sunny',
            high: 75,
            low: 62,
          },
          {
            day: 'Tomorrow',
            condition: 'partly-cloudy',
            high: 73,
            low: 61,
          },
          {
            day: 'Wednesday',
            condition: 'cloudy',
            high: 70,
            low: 60,
          },
          {
            day: 'Thursday',
            condition: 'rainy',
            high: 68,
            low: 59,
          },
          {
            day: 'Friday',
            condition: 'partly-cloudy',
            high: 71,
            low: 60,
          },
        ],
      };
      
      setWeatherData(mockWeatherData);
      setIsLoading(false);
    };
    
    fetchWeatherData();
  }, [searchLocation]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchLocation(location);
  };
  
  const getWeatherIcon = (condition: string, size = 24) => {
    switch (condition) {
      case 'sunny':
        return <FaSun size={size} className="text-yellow-500" />;
      case 'cloudy':
        return <FaCloud size={size} className="text-gray-500" />;
      case 'partly-cloudy':
        return <FaCloudSun size={size} className="text-gray-400" />;
      case 'rainy':
        return <FaCloudRain size={size} className="text-blue-500" />;
      case 'snowy':
        return <FaSnowflake size={size} className="text-blue-300" />;
      case 'stormy':
        return <FaBolt size={size} className="text-yellow-600" />;
      case 'windy':
        return <FaWind size={size} className="text-gray-400" />;
      default:
        return <FaSun size={size} className="text-yellow-500" />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Weather</h2>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-full border border-gray-300 bg-gray-100 px-4 py-1 pl-8 text-sm focus:border-blue-500 focus:bg-white focus:outline-none"
          />
          <FaSearch className="absolute left-2 top-2 text-gray-500" size={14} />
        </form>
      </div>
      
      {weatherData && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">{weatherData.location}</h3>
              <p className="text-sm text-gray-500">
                H: {weatherData.high}° L: {weatherData.low}°
              </p>
            </div>
            <div className="flex items-center">
              {getWeatherIcon(weatherData.condition, 36)}
              <span className="ml-2 text-3xl font-bold">{weatherData.temperature}°</span>
            </div>
          </div>
          
          <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Humidity</span>
              <p>{weatherData.humidity}%</p>
            </div>
            <div>
              <span className="text-gray-500">Wind</span>
              <p>{weatherData.windSpeed} mph</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-3">
            <h4 className="mb-2 text-sm font-semibold">5-Day Forecast</h4>
            <div className="space-y-2">
              {weatherData.forecast.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="w-24 text-sm">{day.day}</span>
                  <div className="flex items-center">
                    {getWeatherIcon(day.condition, 16)}
                  </div>
                  <div className="flex w-20 justify-between text-sm">
                    <span className="font-medium">{day.high}°</span>
                    <span className="text-gray-500">{day.low}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
