/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
/**
 * @type {import('semantic-release').GlobalConfig}
 */
const SECTION_FEATURES = 'Features';
const SECTION_BUG_FIXES = 'Bug Fixes';
const SECTION_OTHER_CHANGES = 'Other changes';

export default {
	branches: ['devel'],
	plugins: [
		[
			'@semantic-release/commit-analyzer',
			{
				preset: 'conventionalcommits',
				releaseRules: [
					{ type: 'refactor', release: 'patch' },
					{ type: 'build', release: 'patch' }
				]
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
							section: SECTION_FEATURES,
							hidden: false
						},
						{
							type: 'fix',
							section: SECTION_BUG_FIXES,
							hidden: false
						},
						{
							type: 'refactor',
							section: SECTION_OTHER_CHANGES,
							hidden: false
						},
						{
							type: 'perf',
							section: SECTION_OTHER_CHANGES,
							hidden: false
						},
						{
							type: 'build',
							section: SECTION_OTHER_CHANGES,
							hidden: false
						},
						{
							type: 'ci',
							section: SECTION_OTHER_CHANGES,
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
