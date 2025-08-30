import { BrowserClient } from '@sentry/browser';
import * as Sentry from '@sentry/react';

// Error types to categorize different kinds of errors
export enum ErrorCategory {
	API = 'api',
	NETWORK = 'network',
	RENDER = 'render',
	RUNTIME = 'runtime',
	ASYNC = 'async',
	RESOURCE = 'resource',
	UNKNOWN = 'unknown'
}

// Error severities for more granular error tracking
export enum ErrorSeverity {
	FATAL = 'fatal',
	ERROR = 'error',
	WARNING = 'warning',
	INFO = 'info',
	DEBUG = 'debug'
}

// App state information to be captured with errors
interface AppState {
	lastAction?: string;
	currentRoute?: string;
	networkStatus?: 'online' | 'offline';
	memoryUsage?: number;
}

// Current application state - updated by various parts of the app
export const appState: AppState = {
	lastAction: undefined,
	currentRoute: window.location.pathname,
	networkStatus: navigator.onLine ? 'online' : 'offline',
	memoryUsage: undefined
};

// Generate or retrieve a persistent sessionId
function getSessionId() {
	let sessionId = localStorage.getItem('sessionId');
	if (!sessionId) {
		sessionId = crypto.randomUUID();
		localStorage.setItem('sessionId', sessionId);
	}
	return sessionId;
}

// Get browser and system info for better error context
function getSystemInfo() {
	const connection =
		navigator.connection ||
		(navigator as any).mozConnection ||
		(navigator as any).webkitConnection;
	return {
		userAgent: navigator.userAgent,
		language: navigator.language,
		platform: navigator.platform,
		screenSize: `${window.screen.width}x${window.screen.height}`,
		viewportSize: `${window.innerWidth}x${window.innerHeight}`,
		devicePixelRatio: window.devicePixelRatio,
		connection: connection
			? {
					type: connection.effectiveType,
					downlink: connection.downlink,
					rtt: connection.rtt,
					saveData: connection.saveData
				}
			: undefined
	};
}

// Configuration for different environments
const envConfigs = {
	development: {
		tracesSampleRate: 1.0,
		replaysSessionSampleRate: 0.3,
		replaysOnErrorSampleRate: 1.0,
		enableLogs: true
	},
	staging: {
		tracesSampleRate: 0.5,
		replaysSessionSampleRate: 0.2,
		replaysOnErrorSampleRate: 1.0,
		enableLogs: true
	},
	production: {
		tracesSampleRate: 0.2,
		replaysSessionSampleRate: 0.1,
		replaysOnErrorSampleRate: 1.0,
		enableLogs: false
	}
};

// Get config based on current environment
const getEnvConfig = () => {
	const env = __APP_ENV__ || 'development';
	return envConfigs[env] || envConfigs.development;
};

const isLocalhost = window.location.hostname === 'localhost';

// Initialize Sentry with enhanced configuration
Sentry.init({
	dsn: 'https://446b0afced9c231fc1a8153b19150fde@o4509808656973824.ingest.de.sentry.io/4509808659660880',
	release: __APP_VERSION__,
	environment: __APP_ENV__,
	enabled: !isLocalhost, // Disable Sentry on localhost for local development
	integrations: [
		// Add React Router integration
		// reactRouterV6BrowserTracingIntegration(),
		Sentry.browserTracingIntegration(),
		Sentry.replayIntegration({
			maskAllText: false,
			maskAllInputs: true,
			blockAllMedia: false
		}),
		Sentry.feedbackIntegration({ autoInject: false })
	],

	// Use environment-specific configuration
	...getEnvConfig(),

	// Custom transaction naming for better organization
	beforeSendTransaction(event) {
		// Clean up URLs with dynamic IDs to improve grouping
		if (event.transaction) {
			// Convert patterns like /projects/123 to /projects/:id
			event.transaction = event.transaction.replace(/\/([a-zA-Z-]+)\/\d+/g, '/$1/:id');
			// Convert patterns like /users/user@example.com to /users/:email
			event.transaction = event.transaction.replace(
				/\/([a-zA-Z-]+)\/[^\/]+@[^\/]+/g,
				'/$1/:email'
			);
		}
		return event;
	},

	// Configure fingerprinting and enhance error data before sending

	beforeSend(event, hint) {
		// Skip if the event is being explicitly dropped
		if (event.tags?.skipCapture === 'true') {
			return null;
		}

		try {
			// Add application state information
			event.extra = {
				...event.extra,
				appState: { ...appState },
				systemInfo: getSystemInfo(),
				navigationTiming: getNavigationTiming()
			};

			// Add memory usage if available
			if (performance && performance.memory) {
				event.extra.memory = {
					jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
					totalJSHeapSize: performance.memory.totalJSHeapSize,
					usedJSHeapSize: performance.memory.usedJSHeapSize
				};
			}

			// Improve error fingerprinting based on error types
			if (event.exception && event.exception.values && event.exception.values.length > 0) {
				const exceptionValue = event.exception.values[0];
				const errorType = exceptionValue.type || 'Error';
				const errorValue = exceptionValue.value || '';

				// Custom fingerprinting for different error categories
				if (
					errorValue.includes('Network Error') ||
					errorValue.includes('Failed to fetch')
				) {
					event.fingerprint = ['network-error', navigator.onLine ? 'online' : 'offline'];
					event.tags = { ...event.tags, errorCategory: ErrorCategory.NETWORK };
				} else if (errorType === 'ChunkLoadError') {
					event.fingerprint = ['chunk-load-error', event.request?.url || ''];
					event.tags = { ...event.tags, errorCategory: ErrorCategory.RESOURCE };
				} else if (errorType === 'ApiError') {
					// Group API errors by status code and endpoint pattern
					const api = event.extra?.api as
						| { endpoint?: string; statusCode?: number }
						| undefined;
					const endpoint = api?.endpoint || '';
					const statusCode = api?.statusCode || 0;
					const endpointPattern = endpoint
						.replace(/\/[a-zA-Z0-9-]+$/, '/:id')
						.replace(/\d+/g, ':id');
					event.fingerprint = ['api-error', endpointPattern, String(statusCode)];
					event.tags = { ...event.tags, errorCategory: ErrorCategory.API };
				}
			}

			return event;
		} catch (error) {
			// Ensure errors in the beforeSend don't block reporting the original error
			console.error('Error in Sentry beforeSend', error);
			return event;
		}
	}
});

// Get performance timing information for better error context
function getNavigationTiming() {
	if (!window.performance || !window.performance.getEntriesByType) {
		return {};
	}
	const entries = window.performance.getEntriesByType('navigation');
	if (!entries.length) {
		return {};
	}
	const timing = entries[0] as PerformanceNavigationTiming;
	const now = performance.now();

	return {
		dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
		tcpConnection: timing.connectEnd - timing.connectStart,
		requestStart: timing.requestStart,
		responseTime: timing.responseEnd - timing.responseStart,
		domInteractive: timing.domInteractive,
		domComplete: timing.domComplete,
		loadEvent: timing.loadEventEnd - timing.loadEventStart,
		totalPageLoad: timing.loadEventEnd,
		timeOnPage: now - timing.startTime
	};
}

// Set sessionId as a tag
Sentry.setTag('sessionId', getSessionId());

// Add additional context tags
Sentry.setTag('appVersion', __APP_VERSION__);
Sentry.setTag('buildTime', new Date().toISOString());

// Network status change monitoring
window.addEventListener('online', () => {
	appState.networkStatus = 'online';
	Sentry.addBreadcrumb({
		category: 'network',
		message: 'Network connection restored',
		level: 'info'
	});
});

window.addEventListener('offline', () => {
	appState.networkStatus = 'offline';
	Sentry.addBreadcrumb({
		category: 'network',
		message: 'Network connection lost',
		level: 'warning'
	});
});

// Enhanced global error listeners
window.addEventListener('error', (event) => {
	// Skip known third-party script errors
	const skipPatterns = [
		'Script error.', // Cross-origin errors
		'ResizeObserver loop limit exceeded' // Harmless browser warning
	];

	if (event.error && skipPatterns.some((pattern) => event.message.includes(pattern))) {
		return;
	}

	// Categorize resource load errors vs. runtime errors
	if (event.target && (event.target as HTMLElement).nodeName) {
		const target = event.target as HTMLElement;
		// Resource loading error (script, css, img, etc.)
		Sentry.captureException(event.error || event, {
			tags: {
				errorCategory: ErrorCategory.RESOURCE,
				resourceType: target.nodeName.toLowerCase(),
				resourceUrl:
					(target as HTMLScriptElement | HTMLImageElement).src ||
					(target as HTMLLinkElement).href ||
					'unknown'
			}
		});
	} else {
		// Runtime JavaScript error
		Sentry.captureException(event.error || event, {
			tags: {
				errorCategory: ErrorCategory.RUNTIME,
				errorCol: event.colno,
				errorLine: event.lineno,
				errorFile: event.filename
			}
		});
	}
});

// Enhanced unhandled promise rejection handling
window.addEventListener('unhandledrejection', (event) => {
	// Attempt to extract more information about the promise rejection
	let reason = event.reason;
	let stack = '';

	// Try to get a better stack trace if possible
	if (reason instanceof Error) {
		stack = reason.stack || '';
	} else {
		// For non-Error rejections, create a synthetic error
		try {
			// Convert to string to capture primitive values
			const reasonStr = String(reason);
			reason = new Error(`Unhandled Promise rejection: ${reasonStr}`);
			(reason as Error).name = 'UnhandledPromiseRejection';
		} catch (e) {
			// If stringification fails, use a generic error
			reason = new Error('Unhandled Promise rejection with unstringifiable reason');
			(reason as Error).name = 'UnhandledPromiseRejection';
		}
	}

	Sentry.captureException(reason, {
		tags: {
			errorCategory: ErrorCategory.ASYNC,
			promiseRejection: 'unhandled'
		},
		extra: {
			promiseRejectionReason:
				typeof event.reason === 'string' ? event.reason : 'Non-string reason',
			hasRejectionStack: !!stack
		}
	});
});

// Route change tracking for better context
export function trackRouteChange(routePath: string) {
	appState.currentRoute = routePath;
	Sentry.addBreadcrumb({
		category: 'navigation',
		message: `Navigated to: ${routePath}`,
		level: 'info'
	});
}

// Action tracking for better error context
export function trackAction(actionName: string, actionData?: any) {
	appState.lastAction = actionName;
	Sentry.addBreadcrumb({
		category: 'action',
		message: `Action: ${actionName}`,
		data: actionData,
		level: 'info'
	});
}

// Export a feedback dialog function that can be used throughout the app
export function showFeedbackDialog(eventId: string, options?: Partial<Sentry.ReportDialogOptions>) {
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
		successMessage: 'Thank you for your feedback!',
		...options
	});
}

// Function to check if Sentry is properly initialized
export function isSentryInitialized(): boolean {
	const client = Sentry.getClient();
	return client instanceof BrowserClient;
}

// Function to manually flush events - useful before page unloads
export function flushSentryEvents(): Promise<boolean> {
	return Sentry.flush();
}

export function openUserFeedback(): boolean {
	const hasApi = !!(Sentry as any).feedback?.open;
	console.log('[Sentry] feedback.open exists?', hasApi);
	if (hasApi) {
		(Sentry as any).feedback.open();
		return true;
	}

	const client = Sentry.getClient();
	const integration = client?.getIntegrationByName?.('Feedback') as any | undefined;
	console.log('[Sentry] getIntegrationByName("Feedback")', integration);
	if (integration?.open) {
		integration.open();
		return true;
	}

	// Optional fallback to legacy dialog while debugging:
	// const eventId = Sentry.captureMessage('User feedback (manual open)');
	// (Sentry as any).showReportDialog?.({ eventId });
	return false;
}

// Fallback: find the Feedback integration instance and call open()
const client = Sentry.getClient();
console.log('[Sentry] client', client);
console.log('[Sentry] integrations');
console.log('[Sentry] has feedback API', !!(Sentry as any).feedback?.open);

const feedbackIntegration = (client as any)?.getIntegrationByName?.('Feedback');
console.log('[Sentry] feedback integration', feedbackIntegration);
