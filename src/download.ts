import { download } from 'wget-improved';

export function downloadFile(
  url: string,
  savePath: string,
  onProgress?: (progress: number) => void
) {
  return new Promise<void>((r, rr) => {
    const res = download(url, savePath);
    res.on('error', (err) => {
      rr(err);
    });
    res.on('end', () => {
      r();
    });
    res.on('progress', (progress) => {
      onProgress && onProgress(progress * 100);
    });
  });
}
