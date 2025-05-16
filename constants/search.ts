/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export const SEARCH_QUERY_PREFIXES = {
	/*
	 * Specifies text that the message must contain. For example,
	 * content:bananas finds all items containing the word "bananas".
	 */
	content: 'content',

	/*
	 * Specifies a sender name or email address that is in the From header.
	 * This can be text, as in "John Smith III", an email address such as
	 * joe@acme.com, or a domain such as zimbra.com.
	 */
	from: 'from',

	/*
	 * Same as from: except that it specifies one of the people to whom the
	 * email was addressed in the To: header.
	 */
	to: 'to',

	/*
	 * Same as from: except that it specifies a recipient in the Cc: header
	 * of the message.
	 */
	cc: 'cc',

	/*
	 * Specifies text that must appear in the subject header of the message.
	 * An example might be subject:new vacation policy.
	 */
	subject: 'subject',

	/*
	 * Specifies a folder. For example, in:sent would show all items in your
	 * Sent folder.
	 */
	in: 'in',

	/*
	 * Specifies an attribute that the message must have. The types of object
	 * you can specify are "attachment", "phone", or "url". For example,
	 * has:attachment would find all messages which contain one or more
	 * attachments of any type.
	 */
	has: 'has',

	/*
	 * Specifies an attachment file name. For example, filename:query.txt
	 * would find messages with a file attachment named "query.txt".
	 */
	filename: 'filename',

	/*
	 * Specifies a search within attachments of a specified type. The types
	 * of attachment you can specify are "text", "word", "excel", and "pdf".
	 * For example, type:word "hello" finds messages with attachments that
	 * are Microsoft Word documents and searches within those attachments for
	 * the word "hello".
	 */
	type: 'type',

	/*
	 * Specifies any item with a certain type of attachment. For example,
	 * attachment:word would find all messages with a Word file attachment.
	 */
	attachment: 'attachment',

	/*
	 * Searches for messages with a certain status. Allowable values are
	 * "unread", "read", "flagged", "unflagged", "sent", "draft",
	 * "received", "replied", "unreplied", "forwarded", "unforwarded",
	 * "anywhere", "remote" (in a shared folder), "local", "sent". For
	 * example, is:unread will find all unread messages.
	 */
	is: 'is',

	/*
	 * Use this keyword to specify a date, using the format that is default
	 * for your browser's locale (for US English the format is mm/dd/yyyy).
	 * For example, date:2/1/2010 would find messages dated February 1,
	 * 2010. The greater than (>) or less than (<) symbols can be used
	 * instead of after or before. >= and <= are also allowed.
	 */
	date: 'date',

	/*
	 * Specifies mail sent after a certain date. For example, after:2/1/2010
	 * specify mail sent after February 1, 2010.
	 */
	after: 'after',

	/*
	 * Same as after: except specifies mail sent before the specified date.
	 */
	before: 'before',

	/*
	 * Specifies messages whose total size, including attachments, is a
	 * specified number of bytes, kilobytes, or megabytes. For example,
	 * size:12kb would find messages that are exactly 12K in size. The
	 * greater than (>) or less than (<) symbols can be used instead of
	 * bigger or smaller.
	 */
	size: 'size',

	/*
	 * Similar to size: except specifies greater than the specified size.
	 */
	larger: 'larger',

	/*
	 * Similar to size: except specifies smaller than the specified size.
	 */
	smaller: 'smaller',

	/*
	 * Finds email messages that do not have a reply to them yet.
	 */
	solo: 'solo',

	/*
	 * Finds messages which have been tagged with a specified tag. For
	 * example, tag:amber will find message that have a tag called "amber"
	 * applied.
	 */
	tag: 'tag',

	/*
	 * Finds messages, tasks or calendar items based on "high" "low"
	 * priority. For example, priority:high will find items with a priority
	 * setting of high.
	 */
	priority: 'priority'
};
