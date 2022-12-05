import { getUserSettings } from '@zextras/carbonio-shell-ui';
import { UserPrefs } from '../types';

export const getPrefs = (): UserPrefs => {
	const { prefs } = getUserSettings();
	return <UserPrefs>prefs;
};
