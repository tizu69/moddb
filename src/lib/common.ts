import { toast } from 'svelte-sonner';
import markdownit from 'markdown-it';
import xss from 'xss';
import { get } from 'svelte/store';
import { userConfigStore } from './stores';

const md = markdownit({
	html: true,
	xhtmlOut: false,
	breaks: false,
	langPrefix: 'hljs-',
	linkify: true,
	typographer: true,
	quotes: '“”‘’',
	highlight: function (/*str, lang*/) {
		return '';
	}
});

export const convertToArray = <T>(value: T | T[]): T[] => {
	if (Array.isArray(value)) return value;
	else return [value];
};

export const handleError = (error: unknown) => {
	toast.error('' + error, {
		duration: 10 * 1000,
		dismissable: true
	});
	console.error(error);
};

export const moveItem = <T>(data: T[], from: number, to: number): T[] => {
	const f = data.splice(from, 1)[0];
	data.splice(to, 0, f);
	return data;
};

export const sanitize = (str: string): string => {
	return xss(str, {
		onIgnoreTag: (tag, html, { isClosing }) => {
			const less = get(userConfigStore).lessSanitize;

			if (tag == 'iframe' && less) return html;

			return isClosing
				? `<span class="text-sm text-muted-foreground">[blocked ${tag} - enable in settings]</span>`
				: '';
		}
	});
};

export const markdownInline = (str: string): string => {
	return md.renderInline(sanitize(str));
};

export const markdown = (str: string): string => {
	return md.render(sanitize(str));
};
