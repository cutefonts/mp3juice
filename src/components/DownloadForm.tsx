import React, { useState } from 'react';
import { Download, Link, CheckCircle, AlertCircle, Loader, Info } from 'lucide-react';
import { isValidUrl, getSupportedPlatform } from '../utils/validators';
import { FormatOption, QualityOption } from '../types';
import { downloadService } from '../services/downloadService';

interface DownloadFormProps {
  onDownload: (url: string, format: string, quality: string) => void;
}

const formatOptions: FormatOption[] = [
  { value: 'mp3', label: 'Audio (WAV)', icon: '🎵' },
  { value: 'mp4', label: 'Video (WebM)', icon: '🎬' },
  { value: 'webm', label: 'WebM Video', icon: '📹' },
];

const qualityOptions: Record<string, QualityOption[]> = {
  mp3: [
    { value: '320', label: '320 kbps (Best)', fileSize: '~7.5MB' },
    { value: '256', label: '256 kbps (High)', fileSize: '~6MB' },
    { value: '192', label: '192 kbps (Good)', fileSize: '~4.5MB' },
    { value: '128', label: '128 kbps (Standard)', fileSize: '~3MB' },
  ],
  mp4: [
    { value: '1080', label: '1080p (Full HD)', fileSize: '~50MB' },
    { value: '720', label: '720p (HD)', fileSize: '~25MB' },
    { value: '480', label: '480p (SD)', fileSize: '~15MB' },
    { value: '360', label: '360p (Mobile)', fileSize: '~8MB' },
  ],
  webm: [
    { value: '1080', label: '1080p WebM', fileSize: '~40MB' },
    { value: '720', label: '720p WebM', fileSize: '~20MB' },
    { value: '480', label: '480p WebM', fileSize: '~12MB' },
  ],
};

const DownloadForm: React.FC<DownloadFormProps> = ({ onDownload }) => {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp3');
  const [quality, setQuality] = useState('320');
  const [isProcessing, setIsProcessing] = useState(false);
  const [urlStatus, setUrlStatus] = useState<'idle' | 'valid' | 'invalid' | 'checking'>('idle');
  const [videoInfo, setVideoInfo] = useState<any>(null);

  const handleUrlChange = async (value: string) => {
    setUrl(value);
    setVideoInfo(null);
    
    if (value.trim() === '') {
      setUrlStatus('idle');
      return;
    }
    
    if (!isValidUrl(value)) {
      setUrlStatus('invalid');
      return;
    }
    
    setUrlStatus('checking');
    
    try {
      // Get video info for preview
      const info = await downloadService.getVideoInfo(value);
      setVideoInfo(info);
      setUrlStatus('valid');
    } catch (error) {
      setUrlStatus('invalid');
    }
  };

  const handleFormatChange = (newFormat: string) => {
    setFormat(newFormat);
    setQuality(qualityOptions[newFormat][0].value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidUrl(url)) return;

    setIsProcessing(true);
    
    try {
      // Start the download process
      onDownload(url, format, quality);
      
      // Reset form
      setUrl('');
      setUrlStatus('idle');
      setVideoInfo(null);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const platform = url ? getSupportedPlatform(url) : null;

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Download Media</h2>
          <p className="text-gray-300">Paste your video or audio URL below</p>
          <div className="flex items-center justify-center space-x-2 mt-2 text-sm text-blue-300">
            <Info className="h-4 w-4" />
            <span>Generates playable demo files (WAV audio, WebM video)</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Link className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              {urlStatus === 'checking' && (
                <Loader className="h-5 w-5 text-blue-400 animate-spin" />
              )}
              {urlStatus === 'valid' && (
                <CheckCircle className="h-5 w-5 text-green-400" />
              )}
              {urlStatus === 'invalid' && (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
            </div>
          </div>

          {platform && (
            <div className="flex items-center justify-center space-x-2 text-sm text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span>Supported platform: {platform}</span>
            </div>
          )}

          {/* Video Preview */}
          {videoInfo && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center space-x-4">
                <img
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title}
                  className="w-20 h-15 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-1">{videoInfo.title}</h4>
                  <p className="text-gray-400 text-sm">Duration: {videoInfo.duration}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Format</label>
              <div className="space-y-2">
                {formatOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${
                      format === option.value
                        ? 'bg-purple-500/20 border-purple-500 text-white'
                        : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={option.value}
                      checked={format === option.value}
                      onChange={(e) => handleFormatChange(e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-lg">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Quality</label>
              <div className="space-y-2">
                {qualityOptions[format].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                      quality === option.value
                        ? 'bg-blue-500/20 border-blue-500 text-white'
                        : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="quality"
                        value={option.value}
                        checked={quality === option.value}
                        onChange={(e) => setQuality(e.target.value)}
                        className="sr-only"
                      />
                      <span className="font-medium">{option.label}</span>
                    </div>
                    {option.fileSize && (
                      <span className="text-sm text-gray-400">{option.fileSize}</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValidUrl(url) || isProcessing || urlStatus === 'checking'}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                <span>Download Media</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleUrlChange('https://youtube.com/watch?v=dQw4w9WgXcQ')}
            className="bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg p-4 text-left transition-colors"
          >
            <div className="text-white font-medium mb-1">Demo Video</div>
            <div className="text-gray-400 text-sm">Try with sample YouTube URL</div>
          </button>
          <button
            onClick={() => handleUrlChange('https://soundcloud.com/artist/track')}
            className="bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg p-4 text-left transition-colors"
          >
            <div className="text-white font-medium mb-1">Demo Audio</div>
            <div className="text-gray-400 text-sm">Try with sample SoundCloud URL</div>
          </button>
          <button
            onClick={() => handleUrlChange('https://vimeo.com/123456789')}
            className="bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg p-4 text-left transition-colors"
          >
            <div className="text-white font-medium mb-1">Demo Vimeo</div>
            <div className="text-gray-400 text-sm">Try with sample Vimeo URL</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadForm;