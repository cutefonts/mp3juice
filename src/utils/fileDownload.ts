export const downloadFile = (url: string, filename: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const createDownloadableFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  downloadFile(url, filename);
  // Clean up the object URL after download
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

// Generate a proper MP3 file using Web Audio API
export const generateSampleAudioFile = (title: string, duration: string): string => {
  // Create an audio context
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const sampleRate = audioContext.sampleRate;
  const durationInSeconds = parseDuration(duration);
  const length = sampleRate * durationInSeconds;
  
  // Create an audio buffer
  const audioBuffer = audioContext.createBuffer(2, length, sampleRate);
  
  // Generate a simple sine wave tone (440Hz A note)
  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      // Create a sine wave with fade in/out to avoid clicks
      const fadeLength = sampleRate * 0.1; // 0.1 second fade
      let amplitude = 0.1;
      
      if (i < fadeLength) {
        amplitude *= i / fadeLength;
      } else if (i > length - fadeLength) {
        amplitude *= (length - i) / fadeLength;
      }
      
      channelData[i] = Math.sin(2 * Math.PI * 440 * i / sampleRate) * amplitude;
    }
  }
  
  // Convert to WAV format (which is more universally supported than MP3)
  const wavData = audioBufferToWav(audioBuffer);
  const blob = new Blob([wavData], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
};

// Generate a proper MP4 video file using Canvas and MediaRecorder
export const generateSampleVideoFile = (title: string, duration: string, quality: string): string => {
  return new Promise<string>((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // Set canvas size based on quality
    const dimensions = getVideoDimensions(quality);
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // Create a media stream from canvas
    const stream = canvas.captureStream(30); // 30 FPS
    
    // Set up MediaRecorder
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp8', // Use WebM as it's more widely supported
    });
    
    const chunks: BlobPart[] = [];
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      resolve(url);
    };
    
    // Start recording
    mediaRecorder.start();
    
    // Generate video content
    let frame = 0;
    const durationInSeconds = parseDuration(duration);
    const totalFrames = durationInSeconds * 30; // 30 FPS
    
    const drawFrame = () => {
      // Clear canvas
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw animated content
      const progress = frame / totalFrames;
      const time = progress * durationInSeconds;
      
      // Animated background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, `hsl(${(time * 50) % 360}, 70%, 30%)`);
      gradient.addColorStop(1, `hsl(${(time * 50 + 180) % 360}, 70%, 20%)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw title
      ctx.fillStyle = 'white';
      ctx.font = `${Math.max(24, canvas.width / 20)}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 50);
      
      // Draw progress bar
      const barWidth = canvas.width * 0.6;
      const barHeight = 10;
      const barX = (canvas.width - barWidth) / 2;
      const barY = canvas.height / 2 + 20;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(barX, barY, barWidth, barHeight);
      
      ctx.fillStyle = '#4f46e5';
      ctx.fillRect(barX, barY, barWidth * progress, barHeight);
      
      // Draw time
      ctx.fillStyle = 'white';
      ctx.font = `${Math.max(16, canvas.width / 30)}px Arial`;
      ctx.fillText(
        `${formatTime(time)} / ${duration}`,
        canvas.width / 2,
        barY + 40
      );
      
      // Draw quality indicator
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = `${Math.max(14, canvas.width / 40)}px Arial`;
      ctx.textAlign = 'right';
      ctx.fillText(`${quality}p`, canvas.width - 20, 30);
      
      frame++;
      
      if (frame < totalFrames) {
        requestAnimationFrame(drawFrame);
      } else {
        // Stop recording after duration
        setTimeout(() => {
          mediaRecorder.stop();
        }, 100);
      }
    };
    
    // Start animation
    drawFrame();
  });
};

// Generate WebM file (similar to MP4 but with WebM container)
export const generateSampleWebMFile = (title: string, duration: string, quality: string): string => {
  // For WebM, we'll use the same video generation but ensure WebM format
  return generateSampleVideoFile(title, duration, quality);
};

// Helper function to convert AudioBuffer to WAV
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const length = buffer.length;
  const numberOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
  const view = new DataView(arrayBuffer);
  
  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length * numberOfChannels * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numberOfChannels * 2, true);
  view.setUint16(32, numberOfChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length * numberOfChannels * 2, true);
  
  // Convert float samples to 16-bit PCM
  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
  }
  
  return arrayBuffer;
}

// Helper function to parse duration string to seconds
function parseDuration(duration: string): number {
  const parts = duration.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1]; // MM:SS
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
  }
  return 30; // Default to 30 seconds
}

// Helper function to get video dimensions based on quality
function getVideoDimensions(quality: string): { width: number; height: number } {
  switch (quality) {
    case '1080':
      return { width: 1920, height: 1080 };
    case '720':
      return { width: 1280, height: 720 };
    case '480':
      return { width: 854, height: 480 };
    case '360':
      return { width: 640, height: 360 };
    default:
      return { width: 1280, height: 720 };
  }
}

// Helper function to format time in MM:SS format
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const getFileExtension = (format: string): string => {
  switch (format) {
    case 'mp3': return '.wav'; // We're generating WAV files for audio
    case 'mp4': return '.webm'; // We're generating WebM files for video
    case 'webm': return '.webm';
    default: return '.txt';
  }
};

export const sanitizeFilename = (filename: string): string => {
  // Remove invalid characters for filenames
  return filename
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 100); // Limit length
};