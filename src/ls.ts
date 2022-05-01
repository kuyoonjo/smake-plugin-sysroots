import { gray, green, yellow } from 'colors/safe';
import { CommonGroups } from './CommonGroups';
import { CommonTargets } from './commonTargets';
import { isInstalled } from './isInstalled';

export async function ls(opt: any) {
  const targets: { [k: string]: string } = {};
  for (const k of Object.keys(CommonTargets)) {
    if (opt.all) targets[k] = '';
    if (await isInstalled(k)) targets[k] = green('installed');
  }
  for (const [k, v] of Object.entries(process.env).filter((x) =>
    x[0].startsWith('SMAKE_LLVM_SYSROOT_')
  )) {
    const target = k
      .replace('SMAKE_LLVM_SYSROOT_', '')
      .toLowerCase()
      .replace(/_/g, '-')
      .replace('x86-64', 'x86_64');
    targets[target] = yellow(`installed by ENV at ${v}`);
  }

  const keys = Object.keys(targets);
  for (const g of CommonGroups) {
    const ks = keys.filter((k) => k.includes(g.keyword));
    if (ks.length) {
      console.log(g.name);
      const installed = ks.filter((k) => targets[k]);
      const uninstalled = ks.filter((k) => !targets[k]);
      for (const k of installed) {
        console.log(
          '  ' + k + '  '.padEnd(40 - k.length, '-') + '  ' + targets[k]
        );
      }
      for (const k of uninstalled) {
        console.log('  ' + gray(k.padEnd(40, ' ')));
      }
    }
  }
}
