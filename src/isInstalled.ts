import { stat } from 'fs/promises';
import { join } from 'smake';
import { CommonTargets } from './commonTargets';
import { sysrootsDir } from './sysrootsDir';

export async function isInstalled(target: string) {
  const items = CommonTargets[target];
  const res = await Promise.all(items.map((t) => isItemInstalled(t)));
  return !res.some((t) => !t);
}

export async function isItemInstalled(t: string) {
  let dir = '';
  if (t.includes('msvc')) {
    if (t === 'msvc-headers') {
      dir = join(sysrootsDir, 'msvc', 'vc', 'include');
    } else {
      const arch = t.split('-')[2];
      dir = join(sysrootsDir, 'msvc', 'vc', 'lib', arch);
    }
  } else {
    dir = join(sysrootsDir, t);
  }
  try {
    const st = await stat(dir);
    return st.isDirectory();
  } catch {
    return false;
  }
}
