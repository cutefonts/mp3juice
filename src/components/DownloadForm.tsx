import React, { useState } from 'react';
import { Download, Link, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { isValidUrl, getSupportedPlatform } from '../utils/validators';
import { FormatOption, QualityOption } from '../types';

interface DownloadFormProps {
  onDownload: (url: string, format: string, quality: string) => void;
}

const formatOptions: FormatOption[] = [
  { value: 'mp3', label: 'MP3 Audio', icon: '🎵' },
  { value: 'mp4', label: 'MP4 Video', icon: '🎬' },
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
  const [urlStatus, setUrlStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (value.trim() === '') {
      setUrlStatus('idle');
    } else if (isValidUrl(value)) {
      setUrlStatus('valid');
    } else {
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
    
    // Simulate API call delay
    setTimeout(() => {
      onDownload(url, format, quality);
      setIsProcessing(false);
      setUrl('');
      setUrlStatus('idle');
    }, 1000);
  };

  const platform = url ? getSupportedPlatform(url) : null;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Download Media</h2>
        <p className="text-gray-300">Paste your video or audio URL below</p>
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
          disabled={!isValidUrl(url) || isProcessing}
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
  );
};

export default DownloadForm;