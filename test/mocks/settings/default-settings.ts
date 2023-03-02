/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { faker } from '@faker-js/faker';
import { AccountSettings, ZimletProp } from '@zextras/carbonio-shell-ui';
import { createFakeIdentity } from '../accounts/fakeAccounts';

const identity = createFakeIdentity();

export default {
	attrs: {
		zimbraDeviceLockWhenInactive: 'FALSE',
		zimbraFeatureImportFolderEnabled: 'TRUE',
		zimbraFeatureOptionsEnabled: 'TRUE',
		zimbraFeatureChatEnabled: 'FALSE',
		zimbraFeatureResetPasswordSuspensionTime: '1d',
		zimbraFeatureTasksEnabled: 'TRUE',
		zimbraFeatureOutOfOfficeReplyEnabled: 'TRUE',
		zimbraDevicePasscodeEnabled: 'FALSE',
		carbonioFeatureFilesAppEnabled: 'TRUE',
		zimbraPrefDisplayTimeInMailList: 'TRUE',
		zimbraFeatureNewAddrBookEnabled: 'TRUE',
		zimbraFeatureMailForwardingEnabled: 'FALSE',
		zimbraFeatureAddressVerificationEnabled: 'FALSE',
		zimbraFeatureVoiceChangePinEnabled: 'TRUE',
		zimbraPasswordMinAlphaChars: '0',
		zimbraMailSpamLifetime: '30d',
		zimbraWebClientSupportedHelps: [
			'onlineHelp',
			'newFeatures',
			'{ "zextrasNewFeature" : "https://community.zextras.com/zextras-suite-roadmap/" }',
			'{ "zextrasOnlineHelp" : "https://manuale.zextrascloud.it/" }',
			'productHelp'
		],
		zimbraMailForwardingAddressMaxNumAddrs: '100',
		zimbraFileUploadMaxSize: '1048576000',
		zimbraMailTrustedSenderListMaxNumEntries: '500',
		zimbraMailQuota: '0',
		zimbraFeatureZimbraAssistantEnabled: 'TRUE',
		zimbraShowClientTOS: 'FALSE',
		displayName: identity.fullName,
		zimbraFeatureGroupCalendarEnabled: 'TRUE',
		zimbraFilterBatchSize: '10000',
		zimbraSignatureMaxNumEntries: '20',
		uid: identity.userName,
		zimbraAttachmentsBlocked: 'FALSE',
		carbonioFeatureFilesEnabled: 'TRUE',
		zimbraFeatureManageSMIMECertificateEnabled: 'FALSE',
		zimbraMailDumpsterLifetime: '30d',
		zimbraDataSourceMinPollingInterval: '1m',
		zimbraCalendarKeepExceptionsOnSeriesTimeChange: 'FALSE',
		zimbraExportMaxDays: '0',
		zimbraFeatureMobileGatewayEnabled: 'FALSE',
		cn: identity.fullName,
		zimbraFileExternalShareLifetime: '90d',
		zimbraFeaturePriorityInboxEnabled: 'TRUE',
		zimbraFeatureTaggingEnabled: 'TRUE',
		zimbraFeatureBriefcaseSpreadsheetEnabled: 'TRUE',
		zimbraFeatureAddressVerificationExpiry: '1d',
		zimbraCalendarShowResourceTabs: 'TRUE',
		zimbraMailIdleSessionTimeout: '0',
		zimbraDeviceOfflineCacheEnabled: 'FALSE',
		zimbraMobileMetadataMaxSizeEnabled: 'FALSE',
		zimbraMailAlias: [faker.internet.email(), faker.internet.email()],
		zimbraPop3Enabled: 'FALSE',
		zimbraFeatureMailPriorityEnabled: 'TRUE',
		zimbraDataSourceCalendarPollingInterval: '12h',
		zimbraFeatureManageZimlets: 'TRUE',
		zimbraPasswordMinNumericChars: '0',
		zimbraWebClientShowOfflineLink: 'FALSE',
		zimbraFeatureCalendarEnabled: 'TRUE',
		zimbraMailBlacklistMaxNumEntries: '100',
		carbonioFeatureMailsAppEnabled: 'TRUE',
		zimbraFeatureDiscardInFiltersEnabled: 'TRUE',
		zimbraFeatureTrustedDevicesEnabled: 'TRUE',
		zimbraMailMinPollingInterval: '1m',
		zimbraResetPasswordRecoveryCodeExpiry: '10m',
		zimbraMailHighlightObjectsMaxSize: '70',
		zimbraFeatureSocialExternalEnabled: 'FALSE',
		zimbraFeatureAdminPreferencesEnabled: 'FALSE',
		zimbraFeaturePop3DataSourceEnabled: 'TRUE',
		zimbraFileAndroidCrashReportingEnabled: 'TRUE',
		zimbraPasswordMinUpperCaseChars: '0',
		zimbraMobileForceProtocol25: 'FALSE',
		zimbraMaxVoiceItemsPerPage: '100',
		zimbraPublicSharingEnabled: 'TRUE',
		zimbraDataSourceMaxNumEntries: '20',
		zimbraZimletLoadSynchronously: 'FALSE',
		zimbraFeatureViewInHtmlEnabled: 'TRUE',
		zimbraMailSignatureMaxLength: '4096',
		zimbraContactAutoCompleteMaxResults: '20',
		zimbraFeatureSignaturesEnabled: 'TRUE',
		zimbraPasswordMinDigitsOrPuncs: '0',
		zimbraPasswordRecoveryMaxAttempts: '10',
		zimbraPasswordMinPunctuationChars: '0',
		zimbraFilePublicShareLifetime: '0',
		carbonioFeatureChatsAppEnabled: 'TRUE',
		zimbraMtaMaxMessageSize: '27262976',
		zimbraExternalShareLifetime: '0',
		zimbraRecoveryAccountCodeValidity: '1d',
		zimbraFeatureWebClientOfflineAccessEnabled: 'FALSE',
		zimbraMobileTombstoneEnabled: 'TRUE',
		zimbraFeatureImapDataSourceEnabled: 'TRUE',
		zimbraPasswordMinAge: '0',
		zimbraFeatureSocialEnabled: 'FALSE',
		zimbraSignatureMinNumEntries: '1',
		zimbraMaxMailItemsPerPage: '100',
		zimbraLocale: 'en',
		zimbraFeatureSharingEnabled: 'TRUE',
		zimbraFeatureMailUpsellEnabled: 'FALSE',
		zimbraFeatureSavedSearchesEnabled: 'TRUE',
		zimbraFeatureMailSendLaterEnabled: 'TRUE',
		zimbraPortalName: 'Tecnico',
		zimbraPasswordMaxLength: '64',
		zimbraFeatureFreeBusyViewEnabled: 'TRUE',
		zimbraZimletAvailableZimlets: [
			'+com_zimbra_email',
			'!com_zextras_teamwork',
			'+com_zextras_files_classic',
			'!com_zextras_team_classic',
			'+com_zimbra_attachcontacts',
			'-com_zimbra_emailtemplates',
			'+com_zimbra_attachmail',
			'+com_zimbra_srchhighlighter',
			'+com_studiostorti_ssf_rc',
			'+com_zextras_client',
			'+com_zimbra_gtranslator',
			'+com_zextras_auth',
			'!com_zimbra_blockhyperlink',
			'+com_zimbra_date'
		],
		zimbraPasswordEnforceHistory: '0',
		zimbraFeatureTouchClientEnabled: 'FALSE',
		zimbraDumpsterEnabled: 'FALSE',
		zimbraFeatureContactBackupEnabled: 'FALSE',
		zimbraAttachmentsViewInHtmlOnly: 'FALSE',
		zimbraPrefColorMessagesEnabled: 'TRUE',
		zimbraMaxContactsPerPage: '100',
		zimbraFeatureBriefcasesEnabled: 'FALSE',
		zimbraFeatureCrocodocEnabled: 'FALSE',
		zimbraFeatureContactsUpsellEnabled: 'FALSE',
		zimbraMobileOutlookSyncEnabled: 'TRUE',
		zimbraFeatureVoiceUpsellEnabled: 'FALSE',
		zimbraDeviceAllowedPasscodeLockoutDuration: ['1m', '2m', '5m', '10m', '30m'],
		zimbraFeatureContactsEnabled: 'TRUE',
		zimbraFeatureComposeInNewWindowEnabled: 'TRUE',
		zimbraPasswordMaxAge: '0',
		zimbraFeatureFlaggingEnabled: 'TRUE',
		zimbraFeatureContactsDetailedSearchEnabled: 'FALSE',
		zimbraFeatureInstantNotify: 'TRUE',
		zimbraFeatureSocialFiltersEnabled: ['SocialCast', 'LinkedIn', 'Twitter', 'Facebook'],
		zimbraFeatureResetPasswordStatus: 'disabled',
		zimbraFeatureAppSpecificPasswordsEnabled: 'TRUE',
		zimbraIdentityMaxNumEntries: '20',
		zimbraFeatureAdminMailEnabled: 'TRUE',
		zimbraFeatureDistributionListFolderEnabled: 'TRUE',
		zimbraDataSourceImportOnLogin: 'FALSE',
		zimbraFeatureMAPIConnectorEnabled: 'FALSE',
		zimbraShareLifetime: '0',
		zimbraFeatureTwoFactorAuthRequired: 'FALSE',
		zimbraMailWhitelistMaxNumEntries: '100',
		zimbraSmimePublicCertificateExtensions: [
			'cer',
			'crt',
			'der',
			'p7b',
			'p7r',
			'pem',
			'spc',
			'sst',
			'sto'
		],
		zimbraPublicShareLifetime: '0',
		zimbraCalendarResourceDoubleBookingAllowed: 'TRUE',
		zimbraFileIOSCrashReportingEnabled: 'TRUE',
		zimbraFeatureConfirmationPageEnabled: 'FALSE',
		zimbraWebClientOfflineSyncMaxDays: '30',
		zimbraFeatureConversationsEnabled: 'TRUE',
		zimbraFeatureDistributionListExpandMembersEnabled: 'TRUE',
		zimbraFeatureNewMailNotificationEnabled: 'TRUE',
		zimbraPasswordMinLength: '8',
		zimbraFeatureOpenMailInNewWindowEnabled: 'TRUE',
		zimbraFileShareLifetime: '0',
		zimbraMobileNotificationEnabled: 'FALSE',
		zimbraFeatureGalEnabled: 'TRUE',
		zimbraFilePreviewMaxSize: '20971520',
		zimbraPasswordMinLowerCaseChars: '0',
		zimbraContactMaxNumEntries: '10000',
		zimbraMailMessageLifetime: '0',
		zimbraAllowAnyFromAddress: 'FALSE',
		zimbraPrefChatPlaySound: 'FALSE',
		zimbraFeatureExternalFeedbackEnabled: 'FALSE',
		zimbraSmtpRestrictEnvelopeFrom: 'TRUE',
		zimbraFeatureBriefcaseDocsEnabled: 'TRUE',
		zimbraFeatureReadReceiptsEnabled: 'TRUE',
		zimbraExternalSharingEnabled: 'FALSE',
		zimbraPasswordModifiedTime: '20220429081319.391Z',
		zimbraMobileShareContactEnabled: 'FALSE',
		zimbraFeatureAntispamEnabled: 'TRUE',
		zimbraFeatureGalAutoCompleteEnabled: 'TRUE',
		zimbraTouchJSErrorTrackingEnabled: 'FALSE',
		zimbraFeatureChangePasswordEnabled: 'TRUE',
		zimbraPrefShowChatsFolderInMail: 'FALSE',
		zimbraFeatureTwoFactorAuthAvailable: 'FALSE',
		zimbraFeatureSkinChangeEnabled: 'TRUE',
		zimbraSmimeUserCertificateExtensions: ['p12', 'pfx'],
		zimbraFeatureMobilePolicyEnabled: 'FALSE',
		zimbraDeviceFileOpenWithEnabled: 'TRUE',
		zimbraFeatureMarkMailForwardedAsRead: 'FALSE',
		zimbraDataSourceRssPollingInterval: '12h',
		zimbraMailForwardingAddressMaxLength: '4096',
		zimbraStandardClientCustomPrefTabsEnabled: 'FALSE',
		zimbraFeatureMailEnabled: 'TRUE',
		carbonioFeatureChatsEnabled: 'TRUE',
		zimbraFeaturePortalEnabled: 'FALSE',
		zimbraFeatureBriefcaseSlidesEnabled: 'TRUE',
		zimbraMobileAttachSkippedItemEnabled: 'FALSE',
		zimbraFeatureMailForwardingInFiltersEnabled: 'TRUE',
		zimbraFeatureCalendarReminderDeviceEmailEnabled: 'FALSE',
		zimbraFeatureSocialcastEnabled: 'FALSE',
		zimbraFeatureHtmlComposeEnabled: 'TRUE',
		zimbraFeatureCalendarUpsellEnabled: 'FALSE',
		zimbraFeatureFiltersEnabled: 'TRUE',
		zimbraIMAvailableInteropGateways: '"Zextras"',
		zimbraFeatureFromDisplayEnabled: 'TRUE',
		zimbraMobileForceSamsungProtocol25: 'TRUE',
		zimbraFeatureInitialSearchPreferenceEnabled: 'TRUE',
		zimbraFeatureMobileSyncEnabled: 'TRUE',
		zimbraId: 'e4102aa2-38b3-4612-b8b0-d9475bb9e606',
		carbonioVideoServerRecordingEnabled: 'FALSE',
		zimbraFeatureExportFolderEnabled: 'TRUE',
		zimbraMailTrashLifetime: '30d',
		zimbraFeatureGalSyncEnabled: 'TRUE',
		zimbraFeatureIdentitiesEnabled: 'TRUE',
		zimbraMobileSyncRedoMaxAttempts: ['windows:2', 'default:1']
	},
	prefs: {
		zimbraPrefFileSharingApplication: 'briefcase',
		zimbraPrefCalendarWorkingHours:
			'2:Y:0800:1800,3:Y:0800:1800,4:Y:0800:1800,5:Y:0800:1800,6:Y:0800:1800,7:N:0800:1800,1:N:0800:1800',
		zimbraPrefCalendarViewTimeInterval: '1h',
		zimbraPrefDefaultCalendarId: '10',
		zimbraPrefDefaultSignatureId: '60588d40-17ee-413b-9342-59403e5846e7',
		zimbraPrefComposeFormat: 'html',
		zimbraPrefWhenSentToEnabled: 'FALSE',
		zimbraPrefZmgPushNotificationEnabled: 'FALSE',
		zimbraPrefDisplayTimeInMailList: 'TRUE',
		zimbraPrefFromAddressType: 'sendAs',
		zimbraPrefLocale: 'en',
		zimbraPrefSaveToSent: 'TRUE',
		zimbraPrefDisplayExternalImages: 'FALSE',
		zimbraPrefOutOfOfficeCacheDuration: '1d',
		zimbraPrefConvReadingPaneLocation: 'bottom',
		zimbraPrefMailTrustedSenderList: [
			'zextras.atlassian.net',
			'zextras.com',
			'npmjs.com',
			'github.com',
			'bitbucket.org'
		],
		zimbraPrefShowSearchString: 'TRUE',
		zimbraPrefMailSelectAfterDelete: 'next',
		zimbraPrefAppleIcalDelegationEnabled: 'TRUE',
		zimbraPrefHtmlEditorDefaultFontFamily: 'arial, helvetica, sans-serif',
		zimbraPrefConvShowCalendar: 'TRUE',
		zimbraPrefCalendarShowPastDueReminders: 'TRUE',
		zimbraPrefWarnOnExit: 'TRUE',
		zimbraPrefReplyToEnabled: 'FALSE',
		zimbraPrefIMToasterEnabled: 'TRUE',
		zimbraPrefOutOfOfficeStatusAlertOnLogin: 'TRUE',
		zimbraPrefVoiceItemsPerPage: '25',
		zimbraPrefForwardReplySignatureId: '60588d40-17ee-413b-9342-59403e5846e7',
		zimbraPrefMailToasterEnabled: 'TRUE',
		zimbraPrefForwardReplyInOriginalFormat: 'FALSE',
		zimbraPrefSortOrder:
			'BDLV:,CAL:,CLV:,CLV-SR-1:dateDesc,CLV-SR-2:dateDesc,CLV-main:dateDesc,CNS:,CNSRC:,CNTGT:,CV:,TKL:,TKL-main:taskDueAsc,TV:,TV-main:dateDesc',
		zimbraPrefBriefcaseReadingPaneLocation: 'right',
		zimbraPrefContactsPerPage: '25',
		zimbraPrefMarkMsgRead: '0',
		zimbraPrefMessageIdDedupingEnabled: 'TRUE',
		zimbraPrefCalendarApptReminderWarningTime: '5',
		zimbraPrefDeleteInviteOnReply: 'TRUE',
		zimbraPrefCalendarDefaultApptDuration: '60m',
		zimbraPrefCalendarDayHourStart: '8',
		zimbraPrefPop3DeleteOption: 'delete',
		zimbraPrefTabInEditorEnabled: 'TRUE',
		zimbraPrefCalendarAutoAddInvites: 'TRUE',
		zimbraPrefExternalSendersType: 'INAB',
		zimbraPrefSentLifetime: '0',
		zimbraPrefAutoCompleteQuickCompletionOnComma: 'TRUE',
		zimbraPrefMailFlashIcon: 'TRUE',
		zimbraPrefMailSoundsEnabled: 'FALSE',
		zimbraPrefFolderColorEnabled: 'TRUE',
		zimbraPrefGalAutoCompleteEnabled: 'TRUE',
		zimbraPrefUseSendMsgShortcut: 'TRUE',
		zimbraPrefCalendarReminderSoundsEnabled: 'TRUE',
		zimbraPrefCalendarShowDeclinedMeetings: 'TRUE',
		zimbraPrefMailInitialSearch: 'in:inbox',
		zimbraPrefMandatorySpellCheckEnabled: 'FALSE',
		zimbraPrefDedupeMessagesSentToSelf: 'dedupeNone',
		zimbraPrefHtmlEditorDefaultFontSize: '12pt',
		zimbraPrefSentMailFolder: 'sent',
		zimbraPrefCalendarApptVisibility: 'public',
		zimbraPrefCalendarDayHourEnd: '18',
		zimbraPrefShowComposeDirection: 'FALSE',
		zimbraPrefShowCalendarWeek: 'FALSE',
		zimbraPrefMailDefaultCharset: 'UTF-8',
		zimbraPrefClientType: 'advanced',
		zimbraPrefCalendarAlwaysShowMiniCal: 'TRUE',
		zimbraPrefChatPlaySound: 'FALSE',
		zimbraPrefHtmlEditorDefaultFontColor: '#000000',
		zimbraPrefTasksReadingPaneLocation: 'right',
		zimbraPrefItemsPerVirtualPage: '50',
		zimbraPrefSearchTreeOpen: 'TRUE',
		zimbraPrefStandardClientAccessibilityMode: 'FALSE',
		zimbraPrefUseRfc2231: 'FALSE',
		zimbraPrefCalendarNotifyDelegatedChanges: 'FALSE',
		zimbraPrefShowChatsFolderInMail: 'FALSE',
		zimbraPrefConversationOrder: 'dateDesc',
		zimbraPrefIncludeSharedItemsInSearch: 'FALSE',
		zimbraPrefShowSelectionCheckbox: 'TRUE',
		zimbraPrefDelegatedSendSaveTarget: 'owner',
		zimbraPrefPop3IncludeSpam: 'FALSE',
		zimbraPrefCalendarReminderFlashTitle: 'TRUE',
		zimbraPrefDefaultPrintFontSize: '12pt',
		zimbraPrefFromAddress: identity.email,
		zimbraPrefMessageViewHtmlPreferred: 'TRUE',
		zimbraPrefMailFlashTitle: 'TRUE',
		zimbraPrefMailPollingInterval: '60s',
		zimbraPrefFontSize: 'normal',
		zimbraPrefReplyIncludeOriginalText: 'includeBody',
		zimbraPrefIdentityName: identity.fullName,
		zimbraPrefIncludeTrashInSearch: 'FALSE',
		zimbraPrefSharedAddrBookAutoCompleteEnabled: 'FALSE',
		zimbraPrefCalendarAllowCancelEmailToSelf: 'TRUE',
		zimbraPrefCalendarAllowPublishMethodInvite: 'TRUE',
		zimbraPrefGroupMailBy: 'conversation',
		zimbraPrefCalendarAllowForwardedInvite: 'TRUE',
		zimbraPrefZimletTreeOpen: 'FALSE',
		zimbraPrefCalendarUseQuickAdd: 'TRUE',
		zimbraPrefComposeInNewWindow: 'FALSE',
		zimbraPrefGalSearchEnabled: 'TRUE',
		zimbraPrefJunkLifetime: '0',
		zimbraPrefSpellIgnoreAllCaps: 'TRUE',
		zimbraPrefUseTimeZoneListInCalendar: 'TRUE',
		zimbraPrefCalendarAllowedTargetsForInviteDeniedAutoReply: 'internal',
		zimbraPrefOpenMailInNewWindow: 'FALSE',
		zimbraPrefMailSignatureStyle: 'outlook',
		zimbraPrefAdminConsoleWarnOnExit: 'TRUE',
		zimbraPrefTrashLifetime: '0',
		zimbraPrefShowFragments: 'TRUE',
		zimbraPrefOutOfOfficeReplyEnabled: 'FALSE',
		zimbraPrefMailRequestReadReceipts: 'FALSE',
		zimbraPrefAdvancedClientEnforceMinDisplay: 'TRUE',
		zimbraPrefCalendarFirstDayOfWeek: '1',
		zimbraPrefSkin: 'zextras',
		zimbraPrefForwardReplyPrefixChar: '>',
		zimbraPrefFromDisplay: identity.fullName,
		zimbraPrefShowAllNewMailNotifications: 'TRUE',
		zimbraPrefAccountTreeOpen: 'TRUE',
		zimbraPrefWhenInFoldersEnabled: 'FALSE',
		zimbraPrefAutoSaveDraftInterval: '30s',
		zimbraPrefCalendarToasterEnabled: 'TRUE',
		zimbraPrefColorMessagesEnabled: 'TRUE',
		zimbraPrefCalendarApptAllowAtendeeEdit: 'TRUE',
		zimbraPrefIncludeSpamInSearch: 'FALSE',
		zimbraPrefOutOfOfficeFreeBusyStatus: 'OUTOFOFFICE',
		zimbraPrefCalendarInitialView: 'workWeek',
		zimbraPrefFolderTreeOpen: 'TRUE',
		zimbraPrefInboxUnreadLifetime: '0',
		zimbraPrefImapSearchFoldersEnabled: 'TRUE',
		zimbraPrefMailSendReadReceipts: 'prompt',
		zimbraPrefForwardIncludeOriginalText: 'includeBody',
		zimbraPrefMailItemsPerPage: '25',
		zimbraPrefUseKeyboardShortcuts: 'TRUE',
		zimbraPrefTimeZoneId: 'Europe/Berlin',
		zimbraPrefShortEmailAddress: 'FALSE',
		zimbraPrefChatEnabled: 'TRUE',
		zimbraPrefInboxReadLifetime: '0',
		zimbraPrefOutOfOfficeExternalReplyEnabled: 'FALSE',
		zimbraPrefTagTreeOpen: 'TRUE',
		zimbraPrefMailSignatureHTML: `<div>${
			identity.fullName
		}</div>\n<div><span style="color: #ff0000;"><em>${faker.name.jobTitle()}</em></span></div>\n<div>&nbsp;</div>`,
		zimbraPrefGetMailAction: 'default',
		zimbraPrefAutoAddAddressEnabled: 'TRUE',
		zimbraPrefReadingPaneLocation: 'right',
		zimbraPrefOutOfOfficeSuppressExternalReply: 'TRUE',
		zimbraPrefCalendarSendInviteDeniedAutoReply: 'FALSE',
		zimbraPrefCalenderScaling: '30'
	},
	props: [
		{
			zimlet: 'carbonio-chats-ui',
			name: 'meeting_default_video',
			_content: 'false'
		},
		{
			zimlet: 'carbonio-shell-ui',
			name: 'zappDarkreaderMode',
			_content: 'disabled'
		},
		{
			zimlet: 'carbonio-mails-ui',
			name: 'mails_snackbar_delay',
			_content: '3'
		},
		{
			zimlet: 'carbonio-chats-ui',
			name: 'meeting_default_audio',
			_content: 'false'
		},
		{
			zimlet: 'carbonio-chats-ui',
			name: 'audio_noise_suppression',
			_content: 'true'
		},
		{
			zimlet: 'carbonio-chats-ui',
			name: 'allow_desktop_notification',
			_content: 'true'
		}
	]
};
