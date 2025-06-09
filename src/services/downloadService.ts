interface VideoInfo {
  title: string;
  duration: string;
  thumbnail: string;
  formats: Array<{
    quality: string;
    format: string;
    url: string;
    fileSize?: string;
  }>;
}

interface DownloadProgress {
  progress: number;
  downloadedBytes: number;
  totalBytes: number;
  speed: string;
}

class DownloadService {
  private activeDownloads = new Map<string, AbortController>();

  async getVideoInfo(url: string): Promise<VideoInfo> {
    try {
      // Simulate API call to get video information
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Extract video ID from URL for demo purposes
      const videoId = this.extractVideoId(url);
      
      return {
        title: `Demo Video - ${videoId}`,
        duration: '3:45',
        thumbnail: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
        formats: [
          { quality: '1080', format: 'mp4', url: `${url}&quality=1080`, fileSize: '50MB' },
          { quality: '720', format: 'mp4', url: `${url}&quality=720`, fileSize: '25MB' },
          { quality: '480', format: 'mp4', url: `${url}&quality=480`, fileSize: '15MB' },
          { quality: '320', format: 'mp3', url: `${url}&quality=320`, fileSize: '7.5MB' },
          { quality: '256', format: 'mp3', url: `${url}&quality=256`, fileSize: '6MB' },
          { quality: '192', format: 'mp3', url: `${url}&quality=192`, fileSize: '4.5MB' },
        ]
      };
    } catch (error) {
      throw new Error('Failed to fetch video information');
    }
  }

  async downloadMedia(
    url: string,
    format: string,
    quality: string,
    onProgress: (progress: DownloadProgress) => void
  ): Promise<{ blob: Blob; filename: string }> {
    const downloadId = Math.random().toString(36).substr(2, 9);
    const controller = new AbortController();
    this.activeDownloads.set(downloadId, controller);

    try {
      // Get video info first
      const videoInfo = await this.getVideoInfo(url);
      const filename = this.generateFilename(videoInfo.title, format);

      // Simulate download with real progress
      const totalSize = this.getEstimatedSize(format, quality);
      let downloadedBytes = 0;
      const chunkSize = Math.max(1024 * 100, totalSize / 100); // 100KB chunks or 1% of file
      
      const chunks: Uint8Array[] = [];
      const startTime = Date.now();
      
      while (downloadedBytes < totalSize && !controller.signal.aborted) {
        const currentChunkSize = Math.min(chunkSize, totalSize - downloadedBytes);
        const chunk = this.generateChunk(currentChunkSize, format);
        chunks.push(chunk);
        
        downloadedBytes += currentChunkSize;
        const progress = (downloadedBytes / totalSize) * 100;
        const speed = this.calculateSpeed(downloadedBytes, startTime);
        
        onProgress({
          progress,
          downloadedBytes,
          totalBytes: totalSize,
          speed
        });

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
      }

      if (controller.signal.aborted) {
        throw new Error('Download cancelled');
      }

      // Create the final blob
      const blob = this.createMediaBlob(chunks, format, videoInfo.title, videoInfo.duration);
      
      this.activeDownloads.delete(downloadId);
      return { blob, filename };
      
    } catch (error) {
      this.activeDownloads.delete(downloadId);
      throw error;
    }
  }

  cancelDownload(downloadId: string): void {
    const controller = this.activeDownloads.get(downloadId);
    if (controller) {
      controller.abort();
      this.activeDownloads.delete(downloadId);
    }
  }

  private extractVideoId(url: string): string {
    // Simple extraction for demo
    const match = url.match(/(?:v=|\/)([\w-]{11})/);
    return match ? match[1] : 'demo-video';
  }

  private generateFilename(title: string, format: string): string {
    const sanitized = title
      .replace(/[<>:"/\\|?*]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 100);
    
    const extension = format === 'mp3' ? 'wav' : 'webm';
    return `${sanitized}.${extension}`;
  }

  private getEstimatedSize(format: string, quality: string): number {
    const sizes: Record<string, Record<string, number>> = {
      mp3: {
        '320': 7.5 * 1024 * 1024,
        '256': 6 * 1024 * 1024,
        '192': 4.5 * 1024 * 1024,
        '128': 3 * 1024 * 1024,
      },
      mp4: {
        '1080': 50 * 1024 * 1024,
        '720': 25 * 1024 * 1024,
        '480': 15 * 1024 * 1024,
        '360': 8 * 1024 * 1024,
      },
      webm: {
        '1080': 40 * 1024 * 1024,
        '720': 20 * 1024 * 1024,
        '480': 12 * 1024 * 1024,
      }
    };

    return sizes[format]?.[quality] || 10 * 1024 * 1024;
  }

  private generateChunk(size: number, format: string): Uint8Array {
    const chunk = new Uint8Array(size);
    
    if (format === 'mp3') {
      // Generate audio-like data with sine wave pattern
      for (let i = 0; i < size; i++) {
        chunk[i] = Math.floor(Math.sin(i * 0.01) * 127 + 128);
      }
    } else {
      // Generate video-like data with pattern
      for (let i = 0; i < size; i++) {
        chunk[i] = Math.floor(Math.random() * 256);
      }
    }
    
    return chunk;
  }

  private calculateSpeed(downloadedBytes: number, startTime: number): string {
    const elapsedTime = (Date.now() - startTime) / 1000; // seconds
    const speed = downloadedBytes / elapsedTime; // bytes per second
    
    if (speed > 1024 * 1024) {
      return `${(speed / (1024 * 1024)).toFixed(1)} MB/s`;
    } else if (speed > 1024) {
      return `${(speed / 1024).toFixed(1)} KB/s`;
    }
    return `${speed.toFixed(0)} B/s`;
  }

  private createMediaBlob(chunks: Uint8Array[], format: string, title: string, duration: string): Blob {
    if (format === 'mp3') {
      return this.createAudioBlob(chunks, title, duration);
    } else {
      return this.createVideoBlob(chunks, title, duration);
    }
  }

  private createAudioBlob(chunks: Uint8Array[], title: string, duration: string): Blob {
    // Create a simple WAV file
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const sampleRate = 44100;
    const channels = 2;
    const bitsPerSample = 16;
    
    // WAV header
    const header = new ArrayBuffer(44);
    const view = new DataView(header);
    
    // RIFF header
    view.setUint32(0, 0x52494646, false); // "RIFF"
    view.setUint32(4, totalLength + 36, true); // File size
    view.setUint32(8, 0x57415645, false); // "WAVE"
    
    // Format chunk
    view.setUint32(12, 0x666d7420, false); // "fmt "
    view.setUint32(16, 16, true); // Chunk size
    view.setUint16(20, 1, true); // Audio format (PCM)
    view.setUint16(22, channels, true); // Number of channels
    view.setUint32(24, sampleRate, true); // Sample rate
    view.setUint32(28, sampleRate * channels * bitsPerSample / 8, true); // Byte rate
    view.setUint16(32, channels * bitsPerSample / 8, true); // Block align
    view.setUint16(34, bitsPerSample, true); // Bits per sample
    
    // Data chunk
    view.setUint32(36, 0x64617461, false); // "data"
    view.setUint32(40, totalLength, true); // Data size
    
    // Combine header and data
    const allChunks = [new Uint8Array(header), ...chunks];
    return new Blob(allChunks, { type: 'audio/wav' });
  }

  private createVideoBlob(chunks: Uint8Array[], title: string, duration: string): Blob {
    // Create a simple WebM container with basic structure
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    
    // Simple WebM header (minimal structure)
    const header = new Uint8Array([
      0x1A, 0x45, 0xDF, 0xA3, // EBML header
      0x9F, 0x42, 0x86, 0x81, 0x01, // DocType: webm
      0x42, 0x82, 0x84, 0x77, 0x65, 0x62, 0x6D, // webm
    ]);
    
    return new Blob([header, ...chunks], { type: 'video/webm' });
  }
}

export const downloadService = new DownloadService();