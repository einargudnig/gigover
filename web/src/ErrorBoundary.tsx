import { Box, Button } from '@chakra-ui/react';
import { Component, ErrorInfo, ReactNode } from 'react';
import { devError } from './utils/ConsoleUtils';

interface Props {
	withPage?: boolean;
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
		const { children } = this.props;
		const { hasError, errorName, errorDetails, stack } = this.state;

		if (hasError) {
			return (
				<div
					style={{
						flex: 1,
						width: '100%',
						height: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<Box bg="white" borderRadius="base" p={4} boxShadow="base" maxWidth="60%">
						<h1>Sorry.. there was an error</h1>
						<Button
							padding={5}
							marginTop={4}
							marginBottom={5}
							onClick={() => window.location.assign('/')}
						>
							Try the homepage!
						</Button>
						<p>Error: {errorName}</p>
						<p>Details: {errorDetails}</p>
						<p>Stack: {stack}</p>
					</Box>
				</div>
			);
		}

		if (hasError) {
			return (
				<div>
					<h1>Sorry.. there was an error</h1>
					<Button
						padding={5}
						marginTop={4}
						marginBottom={5}
						onClick={() => window.location.assign('/')}
					>
						Try the homepage!
					</Button>
					<p>Error: {errorName}</p>
					<p>Details: {errorDetails}</p>
					<p>Stack: {stack}</p>
				</div>
			);
		}

		return children;
	}
}

export default ErrorBoundary;
