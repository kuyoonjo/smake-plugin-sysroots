export const CommonGroups = [
  {
    id: 'ubuntu14.04',
    name: 'Ubuntu 14.04',
    keyword: 'ubuntu14.04-linux-gnu',
    install: true,
  },
  {
    id: 'ubuntu20.04',
    name: 'Ubuntu 20.04',
    keyword: 'ubuntu20.04-linux-gnu',
    install: true,
  },
  {
    id: 'alpine',
    name: 'Alpine Musl',
    keyword: 'alpine-linux-musl',
    install: true,
  },
  {
    id: 'gnu-smake',
    name: 'Smake GNU',
    keyword: 'smake-linux-gnu',
    install: true,
  },
  {
    id: 'gnu-linux',
    name: 'GNU Linux',
    keyword: '^[a-z0-9_]+-linux-gnu',
    install: false,
  },
  {
    id: 'musl-linux',
    name: 'Musl Linux',
    keyword: '^[a-z0-9_]+-linux-musl',
    install: false,
  },
  {
    id: 'gnu-unknown-linux',
    name: 'Crosstool-NG GNU Linux',
    keyword: 'unknown-linux-gnu',
    install: true,
  },
  {
    id: 'musl-unknown-linux',
    name: 'Crosstool-NG Musl Linux',
    keyword: 'unknown-linux-musl',
    install: true,
  },
  { id: 'msvc', name: 'Windows MSVC', keyword: 'windows-msvc', install: true },
  { id: 'wasi', name: 'WASI', keyword: 'wasi', install: true },
  { id: 'ndk', name: 'Android NDK', keyword: 'android', install: true },
];
