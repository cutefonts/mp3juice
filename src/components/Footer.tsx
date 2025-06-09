import React from 'react';
import { Heart, Shield, Zap, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/5 backdrop-blur-md border-t border-white/20 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4">MediaGrab</h3>
            <p className="text-gray-400 mb-4 max-w-md">
              Free, fast, and secure media downloader. Download your favorite videos and audio 
              from multiple platforms with high quality and no limitations.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Shield className="h-4 w-4 text-green-400" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span>Lightning Fast</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Globe className="h-4 w-4 text-blue-400" />
                <span>Multi-Platform</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Supported Platforms</h4>
            <ul className="space-y-2 text-gray-400">
              <li>YouTube</li>
              <li>SoundCloud</li>
              <li>Vimeo</li>
              <li>Facebook</li>
              <li>Instagram</li>
              <li>TikTok</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Formats</h4>
            <ul className="space-y-2 text-gray-400">
              <li>MP3 Audio</li>
              <li>MP4 Video</li>
              <li>WebM Video</li>
              <li>High Quality</li>
              <li>Fast Downloads</li>
              <li>Batch Processing</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm">
            © 2024 MediaGrab. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-400 mt-4 md:mt-0">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-400" />
            <span>for content creators</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;