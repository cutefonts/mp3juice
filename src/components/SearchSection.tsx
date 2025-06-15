import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp as Trending, Music, Video, Clock, Eye, User, Star, Calendar } from 'lucide-react';
import { SearchResult } from '../types';
import { searchService } from '../services/searchService';

interface SearchSectionProps {
  onDownloadFromSearch: (result: SearchResult, format: string, quality: string) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({ onDownloadFromSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [trendingContent, setTrendingContent] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadTrendingContent();
  }, [selectedPlatform]);

  const loadTrendingContent = async () => {
    try {
      const trending = await searchService.getTrendingContent(
        selectedPlatform === 'all' ? undefined : selectedPlatform
      );
      setTrendingContent(trending);
    } catch (error) {
      console.error('Failed to load trending content:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    try {
      const results = await searchService.search(searchQuery, {
        platform: selectedPlatform === 'all' ? undefined : selectedPlatform,
        duration: selectedDuration === 'all' ? undefined : selectedDuration as any,
        sortBy: sortBy as any
      });
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDownload = (result: SearchResult, format: string) => {
    onDownloadFromSearch(result, format, format === 'mp3' ? '320' : '720');
  };

  const handleTrendingClick = (tag: string) => {
    setSearchQuery(tag);
    handleSearchWithQuery(tag);
  };

  const handleSearchWithQuery = async (query: string) => {
    setIsSearching(true);
    try {
      const results = await searchService.search(query, {
        platform: selectedPlatform === 'all' ? undefined : selectedPlatform,
        duration: selectedDuration === 'all' ? undefined : selectedDuration as any,
        sortBy: sortBy as any
      });
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const formatViews = (views: string) => {
    const num = parseFloat(views);
    if (views.includes('M')) return `${num}M views`;
    if (views.includes('K')) return `${num}K views`;
    return `${views} views`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
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

          <div className="flex flex-wrap gap-3 items-center">
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
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-4 py-2 text-white transition-colors flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>

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

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Any Duration</option>
                  <option value="short">{'Short (< 4 min)'}</option>
                  <option value="medium">Medium (4-20 min)</option>
                  <option value="long">{'Long (> 20 min)'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Upload Date</option>
                  <option value="views">View Count</option>
                  <option value="duration">Duration</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlatform('all');
                    setSelectedDuration('all');
                    setSortBy('relevance');
                  }}
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-3 py-2 text-white transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Trending Section */}
        <div className="mt-8">
          <div className="flex items-center space-x-2 mb-4">
            <Trending className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Trending Searches</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Pop Music 2024', 'Lofi Hip Hop', 'Podcast Episodes', 'Live Concerts', 'Study Music', 'Nature Sounds'].map((tag) => (
              <button
                key={tag}
                onClick={() => handleTrendingClick(tag)}
                className="bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white px-3 py-1 rounded-full text-sm transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Content */}
      {!searchResults.length && trendingContent.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-2 mb-4">
            <Star className="h-5 w-5 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">Trending Now</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingContent.slice(0, 4).map((result) => (
              <div
                key={result.id}
                className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <img
                  src={result.thumbnail}
                  alt={result.title}
                  className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium mb-1 truncate text-sm">{result.title}</h4>
                  <div className="flex items-center space-x-3 text-xs text-gray-400">
                    <span className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{result.author}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{formatViews(result.views || '0')}</span>
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleDownload(result, 'mp3')}
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-2 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1"
                  >
                    <Music className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleDownload(result, 'mp4')}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-2 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1"
                  >
                    <Video className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Search Results</h3>
            <span className="text-gray-400 text-sm">{searchResults.length} results found</span>
          </div>
          <div className="space-y-4">
            {searchResults.map((result) => (
              <div
                key={result.id}
                className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <img
                  src={result.thumbnail}
                  alt={result.title}
                  className="w-24 h-18 object-cover rounded-lg flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium mb-2 line-clamp-2">{result.title}</h4>
                  
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
                      <span>{formatViews(result.views || '0')}</span>
                    </span>
                    {result.uploadDate && (
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(result.uploadDate)}</span>
                      </span>
                    )}
                  </div>
                  
                  {result.description && (
                    <p className="text-gray-400 text-sm line-clamp-2 mb-3">{result.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <span className="inline-block bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                      {result.platform}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => handleDownload(result, 'mp3')}
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <Music className="h-4 w-4" />
                    <span>Audio</span>
                  </button>
                  <button
                    onClick={() => handleDownload(result, 'mp4')}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <Video className="h-4 w-4" />
                    <span>Video</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {searchQuery && searchResults.length === 0 && !isSearching && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Results Found</h3>
          <p className="text-gray-400 mb-4">Try adjusting your search terms or filters</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSearchResults([]);
            }}
            className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-4 py-2 rounded-lg transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchSection;