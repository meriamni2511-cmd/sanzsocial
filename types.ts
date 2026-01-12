
export enum PostStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  POSTED = 'POSTED',
  FAILED = 'FAILED'
}

export interface PlatformOptions {
  instagram?: {
    postType: 'post' | 'reel' | 'story';
  };
  facebook?: {
    postType: 'post' | 'reel';
  };
  youtube?: {
    visibility: 'public' | 'private' | 'unlisted';
  };
}

export interface SocialCommandIntent {
  action: 'POST' | 'SCHEDULE' | 'ANALYZE';
  platforms: string[];
  title?: string;
  content?: string;
  options?: PlatformOptions;
  scheduleDate?: string;
}

export interface SocialPost {
  id: string;
  title?: string;
  content: string;
  imageUrl?: string;
  scheduledTime: string;
  status: PostStatus;
  platforms: string[];
  options?: PlatformOptions;
}

export interface AnalyticsData {
  date: string;
  impressions: number;
  engagement: number;
  clicks: number;
}

export interface KeyStats {
  successCount: number;
  failCount: number;
  lastUsed: string | null;
  isExhausted: boolean;
}
