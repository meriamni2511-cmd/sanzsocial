
import { PlatformOptions, KeyStats } from '../types';
import { decryptKey } from './cryptoService';

export interface AyrsharePostResponse {
  status: string;
  post: string;
  id: string;
  postIds: { platform: string; status: string; postId: string }[];
  errors?: any[];
}

/**
 * Checks the health of an Ayrshare API key by hitting the /user endpoint.
 */
export const checkAyrshareHealth = async (apiKey: string): Promise<boolean> => {
  if (!apiKey) return false;
  try {
    const response = await fetch('https://app.ayrshare.com/api/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    return response.ok;
  } catch (error) {
    console.error("Health check failed:", error);
    return false;
  }
};

const updateKeyStats = (id: string, success: boolean) => {
  const statsStr = localStorage.getItem(`ayrshare_stats_${id}`);
  let stats: KeyStats = statsStr ? JSON.parse(statsStr) : {
    successCount: 0,
    failCount: 0,
    lastUsed: null,
    isExhausted: false
  };

  if (success) {
    stats.successCount += 1;
    stats.isExhausted = false; // Reset exhaustion on success
  } else {
    stats.failCount += 1;
  }
  stats.lastUsed = new Date().toISOString();
  
  localStorage.setItem(`ayrshare_stats_${id}`, JSON.stringify(stats));
};

const markAsExhausted = (id: string) => {
  const statsStr = localStorage.getItem(`ayrshare_stats_${id}`);
  let stats: KeyStats = statsStr ? JSON.parse(statsStr) : {
    successCount: 0,
    failCount: 0,
    lastUsed: null,
    isExhausted: false
  };
  stats.isExhausted = true;
  localStorage.setItem(`ayrshare_stats_${id}`, JSON.stringify(stats));
};

export const publishToAyrshare = async (
  content: {
    text: string;
    title?: string;
    platforms: string[];
    media?: string | null;
    options?: PlatformOptions;
    scheduleDate?: string; // ISO 8601 format
  }
): Promise<AyrsharePostResponse> => {
  // Key Retrieval & Rotation Logic
  const k1_raw = localStorage.getItem('ayrshare_api_key_primary');
  const k2_raw = localStorage.getItem('ayrshare_api_key_failover');
  
  const k1 = k1_raw ? decryptKey(k1_raw) : null;
  const k2 = k2_raw ? decryptKey(k2_raw) : null;

  const stats1Str = localStorage.getItem('ayrshare_stats_primary');
  const stats1: KeyStats | null = stats1Str ? JSON.parse(stats1Str) : null;

  // Decide which node to start with
  // If Node 1 is exhausted but Node 2 exists, jump straight to Node 2
  let targetNode: 'primary' | 'failover' = (stats1?.isExhausted && k2) ? 'failover' : 'primary';
  let currentKey = targetNode === 'primary' ? (k1 || process.env.API_KEY) : k2;

  const attemptPublish = async (key: string, node: 'primary' | 'failover'): Promise<AyrsharePostResponse> => {
    const payload: any = {
      post: content.text,
      platforms: content.platforms,
    };

    if (content.title) payload.title = content.title;
    if (content.media) payload.mediaUrls = [content.media];
    if (content.scheduleDate) payload.scheduleDate = content.scheduleDate;

    // Platform specific mappings
    if (content.options) {
      if (content.options.instagram) {
        payload.instagramOptions = { 
          reels: content.options.instagram.postType === 'reel',
          story: content.options.instagram.postType === 'story'
        };
      }
      if (content.options.facebook) {
        payload.faceBookOptions = { reels: content.options.facebook.postType === 'reel' };
      }
      if (content.options.youtube) {
        payload.youTubeOptions = { privacy: content.options.youtube.visibility };
      }
    }

    const response = await fetch('https://app.ayrshare.com/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      // Rotation triggers: 401 (Auth), 402 (Payment/Limit), 429 (Rate Limit)
      if (node === 'primary' && k2 && (response.status === 401 || response.status === 402 || response.status === 429)) {
        console.warn(`Node Primary exhausted (Status: ${response.status}). Rotating to Node Failover...`);
        markAsExhausted('primary');
        updateKeyStats('primary', false);
        return await attemptPublish(k2, 'failover');
      }
      
      updateKeyStats(node, false);
      throw new Error(data.message || 'Transmission failed across all neural nodes.');
    }

    updateKeyStats(node, true);
    return data;
  };

  return await attemptPublish(currentKey || '', targetNode);
};
