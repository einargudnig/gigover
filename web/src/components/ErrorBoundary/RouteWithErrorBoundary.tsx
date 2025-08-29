import React from 'react';
import { Route, RouteProps } from 'react-router-dom';
import RouteErrorBoundary from './RouteErrorBoundary';

type RouteWithErrorBoundaryProps = RouteProps & {
	routeName?: string;
};

/**
 * A Route component that automatically wraps its content in an error boundary
 */
const RouteWithErrorBoundary: React.FC<RouteWithErrorBoundaryProps> = (props) => {
	if ('element' in props) {
		return (
			<Route
				{...props}
				element={
					<RouteErrorBoundary routeName={props.routeName}>
						{props.element}
					</RouteErrorBoundary>
				}
			/>
		);
	}
	return <Route {...props} />;
};

export default RouteWithErrorBoundary;
