import React from 'react';
import { Download, Trash2, Clock, FileText, Video, Music, ExternalLink, RefreshCw, Save } from 'lucide-react';
import { DownloadItem } from '../types';
import { formatFileSize, downloadFile } from '../utils/validators';

interface DownloadHistoryProps {
  downloads: DownloadItem[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onRetry: (id: string) => void;
}

const DownloadHistory: React.FC<DownloadHistoryProps> = ({ downloads, onRemove, onClearAll, onRetry }) => {
  const getStatusColor = (status: DownloadItem['status']) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'downloading': return 'text-blue-400';
      case 'error': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getStatusIcon = (status: DownloadItem['status']) => {
    switch (status) {
      case 'completed': return <Download className="h-4 w-4" />;
      case 'downloading': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'error': return <ExternalLink className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'mp3': return <Music className="h-4 w-4" />;
      case 'mp4': return <Video className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleDownloadFile = (download: DownloadItem) => {
    if (download.downloadUrl && download.filename) {
      downloadFile(download.downloadUrl, download.filename);
    }
  };

  if (downloads.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
        <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No Downloads Yet</h3>
        <p className="text-gray-400">Your download history will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Download History</h3>
        <button
          onClick={onClearAll}
          className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-4">
        {downloads.map((download) => (
          <div
            key={download.id}
            className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-start space-x-4">
              {download.thumbnail ? (
                <img
                  src={download.thumbnail}
                  alt={download.title}
                  className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  {getFormatIcon(download.format)}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate mb-1">{download.title}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                  <span className="flex items-center space-x-1">
                    {getFormatIcon(download.format)}
                    <span>{download.format.toUpperCase()}</span>
                  </span>
                  <span>{download.quality}p</span>
                  {download.fileSize && <span>{download.fileSize}</span>}
                  {download.duration && <span>{download.duration}</span>}
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  <span className={`flex items-center space-x-1 text-sm ${getStatusColor(download.status)}`}>
                    {getStatusIcon(download.status)}
                    <span className="capitalize">{download.status}</span>
                  </span>
                  
                  {download.status === 'downloading' && (
                    <div className="flex-1 bg-white/20 rounded-full h-2 max-w-xs">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${download.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {download.status === 'completed' && download.downloadUrl && (
                  <button
                    onClick={() => handleDownloadFile(download)}
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 w-full justify-center"
                    title="Download file to your device"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save to Device</span>
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {download.status === 'error' && (
                  <button
                    onClick={() => onRetry(download.id)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    title="Retry download"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => onRemove(download.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                  title="Remove from history"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadHistory;