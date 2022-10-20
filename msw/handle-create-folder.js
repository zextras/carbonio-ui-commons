const getResponse = (id) => ({
	Header: {
		context: {
			session: { id: '150973', _content: '150973' },
			change: { token: 15954 },
			notify: [
				{
					seq: 32,
					created: {
						folder: [
							{
								id,
								uuid: '70f277d0-76bf-4793-8b8a-6e7743516516',
								deletable: true,
								name: 'Ciccio',
								absFolderPath: '/Ciccio',
								l: '1',
								luuid: '675a66e9-cde4-434f-b853-236de184bae2',
								f: 'b',
								color: 3,
								view: 'appointment',
								rev: 15954,
								ms: 15954,
								webOfflineSyncDays: 0,
								activesyncdisabled: false,
								n: 0,
								s: 0,
								i4ms: 15954,
								i4next: 7573
							}
						]
					},
					modified: {
						folder: [{ id: '1', uuid: '675a66e9-cde4-434f-b853-236de184bae2', deletable: false }]
					}
				}
			],
			_jsns: 'urn:zimbra'
		}
	},
	Body: {
		CreateFolderResponse: {
			folder: [
				{
					id: '7572',
					uuid: '70f277d0-76bf-4793-8b8a-6e7743516516',
					deletable: true,
					name: 'ciccio',
					absFolderPath: '/ciccio',
					l: '1',
					luuid: '675a66e9-cde4-434f-b853-236de184bae2',
					f: 'b',
					color: 3,
					view: 'appointment',
					rev: 15954,
					ms: 15954,
					webOfflineSyncDays: 0,
					activesyncdisabled: false,
					n: 0,
					s: 0,
					i4ms: 15954,
					i4next: 7573
				}
			],
			_jsns: 'urn:zimbraMail'
		}
	},
	_jsns: 'urn:zimbraSoap'
});
export const handleCreateFolderRequest = (req, res, ctx) => {
	const resp = req.body.Body.CreateFolderRequest;
	const response = getResponse(resp.id);
	return res(ctx.json(response));
};
