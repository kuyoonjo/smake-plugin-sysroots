import { execSync } from 'child_process';
import { green, red, yellow } from 'colors/safe';
import { stat } from 'fs/promises';
import { join } from 'smake';
// import { CommonGroups } from './CommonGroups';
import { CommonTargets } from './commonTargets';
import { isInstalled } from './isInstalled';
import { sysrootsDir } from './sysrootsDir';

export async function exec(opt: any, command: string) {
  if (!opt.target) {
    console.log('`target` has to be specified.');
    return;
  }

  if (!command.length) {
    console.log('empty command.');
    return;
  }

  if (opt.target.includes('apple') || opt.target.includes('macos')) {
    execSync(command, { env: process.env, stdio: 'inherit' });
    return;
  }

  const targets: { [k: string]: string } = {};
  const paths: { [k: string]: string } = {};
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
    paths[target] = v!;
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
  const installed = entries.filter((e) => e[1]).map((e) => e[0]);
  if (installed.includes(opt.target)) {
    const env = generateEnv(paths, opt.target);
    execSync(command, { env: { ...process.env, ...env }, stdio: 'inherit' });
  } else {
    if (entries.map((e) => e[0]).includes(opt.target)) {
      console.log(`${yellow(opt.target)} not installed.`);
    } else {
      console.log(`unknown target: ${red(opt.target)}`);
    }
  }
}

function generateEnv(paths: any, target: string) {
  if (target.includes('windows-msvc')) {
    let MSVC_VERSION = process.env.SMAKE_LLVM_MSVC_VERSION;
    let MSVC_PATH = process.env.SMAKE_LLVM_MSVC_PATH;
    let WINDOWS_KITS_10_PATH = process.env.SMAKE_LLVM_WINDOWS_KITS_10_PATH;
    let WINDOWS_KITS_10_VERSION =
      process.env.SMAKE_LLVM_WINDOWS_KITS_10_VERSION;

    if (!MSVC_PATH) {
      const info = require(join(sysrootsDir, 'msvc', 'info.json'));
      MSVC_VERSION = info._MSC_VER;
      MSVC_PATH = join(sysrootsDir, 'msvc', 'vc');
      WINDOWS_KITS_10_PATH = join(sysrootsDir, 'msvc', 'kits');
      WINDOWS_KITS_10_VERSION = info.win_kits_ver;
    }

    const cxflags = [
      '-Qunused-arguments',
      `-fmsc-version=${MSVC_VERSION}`,
      '-fms-extensions',
      '-fms-compatibility',
      '-fdelayed-template-parsing',
      '-DWIN32',
      '-D_WINDOWS',
      '-D_CRT_SECURE_NO_WARNINGS',
    ];

    const includes = [
      `${MSVC_PATH}/include`,
      `${MSVC_PATH}/atlmfc/include`,
      `${WINDOWS_KITS_10_PATH}/include/${WINDOWS_KITS_10_VERSION}/ucrt`,
      `${WINDOWS_KITS_10_PATH}/include/${WINDOWS_KITS_10_VERSION}/um`,
      `${WINDOWS_KITS_10_PATH}/include/${WINDOWS_KITS_10_VERSION}/shared`,
      `${WINDOWS_KITS_10_PATH}/include/${WINDOWS_KITS_10_VERSION}/winrt`,
      `${WINDOWS_KITS_10_PATH}/include/${WINDOWS_KITS_10_VERSION}/cppwinrt`,
    ];

    const dir = (() => {
      const arch = target.split('-')[0];
      if (arch.endsWith('86')) return 'x86';
      if (arch.endsWith('_64')) return 'x64';
      if (/a.+64/.test(arch)) return 'arm64';
      if (arch.startsWith('arm')) return 'arm';
      return 'unknown-arch';
    })();

    const linkdirs = [
      `${MSVC_PATH}/lib/${dir}`,
      `${MSVC_PATH}/atlmfc/lib/${dir}`,
      `${WINDOWS_KITS_10_PATH}/lib/${WINDOWS_KITS_10_VERSION}/ucrt/${dir}`,
      `${WINDOWS_KITS_10_PATH}/lib/${WINDOWS_KITS_10_VERSION}/um/${dir}`,
    ];

    const llvmPrefix = process.env.SMAKE_LLVM_PREFIX || '';

    const CC = `${llvmPrefix}clang`;
    const CXX = `${llvmPrefix}clang++`;
    const AR = `${llvmPrefix}llvm-lib`;
    const LD = `${llvmPrefix}clang++`;
    const NM = `${llvmPrefix}llvm-nm`;
    const OBJDUMP = `${llvmPrefix}llvm-objdump`;
    const RANLIB = `${llvmPrefix}llvm-ranlib`;
    const CPPFLAGS = `-Wnonportable-include-path -target ${target} ${includes
      .map((x) => '-I' + x)
      .join(' ')} ${cxflags.join(' ')}`;
    const LDFLAGS = `-fuse-ld=lld ${linkdirs.map((x) => '-L' + x).join(' ')}`;
    const LL = `${llvmPrefix}lld-link`;
    const RUSTFLAGS = `-Clinker=${LL} ${linkdirs
      .map((x) => '-Clink-arg=/LIBPATH:' + x)
      .join(' ')}`;
    const env: any = {
      TARGET: target,
      CC,
      CXX,
      AR,
      LD,
      NM,
      OBJDUMP,
      RANLIB,
      CFLAGS: CPPFLAGS,
      CXXFLAGS: CPPFLAGS,
      LDFLAGS,
      RUSTFLAGS,
    };
    return env;
  } else if (target.includes('apple')) {
    return {};
  } else {
    const llvmPrefix = process.env.SMAKE_LLVM_PREFIX || '';

    let SYSROOTS = paths[target] as string;
    if (process.platform === 'win32')
      SYSROOTS = SYSROOTS.replace(/\\/g, '/');
    const CC = `${llvmPrefix}clang`;
    const CXX = `${llvmPrefix}clang++`;
    const AR = `${llvmPrefix}llvm-ar`;
    const LD = `${llvmPrefix}clang++`;
    const NM = `${llvmPrefix}llvm-nm`;
    const OBJDUMP = `${llvmPrefix}llvm-objdump`;
    const RANLIB = `${llvmPrefix}llvm-ranlib`;
    const CPPFLAGS = `-target ${target} --sysroot=${SYSROOTS}`;
    const LDFLAGS = '-fuse-ld=lld -Wl,--no-undefined -Wl,--as-needed';
    const RUSTFLAGS = `-Clinker=${CC} -Ctarget-feature=+crt-static -Clink-arg=-target -Clink-arg=${target} -Clink-arg=--sysroot=${join(
      sysrootsDir,
      target
    )} -Clink-arg=-fuse-ld=lld -Clink-arg=-Wl,--no-undefined -Clink-arg=-Wl,--as-needed`;
    const env: any = {
      TARGET: target,
      SYSROOTS,
      CC,
      CXX,
      AR,
      LD,
      NM,
      OBJDUMP,
      RANLIB,
      CFLAGS: CPPFLAGS,
      CXXFLAGS: CPPFLAGS,
      LDFLAGS,
      RUSTFLAGS,
    };
    // env[`CC_${target}`] = [CC, CPPFLAGS].join(' ');
    // env[`CXX_${target}`] = [CXX, CPPFLAGS].join(' ');
    // env[`AR_${target}`] = AR;
    return env;
  }
}
