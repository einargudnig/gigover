import React, { Component, ErrorInfo, ReactNode } from 'react';
import { devError } from './utils/ConsoleUtils';

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
	errorName: string;
	errorDetails: string;
	stack: string;
}

class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		errorName: '',
		errorDetails: '',
		stack: ''
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public static getDerivedStateFromError(_: Error): State {
		// Update state so the next render will show the fallback UI.
		return {
			hasError: true,
			errorName: _.name,
			errorDetails: _.message,
			stack: _.stack?.toString() || ''
		};
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		devError('Uncaught error:', error, errorInfo);
	}

	public render() {
		const { hasError, errorName, errorDetails, stack } = this.state;

		if (hasError) {
			return (
				<>
					<h1>Sorry.. there was an error</h1>
					<p>Error: {errorName}</p>
					<p>Details: {errorDetails}</p>
					<p>Stack: {stack}</p>
				</>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
