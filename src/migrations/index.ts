import * as migration_20261121_185942_initial from './20261121_185942_initial';

export const migrations = [
  {
    up: migration_20261121_185942_initial.up,
    down: migration_20261121_185942_initial.down,
    name: '20261121_185942_initial'
  },
];
