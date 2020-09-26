export const useRefocusWindow = () => {
	return () => {
		const e = document.createEvent('Event');
		e.initEvent('focus', true, true);
		window.dispatchEvent(e);
		window.focus();
	};
};
