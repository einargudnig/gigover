import * as Sentry from '@sentry/react';

// Generate or retrieve a persistent sessionId
function getSessionId() {
	let sessionId = localStorage.getItem('sessionId');
	if (!sessionId) {
		sessionId = crypto.randomUUID();
		localStorage.setItem('sessionId', sessionId);
	}
	return sessionId;
}

Sentry.init({
	dsn: 'https://446b0afced9c231fc1a8153b19150fde@o4509808656973824.ingest.de.sentry.io/4509808659660880', // <-- Replace with your DSN
	release: __APP_VERSION__,
	environment: __APP_ENV__,
	integrations: [
		Sentry.browserTracingIntegration(),
		Sentry.replayIntegration(),
		Sentry.feedbackIntegration()
	],
	tracesSampleRate: 1.0,
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1.0,
	enableLogs: true
});

// Set sessionId as a tag
Sentry.setTag('sessionId', getSessionId());

// Add global error listeners
window.addEventListener('error', (event) => {
	Sentry.captureException(event.error || event);
});
window.addEventListener('unhandledrejection', (event) => {
	Sentry.captureException(event.reason || event);
});
