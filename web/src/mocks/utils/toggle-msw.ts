// Local storage key to track MSW state
const MSW_ENABLED_KEY = 'msw-enabled';

// Enable MSW and store preference
export function enableMsw(): void {
	localStorage.setItem(MSW_ENABLED_KEY, 'true');
	window.location.reload();
}

// Disable MSW and store preference
export function disableMsw(): void {
	localStorage.setItem(MSW_ENABLED_KEY, 'false');
	window.location.reload();
}

// Check if MSW should be enabled
export function isMswEnabled(): boolean {
	return localStorage.getItem(MSW_ENABLED_KEY) !== 'false';
}
