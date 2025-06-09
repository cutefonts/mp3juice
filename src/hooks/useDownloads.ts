import { useState, useCallback } from 'react';
import { DownloadItem } from '../types';

export const useDownloads = () => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  const addDownload = useCallback((item: Omit<DownloadItem, 'id' | 'createdAt'>) => {
    const newDownload: DownloadItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    setDownloads(prev => [newDownload, ...prev]);
    return newDownload.id;
  }, []);

  const updateDownload = useCallback((id: string, updates: Partial<DownloadItem>) => {
    setDownloads(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  const removeDownload = useCallback((id: string) => {
    setDownloads(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setDownloads([]);
  }, []);

  return {
    downloads,
    addDownload,
    updateDownload,
    removeDownload,
    clearHistory,
  };
};