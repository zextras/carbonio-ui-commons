import { getUserSettings } from '@zextras/carbonio-shell-ui';
import { UserPrefs } from '../types';

export const getPrefs = (): UserPrefs => {
	const { prefs } = getUserSettings();
	const {
		zimbraPrefDefaultCalendarId,
		zimbraPrefCalendarDefaultApptDuration,
		zimbraPrefCalendarWorkingHours,
		zimbraPrefTimeZoneId,
		zimbraPrefCalendarFirstDayOfWeek,
		zimbraPrefLocale,
		zimbraPrefCalendarInitialView,
		zimbraPrefCalendarApptReminderWarningTime,
		zimbraPrefUseTimeZoneListInCalendar,
		zimbraPrefIncludeTrashInSearch,
		zimbraPrefIncludeSharedItemsInSearch
	} = prefs;
	return <UserPrefs>{
		zimbraPrefDefaultCalendarId,
		zimbraPrefCalendarDefaultApptDuration,
		zimbraPrefCalendarWorkingHours,
		zimbraPrefTimeZoneId,
		zimbraPrefCalendarFirstDayOfWeek,
		zimbraPrefLocale,
		zimbraPrefCalendarInitialView,
		zimbraPrefCalendarApptReminderWarningTime,
		zimbraPrefUseTimeZoneListInCalendar,
		zimbraPrefIncludeTrashInSearch,
		zimbraPrefIncludeSharedItemsInSearch
	};
};
