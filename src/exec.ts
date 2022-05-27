import { execSync } from 'child_process';
import { green, red, yellow } from 'colors/safe';
import { stat } from 'fs/promises';
import { join } from 'smake';
// import { CommonGroups } from './CommonGroups';
import { CommonTargets } from './commonTargets';
import { isInstalled } from './isInstalled';

export async function exec(args: string[], opt: any) {
  if (!opt.target) {
    console.log('`target` has to be specified.');
    return;
  }

  if (!args.length) {
    console.log('empty command.');
    return;
  }

  const targets: { [k: string]: string } = {};
  for (const k of Object.keys(CommonTargets)) {
    targets[k] = '';
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

  const entries = Object.entries(targets);
  const installed = entries.filter(e => e[1]).map(e => e[0]);
  if (installed.includes(opt.target)) {
    let env;
    if (opt.target.include('windows-msvc')) {

    } else if (opt.target.include('apple')) {

    } else {

    }
    execSync(args.join(' '), { env, stdio: 'inherit' });
  } else {
    if (entries.map(e => e[0]).includes(opt.target)) {
      console.log(`${yellow(opt.target)} not installed.`);
    } else {
      console.log(`unknown target: ${red(opt.target)}`);
    }
  }
}

function generateEnv(target: string) {
  if (target.includes('windows-msvc')) {

  } else if (target.includes('apple')) {

  } else {
    const CC = `${process.env.SMAKE_LLVM_PREFIX}clang`;
    const CXX = `${process.env.SMAKE_LLVM_PREFIX}clang++`;
    const AR = `${process.env.SMAKE_LLVM_PREFIX}llvm-ar`;
    const LD = `${process.env.SMAKE_LLVM_PREFIX}clang++`;
    const NM = `${process.env.SMAKE_LLVM_PREFIX}llvm-nm`;
    const OBJDUMP = `${process.env.SMAKE_LLVM_PREFIX}llvm-objdump`;
    const RANLIB = `${process.env.SMAKE_LLVM_PREFIX}llvm-ranlib`;
    const CPPFLAGS = ''
    return {
      CC, CXX, AR, LD, NM, OBJDUMP, RANLIB
    }
  }
}
