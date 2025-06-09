import React, { useState } from 'react';
import { Search, Filter, TrendingUp as Trending, Music, Video, Clock, Eye, User } from 'lucide-react';
import { SearchResult } from '../types';

interface SearchSectionProps {
  onDownloadFromSearch: (result: SearchResult, format: string, quality: string) => void;
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: 'Popular Song - Official Music Video',
    duration: '3:45',
    thumbnail: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
    url: 'https://youtube.com/watch?v=example1',
    platform: 'YouTube',
    views: '10M',
    author: 'Artist Name'
  },
  {
    id: '2',
    title: 'Trending Music Mix 2024',
    duration: '45:20',
    thumbnail: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400',
    url: 'https://youtube.com/watch?v=example2',
    platform: 'YouTube',
    views: '5.2M',
    author: 'Music Channel'
  },
  {
    id: '3',
    title: 'Acoustic Session Live',
    duration: '8:12',
    thumbnail: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
    url: 'https://youtube.com/watch?v=example3',
    platform: 'YouTube',
    views: '2.1M',
    author: 'Live Sessions'
  }
];

const SearchSection: React.FC<SearchSectionProps> = ({ onDownloadFromSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    // Simulate API search
    setTimeout(() => {
      setSearchResults(mockSearchResults.filter(result => 
        result.title.toLowerCase().includes(searchQuery.toLowerCase())
      ));
      setIsSearching(false);
    }, 1000);
  };

  const handleDownload = (result: SearchResult, format: string) => {
    onDownloadFromSearch(result, format, format === 'mp3' ? '320' : '720');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Search & Download</h2>
          <p className="text-gray-300">Find and download your favorite content</p>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for music, videos, podcasts..."
              className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Platforms</option>
              <option value="youtube">YouTube</option>
              <option value="soundcloud">SoundCloud</option>
              <option value="vimeo">Vimeo</option>
            </select>

            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold px-6 py-2 rounded-lg transition-all flex items-center space-x-2"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Trending Section */}
        <div className="mt-8">
          <div className="flex items-center space-x-2 mb-4">
            <Trending className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Trending Now</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Pop Music 2024', 'Lofi Hip Hop', 'Podcast Episodes', 'Live Concerts', 'Study Music'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-1 rounded-full text-sm transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Search Results</h3>
          <div className="space-y-4">
            {searchResults.map((result) => (
              <div
                key={result.id}
                className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <img
                  src={result.thumbnail}
                  alt={result.title}
                  className="w-20 h-15 object-cover rounded-lg flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium mb-1 truncate">{result.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                    <span className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{result.author}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{result.duration}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{result.views}</span>
                    </span>
                  </div>
                  <span className="inline-block bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                    {result.platform}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDownload(result, 'mp3')}
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                  >
                    <Music className="h-4 w-4" />
                    <span>MP3</span>
                  </button>
                  <button
                    onClick={() => handleDownload(result, 'mp4')}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                  >
                    <Video className="h-4 w-4" />
                    <span>MP4</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSection;