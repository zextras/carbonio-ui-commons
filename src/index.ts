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
export * from './utils/clipboard';
export * from './utils/get-prefs';
export * from './utils/use-prefs';

// helpers
export * from './helpers/errors';
export * from './helpers/email-parser';
export * from './helpers/api-wrapper';
export * from './helpers/folders';
export * from './helpers/identities';
export * from './helpers/use-history-navigation';
export * from './helpers/search';

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

// constants
export * from './constants/index';
export * from './constants/folders';
export * from './constants/utils/index';
export * from './constants/participants';
export * from './constants/search';

// theme
export * from './theme/theme-mui';
export * from './theme/theme.d';

// worker
export * from './worker/folder';
export * from './worker/tags';
export * from './worker/handle-message';
export * from './worker/utils';

// types
export * from './types/sidebar/index.d';
export * from './types/folder/index.d';
export * from './types/modals/index.d';
export * from './types/actions/index';
export * from './types/i18next.d';
export * from './types/workers';
export * from './types/styled-components.d';
export * from './types/tags/index.d';
export * from './types/identities/index.d';
export * from './types/user-accounts';
export * from './types/select/index.d';
export * from './types/soap/index.d';
export * from './types/index.d';
