import React, { useState } from 'react';
import Header from './components/Header';
import DownloadForm from './components/DownloadForm';
import DownloadHistory from './components/DownloadHistory';
import SearchSection from './components/SearchSection';
import Footer from './components/Footer';
import { useDownloads } from './hooks/useDownloads';
import { SearchResult } from './types';
import { generateSampleAudioFile, generateSampleVideoFile, generateSampleWebMFile, getFileExtension, sanitizeFilename } from './utils/fileDownload';

function App() {
  const { downloads, addDownload, updateDownload, removeDownload, clearHistory } = useDownloads();
  const [activeTab, setActiveTab] = useState<'download' | 'search'>('download');

  const simulateDownload = (url: string, format: string, quality: string, title?: string) => {
    const cleanTitle = title || `Downloaded Media - ${format.toUpperCase()}`;
    const filename = sanitizeFilename(cleanTitle) + getFileExtension(format);
    
    const downloadId = addDownload({
      url,
      title: cleanTitle,
      format: format as any,
      quality,
      status: 'pending',
      progress: 0,
      fileSize: format === 'mp3' ? '5.2 MB' : '25.8 MB',
      duration: '3:45',
      filename,
    });

    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        
        // Generate the actual downloadable file based on format
        let downloadUrl: string;
        if (format === 'mp3') {
          downloadUrl = generateSampleAudioFile(cleanTitle, '3:45');
        } else if (format === 'webm') {
          downloadUrl = generateSampleWebMFile(cleanTitle, '3:45', quality);
        } else {
          downloadUrl = generateSampleVideoFile(cleanTitle, '3:45', quality);
        }
        
        updateDownload(downloadId, { 
          status: 'completed', 
          progress: 100,
          downloadUrl 
        });
        clearInterval(interval);
      } else {
        updateDownload(downloadId, { 
          status: 'downloading', 
          progress: Math.min(progress, 100) 
        });
      }
    }, 500);
  };

  const handleDownload = (url: string, format: string, quality: string) => {
    simulateDownload(url, format, quality);
  };

  const handleDownloadFromSearch = (result: SearchResult, format: string, quality: string) => {
    simulateDownload(result.url, format, quality, result.title);
  };

  const handleRetry = (id: string) => {
    const download = downloads.find(d => d.id === id);
    if (download) {
      updateDownload(id, { status: 'pending', progress: 0, downloadUrl: undefined });
      simulateDownload(download.url, download.format, download.quality, download.title);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-10"></div>
      <div className="relative z-10">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Download Media
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                In High Quality
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Free, fast, and secure media downloader supporting multiple platforms and formats.
              No registration required, unlimited downloads.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20">
              <button
                onClick={() => setActiveTab('download')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'download'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                URL Download
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'search'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Search & Download
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {activeTab === 'download' ? (
                <DownloadForm onDownload={handleDownload} />
              ) : (
                <SearchSection onDownloadFromSearch={handleDownloadFromSearch} />
              )}
            </div>
            
            <div className="lg:col-span-1">
              <DownloadHistory
                downloads={downloads}
                onRemove={removeDownload}
                onClearAll={clearHistory}
                onRetry={handleRetry}
              />
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">High Quality</h3>
              <p className="text-gray-300">Download in the highest available quality up to 4K video and 320kbps audio.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-300">Our optimized servers ensure the fastest possible download speeds.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">100% Secure</h3>
              <p className="text-gray-300">No ads, no malware, no registration. Your privacy is our priority.</p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;