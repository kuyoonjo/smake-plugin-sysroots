export const CommonTargets: {
  [k: string]: string[];
} = {
  'x86_64-apple-darwin': ['x86_64-apple-darwin'],
  'arm64-apple-darwin': ['arm64-apple-darwin'],

  'i686-unknown-linux-gnu': ['i686-unknown-linux-gnu'],
  'x86_64-unknown-linux-gnu': ['x86_64-unknown-linux-gnu'],
  'aarch64-unknown-linux-gnu': ['aarch64-unknown-linux-gnu'],
  'arm-unknown-linux-gnueabihf': ['arm-unknown-linux-gnueabihf'],
  'armv7-unknown-linux-gnueabihf': ['armv7-unknown-linux-gnueabihf'],

  'i686-unknown-linux-musl': ['i686-unknown-linux-musl'],
  'x86_64-unknown-linux-musl': ['x86_64-unknown-linux-musl'],
  'aarch64-unknown-linux-musl': ['aarch64-unknown-linux-musl'],
  'arm-unknown-linux-musleabihf': ['arm-unknown-linux-musleabihf'],
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
