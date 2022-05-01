import { stat } from 'fs/promises';
import { join } from '../join';
import { CommonTargets } from './commonTargets';
import { sysrootsDir } from './sysrootsDir';

export async function isInstalled(target: string) {
  const items = CommonTargets[target];
  try {
    await Promise.all(
      items.map(async (t) => {
        const st = await stat(join(sysrootsDir, t));
        if (!st.isDirectory()) throw '';
      })
    );
    return true;
  } catch {
    return false;
  }
}
