import { useUserSettings } from '@zextras/carbonio-shell-ui';
import { UserPrefs } from '../types';

export const usePrefs = (): UserPrefs => {
	const { prefs } = useUserSettings();
	return <UserPrefs>prefs;
};
