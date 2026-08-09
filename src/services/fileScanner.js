const PLAYBACK_KEY = 'mido_tv_playback_history';
const CACHE_KEY = 'mido_tv_folder_cache';

export async function fetchDirectory(path = 'D:\\Film') {
  try {
    const res = await fetch(`/api/files?path=${encodeURIComponent(path)}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    
    // Save to light cache in localStorage
    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      cache[path] = data;
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
      // Ignore quota errors
    }

    return data;
  } catch (err) {
    console.warn('Failed to fetch filesystem directly, loading from local cache:', err);
    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      if (cache[path]) return cache[path];
    } catch (e) {}
    
    // Default fallback return structure
    return {
      path,
      isRoot: path === 'D:\\Film',
      parentPath: path === 'D:\\Film' ? null : 'D:\\Film',
      items: []
    };
  }
}

export function getPlaybackHistory() {
  try {
    return JSON.parse(localStorage.getItem(PLAYBACK_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

export function getPlaybackProgress(filePath) {
  if (!filePath) return null;
  const history = getPlaybackHistory();
  return history[filePath] || null;
}

export function savePlaybackProgress(filePath, timestamp, duration) {
  if (!filePath) return;
  try {
    const history = getPlaybackHistory();
    history[filePath] = {
      timestamp: Math.max(0, Math.floor(timestamp)),
      duration: Math.max(0, Math.floor(duration)),
      updatedAt: Date.now()
    };
    localStorage.setItem(PLAYBACK_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Error saving progress:', e);
  }
}
