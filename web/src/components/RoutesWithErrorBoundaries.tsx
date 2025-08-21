import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Page } from './Page';
import { RouteErrorBoundary } from './ErrorBoundary';
import { Box, Spinner, Center } from '@chakra-ui/react';

// Suspense fallback for lazy-loaded routes
const SuspenseFallback = () => (
	<Center p={8} h="100%">
		<Spinner size="xl" color="yellow.500" thickness="4px" />
	</Center>
);

/**
 * Wraps a lazy-loaded component with Suspense and error handling
 */
const lazyWithErrorHandling = (
	importFn: () => Promise<{ default: any }>,
	componentName: string
) => {
	const LazyComponent = lazy(importFn);

	return (props: any) => (
		<RouteErrorBoundary routeName={componentName}>
			<Suspense fallback={<SuspenseFallback />}>
				<LazyComponent {...props} />
			</Suspense>
		</RouteErrorBoundary>
	);
};

// Import the existing route definitions
import { AuthenticatedRoutes } from '../AuthenticatedRoutes';

/**
 * Enhanced version of AuthenticatedRoutes with error boundaries
 */
export const RoutesWithErrorBoundaries: React.FC = () => {
	return (
		<RouteErrorBoundary routeName="root">
			<AuthenticatedRoutes />
		</RouteErrorBoundary>
	);
};
