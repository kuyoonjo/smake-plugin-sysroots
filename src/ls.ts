import { gray, green, yellow } from 'colors/safe';
import { stat } from 'fs/promises';
import { join } from 'smake';
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

  if (process.env['SMAKE_LLVM_MSVC_PATH']) {
    const ex = async (d: string) => {
      try {
        const st = await stat(d);
        return st.isDirectory();
      } catch {
        return false;
      }
    };

    const vcDir = process.env['SMAKE_LLVM_MSVC_PATH'];
    await Promise.all(
      [
        ['x86_64-pc-windows-msvc', 'x64'],
        ['i686-pc-windows-msvc', 'x86'],
        ['aarch64-pc-windows-msvc', 'arm64'],
        ['arm-pc-windows-msvc', 'arm'],
      ].map(async (e) => {
        if (await ex(join(vcDir, 'lib', e[1])))
          targets[e[0]] = yellow(`installed by ENV at ${vcDir}`);
      })
    );
  }

  const keys = Object.keys(targets);
  for (const g of CommonGroups) {
    const ks = keys.filter((k) => new RegExp(g.keyword).test(k));
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
