import { Command } from 'commander';
import { CommonGroups } from './CommonGroups';
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

  const avalableGroups = CommonGroups.filter((g) => g.install)
    .map((g) => g.id)
    .join(', ');
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
      'install by group. Awailable groups: ' + avalableGroups
    )
    .action((args, opt) => {
      install(args, opt);
    });
  sysroots
    .command('uninstall [sysroots...]')
    .description('uninstall sysroots')
    .option(
      '-g, --group',
      'uninstall by group. Awailable groups: ' + avalableGroups
    )
    .action((args, opt) => {
      uninstall(args, opt);
    });
}

export { command };
