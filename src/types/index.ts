export interface DownloadItem {
  id: string;
  url: string;
  title: string;
  format: 'mp3' | 'mp4' | 'webm';
  quality: string;
  status: 'pending' | 'downloading' | 'completed' | 'error';
  progress: number;
  fileSize?: string;
  duration?: string;
  thumbnail?: string;
  createdAt: Date;
  downloadUrl?: string; // URL for the actual file download
  filename?: string; // Generated filename
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