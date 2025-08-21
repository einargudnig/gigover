import React from 'react';
import { Route, RouteProps } from 'react-router-dom';
import RouteErrorBoundary from './RouteErrorBoundary';

interface RouteWithErrorBoundaryProps extends RouteProps {
	routeName?: string;
}

/**
 * A Route component that automatically wraps its content in an error boundary
 */
const RouteWithErrorBoundary: React.FC<RouteWithErrorBoundaryProps> = ({
	routeName,
	element,
	...restProps
}) => {
	return (
		<Route
			{...restProps}
			element={<RouteErrorBoundary routeName={routeName}>{element}</RouteErrorBoundary>}
		/>
	);
};

export default RouteWithErrorBoundary;
