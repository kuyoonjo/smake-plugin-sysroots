import { green, red, yellow } from 'colors/safe';
import { CommonGroups } from './CommonGroups';
import { CommonTargets } from './commonTargets';
import { MultiBar } from 'cli-progress';
import { downloadFile } from './download';
import { mkdir, readFile, rm, stat, symlink } from 'fs/promises';
import { spawn } from 'child_process';
import { createHash } from 'crypto';
import { sysrootsDir } from './sysrootsDir';
import { join } from 'smake';
import { extract } from 'tar-stream';
import { dirname } from 'path';
import { createReadStream, createWriteStream } from 'fs';

const urlBase =
  'https://github.com/kuyoonjo/sysroots/releases/download/v1.0.0/';
const urlProxy = 'https://github.yu-chen.workers.dev/';
let urlPrefix: string;

const urlSuffix = '.tar.xz';

export async function install(
  sysroots: string[],
  opt: {
    direct: boolean;
    force: boolean;
    group: boolean;
  }
) {
  urlPrefix = opt.direct ? urlBase : urlProxy + urlBase;
  if (!sysroots.length) {
    console.log('error: no targets specified (use -h for help)');
    return;
  }
  const keys = Object.keys(CommonTargets);
  const toInstall = new Set<string>();
  if (opt.group) {
    for (const s of sysroots) {
      const group = CommonGroups.find((g) => g.id === s);
      if (!group) {
        console.log('error: sysroot group ' + yellow(s) + ' not found');
        return;
      }
      for (const s of keys.filter((k) => k.includes(group.keyword)))
        for (const t of CommonTargets[s]) toInstall.add(t);
    }
  } else {
    for (const s of sysroots) {
      if (!keys.includes(s)) {
        console.log('error: sysroot ' + yellow(s) + ' not found');
        return;
      }
      for (const t of CommonTargets[s]) toInstall.add(t);
    }
  }

  const multibar = new MultiBar({
    format: '[{bar}] {percentage}% | {name} | {msg}',
  });

  await Promise.all(
    Array.from(toInstall).map(async (t) => {
      const bar = multibar.create(100, 0, { name: t, msg: `installing` });
      if (!opt.force && (await isInstalled(t))) {
        bar.update(100, { msg: yellow('already installed') });
        return;
      }
      try {
        bar.update(0, { msg: 'downloading' });
        const url = makeUrl(t);
        let dist = await makeDist(t);
        let savePath = dist + urlSuffix;
        await downloadFile(url, savePath, (n) => {
          bar.update(n);
        });
        const sha256Url = url + '.sha256';
        const sha256SavePath = savePath + '.sha256';
        bar.update(100, { msg: 'sha256 checking' });
        await downloadFile(sha256Url, sha256SavePath);
        const buf = await readFile(savePath);
        const [sha256, _] = (await readFile(sha256SavePath))
          .toString()
          .trim()
          .split(/\s+/);
        const hex = createHash('sha256').update(buf).digest('hex');
        if (sha256 !== hex) throw 'sha256 checksum did NOT match';
        bar.update(0, { msg: 'decompressing' });
        await unxz(savePath);
        savePath = savePath.replace('.tar.xz', '.tar');
        bar.update(0, { msg: 'extracting' });
        await untar(savePath, dirname(savePath), (n) => {
          bar.update(n);
        });
        bar.update(100, { msg: green('installed') });
        await rm(savePath, { force: true });
        await rm(sha256SavePath, { force: true });
      } catch (e: any) {
        if (e.toString) e = e.toString();
        if (typeof e === 'string') bar.update(0, { msg: red(e) });
        else bar.update(0, { msg: red('failed') });
      }
    })
  );
  multibar.stop();
}

async function isInstalled(t: string) {
  const dir = join(sysrootsDir, t);
  try {
    const st = await stat(dir);
    return st.isDirectory();
  } catch {
    return false;
  }
}

function makeUrl(t: string) {
  return urlPrefix + t + urlSuffix;
}

async function makeDist(t: string) {
  await mkdir(sysrootsDir, { recursive: true });
  return join(sysrootsDir, t);
}

async function untar(
  input: string,
  output: string,
  onProgress?: (progress: number) => void
) {
  const st = await stat(input);
  const totalSize = st.size;
  await new Promise((r) => {
    let size = 0;
    let prefix = output + '/';
    const extractor = extract();
    extractor.on('entry', async (header, stream, next) => {
      if (header.type === 'file') {
        const dist = prefix + header.name;
        await mkdir(dirname(dist), { recursive: true });
        const ws = createWriteStream(dist);
        stream.on('end', () => {
          size += header.size || 0;
          onProgress && onProgress(Math.floor((size / totalSize) * 100));
          next();
        });
        stream.pipe(ws);
      } else if (header.type === 'symlink') {
        const dist = prefix + header.name;
        await mkdir(dirname(dist), { recursive: true });
        await rm(dist);
        symlink(header.linkname!, dist);
        stream.resume();
        next();
      } else {
        stream.resume();
        next();
      }
    });
    extractor.once('finish', r);
    const rs = createReadStream(input);
    rs.pipe(extractor);
  });
}

function unxz(input: string) {
  const p = spawn('xz', ['-df', input]);
  return new Promise<void>((r, rr) => {
    p.on('exit', (code) => {
      if (code) {
        rr(`exit code ${code}`);
      } else {
        r();
      }
    });
  });
}
