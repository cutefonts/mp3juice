export interface DownloadItem {
  id: string;
  url: string;
  title: string;
  format: 'mp3' | 'mp4' | 'webm';
  quality: string;
  status: 'pending' | 'downloading' | 'completed' | 'error' | 'cancelled';
  progress: number;
  fileSize?: string;
  duration?: string;
  thumbnail?: string;
  createdAt: Date;
  downloadUrl?: string;
  filename?: string;
  downloadedBytes?: number;
  totalBytes?: number;
  speed?: string;
  error?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  url: string;
  platform: string;
  views?: string;
  author?: string;
  uploadDate?: string;
  description?: string;
}

export interface FormatOption {
  value: string;
  label: string;
  icon: string;
}

export interface QualityOption {
  value: string;
  label: string;
  fileSize?: string;
}

export interface DownloadProgress {
  progress: number;
  downloadedBytes: number;
  totalBytes: number;
  speed: string;
}

export interface VideoInfo {
  title: string;
  duration: string;
  thumbnail: string;
  author?: string;
  views?: string;
  uploadDate?: string;
  description?: string;
  formats: Array<{
    quality: string;
    format: string;
    url: string;
    fileSize?: string;
  }>;
}