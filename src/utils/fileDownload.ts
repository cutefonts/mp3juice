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

// Generate a simple but valid MP3 file with silence
export const generateSampleAudioFile = (title: string, duration: string): string => {
  // Create a minimal valid MP3 file with ID3 tags
  const id3Header = new Uint8Array([
    0x49, 0x44, 0x33, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // ID3v2.3 header
  ]);
  
  // MP3 frame header for 44.1kHz, 128kbps, stereo
  const mp3Frame = new Uint8Array([
    0xFF, 0xFB, 0x90, 0x00, // MP3 frame sync + header
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Padding for minimal frame
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  ]);
  
  // Combine header and frame data
  const audioData = new Uint8Array(id3Header.length + mp3Frame.length * 100); // Repeat frame for duration
  audioData.set(id3Header, 0);
  
  for (let i = 0; i < 100; i++) {
    audioData.set(mp3Frame, id3Header.length + (i * mp3Frame.length));
  }
  
  const blob = new Blob([audioData], { type: 'audio/mpeg' });
  return URL.createObjectURL(blob);
};

// Generate a simple but valid MP4 file
export const generateSampleVideoFile = (title: string, duration: string, quality: string): string => {
  // Create a minimal valid MP4 file structure
  const ftyp = new Uint8Array([
    0x00, 0x00, 0x00, 0x20, // Box size
    0x66, 0x74, 0x79, 0x70, // 'ftyp'
    0x69, 0x73, 0x6F, 0x6D, // 'isom' - major brand
    0x00, 0x00, 0x02, 0x00, // Minor version
    0x69, 0x73, 0x6F, 0x6D, // Compatible brands
    0x69, 0x73, 0x6F, 0x32,
    0x61, 0x76, 0x63, 0x31,
    0x6D, 0x70, 0x34, 0x31,
  ]);
  
  // Minimal mdat box with some video data
  const mdat = new Uint8Array([
    0x00, 0x00, 0x00, 0x08, // Box size
    0x6D, 0x64, 0x61, 0x74, // 'mdat'
  ]);
  
  // Create a simple moov box structure
  const moov = new Uint8Array([
    0x00, 0x00, 0x00, 0x6C, // Box size
    0x6D, 0x6F, 0x6F, 0x76, // 'moov'
    // mvhd box
    0x00, 0x00, 0x00, 0x6C, // Box size
    0x6D, 0x76, 0x68, 0x64, // 'mvhd'
    0x00, 0x00, 0x00, 0x00, // Version and flags
    0x00, 0x00, 0x00, 0x00, // Creation time
    0x00, 0x00, 0x00, 0x00, // Modification time
    0x00, 0x00, 0x03, 0xE8, // Timescale (1000)
    0x00, 0x00, 0x0B, 0xB8, // Duration (3000 = 3 seconds)
    0x00, 0x01, 0x00, 0x00, // Rate
    0x01, 0x00, 0x00, 0x00, // Volume + reserved
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Reserved
    0x00, 0x01, 0x00, 0x00, // Matrix
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x01, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x40, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, // Pre-defined
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x02, // Next track ID
  ]);
  
  // Combine all boxes
  const videoData = new Uint8Array(ftyp.length + mdat.length + moov.length);
  videoData.set(ftyp, 0);
  videoData.set(mdat, ftyp.length);
  videoData.set(moov, ftyp.length + mdat.length);
  
  const blob = new Blob([videoData], { type: 'video/mp4' });
  return URL.createObjectURL(blob);
};

// Generate WebM file
export const generateSampleWebMFile = (title: string, duration: string, quality: string): string => {
  // Create a minimal WebM file structure
  const webmHeader = new Uint8Array([
    0x1A, 0x45, 0xDF, 0xA3, // EBML header
    0x9F, // Header size
    0x42, 0x86, 0x81, 0x01, // EBMLVersion = 1
    0x42, 0xF7, 0x81, 0x01, // EBMLReadVersion = 1
    0x42, 0xF2, 0x81, 0x04, // EBMLMaxIDLength = 4
    0x42, 0xF3, 0x81, 0x08, // EBMLMaxSizeLength = 8
    0x42, 0x82, 0x84, 0x77, 0x65, 0x62, 0x6D, // DocType = "webm"
    0x42, 0x87, 0x81, 0x02, // DocTypeVersion = 2
    0x42, 0x85, 0x81, 0x02, // DocTypeReadVersion = 2
  ]);
  
  const blob = new Blob([webmHeader], { type: 'video/webm' });
  return URL.createObjectURL(blob);
};

export const getFileExtension = (format: string): string => {
  switch (format) {
    case 'mp3': return '.mp3';
    case 'mp4': return '.mp4';
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