import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function tvFilesystemPlugin() {
  const DEFAULT_ROOT = 'D:\\Film';
  const CACHE_FILE_NAME = '.mido_cache.json';
  const VIDEO_EXTS = new Set(['.mp4', '.mkv', '.avi', '.mov', '.webm', '.m4v', '.ts', '.flv', '.wmv']);
  const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

  // Helper to find cover image in directory
  function findCoverImage(dirPath) {
    try {
      if (!fs.existsSync(dirPath)) return null;
      const files = fs.readdirSync(dirPath);

      // 1. Explicit folder covers
      const explicitCovers = ['cover.jpg', 'poster.jpg', 'folder.png', 'cover.png', 'poster.png', 'folder.jpg'];
      for (const name of explicitCovers) {
        const found = files.find(f => f.toLowerCase() === name);
        if (found) return path.join(dirPath, found);
      }

      // 2. First image inside directory
      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (IMAGE_EXTS.has(ext)) {
          return path.join(dirPath, file);
        }
      }
    } catch (e) {
      console.error('Error scanning cover:', e);
    }
    return null;
  }

  // Fallback demo data if D:\Film doesn't exist or is empty
  const mockRoot = [
    { name: 'Action Movies', isDirectory: true, path: 'D:\\Film\\Action Movies', coverUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80', type: 'folder' },
    { name: 'Comedy Series', isDirectory: true, path: 'D:\\Film\\Comedy Series', coverUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80', type: 'folder' },
    { name: 'Cartoons & Kids', isDirectory: true, path: 'D:\\Film\\Cartoons & Kids', coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80', type: 'folder' },
    { name: 'Documentaries', isDirectory: true, path: 'D:\\Film\\Documentaries', coverUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80', type: 'folder' },
    { name: 'Family Memories', isDirectory: true, path: 'D:\\Film\\Family Memories', coverUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=80', type: 'folder' },
    { name: 'Music Videos', isDirectory: true, path: 'D:\\Film\\Music Videos', coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80', type: 'folder' },
    { name: 'Sci-Fi Collection', isDirectory: true, path: 'D:\\Film\\Sci-Fi Collection', coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80', type: 'folder' },
    { name: 'Anime', isDirectory: true, path: 'D:\\Film\\Anime', coverUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80', type: 'folder' },
    { name: 'Workout Guide (Single Video)', isDirectory: false, isSingleVideoFolder: true, singleVideoPath: 'D:\\Film\\Workout Guide\\Workout.mp4', path: 'D:\\Film\\Workout Guide', coverUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80', type: 'video', year: '2024', duration: '45m' },
    { name: 'Top Rated Classics', isDirectory: true, path: 'D:\\Film\\Top Rated Classics', coverUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80', type: 'folder' },
    { name: '4K Ultra Collection', isDirectory: true, path: 'D:\\Film\\4K Ultra Collection', coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80', type: 'folder' },
    { name: 'Sample Cinema Trailer', isDirectory: false, path: 'D:\\Film\\Sample Cinema Trailer.mp4', coverUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80', type: 'video', year: '2024', duration: '2m 30s' }
  ];

  const mockSubfolders = {
    'D:\\Film\\Action Movies': [
      { name: 'Sci-Fi Action', isDirectory: true, path: 'D:\\Film\\Action Movies\\Sci-Fi Action', coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80', type: 'folder' },
      { name: 'Superhero Hits', isDirectory: true, path: 'D:\\Film\\Action Movies\\Superhero Hits', coverUrl: 'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?w=800&auto=format&fit=crop&q=80', type: 'folder' },
      { name: 'Ignition Point', isDirectory: false, path: 'D:\\Film\\Action Movies\\Ignition Point.mp4', coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80', type: 'video', year: '2023', duration: '2h 15m' },
      { name: 'Cybernetic Runner', isDirectory: false, path: 'D:\\Film\\Action Movies\\Cybernetic Runner.mkv', coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80', type: 'video', year: '2021', duration: '1h 58m' },
      { name: 'Desert Storm', isDirectory: false, path: 'D:\\Film\\Action Movies\\Desert Storm.mp4', coverUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80', type: 'video', year: '2019', duration: '2h 30m' },
      { name: 'Midnight Heist', isDirectory: false, path: 'D:\\Film\\Action Movies\\Midnight Heist.mp4', coverUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&auto=format&fit=crop&q=80', type: 'video', year: '2022', duration: '1h 45m' },
      { name: 'The Last Train', isDirectory: false, path: 'D:\\Film\\Action Movies\\The Last Train.mp4', coverUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&auto=format&fit=crop&q=80', type: 'video', year: '2020', duration: '2h 05m' },
      { name: 'Urban Warfare', isDirectory: false, path: 'D:\\Film\\Action Movies\\Urban Warfare.mp4', coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80', type: 'video', year: '2018', duration: '2h 10m' },
      { name: 'The Final Stand', isDirectory: false, path: 'D:\\Film\\Action Movies\\The Final Stand.mp4', coverUrl: 'https://images.unsplash.com/photo-1519074069444-1ba4eae287b6?w=800&auto=format&fit=crop&q=80', type: 'video', year: '2024', duration: '2h 45m' },
      { name: 'Overdrive 2', isDirectory: false, path: 'D:\\Film\\Action Movies\\Overdrive 2.mp4', coverUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80', type: 'video', year: '2023', duration: '1h 50m' }
    ]
  };

  // Sample royalty-free test video for fallback streaming
  const SAMPLE_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  function attachApiMiddlewares(server) {
    // 1. Filesystem scan endpoint
    server.middlewares.use('/api/files', (req, res) => {
      const urlObj = new URL(req.url, `http://${req.headers.host}`);
      let targetPath = urlObj.searchParams.get('path') || DEFAULT_ROOT;

      // Clean trailing slash
      targetPath = path.normalize(targetPath);

      // Check if path exists on disk
      if (fs.existsSync(targetPath)) {
        try {
          const stats = fs.statSync(targetPath);
          if (!stats.isDirectory()) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Path is not a directory' }));
          }

          const entries = fs.readdirSync(targetPath);
          const items = [];

          for (const entry of entries) {
            if (entry.startsWith('.')) continue; // skip hidden files

            const fullPath = path.join(targetPath, entry);
            try {
              const entryStat = fs.statSync(fullPath);

              if (entryStat.isDirectory()) {
                const coverImg = findCoverImage(fullPath);
                
                // Check if folder contains ONLY 1 video file and 0 subdirectories
                let singleVideoInfo = null;
                try {
                  const subEntries = fs.readdirSync(fullPath);
                  const vFiles = [];
                  let dCount = 0;
                  for (const sf of subEntries) {
                    if (sf.startsWith('.')) continue;
                    const sfp = path.join(fullPath, sf);
                    const sfStat = fs.statSync(sfp);
                    if (sfStat.isDirectory()) dCount++;
                    else if (sfStat.isFile() && VIDEO_EXTS.has(path.extname(sf).toLowerCase())) {
                      vFiles.push({ name: sf, path: sfp });
                    }
                  }
                  if (dCount === 0 && vFiles.length === 1) {
                    singleVideoInfo = vFiles[0];
                  }
                } catch (e) {}

                items.push({
                  name: entry,
                  isDirectory: !singleVideoInfo,
                  path: fullPath,
                  type: singleVideoInfo ? 'video' : 'folder',
                  isSingleVideoFolder: !!singleVideoInfo,
                  singleVideoPath: singleVideoInfo ? singleVideoInfo.path : null,
                  coverUrl: coverImg ? `/api/cover?path=${encodeURIComponent(coverImg)}` : null
                });
              } else if (entryStat.isFile()) {
                const ext = path.extname(entry).toLowerCase();
                if (VIDEO_EXTS.has(ext)) {
                  const cleanName = path.basename(entry, ext);
                  const yearMatch = entry.match(/\b(19\d\d|20\d\d)\b/);
                  const year = yearMatch ? yearMatch[1] : '';

                  let sidecarCover = findCoverImage(targetPath);

                  items.push({
                    name: cleanName,
                    isDirectory: false,
                    path: fullPath,
                    type: 'video',
                    year: year || 'HD',
                    duration: 'Video',
                    coverUrl: sidecarCover ? `/api/cover?path=${encodeURIComponent(sidecarCover)}` : null
                  });
                }
              }
            } catch (err) {
              // Ignore single unreadable entry
            }
          }

          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({
            path: targetPath,
            isRoot: targetPath.toLowerCase() === DEFAULT_ROOT.toLowerCase(),
            parentPath: path.dirname(targetPath),
            items
          }));
        } catch (e) {
          console.error('Error reading dir:', e);
        }
      }

      // Fallback mock handling if D:\Film does not exist locally
      let items = mockRoot;
      let isRoot = true;

      if (targetPath !== DEFAULT_ROOT && mockSubfolders[targetPath]) {
        items = mockSubfolders[targetPath];
        isRoot = false;
      } else if (targetPath !== DEFAULT_ROOT) {
        // Synthetic subfolder generator
        items = Array.from({ length: 12 }, (_, i) => ({
          name: `Media Item ${i + 1}.mp4`,
          isDirectory: false,
          path: `${targetPath}\\Media Item ${i + 1}.mp4`,
          type: 'video',
          year: `${2020 + (i % 4)}`,
          duration: `1h ${30 + i * 5}m`,
          coverUrl: `https://picsum.photos/seed/${encodeURIComponent(targetPath + i)}/600/337`
        }));
        isRoot = false;
      }

      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({
        path: targetPath,
        isRoot: isRoot,
        parentPath: isRoot ? null : path.dirname(targetPath),
        items
      }));
    });

    // 2. Cover Image endpoint
    server.middlewares.use('/api/cover', (req, res) => {
      const urlObj = new URL(req.url, `http://${req.headers.host}`);
      const imgPath = urlObj.searchParams.get('path');

      if (imgPath && fs.existsSync(imgPath)) {
        const ext = path.extname(imgPath).toLowerCase();
        const mimeTypes = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.webp': 'image/webp',
          '.gif': 'image/gif'
        };
        res.setHeader('Content-Type', mimeTypes[ext] || 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return fs.createReadStream(imgPath).pipe(res);
      }

      res.statusCode = 404;
      res.end('Cover not found');
    });

    // 3. Video Streaming endpoint with proper HTTP Byte Range support
    server.middlewares.use('/api/stream', (req, res) => {
      const urlObj = new URL(req.url, `http://${req.headers.host}`);
      const videoPath = urlObj.searchParams.get('path');

      if (videoPath && fs.existsSync(videoPath)) {
        try {
          const stat = fs.statSync(videoPath);
          if (!stat.isFile()) {
            res.statusCode = 404;
            return res.end('Not a file');
          }

          const fileSize = stat.size;
          const ext = path.extname(videoPath).toLowerCase();
          const mimeTypes = {
            '.mp4': 'video/mp4',
            '.m4v': 'video/mp4',
            '.mkv': 'video/x-matroska',
            '.webm': 'video/webm',
            '.mov': 'video/quicktime',
            '.ts': 'video/mp2t',
            '.avi': 'video/x-msvideo',
            '.flv': 'video/x-flv',
            '.wmv': 'video/x-ms-wmv',
            '.ogv': 'video/ogg'
          };
          const contentType = mimeTypes[ext] || 'video/mp4';
          const range = req.headers.range;

          if (range) {
            const parts = range.replace(/bytes=/, "").trim().split("-");
            let start = parseInt(parts[0], 10);
            let end = parts[1] && parts[1].trim() !== "" ? parseInt(parts[1], 10) : fileSize - 1;

            if (isNaN(start)) {
              const suffix = parseInt(parts[1], 10);
              if (!isNaN(suffix) && suffix > 0) {
                start = Math.max(0, fileSize - suffix);
                end = fileSize - 1;
              } else {
                start = 0;
              }
            }

            if (isNaN(end) || end >= fileSize) {
              end = fileSize - 1;
            }

            // Return 416 Range Not Satisfiable if requested range is out of bounds
            if (start >= fileSize || start < 0 || start > end) {
              res.writeHead(416, {
                'Content-Range': `bytes */${fileSize}`,
                'Accept-Ranges': 'bytes'
              });
              return res.end();
            }

            const chunksize = (end - start) + 1;
            const head = {
              'Content-Range': `bytes ${start}-${end}/${fileSize}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': chunksize,
              'Content-Type': contentType,
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Connection': 'keep-alive',
            };

            if (req.method === 'HEAD') {
              res.writeHead(206, head);
              return res.end();
            }

            const file = fs.createReadStream(videoPath, { start, end });
            file.on('error', (err) => {
              if (!res.headersSent) {
                res.statusCode = 500;
              }
              res.end();
            });

            res.on('close', () => {
              file.destroy();
            });

            res.writeHead(206, head);
            file.pipe(res);
            return;
          } else {
            const head = {
              'Content-Length': fileSize,
              'Content-Type': contentType,
              'Accept-Ranges': 'bytes',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Connection': 'keep-alive',
            };

            if (req.method === 'HEAD') {
              res.writeHead(200, head);
              return res.end();
            }

            const file = fs.createReadStream(videoPath);
            file.on('error', () => {
              if (!res.headersSent) {
                res.statusCode = 500;
              }
              res.end();
            });

            res.on('close', () => {
              file.destroy();
            });

            res.writeHead(200, head);
            file.pipe(res);
            return;
          }
        } catch (e) {
          console.error('Error streaming video:', e);
          res.statusCode = 500;
          return res.end('Streaming error');
        }
      }

      // Redirect to sample video stream if local file path doesn't exist
      res.writeHead(302, { Location: SAMPLE_VIDEO_URL });
      res.end();
    });

    // 4. Server Time endpoint (accurate server clock sync for TV clients)
    server.middlewares.use('/api/time', (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');

      if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        return res.end();
      }

      const now = new Date();
      let timeZone = 'UTC';
      try {
        timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      } catch (e) {}

      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const h12 = hours % 12 || 12;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const mStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const hStr24 = hours < 10 ? `0${hours}` : `${hours}`;
      const sStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

      const payload = JSON.stringify({
        serverTime: now.getTime(),
        timezoneOffset: now.getTimezoneOffset(), // difference in minutes: UTC - local
        timeZone: timeZone,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        formatted12: `${h12}:${mStr} ${ampm}`,
        formatted12WithSec: `${h12}:${mStr}:${sStr} ${ampm}`,
        formatted24: `${hStr24}:${mStr}`,
        formatted24WithSec: `${hStr24}:${mStr}:${sStr}`,
        iso: now.toISOString()
      });

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.end(payload);
    });
  }

  return {
    name: 'tv-filesystem-plugin',
    transformIndexHtml(html) {
      const now = new Date();
      let timeZone = 'UTC';
      try {
        timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      } catch (e) {}

      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const h12 = hours % 12 || 12;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const mStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const hStr24 = hours < 10 ? `0${hours}` : `${hours}`;
      const sStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

      const payload = JSON.stringify({
        serverTime: now.getTime(),
        timezoneOffset: now.getTimezoneOffset(),
        timeZone: timeZone,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        formatted12: `${h12}:${mStr} ${ampm}`,
        formatted12WithSec: `${h12}:${mStr}:${sStr} ${ampm}`,
        formatted24: `${hStr24}:${mStr}`,
        formatted24WithSec: `${hStr24}:${mStr}:${sStr}`,
        iso: now.toISOString()
      });

      const script = `<script id="__SERVER_TIME_INIT__">window.__INITIAL_SERVER_TIME__ = ${payload};</script>`;
      return html.replace('</head>', `${script}\n</head>`);
    },
    configureServer(server) {
      attachApiMiddlewares(server);
    },
    configurePreviewServer(server) {
      attachApiMiddlewares(server);
    }
  };
}

export default defineConfig({
  plugins: [react(), tvFilesystemPlugin()],
  server: {
    port: 3000,
    host: true
  }
});
