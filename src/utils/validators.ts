export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const getSupportedPlatform = (url: string): string | null => {
  const platforms = [
    { name: 'YouTube', patterns: ['youtube.com', 'youtu.be'] },
    { name: 'SoundCloud', patterns: ['soundcloud.com'] },
    { name: 'Vimeo', patterns: ['vimeo.com'] },
    { name: 'Facebook', patterns: ['facebook.com', 'fb.com'] },
    { name: 'Instagram', patterns: ['instagram.com'] },
    { name: 'TikTok', patterns: ['tiktok.com'] },
  ];

  for (const platform of platforms) {
    if (platform.patterns.some(pattern => url.includes(pattern))) {
      return platform.name;
    }
  }
  return null;
};

export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const downloadFile = (url: string, filename: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};