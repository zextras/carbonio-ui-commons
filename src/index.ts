/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// components/breadcrumbs
export * from './components/breadcrumbs/static-breadcrumbs';

// components/sidebar
export * from './components/sidebar/sidebar-accordion-mui';

// components/modals
export * from './components/modals/modal-footer';
export * from './components/modals/modal-header';
export * from './components/modals/folder-initialization-error-modal';

// components/select/folders
export * from './components/select/folders/folders-accordion';
export * from './components/select/folders/flat-folder';
export * from './components/select/folders/flat-folders';
export * from './components/select/folders/folder-accordions-custom-component';
export * from './components/select/folders/folder-selector';
export * from './components/select/folders/flat-root';
export * from './components/select/folders/status-icon';
export * from './components/select/folders/hooks';
export * from './components/select/folders/utils';

// components/select
export * from './components/select/select-label-factory';
export * from './components/select/color-select';
export * from './components/select/folders-selector';

// components/list
export * from './components/list/list-item';
export * from './components/list/list';

// components/tags
export * from './components/tags/delete-tag-modal';

// hooks
export * from './hooks/use-initialize-folders';
export * from './hooks/use-update-view';
export * from './hooks/use-initialize-tags';

// utils
export * from './utils/utils';
export * from './utils/index';
export * from './utils/clipboard';
export * from './utils/get-prefs';
export * from './utils/use-prefs';

// helpers
export * from './helpers/errors';
export * from './helpers/email-parser';
export * from './helpers/api-wrapper';
export * from './helpers/folders';
export * from './helpers/identities';
export * from './helpers/search';
export * from './helpers/use-history-navigation';

// integrations
export * from './integrations/hooks';
export * from './integrations/constants';
export * from './integrations/default-contact-input';
export * from './integrations/search/use-run-search';
export * from './integrations/types';

// soap
export * from './soap/errors/generic-soap-api-error';
export * from './soap/errors/soap-api-error';
export * from './soap/no-op';
export * from './soap/get-share-info';
export * from './soap/get-folder';
export * from './soap/tags';

// store/zustand/folder
export * from './store/zustand/folder/hooks';
export * from './store/zustand/folder/utils';
export * from './store/zustand/folder/store';

// store/zustand/tags
export * from './store/zustand/tags/hooks';
export * from './store/zustand/tags/store';
export * from './store/zustand/tags/index';

// constants
export * from './constants/folders';
export * from './constants/utils/index';
export * from './constants/participants';
export * from './constants/search';

// theme
export * from './theme/theme-mui';
export * from './theme/theme';

// worker
export * from './worker/folder';
export * from './worker/tags';
export * from './worker/handle-message';
export * from './worker/utils';

// types
export * from './types';
export * from './types/actions';
export * from './types/folder';
export * from './types/i18next';
export * from './types/identities';
export * from './types/modals';
export * from './types/select';
export * from './types/sidebar';
export * from './types/soap';
export * from './types/styled-components';
export * from './types/tags';
export * from './types/user-accounts';
export * from './types/workers';

// __test__/mocks
export * from './__test__/mocks/accounts/account-generator';
export * from './__test__/mocks/accounts/default-account';
export * from './__test__/mocks/accounts/fakeAccounts';
export * from './__test__/mocks/folders/folders-generator';
export * from './__test__/mocks/folders/roots-generator';
export * from './__test__/mocks/folders/soap-roots-generator';
export * from './__test__/mocks/carbonio-shell-ui';
export * from './__test__/mocks/carbonio-ui-preview';
export * from './__test__/mocks/file-mock';
export * from './__test__/mocks/integrations/mock-contact-input';
export * from './__test__/mocks/network/fetch';
export * from './__test__/mocks/network/msw/create-api-interceptor';
export * from './__test__/mocks/network/msw/handle-get-folder';
export * from './__test__/mocks/network/msw/handle-get-share-info';
export * from './__test__/mocks/network/msw/handlers';
export * from './__test__/mocks/routing/use-history-navigation-mock';
export * from './__test__/mocks/settings/default-settings';
export * from './__test__/mocks/settings/settings-generator';
export * from './__test__/mocks/store/folders';
export * from './__test__/mocks/tags/tags';
export * from './__test__/mocks/utils/file';
export * from './__test__/mocks/utils/folder';
export * from './__test__/mocks/utils/mocks-context';
export * from './__test__/mocks/utils/soap';
export * from './__test__/mocks/utils/window';
export * from './__test__/mocks/zustand';

// __test__ setup files
export * from './__test__/constants';
export * from './__test__/i18n/i18n-test-factory';
export * from './__test__/jest-config';
export * from './__test__/jest-setup';
export * from './__test__/jsdom-extended';
export * from './__test__/test-setup';
