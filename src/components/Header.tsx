import React from 'react';
import { Download, Music, Video, Search } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-xl">
              <Download className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MediaGrab</h1>
              <p className="text-xs text-gray-300">Free MP3 & MP4 Downloader</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#downloader" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <Download className="h-4 w-4" />
              <span>Download</span>
            </a>
            <a href="#search" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </a>
            <a href="#formats" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <Music className="h-4 w-4" />
              <span>Formats</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;