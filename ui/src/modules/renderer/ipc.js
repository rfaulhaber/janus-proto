export const MIDDLE_CLICK = 'middle';
export const RIGHT_CLICK = 'right';

export function newClick(type, selection, action) {
	return {
		type,
		selection,
		action
	};
}
