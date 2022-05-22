export const CommonTargets: {
  [k: string]: string[];
} = {
  'x86_64-apple-darwin': ['x86_64-apple-darwin'],
  'arm64-apple-darwin': ['arm64-apple-darwin'],

  'aarch64-ubuntu14.04-linux-gnu': ['aarch64-ubuntu14.04-linux-gnu'],
  'armv7-ubuntu14.04-linux-gnueabihf': ['armv7-ubuntu14.04-linux-gnueabihf'],
  'i386-ubuntu14.04-linux-gnu': ['i386-ubuntu14.04-linux-gnu'],
  'powerpc64le-ubuntu14.04-linux-gnu': ['powerpc64le-ubuntu14.04-linux-gnu'],
  'x86_64-ubuntu14.04-linux-gnu': ['x86_64-ubuntu14.04-linux-gnu'],

  'aarch64-ubuntu20.04-linux-gnu': ['aarch64-ubuntu20.04-linux-gnu'],
  'armv7-ubuntu20.04-linux-gnueabihf': ['armv7-ubuntu20.04-linux-gnueabihf'],
  'powerpc64le-ubuntu20.04-linux-gnu': ['powerpc64le-ubuntu20.04-linux-gnu'],
  'riscv64-ubuntu20.04-linux-gnu': ['riscv64-ubuntu20.04-linux-gnu'],
  's390x-ubuntu20.04-linux-gnu': ['s390x-ubuntu20.04-linux-gnu'],
  'x86_64-ubuntu20.04-linux-gnu': ['x86_64-ubuntu20.04-linux-gnu'],

  'aarch64-smake-linux-gnu': ['aarch64-smake-linux-gnu'],
  'armv7-smake-linux-gnueabihf': ['armv7-smake-linux-gnueabihf'],
  'i686-smake-linux-gnu': ['i686-smake-linux-gnu'],
  'powerpc-smake-linux-gnu': ['powerpc-smake-linux-gnu'],
  'x86_64-smake-linux-gnu': ['x86_64-smake-linux-gnu'],

  's390x-alpine-linux-musl': ['s390x-alpine-linux-musl'],
  'riscv64-alpine-linux-musl': ['riscv64-alpine-linux-musl'],
  'powerpc64le-alpine-linux-musl': ['powerpc64le-alpine-linux-musl'],
  'i386-alpine-linux-musl': ['i386-alpine-linux-musl'],
  'aarch64-alpine-linux-musl': ['aarch64-alpine-linux-musl'],
  'armv7-alpine-linux-musleabihf': ['armv7-alpine-linux-musleabihf'],
  'armv6-alpine-linux-musleabihf': ['armv6-alpine-linux-musleabihf'],
  'x86_64-alpine-linux-musl': ['x86_64-alpine-linux-musl'],

  'i686-unknown-linux-gnu': ['i686-unknown-linux-gnu'],
  'x86_64-unknown-linux-gnu': ['x86_64-unknown-linux-gnu'],
  'aarch64-unknown-linux-gnu': ['aarch64-unknown-linux-gnu'],
  'arm-unknown-linux-gnueabi': ['arm-unknown-linux-gnueabi'],
  'arm-unknown-linux-gnueabihf': ['arm-unknown-linux-gnueabihf'],
  'armv7-unknown-linux-gnueabihf': ['armv7-unknown-linux-gnueabihf'],

  'i686-unknown-linux-musl': ['i686-unknown-linux-musl'],
  'x86_64-unknown-linux-musl': ['x86_64-unknown-linux-musl'],
  'aarch64-unknown-linux-musl': ['aarch64-unknown-linux-musl'],
  'armv7-unknown-linux-musleabihf': ['armv7-unknown-linux-musleabihf'],

  'x86_64-pc-windows-msvc': ['msvc-headers', 'msvc-lib-x64'],
  'i686-pc-windows-msvc': ['msvc-headers', 'msvc-lib-x86'],
  'aarch64-pc-windows-msvc': ['msvc-headers', 'msvc-lib-arm64'],
  'arm-pc-windows-msvc': ['msvc-headers', 'msvc-lib-arm'],

  'wasm32-unknown-wasi': ['wasi'],
  'wasm64-unknown-wasi': ['wasi'],

  'armv7a-linux-androideabi': ['ndk'],
  'aarch64-linux-android': ['ndk'],
  'i686-linux-android': ['ndk'],
  'x86_64-linux-android': ['ndk'],
};
