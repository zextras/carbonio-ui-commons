/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { faker } from '@faker-js/faker';
import { find } from 'lodash';

import { FOLDER_VIEW } from '../../constants';
import {
	BASE_FOLDER_CALENDAR_ARGS,
	generateSoapCustomChild,
	generateSoapLink,
	generateSoapRoot,
	generateSoapSystemFolder,
	getAccountSoapRoot
} from '../../test/mocks/folders/soap-roots-generator';
import { BaseFolder, Folder } from '../../types/folder';
import type { LinkFolder, SoapLink, UserFolder } from '../../types/folder';
import { handleMessage, normalize, testUtils } from '../handle-message';

beforeEach(() => {
	testUtils.resetFolders();
	window.postMessage = jest.fn();
});

const getRandomWord = (used: Array<string>): string => {
	const word = faker.word.noun();
	const isAlreadyUsed = find(used, word);
	return isAlreadyUsed ? getRandomWord(used) : word;
};

const getNormalizedPrimaryAccount = (): Folder => ({
	...normalize(getAccountSoapRoot(true)),
	children: [],
	isLink: false,
	parent: '11',
	depth: 0
});

const getNormalizedSharedAccount = (): LinkFolder => ({
	...normalize(getAccountSoapRoot(false)),
	children: [],
	isLink: true,
	parent: '1',
	depth: 0,
	broken: false,
	reminder: false,
	owner: faker.internet.email()
});

// refs: SHELL-118
// todo: BaseFolder color type inside shell is still wrong. Wait for a fix before removing this ts-ignore
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const getNormalizedCreatedLink = (createdLink: SoapLink, parent: string): LinkFolder => ({
	...createdLink,
	i4n: undefined,
	i4u: undefined,
	md: undefined,
	meta: undefined,
	perm: 'r',
	rest: undefined,
	retentionPolicy: undefined,
	rgb: undefined,
	url: undefined,
	isLink: true,
	checked: false,
	children: [],
	parent,
	depth: 1,
	broken: false,
	oname: undefined,
	reminder: false
});

const getNormalizedCreatedFolder = (folder: BaseFolder, parent: string): UserFolder => ({
	...folder,
	i4n: undefined,
	i4u: undefined,
	md: undefined,
	meta: undefined,
	perm: undefined,
	rest: undefined,
	retentionPolicy: undefined,
	rgb: undefined,
	url: undefined,
	isLink: false,
	checked: false,
	children: [],
	parent,
	depth: 1
});

describe('folders web worker', () => {
	describe('refresh', () => {
		test('on refresh view is set to currentView', () => {
			const tree = generateSoapRoot(true, true, faker.string.uuid());
			const data = {
				op: 'refresh',
				currentView: FOLDER_VIEW.appointment,
				folder: [tree]
			};

			expect(testUtils.getCurrentView()).toBeUndefined();

			handleMessage({
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				data
			});

			expect(testUtils.getCurrentView()).toBe(FOLDER_VIEW.appointment);
		});
		test('postMessage is called with normalized folders', () => {
			const workerSpy = jest.spyOn(window, 'postMessage');
			const tree = generateSoapRoot(true, true, faker.string.uuid());
			const data = {
				op: 'refresh',
				currentView: FOLDER_VIEW.appointment,
				folder: [tree]
			};

			handleMessage({
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				data
			});

			expect(workerSpy).toHaveBeenCalledTimes(1);
			expect(workerSpy).toHaveBeenCalledWith({
				folders: expect.objectContaining({
					1: expect.objectContaining({
						children: expect.arrayContaining([expect.objectContaining({ id: '10' })]),
						isLink: false,
						depth: 0,
						checked: expect.any(Boolean)
					}),
					10: expect.objectContaining({
						children: expect.any(Object),
						parent: expect.any(String),
						depth: 1,
						isLink: false,
						checked: expect.any(Boolean)
					})
				}),
				linksIdMap: expect.any(Object),
				searches: expect.any(Object)
			});
			workerSpy.mockRestore();
		});
		test('folders are flattened', () => {
			const workerSpy = jest.spyOn(window, 'postMessage');
			const primaryAccount = getAccountSoapRoot(true);
			const calendar = generateSoapSystemFolder(BASE_FOLDER_CALENDAR_ARGS);
			const calendarSubFolderLevel1 = generateSoapCustomChild(calendar);
			const calendarSubFolderLevel2 = generateSoapCustomChild(calendarSubFolderLevel1);
			const calendarSubFolderLevel1Link = generateSoapLink(calendarSubFolderLevel1 as SoapLink);
			const calendarSubLinkLevel1 = generateSoapLink(calendar as SoapLink);
			const calendarSubLinkLevel2 = generateSoapLink(calendarSubLinkLevel1);
			const calendarSubLinkLevel1Folder = generateSoapCustomChild(calendarSubLinkLevel1);
			const tree = {
				...primaryAccount,
				folder: [
					{
						...calendar,
						folder: [
							{
								...calendarSubFolderLevel1,
								folder: [calendarSubFolderLevel2],
								link: [calendarSubFolderLevel1Link]
							}
						],
						link: [
							{
								...calendarSubLinkLevel1,
								link: [calendarSubLinkLevel2],
								folder: [calendarSubLinkLevel1Folder]
							}
						]
					}
				]
			};
			const data = {
				op: 'refresh',
				currentView: FOLDER_VIEW.appointment,
				folder: [tree]
			};
			handleMessage({
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				data
			});

			expect(workerSpy).toHaveBeenCalledTimes(1);
			expect(workerSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					folders: {
						[primaryAccount.id]: expect.any(Object),
						[calendar.id]: expect.any(Object),
						[calendarSubFolderLevel1.id]: expect.any(Object),
						[calendarSubFolderLevel2.id]: expect.any(Object),
						[calendarSubFolderLevel1Link.id]: expect.any(Object),
						[calendarSubLinkLevel1.id]: expect.any(Object),
						[calendarSubLinkLevel2.id]: expect.any(Object),
						[calendarSubLinkLevel1Folder.id]: expect.any(Object)
					}
				})
			);
		});
		test('each folder has its own children structure', () => {
			const workerSpy = jest.spyOn(window, 'postMessage');
			const primaryAccount = getAccountSoapRoot(true);
			const calendar = generateSoapSystemFolder(BASE_FOLDER_CALENDAR_ARGS);
			const calendarSubFolderLevel1 = generateSoapCustomChild(calendar);
			const calendarSubFolderLevel2 = generateSoapCustomChild(calendarSubFolderLevel1);

			const tree = {
				...primaryAccount,
				folder: [
					{
						...calendar,
						folder: [
							{
								...calendarSubFolderLevel1,
								folder: [calendarSubFolderLevel2]
							}
						]
					}
				]
			};
			const data = {
				op: 'refresh',
				currentView: FOLDER_VIEW.appointment,
				folder: [tree]
			};
			handleMessage({
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				data
			});

			expect(workerSpy).toHaveBeenCalledTimes(1);
			expect(workerSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					folders: expect.objectContaining({
						[primaryAccount.id]: expect.objectContaining({
							id: primaryAccount.id,
							children: [
								expect.objectContaining({
									id: calendar.id,
									children: [
										expect.objectContaining({
											id: calendarSubFolderLevel1.id,
											children: [
												expect.objectContaining({
													id: calendarSubFolderLevel2.id
												})
											]
										})
									]
								})
							]
						})
					})
				})
			);
		});
	});
	describe('notify', () => {
		describe('handle created', () => {
			describe('folder', () => {
				test('when a new folder for the current view is notified, it is normalized, added and sorted', () => {
					const primaryAccount = getNormalizedPrimaryAccount();
					const createdFolder = {
						...generateSoapCustomChild({
							...primaryAccount,
							view: FOLDER_VIEW.appointment
						}),
						name: 'aaa'
					};
					const normalizedCreatedFolder = getNormalizedCreatedFolder(
						createdFolder as BaseFolder,
						primaryAccount.id
					);
					const data = {
						op: 'notify',
						notify: {
							created: {
								folder: [createdFolder]
							}
						}
					};
					const tree = {
						[primaryAccount.id]: {
							...primaryAccount,
							children: [
								{
									...generateSoapCustomChild({ ...primaryAccount, view: FOLDER_VIEW.appointment }),
									name: 'bbb'
								}
							]
						} as UserFolder
					};

					testUtils.setFolders(tree);
					testUtils.setCurrentView(FOLDER_VIEW.appointment);
					handleMessage({
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						data
					});

					const folders = testUtils.getFolders();

					expect(folders[primaryAccount.id].children).toHaveLength(2);
					expect(folders[primaryAccount.id].children[0]).toStrictEqual(
						expect.objectContaining({ name: 'aaa' })
					);
					expect(folders[primaryAccount.id].children[1]).toStrictEqual(
						expect.objectContaining({ name: 'bbb' })
					);
					expect(folders[createdFolder.id]).toStrictEqual(normalizedCreatedFolder);
				});
				test('when a new folder for a different view is notified, is not added or normalized', () => {
					const primaryAccount = getNormalizedPrimaryAccount();
					const createdFolder = generateSoapCustomChild({
						...primaryAccount,
						view: FOLDER_VIEW.appointment
					});

					const data = {
						op: 'notify',
						notify: {
							created: {
								folder: [createdFolder]
							}
						}
					};
					const tree = {
						[primaryAccount.id]: primaryAccount as UserFolder
					};

					testUtils.setFolders(tree);
					testUtils.setCurrentView(FOLDER_VIEW.message);
					handleMessage({
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						data
					});

					const folders = testUtils.getFolders();
					expect(folders[createdFolder.id]).toBeUndefined();
					expect(folders).toStrictEqual({
						[primaryAccount.id]: primaryAccount
					});
				});
				test('when a new folder is added, it will be available in the flat structure', () => {
					const primaryAccount = getNormalizedPrimaryAccount();
					const createdFolder = generateSoapCustomChild({
						...primaryAccount,
						view: FOLDER_VIEW.appointment
					});
					const normalizedCreatedFolder = getNormalizedCreatedFolder(
						createdFolder as BaseFolder,
						primaryAccount.id
					);
					const data = {
						op: 'notify',
						notify: {
							created: {
								folder: [createdFolder]
							}
						}
					};
					const tree = {
						[primaryAccount.id]: primaryAccount as UserFolder
					};

					testUtils.setFolders(tree);
					testUtils.setCurrentView(FOLDER_VIEW.appointment);
					handleMessage({
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						data
					});

					const folders = testUtils.getFolders();

					expect(folders).toHaveProperty(createdFolder.id, normalizedCreatedFolder);
				});
				test('when a new folder is added, it will be also added to the parent folder as children', () => {
					const normalizedPrimaryAccount = getNormalizedPrimaryAccount();
					const createdFolder = generateSoapCustomChild({
						...normalizedPrimaryAccount,
						view: FOLDER_VIEW.appointment
					});
					const normalizedCreatedFolder = getNormalizedCreatedFolder(
						createdFolder as BaseFolder,
						normalizedPrimaryAccount.id
					);
					const data = {
						op: 'notify',
						notify: {
							created: {
								folder: [createdFolder]
							}
						}
					};
					const tree = {
						[normalizedPrimaryAccount.id]: normalizedPrimaryAccount as UserFolder
					};

					testUtils.setFolders(tree);
					testUtils.setCurrentView(FOLDER_VIEW.appointment);
					handleMessage({
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						data
					});

					const folders = testUtils.getFolders();

					expect(folders[normalizedPrimaryAccount.id].children).toStrictEqual([
						expect.objectContaining({ id: normalizedCreatedFolder.id })
					]);
				});
			});
			describe('link', () => {
				test('when a new link for the current view is notified, it is normalized, added and sorted', () => {
					const normalizedPrimaryAccount = getNormalizedPrimaryAccount();
					const createdLink = {
						...generateSoapLink({
							...normalizedPrimaryAccount,
							view: FOLDER_VIEW.appointment
						}),
						name: 'aaa'
					};
					const normalizedCreatedFolder = getNormalizedCreatedLink(
						createdLink,
						normalizedPrimaryAccount.id
					);
					const data = {
						op: 'notify',
						notify: {
							created: {
								link: [createdLink]
							}
						}
					};

					const tree = {
						[normalizedPrimaryAccount.id]: {
							...normalizedPrimaryAccount,
							children: [
								{
									...generateSoapLink({
										...normalizedPrimaryAccount,
										view: FOLDER_VIEW.appointment
									}),
									name: 'bbb'
								}
							]
						} as UserFolder
					};
					testUtils.setFolders(tree);
					testUtils.setCurrentView(FOLDER_VIEW.appointment);
					handleMessage({
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						data
					});

					const folders = testUtils.getFolders();

					expect(folders[normalizedPrimaryAccount.id].children).toHaveLength(2);
					expect(folders[normalizedPrimaryAccount.id].children[0]).toStrictEqual(
						expect.objectContaining({ name: 'aaa' })
					);
					expect(folders[normalizedPrimaryAccount.id].children[1]).toStrictEqual(
						expect.objectContaining({ name: 'bbb' })
					);
					expect(folders[createdLink.id]).toStrictEqual(normalizedCreatedFolder);
				});
				test('when a new link for a different view is notified, is not added or normalized', () => {
					const primaryAccount = getNormalizedPrimaryAccount();
					const createdLink = generateSoapLink({
						...primaryAccount,
						view: FOLDER_VIEW.appointment
					});

					const data = {
						op: 'notify',
						notify: {
							created: {
								link: [createdLink]
							}
						}
					};
					const tree = {
						[primaryAccount.id]: primaryAccount as UserFolder
					};

					testUtils.setFolders(tree);
					testUtils.setCurrentView(FOLDER_VIEW.message);
					handleMessage({
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						data
					});

					const folders = testUtils.getFolders();
					expect(folders[createdLink.id]).toBeUndefined();
					expect(folders).toStrictEqual({
						[primaryAccount.id]: primaryAccount
					});
				});
				test('when a new link is added, it will be available in the flat structure', () => {
					const primaryAccount = getNormalizedPrimaryAccount();
					const createdLink = generateSoapLink({
						...primaryAccount,
						view: FOLDER_VIEW.appointment
					});
					const normalizedCreatedLink = getNormalizedCreatedLink(createdLink, primaryAccount.id);
					const data = {
						op: 'notify',
						notify: {
							created: {
								link: [createdLink]
							}
						}
					};
					const tree = {
						[primaryAccount.id]: primaryAccount as UserFolder
					};

					testUtils.setFolders(tree);
					testUtils.setCurrentView(FOLDER_VIEW.appointment);
					handleMessage({
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						data
					});

					const folders = testUtils.getFolders();

					expect(folders).toHaveProperty(createdLink.id, normalizedCreatedLink);
				});
				test('when a new link is added, it will be also added to the parent folder as children', () => {
					const primaryAccount = getNormalizedPrimaryAccount();
					const createdLink = generateSoapLink({
						...primaryAccount,
						view: FOLDER_VIEW.appointment
					});
					const normalizedCreatedLink = getNormalizedCreatedLink(createdLink, primaryAccount.id);
					const data = {
						op: 'notify',
						notify: {
							created: {
								link: [createdLink]
							}
						}
					};
					const tree = {
						[primaryAccount.id]: primaryAccount as UserFolder
					};

					testUtils.setFolders(tree);
					testUtils.setCurrentView(FOLDER_VIEW.appointment);
					handleMessage({
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						data
					});

					const folders = testUtils.getFolders();

					expect(folders[primaryAccount.id].children).toStrictEqual([normalizedCreatedLink]);
				});
			});
		});
		describe('handle modified folder/link', () => {
			test('moving a folder will update the old parent folder, the new parent folder and the moved folder', () => {
				const primaryAccount = getNormalizedPrimaryAccount();
				const calendar = generateSoapSystemFolder(BASE_FOLDER_CALENDAR_ARGS);
				const folderToMove = generateSoapCustomChild({
					...primaryAccount,
					view: FOLDER_VIEW.appointment
				});

				const normalizedCalendar = {
					...calendar,
					children: [],
					depth: 1,
					isLink: false,
					parent: calendar.l
				};
				const normalizedFolderToMove = {
					...folderToMove,
					children: [],
					depth: 1,
					isLink: false,
					parent: folderToMove.l
				};
				const tree = {
					[primaryAccount.id]: {
						...primaryAccount,
						children: [normalizedCalendar, normalizedFolderToMove] as UserFolder[]
					},
					[calendar.id]: normalizedCalendar as UserFolder,
					[folderToMove.id]: normalizedFolderToMove as UserFolder
				};
				testUtils.setFolders(tree);
				testUtils.setCurrentView(FOLDER_VIEW.appointment);

				const data = {
					op: 'notify',
					notify: {
						modified: {
							folder: [
								{
									id: folderToMove.id,
									uuid: folderToMove.uuid,
									deletable: true,
									l: calendar.id,
									luuid: folderToMove.luuid,
									absFolderPath: `${calendar.absFolderPath}/${folderToMove.name}`
								}
							]
						}
					}
				};

				const previous = testUtils.getFolders();

				expect(previous[primaryAccount.id].children).toHaveLength(2);
				expect(previous[primaryAccount.id].children).toStrictEqual([
					normalizedCalendar,
					normalizedFolderToMove
				]);
				expect(previous[calendar.id].children).toHaveLength(0);
				expect(previous[calendar.id].children).toStrictEqual([]);
				expect(previous[folderToMove.id].parent).toStrictEqual(primaryAccount.id);

				handleMessage({
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					data
				});

				const folders = testUtils.getFolders();
				const expectedObject = {
					id: folderToMove.id,
					absFolderPath: `${normalizedCalendar.absFolderPath}${folderToMove.absFolderPath}`,
					l: normalizedCalendar.id,
					parent: normalizedCalendar.id,
					depth: 2
				};
				expect(folders[primaryAccount.id].children).toHaveLength(1);
				expect(folders[primaryAccount.id].children).toStrictEqual([
					{
						...normalizedCalendar,
						children: [expect.objectContaining(expectedObject)]
					}
				]);
				expect(folders[calendar.id].children).toHaveLength(1);
				expect(folders[calendar.id].children).toStrictEqual([
					expect.objectContaining(expectedObject)
				]);
				expect(folders[folderToMove.id].parent).toStrictEqual(calendar.id);
			});
			describe('renaming a folder', () => {
				it("will update itself, its structure and parent's tree structure", () => {
					const primaryAccount = getNormalizedPrimaryAccount();
					const folderToRename = generateSoapCustomChild({
						...primaryAccount,
						view: FOLDER_VIEW.appointment
					});

					const childFolder = generateSoapCustomChild(folderToRename);
					const childFolder2 = generateSoapCustomChild(folderToRename);
					const subChildFolder = generateSoapCustomChild(childFolder);

					const normalizedSubChildFolder = {
						...subChildFolder,
						children: [],
						depth: 3,
						isLink: false,
						parent: subChildFolder.l
					};

					const normalizedChildFolder = {
						...childFolder,
						children: [normalizedSubChildFolder],
						depth: 2,
						isLink: false,
						parent: childFolder.l
					};

					const normalizedChildFolder2 = {
						...childFolder2,
						children: [],
						depth: 2,
						isLink: false,
						parent: childFolder2.l
					};

					const normalizedFolderToRename = {
						...folderToRename,
						children: [normalizedChildFolder, normalizedChildFolder2],
						depth: 1,
						isLink: false,
						parent: folderToRename.l
					};

					const tree = {
						[primaryAccount.id]: {
							...primaryAccount,
							children: [normalizedFolderToRename] as UserFolder[]
						},
						[folderToRename.id]: normalizedFolderToRename as UserFolder,
						[childFolder.id]: normalizedChildFolder as UserFolder,
						[childFolder2.id]: normalizedChildFolder2 as UserFolder,
						[subChildFolder.id]: normalizedSubChildFolder as UserFolder
					};
					testUtils.setFolders(tree);
					testUtils.setCurrentView(FOLDER_VIEW.appointment);

					const name = getRandomWord([
						primaryAccount.name,
						normalizedChildFolder.name,
						normalizedFolderToRename.name
					]);

					const data = {
						op: 'notify',
						notify: {
							modified: {
								folder: [
									{
										id: folderToRename.id,
										uuid: folderToRename.uuid,
										deletable: true,
										name,
										absFolderPath: `${primaryAccount.absFolderPath}${name}`
									}
								]
							}
						}
					};

					handleMessage({
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						data
					});

					const folders = testUtils.getFolders();

					// check over itself and its structure
					expect(folders[folderToRename.id].name).toStrictEqual(name);
					expect(folders[folderToRename.id].children[0].absFolderPath).toStrictEqual(
						`/${name}/${childFolder.name}`
					);
					expect(folders[folderToRename.id].children[1].absFolderPath).toStrictEqual(
						`/${name}/${childFolder2.name}`
					);
					expect(folders[folderToRename.id].children[0].children[0].absFolderPath).toStrictEqual(
						`/${name}/${childFolder.name}/${subChildFolder.name}`
					);

					if (folderToRename.l) {
						// check over its parent structure
						expect(folders[folderToRename.l].children[0].name).toStrictEqual(name);
						expect(folders[folderToRename.l].children[0].absFolderPath).toStrictEqual(`/${name}`);
						expect(folders[folderToRename.l].children[0].children[0].absFolderPath).toStrictEqual(
							`/${name}/${childFolder.name}`
						);
						expect(
							folders[folderToRename.l].children[0].children[0].children[0].absFolderPath
						).toStrictEqual(`/${name}/${childFolder.name}/${subChildFolder.name}`);
						expect(folders[folderToRename.l].children[0].children[1].absFolderPath).toStrictEqual(
							`/${name}/${childFolder2.name}`
						);
					}
				});
				it('when the folder is in a shared account tree, it renames the folder in the shared account folder tree', () => {
					const primaryAccount = getNormalizedPrimaryAccount();
					const sharedAccount = getNormalizedSharedAccount();
					const folderToRename = generateSoapCustomChild({
						...sharedAccount,
						view: FOLDER_VIEW.message
					});

					const normalizedFolderToRename = {
						...folderToRename,
						children: [],
						depth: 1,
						isLink: false,
						parent: folderToRename.l
					};

					const tree = {
						[primaryAccount.id]: {
							...primaryAccount
						},
						[sharedAccount.id]: {
							...sharedAccount,
							children: [normalizedFolderToRename] as Array<UserFolder>
						},
						[folderToRename.id]: normalizedFolderToRename as UserFolder
					};
					testUtils.setFolders(tree);
					testUtils.setCurrentView(FOLDER_VIEW.message);

					const newFolderName = getRandomWord([
						primaryAccount.name,
						normalizedFolderToRename.name,
						sharedAccount.name
					]);

					const data = {
						op: 'notify',
						notify: {
							modified: {
								folder: [
									{
										id: folderToRename.id,
										uuid: folderToRename.uuid,
										deletable: true,
										name: newFolderName,
										absFolderPath: `${sharedAccount.absFolderPath}${newFolderName}`
									}
								]
							}
						}
					};

					handleMessage({
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						data
					});

					const folders = testUtils.getFolders();

					expect(folders[sharedAccount.id].children[0].name).toStrictEqual(newFolderName);
				});
				it('when the folder modified is in the shared account folder tree, it does not renames the shared folder in the primary account tree', () => {
					const primaryAccount = getNormalizedPrimaryAccount();
					const sharedAccount = getNormalizedSharedAccount();
					const folderToRename = generateSoapCustomChild({
						...sharedAccount,
						view: FOLDER_VIEW.message
					});

					const normalizedFolderToRename = {
						...folderToRename,
						children: [],
						depth: 1,
						isLink: false,
						parent: folderToRename.l
					};

					const normalizedFolderNotToBeRenamed = {
						...normalizedFolderToRename,
						id: faker.string.uuid()
					};

					const tree = {
						[primaryAccount.id]: {
							...primaryAccount,
							children: [normalizedFolderNotToBeRenamed] as Array<UserFolder>
						},
						[sharedAccount.id]: {
							...sharedAccount,
							children: [normalizedFolderToRename] as Array<UserFolder>
						},
						[folderToRename.id]: normalizedFolderToRename as UserFolder,
						[normalizedFolderNotToBeRenamed.id]: normalizedFolderNotToBeRenamed as UserFolder
					};
					testUtils.setFolders(tree);
					testUtils.setCurrentView(FOLDER_VIEW.message);

					const newFolderName = getRandomWord([
						primaryAccount.name,
						normalizedFolderToRename.name,
						sharedAccount.name
					]);

					const data = {
						op: 'notify',
						notify: {
							modified: {
								folder: [
									{
										id: folderToRename.id,
										uuid: folderToRename.uuid,
										deletable: true,
										name: newFolderName,
										absFolderPath: `${sharedAccount.absFolderPath}${newFolderName}`
									}
								]
							}
						}
					};

					handleMessage({
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						data
					});

					const folders = testUtils.getFolders();

					expect(folders[sharedAccount.id].children[0].name).toStrictEqual(newFolderName);
					expect(folders[primaryAccount.id].children[0].name).not.toStrictEqual(newFolderName);
				});
			});
			test("changing a folder color will update itself and the parent's tree structure", () => {
				const primaryAccount = getNormalizedPrimaryAccount();
				const folderWithNewColor = {
					...generateSoapCustomChild({
						...primaryAccount,
						view: FOLDER_VIEW.appointment
					}),
					color: 1
				};
				const normalizedFolderWithNewColor = {
					...folderWithNewColor,
					children: [],
					depth: 1,
					isLink: false,
					parent: folderWithNewColor.l
				};
				const tree = {
					[primaryAccount.id]: {
						...primaryAccount,
						children: [normalizedFolderWithNewColor] as UserFolder[]
					},
					[folderWithNewColor.id]: normalizedFolderWithNewColor as UserFolder
				};

				testUtils.setFolders(tree);
				testUtils.setCurrentView(FOLDER_VIEW.appointment);

				const data = {
					op: 'notify',
					notify: {
						modified: {
							folder: [
								{
									id: folderWithNewColor.id,
									uuid: folderWithNewColor.uuid,
									deletable: true,
									color: 2
								}
							]
						}
					}
				};

				handleMessage({
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					data
				});

				const folders = testUtils.getFolders();

				if (normalizedFolderWithNewColor.parent) {
					expect(folders[normalizedFolderWithNewColor.parent].children[0].color).toStrictEqual(2);
					expect(folders[normalizedFolderWithNewColor.id].color).toStrictEqual(2);
				}
			});

			describe.each(['adding', 'removing'])('flags', (action) => {
				test.each`
					flag    | value
					${'#'}  | ${'the checked flag'}
					${'b'}  | ${'the free/busy flag'}
					${'#b'} | ${'multiple flags'}
				`(
					`${action} '$value' of a folder will update itself and the parent's tree structure`,
					(flag) => {
						const primaryAccount = getNormalizedPrimaryAccount();
						const folderToUpdate = generateSoapCustomChild({
							...primaryAccount,
							view: FOLDER_VIEW.appointment,
							f: action === 'adding' ? '' : flag
						});
						const normalizedFolderToUpdate = {
							...folderToUpdate,
							children: [],
							depth: 1,
							isLink: false,
							parent: folderToUpdate.l
						};
						const tree = {
							[primaryAccount.id]: {
								...primaryAccount,
								children: [normalizedFolderToUpdate] as UserFolder[]
							},
							[folderToUpdate.id]: normalizedFolderToUpdate as UserFolder
						};

						testUtils.setFolders(tree);
						testUtils.setCurrentView(FOLDER_VIEW.appointment);

						const data = {
							op: 'notify',
							notify: {
								modified: {
									folder: [
										{
											id: folderToUpdate.id,
											uuid: folderToUpdate.uuid,
											deletable: true,
											f: flag
										}
									]
								}
							}
						};

						handleMessage({
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-ignore
							data
						});

						const folders = testUtils.getFolders();

						if (normalizedFolderToUpdate.parent) {
							expect(folders[normalizedFolderToUpdate.parent].children[0].f).toStrictEqual(flag);
							expect(folders[normalizedFolderToUpdate.id].f).toStrictEqual(flag);
						}
					}
				);
			});
			test("removing one of the grants of the folder will keep the remaining ones in itself and in the parent's tree structure", () => {
				const primaryAccount = getNormalizedPrimaryAccount();
				const firstGrantMail = faker.internet.email();
				const firstGrant = {
					zid: faker.string.uuid(),
					gt: 'usr',
					perm: 'r',
					d: firstGrantMail
				};
				const secondGrantMail = faker.internet.email();
				const secondGrant = {
					zid: faker.string.uuid(),
					gt: 'usr',
					perm: 'r',
					d: secondGrantMail
				};
				const folderWithNewGrant = {
					...generateSoapCustomChild({
						...primaryAccount,
						view: FOLDER_VIEW.appointment
					}),
					acl: {
						grant: [firstGrant, secondGrant]
					}
				};
				const normalizedFolderWithNewGrant = {
					...folderWithNewGrant,
					children: [],
					depth: 1,
					isLink: false,
					parent: folderWithNewGrant.l
				};
				const tree = {
					[primaryAccount.id]: {
						...primaryAccount,
						children: [normalizedFolderWithNewGrant] as UserFolder[]
					},
					[folderWithNewGrant.id]: normalizedFolderWithNewGrant as UserFolder
				};

				testUtils.setFolders(tree);
				testUtils.setCurrentView(FOLDER_VIEW.appointment);

				const data = {
					op: 'notify',
					notify: {
						modified: {
							folder: [
								{
									id: folderWithNewGrant.id,
									uuid: folderWithNewGrant.uuid,
									deletable: true,
									acl: {
										grant: [firstGrant]
									}
								}
							]
						}
					}
				};

				handleMessage({
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					data
				});

				const folders = testUtils.getFolders();

				if (normalizedFolderWithNewGrant.parent) {
					const parent = folders[normalizedFolderWithNewGrant.parent];
					const folder = folders[normalizedFolderWithNewGrant.id];
					if (parent && parent.children[0] && parent.children[0].acl && folder.acl) {
						expect(parent.children[0].acl.grant).toStrictEqual([firstGrant]);
						expect(folder.acl.grant).toStrictEqual([firstGrant]);
					}
				}
			});
			test("removing the only grant of the folder will update itself and the parent's tree structure", () => {
				const primaryAccount = getNormalizedPrimaryAccount();
				const grantMail = faker.internet.email();
				const grant = {
					zid: faker.string.uuid(),
					gt: 'usr',
					perm: 'r',
					d: grantMail
				};

				const folderWithoutGrant = {
					...generateSoapCustomChild({
						...primaryAccount,
						view: FOLDER_VIEW.appointment
					}),
					acl: {
						grant: [grant]
					}
				};
				const normalizedFolderWithoutGrant = {
					...folderWithoutGrant,
					children: [],
					depth: 1,
					isLink: false,
					parent: folderWithoutGrant.l
				};
				const tree = {
					[primaryAccount.id]: {
						...primaryAccount,
						children: [normalizedFolderWithoutGrant] as UserFolder[]
					},
					[folderWithoutGrant.id]: normalizedFolderWithoutGrant as UserFolder
				};

				testUtils.setFolders(tree);
				testUtils.setCurrentView(FOLDER_VIEW.appointment);

				const data = {
					op: 'notify',
					notify: {
						modified: {
							folder: [
								{
									id: folderWithoutGrant.id,
									uuid: folderWithoutGrant.uuid,
									deletable: true,
									acl: {}
								}
							]
						}
					}
				};

				handleMessage({
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					data
				});

				const folders = testUtils.getFolders();

				if (normalizedFolderWithoutGrant.parent) {
					const parent = folders[normalizedFolderWithoutGrant.parent];
					const folder = folders[normalizedFolderWithoutGrant.id];
					if (parent && parent.children[0] && parent.children[0].acl && folder.acl) {
						expect(parent.children[0].acl).toStrictEqual({});
						expect(folder.acl).toStrictEqual({});
					}
				}
			});
		});
		describe('handle deleted', () => {
			test("When a folder is deleted it will not be available on the first level neither inside its parent's structure", () => {
				const primaryAccount = getNormalizedPrimaryAccount();
				const folderToDelete = generateSoapCustomChild({
					...primaryAccount,
					view: FOLDER_VIEW.appointment
				});
				const normalizedFolderToDelete = {
					...folderToDelete,
					children: [],
					depth: 1,
					isLink: false,
					parent: folderToDelete.l
				};
				const tree = {
					[primaryAccount.id]: {
						...primaryAccount,
						children: [normalizedFolderToDelete] as UserFolder[]
					},
					[folderToDelete.id]: normalizedFolderToDelete as UserFolder
				};

				testUtils.setFolders(tree);
				testUtils.setCurrentView(FOLDER_VIEW.appointment);

				const data = {
					op: 'notify',
					notify: {
						deleted: [folderToDelete.id]
					}
				};

				handleMessage({
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					data
				});

				const folders = testUtils.getFolders();

				expect(folders[folderToDelete.id]).toBeUndefined();
				expect(folders[primaryAccount.id].children).toHaveLength(0);
			});
			test("When a link is deleted it will not be available on the first level neither inside its parent's structure", () => {
				const primaryAccount = getNormalizedPrimaryAccount();
				const linkToDelete = generateSoapLink({
					...primaryAccount,
					view: FOLDER_VIEW.appointment
				});
				const normalizedLinkToDelete = getNormalizedCreatedLink(linkToDelete, primaryAccount.id);
				const tree = {
					[primaryAccount.id]: {
						...primaryAccount,
						children: [normalizedLinkToDelete] as LinkFolder[]
					},
					[linkToDelete.id]: normalizedLinkToDelete as LinkFolder
				};

				testUtils.setFolders(tree);
				testUtils.setCurrentView(FOLDER_VIEW.appointment);

				const data = {
					op: 'notify',
					notify: {
						deleted: [linkToDelete.id]
					}
				};

				handleMessage({
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					data
				});

				const folders = testUtils.getFolders();

				expect(folders[linkToDelete.id]).toBeUndefined();
				expect(folders[primaryAccount.id].children).toHaveLength(0);
			});
			test('When a link is deleted, the sharing account corresponding folder will not be deleted', () => {
				const primaryAccount = getNormalizedPrimaryAccount();
				const sharedAccount = getNormalizedSharedAccount();
				const linkToDelete = generateSoapLink({
					...primaryAccount,
					view: FOLDER_VIEW.message
				});
				const normalizedLinkToDelete = getNormalizedCreatedLink(linkToDelete, primaryAccount.id);
				const normalizedLinkNotToDelete = { ...normalizedLinkToDelete, id: faker.string.uuid() };
				const tree = {
					[primaryAccount.id]: {
						...primaryAccount,
						children: [normalizedLinkToDelete] as LinkFolder[]
					},
					[sharedAccount.id]: {
						...sharedAccount,
						children: [normalizedLinkNotToDelete] as LinkFolder[]
					},
					[linkToDelete.id]: normalizedLinkToDelete as LinkFolder,
					[normalizedLinkNotToDelete.id]: normalizedLinkNotToDelete as LinkFolder
				};

				testUtils.setFolders(tree);
				testUtils.setCurrentView(FOLDER_VIEW.message);

				const data = {
					op: 'notify',
					notify: {
						deleted: [linkToDelete.id]
					}
				};

				handleMessage({
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					data
				});

				const folders = testUtils.getFolders();

				expect(folders[normalizedLinkNotToDelete.id]).not.toBeUndefined();
				expect(folders[sharedAccount.id].children).toHaveLength(1);
			});
			test('when a different item is deleted, the folder structure stay the same', () => {
				const primaryAccount = getNormalizedPrimaryAccount();
				const folderToDelete = generateSoapCustomChild({
					...primaryAccount,
					view: FOLDER_VIEW.appointment
				});
				const normalizedFolderToDelete = {
					...folderToDelete,
					children: [],
					depth: 1,
					isLink: false,
					parent: folderToDelete.l
				};
				const tree = {
					[primaryAccount.id]: {
						...primaryAccount,
						children: [normalizedFolderToDelete] as UserFolder[]
					},
					[folderToDelete.id]: normalizedFolderToDelete as UserFolder
				};

				testUtils.setFolders(tree);
				testUtils.setCurrentView(FOLDER_VIEW.appointment);

				const data = {
					op: 'notify',
					notify: {
						deleted: ['2']
					}
				};

				handleMessage({
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					data
				});

				const folders = testUtils.getFolders();

				expect(folders[folderToDelete.id]).toBeDefined();
				expect(folders[primaryAccount.id].children).toHaveLength(1);
			});
		});
	});
});
