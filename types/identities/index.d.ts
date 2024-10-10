/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/**
 * The type of the identities:
 * - primary: the identity is the primary identity of the account
 * - alias: the identity is an alias of the primary account
 * - delegation: the identity is a shared account for which the user is a delegate
 */
type IdentityType = 'primary' | 'alias' | 'delegation';

/**
 * The type describe the identity, its type and the addresses used
 */
export type IdentityDescriptor = {
	id: string;
	ownerAccount: string;
	identityName: string;
	identityDisplayName: string;
	fromDisplay: string | undefined;
	receivingAddress: string;
	fromAddress: string;
	type: IdentityType;
	right?: string;
	defaultSignatureId?: string;
	forwardReplySignatureId?: string;
};

/**
 * The type describe all the available addresses for an account
 */
type AvailableAddress = {
	address: string;
	type: IdentityType;
	right?: string;
	ownerAccount: string;
};
