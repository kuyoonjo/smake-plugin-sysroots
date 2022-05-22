export const CommonGroups = [
  { id: 'ubuntu14.04', name: 'Ubuntu 14.04', keyword: 'ubuntu14.04-linux-gnu' },
  { id: 'ubuntu20.04', name: 'Ubuntu 20.04', keyword: 'ubuntu20.04-linux-gnu' },
  { id: 'alpine', name: 'Alpine Musl', keyword: 'alpine-linux-musl' },
  { id: 'gnu-smake', name: 'Smake GNU', keyword: 'smake-linux-gnu' },
  { id: 'gnu-linux', name: 'GNU Linux', keyword: '^[a-z0-9_]+-linux-gnu' },
  { id: 'musl-linux', name: 'Musl Linux', keyword: '^[a-z0-9_]+-linux-musl' },
  { id: 'gnu-unknown-linux', name: 'Crosstool-NG GNU Linux', keyword: 'unknown-linux-gnu' },
  { id: 'musl-unknown-linux', name: 'Crosstool-NG Musl Linux', keyword: 'unknown-linux-musl' },
  { id: 'msvc', name: 'Windows MSVC', keyword: 'windows-msvc' },
  { id: 'wasi', name: 'WASI', keyword: 'wasi' },
  { id: 'ndk', name: 'Android NDK', keyword: 'android' },
];
