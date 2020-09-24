import { useEffect, useRef } from 'react';

export const useEventListener = <K extends keyof WindowEventMap, E extends WindowEventMap[K]>(
	eventName: K,
	handler: (event: E) => void,
	element: Window | HTMLElement | null = window
) => {
	const handlerRef = useRef(handler);

	if (!element) {
		throw new Error('Could not useEventListener on null element.');
	}

	/*
	 *  Make sure that the handler function contains the correct call stack values
	 */
	useEffect(() => {
		handlerRef.current = handler;
	}, [handler]);

	useEffect(() => {
		const listener = (event: E) => handlerRef.current(event);
		element.addEventListener(eventName, listener as EventListener);
		return () => {
			element.removeEventListener(eventName, listener as EventListener);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
};
