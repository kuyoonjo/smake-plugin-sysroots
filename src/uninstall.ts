import { yellow } from 'colors/safe';
import { rm } from 'fs/promises';
import { join } from '../join';
import { CommonGroups } from './CommonGroups';
import { CommonTargets } from './commonTargets';
import { isInstalled } from './isInstalled';
import { sysrootsDir } from './sysrootsDir';

export async function uninstall(
  sysroots: string[],
  opt: {
    group: boolean;
  }
) {
  if (!sysroots.length) {
    console.log('error: no targets specified (use -h for help)');
    return;
  }
  const keys = Object.keys(CommonTargets);
  const toUninstall = new Set<string>();
  if (opt.group) {
    for (const s of sysroots) {
      const group = CommonGroups.find((g) => g.id === s);
      if (!group) {
        console.log('error: sysroot group ' + yellow(s) + ' not found');
        return;
      }
      for (const s of keys.filter((k) => k.includes(group.keyword)))
        toUninstall.add(s);
    }
  } else {
    for (const s of sysroots) {
      if (!keys.includes(s)) {
        console.log('error: sysroot ' + yellow(s) + ' not found');
        return;
      }
      toUninstall.add(s);
    }
  }

  const installed = new Set<string>();

  for (const k of keys) {
    if (await isInstalled(k)) installed.add(k);
  }

  toUninstall.forEach((t) => installed.delete(t));

  const remained = new Set<string>();
  installed.forEach((t) => CommonTargets[t].forEach((s) => remained.add(s)));
  const itemsToUninstall = Array.from(toUninstall)
    .map((t) => CommonTargets[t])
    .flat()
    .filter((s) => !remained.has(s));
  await Promise.all(
    itemsToUninstall.map((t) =>
      rm(join(sysrootsDir, t), { recursive: true, force: true })
    )
  );
  console.log('done.');
}
