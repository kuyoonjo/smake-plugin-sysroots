import axios from 'axios';
import { createWriteStream } from 'fs';

export async function downloadFile(
  url: string,
  savePath: string,
  onProgress?: (progress: number) => void
) {
  const { data, headers } = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
    timeout: 5000,
  });

  await new Promise((r, rr) => {
    const contentLength = headers['content-length'];
    let savedLength = 0;

    data.on('data', (chunk: Buffer) => {
      savedLength += chunk.length;
      onProgress && onProgress(Math.floor((savedLength / contentLength) * 100));
    });

    data.on('error', rr);
    data.on('end', r);
    data.pipe(createWriteStream(savePath));
  });
}
