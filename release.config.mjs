/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: [
    'release',
    {
      name: 'devel',
      prerelease: true
    }
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits'
      }
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          // see https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.2.0/README.md#types
          types: [
            {
              type: 'feat',
              section: 'Features',
              hidden: false
            },
            {
              type: 'fix',
              section: 'Bug Fixes',
              hidden: false
            },
            {
              type: 'refactor',
              section: 'Other changes',
              hidden: false
            },
            {
              type: 'perf',
              section: 'Other changes',
              hidden: false
            },
            {
              type: 'build',
              section: 'Other changes',
              hidden: false
            },
            {
              type: 'ci',
              section: 'Other changes',
              hidden: false
            }
          ]
        }
      }
    ],
    '@semantic-release/npm',
    '@semantic-release/github'
  ]
};