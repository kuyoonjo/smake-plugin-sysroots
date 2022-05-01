import { Command } from 'commander';
import { install } from './install';
import { ls } from './ls';
import { uninstall } from './uninstall';

function command(program: Command) {
  const sysroots = program.command('sysroots').description('manage sysroots');
  sysroots
    .command('ls')
    .description('list sysroots')
    .option('-a, --all', 'display all sysroots')
    .action((opt) => {
      ls(opt);
    });
  sysroots
    .command('install [sysroots...]')
    .description('install sysroots')
    .option(
      '-d, --direct',
      'download resource from github release without built-in proxy'
    )
    .option('-f, --force', 'reinstall if already installed')
    .option(
      '-g, --group',
      'install by group. Awailable groups: gnu-linux, musl-linux, msvc, wasi, ndk'
    )
    .action((args, opt) => {
      install(args, opt);
    });
  sysroots
    .command('uninstall [sysroots...]')
    .description('uninstall sysroots')
    .option(
      '-g, --group',
      'uninstall by group. Awailable groups: gnu-linux, musl-linux, msvc, wasi, ndk'
    )
    .action((args, opt) => {
      uninstall(args, opt);
    });
}

export { command };
