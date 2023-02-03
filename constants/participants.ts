/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
export const ParticipantRole = {
	FROM: 'f',
	TO: 't',
	CARBON_COPY: 'c',
	BLIND_CARBON_COPY: 'b',
	REPLY_TO: 'r',
	SENDER: 's',
	READ_RECEIPT_NOTIFICATION: 'n',
	RESENT_FROM: 'rf'
} as const;

export type ParticipantRoleType = typeof ParticipantRole[keyof typeof ParticipantRole];
