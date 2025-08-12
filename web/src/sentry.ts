import React from 'react';
import {
	createBrowserRouter,
	createRoutesFromChildren,
	matchRoutes,
	useLocation,
	useNavigationType
} from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { reactRouterV6BrowserTracingIntegration } from '@sentry/react';

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
		// Add React Router integration
		reactRouterV6BrowserTracingIntegration({
			useEffect: React.useEffect,
			useLocation,
			useNavigationType,
			createRoutesFromChildren,
			matchRoutes
		}),
		Sentry.browserTracingIntegration(),
		Sentry.replayIntegration(),
		Sentry.feedbackIntegration()
	],
	// Adjust sampling rates based on environment
	tracesSampleRate: __APP_ENV__ === 'production' ? 0.2 : 1.0,
	replaysSessionSampleRate: __APP_ENV__ === 'production' ? 0.1 : 0.3,
	replaysOnErrorSampleRate: 1.0,
	enableLogs: true,
	// Custom transaction naming for better organization
	beforeSendTransaction(event) {
		// You can customize transaction names here if needed
		// For example, clean up URLs with IDs to group similar transactions
		if (event.transaction) {
			// Example: Convert /projects/123 to /projects/:id
			event.transaction = event.transaction.replace(/\/([a-zA-Z]+)\/\d+/g, '/$1/:id');
		}
		return event;
	},
	// Configure fingerprinting to better group similar errors
	beforeSend(event) {
		// Group similar API errors together
		if (
			event.exception &&
			event.exception.values &&
			event.exception.values[0].type === 'ApiError'
		) {
			event.fingerprint = ['api-error', event.exception.values[0].value];
		}
		return event;
	}
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

// Export a feedback dialog function that can be used throughout the app
export function showFeedbackDialog(eventId: string) {
	Sentry.showReportDialog({
		eventId,
		title: 'We noticed something went wrong',
		subtitle: 'Our team has been notified.',
		subtitle2: 'If you would like to help, please tell us what happened below.',
		labelName: 'Name',
		labelEmail: 'Email',
		labelComments: 'What happened?',
		labelClose: 'Close',
		labelSubmit: 'Submit',
		successMessage: 'Thank you for your feedback!'
	});
}
