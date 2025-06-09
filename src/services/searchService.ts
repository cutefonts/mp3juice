import { SearchResult } from '../types';

interface SearchFilters {
  platform?: string;
  duration?: 'short' | 'medium' | 'long';
  quality?: string;
  sortBy?: 'relevance' | 'date' | 'views' | 'rating';
}

class SearchService {
  private mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Amazing Music Video 2024 - Official',
      duration: '3:45',
      thumbnail: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
      url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
      platform: 'YouTube',
      views: '10.2M',
      author: 'Music Artist',
      uploadDate: '2024-01-15',
      description: 'Official music video featuring amazing visuals and great sound quality.'
    },
    {
      id: '2',
      title: 'Trending Dance Mix 2024 | Best Electronic Music',
      duration: '45:20',
      thumbnail: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400',
      url: 'https://youtube.com/watch?v=example2',
      platform: 'YouTube',
      views: '5.2M',
      author: 'DJ MixMaster',
      uploadDate: '2024-02-01',
      description: 'The hottest electronic dance music mix of 2024.'
    },
    {
      id: '3',
      title: 'Acoustic Guitar Session - Relaxing Music',
      duration: '8:12',
      thumbnail: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
      url: 'https://youtube.com/watch?v=example3',
      platform: 'YouTube',
      views: '2.1M',
      author: 'Acoustic Sessions',
      uploadDate: '2024-01-28',
      description: 'Beautiful acoustic guitar melodies for relaxation and study.'
    },
    {
      id: '4',
      title: 'Podcast: Tech Talk - AI and Future',
      duration: '52:30',
      thumbnail: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=400',
      url: 'https://soundcloud.com/techtalk/ai-future',
      platform: 'SoundCloud',
      views: '850K',
      author: 'Tech Talk Podcast',
      uploadDate: '2024-02-10',
      description: 'Deep dive into artificial intelligence and its impact on the future.'
    },
    {
      id: '5',
      title: 'Nature Documentary - Ocean Life',
      duration: '25:45',
      thumbnail: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=400',
      url: 'https://vimeo.com/nature/ocean-life',
      platform: 'Vimeo',
      views: '1.5M',
      author: 'Nature Films',
      uploadDate: '2024-01-20',
      description: 'Stunning 4K footage of marine life in the deep ocean.'
    },
    {
      id: '6',
      title: 'Cooking Tutorial - Italian Pasta',
      duration: '12:30',
      thumbnail: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
      url: 'https://youtube.com/watch?v=pasta-tutorial',
      platform: 'YouTube',
      views: '3.8M',
      author: 'Chef Marco',
      uploadDate: '2024-02-05',
      description: 'Learn to make authentic Italian pasta from scratch.'
    }
  ];

  async search(query: string, filters: SearchFilters = {}): Promise<SearchResult[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    let results = this.mockResults;

    // Filter by query
    if (query.trim()) {
      const searchTerms = query.toLowerCase().split(' ');
      results = results.filter(result => 
        searchTerms.some(term => 
          result.title.toLowerCase().includes(term) ||
          result.author.toLowerCase().includes(term) ||
          result.description?.toLowerCase().includes(term)
        )
      );
    }

    // Filter by platform
    if (filters.platform && filters.platform !== 'all') {
      results = results.filter(result => 
        result.platform.toLowerCase() === filters.platform?.toLowerCase()
      );
    }

    // Filter by duration
    if (filters.duration) {
      results = results.filter(result => {
        const duration = this.parseDuration(result.duration);
        switch (filters.duration) {
          case 'short': return duration < 240; // < 4 minutes
          case 'medium': return duration >= 240 && duration < 1200; // 4-20 minutes
          case 'long': return duration >= 1200; // > 20 minutes
          default: return true;
        }
      });
    }

    // Sort results
    if (filters.sortBy) {
      results = this.sortResults(results, filters.sortBy);
    }

    return results;
  }

  async getTrendingContent(platform?: string): Promise<SearchResult[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let trending = this.mockResults
      .sort((a, b) => this.parseViews(b.views || '0') - this.parseViews(a.views || '0'))
      .slice(0, 6);

    if (platform && platform !== 'all') {
      trending = trending.filter(result => 
        result.platform.toLowerCase() === platform.toLowerCase()
      );
    }

    return trending;
  }

  async getRecommendations(basedOn: SearchResult): Promise<SearchResult[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Simple recommendation based on platform and content type
    return this.mockResults
      .filter(result => 
        result.id !== basedOn.id && 
        (result.platform === basedOn.platform || 
         result.author === basedOn.author)
      )
      .slice(0, 4);
  }

  private parseDuration(duration: string): number {
    const parts = duration.split(':').map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1]; // MM:SS
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
    }
    return 0;
  }

  private parseViews(views: string): number {
    const num = parseFloat(views);
    if (views.includes('M')) return num * 1000000;
    if (views.includes('K')) return num * 1000;
    return num;
  }

  private sortResults(results: SearchResult[], sortBy: string): SearchResult[] {
    switch (sortBy) {
      case 'date':
        return results.sort((a, b) => 
          new Date(b.uploadDate || '').getTime() - new Date(a.uploadDate || '').getTime()
        );
      case 'views':
        return results.sort((a, b) => 
          this.parseViews(b.views || '0') - this.parseViews(a.views || '0')
        );
      case 'duration':
        return results.sort((a, b) => 
          this.parseDuration(a.duration) - this.parseDuration(b.duration)
        );
      default: // relevance
        return results;
    }
  }
}

export const searchService = new SearchService();