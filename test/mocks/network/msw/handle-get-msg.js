/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
const getResponse = (id) => ({
	Header: {
		context: {
			session: { id: '165483', _content: '165483' },
			change: { token: 15977 },
			_jsns: 'urn:zimbra'
		}
	},
	Body: {
		GetMsgResponse: {
			m: [
				{
					s: 37393,
					d: 1666160398000,
					l: '2',
					cid: '7579',
					rev: 15963,
					id: `${id}`,
					fr: "This Daily Digest includes 2 updates by 2 contributors Feel like you're missing out? Stay connected with the mobile app ( ...",
					e: [
						{ a: 'confluence@zextras.atlassian.net', d: 'Confluence', p: 'Confluence', t: 'f' },
						{ a: 'confluence@zextras.atlassian.net', d: 'Confluence', p: 'Confluence', t: 'r' },
						{ a: 'luca.stauble@zextras.com', d: 'luca', p: 'luca stauble', t: 't' }
					],
					su: '[Confluence] Daily Digest',
					mid: '\u003C280337d8-9219-462b-94e1-9501fa19b6ff@zextras.atlassian.net\u003E',
					sd: 1666160394000,
					mp: [
						{
							part: 'TEXT',
							ct: 'multipart/alternative',
							mp: [
								{ part: '1', ct: 'text/plain', s: 1205 },
								{
									part: '2',
									ct: 'text/html',
									s: 33349,
									body: true,
									content:
										'\u003Chtml xmlns="http://www.w3.org/1999/xhtml"\u003E\u003Chead\u003E\u003Ctitle\u003E\u003C/title\u003E\u003Cstyle\u003E/*\u003C![CDATA[*/*#outlook a {\n\tpadding: 0;\n}\nbody {\n\tmargin: 0;\n\tpadding: 0;\n}\n* {\n}\ntable, td {\n\tborder-collapse: collapse;\n}\nimg {\n\tborder: 0;\n\theight: auto;\n\tline-height: 100.0%;\n\toutline: none;\n\ttext-decoration: none;\n}\n* {\n}\np {\n\tdisplay: block;\n\tmargin: 13.0px 0;\n}\n/*]]\u003E*/\u003C/style\u003E\u003Cstyle\u003E/*\u003C![CDATA[*//* *//*]]\u003E*/\u003C/style\u003E\u003Cstyle\u003E/*\u003C![CDATA[*//* *//*]]\u003E*/\u003C/style\u003E\u003Cstyle\u003E/*\u003C![CDATA[*/*.moz-text-html *.mj-column-per-100 {\n\twidth: 100.0%;\n\tmax-width: 100.0%;\n}\n*.moz-text-html *.mj-column-per-20 {\n\twidth: 20.0%;\n\tmax-width: 20.0%;\n}\n*.moz-text-html *.mj-column-per-80 {\n\twidth: 80.0%;\n\tmax-width: 80.0%;\n}\n*.moz-text-html *.mj-column-per-50 {\n\twidth: 50.0%;\n\tmax-width: 50.0%;\n}\n/*]]\u003E*/\u003C/style\u003E\u003Cstyle\u003E/*\u003C![CDATA[*//* *//*]]\u003E*/\u003C/style\u003E\u003Cstyle\u003E/*\u003C![CDATA[*/*.text-normal div, *.text-small div {\n\tfont-family: Helvetica;\n\tcolor: rgb(23,43,77);\n\tfont-size: 16.0px;\n\tline-height: 23.0px;\n}\n*.text-title div {\n\tfont-weight: bold;\n\tfont-size: 16.0px;\n}\n*.text-small div {\n\tfont-size: 14.0px;\n}\n*.text-lightGray div {\n\tcolor: rgb(101,119,144);\n}\n*.img-headerConfLogo img {\n\twidth: 100.0%;\n\theight: auto;\n}\n*.email-header {\n\tpadding: 10.0px 0;\n\tmargin-bottom: 10.0px;\n}\n*.digest-page-update-count {\n\tmargin: 5.0px 0 20.0px;\n}\n*.digest-body {\n\tborder: 2.0px solid rgb(238,238,238);\n\tpadding: 20.0px;\n}\n*.digest-header-welcome div {\n\tfont-weight: 500;\n\tfont-size: 18.0px;\n\tpadding: 0;\n}\n*.announcementPost div {\n\tpadding-top: 12.0px;\n\tfont-size: 14.0px;\n}\n*.digest-contributor-list div {\n\tfont-size: 14.0px;\n\tcolor: rgb(101,119,144);\n}\n*.footer-app-badge-wrapper {\n\tpadding: 3.0px;\n\tdisplay: inline;\n}\n*.footer-app-badge {\n\theight: 30.0px;\n}\n*.footer-app-badge img {\n\twidth: auto;\n}\n*.footer-manage {\n\tmargin: 5.0px 0 15.0px;\n}\n*.footer-sent-by {\n\tborder-top: 1.0px solid rgb(238,238,238);\n\tmargin-top: 30.0px;\n\tpadding-top: 10.0px;\n}\n*.footer-sent-by-text div {\n\tfont-size: 13.0px;\n\tcolor: rgb(101,119,144);\n}\n*.hide-always {\n\tdisplay: none;\n}\n/*]]\u003E*/\u003C/style\u003E\u003C/head\u003E\u003Cbody style="word-spacing:normal"\u003E\u003Cdiv\u003E\u003Cdiv class="email-description hide-always" style="margin:0px auto;max-width:600px"\u003E\u003Ctable align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="direction:ltr;font-size:0px;padding:0px;text-align:center"\u003E\u003Cdiv style="margin:0px auto;max-width:600px"\u003E\u003Ctable align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="direction:ltr;font-size:0px;padding:0px;text-align:center"\u003E\u003Cdiv class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" width="100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="vertical-align:top;padding:0px"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" width="100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd align="left" class="th-emailDescription" style="font-size:0px;padding:0px"\u003E\u003Cdiv style="font-family:&#39;ubuntu&#39; , &#39;helvetica&#39; , &#39;arial&#39; , sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000"\u003EThis Daily Digest includes 2 updates by 2 contributors\u003C/div\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003Cdiv class="show-on-mobile" style="margin:0px auto;max-width:600px"\u003E\u003Ctable align="center" border="0" cellpadding="0" cellspacing="0" style="display:none;width:100%" width="100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="direction:ltr;font-size:0px;padding:0px;text-align:center"\u003E\u003Cdiv class="email-header" style="margin:0px auto;max-width:600px"\u003E\u003Ctable align="center" border="0" cellpadding="0" cellspacing="0" style="display:none;width:100%" width="100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="direction:ltr;font-size:0px;padding:0px;text-align:center"\u003E\u003Cdiv class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0;line-height:0;text-align:left;display:inline-block;width:100%;direction:ltr"\u003E\u003Cdiv class="mj-column-per-20 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:20%"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" width="100%" style="display:none"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="vertical-align:top;padding:0px"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" style="display:none" width="100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd align="center" class="img-headerConfLogo" style="font-size:0px;padding:0px"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" style="display:none;border-collapse:collapse;border-spacing:0px"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="width:45px"\u003E\u003Cimg alt="Confluence logo" height="auto" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px" width="45" dfsrc="https://cc-notifications-public.us-west-2.dev.public.atl-paas.net/confluence_logo_header.png" /\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003Cdiv class="mj-column-per-80 mj-outlook-group-fix email-header-callout" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:80%"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" width="100%" style="display:none"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="vertical-align:middle;padding:0px"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" style="display:none" width="100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd align="left" class="th-headerAppStoreLink th-mobileHeader text-normal" style="color:#1b2f50;font-size:0px;padding:0px;font-weight:500"\u003E\u003Cdiv style="font-family:&#39;ubuntu&#39; , &#39;helvetica&#39; , &#39;arial&#39; , sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000"\u003EFeel like you&#39;re missing out? Stay connected with the \u003Ca href="https://atlassian.app.link/Confluencemobileformatted" target="_blank" rel="nofollow noopener noreferrer"\u003Emobile app\u003C/a\u003E.\u003C/div\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003C/div\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003Cdiv style="margin:0px auto;max-width:600px"\u003E\u003Ctable align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="direction:ltr;font-size:0px;padding:0px;text-align:center"\u003E\u003Cdiv style="margin:0px auto;max-width:600px"\u003E\u003Ctable align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="border:none;direction:ltr;font-size:0px;padding:20px 0;text-align:center"\u003E\u003Cdiv class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" width="100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="vertical-align:top;padding:0px"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" width="100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd align="center" class="th-takeControlOfInbox text-normal" style="color:#1b2f50;font-size:0px;padding:0px;font-weight:500"\u003E\u003Cdiv style="font-family:&#39;ubuntu&#39; , &#39;helvetica&#39; , &#39;arial&#39; , sans-serif;font-size:13px;line-height:1;text-align:center;color:#000000"\u003ETake control of your inbox! Manage your \u003Ca href="https://zextras.atlassian.net/wiki/users/viewmyemailsettings.action" target="_blank" rel="nofollow noopener noreferrer"\u003Eemail settings\u003C/a\u003E.\u003C/div\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003Cdiv class="digest-body" style="margin:0px auto;max-width:600px"\u003E\u003Ctable align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="direction:ltr;font-size:0px;padding:0px;padding-bottom:0;padding-top:0;text-align:center"\u003E\u003Cdiv style="margin:0px auto;max-width:600px"\u003E\u003Ctable align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="direction:ltr;font-size:0px;padding:0px;padding-bottom:0;text-align:center"\u003E\u003Cdiv class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" width="100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="vertical-align:top;padding:0px"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" width="100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd align="center" class="text-normal th-welcomeHeader digest-header-welcome" style="color:#1b2f50;font-size:0px;padding:0px;font-weight:500"\u003E\u003Cdiv style="font-family:&#39;ubuntu&#39; , &#39;helvetica&#39; , &#39;arial&#39; , sans-serif;font-size:13px;line-height:1;text-align:center;color:#000000"\u003EWelcome to Confluence Daily Digest!\u003C/div\u003E\u003C/td\u003E\u003C/tr\u003E\u003Ctr\u003E\u003Ctd align="center" class="text-normal th-announcementPost announcementPost" style="color:#1b2f50;font-size:0px;padding:0px;font-weight:500"\u003E\u003Cdiv style="font-family:&#39;ubuntu&#39; , &#39;helvetica&#39; , &#39;arial&#39; , sans-serif;font-size:13px;line-height:1;text-align:center;color:#000000"\u003E\u003Ca href="https://community.atlassian.com/t5/Confluence-articles/Introducing-the-Confluence-Daily-Digest/ba-p/2042487#U2064573" target="_blank" rel="nofollow noopener noreferrer"\u003ELearn more\u003C/a\u003E about the Daily Digest\u003C/div\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003Cdiv style="margin:0px auto;max-width:600px"\u003E\u003Ctable align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="direction:ltr;font-size:0px;padding:20px 0;text-align:center"\u003E\u003Cdiv class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" width="100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="vertical-align:top;padding:0px"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" width="100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd align="center" style="font-size:0px;padding:0px;padding-top:0;padding-bottom:0"\u003E\u003Cp style="border-top:solid 2px #eeeeee;font-size:1px;margin:0px auto;width:100%"\u003E\u003C/p\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003Cdiv class="digest-page-update-count" style="margin:0px auto;max-width:600px"\u003E\u003Ctable align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="direction:ltr;font-size:0px;padding:0px;padding-bottom:0;padding-top:0;text-align:center"\u003E\u003Cdiv class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" width="100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="vertical-align:top;padding:0px"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" width="100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd align="left" class="text-normal th-totalUpdates" style="color:#1b2f50;font-size:0px;padding:0px;font-weight:500"\u003E\u003Cdiv style="font-family:&#39;ubuntu&#39; , &#39;helvetica&#39; , &#39;arial&#39; , sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000"\u003E\u003Cb\u003E2 pages\u003C/b\u003E updated \u003Cb\u003Eon Tuesday, October 18, 2022\u003C/b\u003E.\u003C/div\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003Cdiv class="th-loopUpdateRows" style="margin:0px auto;max-width:600px"\u003E\u003Ctable align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="direction:ltr;font-size:0px;padding:5px 0;text-align:center"\u003E\u003Cdiv class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" width="100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="vertical-align:top;padding:0px"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" width="100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd align="left" class="th-updateRowTitle th-updateRowContentLink text-normal text-title" style="color:#1b2f50;font-size:0px;padding:0px;font-weight:500"\u003E\u003Cdiv style="font-family:&#39;ubuntu&#39; , &#39;helvetica&#39; , &#39;arial&#39; , sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000"\u003E\u003Ca rel="noopener nofollow noopener noreferrer" href="https://zextras.atlassian.net/wiki/spaces/PR/pages/2545745921/Carbonio&#43;-&#43;22.10.0?atlOrigin&#61;eyJpIjoiYzYyODFlZjgtN2I5My00OWZhLWEzMTAtNzc4MjYyM2IxMjM5IiwicCI6ImMifQ" style="color:#0e5ccf" target="_blank"\u003ECarbonio - 22.10.0\u003C/a\u003E\u003C/div\u003E\u003C/td\u003E\u003C/tr\u003E\u003Ctr\u003E\u003Ctd align="left" class="th-updateRowContributors text-normal digest-contributor-list" style="color:#1b2f50;font-size:0px;padding:0px;padding-bottom:0;font-weight:500"\u003E\u003Cdiv style="font-family:&#39;ubuntu&#39; , &#39;helvetica&#39; , &#39;arial&#39; , sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000"\u003EMatteo Iacono made 1 update\u003C/div\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003Cdiv class="th-loopUpdateRows" style="margin:0px auto;max-width:600px"\u003E\u003Ctable align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="direction:ltr;font-size:0px;padding:5px 0;text-align:center"\u003E\u003Cdiv class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" width="100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="vertical-align:top;padding:0px"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" width="100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd align="left" class="th-updateRowTitle th-updateRowContentLink text-normal text-title" style="color:#1b2f50;font-size:0px;padding:0px;font-weight:500"\u003E\u003Cdiv style="font-family:&#39;ubuntu&#39; , &#39;helvetica&#39; , &#39;arial&#39; , sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000"\u003E\u003Ca rel="noopener nofollow noopener noreferrer" href="https://zextras.atlassian.net/wiki/spaces/~905870936/pages/2697330733/Values&#43;Project?atlOrigin&#61;eyJpIjoiYzYyODFlZjgtN2I5My00OWZhLWEzMTAtNzc4MjYyM2IxMjM5IiwicCI6ImMifQ" style="color:#0e5ccf" target="_blank"\u003EValues Project\u003C/a\u003E\u003C/div\u003E\u003C/td\u003E\u003C/tr\u003E\u003Ctr\u003E\u003Ctd align="left" class="th-updateRowContributors text-normal digest-contributor-list" style="color:#1b2f50;font-size:0px;padding:0px;padding-bottom:0;font-weight:500"\u003E\u003Cdiv style="font-family:&#39;ubuntu&#39; , &#39;helvetica&#39; , &#39;arial&#39; , sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000"\u003EFederico Rispo made 1 update\u003C/div\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003Cdiv style="margin:0px auto;max-width:600px"\u003E\u003Ctable align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="direction:ltr;font-size:0px;padding:0px;text-align:center"\u003E\u003Cdiv class="footer-app-badges show-on-mobile-footer" style="margin:0px auto;max-width:600px"\u003E\u003Ctable align="center" border="0" cellpadding="0" cellspacing="0" style="display:none;width:100%" width="100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="direction:ltr;font-size:0px;padding:0px;text-align:center"\u003E\u003Cdiv class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0;line-height:0;text-align:left;display:inline-block;width:100%;direction:ltr"\u003E\u003Cdiv class="mj-column-per-50 mj-outlook-group-fix footer-app-badge-wrapper" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:50%"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" width="100%" style="display:none"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="vertical-align:top;padding:0px"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" style="display:none" width="100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd align="center" style="font-size:0px;padding:0px"\u003E\u003Ctable align="center" border="0" cellpadding="0" cellspacing="0" style="float:none;display:inline-table"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="padding:3px;vertical-align:middle"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" style="display:none;border-radius:3px;width:110px" width="110"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="font-size:0;height:40px;vertical-align:middle;width:110px"\u003E\u003Ca href="https://atlassian.app.link/e/MobileEmailBadges" rel="noopener nofollow noopener noreferrer" target="_blank"\u003E\u003Cimg alt="App Store badge" height="40" style="border-radius:3px;display:block" width="110" dfsrc="https://cc-notifications-public.us-west-2.dev.public.atl-paas.net/app_store_badge_footer.png" /\u003E\u003C/a\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003Cdiv class="mj-column-per-50 mj-outlook-group-fix footer-app-badge-wrapper" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:50%"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" width="100%" style="display:none"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="vertical-align:top;padding:0px"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" style="display:none" width="100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd align="center" style="font-size:0px;padding:0px"\u003E\u003Ctable align="center" border="0" cellpadding="0" cellspacing="0" style="float:none;display:inline-table"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="padding:3px;vertical-align:middle"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" style="display:none;border-radius:3px;width:120px" width="120"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="font-size:0;height:40px;vertical-align:middle;width:120px"\u003E\u003Ca href="https://atlassian.app.link/e/MobileEmailBadges" rel="noopener nofollow noopener noreferrer" target="_blank"\u003E\u003Cimg alt="Google Play badge" height="40" style="border-radius:3px;display:block" width="120" dfsrc="https://cc-notifications-public.us-west-2.dev.public.atl-paas.net/google_play_badge_footer.png" /\u003E\u003C/a\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003C/div\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003Cdiv style="margin:0px auto;max-width:600px"\u003E\u003Ctable align="center" border="0" cellpadding="0" cellspacing="0" style="width:100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="direction:ltr;font-size:0px;padding:0px;text-align:center"\u003E\u003Cdiv class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" width="100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="vertical-align:top;padding:0px;padding-top:10px"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" width="100%"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd align="center" style="font-size:0px;padding:0px"\u003E\u003Ctable border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px"\u003E\u003Ctbody\u003E\u003Ctr\u003E\u003Ctd style="width:110px"\u003E\u003Ca href="https://www.atlassian.com/software/confluence" rel="noopener nofollow noopener noreferrer" target="_blank"\u003E\u003Cimg alt="Confluence Icon" height="auto" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px" width="110" dfsrc="https://cc-notifications-public.us-west-2.dev.public.atl-paas.net/confluence_logo_footer.png" /\u003E\u003C/a\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003C/td\u003E\u003C/tr\u003E\u003C/tbody\u003E\u003C/table\u003E\u003C/div\u003E\u003C/div\u003E\r\n\u003Cimg border="0" width="1" height="1" alt="" dfsrc="http://atlassian.et.e.sparkpost.com/q/74yQ-0tc7p8GolF5LZ_7zw~~/AAAAAQA~/RgRlMhwKPlcLYXRsYXNzaWFudXNCCmNOCpdPY_oXj0hSGGx1Y2Euc3RhdWJsZUB6ZXh0cmFzLmNvbVgEAAAAAA~~" /\u003E\r\n\u003C/body\u003E\u003C/html\u003E'
								}
							]
						}
					]
				}
			],
			_jsns: 'urn:zimbraMail'
		}
	},
	_jsns: 'urn:zimbraSoap'
});
export const handleGetMsgRequest = (req, res, ctx) => {
	const { id } = req.body.Body.GetMsgRequest.m;
	const response = getResponse(id);
	return res(ctx.json(response));
};
